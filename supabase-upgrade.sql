-- 寶篋印念誦 v5：既有 Supabase 專案升級用
-- 新增 interface_language 欄位，自動記錄使用者送出資料時所使用的繁中、英文或日文介面。
-- 執行順序：Supabase Dashboard > SQL Editor > New query > 貼上全部內容 > Run
-- 本升級保留既有資料；舊紀錄無法回推當時介面，因此 interface_language 會維持空白。

begin;

alter table public.baoqie_recitations
  add column if not exists email text;

alter table public.baoqie_recitations
  add column if not exists phone text;

alter table public.baoqie_recitations
  add column if not exists record_type text;

alter table public.baoqie_recitations
  add column if not exists interface_language text;

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

create index if not exists baoqie_recitations_interface_language_idx
  on public.baoqie_recitations (interface_language);

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

-- PostgreSQL 無法用 CREATE OR REPLACE 直接改變 RETURNS TABLE 欄位，需先刪除再重建。
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
    count(distinct r.contact_hash)::bigint as participant_count,
    coalesce(sum(r.count), 0)::bigint as recitation_total,
    count(*)::bigint as record_count
  from public.baoqie_recitations r;
$$;

revoke all on function public.get_baoqie_public_stats() from public;
grant execute on function public.get_baoqie_public_stats() to anon, authenticated;

commit;
