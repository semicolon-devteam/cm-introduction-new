# SSR 우선 아키텍처 가이드

> Next.js 15 App Router의 서버 사이드 렌더링 장점을 최대한 활용하기 위한 아키텍처 설계 문서

## 📋 목차

1. [핵심 원칙](#핵심-원칙)
2. [아키텍처 개요](#아키텍처-개요)
3. [구현 패턴](#구현-패턴)
4. [파일 구조 규칙](#파일-구조-규칙)
5. [성능 최적화 전략](#성능-최적화-전략)
6. [마이그레이션 가이드](#마이그레이션-가이드)

## 핵심 원칙

### 🎯 원칙 1: 서버 우선 (Server-First)

- **기본적으로 모든 컴포넌트는 서버 컴포넌트로 작성**
- 클라이언트 컴포넌트는 필요한 경우에만 최소한으로 사용
- 데이터 페칭은 서버에서 수행

### 🎯 원칙 2: 최소 클라이언트 경계 (Minimal Client Boundaries)

- 인터랙티브 기능이 필요한 부분만 클라이언트 컴포넌트로 분리
- 전체 페이지를 `'use client'`로 만들지 않음
- 클라이언트 컴포넌트는 작고 독립적으로 유지

### 🎯 원칙 3: Server Actions 활용

- 폼 제출과 데이터 변경은 Server Actions으로 처리
- API Routes 대신 Server Actions 우선 사용
- 점진적 향상 (Progressive Enhancement) 적용

## 아키텍처 개요

### 계층별 역할 분담

```
┌─────────────────────────────────────────────────────────┐
│                   Page Layer (SSR)                      │
│  - 데이터 페칭 (서버)                                   │
│  - 초기 렌더링 (서버)                                   │
│  - SEO 메타데이터 (서버)                                │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                 Server Action Layer                     │
│  - 폼 제출 처리                                         │
│  - 데이터 변경 작업                                     │
│  - 인증/권한 검증                                       │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│              Interactive Component Layer                │
│  - 사용자 상호작용 (클라이언트)                         │
│  - 실시간 UI 업데이트                                   │
│  - 클라이언트 전용 로직                                 │
└─────────────────────────────────────────────────────────┘
```

## 구현 패턴

### 1. 서버 컴포넌트 + Server Actions 패턴

```typescript
// ✅ GOOD: 서버 컴포넌트에서 데이터 페칭
// src/app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetchPosts(); // 서버에서 실행

  return (
    <div>
      <h1>게시물 목록</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// ❌ AVOID: 클라이언트 컴포넌트에서 데이터 페칭
'use client';
export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts().then(setPosts); // 클라이언트에서 실행 - 피하세요!
  }, []);
}
```

### 2. 하이브리드 컴포지션 패턴

```typescript
// 서버 컴포넌트 (page.tsx)
export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile(user.id);

  return (
    <div>
      {/* 정적 데이터 표시 */}
      <ProfileHeader profile={profile} />

      {/* 인터랙티브 기능만 클라이언트 컴포넌트 */}
      <ProfileEditButton profileId={profile.id} />
    </div>
  );
}

// 클라이언트 컴포넌트 (profile-edit-button.tsx)
'use client';
export function ProfileEditButton({ profileId }: { profileId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  // 인터랙티브 로직만 여기에
}
```

### 3. Server Actions를 활용한 폼 처리

```typescript
// Server Action
async function createPostAction(formData: FormData) {
  'use server';

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // 서버에서 데이터베이스 처리
  const result = await createPost({ title, content });

  if (result.error) {
    return { error: result.error };
  }

  redirect(`/posts/${result.data.id}`);
}

// 서버 컴포넌트에서 사용
export default function CreatePostPage() {
  return (
    <form action={createPostAction}>
      <input name="title" placeholder="제목" required />
      <textarea name="content" placeholder="내용" required />
      <button type="submit">작성</button>
    </form>
  );
}
```

## 파일 구조 규칙

### 디렉토리 구조

```
src/
├── app/                          # App Router (서버 우선)
│   ├── (routes)/                 # 라우트 그룹
│   │   ├── page.tsx             # ✅ Server Component (기본)
│   │   └── layout.tsx           # ✅ Server Component
│   ├── actions/                  # Server Actions
│   │   ├── auth.actions.ts     # 인증 관련 서버 액션
│   │   └── post.actions.ts     # 게시물 관련 서버 액션
│   └── api/                      # API Routes (필요시)
│       └── webhooks/            # 외부 웹훅 처리
├── components/
│   ├── ui/                       # ✅ Server Components (기본)
│   │   └── *.tsx                # Shadcn/ui 컴포넌트
│   ├── server/                   # ✅ Server Components 전용
│   │   ├── post-list.tsx
│   │   └── user-profile.tsx
│   └── client/                   # 🔄 Client Components 전용
│       ├── like-button.tsx     # 'use client' 명시
│       └── comment-form.tsx    # 'use client' 명시
└── lib/
    ├── server/                   # 서버 전용 유틸리티
    └── client/                   # 클라이언트 전용 유틸리티
```

### 명명 규칙

- **서버 컴포넌트**: `component-name.tsx` (기본)
- **클라이언트 컴포넌트**: `component-name.client.tsx` 또는 `client/` 폴더에 위치
- **Server Actions**: `*.actions.ts`
- **유틸리티**: 서버/클라이언트 폴더로 명확히 구분

## 성능 최적화 전략

### 1. 데이터 캐싱

```typescript
import { cache } from "react";
import { unstable_cache } from "next/cache";

// React cache (요청당 캐싱)
const getUser = cache(async (id: string) => {
  return await db.user.findUnique({ where: { id } });
});

// Next.js cache (빌드 간 캐싱)
const getCachedPosts = unstable_cache(
  async () => {
    return await db.post.findMany();
  },
  ["posts"],
  { revalidate: 3600 }, // 1시간 캐시
);
```

### 2. 스트리밍 렌더링

```typescript
import { Suspense } from 'react';
import { PostListSkeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div>
      <h1>대시보드</h1>

      {/* 즉시 렌더링 */}
      <Header />

      {/* 스트리밍으로 나중에 렌더링 */}
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  );
}
```

### 3. 정적 생성과 재검증

```typescript
// 정적 경로 생성
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ id: post.id }));
}

// 재검증 설정
export const revalidate = 3600; // 1시간마다 재생성

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  return <PostDetail post={post} />;
}
```

## 마이그레이션 가이드

### 단계별 접근

#### Phase 1: 현재 상태 분석 (1주)

- [ ] 모든 `'use client'` 컴포넌트 목록 작성
- [ ] 서버 컴포넌트로 변환 가능한 컴포넌트 식별
- [ ] 우선순위 설정

#### Phase 2: 점진적 마이그레이션 (2-3주)

- [ ] 정적 페이지부터 서버 컴포넌트로 변환
- [ ] Server Actions 구현 및 적용
- [ ] 클라이언트 컴포넌트 최소화

#### Phase 3: 최적화 (1주)

- [ ] Suspense 경계 설정
- [ ] 캐싱 전략 구현
- [ ] 성능 측정 및 개선

### 체크리스트

#### ✅ 서버 컴포넌트 전환 체크리스트

- [ ] 컴포넌트가 이벤트 핸들러를 사용하는가? → 분리 필요
- [ ] useState, useEffect를 사용하는가? → 클라이언트 유지 또는 리팩토링
- [ ] 브라우저 API를 사용하는가? → 클라이언트 유지
- [ ] 순수하게 props를 받아 렌더링하는가? → 서버 컴포넌트 가능

#### ✅ 성능 개선 체크리스트

- [ ] 초기 로딩 시간 50% 단축
- [ ] JavaScript 번들 크기 30% 감소
- [ ] SEO 점수 90점 이상
- [ ] Core Web Vitals 모두 "Good" 달성

## 모니터링 지표

### 추적해야 할 메트릭

| Metric                         | Target   | 측정 방법  |
| ------------------------------ | -------- | ---------- |
| First Contentful Paint (FCP)   | < 1.0s   | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s   | Lighthouse |
| Time to Interactive (TTI)      | < 3.8s   | Lighthouse |
| Cumulative Layout Shift (CLS)  | < 0.1    | Lighthouse |
| JavaScript Bundle Size         | < 150KB  | Build 분석 |
| SEO Score                      | > 90/100 | Lighthouse |

## 참고 자료

- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Server Actions 가이드](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Streaming과 Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
