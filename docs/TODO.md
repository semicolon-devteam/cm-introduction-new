# TODO - cm-template 프로젝트 작업 관리

**작업 시작일**: 2025-11-05
**관련 Epic**: [semicolon-devteam/command-center#129](https://github.com/semicolon-devteam/command-center/issues/129)

---

## 📋 전체 진행 상황

### Phase 1: types/ → models/ 전환 ✅
- **상태**: 완료
- **완료일**: 이전 세션

### Phase 2: API Client Factory Pattern 구현 ✅
- **상태**: 완료
- **완료일**: 이전 세션

### Phase 3: Domain 구조 전환 ✅
- **상태**: 완료
- **완료일**: 이전 세션
- **세부 내역**:
  - Phase 3.1: posts, auth, dashboard 도메인 전환 완료
  - Phase 3.2: Hooks 정리 (도메인별 `_hooks/` 분리) 완료
  - Phase 3.3: Legacy `services/` 디렉토리 제거 완료

### Phase 4: DDD 정석 구조로 리팩토링 ✅
- **상태**: 완료
- **완료일**: 2025-11-05
- **완료 작업**:
  - ✅ posts 도메인 리팩토링 (repository, api-client 도메인 내부로 이동)
  - ✅ dashboard 도메인 분석 (sidebar는 공통 인프라로 유지)
  - ✅ Import 경로 수정 (4개 파일)
  - ✅ Legacy 파일 삭제 (5개 파일)
  - ✅ 빌드 테스트 및 검증 (성공)
  - ✅ 문서 업데이트 (CLAUDE.md, DDD-ARCHITECTURE.md)
  - ✅ Git 커밋 생성

### Phase 5: Dashboard Activity 기능 구현 ✅
- **상태**: 완료
- **완료일**: 2025-11-05 (현재 세션)
- **완료 작업**:
  - ✅ Activity 타입 정의 (models/activity.types.ts)
  - ✅ Activity Repository 생성 (dashboard/_repositories/)
  - ✅ Activity API Route 생성 (api/activities/)
  - ✅ Activity API Client 생성 (dashboard/_api-clients/, Factory Pattern)
  - ✅ Activity Hook 생성 (dashboard/_hooks/useActivities.ts)
  - ✅ ActivityCard 컴포넌트 업데이트 (실제 데이터 연결)
  - ✅ 빌드 검증 (성공)

### Phase 6: Profile 도메인 DDD 전환 ✅
- **상태**: 완료
- **완료일**: 2025-11-05 (현재 세션)
- **완료 작업**:
  - ✅ Profile 타입 정의 (models/profile.types.ts)
  - ✅ Profile Repository 생성 (profile/_repositories/)
  - ✅ Profile API Route 생성 (api/profile/)
  - ✅ Profile API Client 생성 (profile/_api-clients/, Factory Pattern)
  - ✅ Profile Hook 생성 (profile/_hooks/, useProfile & useUpdateProfile)
  - ✅ profile/page.tsx 리팩토링 (Repository 패턴 적용)
  - ✅ 빌드 검증 (성공)

### Phase 7: CLAUDE.md 문서 업데이트 ✅
- **상태**: 완료
- **완료일**: 2025-11-05 (현재 세션)
- **완료 작업**:
  - ✅ 현재 구조 다이어그램 업데이트 (dashboard, profile DDD 완성 반영)
  - ✅ Domain Component Pattern 섹션 업데이트
  - ✅ Domain Hooks Pattern 섹션 업데이트
  - ✅ auth 도메인 Server Actions 패턴 명시
  - ✅ 빌드 검증 (성공)

---

## 🎯 현재 구조 (2025-11-05 기준)

```
src/app/
├── posts/                    # ✅ DDD 완성 (core-backend 구조와 동일)
│   ├── _repositories/        # 서버사이드 데이터 접근
│   │   ├── posts.repository.ts
│   │   └── index.ts
│   ├── _api-clients/         # 브라우저 HTTP 통신
│   │   ├── posts.client.ts
│   │   ├── interfaces/posts.interface.ts
│   │   ├── implementations/
│   │   │   ├── next-posts.service.ts
│   │   │   └── spring-posts.service.ts
│   │   └── index.ts
│   ├── _hooks/               # React 상태 관리
│   │   ├── usePosts.ts
│   │   ├── usePost.ts
│   │   └── index.ts
│   ├── _components/          # 도메인 전용 UI (6개)
│   └── page.tsx
├── dashboard/                # ✅ DDD 완성 (Activity 기능 구현)
│   ├── _repositories/        # 서버사이드 데이터 접근
│   │   ├── activity.repository.ts
│   │   └── index.ts
│   ├── _api-clients/         # 브라우저 HTTP 통신
│   │   ├── activity.client.ts
│   │   ├── interfaces/activity.interface.ts
│   │   ├── implementations/
│   │   │   ├── next-activity.service.ts
│   │   │   └── spring-activity.service.ts
│   │   └── index.ts
│   ├── _hooks/               # React 상태 관리
│   │   ├── useActivities.ts
│   │   └── index.ts
│   ├── _components/          # 5개 컴포넌트 (ActivityCard 데이터 연동 완료)
│   └── page.tsx
├── auth/                     # 공통 인프라 사용
│   ├── _components/          # AuthLayout
│   ├── login/page.tsx
│   └── register/page.tsx
├── profile/                  # ✅ DDD 완성 (Profile CRUD 구현)
│   ├── _repositories/        # 서버사이드 데이터 접근
│   │   ├── profile.repository.ts
│   │   └── index.ts
│   ├── _api-clients/         # 브라우저 HTTP 통신
│   │   ├── profile.client.ts
│   │   ├── interfaces/profile.interface.ts
│   │   ├── implementations/
│   │   │   ├── next-profile.service.ts
│   │   │   └── spring-profile.service.ts
│   │   └── index.ts
│   ├── _hooks/               # React 상태 관리
│   │   ├── useProfile.ts
│   │   ├── useUpdateProfile.ts
│   │   └── index.ts
│   ├── _components/          # 3개 컴포넌트
│   └── page.tsx
├── api/                      # API Routes (로컬 개발용)
│   ├── posts/
│   ├── activities/           # ⭐ Phase 5
│   ├── profile/              # ⭐ Phase 6
│   └── sidebar/
```

---

## 📝 진행 중인 작업

**현재 작업 없음** - Phase 7 완료

---

## 🔜 다음 작업 (대기 중)

### Phase 8 후보: auth 도메인 추가 고려
- [ ] auth 도메인 DDD 구조 전환 고려 (현재 Server Actions 패턴 적절히 사용 중)

### Phase 9 후보: 테스트 및 품질 개선
- [ ] 단위 테스트 작성 (Vitest + React Testing Library)
- [ ] E2E 테스트 작성 (Playwright)
- [ ] 테스트 커버리지 80% 이상 달성
- [ ] 접근성 테스트 (모바일/데스크톱)

### Phase 10 후보: 성능 최적화
- [ ] Bundle 크기 분석 및 최적화 (< 500KB 목표)
- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] 코드 스플리팅 적용
- [ ] LCP, FID, CLS 성능 지표 개선

