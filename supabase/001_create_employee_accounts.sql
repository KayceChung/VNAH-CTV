-- Supabase/PostgreSQL schema for employee registration
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists public.employee_accounts (
  id uuid primary key default gen_random_uuid(),
  id_employees varchar(20) not null unique,
  password_hash text not null,
  full_name varchar(120) not null,
  date_of_birth date not null,
  sex varchar(30) not null,
  agency_type varchar(50) not null,
  province varchar(120) not null,
  district varchar(120) not null,
  ward varchar(120) not null,
  address_detail varchar(255) not null,
  working_at varchar(150) not null,
  phone varchar(10) not null,
  zalo varchar(10),
  email citext not null unique,
  status varchar(20) not null default 'deactivate',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint employee_accounts_id_employees_format
    check (id_employees ~ '^[A-Za-z0-9_]{3,20}$'),

  constraint employee_accounts_phone_format
    check (phone ~ '^0[0-9]{9}$'),

  constraint employee_accounts_zalo_format
    check (zalo is null or zalo ~ '^0[0-9]{9}$'),

  constraint employee_accounts_status_values
    check (status in ('deactivate', 'active', 'locked')),

  constraint employee_accounts_agency_type_values
    check (
      agency_type in (
        'Bệnh viện',
        'Trung tâm y tế',
        'Trạm y tế',
        'Sở y tế',
        'Phòng khám',
        'Khác'
      )
    )
);

create index if not exists idx_employee_accounts_phone on public.employee_accounts(phone);
create index if not exists idx_employee_accounts_status on public.employee_accounts(status);
create index if not exists idx_employee_accounts_location on public.employee_accounts(province, district, ward);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_employee_accounts_updated_at on public.employee_accounts;
create trigger trg_employee_accounts_updated_at
before update on public.employee_accounts
for each row execute function public.set_updated_at();

alter table public.employee_accounts enable row level security;

-- Optional: only service_role can write directly.
-- You can open specific policies later for admin users.
drop policy if exists employee_accounts_service_select on public.employee_accounts;
create policy employee_accounts_service_select
on public.employee_accounts
for select
to service_role
using (true);

drop policy if exists employee_accounts_service_insert on public.employee_accounts;
create policy employee_accounts_service_insert
on public.employee_accounts
for insert
to service_role
with check (true);

drop policy if exists employee_accounts_service_update on public.employee_accounts;
create policy employee_accounts_service_update
on public.employee_accounts
for update
to service_role
using (true)
with check (true);
