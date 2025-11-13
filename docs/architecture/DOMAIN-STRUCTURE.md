# 도메인 디렉토리 구조 가이드

> ✅ **상태**: Epic #129 완료 - DDD 전환 + 테스트 + 성능 최적화 (2024-11-05)
> 📊 **완성도**: posts, auth, dashboard, profile 도메인 전환 완료
> ✅ **테스트**: 137 tests (100% pass rate)
> ⚡ **성능**: Profile page 86.5% bundle size reduction

## 📁 전체 구조 개요 (현재 구현)

```
src/
├── app/
│   ├── {domain}/              # 도메인별 디렉토리
│   │   ├── page.tsx           # 페이지 라우트
│   │   ├── layout.tsx         # 레이아웃 (선택)
│   │   ├── loading.tsx        # 로딩 UI (선택)
│   │   ├── error.tsx          # 에러 UI (선택)
│   │   ├── _repositories/     # 서버사이드 데이터 접근 ⭐
│   │   │   ├── {domain}.repository.ts
│   │   │   ├── __tests__/     # Repository 테스트
│   │   │   │   └── {domain}.repository.test.ts
│   │   │   └── index.ts       # Barrel export
│   │   ├── _api-clients/      # 브라우저 HTTP 통신 ⭐
│   │   │   ├── {domain}.client.ts
│   │   │   └── index.ts       # Barrel export
│   │   ├── _hooks/            # 도메인 전용 Hooks ⭐
│   │   │   ├── use{Domain}.ts
│   │   │   ├── __tests__/     # Hooks 테스트
│   │   │   │   └── use{Domain}.test.ts
│   │   │   └── index.ts       # Barrel export
│   │   ├── _components/       # 도메인 전용 Components ⭐
│   │   │   ├── {DomainComponent}.tsx
│   │   │   ├── __tests__/     # Components 테스트
│   │   │   │   └── {Component}.test.tsx
│   │   │   └── index.ts       # Barrel export
│   │   └── types/             # 도메인 타입 정의 (선택)
│   │       └── index.ts
│   └── api/                   # API Routes (로컬 개발용)
│       └── {domain}/
│           └── route.ts
├── repositories/              # Repository Layer (서버사이드)
│   └── {domain}.repository.ts
├── api-clients/               # API Client Layer (브라우저)
│   ├── {domain}.client.ts
│   └── index.ts               # Factory Pattern exports
├── hooks/                     # 전역 Hooks (여러 도메인에서 공유)
│   └── auth/
├── components/                # Atomic Design (도메인 독립적)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── models/                    # TypeScript 인터페이스 및 타입 정의
│   └── {domain}.types.ts
└── lib/
    ├── supabase/
    └── utils/
```

