"use client";

import { useMemo, useState } from "react";
import { siteContent } from "@/lib/site-content";

export type Testimonial = {
  quote: string;
  initials: string;
  name: string;
  location: string;
  rating: number;
  accentClassName: string;
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 170;
  const shouldTruncate = testimonial.quote.length > maxLength;
  const displayedQuote =
    expanded || !shouldTruncate
      ? testimonial.quote
      : `${testimonial.quote.slice(0, maxLength).trimEnd()}…`;

  return (
    <blockquote className="bg-surface-container-low p-8 border border-surface-container shadow-sm hover:shadow-md transition-all h-full">
      <div
        className="flex gap-1 text-dry-grass mb-4"
        aria-label={`${testimonial.rating} star rating`}
      >
        {Array.from({ length: 5 }).map((_, index) =>
          index < testimonial.rating ? (
            <svg
              aria-hidden="true"
              className="h-5 w-5 fill-current"
              key={index}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l2.95 6.63 7.2.62-5.46 4.72 1.63 7.03L12 17.39 5.68 21l1.63-7.03L1.85 9.25l7.2-.62L12 2z" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              key={index}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l2.95 6.63 7.2.62-5.46 4.72 1.63 7.03L12 17.39 5.68 21l1.63-7.03L1.85 9.25l7.2-.62L12 2z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          ),
        )}
      </div>
      <p className="font-body-md italic text-on-surface-variant mb-3 leading-relaxed">
        &quot;{displayedQuote}&quot;
      </p>
      {shouldTruncate ? (
        <button
          className="mb-5 inline-flex items-center gap-1 font-label-caps text-[11px] font-bold uppercase tracking-widest text-primary hover:underline"
          onClick={() => setExpanded((current) => !current)}
          type="button"
        >
          {expanded ? "Less" : "More"}
        </button>
      ) : null}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${testimonial.accentClassName} rounded-full flex items-center justify-center text-white font-bold`}
        >
          {testimonial.initials}
        </div>
        <div>
          <h4 className="font-bold text-charred-wood text-sm">{testimonial.name}</h4>
          <p className="text-xs text-outline-clay">{testimonial.location}</p>
        </div>
      </div>
    </blockquote>
  );
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: readonly Testimonial[];
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleTestimonials = useMemo(
    () => (showAll ? testimonials : testimonials.slice(0, 3)),
    [showAll, testimonials],
  );

  return (
    <section className="px-6 md:px-section-padding py-section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
            {siteContent.home.sections.testimonials.eyebrow}
          </span>
          <h2 className="font-headline-md text-charred-wood font-bold mt-2">
            {siteContent.home.sections.testimonials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>

        {testimonials.length > 3 ? (
          <div className="mt-10 flex justify-center">
            <button
              className="inline-flex items-center justify-center border-2 border-primary px-6 py-3 font-label-caps text-xs font-bold uppercase text-primary transition-all hover:bg-primary hover:text-white"
              onClick={() => setShowAll((current) => !current)}
              type="button"
            >
              {showAll ? "View Less" : "View All"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
