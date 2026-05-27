"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/components/icon";
import type {
  HeroSettings,
  NotificationSettings,
  PaymentSettings,
  GeneralSettings,
  SiteSettings,
} from "@/lib/site-settings";
import { siteContent } from "@/lib/site-content";

type TabId = "general" | "hero" | "notifications" | "payments" | "security";

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "general", label: "General", icon: "business" },
  { id: "hero", label: "Homepage Hero", icon: "image" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "payments", label: "Payments", icon: "payments" },
  { id: "security", label: "Security", icon: "lock" },
];

const fallbackSettings: SiteSettings = {
  generalSettings: {
    hotelName: siteContent.brand.name,
    email: siteContent.contact.email,
    phone: siteContent.contact.phone,
    address: siteContent.contact.shortAddress,
    currency: "GHS",
    timezone: "GMT",
  },
  notificationSettings: {
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    paymentAlerts: true,
    cancelationAlerts: true,
  },
  paymentSettings: {
    mobileMoney: true,
    cardPayments: true,
    bankTransfer: true,
    cashPayments: true,
  },
  heroSettings: {
    badge: siteContent.home.hero.badge,
    title: siteContent.home.hero.title,
    description: siteContent.home.hero.description,
    imageSrc: siteContent.home.hero.imageSrc,
    imageAlt: siteContent.home.hero.imageAlt,
    showAvailabilityWidget: true,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8">
      <span className="font-label-caps text-xs font-bold uppercase tracking-widest text-laterite-red">
        Admin Management
      </span>
      <h1 className="mt-2 font-eczar text-[36px] font-bold text-charred-wood">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl font-body-md text-[14px] leading-relaxed text-on-surface-variant">
        {description}
      </p>
    </header>
  );
}

function SectionCard({
  title,
  children,
  footerAction,
}: {
  title: string;
  children: ReactNode;
  footerAction?: ReactNode;
}) {
  return (
    <section className="border border-surface-container bg-white p-6 shadow-sm">
      <h2 className="mb-6 font-eczar text-[24px] font-bold text-charred-wood">
        {title}
      </h2>
      {children}
      {footerAction ? (
        <div className="mt-8 border-t border-surface-container pt-6">
          {footerAction}
        </div>
      ) : null}
    </section>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-surface-container py-4 last:border-b-0 last:pb-0">
      <div>
        <p className="font-body-md text-[16px] font-medium text-charred-wood">
          {title}
        </p>
        <p className="mt-1 font-body-md text-[14px] text-outline-clay">
          {description}
        </p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          checked={checked}
          className="peer sr-only"
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span className="peer h-6 w-11 rounded-full bg-surface-container transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
      </label>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  as = "input",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  as?: "input" | "textarea" | "select";
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-label-caps text-[14px] font-bold uppercase tracking-widest text-charred-wood">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          className="w-full border border-surface-container bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          value={value}
        />
      ) : as === "select" ? (
        <select
          className="w-full border border-surface-container bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          {label === "Currency" ? (
            <>
              <option value="GHS">GHS - Ghana Cedi</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </>
          ) : label === "Timezone" ? (
            <>
              <option value="GMT">GMT - Greenwich Mean Time</option>
              <option value="WAT">WAT - West Africa Time</option>
              <option value="UTC">UTC - Coordinated Universal Time</option>
            </>
          ) : null}
        </select>
      ) : (
        <input
          className="w-full border border-surface-container bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors focus:border-primary"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 px-4 py-3 text-left font-body-md text-[14px] transition-colors ${
        active
          ? "bg-primary-fixed text-primary font-bold"
          : "text-on-surface-variant hover:bg-surface-bone"
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon className="text-[20px]" filled={active} name={icon} />
      <span>{label}</span>
    </button>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("Unable to read image file."));
    };

    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

