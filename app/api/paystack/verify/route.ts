import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { serializeBooking, type BookingDbRow } from "@/lib/db-serializers";
import { verifyPaystackTransaction } from "@/lib/paystack";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  const paystackResponse = await verifyPaystackTransaction(reference);

  if (!paystackResponse.status || paystackResponse.data.status !== "success") {
    await query(
      `update bookings
       set booking_status = 'cancelled', payment_status = 'failed'
       where paystack_reference = $1`,
      [reference],
    );

    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 },
    );
  }

  const bookingResult = await query(
    `update bookings
     set booking_status = 'confirmed',
         payment_status = 'paid'
     where paystack_reference = $1
     returning *`,
    [reference],
  );

  if (bookingResult.rowCount === 0) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({
    booking: serializeBooking(bookingResult.rows[0] as BookingDbRow),
    paystack: paystackResponse.data,
  });
}