**핵심 변경사항** (Epic #129):
- ✅ **Phase 1-3**: DDD 기반 도메인 중심 아키텍처 전환 완료
- ✅ **Phase 9**: 테스트 구현 완료 (137 tests, 100% pass rate)
- ✅ **Phase 10**: 성능 최적화 완료 (Profile page 86.5% 개선)
- ✅ Repository와 API Client는 도메인 내부 (`_repositories/`, `_api-clients/`)
- ✅ 도메인 내부는 `_components/`, `_hooks/`, `_repositories/`, `_api-clients/` 포함
- ✅ 각 레이어는 `__tests__/` 디렉토리를 포함하여 테스트 코드 관리
- ✅ Factory Pattern으로 API Client 관리 (`api-clients/index.ts`)
- ✅ 전역 타입은 `models/` 디렉토리에 통합

---

## 🎯 계층별 디렉토리 상세

### 1. Repository Layer (`repositories/`)

**위치**: `/src/repositories/{domain}.repository.ts` ⭐

**책임**:
- 서버사이드 데이터 접근
- Supabase 쿼리 실행
- 복잡한 비즈니스 로직 처리

**규칙**:
- ✅ 파일명: `{domain}.repository.ts` (단수형)
- ✅ 클래스명: `{Domain}Repository` (PascalCase)
- ✅ `createServerSupabaseClient` 사용 필수
- ❌ 브라우저에서 직접 import 금지

**예시**:
```typescript
// src/repositories/post.repository.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';

import type { GetPostsParams, GetPostsResponse, Post } from '@/models/posts.types';

export class PostsRepository {
  async getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('posts')
      .select('*, author:users(*)')
      .order('created_at', { ascending: false });

    // 검색 필터
    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`);
    }

    // 게시판 필터
    if (params.boardId) {
      query = query.eq('board_id', params.boardId);
    }

    // 페이지네이션
    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    return {
      posts: data || [],
      total: data?.length || 0,
    };
  }

  async getPostById(id: string): Promise<Post> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*, author:users(*), comments(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Post not found: ${error.message}`);
    }

    return data;
  }
}
```

---

### 2. API Client Layer (`api-clients/`)

**위치**: `/src/api-clients/{domain}.client.ts` ⭐

**책임**:
- 브라우저 사이드 HTTP 통신
- 환경변수 기반 백엔드 전환
- 요청/응답 변환 및 에러 처리

**규칙**:
- ✅ 파일명: `{domain}.client.ts`
- ✅ 클래스명: `{Domain}ApiClient`
- ✅ 환경변수로 Spring Boot / Next.js API 선택
- ✅ 클라이언트 사이드 전용
- ✅ **Factory Pattern**: `api-clients/index.ts`에서 singleton 인스턴스 export

**예시**:
```typescript
// src/api-clients/posts.client.ts
import type {
  CreatePostParams,
  GetPostsParams,
  GetPostsResponse,
  Post,
  UpdatePostParams,
} from '@/models/posts.types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_MODE === 'spring'
    ? process.env.NEXT_PUBLIC_SPRING_API_URL
    : '/api';

export class PostsApiClient {
  async getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
    const searchParams = new URLSearchParams();
    if (params.boardId) searchParams.append('boardId', params.boardId);
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE}/posts?${searchParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return response.json();
  }

  async getPostById(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/${id}`);

    if (!response.ok) {
      throw new Error('Post not found');
    }

    return response.json();
  }

  async createPost(params: CreatePostParams): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return response.json();
  }

  async updatePost(id: string, params: UpdatePostParams): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    return response.json();
  }

  async deletePost(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  }
}

// src/api-clients/index.ts (Factory Pattern)
import { PostsApiClient } from './posts.client';
import { SidebarApiClient } from './sidebar.client';

// Singleton instances
export const postsClient = new PostsApiClient();
export const sidebarClient = new SidebarApiClient();
```

---

### 3. Domain Hooks Layer (`_hooks/`)

**위치**: `/src/app/{domain}/_hooks/` ⭐

**책임**:
- React 상태 관리 + API Client 호출
- useState/useEffect 또는 React Query
- 캐싱, 리페칭, 낙관적 업데이트
- 로딩/에러 상태 관리

**규칙**:
- ✅ 디렉토리명: `_hooks` (Next.js 라우팅 제외)
- ✅ 파일명: `use{Domain}.ts` (camelCase)
- ✅ **Factory Pattern**: `postsClient` import (singleton)
- ✅ Barrel export: `index.ts` 필수

**도메인 vs 전역 Hooks**:
- **도메인 Hooks** (`app/{domain}/_hooks/`): 해당 도메인에서만 사용
- **전역 Hooks** (`src/hooks/`): 여러 도메인에서 공유

**예시 (useState/useEffect)**:
```typescript
// src/app/posts/_hooks/usePosts.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

import { postsClient } from '@/api-clients'; // Factory Pattern

import type { GetPostsParams, Post } from '@/models/posts.types';

