-- 一切如來心秘密全身舍利寶篋印陀羅尼念誦平台
-- 在 Supabase Dashboard > SQL Editor 執行本檔案。

create extension if not exists pgcrypto;

create table if not exists public.baoqie_recitations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  recited_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  count integer not null check (count between 1 and 1000000),
  contact_hash text not null check (char_length(contact_hash) = 64)
);

create index if not exists baoqie_recitations_contact_hash_idx
  on public.baoqie_recitations (contact_hash);

create index if not exists baoqie_recitations_recited_at_idx
  on public.baoqie_recitations (recited_at desc);

alter table public.baoqie_recitations enable row level security;

revoke all on table public.baoqie_recitations from anon, authenticated;
grant insert on table public.baoqie_recitations to anon, authenticated;

-- 匿名訪客只可新增，不可直接讀取整張資料表。
drop policy if exists "public can submit baoqie_recitations" on public.baoqie_recitations;
create policy "public can submit baoqie_recitations"
  on public.baoqie_recitations
  for insert
  to anon, authenticated
  with check (
    count between 1 and 1000000
    and char_length(name) between 1 and 80
    and char_length(contact_hash) = 64
  );

-- 查詢必須提供 Email + 電話組合產生的 contact_hash。
create or replace function public.lookup_baoqie_recitations(p_contact_hash text)
returns table (
  id uuid,
  created_at timestamptz,
  recited_at timestamptz,
  name text,
  count integer
)
language sql
security definer
set search_path = public
stable
as $$
  select r.id, r.created_at, r.recited_at, r.name, r.count
  from public.baoqie_recitations r
  where r.contact_hash = p_contact_hash
    and char_length(p_contact_hash) = 64
  order by r.recited_at desc
  limit 500;
$$;

revoke all on function public.lookup_baoqie_recitations(text) from public;
grant execute on function public.lookup_baoqie_recitations(text) to anon, authenticated;
