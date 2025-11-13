# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **cm-introduction** - Semicolon 팀 소개 사이트. 팀 리더, 파트타이머, 외부 문의 관리 기능을 제공하는 프로젝트입니다. The project follows **Domain-Driven Design (DDD) architecture**:

1. **Domain Layer**: Domain-centric structure with `app/{domain}/` directories containing domain-specific components, hooks, and logic
2. **UI Layer**: Atomic Design pattern (atoms → molecules → organisms → templates) for domain-independent components
3. **Data Layer**: API Clients + Repository pattern for Supabase backend integration

**핵심 도메인**:

- **Leader**: 팀 리더 프로필 관리 (이름, 직책, 경력, 프로필 이미지, 메시지)
- **PartTimer**: 파트타이머 정보 관리 (닉네임, 역할, 팀) - 단순 리스트 형태
- **Contact**: 외부 문의 수집 및 처리 (NEW → ACK → IN_PROGRESS → RESOLVED → CLOSED)

## Key Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Shadcn/ui Components
npx shadcn-ui@latest init                    # Initialize Shadcn/ui
npx shadcn-ui@latest add [component-name]    # Add specific component

# Supabase Type Generation
npx supabase gen types typescript --project-id [project-id] > lib/supabase/database.types.ts

# Testing (✅ Implemented - Phase 9)
npm test             # Run all tests (137 tests)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ui      # Run tests with Vitest UI
```

## Architecture & Code Structure

> **✅ ARCHITECTURE STATUS**: 프로젝트는 **DDD 기반 도메인 중심 아키텍처**로 전환 완료되었습니다.
>
> - 자세한 내용: [DDD-ARCHITECTURE.md](docs/architecture/DDD-ARCHITECTURE.md)
> - 도메인 구조 가이드: [DOMAIN-STRUCTURE.md](docs/architecture/DOMAIN-STRUCTURE.md)
> - Epic 완료: [semicolon-devteam/command-center#129](https://github.com/semicolon-devteam/command-center/issues/129)

### DDD 기반 도메인 중심 아키텍처 (Current Architecture)

**CRITICAL**: 모든 새로운 코드는 DDD 기반 구조를 따라 작성합니다.

```
src/
├── app/
│   ├── leaders/               # 🎯 Leader 도메인 (팀 리더 프로필)
│   │   ├── _repositories/     # 서버사이드 데이터 접근 ⭐
│   │   ├── _api-clients/      # 브라우저 HTTP 통신 ⭐
│   │   ├── _hooks/            # React 상태 관리 ⭐
│   │   ├── _components/       # 도메인 전용 UI ⭐
│   │   ├── [id]/page.tsx      # 리더 상세 페이지
│   │   └── page.tsx           # 리더 목록 (People 페이지)
│   ├── part-timers/           # 🎯 PartTimer 도메인 (파트타이머)
│   │   ├── _repositories/     # 서버사이드 데이터 접근 ⭐
│   │   ├── _api-clients/      # 브라우저 HTTP 통신 ⭐
│   │   ├── _hooks/            # React 상태 관리 ⭐
│   │   ├── _components/       # 도메인 전용 UI (단순 리스트)
│   │   └── page.tsx           # People 페이지 하단 섹션
│   ├── contacts/              # 🎯 Contact 도메인 (외부 문의)
│   │   ├── _repositories/     # 서버사이드 데이터 접근 ⭐
│   │   ├── _api-clients/      # 브라우저 HTTP 통신 ⭐
│   │   ├── _hooks/            # React 상태 관리 ⭐
│   │   ├── _components/       # 도메인 전용 UI
│   │   └── page.tsx           # 문의 폼 페이지
│   └── admin/                 # 관리자 페이지 (운영자 전용)
│       ├── leaders/           # 리더 관리
│       ├── part-timers/       # 파트타이머 관리
│       └── contacts/          # 문의 관리 (상태 변경)
├── repositories/              # 공통 인프라 (필요시)
├── lib/
│   └── api-clients/           # 공통 인프라
├── hooks/                     # 전역 Hooks
├── components/                # Atomic Design (도메인 독립적)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── models/                    # 전역 타입
└── lib/
    ├── supabase/
    └── utils/
