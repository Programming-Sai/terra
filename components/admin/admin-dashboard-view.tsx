import Icon from "@/components/icon";
import type {
  AdminDashboardStat,
  AdminRecentBooking,
  AdminRoomSlice,
  AdminSeriesPoint,
} from "@/lib/admin-data";

type Stat = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  tone: string;
};

type SeriesPoint = {
  label: string;
  value: number;
};

type RoomSlice = {
  name: string;
  value: number;
  color: string;
};

type RecentBooking = {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  amount: string;
  status: "Confirmed" | "Pending";
};

const stats: Stat[] = [
  {
    label: "Total Revenue",
    value: "GH₵ 45,280",
    change: "+12.5%",
    trend: "up",
    icon: "payments",
    tone: "bg-primary-fixed text-primary",
  },
  {
    label: "Total Bookings",
    value: "127",
    change: "+8.2%",
    trend: "up",
    icon: "event_available",
    tone: "bg-primary-container text-charred-wood",
  },
  {
    label: "Active Guests",
    value: "34",
    change: "-3.1%",
    trend: "down",
    icon: "groups",
    tone: "bg-baked-silt text-charred-wood",
  },
  {
    label: "Occupancy Rate",
    value: "78%",
    change: "+5.4%",
    trend: "up",
    icon: "trending_up",
    tone: "bg-dry-grass text-charred-wood",
  },
];

const revenueData: SeriesPoint[] = [
  { label: "Jan", value: 4200 },
  { label: "Feb", value: 3800 },
  { label: "Mar", value: 5100 },
  { label: "Apr", value: 4600 },
  { label: "May", value: 5400 },
  { label: "Jun", value: 4800 },
];

const bookingData: SeriesPoint[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 19 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 28 },
  { label: "Sat", value: 35 },
  { label: "Sun", value: 31 },
];

const roomDistribution: RoomSlice[] = [
  { name: "Silt Suite", value: 45, color: "#4a1e00" },
  { name: "Basalt Retreat", value: 35, color: "#877369" },
  { name: "Lodge Suite", value: 30, color: "#d8b79f" },
  { name: "Others", value: 17, color: "#8b4513" },
];

const recentBookings: RecentBooking[] = [
  {
    id: "BK-1234",
    guest: "Kwame Mensah",
    room: "The Silt Suite",
    checkIn: "2026-05-20",
    amount: "GH₵ 650",
    status: "Confirmed",
  },
  {
    id: "BK-1235",
    guest: "Ama Owusu",
    room: "Basalt Retreat",
    checkIn: "2026-05-21",
    amount: "GH₵ 500",
    status: "Pending",
  },
  {
    id: "BK-1236",
    guest: "Kofi Asante",
    room: "Lodge Suite",
    checkIn: "2026-05-22",
    amount: "GH₵ 800",
    status: "Confirmed",
  },
  {
    id: "BK-1237",
    guest: "Efua Boateng",
    room: "The Silt Suite",
    checkIn: "2026-05-23",
    amount: "GH₵ 650",
    status: "Confirmed",
  },
];

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden border border-surface-container bg-white p-4 sm:p-6 ${className}`}>
      <div className="mb-5 flex flex-col sm:mb-6">
        <h2 className="font-eczar text-[20px] font-bold text-charred-wood sm:text-[24px]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="border border-surface-container bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-sm ${stat.tone}`}
        >
          <Icon name={stat.icon} className="text-[24px]" filled />
        </div>
        <div
          className={`flex items-center gap-1 text-[12px] font-bold ${
            stat.trend === "up" ? "text-green-700" : "text-red-700"
          }`}
        >
          <Icon
            name={stat.trend === "up" ? "trending_up" : "trending_down"}
            className="text-[18px]"
          />
          <span>{stat.change}</span>
        </div>
      </div>
      <div className="mb-1 font-nimbus text-[28px] font-bold text-charred-wood">
        {stat.value}
      </div>
      <p className="font-body-md text-[14px] text-outline-clay">{stat.label}</p>
    </div>
  );
}

