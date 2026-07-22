-- 寶篋印念誦 v3：既有 Supabase 專案升級用
-- 執行順序：Supabase Dashboard > SQL Editor > New query > 貼上全部內容 > Run
-- 本升級保留既有資料；舊紀錄的 email、phone 會維持空白，新紀錄開始分欄保存。

begin;

alter table public.baoqie_recitations
  add column if not exists email text;

alter table public.baoqie_recitations
  add column if not exists phone text;

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
  check (
    phone is null
    or phone ~ '^[0-9]{8,30}$'
  );

-- 公開訪客只可以新增符合格式的資料，不能直接讀取整張資料表。
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
    and email is not null
    and phone is not null
    and char_length(email) between 3 and 254
    and email = lower(btrim(email))
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and phone ~ '^[0-9]{8,30}$'
  );

-- 本人查詢只回傳念誦紀錄，不回傳 Email 或電話。
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

-- 公開首頁只取得三個整體統計數字，不會取得任何個人資料。
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
