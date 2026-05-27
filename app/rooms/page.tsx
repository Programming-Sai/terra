import type { Metadata } from "next";
import { headers } from "next/headers";
import RoomCatalog from "@/components/room-catalog";
import { getAmenities } from "@/lib/amenities";
import { getPriceConversion } from "@/lib/currency";
import { getRooms } from "@/lib/room-data";
import { siteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: siteContent.rooms.pageTitle,
  description: siteContent.rooms.pageDescription,
};

function parseCount(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [rooms, amenities] = await Promise.all([getRooms(), getAmenities()]);
  const query = await searchParams;
  const priceConversion = await getPriceConversion((await headers()).get("accept-language"));
  const guestsValue = parseCount(query.guests, 1);
  const selectedBedType = Array.isArray(query.bedType)
    ? query.bedType[0]
    : query.bedType;
  const selectedRoomType = Array.isArray(query.roomType)
    ? query.roomType[0]
    : query.roomType;
  const search = Array.isArray(query.search) ? query.search[0] : query.search;
  const checkIn = Array.isArray(query.checkIn) ? query.checkIn[0] : query.checkIn;
  const checkOut = Array.isArray(query.checkOut) ? query.checkOut[0] : query.checkOut;

  return (
    <main className="bg-surface-bone text-charred-wood">
      <RoomCatalog
        amenityOptions={amenities}
        rooms={rooms}
        priceConversion={priceConversion}
        initialFilters={{
          checkIn,
          checkOut,
          maxGuests: guestsValue,
          searchTerm: search,
          selectedBedType,
          selectedRoomType,
        }}
      />
    </main>
  );
}