export function usePosts(params: GetPostsParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { boardId, search, sortBy, includeNotice, limit = 20 } = params;

  const fetchData = useCallback(
    async (currentPage: number, append = false) => {
      try {
        if (!append) setIsLoading(true);
        else setIsLoadingMore(true);

        const response = await postsClient.getPosts({
          boardId,
          search,
          sortBy,
          includeNotice,
          limit,
          page: currentPage,
        });

        if (append) {
          setPosts((prev) => [...prev, ...response.posts]);
        } else {
          setPosts(response.posts);
        }

        setHasMore(response.posts.length === limit);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [boardId, search, sortBy, includeNotice, limit]
  );

  useEffect(() => {
    setPage(1);
    void fetchData(1, false);
  }, [boardId, search, sortBy, includeNotice, limit, fetchData]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchData(nextPage, true);
  }, [page, isLoadingMore, hasMore, fetchData]);

  return {
    posts,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
  };
}

// src/app/posts/_hooks/index.ts (Barrel export)
export { usePosts } from './usePosts';
export { usePost } from './usePost';
```

---

### 4. Domain Components Layer (`_components/`)

**위치**: `/src/app/{domain}/_components/` ⭐

**책임**:
- 해당 도메인 전용 UI 컴포넌트
- 도메인 특화 로직 포함 가능
- Domain Hooks와 조합하여 사용

**규칙**:
- ✅ 디렉토리명: `_components` (Next.js 라우팅 제외)
- ✅ 파일명: `{ComponentName}.tsx` (PascalCase)
- ✅ 해당 도메인에서만 사용
- ✅ Atomic 컴포넌트 import 가능
- ✅ Barrel export: `index.ts` 필수
- ❌ 다른 도메인에서 import 금지

**예시**:
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
    error,
    loadMore,
  } = usePosts({
    boardId,
    search,
    sortBy,
    limit: 20,
  });

  if (isLoading) {
    return <PostsLoadingState />;
  }

  if (error) {
    return <PostsErrorState error={error} />;
  }

  if (posts.length === 0) {
    return <PostsEmptyState />;
  }

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

// src/app/posts/_components/index.ts (Barrel export)
export { PostsHeader } from './PostsHeader';
export { PostsFilter } from './PostsFilter';
export { PostsList } from './PostsList';
export { PostsEmptyState } from './PostsEmptyState';
export { PostsLoadingState } from './PostsLoadingState';
export { PostsErrorState } from './PostsErrorState';
```

---

### 5. Types Layer (`models/`)

**위치**: `/src/models/{domain}.types.ts` ⭐

**책임**:
- 도메인 엔티티 정의
- API 요청/응답 타입 정의
- 전역 타입 정의

**규칙**:
- ✅ 파일명: `{domain}.types.ts` (복수형)
- ✅ Database 타입과 별도 관리
- ✅ 전역 타입은 `models/`에 통합
- ✅ 도메인 로컬 타입은 `app/{domain}/types/` (선택적)

**예시**:
```typescript
// src/models/posts.types.ts
import type { Database } from '@/lib/supabase/database.types';

// Database 타입에서 가져오기
export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

// API 파라미터 타입
export interface GetPostsParams {
  boardId: string;
  search?: string;
  sortBy?: 'recent' | 'likes' | 'views';
  includeNotice?: boolean;
  limit?: number;
  page?: number;
}

export interface GetPostsResponse {
  posts: Post[];
  total: number;
}

export interface CreatePostParams {
  boardId: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdatePostParams {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface PostDetail extends Post {
  author: {
    id: string;
    nickname: string;
    avatar_url?: string;
  };
  comments: Comment[];
  likes_count: number;
  views_count: number;
}
```

---

## 🔗 Import 규칙

### ✅ 올바른 Import 패턴

#### 1. 도메인 Hooks에서 API Client import (Factory Pattern)

```typescript
// src/app/posts/_hooks/usePosts.ts
import { postsClient } from '@/api-clients';  // ✅ Factory Pattern
import type { GetPostsParams } from '@/models/posts.types'; // ✅ 전역 타입
```

#### 2. 도메인 Components에서 Hooks import

```typescript
// src/app/posts/_components/PostsList.tsx
import { usePosts } from '../_hooks';  // ✅ 상대 경로 (Barrel export)
```

#### 3. Page에서 도메인 Components import

```typescript
// src/app/posts/page.tsx
import { PostsHeader, PostsFilter, PostsList } from './_components';  // ✅ Barrel export
import { PostsRepository } from '@/repositories/post.repository';     // ✅ Repository
```

#### 4. Atomic 컴포넌트 import

```typescript
// src/app/posts/_components/PostsList.tsx
import { Button } from '@atoms/Button';           // ✅ Path alias
import { PostCard } from '@/components/molecules/PostCard';  // ✅ 절대 경로
```

#### 5. 전역 타입 import

```typescript
import type { Post, GetPostsParams } from '@/models/posts.types';  // ✅ 전역 타입
import type { User } from '@/models/users.types';                  // ✅ 전역 타입
```

#### 6. 공통 유틸리티 import

```typescript
import { cn } from '@/lib/utils';                      // ✅ 절대 경로
import { createServerSupabaseClient } from '@lib/supabase/server';  // ✅ Path alias
```

---

### ❌ 잘못된 Import 패턴 (Anti-patterns)

#### 1. 다른 도메인의 내부 레이어 직접 import

```typescript
// ❌ posts 도메인에서 users 도메인의 _hooks 직접 import
import { useUsers } from '@/app/users/_hooks';

// ✅ 각 도메인은 자체 hooks 사용, 필요시 API Client 활용
import { usersClient } from '@/api-clients';
```

#### 2. 브라우저에서 Repository 직접 사용

```typescript
// ❌ Client Component에서 Repository 직접 사용
'use client';
import { PostsRepository } from '@/repositories/post.repository';

// ✅ 대신 Domain Hooks 사용
import { usePosts } from '../_hooks';
```

#### 3. Repository에서 Hooks import

```typescript
// ❌ Repository는 서버사이드 전용, React Hooks 불가
import { usePosts } from '@/app/posts/_hooks';

// ✅ Repository는 Hooks를 사용하지 않음
```

#### 4. 도메인 컴포넌트를 다른 도메인에서 import

```typescript
// ❌ users 도메인에서 posts 도메인 컴포넌트 직접 import
import { PostList } from '@/app/posts/_components';

// ✅ 대신 Atomic 컴포넌트로 재구성하거나 별도 컴포넌트 생성
```

---

## 📐 실제 구현 디렉토리 구조

### posts 도메인 (✅ 구현 완료)

```
src/
├── app/posts/
│   ├── page.tsx                        # 게시글 목록 페이지
│   ├── [id]/
│   │   └── page.tsx                    # 게시글 상세 페이지
│   ├── new/
│   │   └── page.tsx                    # 게시글 작성 페이지
│   ├── _repositories/                  # Repository Layer ⭐
│   │   ├── posts.repository.ts
│   │   ├── __tests__/                  # Repository 테스트
│   │   │   └── posts.repository.test.ts
│   │   └── index.ts                    # Barrel export
│   ├── _api-clients/                   # API Client Layer ⭐
│   │   ├── posts.client.ts
│   │   └── index.ts                    # Barrel export
│   ├── _hooks/                         # 2개 hooks ⭐
│   │   ├── usePosts.ts
│   │   ├── usePost.ts
│   │   ├── __tests__/                  # Hooks 테스트
│   │   │   ├── usePosts.test.ts
│   │   │   └── usePost.test.ts
│   │   └── index.ts                    # Barrel export
│   └── _components/                    # 6개 컴포넌트 ⭐
│       ├── PostsHeader.tsx
│       ├── PostsFilter.tsx
│       ├── PostsList.tsx
│       ├── PostsEmptyState.tsx
│       ├── PostsLoadingState.tsx
│       ├── PostsErrorState.tsx
│       ├── __tests__/                  # Components 테스트
│       │   └── PostsList.test.tsx
│       └── index.ts                    # Barrel export
└── models/
    └── posts.types.ts                  # Post, GetPostsParams, etc.
```

### auth 도메인 (✅ 구현 완료)

```
src/
├── app/auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── _components/                    # 1개 컴포넌트 ⭐
│       ├── AuthLayout.tsx              # 공통 레이아웃
│       └── index.ts                    # Barrel export
├── api-clients/
│   └── auth.client.ts                  # AuthApiClient (필요시)
├── repositories/
│   └── auth.repository.ts              # AuthRepository (필요시)
└── models/
    └── auth.types.ts                   # AuthParams, etc.
```

### dashboard 도메인 (✅ 구현 완료)

```
src/
├── app/dashboard/
│   ├── page.tsx
│   ├── _repositories/                  # Repository Layer ⭐
│   │   ├── activity.repository.ts
│   │   ├── __tests__/                  # Repository 테스트
│   │   │   └── activity.repository.test.ts
│   │   └── index.ts                    # Barrel export
│   ├── _api-clients/                   # API Client Layer ⭐
│   │   ├── activity.client.ts
│   │   └── index.ts                    # Barrel export
│   ├── _hooks/                         # Hooks Layer ⭐
│   │   ├── useActivities.ts
│   │   ├── __tests__/                  # Hooks 테스트
│   │   │   └── useActivities.test.ts
│   │   └── index.ts                    # Barrel export
│   └── _components/                    # 5개 컴포넌트 ⭐
│       ├── DashboardHeader.tsx
│       ├── ProfileCard.tsx
│       ├── ActivityCard.tsx
│       ├── QuickActionsCard.tsx
│       ├── NewsCard.tsx
│       └── index.ts                    # Barrel export
└── models/
    └── dashboard.types.ts              # Dashboard 타입
```

### profile 도메인 (✅ 구현 완료)

```
src/
├── app/profile/
│   ├── page.tsx
│   ├── _repositories/                  # Repository Layer ⭐
│   │   ├── profile.repository.ts
│   │   ├── __tests__/                  # Repository 테스트
│   │   │   └── profile.repository.test.ts
│   │   └── index.ts                    # Barrel export
│   ├── _api-clients/                   # API Client Layer ⭐
│   │   ├── profile.client.ts
│   │   └── index.ts                    # Barrel export
│   ├── _hooks/                         # Hooks Layer ⭐
│   │   ├── useProfile.ts
│   │   ├── useUpdateProfile.ts
│   │   ├── __tests__/                  # Hooks 테스트
│   │   │   ├── useProfile.test.ts
│   │   │   └── useUpdateProfile.test.ts
│   │   └── index.ts                    # Barrel export
│   └── _components/                    # 3개 컴포넌트 ⭐
│       ├── ProfileHeader.tsx
│       ├── ProfileInfoCard.tsx
│       ├── ProfileContent.tsx          # Dynamic Import (성능 최적화)
│       └── index.ts                    # Barrel export
└── models/
    └── profile.types.ts                # Profile 타입
```

**Performance Optimization** (Phase 10):
- ProfileContent.tsx에 Dynamic Import 적용
- ProfileTabs 컴포넌트 lazy loading
- 결과: 10.2 kB → 1.38 kB (86.5% 개선)

---

## 🎨 Atomic Design과의 관계

### 도메인 독립적 vs 도메인 종속

#### `/src/components/` - 도메인 독립적 (Atomic Design)

**특징:**
- 여러 도메인에서 재사용 가능
- 비즈니스 로직 포함 안 함
- 순수 UI 컴포넌트

**예시:**
- `atoms/Button.tsx` - 모든 도메인에서 사용
- `molecules/FormField.tsx` - 공통 폼 필드
- `organisms/Navigation.tsx` - 전역 네비게이션

#### `/src/app/{domain}/_components/` - 도메인 종속

**특징:**
- 특정 도메인에서만 사용
- 도메인 비즈니스 로직 포함 가능
- Hooks와 밀접한 관계

**예시:**
- `posts/_components/PostList.tsx` - posts 전용
- `auth/_components/LoginForm.tsx` - auth 전용
- `users/_components/UserProfile.tsx` - users 전용

### Atomic 컴포넌트 사용 규칙

#### 1. atoms 직접 사용 ✅

```typescript
// src/app/posts/_components/PostItem.tsx
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';

export function PostItem() {
  return (
    <div>
      <Badge>공지</Badge>
      <Button>자세히</Button>
    </div>
  );
}
```

#### 2. molecules 직접 사용 ✅

```typescript
// src/app/posts/_components/PostForm.tsx
import { FormField } from '@/components/molecules/FormField';

export function PostForm() {
  return (
    <form>
      <FormField label="제목" name="title" />
    </form>
  );
}
```

#### 3. organisms 사용 (도메인 독립적인 것만) ✅

```typescript
// src/app/posts/page.tsx
import { Navigation } from '@/components/organisms/Navigation';

export default function PostsPage() {
  return (
    <>
      <Navigation />
      {/* posts 컨텐츠 */}
    </>
  );
}
```

---

## ✅ 체크리스트

### 새 도메인 생성 시
- [ ] 도메인 디렉토리 생성: `app/{domain}/`
- [ ] 도메인 Components 생성: `app/{domain}/_components/` + `index.ts`
- [ ] 도메인 Hooks 생성 (필요시): `app/{domain}/_hooks/` + `index.ts`
- [ ] Repository 생성 (필요시): `app/{domain}/_repositories/` + `index.ts`
- [ ] API Client 생성 (필요시): `app/{domain}/_api-clients/` + `index.ts`
- [ ] Factory export 추가: `api-clients/index.ts`에 singleton 추가 (선택적)
- [ ] 전역 타입 정의: `models/{domain}.types.ts`
- [ ] **테스트 디렉토리 생성**: 각 레이어에 `__tests__/` 디렉토리 추가

### Repository 작성 시
- [ ] `createServerSupabaseClient` 사용하는가?
- [ ] 클래스명이 `{Domain}Repository`인가? (PascalCase)
- [ ] 에러 처리가 적절한가?
- [ ] 전역 타입 import: `@/models/{domain}.types`
- [ ] **테스트 작성**: `__tests__/{domain}.repository.test.ts` ✅

### API Client 작성 시
- [ ] 환경변수로 백엔드 전환이 가능한가?
- [ ] 클래스명이 `{Domain}ApiClient`인가?
- [ ] 에러 처리가 적절한가?
- [ ] Factory Pattern: `api-clients/index.ts`에 singleton export (선택적)

### Domain Hooks 작성 시
- [ ] 디렉토리명이 `_hooks`인가? (라우팅 제외)
- [ ] Factory Pattern 사용: `import { domainClient } from '../_api-clients'`
- [ ] Barrel export: `index.ts` 작성
- [ ] useState/useEffect 또는 React Query 사용
- [ ] 전역 타입 import: `@/models/{domain}.types`
- [ ] **테스트 작성**: `__tests__/use{Domain}.test.ts` ✅

### Domain Components 작성 시
- [ ] 디렉토리명이 `_components`인가? (라우팅 제외)
- [ ] 해당 도메인 전용 컴포넌트인가?
- [ ] Atomic 컴포넌트를 적절히 활용하는가?
- [ ] Barrel export: `index.ts` 작성
- [ ] Domain Hooks import: `../_hooks`
- [ ] 다른 도메인에서 import하지 않는가?
- [ ] **테스트 작성**: `__tests__/{Component}.test.tsx` ✅

### 테스트 작성 시 (Phase 9 완료) ✅
- [ ] 각 레이어에 `__tests__/` 디렉토리 생성
- [ ] Repository: Supabase query mocking으로 테스트
- [ ] Hooks: API Client mocking으로 테스트
- [ ] Components: React Testing Library 사용
- [ ] 테스트 커버리지 80% 이상 목표 달성

### Performance Optimization (Phase 10 완료) ⚡
- [ ] Dynamic Import로 큰 컴포넌트 lazy loading
- [ ] Loading skeleton으로 UX 개선
- [ ] next.config.ts에 package optimization 설정
- [ ] Bundle size 측정 및 개선

### Import 경로
- [ ] Domain Hooks에서 API Client: `import { domainClient } from '../_api-clients'`
- [ ] Domain Components에서 Hooks: `../_hooks` (Barrel export)
- [ ] Page에서 Components: `./_components` (Barrel export)
- [ ] Page에서 Repository: `./_repositories` (Barrel export)
- [ ] Atomic 컴포넌트: `@atoms/`, `@molecules/`, `@organisms/`
- [ ] 전역 타입: `@/models/{domain}.types`
- [ ] 다른 도메인의 `_components/`, `_hooks/` 직접 import 금지
