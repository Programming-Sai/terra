import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icon";
import { siteContent } from "@/lib/site-content";

type Value = (typeof siteContent.about.values)[number];
type Amenity = (typeof siteContent.home.amenities)[number];

const values = siteContent.about.values;
const featuredAmenities = siteContent.home.amenities.slice(0, 4);
const aboutGallery = [
  {
    src: "/spots/spot-1.jpeg",
    alt: "Hallways",
  },
  {
    src: "/spots/spot-2.jpeg",
    alt: "",
  },
  {
    src: "/spots/spot-3-reception.jpeg",
    alt: "Reception area",
  },
  {
    src: "/spots/spot-4-mountain-view.jpeg",
    alt: "Mountain View",
  },
  {
    src: "/spots/spot-5-entrance.jpeg",
    alt: "A quiet corner at Terra Lodge",
  },
  {
    src: "/spots/spot-6.jpeg",
    alt: "Balcony",
  },
] as const;

export const metadata: Metadata = {
  title: `About | ${siteContent.brand.name}`,
  description: `Learn the story, values, and hospitality approach behind ${siteContent.brand.name}.`,
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
        {eyebrow}
      </span>
      <h2 className="font-headline-md text-charred-wood font-bold text-3xl md:text-4xl">
        {title}
      </h2>
      <p className="font-body-md text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ValueCard({ value }: { value: Value }) {
  return (
    <article className="border border-surface-container bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="bg-primary-fixed text-primary p-3">
          <Icon name={value.icon} className="text-2xl" />
        </div>
        <div className="space-y-2">
          <h3 className="font-headline-sm text-xl font-bold text-charred-wood">
            {value.title}
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {value.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function AmenityCard({ amenity }: { amenity: Amenity }) {
  return (
    <article className="border border-surface-container bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-primary-fixed text-primary">
          <Icon name={amenity.icon} className="text-[24px]" />
        </div>
        <div>
          <h3 className="font-headline-sm text-[18px] font-bold text-charred-wood">
            {amenity.title}
          </h3>
          <p className="mt-2 font-body-md text-[14px] leading-relaxed text-on-surface-variant">
            {amenity.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function ImagePanel({
  alt,
  src,
  className = "",
}: {
  alt: string;
  src: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-surface-container bg-white shadow-sm ${className}`}
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        sizes="(max-width: 768px) 100vw, 45vw"
        src={src}
      />
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-surface-container border-l-4 border-l-primary bg-white px-5 py-4 shadow-sm">
      <p className="font-label-caps text-[11px] font-bold uppercase tracking-widest text-laterite-red">
        {label}
      </p>
      <p className="mt-2 font-body-md text-[14px] leading-relaxed text-charred-wood">
        {value}
      </p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-surface-bone text-charred-wood">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0">
          <Image
            alt={siteContent.about.hero.imageAlt}
            className="object-cover object-[50%_65%] brightness-[0.68]"
            fill
            priority
            sizes="100vw"
            src={siteContent.about.hero.imageSrc}
          />
          <div className="absolute inset-0 bg-[#6c2f00]/70 mix-blend-multiply" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1152px] px-6 md:px-section-padding">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex bg-dry-grass/90 px-4 py-1 font-label-caps text-[10px] font-bold uppercase tracking-[0.2em] text-charred-wood shadow-sm">
              {siteContent.about.hero.eyebrow}
            </span>
            <h1 className="font-headline-lg text-[48px] leading-tight text-white drop-shadow-lg md:text-[64px]">
              {siteContent.about.hero.title}
            </h1>
            <p className="max-w-3xl font-body-lg text-white/95 leading-relaxed">
              {siteContent.about.hero.description}
            </p>
            <p className="max-w-3xl font-body-md text-[15px] leading-relaxed text-white/85">
              Terra Lodge is built for guests who want a quiet place to stay in
              Accra with the essentials close at hand. If you are deciding
              whether it fits your trip, the quick facts below are the things
              most travelers want first.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1152px] px-6 pt-10 md:px-section-padding pb-24">
        <div className="grid gap-4 border border-surface-container bg-white p-6 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
          {siteContent.about.guestSnapshot.map((item) => (
            <InfoBox key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      <section className="border-y border-surface-container bg-white px-6 py-section-padding md:px-section-padding">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeading
              eyebrow={siteContent.about.welcome.eyebrow}
              title={siteContent.about.welcome.title}
              description={siteContent.about.welcome.description}
            />

            <div className="space-y-4">
              <p className="font-body-md text-[15px] leading-relaxed text-on-surface-variant">
                {siteContent.about.commitment.description}
              </p>
              <p className="font-body-md text-[15px] leading-relaxed text-on-surface-variant">
                The lodge is intentionally straightforward. Guests come for a
                quiet environment, dependable room basics, and access to the
                practical things that matter most during a stay in the city.
              </p>
              <p className="font-body-md text-[15px] leading-relaxed text-on-surface-variant">
                We also keep the information simple: where it is, what it
                includes, who it suits, and what daily stay details to expect.
                That makes the page useful before a guest even reaches out.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {siteContent.about.guestNeeds.map((item, index) => (
                <article
                  className="border border-surface-container bg-surface-container-low p-5 shadow-sm"
                  key={item}
                >
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-surface-container bg-white font-label-caps text-[11px] font-bold text-laterite-red">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="font-body-md text-[14px] leading-relaxed text-on-surface-variant">
                      {item}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <ImagePanel
              alt={siteContent.about.welcome.imageAlt}
              className="aspect-[16/11] sm:col-span-2 lg:col-span-1"
              src={siteContent.about.welcome.imageSrc}
            />
            <ImagePanel
              alt="Terra Lodge exterior and entry detail"
              className="aspect-[4/3]"
              src="/spots/spot-1.jpeg"
            />
            <ImagePanel
              alt={siteContent.about.commitment.imageAlt}
              className="aspect-[4/3]"
              src={siteContent.about.commitment.imageSrc}
            />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-section-padding py-section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
              Featured Amenities
            </span>
            <h2 className="mt-2 font-headline-md text-charred-wood font-bold text-3xl md:text-4xl">
              The top comforts guests ask about first
            </h2>
            <p className="mt-4 max-w-3xl font-body-md text-on-surface-variant leading-relaxed">
              These are the featured amenities we highlight most often. We are
              only showing the top four here so the page stays focused and easy
              to scan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredAmenities.map((amenity) => (
              <AmenityCard amenity={amenity} key={amenity.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-section-padding pb-section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                Spaces
              </span>
              <h2 className="font-headline-md text-charred-wood font-bold text-3xl md:text-4xl">
                A few quiet corners from around the lodge
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                These images are placed here to help first-time guests picture
                the arrival experience, reception, and the overall mood of the
                property before they book.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {aboutGallery.map((item) => (
                <div
                  className="relative aspect-[4/5] overflow-hidden border border-surface-container bg-white shadow-sm"
                  key={item.alt}
                >
                  <Image
                    alt={item.alt}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    src={item.src}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-section-padding py-section-padding bg-surface-container-low border-y border-surface-container">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
              {siteContent.about.valuesHeading.eyebrow}
            </span>
            <h2 className="font-headline-md text-charred-wood font-bold text-3xl md:text-4xl">
              {siteContent.about.valuesHeading.title}
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              {siteContent.about.valuesHeading.description}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <ValueCard key={value.title} value={value} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-section-padding py-section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
            Get In Touch
          </span>
          <h2 className="font-headline-md text-charred-wood font-bold text-3xl md:text-4xl">
            {siteContent.about.cta.title}
          </h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {siteContent.about.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              className="bg-primary text-white px-6 py-3 font-label-caps text-xs font-bold uppercase transition-all hover:bg-laterite-red shadow-md"
              href="/contact"
            >
              {siteContent.about.cta.primary}
            </Link>
            <Link
              className="border-2 border-charred-wood px-6 py-3 font-label-caps text-xs font-bold uppercase hover:bg-charred-wood hover:text-white transition-all"
              href="/rooms"
            >
              {siteContent.about.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
