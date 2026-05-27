"use client";

import Icon from "./icon";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/lib/site-content";

type NavLink = {
  label: string;
  href: string;
};
const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Amenities", href: "/amenities" },
  { label: "Rooms", href: "/rooms" },
  { label: "Contact", href: "/contact" },
];

const mobileNavLinks = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Amenities", href: "/amenities", icon: "spa" },
  { label: "Rooms", href: "/rooms", icon: "bed" },
  { label: "About", href: "/about", icon: "info" },
  { label: "Contact", href: "/contact", icon: "call" },
] as const;

export const Header = () => {
  const pathname = usePathname();
  const isRoomContext =
    pathname.startsWith("/room") || pathname.startsWith("/checkout");

  const isActiveLink = (href: string) =>
    pathname === href || (href === "/rooms" && isRoomContext);

  return (
    <>
      <header>
        <nav className="w-full top-0 sticky flex justify-between items-center gap-4 px-6 md:px-12 py-5 max-w-full mx-auto z-50 bg-white border-b border-surface-container-high shadow-sm transition-all duration-300">
          <Link
            className="flex items-center gap-3 font-headline-sm text-headline-sm font-bold text-charred-wood"
            href="/"
          >
            <Image
              alt={`${siteContent.brand.name} logo`}
              className="h-11 w-11 rounded-full object-cover"
              height={44}
              src="/logo.png"
              width={44}
            />
            <span className="tracking-tight">{siteContent.brand.name}</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                aria-current={isActiveLink(link.href) ? "page" : undefined}
                className={`font-label-caps uppercase hover:text-primary transition-colors border-b-2 pb-1 ${
                  isActiveLink(link.href)
                    ? "text-charred-wood border-primary font-bold"
                    : "text-on-surface-variant border-transparent font-semibold"
                }`}
                href={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-1 font-body-md font-bold text-primary">
            <Icon name="call" className="text-sm" />
            <span>{siteContent.contact.phone}</span>
          </div>
        </nav>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-[90] border-t border-surface-container-high bg-white/95 backdrop-blur md:hidden print:hidden"
      >
        <div className="grid grid-cols-5">
          {mobileNavLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  active
                    ? "border-b-2 border-primary bg-primary-fixed text-primary"
                    : "border-b-2 border-transparent text-on-surface-variant"
                }`}
                href={link.href}
                key={link.label}
              >
                <Icon name={link.icon} size={30} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
