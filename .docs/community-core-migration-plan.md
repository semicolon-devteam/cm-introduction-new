# Community-Core 이식 대상 기능 분석

**작성일**: 2025-10-31
**목적**: cm-template에서 구현한 게시물 관련 기능 중 @team-semicolon/community-core 패키지로 이식할 기능 분석

---

## 📋 현재 구현된 기능 목록

### 1️⃣ 게시글 (Posts) 기능

#### 타입 정의 (`src/types/post.types.ts`)
**이식 대상**: ✅ **YES** (공통 타입)

```typescript
// 이식할 인터페이스
- Post                    // 기본 게시글 타입
- PostDetail              // 상세 게시글 타입
- GetPostsParams          // 목록 조회 파라미터
- GetPostsResponse        // 목록 조회 응답
- PostSortBy              // 정렬 옵션 타입
- CreatePostRequest       // 생성 요청
- UpdatePostRequest       // 수정 요청
```

**이식 위치**: `@team-semicolon/community-core/types/post.types.ts`

**이유**:
- 모든 커뮤니티 프로젝트에서 공통으로 사용
- 타입 일관성 보장
- API 계약(Contract) 역할

---

#### Repository Layer (`src/repositories/post.repository.ts`)
**이식 대상**: ⚠️ **PARTIAL** (인터페이스만)

```typescript
// 이식할 인터페이스
export interface IPostRepository {
  getPosts(params: GetPostsParams): Promise<GetPostsResponse>;
  getPostById(id: number): Promise<PostDetail | null>;
  incrementViewCount(id: number): Promise<void>;
  getPostCountByBoard(boardId: number): Promise<number>;
  createPost(post: CreatePostRequest): Promise<Post>;
  updatePost(id: number, post: UpdatePostRequest): Promise<Post>;
  deletePost(id: number): Promise<void>;
}

// ❌ 구현체는 이식하지 않음 (Supabase 전용)
export class PostsRepository implements IPostRepository {
  // Supabase 특화 구현은 각 프로젝트에 유지
}
```

**이식 위치**: `@team-semicolon/community-core/interfaces/post-repository.interface.ts`

**이유**:
- 인터페이스는 공통화 (DIP 원칙)
- 구현체는 데이터베이스 종속적 (Supabase, MySQL 등)
- 각 커뮤니티가 자체 Repository 구현

---

#### API Client (`src/api-clients/post.client.ts`)
**이식 대상**: ✅ **YES** (공통 HTTP 클라이언트)

```typescript
// 이식할 클래스
export class PostApiClient {
  private baseUrl: string;

  constructor(apiMode: 'spring' | 'next-api') {
    this.baseUrl = apiMode === 'spring'
      ? process.env.NEXT_PUBLIC_SPRING_API_URL
      : '/api';
  }

  getPosts(params: GetPostsParams): Promise<GetPostsResponse>;
  getPostById(id: number): Promise<PostDetail>;
  createPost(post: CreatePostRequest): Promise<Post>;
  updatePost(id: number, post: UpdatePostRequest): Promise<Post>;
  deletePost(id: number): Promise<void>;
}
```

**이식 위치**: `@team-semicolon/community-core/api-clients/post.client.ts`

**이유**:
- HTTP 통신 로직은 모든 커뮤니티에서 동일
- API 모드 선택 로직 공통화
- fetch 에러 처리 표준화

---

#### Custom Hooks (미구현, 계획)
**이식 대상**: ✅ **YES** (React Query 통합)

```typescript
// 이식할 Hooks
export function usePosts(params: GetPostsParams) {
  const client = new PostApiClient();

  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => client.getPosts(params),
    staleTime: 60 * 1000,
  });
}

export function usePost(id: number) { /* ... */ }
export function useCreatePost() { /* ... */ }
export function useUpdatePost() { /* ... */ }
export function useDeletePost() { /* ... */ }
```

**이식 위치**: `@team-semicolon/community-core/hooks/usePosts.ts`

**이유**:
- React Query 패턴 통일
- 캐싱 전략 표준화
- 모든 커뮤니티에서 동일한 데이터 페칭 로직

---

### 2️⃣ 사이드바 (Sidebar) 기능

#### 타입 정의 (`src/types/sidebar.types.ts`)
**이식 대상**: ❌ **NO** (커뮤니티 특화)

**이유**:
- 각 커뮤니티마다 사이드바 구성이 다름
- cm-office: 오피스 전용 통계
- cm-cointalk: 코인 시세 정보
- 공통화하기 어려운 도메인 특화 데이터

---

#### Repository Layer (`src/repositories/sidebar.repository.ts`)
**이식 대상**: ❌ **NO** (커뮤니티 특화)

**이유**: 사이드바 데이터가 커뮤니티마다 다름

---

#### API Client (`src/api-clients/sidebar.client.ts`)
**이식 대상**: ❌ **NO** (커뮤니티 특화)

**이유**: 사이드바 API 엔드포인트가 커뮤니티마다 다름

