import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "terra_lodge_admin_session";
export const ADMIN_LOGIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL ?? "";
export const ADMIN_LOGIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD ?? "";

const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(value: string) {
  const bytes = encoder.encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return decoder.decode(bytes);
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(payload: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken(email: string) {
  const payload = JSON.stringify({
    email,
    issuedAt: Date.now(),
    expiresAt: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  });

  return `${base64UrlEncode(payload)}.${await sign(payload)}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;

  const [payloadPart, signature] = token.split(".");
  if (!payloadPart || !signature) return false;

  let payloadText: string;

  try {
    payloadText = base64UrlDecode(payloadPart);
  } catch {
    return false;
  }

  if ((await sign(payloadText)) !== signature) {
    return false;
  }

  try {
    const payload = JSON.parse(payloadText) as {
      email?: string;
      expiresAt?: number;
    };

    if (payload.email !== ADMIN_LOGIN_EMAIL) {
      return false;
    }

    if (!payload.expiresAt || payload.expiresAt < Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(email: string, password: string) {
  return email === ADMIN_LOGIN_EMAIL && password === ADMIN_LOGIN_PASSWORD;
}

function getCookieValue(request: Request, cookieName: string) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const escaped = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${escaped}=([^;]+)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export async function requireAdminSession(request: Request) {
  const token = getCookieValue(request, ADMIN_COOKIE_NAME);

  if (await verifyAdminSessionToken(token)) {
    return null;
  }

  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
