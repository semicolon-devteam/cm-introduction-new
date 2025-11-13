# DDD 아키텍처 마이그레이션 계획

## 📋 개요

본 문서는 기존 7-layer 아키텍처를 DDD 기반 도메인 중심 아키텍처로 전환하기 위한 단계별 마이그레이션 계획을 정의합니다.

---

## 🎯 마이그레이션 목표

1. **도메인 응집도 향상**: 관련 코드를 도메인별로 그룹화
2. **코드 탐색성 개선**: 도메인 경계를 명확히하여 파일 찾기 용이
3. **유지보수성 향상**: 도메인 독립적 개발 및 수정 가능
4. **개발자 경험 개선**: Spring DDD 구조와 유사하여 학습 곡선 감소

---

## 📅 마이그레이션 단계

### Phase 1: posts 도메인 Pilot (1주)

**목표**: posts 도메인으로 DDD 구조 검증 및 템플릿 확립

#### Step 1.1: 현재 구조 분석 (0.5일)

**작업**:
- [ ] posts 관련 파일 전체 목록 작성
- [ ] 의존성 매핑 (어떤 파일이 어떤 파일을 import하는지)
- [ ] 영향 받는 컴포넌트 식별

**예상 파일 목록**:
```
현재 구조:
/src/repositories/post.repository.ts
/src/api-clients/post.client.ts
/src/hooks/usePosts.ts
/src/app/posts/page.tsx
/src/components/organisms/PostList.tsx (있을 경우)
```

#### Step 1.2: 디렉토리 구조 생성 (0.5일)

**작업**:
```bash
mkdir -p src/app/posts/repository
mkdir -p src/app/posts/api-client
mkdir -p src/app/posts/hooks
mkdir -p src/app/posts/_components
mkdir -p src/app/posts/types
```

**산출물**:
```
/src/app/posts/
├── page.tsx (기존)
├── repository/
│   └── index.ts (placeholder)
├── api-client/
│   └── index.ts (placeholder)
├── hooks/
│   └── index.ts (placeholder)
├── _components/
│   └── index.ts (placeholder)
└── types/
    └── index.ts (placeholder)
```

#### Step 1.3: Repository Layer 이동 (1일)

**작업**:
- [ ] `/src/repositories/post.repository.ts` → `/src/app/posts/repository/post.repository.ts` 이동
- [ ] Import 경로 업데이트
- [ ] API Routes에서 새 경로로 import 수정

**Before**:
```typescript
// app/api/posts/route.ts
import { PostRepository } from '@/repositories/post.repository';
```

**After**:
```typescript
// app/api/posts/route.ts
import { PostRepository } from '@/app/posts/repository';
```

**검증**:
- [ ] `npm run build` 성공
- [ ] API 호출 정상 동작

#### Step 1.4: API Client Layer 이동 (1일)

**작업**:
- [ ] `/src/api-clients/post.client.ts` → `/src/app/posts/api-client/post.client.ts` 이동
- [ ] Import 경로 업데이트
- [ ] Hooks에서 새 경로로 import 수정

**Before**:
```typescript
// hooks/usePosts.ts
import { PostApiClient } from '@/api-clients/post.client';
```

**After**:
```typescript
// app/posts/hooks/usePosts.ts
import { PostApiClient } from '../api-client';
```

**검증**:
- [ ] `npm run build` 성공
- [ ] 브라우저에서 posts 페이지 정상 렌더링

#### Step 1.5: Hooks Layer 이동 (1일)

**작업**:
- [ ] `/src/hooks/usePosts.ts` → `/src/app/posts/hooks/usePosts.ts` 이동
- [ ] Import 경로 업데이트
- [ ] Components에서 새 경로로 import 수정

**Before**:
```typescript
// components/organisms/PostList.tsx
import { usePosts } from '@/hooks/usePosts';
```

**After**:
```typescript
// app/posts/_components/PostList.tsx
import { usePosts } from '../hooks';
```

**검증**:
- [ ] `npm run build` 성공
- [ ] React Query 캐싱 정상 동작

#### Step 1.6: Components 분리 및 이동 (1.5일)

**작업**:
- [ ] posts 도메인 전용 컴포넌트 식별
- [ ] 도메인 전용 → `_components/` 이동
- [ ] 도메인 독립적 → `/src/components/` 유지
- [ ] Import 경로 업데이트

**분류 기준**:
```
도메인 전용 (posts/_components/):
- PostList.tsx
- PostItem.tsx
- PostForm.tsx
- PostDetail.tsx

도메인 독립적 (/src/components/):
- Button.tsx (atoms)
- Card.tsx (atoms)
- FormField.tsx (molecules)
```

**검증**:
- [ ] `npm run build` 성공
- [ ] 모든 컴포넌트 정상 렌더링

#### Step 1.7: Types 정리 (0.5일)

