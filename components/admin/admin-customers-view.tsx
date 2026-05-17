"use client";

import { useMemo, useState, type ReactNode } from "react";
import Icon from "@/components/icon";
import type { AdminCustomerRecord } from "@/lib/admin-data";
import { AdminPagination } from "@/components/admin/admin-pagination";

type CustomerStatus = "Active" | "VIP" | "Inactive";

type CustomerRecord = {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  status: CustomerStatus;
  joinDate: string;
  address: string;
};

const mockCustomers: CustomerRecord[] = [
  {
    id: 1,
    name: "Kwame Mensah",
    email: "kwame.mensah@email.com",
    phone: "+233 24 123 4567",
    totalBookings: 8,
    totalSpent: 5200,
    lastBooking: "2026-05-17",
    status: "Active",
    joinDate: "2025-08-15",
    address: "123 Main Street, Accra, Ghana",
  },
  {
    id: 2,
    name: "Ama Owusu",
    email: "ama.owusu@email.com",
    phone: "+233 24 234 5678",
    totalBookings: 5,
    totalSpent: 3250,
    lastBooking: "2026-04-22",
    status: "Active",
    joinDate: "2025-10-20",
    address: "456 Oak Avenue, Kumasi, Ghana",
  },
  {
    id: 3,
    name: "Kofi Asante",
    email: "kofi.asante@email.com",
    phone: "+233 24 345 6789",
    totalBookings: 12,
    totalSpent: 9600,
    lastBooking: "2026-05-10",
    status: "VIP",
    joinDate: "2025-03-12",
    address: "789 Palm Street, Takoradi, Ghana",
  },
  {
    id: 4,
    name: "Efua Boateng",
    email: "efua.boateng@email.com",
    phone: "+233 24 456 7890",
    totalBookings: 3,
    totalSpent: 1950,
    lastBooking: "2026-05-05",
    status: "Active",
    joinDate: "2026-01-08",
    address: "321 River Road, Tamale, Ghana",
  },
  {
    id: 5,
    name: "Yaw Osei",
    email: "yaw.osei@email.com",
    phone: "+233 24 567 8901",
    totalBookings: 1,
    totalSpent: 1200,
    lastBooking: "2025-12-20",
    status: "Inactive",
    joinDate: "2025-11-15",
    address: "654 Beach Lane, Cape Coast, Ghana",
  },
  {
    id: 6,
    name: "Akua Mensah",
    email: "akua.mensah@email.com",
    phone: "+233 24 678 9012",
    totalBookings: 7,
    totalSpent: 4550,
    lastBooking: "2026-05-12",
    status: "Active",
    joinDate: "2025-06-22",
    address: "987 Hill View, Sunyani, Ghana",
  },
];

function statusClass(status: CustomerStatus) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "vip":
      return "bg-purple-100 text-purple-800";
    case "inactive":
      return "bg-surface-container text-outline-clay";
    default:
      return "bg-surface-container text-outline-clay";
  }
}

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8">
      <span className="font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
        Admin Management
      </span>
      <h1 className="mt-2 font-eczar text-[36px] font-bold text-charred-wood">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl font-body-md text-[14px] leading-relaxed text-on-surface-variant">
        {description}
      </p>
    </header>
  );
}

function MetricCard({
  value,
  label,
  accentClassName,
}: {
  value: ReactNode;
  label: string;
  accentClassName?: string;
}) {
  return (
    <div className="border border-surface-container bg-white p-6">
      <div
        className={`mb-1 font-nimbus text-[32px] font-bold ${accentClassName ?? "text-charred-wood"}`}
      >
        {value}
      </div>
      <p className="font-body-md text-[14px] text-outline-clay">{label}</p>
    </div>
  );
}

function Detail({
  label,
  value,
  span = false,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <p className="mb-1 font-label-caps text-[10px] font-bold uppercase tracking-widest text-outline-clay">
        {label}
      </p>
      <p className="font-body-md text-[14px] text-charred-wood">{value}</p>
    </div>
  );
}

