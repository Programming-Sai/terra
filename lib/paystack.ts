import crypto from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getPaystackSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing PAYSTACK_SECRET_KEY environment variable.");
  }

  return secretKey;
}

async function paystackRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error("Paystack request failed.");
  }

  return data;
}

export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    metadata?: Record<string, unknown>;
  };
};

export async function initializePaystackTransaction(payload: {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}) {
  return paystackRequest<PaystackInitializeResponse>("/transaction/initialize", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackRequest<PaystackVerifyResponse>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}

export function verifyPaystackSignature(
  payload: string,
  signature: string | null,
) {
  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha512", getPaystackSecretKey())
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
}
