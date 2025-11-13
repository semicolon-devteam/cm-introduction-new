# DDD 기반 도메인 중심 아키텍처

> ✅ **상태**: Epic #129 완료 (2024-11-05)
> 📊 **완성도**: DDD 전환 + 테스트 + 성능 최적화 완료
> ✅ **테스트**: 137 tests (100% pass rate)
> ⚡ **성능**: Profile page 86.5% bundle size reduction

## 📌 개요

본 프로젝트는 **DDD(Domain-Driven Design) 기반 도메인 중심 아키텍처**를 채택하여 Spring DDD + MVC 구조와 유사한 패턴으로 구성됩니다.

### 왜 DDD 기반 구조인가?

1. **도메인 응집도 향상**: 관련된 코드가 한 곳에 모여 있어 탐색과 유지보수가 용이
2. **명확한 경계**: 각 도메인의 책임과 범위가 명확히 구분됨
3. **백엔드 개발자 친화적**: Spring DDD 구조와 유사하여 학습 곡선 감소
4. **확장성**: 새로운 도메인 추가 시 독립적으로 개발 가능
5. **디자인 시스템 일치**: Figma 디자인 구조와 1:1 매칭되어 협업 개선

---

## 🏗️ 아키텍처 개념

### DDD(Domain-Driven Design)란?

DDD는 소프트웨어의 복잡성을 비즈니스 도메인 중심으로 관리하는 설계 철학입니다.

**핵심 원칙:**
- **도메인 중심 사고**: 비즈니스 로직이 기술 구현보다 우선
- **유비쿼터스 언어**: 개발자와 비즈니스 담당자가 동일한 용어 사용
- **경계 설정**: 각 도메인의 책임과 범위를 명확히 구분
- **응집도 높이기**: 관련된 코드를 가까이 배치

### Spring DDD + MVC와의 유사성

본 프로젝트는 Spring Boot의 DDD 구조를 Next.js에 적용한 패턴입니다.

**Spring DDD 구조:**
```
src/main/java/com/example/
├── domain/
│   ├── post/
│   │   ├── controller/      # API 엔드포인트
│   │   ├── service/          # 비즈니스 로직
│   │   ├── repository/       # 데이터 접근
│   │   ├── dto/              # 데이터 전송 객체
│   │   └── entity/           # 엔티티 모델
```

**Next.js DDD 구조 (본 프로젝트 - ✅ Phase 4 완료):**
```
src/app/
├── posts/                    # ✅ DDD 완성 (core-backend 구조와 동일)
│   ├── _repositories/        # 서버사이드 데이터 접근 ⭐
│   │   ├── posts.repository.ts
│   │   └── index.ts          # Barrel export
│   ├── _api-clients/         # 브라우저 HTTP 통신 ⭐
│   │   ├── posts.client.ts   # Factory Pattern
│   │   ├── interfaces/
│   │   │   └── posts.interface.ts
│   │   ├── implementations/
│   │   │   ├── next-posts.service.ts
│   │   │   └── spring-posts.service.ts
│   │   └── index.ts          # Barrel export
│   ├── _hooks/               # React 상태 관리
│   │   ├── usePosts.ts
│   │   ├── usePost.ts
│   │   └── index.ts
│   ├── _components/          # 도메인 전용 UI
│   │   ├── PostsHeader.tsx
│   │   ├── PostsFilter.tsx
│   │   ├── PostsList.tsx
│   │   ├── PostsEmptyState.tsx
│   │   ├── PostsLoadingState.tsx
│   │   ├── PostsErrorState.tsx
│   │   └── index.ts
│   └── page.tsx
├── dashboard/                # 공통 인프라 사용 도메인
│   ├── _components/          # (DashboardHeader, ProfileCard 등 5개)
│   └── page.tsx
├── auth/                     # 공통 인프라 사용 도메인
│   ├── _components/          # (AuthLayout)
│   ├── login/page.tsx
│   └── register/page.tsx
└── profile/                  # 공통 인프라 사용 도메인
    ├── _components/          # (ProfileHeader, ProfileInfoCard 등 3개)
    └── page.tsx
```

**📊 현재 구현 현황**:
- ✅ **posts**: DDD 완성 (_repositories + _api-clients + _hooks + _components + __tests__)
- ✅ **dashboard**: DDD 완성 (_repositories + _api-clients + _hooks + _components + __tests__)
- ✅ **auth**: 공통 인프라 사용 (_components만)
- ✅ **profile**: DDD 완성 (_repositories + _api-clients + _hooks + _components + __tests__)