function BarChart({
  title,
  data,
  valueLabel,
}: {
  title: string;
  data: SeriesPoint[];
  valueLabel: string;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Panel title={title}>
      <div className="mb-4 flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-outline-clay sm:flex-row sm:items-center sm:justify-between">
        <span>{valueLabel}</span>
        <span>{Math.max(...data.map((item) => item.value)).toLocaleString()}</span>
      </div>
      <div className="flex h-[220px] items-end gap-2 overflow-x-hidden border-b border-l border-surface-container pb-3 pl-2 sm:h-[280px] sm:gap-4 sm:pb-4 sm:pl-4">
        {data.map((item) => {
          const height = Math.max((item.value / max) * 100, 8);

          return (
            <div
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2 sm:gap-3"
              key={item.label}
            >
              <div className="flex h-[170px] w-full items-end justify-center sm:h-[220px]">
                <div
                  className="w-full max-w-[28px] rounded-t-sm bg-primary shadow-[0_12px_24px_rgba(74,30,0,0.15)] sm:max-w-[42px]"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-center font-body-md text-[10px] text-outline-clay sm:text-[12px]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function DonutChart({
  title,
  slices,
}: {
  title: string;
  slices: RoomSlice[];
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const { gradient } = slices.reduce(
    (accumulator, slice) => {
      const start = accumulator.cursor;
      const end = accumulator.cursor + (slice.value / total) * 100;
      accumulator.cursor = end;
      accumulator.gradient.push(`${slice.color} ${start}% ${end}%`);
      return accumulator;
    },
    { cursor: 0, gradient: [] as string[] },
  );

  return (
    <Panel title={title}>
      <div className="flex flex-col items-center gap-5 sm:gap-6">
        <div
          className="relative h-44 w-44 rounded-full sm:h-56 sm:w-56"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >
          <div className="absolute inset-6 rounded-full bg-white shadow-inner sm:inset-8" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-eczar text-2xl font-bold text-charred-wood sm:text-3xl">
                {total}
              </div>
              <div className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
                Rooms
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full gap-2 sm:grid-cols-2 sm:gap-3">
          {slices.map((slice) => (
            <div className="flex items-center gap-2 sm:gap-3" key={slice.name}>
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="font-body-md text-[13px] text-on-surface-variant sm:text-[14px]">
                {slice.name} <span className="text-outline-clay">{slice.value}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function RecentBookingsTable({ bookings }: { bookings: AdminRecentBooking[] }) {
  return (
    <Panel title="Recent Bookings" className="lg:col-span-2">
      <div className="overflow-x-auto">
        <table className="min-w-[640px] sm:min-w-full">
          <thead>
            <tr className="border-b border-surface-container text-left">
              {[
                "Booking ID",
                "Guest",
                "Room",
                "Check-In",
                "Amount",
                "Status",
              ].map((heading) => (
                <th
                  className="pb-3 font-label-caps text-[11px] font-bold uppercase tracking-wider text-outline-clay sm:text-[12px]"
                  key={heading}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr className="border-b border-surface-container last:border-b-0" key={booking.id}>
                <td className="py-4 font-body-md text-[13px] font-medium text-charred-wood sm:text-[14px]">
                  {booking.id}
                </td>
                <td className="py-4 font-body-md text-[13px] text-charred-wood sm:text-[14px]">
                  {booking.guest}
                </td>
                <td className="py-4 font-body-md text-[13px] text-on-surface-variant sm:text-[14px]">
                  {booking.room}
                </td>
                <td className="py-4 font-body-md text-[13px] text-on-surface-variant sm:text-[14px]">
                  {booking.checkIn}
                </td>
                <td className="py-4 font-body-md text-[13px] font-bold text-primary sm:text-[14px]">
                  {booking.amount}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

type AdminDashboardViewProps = {
  data?: {
    stats: AdminDashboardStat[];
    revenueData: AdminSeriesPoint[];
    bookingData: AdminSeriesPoint[];
    roomDistribution: AdminRoomSlice[];
    recentBookings: AdminRecentBooking[];
  };
};

function AdminDashboardContent({ data }: AdminDashboardViewProps = {}) {
  const dashboard = data ?? {
    stats,
    revenueData,
    bookingData,
    roomDistribution,
    recentBookings,
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <span className="font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
          Admin Overview
        </span>
        <h1 className="font-eczar text-[36px] font-bold text-charred-wood">
          Dashboard
        </h1>
        <p className="max-w-2xl font-body-md text-[14px] leading-relaxed text-on-surface-variant">
          Welcome back. Here&apos;s a snapshot of revenue, occupancy, and recent
          booking activity at Terra Lodge.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChart
          data={dashboard.revenueData}
          title="Revenue Overview"
          valueLabel="Monthly Revenue"
        />
        <BarChart
          data={dashboard.bookingData}
          title="Weekly Bookings"
          valueLabel="Bookings"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DonutChart slices={dashboard.roomDistribution} title="Room Distribution" />
        <RecentBookingsTable bookings={dashboard.recentBookings} />
      </section>
    </div>
  );
}

export function AdminDashboardView(props: AdminDashboardViewProps = {}) {
  return <AdminDashboardContent {...props} />;
}
