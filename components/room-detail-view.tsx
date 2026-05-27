"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/icon";
import RoomImage from "@/components/room-image";
import type { PriceConversion } from "@/lib/currency";
import { formatConvertedAmount } from "@/lib/currency";
import {
  addDaysToInput,
  findNextAvailableDate,
  normalizeBookingDates,
  todayDateInput,
  type BookingWindow,
} from "@/lib/booking-dates";
import type { Room } from "@/lib/rooms";

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateNights(checkIn: string, checkOut: string) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);

  if (!start || !end) return 1;

  const diff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return Math.max(diff, 1);
}

type BookingSnapshot = {
  reference: string;
  state: "available" | "booked" | "unavailable";
};

const bookingSnapshotCache = new Map<string, BookingSnapshot>();

function getRoomBookingSnapshot(
  room: Room,
  searchParams: ReturnType<typeof useSearchParams>,
  canReadStorage: boolean,
) {
  const roomId = String(room.id);
  const isUnavailable =
    room.isActive === false || (room.availabilityStatus ?? "available") !== "available";
  const bookingFlag = searchParams.get("booking");
  const bookingRoomId = searchParams.get("bookingRoomId");
  const bookingRef = searchParams.get("bookingRef") ?? searchParams.get("reference") ?? "";
  const storedRoomId = canReadStorage ? window.localStorage.getItem("terra:last-booked-room-id") : "";
  const storedReference = canReadStorage
    ? window.localStorage.getItem("terra:last-booked-reference") ?? ""
    : "";

  const cacheKey = [
    roomId,
    room.isActive ? "active" : "inactive",
    room.availabilityStatus ?? "available",
    bookingFlag ?? "",
    bookingRoomId ?? "",
    bookingRef,
    storedRoomId ?? "",
    storedReference,
  ].join("|");

  const cachedSnapshot = bookingSnapshotCache.get(cacheKey);
  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  if (bookingFlag === "success" && bookingRoomId === roomId) {
    const snapshot = {
      reference: bookingRef,
      state: "booked" as const,
    };
    bookingSnapshotCache.set(cacheKey, snapshot);
    return snapshot;
  }

  if (canReadStorage) {
    if (storedRoomId === roomId) {
      const snapshot = {
        reference: storedReference,
        state: "booked" as const,
      };
      bookingSnapshotCache.set(cacheKey, snapshot);
      return snapshot;
    }
  }

  const snapshot = {
    reference: "",
    state: isUnavailable ? ("unavailable" as const) : ("available" as const),
  };
  bookingSnapshotCache.set(cacheKey, snapshot);
  return snapshot;
}

function useRoomBookingSnapshot(room: Room, searchParams: ReturnType<typeof useSearchParams>) {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("terra-booking-updated", onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("terra-booking-updated", onStoreChange);
      };
    },
    () => getRoomBookingSnapshot(room, searchParams, true),
    () => getRoomBookingSnapshot(room, searchParams, false),
  );
}

