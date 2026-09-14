-- Migration 001: Indiana Sewer & Drain service request leads and photo storage.

create table if not exists public.isd_service_leads (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'New' check (status in (
    'New', 'Contacted', 'Scheduled', 'Closed', 'Not a Fit'
  )),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  zip text not null,
  service text not null,
  urgency text not null,
  description text,
  photo_urls text[] not null default '{}',
  sms_consent boolean not null default false,
  sms_consent_timestamp timestamptz,
  sms_consent_source text,
  lead_source text not null default 'website_service_request',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists isd_service_leads_status_idx
  on public.isd_service_leads (status, created_at desc);

create index if not exists isd_service_leads_created_idx
  on public.isd_service_leads (created_at desc);

alter table public.isd_service_leads enable row level security;

-- No public policies: inserts and reads use service role from the Next.js API / owner pages.

insert into storage.buckets (id, name, public)
values ('isd-lead-photos', 'isd-lead-photos', true)
on conflict (id) do nothing;
