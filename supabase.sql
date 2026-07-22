-- 寶篋印念誦｜Baoqie Recite v5 完整資料庫設定
-- 新專案可執行本檔案；既有專案建議執行 supabase-upgrade.sql。

create extension if not exists pgcrypto;

create table if not exists public.baoqie_recitations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  recited_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  count integer not null check (count between 1 and 1000000),
  record_type text not null default 'dharani' check (record_type in ('sutra', 'dharani', 'title')),
  interface_language text not null check (interface_language in ('zh-TW', 'en', 'ja')),
  email text,
  phone text,
  contact_hash text not null check (char_length(contact_hash) = 64)
);

-- 讓既有舊版資料表也能安全升級。
alter table public.baoqie_recitations add column if not exists email text;
alter table public.baoqie_recitations add column if not exists phone text;
alter table public.baoqie_recitations add column if not exists record_type text;
alter table public.baoqie_recitations add column if not exists interface_language text;

alter table public.baoqie_recitations
  drop constraint if exists baoqie_recitations_record_type_check;
alter table public.baoqie_recitations
  add constraint baoqie_recitations_record_type_check
  check (record_type is null or record_type in ('sutra', 'dharani', 'title'));

alter table public.baoqie_recitations
  drop constraint if exists baoqie_recitations_interface_language_check;
alter table public.baoqie_recitations
  add constraint baoqie_recitations_interface_language_check
  check (interface_language is null or interface_language in ('zh-TW', 'en', 'ja'));

alter table public.baoqie_recitations
  drop constraint if exists baoqie_recitations_email_check;
alter table public.baoqie_recitations
  add constraint baoqie_recitations_email_check
  check (
    email is null
    or (
      char_length(email) between 3 and 254
      and email = lower(btrim(email))
      and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    )
  );

alter table public.baoqie_recitations
  drop constraint if exists baoqie_recitations_phone_check;
alter table public.baoqie_recitations
  add constraint baoqie_recitations_phone_check
  check (phone is null or phone ~ '^[0-9]{8,30}$');

create index if not exists baoqie_recitations_contact_hash_idx
  on public.baoqie_recitations (contact_hash);

create index if not exists baoqie_recitations_recited_at_idx
  on public.baoqie_recitations (recited_at desc);

create index if not exists baoqie_recitations_interface_language_idx
  on public.baoqie_recitations (interface_language);

alter table public.baoqie_recitations enable row level security;

revoke all on table public.baoqie_recitations from anon, authenticated;
grant insert on table public.baoqie_recitations to anon, authenticated;

drop policy if exists "public can submit baoqie_recitations"
  on public.baoqie_recitations;

create policy "public can submit baoqie_recitations"
  on public.baoqie_recitations
  for insert
  to anon, authenticated
  with check (
    count between 1 and 1000000
    and char_length(name) between 1 and 80
    and char_length(contact_hash) = 64
    and record_type in ('sutra', 'dharani', 'title')
    and interface_language in ('zh-TW', 'en', 'ja')
    and email is not null
    and phone is not null
    and char_length(email) between 3 and 254
    and email = lower(btrim(email))
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and phone ~ '^[0-9]{8,30}$'
  );

drop function if exists public.lookup_baoqie_recitations(text);

create function public.lookup_baoqie_recitations(p_contact_hash text)
returns table (
  id uuid,
  created_at timestamptz,
  recited_at timestamptz,
  name text,
  count integer,
  record_type text,
  interface_language text
)
language sql
security definer
set search_path = public
stable
as $$
  select r.id, r.created_at, r.recited_at, r.name, r.count, r.record_type, r.interface_language
  from public.baoqie_recitations r
  where r.contact_hash = p_contact_hash
    and char_length(p_contact_hash) = 64
  order by r.recited_at desc
  limit 500;
$$;

revoke all on function public.lookup_baoqie_recitations(text) from public;
grant execute on function public.lookup_baoqie_recitations(text) to anon, authenticated;

create or replace function public.get_baoqie_public_stats()
returns table (
  participant_count bigint,
  recitation_total bigint,
  record_count bigint
)
language sql
security definer
set search_path = public
stable
as $$
  select
    count(distinct r.contact_hash)::bigint,
    coalesce(sum(r.count), 0)::bigint,
    count(*)::bigint
  from public.baoqie_recitations r;
$$;

revoke all on function public.get_baoqie_public_stats() from public;
grant execute on function public.get_baoqie_public_stats() to anon, authenticated;
