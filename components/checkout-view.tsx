"use client";

import { type ChangeEvent, type ReactNode, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PaystackPop from "@paystack/inline-js";
import Icon from "@/components/icon";
import type { Room } from "@/lib/rooms";
import { siteContent } from "@/lib/site-content";

type ModalType = "success" | "failed" | "cancelled" | null;

type GuestInfo = {
  fullName: string;
  email: string;
  phone: string;
};

type BookingDetails = {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
};

type InitializeResponse = {
  accessCode: string;
  reference: string;
  bookingId: string;
  bookingCode: string;
};

type VerifyResponse = {
  booking: {
    paystack_reference: string | null;
  };
};

function isModalType(value: string | null): value is Exclude<ModalType, null> {
  return value === "success" || value === "failed" || value === "cancelled";
}

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

function formatDate(value: string) {
  const date = parseDate(value);

  if (!date) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function ModalShell({
  onClose,
  icon,
  title,
  message,
  reference,
  primaryAction,
  secondaryAction,
  primaryLabel,
  secondaryLabel,
}: {
  onClose: () => void;
  icon: ReactNode;
  title: string;
  message: string;
  reference?: string;
  primaryAction: ReactNode;
  secondaryAction: ReactNode;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        type="button"
      />
      <div className="relative bg-white max-w-[520px] w-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <button
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-outline-clay hover:text-primary transition-colors"
          onClick={onClose}
          type="button"
        >
          <Icon name="close" className="text-[20px]" />
        </button>

        <div className="p-12 pt-14">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
              {icon}
            </div>
          </div>

          <h2 className="font-eczar text-[32px] text-center text-charred-wood mb-4">
            {title}
          </h2>

          <p className="font-body-md text-base text-center text-on-surface-variant mb-6 leading-relaxed">
            {message}
          </p>

          {reference ? (
            <div className="bg-surface-container-low border border-surface-container px-4 py-3 mb-8 text-center">
              <p className="font-body-md text-sm font-bold text-primary">
                {reference}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            {primaryAction}
            {secondaryAction}
          </div>

          <div className="sr-only">
            <span>{primaryLabel}</span>
            <span>{secondaryLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({
  onClose,
  reference,
  roomId,
}: {
  onClose: () => void;
  reference: string;
  roomId: string | number;
}) {
  return (
    <ModalShell
      icon={<Icon name="check" className="text-3xl" />}
      message={siteContent.checkout.successMessage}
      onClose={onClose}
      primaryAction={
        <Link
          className="flex-1 bg-primary px-6 py-4 cursor-pointer hover:bg-laterite-red transition-colors text-center"
          href={`/room/${roomId}`}
        >
          <span className="font-label-caps text-sm font-bold text-white uppercase">
            View My Booking
          </span>
        </Link>
      }
      primaryLabel="View My Booking"
      reference={reference}
      secondaryAction={
        <Link
          className="flex-1 bg-white border-2 border-primary px-6 py-4 cursor-pointer hover:bg-surface-bone transition-colors text-center"
          href="/"
        >
          <span className="font-label-caps text-sm font-bold text-primary uppercase">
            Return to Home
          </span>
        </Link>
      }
      secondaryLabel="Return to Home"
      title="Booking Confirmed"
    />
  );
}

function FailedModal({ onClose }: { onClose: () => void }) {
  return (
      <ModalShell
      icon={<Icon name="error" className="text-3xl" />}
      message={siteContent.checkout.failureMessage}
      onClose={onClose}
      primaryAction={
        <button
          className="flex-1 bg-primary px-6 py-4 cursor-pointer hover:bg-laterite-red transition-colors"
          onClick={onClose}
          type="button"
        >
          <span className="font-label-caps text-sm font-bold text-white uppercase">
            Try Again
          </span>
        </button>
      }
      primaryLabel="Try Again"
      secondaryAction={
        <Link
          className="flex-1 bg-white border-2 border-primary px-6 py-4 cursor-pointer hover:bg-surface-bone transition-colors text-center"
          href="/contact"
        >
          <span className="font-label-caps text-sm font-bold text-primary uppercase">
            Contact Us
          </span>
        </Link>
      }
      secondaryLabel="Contact Us"
      title="Payment Failed"
      reference=""
    />
  );
}

function CancelledModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      icon={<Icon name="cancel" className="text-3xl" />}
      message="You cancelled the payment. No charges were made to your account."
      onClose={onClose}
      primaryAction={
        <button
          className="flex-1 bg-primary px-6 py-4 cursor-pointer hover:bg-laterite-red transition-colors"
          onClick={onClose}
          type="button"
        >
          <span className="font-label-caps text-sm font-bold text-white uppercase">
            Try Again
          </span>
        </button>
      }
      primaryLabel="Try Again"
      secondaryAction={
        <Link
          className="flex-1 bg-white border-2 border-primary px-6 py-4 cursor-pointer hover:bg-surface-bone transition-colors text-center"
          href="/rooms"
        >
          <span className="font-label-caps text-sm font-bold text-primary uppercase">
            Back to Rooms
          </span>
        </Link>
      }
      secondaryLabel="Back to Rooms"
      title="Payment Cancelled"
      reference=""
    />
  );
}

export default function CheckoutView({
  room,
  initialBooking,
}: {
  room: Room;
  initialBooking: BookingDetails;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modalFromUrl = searchParams.get("payment-status");
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string>("");
  const [completedReference, setCompletedReference] = useState<string>("");

  const activeModal = isModalType(modalFromUrl) ? modalFromUrl : null;
  const booking = useMemo<BookingDetails>(
    () => ({
      checkIn: initialBooking.checkIn,
      checkOut: initialBooking.checkOut,
      guests: initialBooking.guests,
      rooms: initialBooking.rooms,
    }),
    [initialBooking],
  );

  const nights = useMemo(
    () => calculateNights(booking.checkIn, booking.checkOut),
    [booking.checkIn, booking.checkOut],
  );
  const subtotal = room.priceValue * nights * booking.rooms;
  const bookingReference = completedReference || "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setGuestInfo((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const setModalInUrl = (modal: Exclude<ModalType, null> | null) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (modal) {
      nextParams.set("payment-status", modal);
    } else {
      nextParams.delete("payment-status");
    }

    const nextUrl = nextParams.toString()
      ? `${pathname}?${nextParams.toString()}`
      : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  const markBookingFailed = async () => {
    if (!pendingBookingId) {
      return;
    }

    try {
      await fetch(`/api/bookings/${pendingBookingId}`, {
        body: JSON.stringify({
          booking_status: "cancelled",
          payment_status: "failed",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
    } catch {
      // Ignore cleanup errors so the payment UI can still close cleanly.
    }
  };

  const handlePay = async () => {
    setIsLoading(true);

    try {
      const initializeResponse = await fetch("/api/paystack/initialize", {
        body: JSON.stringify({
          roomId: room.id,
          roomSlug: room.slug,
          roomName: room.name,
          guestName: guestInfo.fullName,
          guestEmail: guestInfo.email,
          guestPhone: guestInfo.phone,
          checkInDate: booking.checkIn,
          checkOutDate: booking.checkOut,
          guestCount: booking.guests,
          roomCount: booking.rooms,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!initializeResponse.ok) {
        throw new Error("Failed to initialize payment.");
      }

      const initializeData =
        (await initializeResponse.json()) as InitializeResponse;
      setPendingBookingId(initializeData.bookingId);
      setCompletedReference(initializeData.reference);

      const paystack = new PaystackPop();

      paystack.resumeTransaction(initializeData.accessCode, {
        onCancel: () => {
          setIsLoading(false);
          void markBookingFailed();
          setModalInUrl("cancelled");
        },
        onError: () => {
          setIsLoading(false);
          void markBookingFailed();
          setModalInUrl("failed");
        },
        onLoad: () => {
          setIsLoading(false);
        },
        onSuccess: async ({ reference }) => {
          try {
            const verifyResponse = await fetch(
              `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
            );

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed.");
            }

            const verifyData = (await verifyResponse.json()) as VerifyResponse;
            setCompletedReference(verifyData.booking.paystack_reference ?? reference);
            setModalInUrl("success");
          } catch {
            void markBookingFailed();
            setModalInUrl("failed");
          } finally {
            setIsLoading(false);
          }
        },
      });
    } catch {
      setIsLoading(false);
      setModalInUrl("failed");
    }
  };

  return (
    <main className="flex-1 bg-surface-bone text-charred-wood">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            alt={siteContent.checkout.heroAlt}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={room.image}
          />
        </div>
        <div className="absolute inset-0 bg-charred-wood/85" />
        <div className="max-w-[1152px] mx-auto px-6 md:px-section-padding relative z-10">
          <div className="flex flex-col gap-3 items-center text-center">
            <span className="inline-flex bg-dry-grass/90 text-charred-wood px-4 py-1 font-label-caps text-[10px] font-bold uppercase tracking-[0.2em]">
              Secure Booking
            </span>
            <h1 className="font-eczar text-[48px] md:text-[64px] text-white leading-tight">
              Complete Your Booking
            </h1>
            <p className="font-body-lg text-white/95 max-w-3xl leading-relaxed">
              You&apos;re just one step away from your perfect stay. Review your
              booking and enter your details below.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1152px] mx-auto px-6 md:px-section-padding py-20">
        <div className="grid lg:grid-cols-[1fr_450px] gap-12">
          <div className="flex flex-col gap-8">
            <article className="bg-white border border-surface-container overflow-hidden">
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  alt={room.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={room.image}
                />
              </div>
              <div className="p-6">
                <h2 className="font-headline-sm text-3xl font-bold text-charred-wood mb-4">
                  {room.name}
                </h2>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  {room.description}
                </p>
              </div>
            </article>

            <article className="bg-white border border-surface-container p-8">
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                Booking Details
              </span>
              <div className="flex flex-col gap-5 mt-6">
                <div className="flex items-start justify-between pb-5 border-b border-surface-container">
                  <div>
                    <p className="font-headline-sm text-lg font-bold text-charred-wood">
                      Check-in
                    </p>
                    <p className="font-body-md text-sm text-outline-clay mt-1">
                      {formatDate(booking.checkIn)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md text-sm text-charred-wood">2:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start justify-between pb-5 border-b border-surface-container">
                  <div>
                    <p className="font-headline-sm text-lg font-bold text-charred-wood">
                      Check-out
                    </p>
                    <p className="font-body-md text-sm text-outline-clay mt-1">
                      {formatDate(booking.checkOut)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md text-sm text-charred-wood">11:00 AM</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-5 border-b border-surface-container">
                  <p className="font-headline-sm text-lg font-bold text-charred-wood">
                    Duration
                  </p>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {nights} nights
                  </p>
                </div>

                <div className="flex items-center justify-between pb-5 border-b border-surface-container">
                  <p className="font-headline-sm text-lg font-bold text-charred-wood">
                    Guests
                  </p>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-headline-sm text-lg font-bold text-charred-wood">
                    Rooms
                  </p>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {booking.rooms} room{booking.rooms > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </article>

            <article className="bg-white border border-surface-container p-8">
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                Price Breakdown
              </span>
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <p className="font-body-md text-sm text-on-surface-variant">
                    GHS {room.priceValue} x {nights} nights x {booking.rooms} room
                  </p>
                  <p className="font-body-md text-sm text-charred-wood">
                    GHS {subtotal.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="font-headline-sm text-xl font-bold text-charred-wood">
                    Total
                  </p>
                  <p className="font-headline-sm text-2xl font-bold text-primary">
                    GHS {subtotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-surface-container">
                <div className="flex items-start gap-3">
                  <Icon name="verified" className="text-primary mt-0.5" />
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                    {room.cancellationPolicy}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="lg:sticky lg:top-6 h-fit flex flex-col gap-6">
            <article className="bg-white border border-surface-container shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
              <div className="p-8">
                <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                  Guest Information
                </span>

                <form className="flex flex-col gap-5 mt-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-outline-clay mb-2">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-white border border-surface-container px-4 py-3 font-body-md text-base text-charred-wood outline-none focus:border-primary transition-colors"
                      name="fullName"
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      type="text"
                      value={guestInfo.fullName}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-outline-clay mb-2">
                      Email Address
                    </label>
                    <input
                      className="w-full bg-white border border-surface-container px-4 py-3 font-body-md text-base text-charred-wood outline-none focus:border-primary transition-colors"
                      name="email"
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      type="email"
                      value={guestInfo.email}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-outline-clay mb-2">
                      Phone Number
                    </label>
                    <input
                      className="w-full bg-white border border-surface-container px-4 py-3 font-body-md text-base text-charred-wood outline-none focus:border-primary transition-colors"
                      name="phone"
                      onChange={handleChange}
                      placeholder="+233 XX XXX XXXX"
                      required
                      type="tel"
                      value={guestInfo.phone}
                    />
                  </div>

                  <button
                    className="w-full mt-2 bg-primary text-white px-6 py-4 font-label-caps text-sm font-bold uppercase hover:bg-laterite-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    onClick={handlePay}
                    type="button"
                  >
                    {isLoading ? "Processing..." : "Pay with Paystack"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="font-body-md text-xs text-outline-clay leading-relaxed">
                    Secure payment. You won&apos;t be charged yet.
                  </p>
                </div>
              </div>
            </article>

            <article className="bg-white border border-surface-container p-6 flex items-center justify-center gap-3">
              <Icon name="shield" className="text-primary" />
              <p className="font-body-md text-sm text-on-surface-variant">
                Secured by Paystack
              </p>
            </article>
          </div>
        </div>
      </section>

      {activeModal === "success" ? (
        <SuccessModal
          onClose={() => setModalInUrl(null)}
          reference={bookingReference}
          roomId={room.id}
        />
      ) : null}
      {activeModal === "failed" ? (
        <FailedModal onClose={() => setModalInUrl(null)} />
      ) : null}
      {activeModal === "cancelled" ? (
        <CancelledModal onClose={() => setModalInUrl(null)} />
      ) : null}
    </main>
  );
}