---

## 🎯 도메인 정의 및 경계

### 도메인이란?

도메인은 **비즈니스 문제 영역**을 의미하며, 특정 기능이나 비즈니스 로직의 집합입니다.

### 도메인 식별 방법

다음 질문들로 도메인을 식별합니다:

1. **독립적인 비즈니스 개념인가?**
   - 예: posts(게시글), auth(인증), users(사용자)

2. **다른 도메인과 명확히 구분되는가?**
   - 예: comments는 posts와 관련있지만 독립적인 도메인

3. **자체적인 CRUD가 있는가?**
   - 데이터 생성, 조회, 수정, 삭제 로직이 있다면 도메인

4. **Figma에서 독립적인 섹션인가?**
   - 디자인 시스템에서 분리된 영역이면 도메인

### 도메인 분류

#### 1️⃣ 핵심 도메인 (Core Domain)
비즈니스의 핵심 가치를 제공하는 도메인

**예시:**
- `posts` - 게시글 관리 (커뮤니티의 핵심)
- `comments` - 댓글 시스템 (사용자 참여)

#### 2️⃣ 지원 도메인 (Supporting Domain)
핵심 도메인을 지원하는 도메인

**예시:**
- `users` - 사용자 정보 관리
- `notifications` - 알림 시스템

#### 3️⃣ 일반 도메인 (Generic Domain)
여러 시스템에서 공통으로 사용되는 도메인

**예시:**
- `auth` - 인증/인가
- `storage` - 파일 업로드

---

## 📁 레이어별 책임 및 역할

### 1️⃣ Repository Layer (`repository/`)

**역할**: 서버사이드 데이터 접근 추상화

**책임:**
- Supabase 쿼리 실행
- 복잡한 데이터 로직 및 트랜잭션 처리
- 데이터 영속성 관리

**특징:**
- **서버사이드 전용** (`createServerSupabaseClient` 사용)
- Repository 패턴 적용
- 비즈니스 로직 포함 가능

**예시:**
```typescript
// src/app/posts/repository/post.repository.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';

export class PostsRepository {
  async getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { posts: data, total: data.length };
  }
}
```

### 2️⃣ API Client Layer (`api-client/`)

**역할**: 브라우저 사이드 HTTP 통신

**책임:**
- 환경변수로 Spring Boot / Next.js API 선택
- fetch/axios 래퍼
- 요청/응답 변환
- 에러 처리

**특징:**
- **클라이언트 사이드 전용**
- 환경변수 기반 백엔드 전환 (`NEXT_PUBLIC_API_MODE`)
- RESTful API 통신

**예시:**
```typescript
// src/app/posts/api-client/post.client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_MODE === 'spring'
  ? process.env.NEXT_PUBLIC_SPRING_API_URL
  : '/api';

export class PostApiClient {
  async getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
    const response = await fetch(`${API_BASE}/posts?${new URLSearchParams(params)}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  }
}
```

### 3️⃣ Hooks Layer (`_hooks/`)

**역할**: React 상태 관리 + API Client 호출

**책임:**
- API Client 호출 (Factory Pattern 사용)
- 캐싱, 리페칭, 낙관적 업데이트
- 로딩/에러 상태 관리

**특징:**
- **클라이언트 사이드 전용**
- useState/useEffect 기반 또는 React Query
- 도메인별 커스텀 훅 (`_hooks/` 디렉토리)
- 전역 hooks는 `src/hooks/`에 위치

**도메인 vs 전역 Hooks**:
- **도메인 Hooks** (`app/{domain}/_hooks/`): 해당 도메인에서만 사용
- **전역 Hooks** (`src/hooks/`): 여러 도메인에서 공유

**예시:**
```typescript
// src/app/posts/_hooks/usePosts.ts (도메인 hooks)
'use client';

import { useState, useEffect } from 'react';

import { postsClient } from '@/api-clients'; // Factory Pattern

import type { GetPostsParams, GetPostsResponse } from '@/models/posts.types';

export function usePosts(params: GetPostsParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await postsClient.getPosts(params);
        setPosts(response.posts);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [params]);

  return { posts, isLoading };
}
```

### 4️⃣ Components Layer (`_components/`)

**역할**: 도메인 전용 UI 컴포넌트

**책임:**
- 해당 도메인에서만 사용되는 컴포넌트
- 도메인 특화 UI 로직
- 비즈니스 로직 포함 가능 (Container 패턴)

**특징:**
- `_components/` 디렉토리명 (Next.js 라우팅 제외)
- 도메인 내부에서만 사용
- Atomic Design과 독립적

**예시:**
```typescript
// src/app/posts/_components/PostsList.tsx
'use client';

