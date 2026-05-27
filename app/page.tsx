import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import AvailabilitySearch from "@/components/availability-search";
import {
  AmenitiesSection,
  FeaturedRoomsSection,
  LocationSection,
} from "@/components/home-sections";
import TestimonialsSection from "@/components/testimonials-section";
import { getAmenities } from "@/lib/amenities";
import { getPriceConversion } from "@/lib/currency";
import { getRooms } from "@/lib/room-data";
import { getSiteSettings } from "@/lib/site-settings";
import { siteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteContent.brand.name} | ${siteContent.brand.tagline}`,
  description: siteContent.brand.description,
};

export default async function Page() {
  const acceptLanguage = (await headers()).get("accept-language");
  const [rooms, amenities, priceConversion, siteSettings] = await Promise.all([
    getRooms(),
    getAmenities(),
    getPriceConversion(acceptLanguage),
    getSiteSettings(),
  ]);
  const heroSettings = siteSettings.heroSettings;

  return (
    <main
      className="bg-surface-bone text-charred-wood selection:bg-dry-grass relative"
      id="home"
    >
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-12 pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            alt={heroSettings.imageAlt}
            className="object-cover object-[50%_75%] brightness-75"
            fill
            priority
            sizes="100vw"
            src={heroSettings.imageSrc}
          />
          <div className="absolute inset-0 bg-[#6c2f00]/70 mix-blend-multiply" />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <span className="inline-block bg-dry-grass/90 text-charred-wood px-4 py-1 font-label-caps text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
            {heroSettings.badge}
          </span>
          <h1 className="font-eczar text-[48px] md:text-[80px] leading-tight text-white drop-shadow-lg font-bold">
            {heroSettings.title}
          </h1>
          <p className="font-body-lg text-white mt-6 max-w-2xl mx-auto drop-shadow-md font-medium">
            {heroSettings.description}
          </p>
        </div>

        {heroSettings.showAvailabilityWidget ? (
          <div className="relative z-20 mt-12 w-full max-w-6xl">
            <AvailabilitySearch submitLabel="Check Availability" />
          </div>
        ) : null}
      </section>

      <AmenitiesSection amenities={amenities} />
      <FeaturedRoomsSection priceConversion={priceConversion} rooms={rooms} />
      <TestimonialsSection testimonials={siteContent.home.testimonials} />
      <LocationSection />
    </main>
  );
}
