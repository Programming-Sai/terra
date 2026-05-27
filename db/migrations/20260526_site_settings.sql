create table if not exists site_settings (
  id smallint primary key default 1 check (id = 1),
  general_settings jsonb not null default '{}'::jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  payment_settings jsonb not null default '{}'::jsonb,
  hero_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

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
