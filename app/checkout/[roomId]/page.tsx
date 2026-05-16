import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CheckoutView from "@/components/checkout-view";
import { getRoomByIdentifier } from "@/lib/room-data";
import { siteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseCount(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
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
  const query = await searchParams;
  const room = await getRoomByIdentifier(roomId);

  if (!room) {
    notFound();
  }

  return (
    <CheckoutView
      initialBooking={{
        checkIn:
          Array.isArray(query.checkIn) ? query.checkIn[0] : query.checkIn ?? formatDateInput(addDays(new Date(), 1)),
        checkOut:
          Array.isArray(query.checkOut) ? query.checkOut[0] : query.checkOut ?? formatDateInput(addDays(new Date(), 2)),
        guests: parseCount(query.guests, 1),
        rooms: parseCount(query.rooms, 1),
      }}
      room={room}
    />
  );
}
