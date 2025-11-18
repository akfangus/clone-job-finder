-- Jobs extra seed ----------------------------------------------------------
-- 기존 기본 seed 외에 추가 포지션만 넣고 싶을 때 사용하는 스크립트입니다.
-- ON CONFLICT (company_id, title) DO UPDATE 로 중복 없이 안전하게 upsert 됩니다.

insert into public.jobs (
  company_id,
  title,
  category,
  employment_type,
  location,
  description,
  salary_range,
  tags,
  is_active,
  summary,
  experience_level,
  work_type,
  min_years_experience,
  max_years_experience,
  apply_url,
  deadline
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
  j.is_active,
  j.summary,
  j.experience_level,
  j.work_type,
  j.min_years_experience,
  j.max_years_experience,
  j.apply_url,
  j.deadline
from (
  values
    -- 혜움 추가 포지션
    ('혜움', '신규 플랫폼 프론트엔드 개발자', '개발', '정규직', '서울',
     '신규 B2B 플랫폼 프론트엔드 개발', '5,500만원~8,000만원',
     array['React','Next.js','TypeScript'], true,
     '신규 플랫폼의 UI를 처음부터 함께 설계/구현합니다.', '미들', '하이브리드', 3, 7,
     'https://www.example-hyeum.com/jobs/platform-frontend', '2025-07-01'),
    ('혜움', '신규 플랫폼 백엔드 개발자', '개발', '정규직', '서울',
     '신규 B2B 플랫폼 백엔드 개발', '6,000만원~9,000만원',
     array['Node.js','PostgreSQL'], true,
     '대규모 B2B 트래픽을 처리할 백엔드 시스템을 설계합니다.', '시니어', '하이브리드', 5, 10,
     'https://www.example-hyeum.com/jobs/platform-backend', '2025-07-15'),
    -- 토스 추가 포지션
    ('토스', '데이터 사이언티스트', '마케팅', '정규직', '서울',
     '마케팅 성과 분석 및 모델링', null,
     array['SQL','Python','ML'], true,
     '마케팅 캠페인 성과를 분석하고 예측 모델을 만듭니다.', '미들', '하이브리드', 3, 7,
     'https://toss.im/careers/data-scientist', '2025-06-20'),
    -- 당근마켓 추가 포지션
    ('당근마켓', '프로덕트 마케터', '마케팅', '정규직', '서울',
     '신규 기능 론칭 및 그로스 마케팅', null,
     array['Product Marketing','Growth'], true,
     '신규 기능 론칭 전략 수립과 그로스 실험을 진행합니다.', '미들', '하이브리드', 3, 7,
     'https://team.daangn.com/jobs/product-marketer', '2025-06-30'),
    -- 네이버 추가 포지션
    ('네이버', '검색 랭킹 엔지니어', '개발', '정규직', '판교',
     '검색 랭킹 알고리즘 개선', null,
     array['Ranking','ML','Search'], true,
     '검색 품질을 개선하기 위한 랭킹 모델을 설계/개선합니다.', '시니어', '하이브리드', 5, 12,
     'https://recruit.navercorp.com/search-ranking', '2025-07-10'),
    -- 쿠팡 추가 포지션
    ('쿠팡', '프론트엔드 엔지니어 (로켓와우)', '개발', '정규직', '송파',
     '로켓와우 관련 프론트엔드 개발', null,
     array['React','TypeScript'], true,
     '로켓와우 서비스의 UX를 개선하고 신규 기능을 개발합니다.', '미들', '오피스', 3, 7,
     'https://rocketyourcareer.coupang.com/rocketwow-frontend', '2025-07-05')
) as j(
  company_name,
  title,
  category,
  employment_type,
  location,
  description,
  salary_range,
  tags,
  is_active,
  summary,
  experience_level,
  work_type,
  min_years_experience,
  max_years_experience,
  apply_url,
  deadline
)
join public.companies c on c.name = j.company_name
on conflict (company_id, title) do update
set
  category = excluded.category,
  employment_type = excluded.employment_type,
  location = excluded.location,
  description = excluded.description,
  salary_range = excluded.salary_range,
  tags = excluded.tags,
  is_active = excluded.is_active,
  summary = excluded.summary,
  experience_level = excluded.experience_level,
  work_type = excluded.work_type,
  min_years_experience = excluded.min_years_experience,
  max_years_experience = excluded.max_years_experience,
  apply_url = excluded.apply_url,
  deadline = excluded.deadline;


