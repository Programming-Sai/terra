import { NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings, type SiteSettings } from "@/lib/site-settings";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function normalizeGeneralSettings(value: unknown): SiteSettings["generalSettings"] | null {
  if (!isRecord(value)) return null;
  return {
    hotelName: isString(value.hotelName) ? value.hotelName : "",
    email: isString(value.email) ? value.email : "",
    phone: isString(value.phone) ? value.phone : "",
    address: isString(value.address) ? value.address : "",
    currency: isString(value.currency) ? value.currency : "",
    timezone: isString(value.timezone) ? value.timezone : "",
  };
}

function normalizeNotificationSettings(value: unknown): SiteSettings["notificationSettings"] | null {
  if (!isRecord(value)) return null;
  return {
    emailNotifications: isBoolean(value.emailNotifications) ? value.emailNotifications : false,
    smsNotifications: isBoolean(value.smsNotifications) ? value.smsNotifications : false,
    bookingAlerts: isBoolean(value.bookingAlerts) ? value.bookingAlerts : false,
    paymentAlerts: isBoolean(value.paymentAlerts) ? value.paymentAlerts : false,
    cancelationAlerts: isBoolean(value.cancelationAlerts) ? value.cancelationAlerts : false,
  };
}

function normalizePaymentSettings(value: unknown): SiteSettings["paymentSettings"] | null {
  if (!isRecord(value)) return null;
  return {
    mobileMoney: isBoolean(value.mobileMoney) ? value.mobileMoney : false,
    cardPayments: isBoolean(value.cardPayments) ? value.cardPayments : false,
    bankTransfer: isBoolean(value.bankTransfer) ? value.bankTransfer : false,
    cashPayments: isBoolean(value.cashPayments) ? value.cashPayments : false,
  };
}

function normalizeHeroSettings(value: unknown): SiteSettings["heroSettings"] | null {
  if (!isRecord(value)) return null;
  return {
    badge: isString(value.badge) ? value.badge : "",
    title: isString(value.title) ? value.title : "",
    description: isString(value.description) ? value.description : "",
    imageSrc: isString(value.imageSrc) ? value.imageSrc : "",
    imageAlt: isString(value.imageAlt) ? value.imageAlt : "",
    showAvailabilityWidget: isBoolean(value.showAvailabilityWidget)
      ? value.showAvailabilityWidget
      : true,
  };
}

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
  }

  const nextSettings: Partial<SiteSettings> = {};

  if ("generalSettings" in body) {
    const generalSettings = normalizeGeneralSettings(body.generalSettings);
    if (!generalSettings) {
      return NextResponse.json({ error: "Invalid general settings." }, { status: 400 });
    }
    nextSettings.generalSettings = generalSettings;
  }

  if ("notificationSettings" in body) {
    const notificationSettings = normalizeNotificationSettings(body.notificationSettings);
    if (!notificationSettings) {
      return NextResponse.json({ error: "Invalid notification settings." }, { status: 400 });
    }
    nextSettings.notificationSettings = notificationSettings;
  }

  if ("paymentSettings" in body) {
    const paymentSettings = normalizePaymentSettings(body.paymentSettings);
    if (!paymentSettings) {
      return NextResponse.json({ error: "Invalid payment settings." }, { status: 400 });
    }
    nextSettings.paymentSettings = paymentSettings;
  }

  if ("heroSettings" in body) {
    const heroSettings = normalizeHeroSettings(body.heroSettings);
    if (!heroSettings) {
      return NextResponse.json({ error: "Invalid hero settings." }, { status: 400 });
    }
    nextSettings.heroSettings = heroSettings;
  }

  const updated = await updateSiteSettings(nextSettings);
  return NextResponse.json(updated);
}
