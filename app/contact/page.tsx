import type { Metadata } from "next";
import ContactPageClient from "@/components/contact-page-client";
import { siteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Contact | ${siteContent.brand.name}`,
  description: `Contact ${siteContent.brand.name} for bookings and guest support.`,
};

export default async function ContactPage() {
  return (
    <ContactPageClient
      heroImage={{
        alt: siteContent.contact.heroImageAlt,
        image: siteContent.contact.heroImageSrc,
      }}
    />
  );
}
