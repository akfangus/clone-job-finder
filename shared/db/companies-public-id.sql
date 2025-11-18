-- Companies public id ------------------------------------------------------
-- companies 테이블에 순차적인 숫자 ID를 추가합니다.
-- 이 값은 URL 등에 노출하기 위한 용도로 사용하고, 실제 PK(uuid)는 그대로 유지합니다.

alter table public.companies
  add column if not exists public_id integer generated always as identity unique;

-- 기존 행에 대해 created_at 순서대로 public_id를 채우고 싶다면 아래 쿼리를 한 번 실행하세요.
-- (이미 값이 있는 행은 건드리지 않습니다.)
--
-- update public.companies as c
-- set public_id = sub.rn
-- from (
--   select id, row_number() over (order by created_at) as rn
--   from public.companies
-- ) as sub
-- where c.id = sub.id
--   and c.public_id is null;



