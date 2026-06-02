-- FIX: Rebuild institutions RLS policies for EcoLink
-- Run this in Supabase SQL Editor.

alter table public.institutions enable row level security;

-- Clean up old policies
drop policy if exists institutions_select_own on public.institutions;
drop policy if exists institutions_select_public on public.institutions;
drop policy if exists institutions_insert_own on public.institutions;
drop policy if exists institutions_update_own on public.institutions;

-- Institution users can view their own institution row
create policy institutions_select_own
  on public.institutions
  for select
  to authenticated
  using (id = auth.uid());

-- All authenticated users can view active and available institutions
create policy institutions_select_public
  on public.institutions
  for select
  to authenticated
  using (is_active = true and is_available = true);

-- Only the authenticated owner can insert their own institution row
create policy institutions_insert_own
  on public.institutions
  for insert
  to authenticated
  with check (id = auth.uid());

-- Only the authenticated owner can update their own institution row
create policy institutions_update_own
  on public.institutions
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Optional: verify by selecting current policies
-- select policyname, permissive, roles, cmd from pg_policies where tablename = 'institutions';