### Phase 11 후보: 배포 준비
- [ ] 환경별 설정 분리 (dev/staging/prod)
- [ ] CI/CD 파이프라인 구축
- [ ] Vercel 배포 설정
- [ ] 모니터링 및 로깅 설정

---

## 📊 최근 변경 사항

### 2025-11-05 (현재 세션)

**Phase 7: CLAUDE.md 문서 업데이트 완료**

**변경된 파일 (1개)**:
- **수정**: 1개
  - `CLAUDE.md` (현재 구조 및 도메인 패턴 업데이트)

**구현 내용**:
- 현재 구조 다이어그램 업데이트
  - dashboard: "공통 인프라 사용" → "✅ DDD 완성 (Activity 기능)"
  - profile: "공통 인프라 사용" → "✅ DDD 완성 (Profile CRUD)"
  - auth: "Server Actions 패턴 (적절히 구현됨)" 명시
- Domain Component Pattern 섹션 업데이트
  - dashboard: ActivityRepository, activityClient, useActivities 추가
  - profile: ProfileRepository, profileClient, useProfile/useUpdateProfile 추가
- Domain Hooks Pattern 섹션 업데이트
  - 각 도메인별 Hooks 목록 명시 (posts, dashboard, profile)

**빌드 검증**: ✅ 성공

---

**Phase 6: Profile 도메인 DDD 전환 완료**

**변경된 파일 (12개)**:
- **생성**: 12개
  - `src/models/profile.types.ts` (Profile 타입 정의)
  - `src/app/profile/_repositories/profile.repository.ts`
  - `src/app/profile/_repositories/index.ts`
  - `src/app/api/profile/route.ts` (GET /api/profile, PUT /api/profile)
  - `src/app/profile/_api-clients/interfaces/profile.interface.ts`
  - `src/app/profile/_api-clients/implementations/next-profile.service.ts`
  - `src/app/profile/_api-clients/implementations/spring-profile.service.ts`
  - `src/app/profile/_api-clients/profile.client.ts`
  - `src/app/profile/_api-clients/index.ts`
  - `src/app/profile/_hooks/useProfile.ts`
  - `src/app/profile/_hooks/useUpdateProfile.ts`
  - `src/app/profile/_hooks/index.ts`

