"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/icon";
import type { AmenityRecord } from "@/lib/amenities";
import { siteContent } from "@/lib/site-content";

function AmenityCardView({ amenity }: { amenity: AmenityRecord }) {
  return (
    <article className="group h-full border border-surface-container bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center bg-primary-fixed text-primary">
        <Icon name={amenity.icon} className="text-[28px]" />
      </div>
      <h3 className="font-eczar text-[22px] font-bold text-charred-wood">
        {amenity.title}
      </h3>
      <p className="mt-3 font-body-md text-[14px] leading-relaxed text-on-surface-variant">
        {amenity.description}
      </p>
    </article>
  );
}

export function AmenitiesPage({
  amenities,
}: {
  amenities: readonly AmenityRecord[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredAmenities = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return amenities;

    return amenities.filter((amenity) =>
      [amenity.title, amenity.description, amenity.icon]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [amenities, searchTerm]);

  const visibleAmenities = filteredAmenities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAmenities.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + 8, filteredAmenities.length),
          );
        }
      },
      {
        rootMargin: "220px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredAmenities.length, hasMore]);

  return (
    <main className="bg-surface-bone text-charred-wood">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            alt={siteContent.home.sections.amenities.imageAlt}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={siteContent.home.sections.amenities.imageSrc}
          />
        </div>
        <div className="absolute inset-0 bg-[#6c2f00]/90 mix-blend-multiply" />
        <div className="relative z-10 mx-auto max-w-[1152px] px-6 md:px-section-padding">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex bg-dry-grass/90 px-4 py-1 font-label-caps text-[10px] font-bold uppercase tracking-[0.2em] text-charred-wood">
              {siteContent.home.sections.amenities.eyebrow}
            </span>
            <h1 className="font-headline-lg text-[48px] text-white leading-tight md:text-[64px]">
              {siteContent.home.sections.amenities.title}
            </h1>
            <p className="max-w-3xl font-body-lg text-white/95 leading-relaxed">
              {siteContent.home.sections.amenities.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-section-padding md:px-section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
                Featured Services
              </span>
              <h2 className="mt-2 font-eczar text-[32px] font-bold text-charred-wood md:text-[44px]">
                Everything you can expect at Terra Lodge
              </h2>
            </div>
            <div className="w-full md:max-w-md">
              <div className="relative">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline-clay"
                />
                <input
                  aria-label="Search amenities"
                  className="w-full border border-surface-container bg-white py-3 pl-11 pr-4 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setVisibleCount(8);
                  }}
                  placeholder="Search amenities"
                  value={searchTerm}
                />
              </div>
              <p className="mt-2 text-[12px] text-outline-clay">
                Showing {visibleAmenities.length} of {filteredAmenities.length}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {visibleAmenities.map((amenity) => (
              <AmenityCardView amenity={amenity} key={amenity.id} />
            ))}
          </div>

          {filteredAmenities.length === 0 ? (
            <div className="mt-8 border border-surface-container bg-white p-8 text-center">
              <p className="font-body-md text-[14px] text-on-surface-variant">
                No amenities match your search.
              </p>
            </div>
          ) : null}

          {hasMore ? (
            <div ref={sentinelRef} className="h-8" aria-hidden="true" />
          ) : null}
        </div>
      </section>
    </main>
  );
}
