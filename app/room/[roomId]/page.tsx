import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { query as dbQuery } from "@/lib/db";
import { getPriceConversion } from "@/lib/currency";
import { getAmenities } from "@/lib/amenities";
import { getRoomByIdentifier } from "@/lib/room-data";
import RoomDetailView from "@/components/room-detail-view";
import { siteContent } from "@/lib/site-content";
import { addDaysToInput, findNextAvailableDate, todayDateInput } from "@/lib/booking-dates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;
  const room = await getRoomByIdentifier(roomId);

  if (!room) {
    return {
      title: `Room Not Found | ${siteContent.brand.name}`,
      description: "The requested room could not be found.",
    };
  }

  return {
    title: `${room.name} | ${siteContent.brand.name}`,
    description: room.description,
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const [room, amenities] = await Promise.all([getRoomByIdentifier(roomId), getAmenities()]);

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
  const initialCheckIn = findNextAvailableDate(bookingWindows, today);
  const initialCheckOut = addDaysToInput(initialCheckIn, 1);

  return (
    <RoomDetailView
      bookingWindows={bookingWindows}
      initialCheckIn={initialCheckIn}
      initialCheckOut={initialCheckOut}
      amenityLookup={Object.fromEntries(
        amenities.map((amenity) => [amenity.title.toLowerCase(), amenity.icon]),
      )}
      priceConversion={priceConversion}
      room={room}
    />
  );
}