```

**핵심 원칙**:

1. **도메인 응집도**: 관련 코드가 `/app/{domain}/` 하위에 모임 (**repository, api-client 포함**)
2. **명확한 경계**: 각 도메인의 책임과 범위가 명확히 구분
3. **core-backend 정렬**: Spring Boot core-backend 구조와 동일한 패턴
4. **공통 인프라 분리**: 여러 도메인에서 공유하는 요소는 외부 계층에 위치

### Domain Component Pattern

**도메인별 \_components/ 디렉토리**:

각 도메인은 자체 UI 컴포넌트를 `_components/` 디렉토리에 보유합니다:

```typescript
// app/posts/_components/index.ts
export { PostsHeader } from "./PostsHeader";
export { PostsFilter } from "./PostsFilter";
export { PostsList } from "./PostsList";
export { PostsEmptyState } from "./PostsEmptyState";
export { PostsLoadingState } from "./PostsLoadingState";
export { PostsErrorState } from "./PostsErrorState";

// app/posts/page.tsx
import {
  PostsHeader,
  PostsFilter,
  PostsList,
  PostsEmptyState,
  PostsLoadingState,
  PostsErrorState,
} from "./_components";
```

**구현 예시**:

🎯 **leaders 도메인** (구현 예정 - Epic #134):

- `_repositories/`: LeadersRepository (리더 정보 CRUD, 이미지 업로드)
- `_api-clients/`: leadersClient (Factory Pattern)
- `_hooks/`: useLeaders, useLeader, useUpdateLeader (React 상태 관리)
- `_components/`: LeaderCard, LeaderProfile, LeaderMessage 등
- **엔티티**: Leader (id, name, position, summary, career, profile_image, is_active)
- **Figma**: https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=12-1103

🎯 **part-timers 도메인** (구현 예정 - Epic #135):

- `_repositories/`: PartTimersRepository (파트타이머 정보 CRUD)
- `_api-clients/`: partTimersClient (Factory Pattern)
- `_hooks/`: usePartTimers (React 상태 관리)
- `_components/`: PartTimerList (단순 리스트, 상세 페이지 없음)
- **엔티티**: PartTimer (id, nickname, role, team, is_active)
- **특징**: 이미지 없음, 단일 페이지 내 텍스트 리스트 형태

🎯 **contacts 도메인** (구현 예정 - Epic #149):

- `_repositories/`: ContactsRepository (문의 수집 및 상태 관리)
- `_api-clients/`: contactsClient (Factory Pattern)
- `_hooks/`: useContacts, useContactStatus (React 상태 관리)
- `_components/`: ContactForm, ContactStatusBadge 등
- **엔티티**: Inquiry (id, name, email, phone, message, status)
- **상태**: NEW → ACK → IN_PROGRESS → RESOLVED → CLOSED
- **Figma**: https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=29-248

### Domain Hooks Pattern

**도메인별 \_hooks/ 디렉토리**:

도메인 전용 훅은 `_hooks/` 디렉토리에 위치합니다:

```typescript
// app/posts/_hooks/index.ts
export { usePosts } from "./usePosts";
export { usePost } from "./usePost";