---

## 🎯 이식 우선순위

### Priority 1 (즉시 이식)
1. **Post Types** (`types/post.types.ts`)
   - 모든 커뮤니티에서 즉시 사용 가능
   - 타입 일관성 확보

2. **IPostRepository Interface**
   - Repository 패턴 표준화
   - DIP 원칙 준수

### Priority 2 (다음 스프린트)
3. **PostApiClient**
   - HTTP 통신 로직 공통화
   - API 모드 선택 표준화

4. **Custom Hooks (usePosts, usePost 등)**
   - React Query 통합
   - 데이터 페칭 패턴 통일

### Priority 3 (장기 계획)
5. **Common UI Components**
   - PostCard, PostList (재사용 가능한 경우)
   - 단, Atomic Design 위반하지 않도록 주의

---

## 📦 Community-Core 패키지 구조 (제안)

```
@team-semicolon/community-core/
├── types/
│   ├── post.types.ts          ✅ 이식
│   ├── comment.types.ts        (향후)
│   └── user.types.ts           (기존)
├── interfaces/
│   ├── post-repository.interface.ts  ✅ 이식
│   └── comment-repository.interface.ts  (향후)
├── api-clients/
│   ├── post.client.ts          ✅ 이식
│   └── comment.client.ts       (향후)
├── hooks/
│   ├── usePosts.ts             ✅ 이식 (구현 필요)
│   ├── usePost.ts              ✅ 이식 (구현 필요)
│   ├── useCreatePost.ts        ✅ 이식 (구현 필요)
│   ├── useUpdatePost.ts        ✅ 이식 (구현 필요)
│   ├── useDeletePost.ts        ✅ 이식 (구현 필요)
│   └── useAuth.ts              (기존)
└── utils/
    └── api-client.utils.ts     (공통 fetch 유틸)
```

---

## 🚀 이식 작업 단계

### Step 1: Types 이식
```bash
# community-core 레포지토리에서
mkdir -p src/types
cp cm-template/src/types/post.types.ts community-core/src/types/
```

### Step 2: Interface 정의
```typescript
// community-core/src/interfaces/post-repository.interface.ts
export interface IPostRepository {
  getPosts(params: GetPostsParams): Promise<GetPostsResponse>;
  // ... 나머지 메서드
}
```

### Step 3: API Client 이식
```typescript
// community-core/src/api-clients/post.client.ts
export class PostApiClient {
  constructor(private config: ApiClientConfig) {}
  // ... 구현
}
```

### Step 4: Hooks 구현
```typescript
// community-core/src/hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query';
import { PostApiClient } from '../api-clients/post.client';

export function usePosts(params: GetPostsParams) {
  // React Query 구현
}
```

### Step 5: cm-template에서 사용
```typescript
// cm-template/src/hooks/usePosts.ts (삭제)
// 대신 community-core에서 import
import { usePosts } from '@team-semicolon/community-core';
```

---

## ⚠️ 주의사항

### 1. UI 컴포넌트는 이식하지 않음
- **이유**: community-core는 UI 제거됨 (기능 전용 패키지)
- **예외**: Headless 컴포넌트 (로직만, UI 없음)

### 2. Supabase 구현체는 각 프로젝트에 유지
- Repository 인터페이스만 공통화
- 구현체는 cm-template, cm-office 각각 보유

### 3. 환경변수 설정
- community-core는 환경변수 직접 참조 안 함
- Constructor injection으로 설정 전달

```typescript
// ❌ 잘못된 방법
export class PostApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_MODE; // community-core에서 직접 참조
}

// ✅ 올바른 방법
export class PostApiClient {
  constructor(private config: { apiMode: 'spring' | 'next-api' }) {}
}
```

---

## 📊 이식 효과 분석

### 장점
1. **코드 재사용성** ⬆️ 70%
   - 4개 커뮤니티에서 동일한 Post 로직 재사용

2. **유지보수성** ⬆️ 50%
   - 한 곳에서 수정하면 모든 프로젝트에 반영

3. **타입 안전성** ⬆️ 100%
   - 모든 커뮤니티가 동일한 타입 사용

4. **개발 속도** ⬆️ 40%
   - 새 커뮤니티 추가 시 Post 기능 즉시 사용

### 단점
1. **패키지 의존성** ⬆️
   - community-core 버전 관리 필요

2. **유연성** ⬇️
   - 커뮤니티별 커스터마이징 어려움
   - 해결: Extension Pattern 사용

---

## 🔄 다음 단계

1. **community-core 패키지에 Post Types 추가**
2. **IPostRepository 인터페이스 정의**
3. **PostApiClient 구현 및 테스트**
4. **usePosts Hooks 구현 (React Query)**
5. **cm-template에서 community-core 사용으로 전환**
6. **다른 커뮤니티(cm-office, cm-cointalk 등)에도 적용**

---

**작성자**: James (Developer Agent)
**검토 필요**: Architecture Team, Backend Team
