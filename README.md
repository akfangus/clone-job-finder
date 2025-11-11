## Clone Soomgo – 구인구직 플랫폼 초기 세팅

이 저장소는 프리랜서-고객 매칭을 목표로 하는 **구인구직 플랫폼**의 초석을 다지기 위한 환경 구성 프로젝트입니다. 서비스 본 기능은 아직 구축되지 않았지만, 디자인 시스템과 인프라를 미리 정리해 향후 포트폴리오 확장 속도를 높이는 데 집중했습니다.

---

## 기술 스택 개요

- **Framework**: Next.js 15 (Page Router) + React 19
- **스타일링**: Tailwind CSS, shadcn/ui 기반 유틸리티, Radix UI
- **아이콘 & 유틸리티**: lucide-react, class-variance-authority, lodash (단일 함수 import 전략)
- **이미지 & 폰트**: WebP 우선 전략, Pretendard Variable
- **테스팅/문서화**: Storybook 10, Chromatic 준비
- **언어/도구**: TypeScript, ESLint/Prettier, Turbopack dev 서버

---

## 최근 작업 요약 (2025-11-11)

- 반응형 내비게이션 시스템 구축: `components/navigation` 전반을 정리해 데스크톱/모바일 헤더를 분리하고, `SubMenuBar`와 `useNavInteraction` 훅을 통해 호버/클릭 기반 상호작용을 지원합니다.
- 사용성 개선 훅 정리: `useNavInteraction`과 `useResponsiveBreakpoint` 훅에서 명시적 상태 분리와 메모이제이션으로 재랜더를 최소화했습니다.
- 레이아웃 안정화: `ResponsiveContainer` 컴포넌트로 가시성 제어(requestAnimationFrame 기반)와 뷰포트 폭 제한을 통합해 초기 레이아웃 시프트를 줄였습니다.

---

## 환경 구성 & 스크립트

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# Storybook 문서
npm run storybook

# 생산 빌드
npm run build

# Lint 검사 (자동 수정)
npm run lint
npm run lint:fix

# Storybook 정적 빌드
npm run build-storybook
```

개발 서버는 `http://localhost:3000`, Storybook은 `http://localhost:6006`에서 확인할 수 있습니다.

---

## 프로젝트 구조 하이라이트

```
app/                # Next.js 페이지, 전역 레이아웃 및 스타일
components/ui/      # shadcn 스타일 가이드에 맞춘 UI 컴포넌트
 ├─ badge.tsx
 ├─ button.tsx
 ├─ dialog.tsx
 ├─ portal.tsx
 ├─ tag.tsx
 └─ tooltip.tsx
components/ui/*.stories.tsx
                    # Storybook 문서 (Badge, Button, Tag, Portal, Tooltip 등)
lib/utils.ts        # Tailwind 클래스 병합 유틸리티 등
theme/              # 텍스트 스타일 등 토큰 정의
```

---

## 구축된 UI 컴포넌트

- `Button`, `Badge`, `Tag`  
  - `class-variance-authority`로 variant/size 제어  
  - Storybook playground 제공, 아이콘 및 로딩 변형 포함

- `Portal`  
  - `Dialog` 래퍼를 이용한 전체폭 모달  
  - 최대 너비 1060px, 좌우 16px 여백 유지  
  - header/content/footer를 ReactNode로 주입 가능

- `Tooltip`  
  - Radix Tooltip 기반  
  - 방향(side), 지연, 항상 열림(open) 시나리오를 Storybook에서 직접 제어

모든 Storybook 문서는 인터랙티브 컨트롤을 제공하여 디자인 리뷰 및 회귀 테스트를 지원합니다.

---

## 개발 가이드

- 함수형 컴포넌트 + 명시적 TypeScript 인터페이스 사용
- 로직은 가급적 훅으로 분리하고 컴포넌트에서는 단순 표현에 집중
- Tailwind 유틸리티는 선언형으로 작성하며, 중복보다 반복과 모듈화를 선호
- 이미지 자산은 WebP 포맷, `TCImage`/`TCImageBox`로 최적화 처리 예정
- lodash는 개별 함수 import (`import keys from 'lodash/keys'`) 규칙 준수
- dayjs를 날짜/시간 처리 도구로 채택 (향후 API 연동 시 활용 예정)

---

## 향후 로드맵 아이디어

- 구직자/고객 매칭을 위한 도메인 모델 정의 및 React Query 기반 API 연동
- 검색·필터 UI, 즐겨찾기 등 주요 인터랙션 컴포넌트 확장
- Storybook 기반 비주얼 회귀, Vitest + Playwright를 이용한 E2E 테스트 도입
- 접근성(A11y) 점검 및 다크모드/국제화(i18n) 지원

---

## 기여 & 피드백

프로젝트는 포트폴리오용으로 지속적인 개선이 예정되어 있습니다. 의견이나 개선 아이디어가 있다면 이슈/PR 또는 메일로 알려주세요. 즐거운 개발 되세요! 🚀
