-- Resumes table -------------------------------------------------------------
-- 각 사용자의 이력서 정보를 저장하는 테이블입니다.
-- Supabase SQL Editor 또는 CLI를 사용해 이 스크립트를 실행하세요.

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  title text,
  summary text,
  experiences jsonb, -- 경력 리스트 (회사명, 역할, 기간 등)
  educations jsonb,  -- 학력 리스트
  skills text[],      -- 기술 스택
  links jsonb,        -- 포트폴리오, GitHub 등 링크
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- 동일 user_id 당 하나의 이력서만 유지하기 위한 제약 조건
create unique index if not exists resumes_user_id_unique_idx on public.resumes (user_id);

-- Row Level Security 설정 ---------------------------------------------------
alter table public.resumes enable row level security;

-- 본인 이력서만 조회/수정/생성 가능하도록 RLS 정책
do
$$
begin
  if not exists (
    select 1
    from pg_policy
    where polname = 'resumes_select_own'
      and polrelid = 'public.resumes'::regclass
  ) then
    create policy resumes_select_own
      on public.resumes
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policy
    where polname = 'resumes_insert_own'
      and polrelid = 'public.resumes'::regclass
  ) then
    create policy resumes_insert_own
      on public.resumes
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policy
    where polname = 'resumes_update_own'
      and polrelid = 'public.resumes'::regclass
  ) then
    create policy resumes_update_own
      on public.resumes
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end;
$$;


