import { query } from "@/lib/db";
import { serializeBooking, serializeRoom, type BookingDbRow, type RoomDbRow } from "@/lib/db-serializers";

type BookingWithRoomRow = BookingDbRow & {
  room_name: string;
  room_type: string;
  room_price_per_night: string | number;
};

export type AdminDashboardStat = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  tone: string;
};

export type AdminSeriesPoint = {
  label: string;
  value: number;
};

export type AdminRoomSlice = {
  name: string;
  value: number;
  color: string;
};

export type AdminRoomRecord = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  status: "Available" | "Maintenance";
  amenities: string[];
  description: string;
  totalBookings: number;
  currentOccupancy: "Vacant" | "Occupied" | "Under Maintenance";
};

export type AdminRecentBooking = {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  amount: string;
  status: "Confirmed" | "Pending" | "Cancelled";
};

export type AdminBookingRecord = {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  bookingDate: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
};

export type AdminCustomerRecord = {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  status: "Active" | "VIP" | "Inactive";
  joinDate: string;
  address: string;
};

export type AdminPaymentRecord = {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  method: string;
  provider: string;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  transactionRef: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
};

export type AdminPaymentStat = {
  label: string;
  value: string;
  icon: string;
  color: string;
  change: string;
};

function formatCurrency(amount: number) {
  return `GHS ${amount.toLocaleString("en-US")}`;
}

function formatIsoDate(value: string | Date | null | undefined) {
  if (!value) return "N/A";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toISOString().slice(0, 10);
}

function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "N/A";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function subtractDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function parseDate(value: string | Date | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function bookingLength(checkIn: string | Date, checkOut: string | Date) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end) return 1;

  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(nights, 1);
}

function bookingStatusLabel(status: string): "Confirmed" | "Pending" | "Cancelled" {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function paymentStatusLabel(status: string): "Paid" | "Pending" | "Refunded" {
  switch (status.toLowerCase()) {
    case "paid":
      return "Paid";
    case "refunded":
      return "Refunded";
    default:
      return "Pending";
  }
}

function paymentStatusSummary(status: string): "Completed" | "Pending" | "Failed" {
  switch (status.toLowerCase()) {
    case "paid":
      return "Completed";
    case "failed":
    case "refunded":
      return "Failed";
    default:
      return "Pending";
  }
}

function percentChange(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return "0%";
    return "+100%";
  }

  const delta = ((current - previous) / previous) * 100;
  const rounded = Math.abs(delta) >= 10 ? Math.round(delta) : Math.round(delta * 10) / 10;
  return `${delta > 0 ? "+" : ""}${rounded}%`;
}

async function fetchRooms() {
  const result = await query<RoomDbRow>(`select * from rooms order by featured desc, created_at desc`);
  return result.rows.map((row) => serializeRoom(row));
}

async function fetchBookingsWithRooms() {
  const result = await query<BookingWithRoomRow>(
    `select
       b.*,
       r.name as room_name,
       r.room_type as room_type,
       r.price_per_night as room_price_per_night
     from bookings b
     join rooms r on r.id = b.room_id
     order by b.created_at desc`,
  );

  return result.rows.map((row) => ({
    ...serializeBooking(row),
    room_name: row.room_name,
    room_type: row.room_type,
    room_price_per_night: row.room_price_per_night,
  }));
}

function occupiedRoomsOnDate(
  rooms: ReturnType<typeof serializeRoom>[],
  bookings: BookingWithRoomRow[],
  date: Date,
) {
  const day = startOfDay(date);
  const occupied = new Set<string>();

  for (const booking of bookings) {
    const checkIn = parseDate(booking.check_in_date);
    const checkOut = parseDate(booking.check_out_date);
    if (!checkIn || !checkOut) continue;

    const active =
      (booking.booking_status.toLowerCase() === "confirmed" ||
        booking.booking_status.toLowerCase() === "pending") &&
      checkIn <= day &&
      checkOut > day;

    if (active) {
      occupied.add(booking.room_id);
    }
  }

  return rooms.filter((room) => occupied.has(room.id)).length;
}

function bookingsInRange(
  bookings: BookingWithRoomRow[],
  start: Date,
  end: Date,
) {
  return bookings.filter((booking) => {
    const createdAt = parseDate(booking.created_at);
    return createdAt ? createdAt >= start && createdAt < end : false;
  });
}

