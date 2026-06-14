-- SQL Script to fix profiles Row Level Security (RLS)
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- Check if RLS is enabled on profiles
alter table public.profiles enable row level security;

-- Option 1: Highly Secure Policy (Recommended)
-- Allow users to view their own profile, AND allow institutions to view profiles of users
-- who have submitted pickup requests assigned to them.
drop policy if exists "Allow users to read own profile" on public.profiles;
create policy "Allow users to read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Allow institutions to read requester profiles" on public.profiles;
create policy "Allow institutions to read requester profiles"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.pickup_requests
      where pickup_requests.user_id = profiles.id
        and pickup_requests.institution_id = auth.uid()
    )
  );

-- Option 2: Simpler Policy (Alternative)
-- Allow any logged-in user to view profile names and contact details.
-- (Uncomment the lines below if you prefer this option instead of Option 1)
-- drop policy if exists "Allow authenticated users to read profiles" on public.profiles;
-- create policy "Allow authenticated users to read profiles"
--   on public.profiles for select
--   to authenticated
--   using (true);