export default function RoomDetailView({
  room,
  bookingWindows = [],
  initialCheckIn = todayDateInput(),
  initialCheckOut,
  amenityLookup = {},
  priceConversion,
}: {
  room: Room;
  bookingWindows?: BookingWindow[];
  initialCheckIn?: string;
  initialCheckOut?: string;
  amenityLookup?: Record<string, string>;
  priceConversion?: PriceConversion | null;
}) {
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const safeInitialCheckIn = bookingWindows.length
    ? findNextAvailableDate(bookingWindows, initialCheckIn)
    : initialCheckIn;
  const safeInitialCheckOut = initialCheckOut ?? addDaysToInput(safeInitialCheckIn, 1);
  const [checkIn, setCheckIn] = useState(safeInitialCheckIn);
  const [checkOut, setCheckOut] = useState(safeInitialCheckOut);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const nights = useMemo(
    () => calculateNights(checkIn, checkOut),
    [checkIn, checkOut],
  );
  const totalPrice = room.priceValue * nights * rooms;
  const convertedRoomPrice =
    priceConversion && priceConversion.currencyCode !== "GHS"
      ? formatConvertedAmount(room.priceValue * priceConversion.rate, priceConversion.currencyCode)
      : null;
  const convertedTotalPrice =
    priceConversion && priceConversion.currencyCode !== "GHS"
      ? formatConvertedAmount(totalPrice * priceConversion.rate, priceConversion.currencyCode)
      : null;
  const gallery = room.gallery.length > 0 ? room.gallery : [room.image];
  const bookingSnapshot = useRoomBookingSnapshot(room, searchParams);
  const isBooked = bookingSnapshot.state === "booked";
  const isRoomUnavailable = bookingSnapshot.state === "unavailable";
  const bookedReference = bookingSnapshot.reference;
  const minCheckIn = isBooked ? safeInitialCheckIn : todayDateInput();
  const minCheckOut = addDaysToInput(checkIn, 1);
  const bookNowHref = useMemo(() => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
      rooms: String(rooms),
    });

    return `/checkout/${room.id}?${params.toString()}`;
  }, [checkIn, checkOut, guests, room.id, rooms]);

  const updateCheckIn = (value: string) => {
    const nextCheckIn = bookingWindows.length
      ? findNextAvailableDate(bookingWindows, value < minCheckIn ? minCheckIn : value)
      : value < minCheckIn
        ? minCheckIn
        : value;
    const normalized = normalizeBookingDates(
      bookingWindows,
      nextCheckIn,
      addDaysToInput(nextCheckIn, 1),
      minCheckIn,
    );
    setCheckIn(normalized.checkIn);
    setCheckOut(normalized.checkOut);
  };

  const updateCheckOut = (value: string) => {
    const nextCheckOut = value <= checkIn ? addDaysToInput(checkIn, 1) : value;
    const normalized = normalizeBookingDates(
      bookingWindows,
      checkIn,
      nextCheckOut,
      minCheckIn,
    );
    setCheckIn(normalized.checkIn);
    setCheckOut(normalized.checkOut);
  };

  return (
    <main className="bg-[#fafaf9] text-charred-wood">
      <section className="max-w-[1152px] mx-auto px-6 md:px-section-padding pt-8">
        <Link
          className="inline-flex items-center gap-2 font-label-caps text-sm text-primary hover:underline"
          href="/rooms"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          Back to Rooms
        </Link>
      </section>

      <section className="max-w-[1152px] mx-auto px-6 md:px-section-padding py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="font-headline-lg text-[32px] md:text-[44px] text-charred-wood leading-tight mb-2">
                  {room.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 font-body-md text-sm text-outline-clay">
                  <span>{room.bedType}</span>
                  <span>•</span>
                  <span>Up to {room.maxGuests} Guests</span>
                  <span>•</span>
                  <span>{room.size}</span>
                  <span>•</span>
                  <span>{room.viewType}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-headline-sm text-[24px] text-primary leading-tight">
                  GHS {room.priceValue}
                </div>
                <div className="font-body-md text-sm text-outline-clay">
                  per night
                </div>
                {convertedRoomPrice ? (
                  <div className="mt-2 font-body-md text-[12px] font-semibold text-outline-clay">
                    Approx. {convertedRoomPrice}
                  </div>
                ) : null}
              </div>
            </div>

            {isBooked ? (
              <div className="rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                <div className="flex items-start gap-3">
                  <Icon name="check_circle" className="mt-0.5 text-green-700" />
                  <div>
                    <p className="font-label-caps text-[11px] font-bold uppercase tracking-widest">
                      Booking Confirmed
                    </p>
                    <p className="mt-1 font-body-md leading-relaxed">
                      Thanks for booking this room. Your booking is saved on this device.
                    </p>
                    {bookedReference ? (
                      <p className="mt-2 font-body-md text-xs font-bold text-green-800">
                        Reference: {bookedReference}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : isRoomUnavailable ? (
              <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <div className="flex items-start gap-3">
                  <Icon name="warning" className="mt-0.5 text-amber-700" />
                  <div>
                    <p className="font-label-caps text-[11px] font-bold uppercase tracking-widest">
                      Room Unavailable
                    </p>
                    <p className="mt-1 font-body-md leading-relaxed">
                      This room is currently unavailable for booking.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <div className="relative h-[400px] overflow-hidden bg-white border border-surface-container">
                <RoomImage
                  key={gallery[selectedImage]}
                  alt={`${room.name} gallery image ${selectedImage + 1}`}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={gallery[selectedImage]}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {gallery.map((image, index) => (
                  <button
                    className={`relative h-[120px] overflow-hidden bg-white border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-surface-container hover:border-primary"
                    }`}
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    type="button"
                  >
                    <RoomImage
                      alt={`${room.name} thumbnail ${index + 1}`}
                      className="object-cover"
                      fill
                      sizes="33vw"
                      src={image}
                    />
                  </button>
                ))}
              </div>
            </div>

            <section>
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                About This Room
              </span>
              <p className="mt-4 font-body-md text-[16px] text-on-surface-variant leading-relaxed">
                {room.description}
              </p>
            </section>

            <section>
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                Amenities
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {room.amenities.map((amenity) => (
                  <div
                    className="flex items-center gap-3 bg-white border border-surface-container p-4"
                    key={amenity}
                  >
                    <div className="w-8 h-8 bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
                      <Icon
                        name={amenityLookup[amenity.toLowerCase()] ?? "check_circle"}
                        className="text-sm"
                      />
                    </div>
                    <span className="font-body-md text-sm text-charred-wood">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                Features
              </span>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {room.features.map((feature) => (
                  <li
                    className="flex items-start gap-3 border border-surface-container bg-white p-4"
                    key={feature.label}
                  >
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    <span className="font-body-md text-sm text-charred-wood">
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-[#f9f8f6] border border-surface-container p-6">
              <div className="flex items-start gap-3">
                <Icon name="star" filled className="text-primary mt-0.5" />
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  {room.cancellationPolicy}
                </p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white border border-surface-container shadow-xl">
              <div className="p-6">
                <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                  Reserve Your Stay
                </span>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-outline-clay mb-2">
                      Check-in
                    </label>
                    <input
                      className="w-full bg-white border border-surface-container px-3 py-2 font-body-md text-base text-charred-wood"
                      min={minCheckIn}
                      onChange={(event) => updateCheckIn(event.target.value)}
                      type="date"
                      value={checkIn}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-outline-clay mb-2">
                      Check-out
                    </label>
                    <input
                      className="w-full bg-white border border-surface-container px-3 py-2 font-body-md text-base text-charred-wood"
                      min={minCheckOut}
                      onChange={(event) => updateCheckOut(event.target.value)}
                      type="date"
                      value={checkOut}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-outline-clay mb-2">
                      Guests
                    </label>
                    <select
                      className="w-full bg-white border border-surface-container px-3 py-2 font-body-md text-base text-charred-wood"
                      onChange={(event) =>
                        setGuests(Number.parseInt(event.target.value, 10))
                      }
                      value={guests}
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-outline-clay mb-2">
                      Rooms
                    </label>
                    <select
                      className="w-full bg-white border border-surface-container px-3 py-2 font-body-md text-base text-charred-wood"
                      onChange={(event) =>
                        setRooms(Number.parseInt(event.target.value, 10))
                      }
                      value={rooms}
                    >
                      <option value={1}>1 Room</option>
                      <option value={2}>2 Rooms</option>
                      <option value={3}>3 Rooms</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-surface-container mt-6 pt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm text-on-surface-variant">
                    <span>
                      GHS {room.priceValue} x {nights} night{nights > 1 ? "s" : ""} x {rooms} room
                      {rooms > 1 ? "s" : ""}
                    </span>
                    <span>GHS {room.priceValue * nights * rooms}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                    <span className="font-headline-sm text-lg font-bold text-charred-wood">
                      Total
                    </span>
                    <span className="font-headline-sm text-2xl font-bold text-primary">
                      GHS {totalPrice}
                    </span>
                  </div>
                  {convertedTotalPrice ? (
                    <div className="flex items-center justify-between text-sm font-semibold text-outline-clay">
                      <span>Approx. total</span>
                      <span>{convertedTotalPrice}</span>
                    </div>
                  ) : null}
                </div>

                {isBooked ? (
                  <button
                    className="w-full mt-6 inline-flex items-center justify-center bg-green-700 text-white px-6 py-4 font-label-caps text-sm font-bold uppercase cursor-not-allowed opacity-90"
                    disabled
                    type="button"
                  >
                    Thank You for Booking
                  </button>
                ) : isRoomUnavailable ? (
                  <button
                    className="w-full mt-6 inline-flex items-center justify-center bg-surface-container text-outline-clay px-6 py-4 font-label-caps text-sm font-bold uppercase cursor-not-allowed"
                    disabled
                    type="button"
                  >
                    Room Unavailable
                  </button>
                ) : (
                  <Link
                    className="w-full mt-6 inline-flex items-center justify-center bg-primary text-white px-6 py-4 font-label-caps text-sm font-bold uppercase hover:bg-laterite-red transition-colors"
                    href={bookNowHref}
                  >
                    Book Now
                  </Link>
                )}

                <p className="mt-4 text-center font-body-md text-xs text-outline-clay">
                  You won&apos;t be charged yet.
                </p>
              </div>
            </div>

            <div className="mt-4 bg-surface-container-low border border-surface-container p-4">
              <div className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary mt-0.5" />
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Free cancellation up to 48 hours before check-in
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