function HeroPreviewAvailabilityWidget() {
  return (
    <div className="w-full  p-4 shadow-xl border-surface-container-high ">
      <div className=" bg-white grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="flex flex-col  px-4 py-2 border-b md:border-b-0 md:border-r border-surface-container">
          <label className="font-label-micro text-outline-clay uppercase font-bold text-[10px] mb-1">
            Check-in
          </label>
          <div className="font-body-md text-charred-wood text-[14px]">
            2026-05-26
          </div>
        </div>
        <div className="flex flex-col px-4 py-2 border-b md:border-b-0 md:border-r border-surface-container">
          <label className="font-label-micro text-outline-clay uppercase font-bold text-[10px] mb-1">
            Check-out
          </label>
          <div className="font-body-md text-charred-wood text-[14px]">
            2026-05-27
          </div>
        </div>
        <div className="flex flex-col px-4 py-2 border-b md:border-b-0 md:border-r border-surface-container">
          <label className="font-label-micro text-outline-clay uppercase font-bold text-[10px] mb-1">
            Guests
          </label>
          <div className="font-body-md text-charred-wood text-[14px]">
            2 Guests
          </div>
        </div>
        <div className="flex flex-col px-4 py-2 border-b md:border-b-0 md:border-r border-surface-container">
          <label className="font-label-micro text-outline-clay uppercase font-bold text-[10px] mb-1">
            Room Type
          </label>
          <div className="font-body-md text-charred-wood text-[14px]">
            Suite
          </div>
        </div>
        <div className="flex flex-col">
          <button
            className="h-full bg-primary text-white font-label-caps text-xs  outline-6 outline-offset-[-6px] font-bold py-4 px-6 uppercase transition-all shadow-md flex items-center justify-center cursor-default"
            disabled
            type="button"
          >
            Check Availability
          </button>
        </div>
      </div>
      <p className="col-span-full text-white text-[11px] font-body-md mt-2 text-center md:text-left md:px-2 drop-shadow-sm">
        <Icon
          name="check_circle"
          className="inline-block align-middle mr-1 text-[12px]"
        />
        Free cancellation up to 48 hours before check-in
      </p>
    </div>
  );
}