**작업**:
- [ ] posts 관련 타입 정의를 `/src/app/posts/types/index.ts`로 통합
- [ ] Database 타입 import
- [ ] API 파라미터 타입 정의

**산출물**:
```typescript
// src/app/posts/types/index.ts
import type { Database } from '@/lib/supabase/database.types';

export type Post = Database['public']['Tables']['posts']['Row'];
export interface GetPostsParams { /* ... */ }
export interface GetPostsResponse { /* ... */ }
```

#### Step 1.8: 최종 검증 및 테스트 (1일)

**작업**:
- [ ] 전체 빌드 성공 확인
- [ ] 개발 서버 실행 확인
- [ ] posts 페이지 모든 기능 테스트
  - [ ] 게시글 목록 조회
  - [ ] 게시글 상세 조회
  - [ ] 게시글 작성
  - [ ] 게시글 수정
  - [ ] 게시글 삭제
- [ ] 단위 테스트 실행
- [ ] E2E 테스트 실행 (있을 경우)

**검증 체크리스트**:
- [ ] npm run build 성공
- [ ] npm run dev 정상 실행
- [ ] posts 페이지 정상 렌더링
- [ ] 데이터 페칭 정상 동작
- [ ] 에러 핸들링 정상 동작
- [ ] React Query 캐싱 정상 동작

---

### Phase 2: 다른 도메인 적용 (2주)

**목표**: posts Pilot 패턴을 다른 모든 도메인에 적용

#### Step 2.1: 도메인 식별 및 우선순위 (0.5일)

**작업**:
- [ ] 프로젝트 내 모든 도메인 목록 작성
- [ ] 각 도메인별 파일 수 및 복잡도 분석
- [ ] 작업 우선순위 결정

**예상 도메인 목록**:
1. **auth** (인증) - 높은 우선순위
2. **users** (사용자) - 높은 우선순위
3. **comments** (댓글) - 중간 우선순위
4. **notifications** (알림) - 중간 우선순위
5. **기타 도메인** - 낮은 우선순위

#### Step 2.2: auth 도메인 마이그레이션 (2일)

**작업**:
- [ ] posts Pilot 패턴 적용
- [ ] 디렉토리 구조 생성
- [ ] 파일 이동 및 Import 경로 업데이트
- [ ] 빌드 및 테스트

**산출물**:
```
/src/app/auth/
├── login/page.tsx
├── register/page.tsx
├── repository/auth.repository.ts
├── api-client/auth.client.ts
├── hooks/useAuth.ts
├── _components/LoginForm.tsx
└── types/index.ts
```

#### Step 2.3: users 도메인 마이그레이션 (2일)

**작업**:
- [ ] posts Pilot 패턴 적용
- [ ] 디렉토리 구조 생성
- [ ] 파일 이동 및 Import 경로 업데이트
- [ ] 빌드 및 테스트

#### Step 2.4: comments 도메인 마이그레이션 (1.5일)

**작업**:
- [ ] posts Pilot 패턴 적용
- [ ] 디렉토리 구조 생성
- [ ] 파일 이동 및 Import 경로 업데이트
- [ ] 빌드 및 테스트

#### Step 2.5: 기타 도메인 마이그레이션 (3일)

**작업**:
- [ ] 나머지 도메인들 순차적으로 마이그레이션
- [ ] 각 도메인별 검증

---

### Phase 3: 전역 레이어 제거 및 정리 (1주)

**목표**: 전역 디렉토리 제거 및 Atomic 컴포넌트 정리

#### Step 3.1: 전역 레이어 제거 전 검증 (1일)

**작업**:
- [ ] `/src/repositories/` 디렉토리 내 모든 파일 이동 확인
  - [ ] `grep -r "from '@/repositories" src/` 실행하여 참조 확인
  - [ ] 참조가 없으면 디렉토리 제거
- [ ] `/src/api-clients/` 디렉토리 내 모든 파일 이동 확인
  - [ ] `grep -r "from '@/api-clients" src/` 실행하여 참조 확인
  - [ ] 참조가 없으면 디렉토리 제거
- [ ] `/src/hooks/` 디렉토리 내 모든 파일 이동 확인
  - [ ] `grep -r "from '@/hooks" src/` 실행하여 참조 확인
  - [ ] 참조가 없으면 디렉토리 제거

**검증 스크립트**:
```bash
#!/bin/bash
# check-references.sh

echo "Checking repositories/ references..."
grep -r "from '@/repositories" src/ && echo "❌ Found references" || echo "✅ No references"

echo "Checking api-clients/ references..."
grep -r "from '@/api-clients" src/ && echo "❌ Found references" || echo "✅ No references"

echo "Checking hooks/ references..."
grep -r "from '@/hooks" src/ && echo "❌ Found references" || echo "✅ No references"
```

