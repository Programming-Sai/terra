import { cache } from "react";

export type PriceConversion = {
  currencyCode: string;
  rate: number;
};

const REGION_TO_CURRENCY: Record<string, string> = {
  AU: "AUD",
  BE: "EUR",
  CA: "CAD",
  CH: "CHF",
  DE: "EUR",
  ES: "EUR",
  EU: "EUR",
  FR: "EUR",
  GB: "GBP",
  GH: "GHS",
  IE: "EUR",
  IN: "INR",
  IT: "EUR",
  JP: "JPY",
  KE: "KES",
  NG: "NGN",
  NL: "EUR",
  NZ: "NZD",
  PT: "EUR",
  RW: "RWF",
  SA: "SAR",
  SG: "SGD",
  TZ: "TZS",
  UG: "UGX",
  US: "USD",
  ZA: "ZAR",
  AE: "AED",
};

function extractRegion(acceptLanguage?: string | null) {
  if (!acceptLanguage) return null;

  const firstLocale = acceptLanguage.split(",")[0]?.trim();
  if (!firstLocale) return null;

  const regionMatch = firstLocale.match(/[-_](\w{2})/);
  return regionMatch?.[1]?.toUpperCase() ?? null;
}

export function detectPreferredCurrency(acceptLanguage?: string | null) {
  const region = extractRegion(acceptLanguage);
  if (!region) return "USD";

  return REGION_TO_CURRENCY[region] ?? "USD";
}

const getGhsRate = cache(async (currencyCode: string) => {
  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=GHS&symbols=${encodeURIComponent(currencyCode)}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 60 * 60 * 12,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      rates?: Record<string, number>;
    };

    const rate = payload.rates?.[currencyCode];
    return typeof rate === "number" ? rate : null;
  } catch {
    return null;
  }
});

export async function getPriceConversion(acceptLanguage?: string | null) {
  const currencyCode = detectPreferredCurrency(acceptLanguage);

  if (currencyCode === "GHS") {
    return {
      currencyCode: "GHS",
      rate: 1,
    } satisfies PriceConversion;
  }

  const rate = await getGhsRate(currencyCode);
  if (!rate) {
    return {
      currencyCode: "GHS",
      rate: 1,
    } satisfies PriceConversion;
  }

  return {
    currencyCode,
    rate,
  } satisfies PriceConversion;
}

export function formatConvertedAmount(amount: number, currencyCode: string) {
  const rounded = Math.round(amount);

  try {
    return new Intl.NumberFormat("en", {
      currency: currencyCode,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: "currency",
    }).format(rounded);
  } catch {
    return `${currencyCode} ${rounded.toLocaleString("en-US")}`;
  }
}