// app/posts/page.tsx
import { usePosts } from "./_hooks";
```

**전역 vs 도메인 Hooks 분리**:

- **도메인 Hooks** (`app/{domain}/_hooks/`): 해당 도메인에서만 사용
  - leaders: `useLeaders`, `useLeader`, `useUpdateLeader`
  - part-timers: `usePartTimers`
  - contacts: `useContacts`, `useContactStatus`
- **전역 Hooks** (`src/hooks/`): 여러 도메인에서 공유 (예: useAuth, usePermission)

---

## 🚨 DEPRECATED: 7-Layer Architecture (Migration Complete)

**CRITICAL**: cm-introduction은 템플릿 기반으로 시작했으나, 도메인은 완전히 다릅니다.

**템플릿에서 제거할 도메인**:

- ❌ posts (게시글 도메인) - 불필요
- ❌ dashboard (대시보드) - 불필요
- ❌ profile (프로필 관리) - 불필요
- ❌ auth (인증) - 관리자만 필요, 일반 사용자 인증 불필요

**구현할 도메인** (Epic 기반):

- 🎯 leaders (Epic #134) - 팀 리더 소개
- 🎯 part-timers (Epic #135) - 파트타이머 목록
- 🎯 contacts (Epic #149) - 외부 문의
- 🎯 admin - 운영자 전용 관리 페이지

**참고용 Legacy 구조** (읽기 전용):

<details>
<summary>클릭하여 Legacy 7-Layer 구조 보기 (참고용)</summary>

```
src/
├── app/
│   ├── api/              # 1️⃣ API Routes - HTTP handlers (로컬 개발용)
│   ├── actions/          # Server Actions
│   └── [routes]/         # 5️⃣ Pages - 라우트 핸들러
├── repositories/         # 2️⃣ Repository Layer - 서버사이드 데이터 접근
├── api-clients/          # 3️⃣ API Client Layer - 브라우저 HTTP 통신
├── hooks/                # 4️⃣ Hooks - React Query + API Client 호출
├── components/           # 6️⃣ Components - Atomic Design
│   ├── atoms/            # Shadcn/ui base components
│   ├── molecules/        # Combined atoms
│   ├── organisms/        # Complex features
│   └── templates/        # Page layouts
├── types/                # 7️⃣ Models - TypeScript interfaces (DEPRECATED → models/)
├── services/             # (REMOVED - Phase 3.3에서 제거됨)
├── constants/            # 상수 정의
└── lib/
    ├── supabase/         # Supabase configuration
    └── utils/            # Helper functions
```

</details>

---

### Layer Responsibilities

#### 1️⃣ API Routes (`app/api/`)

**역할**: HTTP 요청 핸들러 (Controller 역할)

- Repository 메서드 호출
- 요청 파라미터 검증 및 파싱
- 에러 응답 포맷팅
- JSON 응답 반환
- **사용 시점**: 로컬 개발 환경 (Spring Boot 없을 때)

```typescript
// app/api/posts/route.ts
import { PostsRepository } from "@/repositories/post.repository";

export async function GET(request: Request) {
  const repository = new PostsRepository();
  const posts = await repository.getPosts({ limit: 20 });
  return Response.json(posts);
}
```

#### 2️⃣ Repository Layer (`repositories/`) ⭐

**역할**: 데이터 접근 추상화 (서버사이드 전용)

- Supabase 쿼리 실행
- 복잡한 데이터 로직 및 트랜잭션 처리
- **반드시** `createServerSupabaseClient` 사용
- Repository 패턴으로 데이터 영속성 구현

```typescript
// repositories/post.repository.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";

export class PostsRepository {
  async getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return { posts: data, total: data.length };
  }
}
```

#### 3️⃣ API Client Layer (`api-clients/`) ⭐

**역할**: 브라우저 사이드 HTTP 통신

- 환경변수로 Spring Boot / Next.js API 선택
- fetch/axios 래퍼
- 요청/응답 변환
- 에러 처리

```typescript
// api-clients/post.client.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_MODE === "spring" ? process.env.NEXT_PUBLIC_SPRING_API_URL : "/api";

export class PostApiClient {
  async getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
    const response = await fetch(`${API_BASE}/posts?${new URLSearchParams(params)}`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  }
}
```

#### 4️⃣ Hooks (`hooks/`)

**역할**: React 상태 관리 + API Client 호출

- React Query로 API Client 호출
- 캐싱, 리페칭, 낙관적 업데이트
- 로딩/에러 상태 관리

```typescript
// app/posts/_hooks/usePosts.ts (도메인별 hooks)
import { useQuery } from "@tanstack/react-query";
import { postsClient } from "@/api-clients";

