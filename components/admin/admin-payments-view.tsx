"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import type { AdminPaymentRecord, AdminPaymentStat } from "@/lib/admin-data";
import { AdminPagination } from "@/components/admin/admin-pagination";

type PaymentStatus = "Completed" | "Pending" | "Failed";

type PaymentRecord = {
  id: string;
  bookingDbId: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  method: string;
  provider: string;
  status: PaymentStatus;
  date: string;
  transactionRef: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
};

type PaymentStat = {
  label: string;
  value: string;
  icon: string;
  color: string;
  change: string;
};

const mockStats: PaymentStat[] = [
  {
    label: "Total Revenue",
    value: "GH₵ 45,280",
    icon: "payments",
    color: "#4a1e00",
    change: "+12.5%",
  },
  {
    label: "Completed Payments",
    value: "142",
    icon: "check_circle",
    color: "#16a34a",
    change: "+8.2%",
  },
  {
    label: "Pending Payments",
    value: "23",
    icon: "schedule",
    color: "#f59e0b",
    change: "-3.1%",
  },
  {
    label: "Failed Payments",
    value: "5",
    icon: "cancel",
    color: "#ef4444",
    change: "-15.3%",
  },
];

const mockPayments: PaymentRecord[] = [
  {
    id: "PAY-2024-1234",
    bookingDbId: "BK-1234",
    bookingId: "BK-1234",
    guestName: "Kwame Mensah",
    guestEmail: "kwame.mensah@email.com",
    amount: 650,
    method: "Mobile Money",
    provider: "MTN MoMo",
    status: "Completed",
    date: "2026-05-17 10:30 AM",
    transactionRef: "MTN-45678912",
    room: "The Silt Suite",
    checkIn: "2026-05-20",
    checkOut: "2026-05-23",
    nights: 3,
  },
  {
    id: "PAY-2024-1235",
    bookingDbId: "BK-1235",
    bookingId: "BK-1235",
    guestName: "Ama Owusu",
    guestEmail: "ama.owusu@email.com",
    amount: 500,
    method: "Card",
    provider: "Visa",
    status: "Pending",
    date: "2026-05-17 09:15 AM",
    transactionRef: "CARD-78945612",
    room: "Basalt Retreat",
    checkIn: "2026-05-21",
    checkOut: "2026-05-24",
    nights: 3,
  },
  {
    id: "PAY-2024-1236",
    bookingDbId: "BK-1236",
    bookingId: "BK-1236",
    guestName: "Kofi Asante",
    guestEmail: "kofi.asante@email.com",
    amount: 800,
    method: "Mobile Money",
    provider: "Vodafone Cash",
    status: "Completed",
    date: "2026-05-16 03:45 PM",
    transactionRef: "VODA-32165498",
    room: "Lodge Suite",
    checkIn: "2026-05-22",
    checkOut: "2026-05-25",
    nights: 3,
  },
  {
    id: "PAY-2024-1237",
    bookingDbId: "BK-1237",
    bookingId: "BK-1237",
    guestName: "Efua Boateng",
    guestEmail: "efua.boateng@email.com",
    amount: 650,
    method: "Bank Transfer",
    provider: "GCB Bank",
    status: "Completed",
    date: "2026-05-16 11:20 AM",
    transactionRef: "BANK-65498732",
    room: "The Silt Suite",
    checkIn: "2026-05-23",
    checkOut: "2026-05-26",
    nights: 3,
  },
  {
    id: "PAY-2024-1238",
    bookingDbId: "BK-1238",
    bookingId: "BK-1238",
    guestName: "Yaw Osei",
    guestEmail: "yaw.osei@email.com",
    amount: 1200,
    method: "Card",
    provider: "Mastercard",
    status: "Failed",
    date: "2026-05-15 02:30 PM",
    transactionRef: "CARD-98765432",
    room: "Premium Suite",
    checkIn: "2026-05-25",
    checkOut: "2026-05-28",
    nights: 3,
  },
  {
    id: "PAY-2024-1239",
    bookingDbId: "BK-1239",
    bookingId: "BK-1239",
    guestName: "Akua Mensah",
    guestEmail: "akua.mensah@email.com",
    amount: 500,
    method: "Mobile Money",
    provider: "AirtelTigo Money",
    status: "Completed",
    date: "2026-05-15 10:00 AM",
    transactionRef: "ATIGO-15935782",
    room: "Basalt Retreat",
    checkIn: "2026-05-26",
    checkOut: "2026-05-29",
    nights: 3,
  },
  {
    id: "PAY-2024-1240",
    bookingDbId: "BK-1240",
    bookingId: "BK-1240",
    guestName: "Kwabena Adjei",
    guestEmail: "kwabena.adjei@email.com",
    amount: 650,
    method: "Card",
    provider: "Visa",
    status: "Pending",
    date: "2026-05-14 04:15 PM",
    transactionRef: "CARD-74185296",
    room: "The Silt Suite",
    checkIn: "2026-05-27",
    checkOut: "2026-05-30",
    nights: 3,
  },
];

