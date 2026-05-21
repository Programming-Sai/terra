import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icon";
import { siteContent } from "@/lib/site-content";

type Value = (typeof siteContent.about.values)[number];
const values = siteContent.about.values;

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

function ValueCard({
  value,
  className = "",
}: {
  value: Value;
  className?: string;
}) {
  return (
    <article
      className={`bg-white border border-surface-container shadow-sm p-6 flex gap-4 items-start h-full ${className}`.trim()}
    >
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
    </article>
  );
}

export default function AboutPage() {
  return (
    <>
      <main className="bg-surface-bone text-charred-wood">
        <section className="relative min-h-[90vh] overflow-hidden flex items-center">
          <div className="absolute inset-0">
            <Image
              alt={siteContent.about.hero.imageAlt}
              className="object-cover brightness-[0.65]"
              fill
              priority
              sizes="100vw"
              src={siteContent.about.hero.imageSrc}
            />
            <div className="absolute inset-0 bg-[#6c2f00]/60 mix-blend-multiply" />
          </div>
          <div className="absolute inset-0 bg-charred-wood/35" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-section-padding py-24 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 bg-dry-grass/90 text-charred-wood px-4 py-2 shadow-sm">
              <Icon name="foundation" className="text-sm" />
              <span className="font-label-caps text-[10px] font-bold uppercase tracking-[0.2em]">
                {siteContent.about.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-eczar text-5xl md:text-7xl font-bold text-white drop-shadow-lg mt-8">
              {siteContent.about.hero.title}
            </h1>
            <p className="font-body-lg text-white/95 mt-6 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              {siteContent.about.hero.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className="bg-primary text-white px-6 py-3 font-label-caps text-xs font-bold uppercase transition-all hover:bg-laterite-red shadow-md"
                href="/rooms"
              >
                {siteContent.about.hero.ctaPrimary}
              </Link>
              <Link
                className="border border-white/50 text-white px-6 py-3 font-label-caps text-xs font-bold uppercase transition-all hover:bg-white hover:text-charred-wood"
                href="/contact"
              >
                {siteContent.about.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-section-padding py-section-padding bg-white">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">
            <SectionHeading
              eyebrow={siteContent.about.welcome.eyebrow}
              title={siteContent.about.welcome.title}
              description={siteContent.about.welcome.description}
            />
            <div className="relative aspect-[4/3] overflow-hidden shadow-lg">
              <Image
                alt={siteContent.about.welcome.imageAlt}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={siteContent.about.welcome.imageSrc}
              />
            </div>
          </div>
        </section>

        <section className="px-6 md:px-section-padding py-section-padding bg-surface-container-low border-y border-surface-container">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">
            <div className="relative order-2 md:order-1 aspect-[4/3] overflow-hidden shadow-lg">
              <Image
                alt={siteContent.about.commitment.imageAlt}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={siteContent.about.commitment.imageSrc}
              />
            </div>
            <div className="order-1 md:order-2">
              <SectionHeading
                eyebrow={siteContent.about.commitment.eyebrow}
                title={siteContent.about.commitment.title}
                description={siteContent.about.commitment.description}
              />
            </div>
          </div>
        </section>

        <section className="px-6 md:px-section-padding py-section-padding bg-white">
          <div className="max-w-6xl mx-auto">
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
              {values.map((value, index) => (
                <ValueCard
                  className={
                    index === values.length - 1
                      ? "md:col-span-2 lg:col-span-1"
                      : ""
                  }
                  key={value.title}
                  value={value}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-section-padding py-section-padding bg-surface-container-low">
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
    </>
  );
}