export function usePosts(params: GetPostsParams) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postsClient.getPosts(params),
    staleTime: 60 * 1000, // 1분 캐싱
  });
}
```

#### 5️⃣ Pages (`app/[routes]/page.tsx`)

**역할**: 라우트 핸들러 및 레이아웃 구성

- Server Component 우선 사용
- 초기 데이터 페칭
- SEO 메타데이터 설정

#### 6️⃣ Components (`components/`)

**역할**: Atomic Design UI 요소

- Atoms, Molecules, Organisms, Templates
- 순수 프레젠테이션 로직만 포함

#### 7️⃣ Models (`models/`)

**역할**: TypeScript 인터페이스 및 타입 정의

- API 요청/응답 타입
- Database 타입 (Supabase generated)
- 도메인 모델 인터페이스
- **Note**: Phase 1에서 types/ → models/로 마이그레이션 완료

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 로컬 개발 (Spring Boot 없음)                                  │
│                                                               │
│ Browser → API Client → Next.js API Route → Repository →      │
│           (3️⃣)        (1️⃣)                (2️⃣)              │
│           ↓                                                   │
│         Hooks (4️⃣)                                           │
│           ↓                                                   │
│       Components (6️⃣)                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 프로덕션 (Spring Boot 있음)                                   │
│                                                               │
│ Browser → API Client → Spring Boot Backend                   │
│           (3️⃣)        (외부 서버)                             │
│           ↓                                                   │
│         Hooks (4️⃣)                                           │
│           ↓                                                   │
│       Components (6️⃣)                                        │
└─────────────────────────────────────────────────────────────┘
```

### 1-Hop Rule (Development Philosophy)

**원칙**: 불필요한 네트워크 중간 계층 제거

**❌ 금지된 패턴**:

```
Browser → Next.js API → Spring Boot (2-hop, 불필요한 지연)
```

**✅ 올바른 패턴**:

```
Browser → Spring Boot (1-hop, 직접 통신)
```

### Atomic Design Implementation

**CRITICAL**: Follow strict Atomic Design hierarchy. Never mix technical concerns (client/server) with UI architecture patterns.

### Critical Integration Points

#### 1. API Client Factory Pattern

```typescript
// api-clients/index.ts
// Factory pattern with singleton instances
import { PostApiClient } from "./post.client";
import { SidebarApiClient } from "./sidebar.client";

export const postsClient = new PostApiClient();
export const sidebarClient = new SidebarApiClient();

// Usage in hooks
import { postsClient } from "@/api-clients";
const posts = await postsClient.getPosts(params);
```

#### 2. Supabase Client Usage

```typescript
// Client-side: use createBrowserClient from lib/supabase/client
// Server-side: use createServerSupabaseClient from lib/supabase/server
// Never import @supabase/supabase-js directly in components
```

#### 3. Community-Core Hooks Integration

```typescript
// Always use community-core hooks for business logic:
// - useAuth: Authentication state
// - usePermission: Authorization checks
// - usePostQuery: Post data fetching
// - useUserQuery: User data fetching
// Wrap these hooks with Supabase data fetching
```

## Component Development Guidelines

### Shadcn/ui Component Usage

- Components are copied to `components/ui/` directory
- Customize styling via Tailwind classes, not direct CSS
- Always maintain accessibility features from original components
- Use cn() utility for conditional classes

### Atomic Design Rules

#### Component Classification Rules

- **Atoms**:
  - Base UI components from Shadcn/ui
  - NO business logic or state management
  - Pure presentational components
  - Examples: Button, Input, Card, Badge, Avatar

- **Molecules**:
  - Combine 2-3 Atoms
  - Simple, reusable compositions
  - May have minimal UI state (hover, focus)
  - NO business logic or data fetching
  - Examples: FormField (Label + Input + Error), UserAvatar (Avatar + Name + Badge)

- **Organisms**:
  - Complex components with multiple Molecules/Atoms
  - Can have UI state management
  - Form handling and validation
  - NO direct business logic - use Container pattern
  - Examples: LoginForm, Navigation, Sidebar (pure UI version)

- **Templates**:
  - Page layouts and structure
  - Define content areas
  - NO data fetching or business logic
  - Receive children components
  - Examples: CommunityLayout, DashboardLayout

#### Business Logic Separation

- **Container Pattern**: Create separate Container components for business logic
  - Example: `SidebarContainer` (business) → `Sidebar` (UI)
  - Container handles: data fetching, auth, API calls
  - UI component receives: props, callbacks, computed data
- **Never mix**: UI components should NEVER import auth providers or API services directly
- **Props over imports**: Pass data and callbacks via props, not direct imports

## State Management Strategy

### Three Types of State

1. **Local State**: UI-only state (modals, dropdowns) - use useState
2. **Global State**: User session, app config - use Redux Toolkit from community-core
3. **Server State**: Posts, comments, users - use React Query with Supabase

### Data Flow

