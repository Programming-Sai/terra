import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { serializeBooking, type BookingDbRow } from "@/lib/db-serializers";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDate(value: unknown) {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateNights(checkIn: string, checkOut: string) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);

  if (!start || !end) return null;

  const diff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diff > 0 ? diff : null;
}

export async function GET() {
  const result = await query(
    `select * from bookings order by created_at desc`,
  );

  return NextResponse.json(result.rows.map((row) => serializeBooking(row as BookingDbRow)));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isRecord(body)) {
    return badRequest("Invalid request body.");
  }

  const roomId = body.room_id;
  const guestName = body.guest_name;
  const guestEmail = body.guest_email;
  const guestPhone = body.guest_phone;
  const checkInDate = body.check_in_date;
  const checkOutDate = body.check_out_date;
  const guestCount = Number(body.guest_count);
  const roomCount = Number(body.room_count ?? 1);

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
    `select id, price_per_night, is_active, availability_status
     from rooms
     where id = $1`,
    [roomId],
  );

  if (roomResult.rowCount === 0) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  const room = roomResult.rows[0] as {
    id: string;
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
    [roomId, checkInDate, checkOutDate],
  );

  if ((conflict.rowCount ?? 0) > 0) {
    return NextResponse.json(
      { error: "This room is already booked for the dates you selected." },
      { status: 409 },
    );
  }

  const totalAmount = Number(room.price_per_night) * nights * roomCount;
  const bookingCode = `TL-${randomUUID().split("-")[0].toUpperCase()}`;

  const result = await query(
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
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestCount,
      roomCount,
      typeof body.special_requests === "string" ? body.special_requests : null,
      totalAmount,
      typeof body.currency === "string" ? body.currency : "GHS",
      "pending",
      "pending",
      typeof body.paystack_reference === "string"
        ? body.paystack_reference
        : null,
    ],
  );

  return NextResponse.json(
    serializeBooking(result.rows[0] as BookingDbRow),
    { status: 201 },
  );
}
