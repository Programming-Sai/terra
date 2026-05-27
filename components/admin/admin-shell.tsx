"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/icon";
import { siteContent } from "@/lib/site-content";

type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
};

const navItems: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/bookings", label: "Bookings", icon: "calendar_month" },
  { href: "/admin/payments", label: "Payments", icon: "payments" },
  { href: "/admin/amenities", label: "Amenities", icon: "spa" },
  { href: "/admin/rooms", label: "Rooms", icon: "bed" },
  { href: "/admin/customers", label: "Customers", icon: "groups" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-bone text-charred-wood">
      <button
        aria-label={
          sidebarOpen ? "Close admin navigation" : "Open admin navigation"
        }
        className="fixed left-4 top-4 z-[70] inline-flex h-12 w-12 items-center justify-center border border-surface-container bg-white text-charred-wood shadow-lg lg:hidden"
        onClick={() => setSidebarOpen((current) => !current)}
        type="button"
      >
        <Icon name={sidebarOpen ? "close" : "menu"} className="text-2xl" />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-[min(280px,85vw)] overflow-hidden border-r border-surface-container bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.08)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-surface-container px-6 py-6">
            <Link className="block" href="/admin/dashboard">
              <div className="flex items-center gap-3">
                <Image
                  alt={`${siteContent.brand.name} logo`}
                  className="h-12 w-12 rounded-full object-cover"
                  height={48}
                  src="/logo.png"
                  width={48}
                />
                <span className="font-eczar text-2xl font-bold text-primary">
                  {siteContent.brand.name}
                </span>
              </div>
              <span className="mt-1 block font-label-caps text-[10px] font-bold uppercase tracking-[0.2em] text-outline-clay">
                Admin Panel
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded px-4 py-3 font-body-md text-[14px] transition-colors ${
                        active
                          ? "bg-primary-fixed text-primary font-bold"
                          : "text-on-surface-variant hover:bg-surface-bone hover:text-charred-wood"
                      }`}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon name={item.icon} className="text-[22px]" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-surface-container p-4">
            <button
              className="flex w-full items-center gap-3 rounded px-4 py-3 text-left font-body-md text-[14px] text-red-700 transition-colors hover:bg-surface-bone disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoggingOut}
              onClick={async () => {
                setIsLoggingOut(true);
                setSidebarOpen(false);
                try {
                  await fetch("/api/admin/logout", { method: "POST" });
                  router.push("/admin/login?logged_out=1");
                  router.refresh();
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              type="button"
            >
              {isLoggingOut ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-700 border-t-transparent" />
              ) : (
                <Icon name="logout" className="text-[22px]" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen ? (
        <button
          aria-label="Close admin navigation overlay"
          className="fixed inset-0 z-[50] bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <main className="overflow-x-hidden lg:ml-[280px]">
        <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-20 sm:px-6 sm:pt-16 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