import { Button } from '@atoms/Button';
import { PostCard } from '@/components/molecules/PostCard';

import { usePosts } from '../_hooks';

import type { Post } from '@models/posts.types';

interface PostsListProps {
  boardId: string;
  search?: string;
  sortBy?: 'recent' | 'likes' | 'views';
}

export function PostsList({ boardId, search, sortBy }: PostsListProps) {
  const {
    posts,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
  } = usePosts({
    boardId,
    search,
    sortBy,
    limit: 20,
  });

  if (isLoading) return <PostsLoadingState />;

  return (
    <div className="space-y-4">
      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasMore && (
        <Button onClick={loadMore} disabled={isLoadingMore} variant="outline" className="w-full">
          {isLoadingMore ? '로딩중...' : '더보기'}
        </Button>
      )}
    </div>
  );
}
```

---

## 🔄 데이터 플로우

### 로컬 개발 환경 (Spring Boot 없음)

```
Browser
  ↓
Domain Hooks (_hooks/)
  ↓
API Client (Factory Pattern: postsClient, sidebarClient)
  ↓
Next.js API Route (app/api/posts/)
  ↓
Repository (repositories/)
  ↓
Supabase
  ↑
useState/useEffect 상태 관리
  ↑
Domain Components (_components/)
```

**실제 코드 흐름**:
```typescript
// 1. 컴포넌트에서 도메인 훅 호출
PostsList → usePosts({ boardId: '123' })

// 2. 도메인 훅에서 Factory Pattern API Client 호출
usePosts → postsClient.getPosts(params)

// 3. API Client에서 Next.js API Route 호출
postsClient → fetch('/api/posts?boardId=123')

// 4. API Route에서 Repository 호출
GET /api/posts → PostsRepository.getPosts()

// 5. Repository에서 Supabase 쿼리 실행
PostsRepository → supabase.from('posts').select('*')
```

### 프로덕션 환경 (Spring Boot 있음)

```
Browser
  ↓
Domain Hooks (_hooks/)
  ↓
API Client (Factory Pattern: postsClient)
  ↓
Spring Boot Backend (외부 서버)
  ↑
useState/useEffect 상태 관리
  ↑
Domain Components (_components/)
```

**실제 코드 흐름**:
```typescript
// 1. 컴포넌트에서 도메인 훅 호출
PostsList → usePosts({ boardId: '123' })

// 2. 도메인 훅에서 Factory Pattern API Client 호출
usePosts → postsClient.getPosts(params)

// 3. API Client에서 Spring Boot 직접 호출
postsClient → fetch('http://api.server.com/posts?boardId=123')

// 4. Spring Boot에서 처리 및 응답
```

### 1-Hop Rule

**원칙**: 불필요한 네트워크 중간 계층 제거

**❌ 금지된 패턴:**
```
Browser → Next.js API → Spring Boot (2-hop, 불��요한 지연)
```

**✅ 올바른 패턴:**
```
Browser → Spring Boot (1-hop, 직접 통신)
```

---

## 🚀 도메인 추가 가이드

> 📋 **상세 가이드**: 도메인 추가에 대한 전체 프로세스와 예제는 [DOMAIN-ADDITION-GUIDE.md](./DOMAIN-ADDITION-GUIDE.md)를 참고하세요.

### 새 도메인 생성 단계 (요약)

#### 1단계: 도메인 식별
- 비즈니스 요구사항 분석
- 도메인 경계 정의
- 다른 도메인과의 관계 파악

#### 2단계: 디렉토리 구조 생성
```bash
# DDD 구조: 도메인 중심으로 구성
mkdir -p src/app/{domain}/_components
mkdir -p src/app/{domain}/_hooks
mkdir -p src/app/{domain}/types  # 선택적
```

**참고**: Repository와 API Client는 도메인 외부의 `repositories/`, `api-clients/`에 위치합니다.

#### 3단계: 레이어별 파일 작성
1. **Repository** (`repositories/{domain}.repository.ts`) - 서버사이드 데이터 접근
2. **API Client** (`api-clients/{domain}.client.ts`) - 브라우저 HTTP 통신
3. **Domain Hooks** (`app/{domain}/_hooks/`) - React 상태 관리 + API Client 호출
4. **Domain Components** (`app/{domain}/_components/`) - 도메인 전용 UI
5. **Page** (`app/{domain}/page.tsx`) - 라우트 핸들러

#### 4단계: 타입 정의
```typescript
// src/models/{domain}.types.ts (전역 타입)
export interface DomainEntity {
  id: string;
  // ...
}

