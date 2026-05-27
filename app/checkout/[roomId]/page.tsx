import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import CheckoutView from "@/components/checkout-view";
import { query as dbQuery } from "@/lib/db";
import { getPriceConversion } from "@/lib/currency";
import {
  addDaysToInput,
  findNextAvailableDate,
  normalizeBookingDates,
  todayDateInput,
} from "@/lib/booking-dates";
import { getRoomByIdentifier } from "@/lib/room-data";
import { siteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseCount(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseDate(value: string | string[] | undefined, fallback: string) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ?? fallback;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;
  const room = await getRoomByIdentifier(roomId);

  if (!room) {
    return {
      title: `Checkout Not Found | ${siteContent.brand.name}`,
      description: "The requested checkout page could not be found.",
    };
  }

  return {
    title: `Checkout | ${room.name} | ${siteContent.brand.name}`,
    description: `Complete your booking for ${room.name} at ${siteContent.brand.name}.`,
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { roomId } = await params;
  const search = await searchParams;
  const room = await getRoomByIdentifier(roomId);

  if (!room) {
    notFound();
  }

  const bookingWindowsResult = await dbQuery(
    `select check_in_date, check_out_date
     from bookings
     where room_id = $1
       and booking_status = 'confirmed'
     order by check_in_date asc`,
    [room.id],
  );
  const bookingWindows = bookingWindowsResult.rows.map((row) => ({
    checkIn: String(row.check_in_date).slice(0, 10),
    checkOut: String(row.check_out_date).slice(0, 10),
  }));
  const priceConversion = await getPriceConversion((await headers()).get("accept-language"));
  const today = todayDateInput();
  const defaultCheckIn = findNextAvailableDate(bookingWindows, today);
  const requestedCheckIn = parseDate(search.checkIn, defaultCheckIn);
  const requestedCheckOut = parseDate(search.checkOut, addDaysToInput(defaultCheckIn, 1));
  const bookingDates = normalizeBookingDates(
    bookingWindows,
    requestedCheckIn,
    requestedCheckOut,
    defaultCheckIn,
  );
  const conflict = await dbQuery(
    `select id
     from bookings
     where room_id = $1
       and booking_status = 'confirmed'
       and check_in_date < $3::date
       and check_out_date > $2::date
     limit 1`,
    [room.id, bookingDates.checkIn, bookingDates.checkOut],
  );

  return (
    <CheckoutView
      bookingConflict={(conflict.rowCount ?? 0) > 0}
      initialBooking={{
        checkIn: bookingDates.checkIn,
        checkOut: bookingDates.checkOut,
        guests: parseCount(search.guests, 1),
        rooms: parseCount(search.rooms, 1),
      }}
      priceConversion={priceConversion}
      room={room}
    />
  );
}