export async function getAdminRoomsData(): Promise<AdminRoomRecord[]> {
  const [rooms, bookingsResult] = await Promise.all([fetchRooms(), fetchBookingsWithRooms()]);
  const bookingCounts = new Map<string, number>();
  const occupiedRooms = new Set<string>();
  const today = startOfDay(new Date());

  for (const booking of bookingsResult) {
    bookingCounts.set(booking.room_id, (bookingCounts.get(booking.room_id) ?? 0) + 1);

    const checkIn = parseDate(booking.check_in_date);
    const checkOut = parseDate(booking.check_out_date);
    const active =
      (booking.booking_status.toLowerCase() === "confirmed" ||
        booking.booking_status.toLowerCase() === "pending") &&
      checkIn !== null &&
      checkOut !== null &&
      checkIn <= today &&
      checkOut > today;

    if (active) {
      occupiedRooms.add(booking.room_id);
    }
  }

  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    type: room.room_type,
    capacity: room.max_guests,
    pricePerNight: room.price_per_night,
    status: room.is_active && room.availability_status === "available" ? "Available" : "Maintenance",
    amenities: room.amenities as string[],
    description: room.description,
    totalBookings: bookingCounts.get(room.id) ?? 0,
    currentOccupancy:
      room.is_active && room.availability_status === "available"
      ? occupiedRooms.has(room.id)
        ? "Occupied"
        : "Vacant"
        : "Under Maintenance",
  }));
}

export async function getAdminBookingsData() {
  const bookings = await fetchBookingsWithRooms();

  return bookings.map((booking) => ({
    id: booking.booking_code,
    bookingId: booking.id,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    guestPhone: booking.guest_phone,
    room: booking.room_name,
    checkIn: formatIsoDate(booking.check_in_date),
    checkOut: formatIsoDate(booking.check_out_date),
    nights: bookingLength(booking.check_in_date, booking.check_out_date),
    guests: booking.guest_count,
    amount: Number(booking.total_amount),
    status: bookingStatusLabel(booking.booking_status),
    bookingDate: formatIsoDate(booking.created_at),
    paymentStatus: paymentStatusLabel(booking.payment_status),
  })) satisfies AdminBookingRecord[];
}

export async function getAdminCustomersData(): Promise<AdminCustomerRecord[]> {
  const bookings = await fetchBookingsWithRooms();
  const customerMap = new Map<
    string,
    AdminCustomerRecord & { _lastSeen: Date | null; _joinedAt: Date | null }
  >();

  for (const booking of bookings) {
    const key = booking.guest_email.toLowerCase();
    const bookingDate = parseDate(booking.created_at);
    const existing = customerMap.get(key);

    if (!existing) {
      customerMap.set(key, {
        id: customerMap.size + 1,
        name: booking.guest_name,
        email: booking.guest_email,
        phone: booking.guest_phone,
        totalBookings: 1,
        totalSpent: Number(booking.total_amount),
        lastBooking: formatIsoDate(booking.created_at),
        status: "Active",
        joinDate: formatIsoDate(booking.created_at),
        address: "Not stored in booking records",
        _lastSeen: bookingDate,
        _joinedAt: bookingDate,
      });
      continue;
    }

    existing.totalBookings += 1;
    existing.totalSpent += Number(booking.total_amount);
    if (!existing._lastSeen || (bookingDate && bookingDate > existing._lastSeen)) {
      existing._lastSeen = bookingDate;
      existing.lastBooking = formatIsoDate(booking.created_at);
      existing.name = booking.guest_name;
      existing.phone = booking.guest_phone;
    }
    if (!existing._joinedAt || (bookingDate && bookingDate < existing._joinedAt)) {
      existing._joinedAt = bookingDate;
      existing.joinDate = formatIsoDate(booking.created_at);
    }
  }

  const now = new Date();
  const vipThreshold = 5000;
  const vipBookingsThreshold = 5;
  const inactiveCutoff = subtractDays(now, 180);

  return Array.from(customerMap.values())
    .map(({ _lastSeen, _joinedAt, ...customer }) => {
      void _joinedAt;

      return {
        ...customer,
        status: (
          customer.totalBookings >= vipBookingsThreshold ||
          customer.totalSpent >= vipThreshold
            ? "VIP"
            : _lastSeen && _lastSeen < inactiveCutoff
              ? "Inactive"
              : "Active"
        ) as AdminCustomerRecord["status"],
      };
    })
    .sort((left, right) => right.totalSpent - left.totalSpent)
    .map((customer, index) => ({
      ...customer,
      id: index + 1,
    }));
}

export async function getAdminPaymentsData() {
  const bookings = await fetchBookingsWithRooms();

  return bookings.map((booking) => ({
    id: booking.payment_status === "paid" ? `PAY-${booking.booking_code}` : booking.booking_code,
    bookingId: booking.booking_code,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    amount: Number(booking.total_amount),
    method: "Paystack Checkout",
    provider: "Online payment",
    status: paymentStatusSummary(booking.payment_status),
    date: formatDateTime(booking.updated_at),
    transactionRef: booking.paystack_reference ?? booking.booking_code,
    room: booking.room_name,
    checkIn: formatIsoDate(booking.check_in_date),
    checkOut: formatIsoDate(booking.check_out_date),
    nights: bookingLength(booking.check_in_date, booking.check_out_date),
  })) satisfies AdminPaymentRecord[];
}