const mockRevenueTrend = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 5100 },
  { month: "Apr", revenue: 4600 },
  { month: "May", revenue: 5400 },
  { month: "Jun", revenue: 4800 },
];

const mockStatusData = [
  { label: "Completed", count: 45 },
  { label: "Pending", count: 35 },
  { label: "Failed", count: 12 },
];

function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <span className="font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
          Admin Management
        </span>
        <h1 className="mt-2 font-eczar text-[36px] font-bold text-charred-wood">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl font-body-md text-[14px] leading-relaxed text-on-surface-variant">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}

function StatTile({ stat }: { stat: PaymentStat }) {
  const isPositive = stat.change.startsWith("+");

  return (
    <div className="border border-surface-container bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary-fixed">
          <Icon name={stat.icon} className="text-[24px]" filled />
        </div>
        <span
          className={`font-label-caps text-[12px] font-bold ${
            isPositive ? "text-green-700" : "text-red-700"
          }`}
        >
          {stat.change}
        </span>
      </div>
      <div className="mb-1 font-nimbus text-[28px] font-bold text-charred-wood">
        {stat.value}
      </div>
      <p className="font-body-md text-[14px] text-outline-clay">{stat.label}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden border border-surface-container bg-white p-4 sm:p-6">
      <h2 className="mb-5 font-eczar text-[18px] font-bold text-charred-wood sm:mb-6 sm:text-[20px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
        {label}
      </p>
      <p className="font-body-md text-[14px] text-charred-wood">{value}</p>
    </div>
  );
}

function statusClass(status: PaymentStatus) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-surface-container text-outline-clay";
  }
}

function statusIcon(status: PaymentStatus) {
  switch (status.toLowerCase()) {
    case "completed":
      return <Icon name="check_circle" className="text-[16px]" filled />;
    case "pending":
      return <Icon name="schedule" className="text-[16px]" />;
    case "failed":
      return <Icon name="error" className="text-[16px]" />;
    default:
      return null;
  }
}

