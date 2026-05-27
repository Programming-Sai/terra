"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useState,
} from "react";
import Image from "next/image";
import { siteContent } from "@/lib/site-content";

type ContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

function buildGmailComposeUrl(formData: ContactFormState) {
  const subject = `Terra Lodge inquiry from ${formData.fullName || "a guest"}`;
  const bodyLines = [
    `Name: ${formData.fullName || "Not provided"}`,
    `Email: ${formData.email || "Not provided"}`,
    `Phone: ${formData.phone || "Not provided"}`,
    "",
    formData.message || "No message provided.",
  ];

  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: siteContent.contact.email,
    su: subject,
    body: bodyLines.join("\n"),
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export default function ContactPageClient({
  heroImage,
}: {
  heroImage: {
    alt: string;
    image: string;
  };
}) {
  const [formData, setFormData] = useState<ContactFormState>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    kind: "idle" | "success" | "error";
    message: string;
  }>({
    kind: "idle",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitState({
      kind: "idle",
      message: "",
    });

    try {
      const composeUrl = buildGmailComposeUrl(formData);
      const gmailWindow = window.open(
        composeUrl,
        "_blank",
        "noopener,noreferrer",
      );

      if (!gmailWindow) {
        throw new Error(
          "Unable to open Gmail. Please allow pop-ups and try again.",
        );
      }

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });

      setSubmitState({
        kind: "success",
        message:
          "A Gmail draft has been opened with your details. Review it there and send when you're ready.",
      });
    } catch {
      setSubmitState({
        kind: "error",
        message:
          "We could not open Gmail right now. Please allow pop-ups or try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <main className="bg-surface-bone text-charred-wood">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            alt={heroImage.alt}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={heroImage.image}
          />
        </div>
        <div className="absolute inset-0 bg-[#6c2f00]/90 mix-blend-multiply" />
        <div className="relative z-10 mx-auto max-w-[1152px] px-6 md:px-section-padding">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex bg-dry-grass/90 px-4 py-1 font-label-caps text-[10px] font-bold uppercase tracking-[0.2em] text-charred-wood">
              Get in Touch
            </span>
            <h1 className="font-headline-lg text-[48px] text-white leading-tight md:text-[64px]">
              Connect With Us
            </h1>
            <p className="max-w-3xl font-body-lg text-white/95 leading-relaxed">
              Have questions? We&apos;re here to help. Reach out and we&apos;ll
              respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1152px] px-6 md:px-section-padding py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="border border-surface-container bg-white p-8">
            <div className="mb-6 flex flex-col font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
              <p>Send Us a Message</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <Field
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                placeholder="Enter your full name"
                type="text"
                value={formData.fullName}
              />

              <Field
                label="Email Address"
                name="email"
                onChange={handleChange}
                placeholder="your.email@example.com"
                type="email"
                value={formData.email}
              />

              <Field
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                placeholder="+233 XX XXX XXXX"
                type="tel"
                value={formData.phone}
              />

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-outline-clay">
                  Message
                </label>
                <textarea
                  className="w-full resize-none border border-surface-container bg-white px-4 py-3 font-body-md text-base text-charred-wood outline-none transition-colors focus:border-primary"
                  name="message"
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  rows={6}
                  value={formData.message}
                />
              </div>

              <button
                className="relative w-full bg-primary px-6 py-4 text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                <span className="font-label-caps text-sm font-bold uppercase">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </span>
              </button>

              {submitState.kind !== "idle" ? (
                <p
                  className={`text-sm leading-relaxed ${
                    submitState.kind === "success"
                      ? "text-laterite-red"
                      : "text-red-600"
                  }`}
                >
                  {submitState.message}
                </p>
              ) : null}
            </form>
          </div>

          <div className="flex flex-col gap-8">
            <div className="border border-surface-container bg-white p-8">
              <div className="mb-6 flex flex-col font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
                <p>Contact Information</p>
              </div>

              <div className="flex flex-col gap-6">
                <InfoRow
                  title="Call Us"
                  lines={["+233 59 115 6756", "Available 24/7"]}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                      <path
                        d="M18.3 14.25c-1.2-1.05-2.55-1.05-3.75 0-.75.65-1.35 1.25-2.05 1.9-.25.2-.4.15-.6 0-1.65-1.05-3.45-1.85-5-3.15-1.5-1.25-2.75-2.7-3.85-4.3-.15-.25-.15-.4 0-.6.7-.7 1.35-1.35 2-2.05 1.2-1.2 1.2-2.55 0-3.75L3.65.9C2.45-.3 1.1-.3-.1.9L1.8 2.8-.1.9c-.7.7-1.15 1.55-1.2 2.6C-1.45 5.1-.95 6.55-.3 8c1.25 2.6 3 4.85 5.15 6.8 2.3 2.1 4.85 3.75 7.8 4.7 1.35.45 2.7.7 4.15.45 1.1-.2 2-.7 2.7-1.65.95-1.3.95-2.55-.05-3.8-.75-.7-1.4-1.4-2.15-2.15l1.9 1.9z"
                        fill="#4A1E00"
                      />
                    </svg>
                  }
                />

                <InfoRow
                  title="WhatsApp"
                  lines={["+233 59 115 6756"]}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                      <path
                        d="M17 2.91A9.92 9.92 0 0010.05 0C4.55 0 .05 4.5.05 10c0 1.75.45 3.45 1.3 4.95L0 20l5.25-1.38A9.95 9.95 0 0010.05 20c5.5 0 10-4.5 10-10 0-2.67-1.03-5.18-2.91-7.09zM10.05 18.3c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31A8.26 8.26 0 011.7 10c0-4.57 3.72-8.29 8.3-8.29 2.21 0 4.29.86 5.86 2.43A8.23 8.23 0 0118.3 10c.01 4.57-3.71 8.3-8.25 8.3zm4.54-6.2c-.25-.12-1.47-.73-1.7-.81-.22-.08-.38-.12-.55.12-.16.25-.64.81-.78.98-.15.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.47-.28z"
                        fill="#4A1E00"
                      />
                    </svg>
                  }
                />

                <InfoRow
                  title="Email"
                  lines={[siteContent.contact.email]}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                      <path
                        d="M2 4h16v12H2V4zm2 2.5l6 4 6-4M2 6v10h16V6"
                        stroke="#4A1E00"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  }
                />

                <InfoRow
                  title="Address"
                  lines={siteContent.contact.addressLines}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                      <path
                        d="M10 2C6.7 2 4 4.7 4 8c0 5.3 6 10 6 10s6-4.7 6-10c0-3.3-2.7-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                        fill="#4A1E00"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            <div className="border border-surface-container bg-white p-8">
              <div className="mb-6 flex flex-col font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
                <p>Operating Hours</p>
              </div>

              <div className="flex flex-col gap-4">
                <HoursRow
                  label="Office Hours"
                  value={siteContent.contact.officeHours}
                  subvalue="Daily"
                />
                <HoursRow
                  label="Check-in"
                  value={siteContent.contact.checkIn}
                />
                <HoursRow
                  label="Check-out"
                  value={siteContent.contact.checkOut}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-4 flex flex-col font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
            <p>Find Us</p>
          </div>
          <div className="h-[450px] overflow-hidden border border-surface-container bg-white">
            <iframe
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7729547445757!2d-0.1607389!3d5.6064541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMjMuMiJOIDDCsDA5JzM4LjciVw!5e0!3m2!1sen!2sgh!4v1234567890"
              title={siteContent.contact.contactMapTitle}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  onChange,
  placeholder,
  type,
  value,
}: {
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: "email" | "tel" | "text";
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-outline-clay">
        {label}
      </label>
      <input
        className="w-full border border-surface-container bg-white px-4 py-3 font-body-md text-base text-charred-wood outline-none transition-colors focus:border-primary"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </div>
  );
}

function InfoRow({
  icon,
  title,
  lines,
}: {
  icon: ReactNode;
  title: string;
  lines: readonly string[];
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-fixed">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="mb-2 flex flex-col font-headline-sm text-[16px] font-bold text-charred-wood">
          <p>{title}</p>
        </div>
        <div className="flex flex-col font-body-md text-[14px] font-normal text-on-surface-variant">
          {lines.map((line, index) => (
            <p
              className={index === 0 ? "leading-5" : "mt-1 leading-5"}
              key={line}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function HoursRow({
  label,
  value,
  subvalue,
}: {
  label: string;
  value: string;
  subvalue?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-surface-container pb-4 last:border-b-0 last:pb-0">
      <div className="flex flex-col font-headline-sm text-[14px] font-bold text-charred-wood">
        <p>{label}</p>
      </div>
      <div className="flex flex-col text-right font-body-md text-[14px] font-normal text-on-surface-variant">
        <p className="leading-5">{value}</p>
        {subvalue ? (
          <p className="text-[12px] leading-5 text-outline-clay">{subvalue}</p>
        ) : null}
      </div>
    </div>
  );
}