```
User Action → Domain Hook (_hooks/) → API Client (Factory) → Supabase → UI Update
             (usePosts, usePost)     (postsClient)
```

## Environment Variables

Required environment variables (copy from `.env.example`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...              # Server-side only

# API Mode Selection (Development Philosophy)
NEXT_PUBLIC_API_MODE=next-api                    # "next-api" | "spring"
NEXT_PUBLIC_SPRING_API_URL=http://localhost:8080 # Spring Boot URL (프로덕션용)

# Optional
NODE_ENV=development                             # development | production
```

### API Mode 설명:

- **`next-api`** (기본값): Next.js API Routes + Repository → Supabase
- **`spring`**: Spring Boot Backend 직접 호출 (프로덕션)

## Database Schema Considerations

When working with Supabase:

- All tables should have Row Level Security (RLS) enabled
- Use `auth.uid()` for user identification in policies
- Follow the naming convention: snake_case for columns, plural for tables
- Always generate TypeScript types after schema changes

## Performance Targets

- Initial JS bundle: < 500KB
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Use dynamic imports for large components
- Implement infinite scroll for lists > 50 items

## Common Patterns

### Protected Routes

```typescript
// Use middleware.ts for auth checks
// Redirect unauthenticated users to /auth/login
```

### Real-time Updates

```typescript
// Use Supabase Realtime for:
// - Comments on posts
// - Online user status
// - Notification updates
```

### File Uploads

```typescript
// Always use Supabase Storage
// Implement file size limits
// Generate unique paths with user ID
```

## Atomic Design Violations to Avoid

**NEVER DO THESE**:

1. ❌ Create `client/` or `server/` directories in components
2. ❌ Mix UI architecture with technical implementation details
3. ❌ Import auth providers or API services directly in UI components
4. ❌ Put complex components in Molecules (they belong in Organisms)
5. ❌ Add business logic to Atoms or Molecules
6. ❌ Use technical naming (like `ui/`) instead of architectural naming (`atoms/`)

**ALWAYS DO THESE**:

1. ✅ Use Container pattern for business logic separation
2. ✅ Keep Atoms pure and stateless
3. ✅ Limit Molecules to 2-3 Atoms composition
4. ✅ Place forms and complex interactions in Organisms
5. ✅ Pass data via props, not direct imports
6. ✅ Follow the hierarchy: Atoms → Molecules → Organisms → Templates

## Important Notes

- **UI Components**: All UI comes from Shadcn/ui, NOT from community-core
- **Business Logic**: Use community-core hooks and services, adapted for Supabase
- **Database**: All data operations go through Supabase, not community-core's default backend
- **Authentication**: Use Supabase Auth, wrapped with community-core's useAuth hook
- **Type Safety**: Always generate and use TypeScript types for Supabase tables

## SSR-First Development Guidelines

### Core Principle: Server Components by Default

When developing pages and components:

1. **Start with Server Components** - Don't use `'use client'` unless necessary
2. **Minimize Client Boundaries** - Only interactive parts should be client components
3. **Use Server Actions** - Handle forms and mutations with Server Actions instead of API routes

### Component Architecture Rules

#### Page Components (`app/*/page.tsx`)

```typescript
// ✅ GOOD: Server Component (default)
export default async function PageName() {
  const data = await fetchData(); // Server-side data fetching
  return <ServerComponent data={data} />;
}

// ❌ AVOID: Client Component for pages
'use client';
export default function PageName() { /* ... */ }
```

#### Interactive Components

```typescript
// Split interactive features into small client components
// Keep the main page as a server component

// page.tsx (Server Component)
export default async function ProfilePage() {
  const profile = await getProfile();
  return (
    <>
      <ProfileDisplay profile={profile} /> {/* Server Component */}
      <ProfileEditButton profileId={profile.id} /> {/* Client Component */}
    </>
  );
}

