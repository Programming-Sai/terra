import React from "react";
import Link from "next/link";
import { siteContent } from "@/lib/site-content";

function SocialMark({ name }: { name: string }) {
  switch (name) {
    case "Facebook":
      return (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M14 8.5V7.1c0-.7.5-1.1 1.2-1.1H17V3h-2.4C12.2 3 11 4.4 11 6.5V8.5H9v3h2v9h3v-9h2.4l.6-3H14Z"
            fill="currentColor"
          />
        </svg>
      );
    case "Instagram":
      return (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M7.2 3.5h9.6A3.7 3.7 0 0 1 20.5 7.2v9.6a3.7 3.7 0 0 1-3.7 3.7H7.2a3.7 3.7 0 0 1-3.7-3.7V7.2A3.7 3.7 0 0 1 7.2 3.5Zm0 2A1.7 1.7 0 0 0 5.5 7.2v9.6a1.7 1.7 0 0 0 1.7 1.7h9.6a1.7 1.7 0 0 0 1.7-1.7V7.2a1.7 1.7 0 0 0-1.7-1.7H7.2Zm9.3 1.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 8.2A3.8 3.8 0 1 1 12 15.8a3.8 3.8 0 0 1 0-7.6Zm0 2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z"
            fill="currentColor"
          />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M12.1 3A8.9 8.9 0 0 0 4.4 16.3L3 21l4.8-1.3A8.9 8.9 0 1 0 12.1 3Zm0 2a6.9 6.9 0 0 1 0 13.8c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.8.8.8-2.7-.1-.2A6.9 6.9 0 1 1 12.1 5Zm3.3 9.2c-.2.5-1 .9-1.4 1-.4.1-.8.1-1.2-.1-.4-.2-1.6-.7-3-2.1-1.1-1.1-1.8-2.5-2-2.9-.2-.4 0-.7.2-.9l.6-.7c.2-.2.3-.3.5-.5.2-.2.3-.2.5-.1l1.2 1.5c.1.2.1.4 0 .5l-.4.5c-.1.1-.2.3-.1.5.1.2.4.8 1 1.4.8.8 1.5 1.1 1.7 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.5 1c.2.1.2.3.1.5Z"
            fill="currentColor"
          />
        </svg>
      );
    case "X":
      return (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M4 4h4.2l4.1 5.5L16.8 4H20l-5.4 7 5.9 9H16l-4.5-6-4.6 6H4.1l5.8-7.5L4 4Zm4.3 2.1 8.1 11.8h1.8L10.1 6.1H8.3Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
}

export const Footer = () => {
  return (
    <footer className="w-full relative bg-charred-wood text-white print:hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-section-padding py-16 w-full max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <div className="font-headline-md text-dry-grass font-bold mb-4">
            {siteContent.brand.name}
          </div>
          <p className="font-body-md text-baked-silt text-sm leading-relaxed mb-6">
            {siteContent.brand.description}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-xs text-dry-grass/60 uppercase font-bold tracking-widest mb-2">
            Company
          </span>
          <Link
            className="text-baked-silt hover:text-white transition-colors font-body-md text-sm"
            href="/about"
          >
            About Us
          </Link>
          <Link
            className="text-baked-silt hover:text-white transition-colors font-body-md text-sm"
            href="/rooms"
          >
            Rooms &amp; Rates
          </Link>
          <Link
            className="text-baked-silt hover:text-white transition-colors font-body-md text-sm"
            href="/about"
          >
            Our Services
          </Link>
          <Link
            className="text-baked-silt hover:text-white transition-colors font-body-md text-sm"
            href="/contact"
          >
            Contact Us
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-xs text-dry-grass/60 uppercase font-bold tracking-widest mb-2">
            Location
          </span>
          {siteContent.contact.addressLines.map((line) => (
            <p className="text-baked-silt font-body-md text-sm" key={line}>
              {line}
            </p>
          ))}
          <p className="text-baked-silt font-body-md text-sm">
            {siteContent.contact.email}
          </p>
          <p className="text-baked-silt font-body-md text-sm">
            {siteContent.contact.phone}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-xs text-dry-grass/60 uppercase font-bold tracking-widest mb-2">
            Socials
          </span>
          <div className="flex flex-wrap gap-3">
            {siteContent.socialLinks.map((social) => (
              <a
                aria-label={social.label}
                className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                href={social.href}
                key={social.label}
                rel="noreferrer"
                target="_blank"
              >
                <SocialMark name={social.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 md:px-section-padding pb-8 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8">
        <span className="font-label-micro text-[10px] text-baked-silt/50 uppercase font-bold tracking-widest">
          {siteContent.footer.copyright}
        </span>
        <div className="flex gap-6 mt-4 md:mt-0 items-center">
          <span className="text-[10px] text-baked-silt/50 uppercase font-bold">
            Privacy Policy
          </span>
          <span className="text-[10px] text-baked-silt/50 uppercase font-bold">
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
};