export async function getAdminDashboardData() {
  const [rooms, bookings] = await Promise.all([fetchRooms(), fetchBookingsWithRooms()]);
  const now = new Date();
  const currentMonthStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currentThirtyDaysStart = subtractDays(startOfDay(now), 30);
  const previousThirtyDaysStart = subtractDays(startOfDay(now), 60);
  const currentNinetyDaysStart = subtractDays(startOfDay(now), 90);
  const previousNinetyDaysStart = subtractDays(startOfDay(now), 180);

  const paidBookings = bookings.filter((booking) => booking.payment_status.toLowerCase() === "paid");
  const currentMonthRevenue = bookingsInRange(paidBookings, currentMonthStart, nextMonthStart).reduce(
    (sum, booking) => sum + Number(booking.total_amount),
    0,
  );
  const previousMonthRevenue = bookingsInRange(
    paidBookings,
    previousMonthStart,
    currentMonthStart,
  ).reduce((sum, booking) => sum + Number(booking.total_amount), 0);
  const currentThirtyDayBookings = bookingsInRange(bookings, currentThirtyDaysStart, now).length;
  const previousThirtyDayBookings = bookingsInRange(
    bookings,
    previousThirtyDaysStart,
    currentThirtyDaysStart,
  ).length;

  const currentGuests = new Set(
    bookingsInRange(bookings, currentNinetyDaysStart, now).map((booking) => booking.guest_email.toLowerCase()),
  ).size;
  const previousGuests = new Set(
    bookingsInRange(bookings, previousNinetyDaysStart, currentNinetyDaysStart).map((booking) => booking.guest_email.toLowerCase()),
  ).size;

  const occupiedNow = occupiedRoomsOnDate(rooms, bookings, now);
  const occupiedPrevious = occupiedRoomsOnDate(rooms, bookings, subtractDays(now, 30));

  const monthlyRevenue = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthBookings = paidBookings.filter((booking) => {
      const date = parseDate(booking.created_at);
      return date ? date.getFullYear() === now.getFullYear() && date.getMonth() === monthIndex : false;
    });

    return {
      label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        new Date(now.getFullYear(), monthIndex, 1),
      ),
      value: monthBookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0),
    };
  });

  const weeklyBookings = Array.from({ length: 7 }, (_, dayIndex) => {
    const target = subtractDays(startOfDay(now), 6 - dayIndex);
    const label = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(target);
    const count = bookings.filter((booking) => {
      const createdAt = parseDate(booking.created_at);
      return createdAt ? createdAt.toDateString() === target.toDateString() : false;
    }).length;

    return { label, value: count };
  });

  const roomCounts = new Map<string, number>();
  for (const booking of bookings) {
    roomCounts.set(booking.room_name, (roomCounts.get(booking.room_name) ?? 0) + 1);
  }

  const roomDistribution = Array.from(roomCounts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([name, value], index) => ({
      name,
      value,
      color: ["#4a1e00", "#877369", "#d8b79f", "#8b4513"][index] ?? "#4a1e00",
    }));

  const remaining = bookings.length - roomDistribution.reduce((sum, item) => sum + item.value, 0);
  if (remaining > 0) {
    roomDistribution.push({
      name: "Others",
      value: remaining,
      color: "#c8b3a3",
    });
  }

  return {
    stats: [
      {
        label: "Total Revenue",
        value: formatCurrency(paidBookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0)),
        change: percentChange(currentMonthRevenue, previousMonthRevenue),
        trend: currentMonthRevenue >= previousMonthRevenue ? ("up" as const) : ("down" as const),
        icon: "payments",
        tone: "bg-primary-fixed text-primary",
      },
      {
        label: "Total Bookings",
        value: String(bookings.length),
        change: percentChange(currentThirtyDayBookings, previousThirtyDayBookings),
        trend: currentThirtyDayBookings >= previousThirtyDayBookings ? ("up" as const) : ("down" as const),
        icon: "event_available",
        tone: "bg-primary-fixed text-primary",
      },
      {
        label: "Active Guests",
        value: String(currentGuests),
        change: percentChange(currentGuests, previousGuests),
        trend: currentGuests >= previousGuests ? ("up" as const) : ("down" as const),
        icon: "groups",
        tone: "bg-baked-silt text-charred-wood",
      },
      {
        label: "Occupancy Rate",
        value: `${rooms.length === 0 ? 0 : Math.round((occupiedNow / rooms.length) * 100)}%`,
        change: percentChange(occupiedNow, occupiedPrevious),
        trend: occupiedNow >= occupiedPrevious ? ("up" as const) : ("down" as const),
        icon: "trending_up",
        tone: "bg-dry-grass text-charred-wood",
      },
    ] satisfies AdminDashboardStat[],
    revenueData: monthlyRevenue,
    bookingData: weeklyBookings,
    roomDistribution,
    recentBookings: bookings.slice(0, 4).map((booking) => ({
      id: booking.booking_code,
      guest: booking.guest_name,
      room: booking.room_name,
      checkIn: formatIsoDate(booking.check_in_date),
      amount: formatCurrency(Number(booking.total_amount)),
      status: bookingStatusLabel(booking.booking_status),
    })) satisfies AdminRecentBooking[],
  };
}