// profile-edit-button.tsx
'use client';
export function ProfileEditButton({ profileId }: Props) {
  // Only the interactive logic here
}
```

### File Naming Convention

- **Server Components**: `component-name.tsx` (no suffix needed)
- **Client Components**: Place in `components/client/` folder or use `.client.tsx` suffix
- **Server Actions**: `*.actions.ts` files in `app/actions/` directory

### Performance Checklist

Before adding `'use client'`:

- [ ] Does the component need event handlers? → Consider Server Actions
- [ ] Does it use hooks like useState/useEffect? → May need client component
- [ ] Does it access browser APIs? → Must be client component
- [ ] Is it purely presentational? → Keep as server component

### SSR Benefits to Leverage

1. **Faster Initial Load** - HTML sent from server, no JS wait
2. **Better SEO** - Full content available to crawlers
3. **Improved Performance** - Reduced JavaScript bundle size
4. **Enhanced Security** - Sensitive logic stays on server

For detailed SSR architecture and patterns, see: `docs/SSR-BEST-PRACTICES.md`

## Quality & Performance

### Testing (Phase 9 Complete ✅)

**Test Coverage**:

- **137 tests** across 13 test files
- **100% pass rate**
- Repository Layer: posts, dashboard, profile
- Hooks Layer: posts, dashboard, profile
- UI Components: Button, Input, PostsEmptyState, PostsHeader
- Utilities: cn() function

**Test Structure**:

```
src/
├── app/
│   ├── posts/
│   │   ├── _repositories/__tests__/
│   │   ├── _hooks/__tests__/
│   │   └── _components/__tests__/
│   ├── dashboard/
│   │   ├── _repositories/__tests__/
│   │   └── _hooks/__tests__/
│   └── profile/
│       ├── _repositories/__tests__/
│       └── _hooks/__tests__/
├── components/
│   └── atoms/__tests__/
└── lib/__tests__/
```

**Running Tests**:

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:ui           # Vitest UI
```

### Performance (Phase 10 Complete ⚡)

**Optimization Results**:

- Profile page: **10.2 kB → 1.38 kB** (86.5% reduction)
- All pages under 133 kB First Load JS
- Initial bundle: 129 kB (target: < 500KB) ✅

**Applied Optimizations**:

1. **Dynamic Import & Code Splitting**
   - ProfileTabs lazy loading
   - Separate chunks for heavy components
   - Loading skeletons for UX

2. **Package Import Optimization**
   - lucide-react, @radix-ui optimized
   - Tree-shaking enabled
   - Modular imports configured

3. **Caching Strategy**
   - Static assets: 1 year cache
   - Storage resources: CDN-ready
   - ISR support enabled

**Performance Targets** (All Achieved ✅):

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Initial JS Bundle: < 500KB
- First Load JS: < 200KB

**Documentation**:

- [OPTIMIZATION-RESULTS.md](docs/performance/OPTIMIZATION-RESULTS.md)

## References

### Architecture Documentation

- **DDD Architecture**: [docs/architecture/DDD-ARCHITECTURE.md](docs/architecture/DDD-ARCHITECTURE.md)
- **Domain Structure Guide**: [docs/architecture/DOMAIN-STRUCTURE.md](docs/architecture/DOMAIN-STRUCTURE.md)
- **SSR Best Practices**: `docs/SSR-BEST-PRACTICES.md`
- Implementation Plan: `.docs/implementation-plan.md`
- Architecture Design: `.docs/architecture-design.md`
- Tech Stack Guide: `.docs/tech-stack-guide.md`

### External Resources

- Shadcn/ui Docs: https://ui.shadcn.com/
- Community Core: https://www.npmjs.com/package/@team-semicolon/community-core
- Supabase Docs: https://supabase.com/docs

### Related Issues & Epics

- **Base Template**: [semicolon-devteam/command-center#129](https://github.com/semicolon-devteam/command-center/issues/129) - DDD 기반 도메인 중심 아키텍처 개편
- **Leader Domain**: [semicolon-devteam/command-center#134](https://github.com/semicolon-devteam/command-center/issues/134) - LEADER · 팀 리더 도메인 관리
- **PartTimer Domain**: [semicolon-devteam/command-center#135](https://github.com/semicolon-devteam/command-center/issues/135) - PART_TIMER · 파트타이머 도메인 관리
- **Contact Domain**: [semicolon-devteam/command-center#149](https://github.com/semicolon-devteam/command-center/issues/149) - CONTACT · 외부 문의 도메인 관리

### Design Resources

- **Figma (People Page)**: https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=12-1103
- **Figma (Contact Page)**: https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=29-248