- **수정**: 1개
  - `src/app/profile/page.tsx` (Repository 패턴 적용)

**구현 내용**:
- Profile 도메인에 완전한 DDD 구조 구현
- Profile Repository: 사용자 프로필 조회 및 업데이트
- Profile API Client: Factory Pattern (Spring/Next.js 전환)
- Profile Hooks: useProfile (조회), useUpdateProfile (수정)
- profile/page.tsx: Repository를 통한 SSR 데이터 페칭

**빌드 검증**: ✅ 성공 (ESLint warnings만 존재, 기능 이상 없음)

**기술적 해결사항**:
- Supabase TypeScript 타입 추론 문제 해결 (client type assertion)
- Database Update 타입 제약 우회 (Phase 5 ActivityRepository 패턴 적용)

---

**Phase 5: Dashboard Activity 기능 구현 완료**

**변경된 파일 (15개)**:
- **생성**: 15개
  - `src/models/activity.types.ts` (Activity 타입 정의)
  - `src/app/dashboard/_repositories/activity.repository.ts`
  - `src/app/dashboard/_repositories/index.ts`
  - `src/app/api/activities/route.ts`
  - `src/app/dashboard/_api-clients/interfaces/activity.interface.ts`
  - `src/app/dashboard/_api-clients/implementations/next-activity.service.ts`
  - `src/app/dashboard/_api-clients/implementations/spring-activity.service.ts`
  - `src/app/dashboard/_api-clients/activity.client.ts`
  - `src/app/dashboard/_api-clients/index.ts`
  - `src/app/dashboard/_hooks/useActivities.ts`
  - `src/app/dashboard/_hooks/index.ts`

- **수정**: 2개
  - `src/app/dashboard/_components/ActivityCard.tsx` (Client Component로 전환, Hook 연동)
  - `src/app/dashboard/page.tsx` (ActivityCard에 userId props 전달)

**구현 내용**:
- Dashboard 도메인에 완전한 DDD 구조 구현
- Activity Repository: 사용자 작성 게시글 기반 활동 조회
- Activity API Client: Factory Pattern (Spring/Next.js 전환)
- Activity Hook: useActivities (React 상태 관리)
- ActivityCard: 실제 데이터 연동 (로딩/에러/빈 상태 처리)

**빌드 검증**: ✅ 성공 (ESLint warnings만 존재, 기능 이상 없음)

---

**Phase 4: DDD 정석 구조로 리팩토링 완료**

**변경된 파일 (13개)**:
- **생성**: 2개 (barrel exports)
  - `src/app/posts/_repositories/index.ts`
  - `src/app/posts/_api-clients/index.ts`

- **이동**: 5개
  - `src/repositories/post.repository.ts` → `src/app/posts/_repositories/posts.repository.ts`
  - `src/lib/api-clients/posts.client.ts` → `src/app/posts/_api-clients/posts.client.ts`
  - `src/lib/api-clients/interfaces/posts.interface.ts` → `src/app/posts/_api-clients/interfaces/posts.interface.ts`
  - `src/lib/api-clients/implementations/next-posts.service.ts` → `src/app/posts/_api-clients/implementations/next-posts.service.ts`
  - `src/lib/api-clients/implementations/spring-posts.service.ts` → `src/app/posts/_api-clients/implementations/spring-posts.service.ts`

- **수정**: 6개
  - `src/app/api/posts/route.ts` (import 경로)
  - `src/app/api/posts/[id]/route.ts` (import 경로)
  - `src/app/posts/_hooks/usePosts.ts` (import 경로)
  - `src/app/posts/_hooks/usePost.ts` (import 경로)
  - `CLAUDE.md` (DDD 구조 업데이트)
  - `docs/architecture/DDD-ARCHITECTURE.md` (Phase 4 완료 상태 업데이트)

**커밋 메시지**:
```
♻️ #129 Phase 4: DDD 정석 구조로 리팩토링 완료

core-backend 구조를 참고하여 Next.js 프로젝트를 DDD 정석 구조로 전환

주요 변경사항:
- posts 도메인: repository, api-client를 도메인 내부로 이동
  - _repositories/ 디렉토리 생성 및 PostsRepository 이동
  - _api-clients/ 디렉토리 생성 및 Factory Pattern 구현체 이동
- dashboard 도메인: sidebar는 공통 인프라로 유지
  - 여러 도메인에서 공유하는 sidebar는 lib/api-clients/에 유지
- Import 경로 수정:
  - API Routes: @/app/posts/_repositories 사용
  - Hooks: 상대 경로 (../_api-clients) 사용
- Legacy 파일 정리:
  - src/repositories/post.repository.ts 삭제
  - src/lib/api-clients/posts.* 관련 파일 삭제
- 문서 업데이트:
  - CLAUDE.md: DDD 구조 다이어그램 및 설명 업데이트
  - DDD-ARCHITECTURE.md: Phase 4 완료 상태로 업데이트

최종 구조:
src/app/posts/
├── _repositories/ ⭐ (서버사이드 데이터 접근)
├── _api-clients/ ⭐ (브라우저 HTTP 통신)
├── _hooks/ (React 상태 관리)
├── _components/ (도메인 전용 UI)
└── page.tsx

core-backend 구조 (참조):
domain/posts/
├── repository/ ⭐
├── service/
├── entity/
└── web/

빌드 검증: ✅ 성공 (ESLint warnings만 존재, 기능 이상 없음)
```

