import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { serializeRoom } from "@/lib/db-serializers";
import { requireAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
const MAX_ROOM_IMAGES = Math.max(
  1,
  Number(process.env.NEXT_PUBLIC_MAX_ROOM_IMAGES ?? "6") || 6,
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  const result = await query(
    `select * from rooms order by featured desc, created_at desc`,
  );

  return NextResponse.json(
    result.rows.map((row) => serializeRoom(row as Parameters<typeof serializeRoom>[0])),
  );
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!isRecord(body)) {
    return badRequest("Invalid request body.");
  }

  const required = [
    "slug",
    "name",
    "description",
    "price_per_night",
    "bed_type",
    "max_guests",
    "room_type",
    "view_type",
    "size",
  ] as const;

  for (const field of required) {
    if (typeof body[field] !== "string" && typeof body[field] !== "number") {
      return badRequest(`Missing or invalid field: ${field}.`);
    }
  }

  const values = {
    slug: String(body.slug),
    name: String(body.name),
    description: String(body.description),
    price_per_night: Number(body.price_per_night),
    bed_type: String(body.bed_type),
    max_guests: Number(body.max_guests),
    room_type: String(body.room_type),
    view_type: String(body.view_type),
    size: String(body.size),
    images: Array.isArray(body.images) ? body.images : [],
    amenities: Array.isArray(body.amenities) ? body.amenities : [],
    features: Array.isArray(body.features) ? body.features : [],
    cancellation_policy:
      typeof body.cancellation_policy === "string"
        ? body.cancellation_policy
        : null,
    is_active: typeof body.is_active === "boolean" ? body.is_active : true,
    availability_status:
      typeof body.availability_status === "string"
        ? body.availability_status
        : "available",
    availability_blocks: Array.isArray(body.availability_blocks)
      ? body.availability_blocks
      : [],
    featured: typeof body.featured === "boolean" ? body.featured : false,
  };

  if (values.images.length > MAX_ROOM_IMAGES) {
    return badRequest(`A room can only have up to ${MAX_ROOM_IMAGES} images.`);
  }

  const result = await query(
    `insert into rooms (
      slug, name, description, price_per_night, bed_type, max_guests, room_type,
      view_type, size, images, amenities, features, cancellation_policy,
      is_active, availability_status, availability_blocks, featured
    ) values (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13,
      $14, $15, $16::jsonb, $17
    ) returning *`,
    [
      values.slug,
      values.name,
      values.description,
      values.price_per_night,
      values.bed_type,
      values.max_guests,
      values.room_type,
      values.view_type,
      values.size,
      JSON.stringify(values.images),
      JSON.stringify(values.amenities),
      JSON.stringify(values.features),
      values.cancellation_policy,
      values.is_active,
      values.availability_status,
      JSON.stringify(values.availability_blocks),
      values.featured,
    ],
  );

  return NextResponse.json(
    serializeRoom(result.rows[0] as Parameters<typeof serializeRoom>[0]),
    { status: 201 },
  );
}
