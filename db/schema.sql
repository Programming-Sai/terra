create extension if not exists pgcrypto;

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price_per_night numeric(10, 2) not null check (price_per_night >= 0),
  bed_type text not null,
  max_guests integer not null check (max_guests > 0),
  room_type text not null,
  view_type text not null,
  size text not null,
  images jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  cancellation_policy text,
  is_active boolean not null default true,
  availability_status text not null default 'available'
    check (availability_status in ('available', 'closed', 'maintenance')),
  availability_blocks jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null,
  featured boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists amenities_active_sort_idx
  on amenities (is_active, featured desc, sort_order asc, created_at desc);

create table if not exists site_settings (
  id smallint primary key default 1 check (id = 1),
  general_settings jsonb not null default '{}'::jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  payment_settings jsonb not null default '{}'::jsonb,
  hero_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  room_id uuid not null references rooms(id) on delete restrict,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  check_in_date date not null,
  check_out_date date not null check (check_out_date > check_in_date),
  guest_count integer not null check (guest_count > 0),
  room_count integer not null default 1 check (room_count > 0),
  special_requests text,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  currency text not null default 'GHS',
  booking_status text not null default 'pending'
    check (booking_status in ('pending', 'confirmed', 'cancelled', 'expired')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  paystack_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_room_id_idx on bookings (room_id);
create index if not exists bookings_check_in_out_idx on bookings (room_id, check_in_date, check_out_date);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_rooms_updated_at on rooms;
create trigger set_rooms_updated_at
before update on rooms
for each row
execute function set_updated_at();

drop trigger if exists set_bookings_updated_at on bookings;
create trigger set_bookings_updated_at
before update on bookings
for each row
execute function set_updated_at();

create or replace function set_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_settings_updated_at on site_settings;
create trigger set_site_settings_updated_at
before update on site_settings
for each row
execute function set_site_settings_updated_at();
