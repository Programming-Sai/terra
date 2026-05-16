import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icon";

type Value = {
  icon: string;
  title: string;
  description: string;
};

const values: Value[] = [
  {
    icon: "workspace_premium",
    title: "Excellence",
    description:
      "We keep the experience polished, calm, and dependable from booking to checkout.",
  },
  {
    icon: "diversity_3",
    title: "Authenticity",
    description:
      "We celebrate Ghanaian hospitality with a stay that feels local, warm, and genuine.",
  },
  {
    icon: "spa",
    title: "Comfort",
    description:
      "Every room and shared space is designed to help guests rest, reset, and feel at home.",
  },
];

export const metadata: Metadata = {
  title: "About | Terra Lodge",
  description:
    "Learn the story, values, and hospitality approach behind Terra Lodge.",
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
              alt="Terra Lodge exterior with clean pathways"
              className="object-cover brightness-[0.65]"
              fill
              priority
              sizes="100vw"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6QyRAJzExUYQqgcJW1sw5TJ-0B1_O_kknMgaFEHU2yzhxcXHx9hqtQDtGe3VO5HI3aTSHohNa_iQMsRNLa7SrFyx7kBscWv6ye9J91ZYWZvIb4lYV9TpmLILLHLafTCV7Ko_4rUClM-VTiQv7M2neLHW1znTdkM6nhP0Rw5GWqPNtLTMRSEjg-GNbGoNz8gZQrixSaML9fzeVoMwjbUrWZDXMLekhMPHUcuDfTXhG_EwCUTLhQTqTLNMuRao-ojqZBatTi9PHynm6"
            />
          </div>
          <div className="absolute inset-0 bg-charred-wood/35" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-section-padding py-24 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 bg-dry-grass/90 text-charred-wood px-4 py-2 shadow-sm">
              <Icon name="foundation" className="text-sm" />
              <span className="font-label-caps text-[10px] font-bold uppercase tracking-[0.2em]">
                Our Story
              </span>
            </div>
            <h1 className="font-eczar text-5xl md:text-7xl font-bold text-white drop-shadow-lg mt-8">
              About Terra Lodge
            </h1>
            <p className="font-body-lg text-white/95 mt-6 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              A calm, welcoming lodge built around modern comfort, local
              character, and thoughtful service.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className="bg-primary text-white px-6 py-3 font-label-caps text-xs font-bold uppercase transition-all hover:bg-laterite-red shadow-md"
                href="/rooms"
              >
                View Rooms
              </Link>
              <Link
                className="border border-white/50 text-white px-6 py-3 font-label-caps text-xs font-bold uppercase transition-all hover:bg-white hover:text-charred-wood"
                href="/contact"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-section-padding py-section-padding bg-white">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">
            <SectionHeading
              eyebrow="Welcome"
              title="Comfort that feels grounded."
              description="Terra Lodge is designed for travelers who want a peaceful place to stay without losing the convenience of city access. We combine warm hospitality with practical details that make each visit easier."
            />
            <div className="relative aspect-[4/3] overflow-hidden shadow-lg">
              <Image
                alt="Guest room at Terra Lodge"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_xe9QS4GT97iJC16ONVhVClJiayMmfdKzNrw0JiCR7XVDmq_AVCPDWy_Vyks-OgkQCKVFM2b0MOuJF5Mk2vrCQGfdEV7u8bBIDXuVq5AWBCNC5ingfKtgf_UIAGfonHJAQQbZgsoCh2b1-c-nX7vkpLgMh2j9WRksz4iMf_aUqnEnestEarD3QpzTuLEbD29IjB3yUdpW1W8wN6Ih55OTC4_7Qu5S2j6hk1w8o1c3pkKUMtz6W1JNln31LTXfuonmL7ZSvp1Xs_au"
              />
            </div>
          </div>
        </section>

        <section className="px-6 md:px-section-padding py-section-padding bg-surface-container-low border-y border-surface-container">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">
            <div className="relative order-2 md:order-1 aspect-[4/3] overflow-hidden shadow-lg">
              <Image
                alt="Spacious living area in Terra Lodge"
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALWIiOef8XJdbvWtiPwYldrrbyL7KbtvLoErLYF9kh-kb1V9eznLKwTGcYYeqy5CXaPTHIFVSJkOl9OLoIIEB8FqwWHYXUcuI8y2gqmdVQLv7c6YwaeGXCP5aW_-EuoPos-GkEfTUQTRdLKzG1T8VlkBncext7jgf0QErH-rUOIv7CFf8ReemeA2ZyjRdbUNmafoHRO7enO2uNtrJloWTybIbArPtKfKHBIMBrhTjL2kZJ6zNx5bCY5niDadADGRkVKCvFJUArwmRb"
              />
            </div>
            <div className="order-1 md:order-2">
              <SectionHeading
                eyebrow="Our Commitment"
                title="Quality service, quiet stays."
                description="From the moment you arrive, we aim to make the experience easy and reassuring. Our rooms, shared spaces, and hospitality approach are all built around a simple idea: guests should feel cared for."
              />
            </div>
          </div>
        </section>

        <section className="px-6 md:px-section-padding py-section-padding bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                Our Values
              </span>
              <h2 className="font-headline-md text-charred-wood font-bold text-3xl md:text-4xl">
                What we stand for
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                These principles guide the way we host, design, and care for
                every guest at Terra Lodge.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {values.map((value, index) => (
                <ValueCard
                  className={index === values.length - 1 ? "md:col-span-2 lg:col-span-1" : ""}
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
              Ready to experience Terra Santa Lodge?
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              If you are planning a stay, we would love to help you find the
              right room and make your visit smooth from the start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                className="bg-primary text-white px-6 py-3 font-label-caps text-xs font-bold uppercase transition-all hover:bg-laterite-red shadow-md"
                href="/contact"
              >
                Contact Us
              </Link>
              <Link
                className="border-2 border-charred-wood px-6 py-3 font-label-caps text-xs font-bold uppercase hover:bg-charred-wood hover:text-white transition-all"
                href="/rooms"
              >
                Browse Rooms
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
