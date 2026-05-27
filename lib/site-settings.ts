import { unstable_cache, revalidateTag } from "next/cache";
import { query } from "@/lib/db";
import { siteContent } from "@/lib/site-content";

const SITE_SETTINGS_CACHE_TAG = "site-settings";

export type GeneralSettings = {
  hotelName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingAlerts: boolean;
  paymentAlerts: boolean;
  cancelationAlerts: boolean;
};

export type PaymentSettings = {
  mobileMoney: boolean;
  cardPayments: boolean;
  bankTransfer: boolean;
  cashPayments: boolean;
};

export type HeroSettings = {
  badge: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  showAvailabilityWidget: boolean;
};

export type SiteSettings = {
  generalSettings: GeneralSettings;
  notificationSettings: NotificationSettings;
  paymentSettings: PaymentSettings;
  heroSettings: HeroSettings;
};

type SiteSettingsDbRow = {
  id: number;
  general_settings: Record<string, unknown> | null;
  notification_settings: Record<string, unknown> | null;
  payment_settings: Record<string, unknown> | null;
  hero_settings: Record<string, unknown> | null;
  updated_at: string;
};

const defaultSiteSettings: SiteSettings = {
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

function toBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function toStringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function mapSettings(row: SiteSettingsDbRow | null | undefined): SiteSettings {
  if (!row) {
    return defaultSiteSettings;
  }

  const general = isRecord(row.general_settings) ? row.general_settings : {};
  const notifications = isRecord(row.notification_settings) ? row.notification_settings : {};
  const payments = isRecord(row.payment_settings) ? row.payment_settings : {};
  const hero = isRecord(row.hero_settings) ? row.hero_settings : {};

  return {
    generalSettings: {
      hotelName: toStringValue(general.hotelName, defaultSiteSettings.generalSettings.hotelName),
      email: toStringValue(general.email, defaultSiteSettings.generalSettings.email),
      phone: toStringValue(general.phone, defaultSiteSettings.generalSettings.phone),
      address: toStringValue(general.address, defaultSiteSettings.generalSettings.address),
      currency: toStringValue(general.currency, defaultSiteSettings.generalSettings.currency),
      timezone: toStringValue(general.timezone, defaultSiteSettings.generalSettings.timezone),
    },
    notificationSettings: {
      emailNotifications: toBoolean(
        notifications.emailNotifications,
        defaultSiteSettings.notificationSettings.emailNotifications,
      ),
      smsNotifications: toBoolean(
        notifications.smsNotifications,
        defaultSiteSettings.notificationSettings.smsNotifications,
      ),
      bookingAlerts: toBoolean(
        notifications.bookingAlerts,
        defaultSiteSettings.notificationSettings.bookingAlerts,
      ),
      paymentAlerts: toBoolean(
        notifications.paymentAlerts,
        defaultSiteSettings.notificationSettings.paymentAlerts,
      ),
      cancelationAlerts: toBoolean(
        notifications.cancelationAlerts,
        defaultSiteSettings.notificationSettings.cancelationAlerts,
      ),
    },
    paymentSettings: {
      mobileMoney: toBoolean(payments.mobileMoney, defaultSiteSettings.paymentSettings.mobileMoney),
      cardPayments: toBoolean(payments.cardPayments, defaultSiteSettings.paymentSettings.cardPayments),
      bankTransfer: toBoolean(
        payments.bankTransfer,
        defaultSiteSettings.paymentSettings.bankTransfer,
      ),
      cashPayments: toBoolean(payments.cashPayments, defaultSiteSettings.paymentSettings.cashPayments),
    },
    heroSettings: {
      badge: toStringValue(hero.badge, defaultSiteSettings.heroSettings.badge),
      title: toStringValue(hero.title, defaultSiteSettings.heroSettings.title),
      description: toStringValue(hero.description, defaultSiteSettings.heroSettings.description),
      imageSrc: toStringValue(hero.imageSrc, defaultSiteSettings.heroSettings.imageSrc),
      imageAlt: toStringValue(hero.imageAlt, defaultSiteSettings.heroSettings.imageAlt),
      showAvailabilityWidget: toBoolean(
        hero.showAvailabilityWidget,
        defaultSiteSettings.heroSettings.showAvailabilityWidget,
      ),
    },
  };
}

async function ensureSiteSettingsReady() {
  await query(`
    create table if not exists site_settings (
      id smallint primary key default 1 check (id = 1),
      general_settings jsonb not null default '{}'::jsonb,
      notification_settings jsonb not null default '{}'::jsonb,
      payment_settings jsonb not null default '{}'::jsonb,
      hero_settings jsonb not null default '{}'::jsonb,
      updated_at timestamptz not null default now()
    )
  `);

  await query(`
    create or replace function set_site_settings_updated_at()
    returns trigger
    language plpgsql
    as $$
    begin
      new.updated_at = now();
      return new;
    end;
    $$;
  `);

  await query(`
    drop trigger if exists set_site_settings_updated_at on site_settings;
    create trigger set_site_settings_updated_at
    before update on site_settings
    for each row
    execute function set_site_settings_updated_at()
  `);

  const countResult = await query<{ count: string }>(
    "select count(*)::text as count from site_settings",
  );
  const count = Number(countResult.rows[0]?.count ?? "0");

  if (count > 0) {
    return;
  }

  await query(
    `insert into site_settings (
      id, general_settings, notification_settings, payment_settings, hero_settings
    ) values (
      1, $1::jsonb, $2::jsonb, $3::jsonb, $4::jsonb
    )`,
    [
      JSON.stringify(defaultSiteSettings.generalSettings),
      JSON.stringify(defaultSiteSettings.notificationSettings),
      JSON.stringify(defaultSiteSettings.paymentSettings),
      JSON.stringify(defaultSiteSettings.heroSettings),
    ],
  );
}

export const getSiteSettings = unstable_cache(
  async () => {
    await ensureSiteSettingsReady();

    const result = await query<SiteSettingsDbRow>(`select * from site_settings where id = 1 limit 1`);
    return mapSettings(result.rows[0]);
  },
  ["site-settings"],
  { tags: [SITE_SETTINGS_CACHE_TAG] },
);

export async function updateSiteSettings(partial: Partial<SiteSettings>) {
  await ensureSiteSettingsReady();

  const currentResult = await query<SiteSettingsDbRow>(
    `select * from site_settings where id = 1 limit 1`,
  );
  const current = mapSettings(currentResult.rows[0]);
  const next: SiteSettings = {
    generalSettings: partial.generalSettings ?? current.generalSettings,
    notificationSettings: partial.notificationSettings ?? current.notificationSettings,
    paymentSettings: partial.paymentSettings ?? current.paymentSettings,
    heroSettings: partial.heroSettings ?? current.heroSettings,
  };

  await query(
    `update site_settings
     set general_settings = $1::jsonb,
         notification_settings = $2::jsonb,
         payment_settings = $3::jsonb,
         hero_settings = $4::jsonb
     where id = 1`,
    [
      JSON.stringify(next.generalSettings),
      JSON.stringify(next.notificationSettings),
      JSON.stringify(next.paymentSettings),
      JSON.stringify(next.heroSettings),
    ],
  );

  revalidateTag(SITE_SETTINGS_CACHE_TAG, "max");
  return next;
}

export function getDefaultSiteSettings() {
  return defaultSiteSettings;
}