export interface GetDomainParams {
  // ...
}

export interface GetDomainResponse {
  items: DomainEntity[];
  total: number;
}
```

**💡 실제 구현 예제**:
- **posts**: 6개 컴포넌트 + 2개 훅
- **auth**: 1개 컴포넌트 (AuthLayout)
- **dashboard**: 5개 컴포넌트
- **profile**: 3개 컴포넌트

자세한 단계별 가이드는 [DOMAIN-ADDITION-GUIDE.md](./DOMAIN-ADDITION-GUIDE.md)를 참고하세요.

---

## 📚 참고 자료

- [DOMAIN-STRUCTURE.md](./DOMAIN-STRUCTURE.md) - 도메인 디렉토리 구조 상세 가이드
- [CLAUDE.md](/CLAUDE.md) - 프로젝트 전체 아키텍처
- [Spring DDD 참고](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Domain-Driven Design Book](https://www.domainlanguage.com/ddd/)

---

## 🧪 테스트 전략

### 테스트 구조
```
src/app/{domain}/
├── _repositories/__tests__/
│   └── {domain}.repository.test.ts
├── _hooks/__tests__/
│   ├── use{Domain}.test.ts
│   └── use{DomainMutation}.test.ts
└── _components/__tests__/
    └── {Component}.test.ts
```

### 테스트 현황 (Phase 9 완료)
- **137 tests** across 13 test files
- **100% pass rate**
- **도메인별 커버리지**:
  - posts: 42 tests (repositories + hooks + components)
  - dashboard: 19 tests (repositories + hooks)
  - profile: 25 tests (repositories + hooks)
  - atoms: 34 tests
  - lib: 17 tests

### 테스트 실행
```bash
npm test              # 모든 테스트 실행
npm run test:watch    # Watch 모드
npm run test:coverage # 커버리지 리포트
npm run test:ui       # Vitest UI
```

---

## ⚡ 성능 최적화

### 최적화 결과 (Phase 10 완료)

| Page | Before | After | Improvement |
|------|--------|-------|-------------|
| Profile | 10.2 kB | 1.38 kB | **-86.5%** ⭐ |
| Dashboard | 115 kB | 115 kB | - |
| Posts | 132 kB | 133 kB | - |

### 적용된 최적화 기법

1. **Dynamic Import & Code Splitting**
   - ProfileTabs 컴포넌트에 lazy loading 적용
   - Loading skeleton으로 UX 개선
   - `ssr: false`로 client-only 컴포넌트 최적화

2. **Package Optimization**
   ```typescript
   // next.config.ts
   experimental: {
     optimizePackageImports: [
       "lucide-react",
       "@radix-ui/react-avatar",
       "@radix-ui/react-label",
       // ... more packages
     ],
   }
   ```

3. **성능 목표 달성** ✅
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
   - Initial JS Bundle < 500KB
   - First Load JS < 200KB

자세한 내용: [OPTIMIZATION-RESULTS.md](../performance/OPTIMIZATION-RESULTS.md)

---

## 🔍 체크리스트

### 도메인 설계 시
- [ ] 도메인 경계가 명확한가?
- [ ] 다른 도메인과 독립적인가?
- [ ] 비즈니스 개념을 정확히 반영하는가?
- [ ] Figma 디자인 구조와 일치하는가?

### 레이어 구현 시
- [ ] Repository는 서버사이드 전용인가?
- [ ] API Client는 환경변수 기반 전환이 가능한가?
- [ ] Hooks는 React Query를 사용하는가?
- [ ] Components는 해당 도메인에만 종속되는가?

### 테스트 구현 시
- [ ] Repository 테스트 작성했는가?
- [ ] Hooks 테스트 작성했는가?
- [ ] Components 테스트 작성했는가?
- [ ] 테스트 커버리지 80% 이상인가?

### 코드 품질
- [ ] 1-Hop Rule을 준수하는가?
- [ ] Import 경로가 올바른가?
- [ ] 모든 테스트가 통과하는가?
- [ ] 빌드가 성공하는가?
- [ ] 성능 최적화를 고려했는가?
