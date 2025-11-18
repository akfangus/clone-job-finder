## Supabase Seed Scripts

이 디렉터리는 Supabase DB에 기본/목 데이터를 안전하게 채우기 위한 SQL 스크립트를 보관합니다.

- `companies-jobs-seed.sql`
  - `/positions` 페이지에 필요한 `companies`, `jobs` 기본 데이터를 upsert합니다.
  - 여러 번 실행해도 중복 없이 안전합니다.
  - Supabase SQL Editor 또는 MCP `execute_sql`을 이용해 실행하세요.


