import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { initializePaystackTransaction } from "@/lib/paystack";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function calculateNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const diff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diff > 0 ? diff : null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isRecord(body)) {
    return badRequest("Invalid request body.");
  }

  const roomId = body.roomId;
  const guestName = body.guestName;
  const guestEmail = body.guestEmail;
  const guestPhone = body.guestPhone;
  const checkInDate = body.checkInDate;
  const checkOutDate = body.checkOutDate;
  const guestCount = Number(body.guestCount);
  const roomCount = Number(body.roomCount ?? 1);

  if (
    typeof roomId !== "string" ||
    typeof guestName !== "string" ||
    typeof guestEmail !== "string" ||
    typeof guestPhone !== "string" ||
    typeof checkInDate !== "string" ||
    typeof checkOutDate !== "string" ||
    !guestCount ||
    !roomCount
  ) {
    return badRequest("Missing or invalid booking fields.");
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (!nights) {
    return badRequest("Check-out date must be after check-in date.");
  }

  const roomResult = await query(
    `select id, slug, name, price_per_night, is_active, availability_status
     from rooms
     where id::text = $1 or slug = $1
     limit 1`,
    [roomId],
  );

  if (roomResult.rowCount === 0) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  const room = roomResult.rows[0] as {
    id: string;
    slug: string;
    name: string;
    price_per_night: string | number;
    is_active: boolean;
    availability_status: string;
  };

  if (!room.is_active || room.availability_status !== "available") {
    return NextResponse.json(
      { error: "This room is currently unavailable." },
      { status: 409 },
    );
  }

  const conflict = await query(
    `select id
     from bookings
     where room_id = $1
       and booking_status = 'confirmed'
       and check_in_date < $3::date
       and check_out_date > $2::date
     limit 1`,
    [room.id, checkInDate, checkOutDate],
  );

  if ((conflict.rowCount ?? 0) > 0) {
    return NextResponse.json(
      { error: "This room is already booked for the dates you selected." },
      { status: 409 },
    );
  }

  const totalAmount = Number(room.price_per_night) * nights * roomCount;
  const bookingCode = `TSL-${randomUUID().split("-")[0].toUpperCase()}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const bookingResult = await query(
    `insert into bookings (
      booking_code, room_id, guest_name, guest_email, guest_phone,
      check_in_date, check_out_date, guest_count, room_count, special_requests,
      total_amount, currency, booking_status, payment_status, paystack_reference
    ) values (
      $1, $2, $3, $4, $5,
      $6::date, $7::date, $8, $9, $10,
      $11, $12, $13, $14, $15
    ) returning *`,
    [
      bookingCode,
      room.id,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestCount,
      roomCount,
      typeof body.specialRequests === "string" ? body.specialRequests : null,
      totalAmount,
      typeof body.currency === "string" ? body.currency : "GHS",
      "pending",
      "pending",
      bookingCode,
    ],
  );

  try {
    const paystackResponse = await initializePaystackTransaction({
      amount: Math.round(totalAmount * 100),
      callback_url: `${siteUrl}/checkout/${room.id}`,
      email: guestEmail,
      metadata: {
        custom_fields: [
          { display_name: "Booking Code", variable_name: "booking_code", value: bookingCode },
          { display_name: "Room", variable_name: "room_name", value: room.name },
          { display_name: "Room ID", variable_name: "room_id", value: room.id },
          { display_name: "Check-in", variable_name: "check_in", value: checkInDate },
          { display_name: "Check-out", variable_name: "check_out", value: checkOutDate },
        ],
      },
      reference: bookingCode,
    });

    return NextResponse.json({
      accessCode: paystackResponse.data.access_code,
      bookingCode,
      bookingId: (bookingResult.rows[0] as { id: string }).id,
      reference: paystackResponse.data.reference,
    });
  } catch {
    await query(
      `update bookings
       set booking_status = 'cancelled', payment_status = 'failed'
       where booking_code = $1`,
      [bookingCode],
    );

    return NextResponse.json(
      { error: "Unable to initialize Paystack checkout." },
      { status: 502 },
    );
  }
}
