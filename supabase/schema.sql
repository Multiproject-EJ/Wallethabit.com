-- WalletHabit Supabase schema
-- Run this script inside your Supabase SQL editor to provision the customer tables
-- and policies that power auth, purchases, and module access.

create extension if not exists "pgcrypto";

create schema if not exists public;

create or replace function public.trigger_set_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan_tier text not null default 'freemium',
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_timestamp on public.profiles;
create trigger set_timestamp
  before update on public.profiles
  for each row
  execute procedure public.trigger_set_timestamp();

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  is_premium boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_tier text not null,
  provider text not null default 'freemium',
  status text not null default 'active',
  reference text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.customer_modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  unlocked_at timestamptz not null default timezone('utc', now()),
  unlocked_by text not null default 'system',
  constraint customer_modules_unique_access unique (user_id, module_id)
);

alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.customer_modules enable row level security;
alter table public.modules enable row level security;

create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Users can view their own purchases"
  on public.purchases
  for select
  using (auth.uid() = user_id);

create policy "Users can record their own purchases"
  on public.purchases
  for insert
  with check (auth.uid() = user_id);

create policy "Users can view their unlocked modules"
  on public.customer_modules
  for select
  using (auth.uid() = user_id);

create policy "Users can unlock modules for themselves"
  on public.customer_modules
  for insert
  with check (auth.uid() = user_id);

create policy "Users can revoke their own module access"
  on public.customer_modules
  for delete
  using (auth.uid() = user_id);

create policy "Authenticated users can read module catalog"
  on public.modules
  for select
  using (auth.role() = 'authenticated');

insert into public.modules (slug, name, description, is_premium)
values
  ('budget', 'Budget planner', 'Plan spending with real-time envelope tracking.', false),
  ('debts', 'Debt payoff lab', 'Model snowball vs avalanche, track payoff forecasts.', false),
  ('savings', 'Savings tracker', 'Create goals, automate transfers, and celebrate milestones.', false),
  ('investments', 'Investments hub', 'Monitor holdings and projected growth.', false),
  ('income', 'Income & side hustles', 'Track paydays, gigs, and momentum boosts.', false),
  ('subscriptions', 'Subscription tracker', 'Monitor renewals, reminders, and recurring spend.', false),
  ('bills', 'Bills tracker', 'Organise utilities, policies, and due dates.', false),
  ('realEstate', 'Real estate', 'Track property values, mortgages, and rental yields.', true),
  ('insurance', 'Insurance vault', 'Spot coverage gaps and renewal reminders.', true),
  ('taxes', 'Taxes workspace', 'Prepare filings, deductions, and estimated payments.', true),
  ('retirement', 'Retirement studio', 'Project glide paths and safe-withdrawal coverage.', true),
  ('aiAdvisor', 'AI advisor', 'Pro insights, smart nudges, and conversational planning.', true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  is_premium = excluded.is_premium;

