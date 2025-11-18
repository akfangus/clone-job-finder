-- Companies seed -----------------------------------------------------------
insert into public.companies (name, logo_url, homepage_url)
values
  ('혜움', null, 'https://www.example-hyeum.com'),
  ('토스', null, 'https://toss.im'),
  ('당근마켓', null, 'https://www.daangn.com'),
  ('네이버', null, 'https://www.navercorp.com'),
  ('쿠팡', null, 'https://www.coupang.com')
on conflict (name) do update
set
  logo_url = excluded.logo_url,
  homepage_url = excluded.homepage_url;

-- Jobs seed ----------------------------------------------------------------
insert into public.jobs (
  company_id,
  title,
  category,
  employment_type,
  location,
  description,
  salary_range,
  tags,
  is_active
)
select
  c.id as company_id,
  j.title,
  j.category,
  j.employment_type,
  j.location,
  j.description,
  j.salary_range,
  j.tags,
  j.is_active
from (
  values
    -- 혜움
    ('혜움', '프론트엔드 개발자', '개발', '정규직', '서울', 'Next.js와 TypeScript 기반 웹 서비스 개발', '5,000만원~7,000만원', array['React', 'TypeScript', 'Next.js'], true),
    ('혜움', '백엔드 개발자', '개발', '정규직', '서울', 'Node.js 기반 API 및 인프라 개발', '5,000만원~8,000만원', array['Node.js', 'PostgreSQL', 'Supabase'], true),
    -- 토스
    ('토스', '브랜드 디자이너', '디자인', '정규직', '서울', '브랜드 아이덴티티 및 캠페인 디자인', null, array['Branding', 'Figma'], true),
    ('토스', '프로덕트 디자이너', '디자인', '정규직', '서울', '모바일/웹 프로덕트 UX/UI 디자인', null, array['UX', 'UI', 'Figma'], true),
    -- 당근마켓
    ('당근마켓', '마케팅 매니저', '마케팅', '정규직', '서울', '서비스 성장 전략 수립 및 실행', null, array['Growth', 'Performance Marketing'], true),
    ('당근마켓', '콘텐츠 마케터', '마케팅', '정규직', '서울', '콘텐츠 기획 및 제작', null, array['Content', 'SNS'], true),
    -- 네이버
    ('네이버', '프론트엔드 개발자', '개발', '정규직', '판교', 'React 기반 신규 서비스 프런트 개발', '6,000만원~9,000만원', array['React', 'Recoil', 'TypeScript'], true),
    -- 쿠팡
    ('쿠팡', '데이터 분석가', '마케팅', '정규직', '송파', '커머스 데이터 분석 및 인사이트 도출', null, array['SQL', 'Python', 'Analytics'], true)
) as j(company_name, title, category, employment_type, location, description, salary_range, tags, is_active)
join public.companies c on c.name = j.company_name
on conflict (company_id, title) do update
set
  category = excluded.category,
  employment_type = excluded.employment_type,
  location = excluded.location,
  description = excluded.description,
  salary_range = excluded.salary_range,
  tags = excluded.tags,
  is_active = excluded.is_active;