function HeroPreview({ heroSettings }: { heroSettings: HeroSettings }) {
  console.log("showAvailabilityWidget:", heroSettings.showAvailabilityWidget);

  return (
    <div className="border border-surface-container bg-surface-bone p-4">
      <div
        className="relative overflow-hidden bg-charred-wood px-6 pt-6 pb-8"
        style={{
          height: !heroSettings.showAvailabilityWidget ? "57vh" : "auto",
        }}
      >
        <Image
          alt={heroSettings.imageAlt}
          className="object-cover object-[50%_75%] brightness-75"
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          src={heroSettings.imageSrc}
        />
        <div className="absolute inset-0 bg-[#6c2f00]/70 mix-blend-multiply" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <span className="inline-block bg-dry-grass/90 text-charred-wood px-3 py-0.5 font-label-caps text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
            {heroSettings.badge}
          </span>
          <h3 className="font-eczar text-[32px] md:text-[44px] leading-tight text-white drop-shadow-lg font-bold max-w-4xl">
            {heroSettings.title}
          </h3>
          <p className="font-body-lg text-white mt-3 max-w-2xl mx-auto drop-shadow-md font-medium text-xs w-[80%]">
            {heroSettings.description}
          </p>
        </div>

        {heroSettings.showAvailabilityWidget ? (
          <div className="relative z-20 mt-6 w-full max-w-6xl mx-auto">
            <HeroPreviewAvailabilityWidget />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminSettingsView({
  initialSettings = fallbackSettings,
}: {
  initialSettings?: SiteSettings;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(
    initialSettings.generalSettings,
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(initialSettings.notificationSettings);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(
    initialSettings.paymentSettings,
  );
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(
    initialSettings.heroSettings,
  );
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusKind, setStatusKind] = useState<"success" | "error" | null>(
    null,
  );
  const [heroImageHint, setHeroImageHint] = useState<string | null>(null);

  async function saveSettings(
    partial: Partial<SiteSettings>,
    successMessage: string,
  ) {
    setIsSaving(true);
    setStatusMessage(null);
    setStatusKind(null);

    try {
      const response = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partial),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Unable to save settings.";
        setStatusKind("error");
        setStatusMessage(message);
        return;
      }

      if (partial.generalSettings) setGeneralSettings(partial.generalSettings);
      if (partial.notificationSettings)
        setNotificationSettings(partial.notificationSettings);
      if (partial.paymentSettings) setPaymentSettings(partial.paymentSettings);
      if (partial.heroSettings) setHeroSettings(partial.heroSettings);

      setStatusKind("success");
      setStatusMessage(successMessage);
      router.refresh();
    } catch {
      setStatusKind("error");
      setStatusMessage("Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleHeroImageFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setHeroSettings((current) => ({
        ...current,
        imageSrc: dataUrl,
      }));
      setHeroImageHint(`Loaded ${file.name}. Save Hero to persist this image.`);
    } catch {
      setHeroImageHint(null);
      setStatusKind("error");
      setStatusMessage("Unable to read the selected image.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div>
      <PageHeader
        description="Manage hotel information, homepage hero content, notifications, and payment preferences."
        title="Settings"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="border border-surface-container bg-white p-4 shadow-sm">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <TabButton
                  active={activeTab === tab.id}
                  icon={tab.icon}
                  key={tab.id}
                  label={tab.label}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" ? (
            <SectionCard
              footerAction={
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 bg-primary px-8 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSaving}
                    onClick={() =>
                      saveSettings(
                        {
                          generalSettings,
                        },
                        "General settings updated.",
                      )
                    }
                    type="button"
                  >
                    <Icon name="save" className="text-[18px]" />
                    {isSaving ? "Saving..." : "Save General"}
                  </button>
                </div>
              }
              title="General Settings"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Hotel Name"
                  onChange={(value) =>
                    setGeneralSettings((current) => ({
                      ...current,
                      hotelName: value,
                    }))
                  }
                  value={generalSettings.hotelName}
                />
                <Field
                  label="Email Address"
                  onChange={(value) =>
                    setGeneralSettings((current) => ({
                      ...current,
                      email: value,
                    }))
                  }
                  type="email"
                  value={generalSettings.email}
                />
                <Field
                  label="Phone Number"
                  onChange={(value) =>
                    setGeneralSettings((current) => ({
                      ...current,
                      phone: value,
                    }))
                  }
                  type="tel"
                  value={generalSettings.phone}
                />
                <Field
                  as="select"
                  label="Currency"
                  onChange={(value) =>
                    setGeneralSettings((current) => ({
                      ...current,
                      currency: value,
                    }))
                  }
                  value={generalSettings.currency}
                />
                <div className="md:col-span-2">
                  <Field
                    as="textarea"
                    label="Address"
                    onChange={(value) =>
                      setGeneralSettings((current) => ({
                        ...current,
                        address: value,
                      }))
                    }
                    value={generalSettings.address}
                  />
                </div>
                <Field
                  as="select"
                  label="Timezone"
                  onChange={(value) =>
                    setGeneralSettings((current) => ({
                      ...current,
                      timezone: value,
                    }))
                  }
                  value={generalSettings.timezone}
                />
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "hero" ? (
            <SectionCard
              footerAction={
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 bg-primary px-8 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSaving}
                    onClick={() =>
                      saveSettings(
                        {
                          heroSettings,
                        },
                        "Homepage hero updated.",
                      )
                    }
                    type="button"
                  >
                    <Icon name="save" className="text-[18px]" />
                    {isSaving ? "Saving..." : "Save Hero"}
                  </button>
                </div>
              }
              title="Homepage Hero"
            >
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Badge"
                    onChange={(value) =>
                      setHeroSettings((current) => ({
                        ...current,
                        badge: value,
                      }))
                    }
                    value={heroSettings.badge}
                  />
                  <div>
                    <label className="mb-2 block font-label-caps text-[14px] font-bold uppercase tracking-widest text-charred-wood">
                      Hero Image File
                    </label>
                    <input
                      accept="image/*"
                      className="w-full border border-surface-container bg-white px-4 py-3 font-body-md text-[14px] text-charred-wood outline-none transition-colors file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:font-label-caps file:text-[11px] file:font-bold file:uppercase file:text-white hover:file:bg-laterite-red focus:border-primary"
                      onChange={handleHeroImageFileChange}
                      type="file"
                    />
                    <p className="mt-2 font-body-md text-[12px] leading-relaxed text-outline-clay">
                      Choose an image file or paste a URL below. Files are
                      stored as a data URL in the database, so they keep working
                      after save.
                    </p>
                    {heroImageHint ? (
                      <p className="mt-2 font-body-md text-[12px] leading-relaxed text-primary">
                        {heroImageHint}
                      </p>
                    ) : null}
                  </div>
                </div>
                <Field
                  label="Image URL"
                  onChange={(value) =>
                    setHeroSettings((current) => ({
                      ...current,
                      imageSrc: value,
                    }))
                  }
                  value={heroSettings.imageSrc}
                />
                <Field
                  label="Hero Title"
                  onChange={(value) =>
                    setHeroSettings((current) => ({
                      ...current,
                      title: value,
                    }))
                  }
                  value={heroSettings.title}
                />
                <Field
                  as="textarea"
                  label="Hero Description"
                  onChange={(value) =>
                    setHeroSettings((current) => ({
                      ...current,
                      description: value,
                    }))
                  }
                  value={heroSettings.description}
                />
                <Field
                  label="Image Alt Text"
                  onChange={(value) =>
                    setHeroSettings((current) => ({
                      ...current,
                      imageAlt: value,
                    }))
                  }
                  value={heroSettings.imageAlt}
                />
                <label className="flex items-start gap-3 border border-surface-container bg-surface-bone p-4">
                  <input
                    checked={heroSettings.showAvailabilityWidget}
                    className="mt-1 h-4 w-4 accent-primary"
                    onChange={(event) =>
                      setHeroSettings((current) => ({
                        ...current,
                        showAvailabilityWidget: event.target.checked,
                      }))
                    }
                    type="checkbox"
                  />
                  <span className="font-body-md text-[14px] text-charred-wood">
                    Show availability widget
                    <span className="block text-[12px] text-outline-clay">
                      Turn this off to hide the booking search block from the
                      homepage hero.
                    </span>
                  </span>
                </label>
                <HeroPreview heroSettings={heroSettings} />
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "notifications" ? (
            <SectionCard
              footerAction={
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 bg-primary px-8 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSaving}
                    onClick={() =>
                      saveSettings(
                        {
                          notificationSettings,
                        },
                        "Notification settings updated.",
                      )
                    }
                    type="button"
                  >
                    <Icon name="save" className="text-[18px]" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              }
              title="Notification Settings"
            >
              <div className="space-y-2">
                <ToggleRow
                  checked={notificationSettings.emailNotifications}
                  description="Receive email notifications for important updates"
                  onChange={(value) =>
                    setNotificationSettings((current) => ({
                      ...current,
                      emailNotifications: value,
                    }))
                  }
                  title="Email Notifications"
                />
                <ToggleRow
                  checked={notificationSettings.smsNotifications}
                  description="Get SMS alerts for critical events"
                  onChange={(value) =>
                    setNotificationSettings((current) => ({
                      ...current,
                      smsNotifications: value,
                    }))
                  }
                  title="SMS Notifications"
                />
                <ToggleRow
                  checked={notificationSettings.bookingAlerts}
                  description="Notify when new bookings are made"
                  onChange={(value) =>
                    setNotificationSettings((current) => ({
                      ...current,
                      bookingAlerts: value,
                    }))
                  }
                  title="Booking Alerts"
                />
                <ToggleRow
                  checked={notificationSettings.paymentAlerts}
                  description="Get notified about payment transactions"
                  onChange={(value) =>
                    setNotificationSettings((current) => ({
                      ...current,
                      paymentAlerts: value,
                    }))
                  }
                  title="Payment Alerts"
                />
                <ToggleRow
                  checked={notificationSettings.cancelationAlerts}
                  description="Alert when bookings are cancelled"
                  onChange={(value) =>
                    setNotificationSettings((current) => ({
                      ...current,
                      cancelationAlerts: value,
                    }))
                  }
                  title="Cancelation Alerts"
                />
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "payments" ? (
            <SectionCard
              footerAction={
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 bg-primary px-8 py-3 font-label-caps text-sm font-bold uppercase text-white transition-colors hover:bg-laterite-red disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSaving}
                    onClick={() =>
                      saveSettings(
                        {
                          paymentSettings,
                        },
                        "Payment settings updated.",
                      )
                    }
                    type="button"
                  >
                    <Icon name="save" className="text-[18px]" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              }
              title="Payment Settings"
            >
              <div className="space-y-2">
                <ToggleRow
                  checked={paymentSettings.mobileMoney}
                  description="Accept payments via MTN, Vodafone, AirtelTigo"
                  onChange={(value) =>
                    setPaymentSettings((current) => ({
                      ...current,
                      mobileMoney: value,
                    }))
                  }
                  title="Mobile Money"
                />
                <ToggleRow
                  checked={paymentSettings.cardPayments}
                  description="Accept Visa, Mastercard, and other cards"
                  onChange={(value) =>
                    setPaymentSettings((current) => ({
                      ...current,
                      cardPayments: value,
                    }))
                  }
                  title="Card Payments"
                />
                <ToggleRow
                  checked={paymentSettings.bankTransfer}
                  description="Allow direct bank transfers"
                  onChange={(value) =>
                    setPaymentSettings((current) => ({
                      ...current,
                      bankTransfer: value,
                    }))
                  }
                  title="Bank Transfer"
                />
                <ToggleRow
                  checked={paymentSettings.cashPayments}
                  description="Accept cash payments at the property"
                  onChange={(value) =>
                    setPaymentSettings((current) => ({
                      ...current,
                      cashPayments: value,
                    }))
                  }
                  title="Cash Payments"
                />
              </div>
            </SectionCard>
          ) : null}

          {activeTab === "security" ? (
            <SectionCard
              footerAction={
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 bg-primary px-8 py-3 font-label-caps text-sm font-bold uppercase text-white opacity-70"
                    disabled
                    type="button"
                  >
                    <Icon name="save" className="text-[18px]" />
                    Update Password
                  </button>
                </div>
              }
              title="Security Settings"
            >
              <div className="space-y-6">
                <Field
                  label="Current Password"
                  onChange={(value) =>
                    setSecuritySettings((current) => ({
                      ...current,
                      currentPassword: value,
                    }))
                  }
                  type="password"
                  value={securitySettings.currentPassword}
                />
                <Field
                  label="New Password"
                  onChange={(value) =>
                    setSecuritySettings((current) => ({
                      ...current,
                      newPassword: value,
                    }))
                  }
                  type="password"
                  value={securitySettings.newPassword}
                />
                <Field
                  label="Confirm New Password"
                  onChange={(value) =>
                    setSecuritySettings((current) => ({
                      ...current,
                      confirmNewPassword: value,
                    }))
                  }
                  type="password"
                  value={securitySettings.confirmNewPassword}
                />
                <div className="border border-dry-grass/40 bg-dry-grass/20 p-4">
                  <p className="mb-2 font-label-caps text-[14px] font-bold uppercase text-primary">
                    Password Requirements:
                  </p>
                  <ul className="list-inside list-disc space-y-1 font-body-md text-[13px] text-on-surface-variant">
                    <li>At least 8 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
                <p className="font-body-md text-[13px] text-outline-clay">
                  Security controls are currently UI only and will be wired
                  later.
                </p>
              </div>
            </SectionCard>
          ) : null}

          {statusMessage ? (
            <div
              className={`border px-4 py-3 font-body-md text-[14px] ${
                statusKind === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {statusMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