function Modal({
  customer,
  onClose,
}: {
  customer: CustomerRecord;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white">
        <div className="bg-primary p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-eczar text-[28px] font-bold">
                {customer.name}
              </h2>
              <p className="mt-1 font-body-md text-sm">
                Customer ID: {customer.id}
              </p>
            </div>
            <button
              aria-label="Close customer details"
              className="text-white transition-colors hover:text-dry-grass"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" className="text-[28px]" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <section className="border-b border-surface-container pb-6">
            <h3 className="mb-4 font-eczar text-[20px] font-bold text-charred-wood">
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Email" value={customer.email} />
              <Detail label="Phone" value={customer.phone} />
              <Detail label="Address" span value={customer.address} />
            </div>
          </section>

          <section className="border-b border-surface-container pb-6">
            <h3 className="mb-4 font-eczar text-[20px] font-bold text-charred-wood">
              Booking Statistics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Total Bookings" value={String(customer.totalBookings)} />
              <Detail label="Total Spent" value={`GH₵ ${customer.totalSpent.toLocaleString()}`} />
              <Detail label="Last Booking" value={customer.lastBooking} />
              <Detail label="Join Date" value={customer.joinDate} />
            </div>
          </section>

          <section>
            <h3 className="mb-4 font-eczar text-[20px] font-bold text-charred-wood">
              Status
            </h3>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusClass(customer.status)}`}
            >
              {customer.status}
            </span>
          </section>

          <div className="flex flex-col gap-3 border-t border-surface-container pt-6 sm:flex-row">
            <button
              className="flex-1 bg-primary px-6 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red"
              type="button"
            >
              View Bookings
            </button>
            <button
              className="flex-1 border-2 border-primary bg-white px-6 py-3 font-label-caps text-sm font-bold uppercase text-primary transition-colors hover:bg-surface-bone"
              type="button"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type AdminCustomersViewProps = {
  customers?: AdminCustomerRecord[];
};

function AdminCustomersContent({ customers = mockCustomers }: AdminCustomersViewProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(
    null,
  );
  const pageSize = 5;

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(searchTerm)
      );
    });
  }, [customers, searchTerm]);

  const pageCount = Math.max(Math.ceil(filteredCustomers.length / pageSize), 1);

  const displayPage = Math.min(page, pageCount);

  const paginatedCustomers = useMemo(() => {
    const start = (displayPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [displayPage, filteredCustomers]);

  return (
    <div>
      <PageHeader
        description="Review guest profiles, booking history, and customer value across the lodge."
        title="Customers"
      />

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Customers" value={customers.length} />
        <MetricCard
          accentClassName="text-green-700"
          label="Active Customers"
          value={customers.filter((customer) => customer.status === "Active").length}
        />
        <MetricCard
          accentClassName="text-purple-700"
          label="VIP Customers"
          value={customers.filter((customer) => customer.status === "VIP").length}
        />
        <MetricCard
          accentClassName="text-primary"
          label="Total Revenue"
          value={`GH₵ ${customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}`}
        />
      </section>

      <section className="mb-6 border border-surface-container bg-white p-4 sm:p-6">
        <div className="relative">
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
            placeholder="Search by name, email, or phone number..."
            value={searchTerm}
          />
        </div>
      </section>

      <section className="border border-surface-container bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] sm:min-w-full">
            <thead className="bg-surface-bone">
              <tr className="border-b border-surface-container">
                {[
                  "Customer",
                  "Contact",
                  "Bookings",
                  "Spent",
                  "Last Booking",
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
              {paginatedCustomers.map((customer) => (
                <tr
                  className="border-b border-surface-container transition-colors hover:bg-surface-bone"
                  key={customer.id}
                >
                  <td className="px-4 py-4">
                    <p className="font-body-md text-[13px] font-bold text-charred-wood sm:text-[14px]">
                      {customer.name}
                    </p>
                    <p className="font-body-md text-[11px] text-outline-clay sm:text-[12px]">
                      ID: {customer.id}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-[12px] text-charred-wood sm:text-[13px]">
                      <Icon name="mail" className="text-[16px] text-outline-clay" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[12px] text-charred-wood sm:text-[13px]">
                      <Icon name="call" className="text-[16px] text-outline-clay" />
                      <span>{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-body-md text-[13px] font-bold text-charred-wood sm:text-[14px]">
                    {customer.totalBookings}
                  </td>
                  <td className="px-4 py-4 font-body-md text-[13px] font-bold text-primary sm:text-[14px]">
                    GH₵ {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 font-body-md text-[13px] text-on-surface-variant sm:text-[14px]">
                    {customer.lastBooking}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusClass(customer.status)}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      aria-label={`View customer ${customer.name}`}
                      className="text-primary transition-colors hover:text-laterite-red"
                      onClick={() => setSelectedCustomer(customer)}
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
          itemLabel="customers"
          onPageChange={setPage}
          page={displayPage}
          pageCount={pageCount}
          pageSize={pageSize}
          total={filteredCustomers.length}
        />
      </section>

      {selectedCustomer ? (
        <Modal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      ) : null}
    </div>
  );
}

export function AdminCustomersView(props: AdminCustomersViewProps = {}) {
  return <AdminCustomersContent {...props} />;
}