function escapeCsvValue(value: string) {
  if (/[,"\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function toPaymentsCsv(payments: PaymentRecord[]) {
  const headers = [
    "Payment ID",
    "Booking ID",
    "Guest Name",
    "Guest Email",
    "Room",
    "Method",
    "Provider",
    "Amount",
    "Status",
    "Date",
    "Transaction Ref",
    "Check In",
    "Check Out",
    "Nights",
  ];

  const rows = payments.map((payment) =>
    [
      payment.id,
      payment.bookingId,
      payment.guestName,
      payment.guestEmail,
      payment.room,
      payment.method,
      payment.provider,
      String(payment.amount),
      payment.status,
      payment.date,
      payment.transactionRef,
      payment.checkIn,
      payment.checkOut,
      String(payment.nights),
    ]
      .map((value) => escapeCsvValue(value))
      .join(","),
  );

  return [headers.map(escapeCsvValue).join(","), ...rows].join("\n");
}

function PaymentModal({
  payment,
  onClose,
  onConfirm,
  onReject,
  onOpenReceipt,
  busy,
}: {
  payment: PaymentRecord;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onReject: () => Promise<void>;
  onOpenReceipt: () => void;
  busy: boolean;
}) {
  const isPending = payment.status === "Pending";
  const isCompleted = payment.status === "Completed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white">
        <div className="bg-primary p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-eczar text-[28px] font-bold">
                Payment Details
              </h2>
              <p className="mt-1 font-body-md text-sm">{payment.id}</p>
            </div>
            <button
              aria-label="Close payment details"
              className="text-white transition-colors hover:text-dry-grass"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" className="text-[28px]" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <Section title="Guest Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={payment.guestName} />
              <Detail label="Email" value={payment.guestEmail} />
            </div>
            {isPending ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Pending payment
                </p>
                <p className="mt-2 font-body-md text-[14px] leading-relaxed text-amber-900">
                  This means Paystack has not finalized verification yet. If the
                  gateway confirms the charge, the booking should move to paid
                  automatically. If it is an abandoned or invalid attempt, you can
                  reject it here.
                </p>
              </div>
            ) : null}
          </Section>

          <Section title="Booking Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Booking ID" value={payment.bookingId} />
              <Detail label="Room" value={payment.room} />
              <Detail label="Check-In" value={payment.checkIn} />
              <Detail label="Check-Out" value={payment.checkOut} />
              <Detail label="Nights" value={String(payment.nights)} />
            </div>
          </Section>

          <Section title="Payment Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Payment Method" value={payment.method} />
              <Detail label="Provider" value={payment.provider} />
              <Detail label="Transaction Reference" value={payment.transactionRef} />
              <Detail label="Date & Time" value={payment.date} />
              <div>
                <p className="mb-1 font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
                  Status
                </p>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold ${statusClass(payment.status)}`}
                >
                  {statusIcon(payment.status)}
                  {payment.status}
                </span>
              </div>
              <Detail label="Amount" value={`GH₵ ${payment.amount.toLocaleString()}`} />
            </div>
          </Section>

          <div className="flex flex-col gap-3 border-t border-surface-container pt-6 sm:flex-row">
            {isPending ? (
              <button
                className="flex-1 bg-green-600 px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={busy}
                onClick={onConfirm}
                type="button"
              >
                {busy ? "Updating..." : "Confirm Payment"}
              </button>
            ) : null}
            {isPending ? (
              <button
                className="flex-1 bg-primary px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
                disabled={busy}
                onClick={onReject}
                type="button"
              >
                {busy ? "Updating..." : "Reject Payment"}
              </button>
            ) : null}
            <button
              className="flex-1 border-2 border-primary bg-white px-6 py-3 font-label-caps text-sm font-bold uppercase text-primary transition-colors hover:bg-surface-bone disabled:cursor-not-allowed disabled:opacity-70"
              disabled={busy}
              onClick={onOpenReceipt}
              type="button"
            >
              {isCompleted ? "Download Receipt" : "Download Receipt PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type AdminPaymentsViewProps = {
  payments?: AdminPaymentRecord[];
  stats?: AdminPaymentStat[];
  revenueTrend?: Array<{ month: string; revenue: number }>;
  statusData?: Array<{ label: string; count: number }>;
};

export function AdminPaymentsView({
  payments: paymentsProp = mockPayments,
  stats: statsProp = mockStats,
  revenueTrend: revenueTrendProp = mockRevenueTrend,
  statusData: statusDataProp = mockStatusData,
}: AdminPaymentsViewProps = {}) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "completed" | "pending" | "failed"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(
    null,
  );
  const [actionBusy, setActionBusy] = useState(false);
  const pageSize = 5;
  const payments = paymentsProp;
  const stats = statsProp;
  const revenueTrend = revenueTrendProp;
  const statusData = statusDataProp;
  const handleExportReport = () => {
    const csv = toPaymentsCsv(filteredPayments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `terra-lodge-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();

    window.URL.revokeObjectURL(url);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesFilter =
      selectedFilter === "all" || payment.status.toLowerCase() === selectedFilter;
    const matchesSearch =
      payment.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pageCount = Math.max(Math.ceil(filteredPayments.length / pageSize), 1);
  const displayPage = Math.min(page, pageCount);

  const start = (displayPage - 1) * pageSize;
  const paginatedPayments = filteredPayments.slice(start, start + pageSize);
  const activePayment = selectedPayment;

  const openReceipt = (payment: PaymentRecord) => {
    window.open(`/receipt/${payment.bookingId}?download=1`, "_blank", "noopener,noreferrer");
  };

  const updatePaymentStatus = async (
    payment: PaymentRecord,
    booking_status: "confirmed" | "cancelled",
    payment_status: "paid" | "failed",
  ) => {
    setActionBusy(true);

    try {
      const response = await fetch(`/api/bookings/${payment.bookingDbId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_status,
          payment_status,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update payment.");
      }

      setSelectedPayment(null);
      router.refresh();
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        action={
          <button
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red"
            onClick={handleExportReport}
            type="button"
          >
            <Icon name="download" className="text-[18px]" />
            <span>Export Report</span>
          </button>
        }
        description="Track transactions, payment states, and revenue performance for Terra Lodge."
        title="Payments"
      />

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Revenue Trend">
          <div className="flex h-[200px] items-end gap-2 overflow-x-hidden border-b border-l border-surface-container pb-3 pl-2 sm:h-[240px] sm:gap-4 sm:pb-4 sm:pl-4">
            {revenueTrend.map((point) => {
              const maxRevenue = Math.max(...revenueTrend.map((item) => item.revenue));
              const height = Math.max((point.revenue / maxRevenue) * 100, 8);

              return (
                <div
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2 sm:gap-3"
                  key={point.month}
                >
                  <div className="flex h-[150px] w-full items-end justify-center sm:h-[180px]">
                    <div
                      className="w-full max-w-[28px] rounded-t-sm bg-primary sm:max-w-[42px]"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-center font-body-md text-[10px] text-outline-clay sm:text-[12px]">
                    {point.month}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Payment Status Breakdown">
          <div className="space-y-4">
            {statusData.map((method) => {
              const maxCount = Math.max(...statusData.map((item) => item.count), 0);
              const width = maxCount === 0 ? 0 : (method.count / maxCount) * 100;

              return (
                <div key={method.label}>
                  <div className="mb-2 flex items-center justify-between font-body-md text-[14px] text-charred-wood">
                    <span>{method.label}</span>
                    <span className="font-bold">{method.count}</span>
                  </div>
                  <div className="h-3 overflow-hidden bg-surface-bone">
                    {method.count > 0 ? (
                      <div className="h-full bg-primary" style={{ width: `${width}%` }} />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </section>

      <section className="mb-6 border border-surface-container bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline-clay"
            />
            <input
              className="w-full border border-surface-container bg-white py-3 pl-11 pr-4 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search by guest name, payment ID, or transaction reference..."
              value={searchTerm}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "completed", "pending", "failed"].map((filter) => {
              const active = selectedFilter === filter;

              return (
                <button
                  className={`inline-flex items-center gap-2 rounded-sm px-4 py-3 font-label-caps text-sm font-bold uppercase transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "border border-surface-container bg-white text-on-surface-variant hover:bg-surface-bone"
                  }`}
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter as typeof selectedFilter);
                    setPage(1);
                  }}
                  type="button"
                >
                  <Icon
                    name={
                      filter === "all"
                        ? "filter_alt"
                        : filter === "completed"
                          ? "check_circle"
                          : filter === "pending"
                            ? "schedule"
                            : "cancel"
                    }
                    className="text-[18px]"
                    filled={active && filter !== "all"}
                  />
                  <span>{filter}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border border-surface-container bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] sm:min-w-full">
            <thead className="bg-surface-bone">
              <tr className="border-b border-surface-container">
                {[
                  "Payment ID",
                  "Guest",
                  "Room",
                  "Method",
                  "Amount",
                  "Date",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    className="px-4 py-4 text-left font-label-caps text-[11px] font-bold uppercase tracking-wider text-outline-clay sm:text-[12px]"
                    key={heading}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr
                  className="border-b border-surface-container transition-colors hover:bg-surface-bone"
                  key={payment.id}
                >
                  <td className="px-4 py-4 font-body-md text-[13px] font-medium text-charred-wood sm:text-[14px]">
                    {payment.id}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-body-md text-[13px] font-bold text-charred-wood sm:text-[14px]">
                      {payment.guestName}
                    </p>
                    <p className="font-body-md text-[11px] text-outline-clay sm:text-[12px]">
                      {payment.guestEmail}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-body-md text-[13px] text-on-surface-variant sm:text-[14px]">
                    {payment.room}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-body-md text-[13px] text-charred-wood sm:text-[14px]">
                      {payment.method}
                    </p>
                    <p className="font-body-md text-[11px] text-outline-clay sm:text-[12px]">
                      {payment.provider}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-body-md text-[13px] font-bold text-primary sm:text-[14px]">
                    GHS {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 font-body-md text-[13px] text-on-surface-variant sm:text-[14px]">
                    {payment.date}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold ${statusClass(payment.status)}`}
                    >
                      {statusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      aria-label={`View payment ${payment.id}`}
                      className="text-primary transition-colors hover:text-laterite-red"
                      onClick={() => setSelectedPayment(payment)}
                      type="button"
                    >
                      <Icon name="visibility" className="text-[20px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminPagination
          itemLabel="payments"
          onPageChange={setPage}
          page={displayPage}
          pageCount={pageCount}
          pageSize={pageSize}
          total={filteredPayments.length}
        />
      </section>

      {activePayment ? (
        <PaymentModal
          busy={actionBusy}
          onClose={() => setSelectedPayment(null)}
          onConfirm={() =>
            updatePaymentStatus(activePayment!, "confirmed", "paid")
          }
          onOpenReceipt={() => openReceipt(activePayment!)}
          onReject={() =>
            updatePaymentStatus(activePayment!, "cancelled", "failed")
          }
          payment={activePayment!}
        />
      ) : null}
    </div>
  );
}
