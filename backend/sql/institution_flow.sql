-- EcoLink Institution Flow Schema + RLS

-- 1) Role column on profiles
alter table public.profiles
  add column if not exists role text not null default 'individual'
  check (role in ('individual', 'institution'));

-- 2) Institutions table
create table if not exists public.institutions (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('NGO', 'Vendor')),
  address text,
  phone text,
  description text,
  is_active boolean not null default true,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3) Pickup requests table
create table if not exists public.pickup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  title text not null,
  category text,
  condition text,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'completed', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists idx_pickup_requests_user_id on public.pickup_requests(user_id);
create index if not exists idx_pickup_requests_institution_id on public.pickup_requests(institution_id);
create index if not exists idx_pickup_requests_status on public.pickup_requests(status);

-- 4) RLS
alter table public.institutions enable row level security;
alter table public.pickup_requests enable row level security;

-- Institution records
drop policy if exists institutions_select_own on public.institutions;
drop policy if exists institutions_select_public on public.institutions;
create policy institutions_select_own
  on public.institutions for select
  to authenticated
  using (id = auth.uid());

create policy institutions_select_public
  on public.institutions for select
  to authenticated
  using (is_active = true and is_available = true);

drop policy if exists institutions_update_own on public.institutions;
create policy institutions_update_own
  on public.institutions for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists institutions_insert_own on public.institutions;
create policy institutions_insert_own
  on public.institutions for insert
  to authenticated
  with check (id = auth.uid());

-- Pickup requests
drop policy if exists pickup_insert_by_user on public.pickup_requests;
create policy pickup_insert_by_user
  on public.pickup_requests for insert
  with check (user_id = auth.uid());

drop policy if exists pickup_select_user_or_institution on public.pickup_requests;
create policy pickup_select_user_or_institution
  on public.pickup_requests for select
  using (user_id = auth.uid() or institution_id = auth.uid());

drop policy if exists pickup_update_assigned_institution on public.pickup_requests;
create policy pickup_update_assigned_institution
  on public.pickup_requests for update
  using (institution_id = auth.uid())
  with check (institution_id = auth.uid());
