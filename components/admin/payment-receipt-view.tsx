"use client";

import { useEffect } from "react";
import Icon from "@/components/icon";
import type { AdminPaymentReceipt } from "@/lib/admin-data";

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-surface-container bg-white px-4 py-4 shadow-sm">
      <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
        {label}
      </p>
      <p className="mt-2 font-body-md text-[14px] font-medium leading-relaxed text-charred-wood">
        {value}
      </p>
    </div>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-surface-container py-3 last:border-b-0">
      <span className="font-body-md text-[14px] text-on-surface-variant">{label}</span>
      <span className="font-body-md text-[14px] font-medium text-charred-wood">{value}</span>
    </div>
  );
}

export function PaymentReceiptView({
  receipt,
  autoPrint = false,
}: {
  receipt: AdminPaymentReceipt;
  autoPrint?: boolean;
}) {
  useEffect(() => {
    if (!autoPrint) return;

    const timer = window.setTimeout(() => {
      window.print();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [autoPrint]);

  return (
    <main className="min-h-screen bg-surface-bone px-4 py-8 text-charred-wood sm:px-6 sm:py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4 flex justify-end print:hidden">
          <button
            className="inline-flex items-center gap-2 border border-primary bg-white px-4 py-2 font-label-caps text-[12px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-white"
            onClick={() => window.print()}
            type="button"
          >
            <Icon name="download" className="text-[18px]" />
            <span>Download PDF</span>
          </button>
        </div>

        <section className="border border-surface-container bg-white shadow-sm">
          <header className="border-b border-surface-container bg-charred-wood px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <span className="font-label-caps text-[10px] font-bold uppercase tracking-[0.35em] text-dry-grass">
                  Terra Lodge Receipt
                </span>
                <h1 className="mt-3 font-headline-md text-[32px] font-bold leading-tight sm:text-[42px]">
                  Payment Receipt
                </h1>
                <p className="mt-3 max-w-xl font-body-md text-[14px] leading-relaxed text-white/85">
                  A simple record of your booking and payment details. Save it or print it for your records.
                </p>
              </div>

              <div className="border border-white/20 bg-white/10 px-5 py-4">
                <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Receipt Number
                </p>
                <p className="mt-1 font-headline-sm text-[26px] font-bold">
                  {receipt.receiptId}
                </p>
                <p className="mt-3 font-label-caps text-[10px] font-bold uppercase tracking-widest text-white/70">
                  {receipt.paymentStatus}
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-6 sm:p-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Guest" value={receipt.guestName} />
              <Field label="Email" value={receipt.guestEmail} />
              <Field label="Phone" value={receipt.guestPhone} />
              <Field label="Transaction Ref" value={receipt.transactionRef} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border border-surface-container bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center border border-surface-container bg-primary-fixed text-primary">
                    <Icon name="bed" className="text-[24px]" />
                  </div>
                  <div>
                    <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
                      Stay Summary
                    </p>
                    <h2 className="font-headline-sm text-[24px] font-bold text-charred-wood">
                      {receipt.room}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Room Type" value={receipt.roomType} />
                  <Field label="Guests" value={String(receipt.guests)} />
                  <Field label="Check-In" value={receipt.checkIn} />
                  <Field label="Check-Out" value={receipt.checkOut} />
                  <Field label="Nights" value={String(receipt.nights)} />
                  <Field label="Booking Status" value={receipt.bookingStatus} />
                </div>
              </div>

              <aside className="border border-surface-container bg-surface-container-low p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
                      Total Amount
                    </p>
                    <p className="mt-1 font-headline-md text-[30px] font-bold text-primary">
                      {receipt.currency} {receipt.amount.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div className="inline-flex h-11 w-11 items-center justify-center border border-surface-container bg-white text-primary">
                    <Icon name="payments" className="text-[22px]" />
                  </div>
                </div>

                <div className="border border-surface-container bg-white px-4 py-3">
                  <StatRow label="Payment status" value={receipt.paymentStatus} />
                  <StatRow label="Booking code" value={receipt.bookingId} />
                  <StatRow label="Booking date" value={receipt.bookingDate} />
                  <StatRow label="Last updated" value={receipt.updatedAt} />
                </div>
              </aside>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border border-surface-container bg-white p-5">
                <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
                  Notes
                </p>
                <p className="mt-2 font-body-md text-[14px] leading-relaxed text-on-surface-variant">
                  Keep this receipt for your records. If the payment is pending, it means the transaction is still awaiting Paystack confirmation.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="border border-surface-container bg-surface-bone px-4 py-4">
                  <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
                    Reference
                  </p>
                  <p className="mt-2 font-body-md text-[14px] font-medium text-charred-wood">
                    {receipt.transactionRef}
                  </p>
                </div>
                <div className="border border-surface-container bg-primary-fixed px-4 py-4">
                  <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-primary">
                    Status
                  </p>
                  <p className="mt-2 font-body-md text-[14px] font-medium text-charred-wood">
                    {receipt.paymentStatus} / {receipt.bookingStatus}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm;
          }

          body {
            background: #fff;
          }
        }
      `}</style>
    </main>
  );
}