---

## 🔍 주요 의사결정 기록

### 1. Repository/API Client 위치 결정 (2025-11-05)
- **문제**: Repository와 API Client를 어디에 위치시킬 것인가?
- **초기 판단**: 루트 레벨 (`src/repositories/`, `src/api-clients/`)
- **수정**: 사용자가 core-backend 구조 확인 요청
- **최종 결정**: 도메인 내부 (`src/app/posts/_repositories/`, `src/app/posts/_api-clients/`)
- **근거**: Spring Boot core-backend 프로젝트에서 `domain/posts/repository/` 구조 확인

### 2. 공통 인프라 vs 도메인별 분리 (2025-11-05)
- **문제**: Sidebar API Client를 어디에 위치시킬 것인가?
- **분석**: Sidebar는 dashboard, profile 등 여러 도메인에서 사용
- **최종 결정**: `lib/api-clients/sidebar.client.ts`에 유지
- **근거**:
  - core-backend에 별도 "sidebar" 도메인 없음
  - 여러 도메인에서 공유하는 공통 인프라로 판단
  - DDD 원칙에서 공유 인프라는 외부 계층 허용

### 3. Import 경로 전략 (2025-11-05)
- **도메인 내부**: 상대 경로 (`../_api-clients`, `../_repositories`)
- **도메인 간**: 절대 경로 (`@/app/posts/_repositories`)
- **API Routes**: 절대 경로 (`@/app/posts/_repositories`)
- **근거**: 명확한 의존성 표현 및 도메인 캡슐화

---

## 📚 참고 문서

- **프로젝트 가이드**: [CLAUDE.md](../CLAUDE.md)
- **DDD 아키텍처**: [docs/architecture/DDD-ARCHITECTURE.md](architecture/DDD-ARCHITECTURE.md)
- **도메인 구조 가이드**: [docs/architecture/DOMAIN-STRUCTURE.md](architecture/DOMAIN-STRUCTURE.md)
- **SSR 베스트 프랙티스**: [docs/SSR-BEST-PRACTICES.md](SSR-BEST-PRACTICES.md)

---

## 🎉 완료된 마일스톤

- ✅ Phase 1: types/ → models/ 전환
- ✅ Phase 2: API Client Factory Pattern 구현
- ✅ Phase 3: Domain 구조 전환 (posts, auth, dashboard)
- ✅ Phase 3.2: Hooks 정리 (도메인별 `_hooks/` 분리)
- ✅ Phase 3.3: Legacy `services/` 디렉토리 제거
- ✅ Phase 4: DDD 정석 구조로 리팩토링 (core-backend 정렬)
- ✅ Phase 5: Dashboard Activity 기능 구현
- ✅ Phase 6: Profile 도메인 DDD 전환
- ✅ Phase 7: CLAUDE.md 문서 업데이트

---

## 💡 작업 시 주의사항

1. **DDD 구조 준수**: 새로운 도메인은 반드시 DDD 구조 따르기
2. **공통 인프라 판단**: 여러 도메인에서 사용하는 경우 `lib/`에 위치
3. **Import 경로**: 도메인 내부는 상대, 도메인 간은 절대 경로
4. **빌드 검증**: 변경 후 반드시 `npm run build` 실행
5. **문서 업데이트**: 구조 변경 시 CLAUDE.md 및 관련 문서 동기화
6. **Git 커밋**: 논리적 단위로 커밋, 이슈 번호 포함 (#129)

---

**마지막 업데이트**: 2025-11-05 (Phase 7 완료)
**다음 작업**: 사용자 요청 대기 중

**Phase 7 완료 후 최종 현황**:
- ✅ 3개 도메인 DDD 완성: posts, dashboard, profile
- ✅ 모든 주요 도메인이 완전한 DDD 구조 보유
- ✅ auth는 Server Actions 패턴으로 적절히 구현됨
- ✅ 프로젝트 문서 최신화 완료 (CLAUDE.md)
- ✅ Epic #129 DDD 아키텍처 전환 완료 🎉