#### Step 3.2: Atomic 컴포넌트 재구성 (2일)

**작업**:
- [ ] `/src/components/` 내 모든 컴포넌트 분석
- [ ] 도메인 종속 컴포넌트 식별 및 이동
- [ ] 도메인 독립적 컴포넌트만 `/src/components/` 유지

**분류 기준**:
```yaml
도메인 독립적 (유지):
  atoms:
    - Button, Input, Label, Badge, Avatar
    - Card, Dialog, Dropdown, Select
  molecules:
    - FormField, SearchBar
  organisms:
    - Navigation, Footer (전역 UI)

도메인 종속 (이동):
  organisms:
    - PostList → app/posts/_components/
    - LoginForm → app/auth/_components/
    - UserProfile → app/users/_components/
```

#### Step 3.3: 전역 디렉토리 제거 (0.5일)

**작업**:
```bash
# 백업 (안전장치)
mv src/repositories src_backup/repositories
mv src/api-clients src_backup/api-clients
mv src/hooks src_backup/hooks

# 빌드 테스트
npm run build

# 성공 시 백업 제거, 실패 시 복원
```

#### Step 3.4: 최종 검증 및 문서 업데이트 (1.5일)

**작업**:
- [ ] 전체 프로젝트 빌드 성공 확인
- [ ] 모든 도메인 기능 테스트
- [ ] 테스트 커버리지 확인
- [ ] CLAUDE.md 최종 업데이트
- [ ] 마이그레이션 완료 문서 작성

---

## ⚠️ 리스크 및 완화 전략

### 리스크 1: Import 경로 변경으로 인한 빌드 실패

**완화 전략**:
- [ ] 각 Step마다 빌드 실행하여 즉시 에러 감지
- [ ] Git 커밋을 Step 단위로 분리하여 롤백 용이
- [ ] TypeScript strict 모드로 타입 에러 사전 감지

### 리스크 2: 기존 기능 동작 중단

**완화 전략**:
- [ ] 각 도메인 마이그레이션 후 수동 테스트 실행
- [ ] E2E 테스트 작성 및 실행 (가능하다면)
- [ ] 단계별 배포 (Pilot → 일부 도메인 → 전체)

### 리스크 3: 개발자 혼란

**완화 전략**:
- [ ] 상세한 마이그레이션 가이드 문서 작성 (본 문서)
- [ ] CLAUDE.md에 마이그레이션 진행 상황 명시
- [ ] 팀 미팅에서 새 구조 설명

### 리스크 4: 작업 지연

**완화 전략**:
- [ ] 각 Phase별 버퍼 시간 확보 (예상 시간 +20%)
- [ ] Pilot 단계에서 패턴 확립 후 템플릿화
- [ ] 자동화 스크립트 작성 (파일 이동, import 경로 변경)

---

## 📊 진행 상황 트래킹

### Phase 1: posts Pilot (1주)
- [ ] Step 1.1: 현재 구조 분석
- [ ] Step 1.2: 디렉토리 구조 생성
- [ ] Step 1.3: Repository Layer 이동
- [ ] Step 1.4: API Client Layer 이동
- [ ] Step 1.5: Hooks Layer 이동
- [ ] Step 1.6: Components 분리 및 이동
- [ ] Step 1.7: Types 정리
- [ ] Step 1.8: 최종 검증 및 테스트

### Phase 2: 다른 도메인 적용 (2주)
- [ ] Step 2.1: 도메인 식별 및 우선순위
- [ ] Step 2.2: auth 도메인
- [ ] Step 2.3: users 도메인
- [ ] Step 2.4: comments 도메인
- [ ] Step 2.5: 기타 도메인

### Phase 3: 전역 레이어 제거 (1주)
- [ ] Step 3.1: 전역 레이어 제거 전 검증
- [ ] Step 3.2: Atomic 컴포넌트 재구성
- [ ] Step 3.3: 전역 디렉토리 제거
- [ ] Step 3.4: 최종 검증 및 문서 업데이트

---

## 🔗 관련 링크

- Epic: [semicolon-devteam/command-center#129](https://github.com/semicolon-devteam/command-center/issues/129)
- Task [#49](https://github.com/semicolon-devteam/cm-template/issues/49): 아키텍처 설계 및 마이그레이션 계획 수립
- Task [#51](https://github.com/semicolon-devteam/cm-template/issues/51): posts 도메인 DDD 구조 Pilot 리팩토링
- Task [#52](https://github.com/semicolon-devteam/cm-template/issues/52): Atomic 컴포넌트 재구성 및 도메인 독립성 검증
- Task [#53](https://github.com/semicolon-devteam/cm-template/issues/53): 전체 도메인 DDD 구조 적용 및 전역 레이어 제거

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-11-01 | v1.0 | 초안 작성 | John (PM Agent) |
