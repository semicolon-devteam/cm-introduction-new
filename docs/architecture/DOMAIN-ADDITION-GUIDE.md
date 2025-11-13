# 도메인 추가 가이드

> DDD 기반 도메인 중심 아키텍처에서 새로운 도메인을 추가하는 방법

## 📋 목차

- [개요](#개요)
- [도메인 추가 체크리스트](#도메인-추가-체크리스트)
- [단계별 가이드](#단계별-가이드)
- [실전 예시](#실전-예시)
- [베스트 프랙티스](#베스트-프랙티스)

---

## 개요

이 가이드는 cm-template 프로젝트에 새로운 도메인을 추가할 때 따라야 할 표준 프로세스를 제공합니다.

### 도메인이란?

도메인은 비즈니스 기능 단위로 관련된 코드를 응집시킨 디렉토리입니다.

**예시**:
- `posts/` - 게시글 관리 도메인
- `auth/` - 인증 도메인
- `dashboard/` - 대시보드 도메인
- `profile/` - 프로필 관리 도메인

---

## 도메인 추가 체크리스트

### ✅ Phase 1: 계획
- [ ] 도메인 이름 정의 (kebab-case)
- [ ] 도메인 책임 범위 명확화
- [ ] 필요한 페이지 라우트 정의
- [ ] UI 컴포넌트 목록 작성
- [ ] 필요한 hooks 파악

### ✅ Phase 2: 디렉토리 구조 생성
- [ ] `src/app/{domain}/` 디렉토리 생성
- [ ] `_components/` 디렉토리 생성 (선택적)
- [ ] `_hooks/` 디렉토리 생성 (선택적)
- [ ] `types/` 디렉토리 생성 (선택적)

### ✅ Phase 3: 페이지 구현
- [ ] `page.tsx` 생성
- [ ] Development Philosophy 주석 추가
- [ ] Server/Client Component 선택
- [ ] Import order 규칙 준수

### ✅ Phase 4: 컴포넌트 분리
- [ ] 도메인 컴포넌트 생성 (`_components/`)
- [ ] Barrel export (`index.ts`) 작성
- [ ] Props 인터페이스 정의
- [ ] TypeScript 타입 안정성 확보

### ✅ Phase 5: Hooks 구현
- [ ] 도메인 hooks 생성 (`_hooks/`)
- [ ] Barrel export (`index.ts`) 작성
- [ ] API Client 연동
- [ ] 에러 핸들링 구현

### ✅ Phase 6: 품질 검증
- [ ] TypeScript 체크 (`npm run type-check`)
- [ ] ESLint 검증 통과
- [ ] 빌드 성공 (`npm run build`)
- [ ] 코드 리뷰 준비

---

## 단계별 가이드

### Step 1: 도메인 디렉토리 생성

```bash
# 기본 구조
mkdir -p src/app/{domain-name}/_components
mkdir -p src/app/{domain-name}/_hooks

# 예시: notifications 도메인
mkdir -p src/app/notifications/_components
mkdir -p src/app/notifications/_hooks
```

### Step 2: page.tsx 생성

```typescript
// src/app/notifications/page.tsx

/**
 * 알림 페이지
 * Development Philosophy:
 * - Server Component for SSR
 * - Domain-driven structure with _components
 * - Clean separation of concerns
 */

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@lib/supabase/server';

import { NotificationsHeader, NotificationsList } from './_components';

export default async function NotificationsPage() {
  // 서버에서 인증 상태 확인
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NotificationsHeader />
      <NotificationsList />
    </div>
  );
}
```

### Step 3: 도메인 컴포넌트 생성

```typescript
// src/app/notifications/_components/NotificationsHeader.tsx

/**
 * 알림 페이지 헤더
 * - 제목 및 설명
 * - 전체 읽음 처리 버튼
 */

import { Button } from '@atoms/Button';

export function NotificationsHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">알림</h1>
        <p className="text-muted-foreground">최신 알림을 확인하세요</p>
      </div>
      <Button variant="outline">전체 읽음</Button>
    </div>
  );
}
```

```typescript
// src/app/notifications/_components/NotificationsList.tsx

'use client';

/**
 * 알림 목록 컴포넌트
 * - 알림 카드 렌더링
 * - 읽음/안읽음 상태 관리
 */

import { Card } from '@atoms/Card';

import { useNotifications } from '../_hooks';

export function NotificationsList() {
  const { notifications, isLoading } = useNotifications();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id}>
          {/* 알림 내용 */}
        </Card>
      ))}
    </div>
  );
}
```

```typescript
// src/app/notifications/_components/index.ts

/**
 * Notifications domain components barrel export
 */

export { NotificationsHeader } from './NotificationsHeader';
export { NotificationsList } from './NotificationsList';
```

### Step 4: 도메인 Hooks 생성

```typescript
// src/app/notifications/_hooks/useNotifications.ts

'use client';

import { useState, useEffect } from 'react';

import { notificationsClient } from '@/api-clients';

import type { Notification } from '@models/notifications.types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await notificationsClient.getNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchNotifications();
  }, []);

  return { notifications, isLoading, error };
}
```

```typescript
// src/app/notifications/_hooks/index.ts

/**
 * Notifications domain hooks barrel export
 */

export { useNotifications } from './useNotifications';
```

### Step 5: Import Order 규칙 준수

ESLint import order 규칙:
```
1. External imports (react, next, etc.)
2. Internal imports (@/* aliases)
3. Relative imports (./_components, ./_hooks)
4. Type imports (type { ... })
```

**올바른 예시**:
```typescript
import { useState } from 'react';

import { Button } from '@atoms/Button';
import { createServerSupabaseClient } from '@lib/supabase/server';

import { NotificationsHeader, NotificationsList } from './_components';
import { useNotifications } from './_hooks';

import type { Notification } from '@models/notifications.types';
```

### Step 6: 빌드 및 검증

```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 검증
npm run lint

# 프로덕션 빌드
npm run build
```

---

## 실전 예시

### 예시 1: posts 도메인 (Client Component)

```
src/app/posts/
├── _components/
│   ├── PostsHeader.tsx          # 페이지 헤더
│   ├── PostsFilter.tsx          # 정렬 필터
│   ├── PostsList.tsx            # 게시글 목록
│   ├── PostsEmptyState.tsx      # 빈 상태
│   ├── PostsLoadingState.tsx    # 로딩 상태
│   ├── PostsErrorState.tsx      # 에러 상태
│   └── index.ts                 # Barrel export
├── _hooks/
│   ├── usePosts.ts              # 게시글 목록 조회
│   ├── usePost.ts               # 게시글 상세 조회
│   └── index.ts                 # Barrel export
└── page.tsx                     # 'use client' (동적 데이터)
```

**특징**:
- Client Component (`'use client'`)
- 6개 컴포넌트로 UI 분리
- 2개 hooks로 데이터 관리
- 상태별 UI 처리 (loading, empty, error)

### 예시 2: auth 도메인 (Server Component)

```
src/app/auth/
├── _components/
│   ├── AuthLayout.tsx           # 공통 레이아웃
│   └── index.ts                 # Barrel export
├── login/
│   └── page.tsx                 # Server Component
└── register/
    └── page.tsx                 # Server Component
```

**특징**:
- Server Component (SSR)
- 공통 레이아웃 컴포넌트로 중복 제거
- 서브 라우트 구조 (login, register)

### 예시 3: dashboard 도메인 (Server Component)

```
src/app/dashboard/
├── _components/
│   ├── DashboardHeader.tsx      # 헤더
│   ├── ProfileCard.tsx          # 프로필 카드
│   ├── ActivityCard.tsx         # 활동 카드
│   ├── QuickActionsCard.tsx     # 빠른 액션
│   ├── NewsCard.tsx             # 뉴스 카드
│   └── index.ts                 # Barrel export
└── page.tsx                     # Server Component
```

**특징**:
- Server Component (SSR)
- 5개 카드 컴포넌트로 분리
- Hooks 없음 (서버 데이터 페칭)

### 예시 4: profile 도메인 (Hybrid)

```
src/app/profile/
├── _components/
│   ├── ProfileHeader.tsx        # 헤더
│   ├── ProfileInfoCard.tsx      # 정보 카드
│   ├── ProfileContent.tsx       # 콘텐츠 (탭)
│   └── index.ts                 # Barrel export
└── page.tsx                     # Server Component
```

**특징**:
- Server Component (page.tsx)
- ProfileContent는 Client Component 포함 (ProfileTabs)
- 3개 컴포넌트로 단순 분리

---

## 베스트 프랙티스

### 1. 도메인 명명 규칙

✅ **좋은 예시**:
- `posts/` - 명확하고 직관적
- `notifications/` - 비즈니스 도메인 반영
- `settings/` - 단일 책임

❌ **나쁜 예시**:
- `post-list/` - 너무 구체적 (posts로 충분)
- `user-profile-management/` - 너무 길고 복잡
- `misc/` - 책임 범위 불명확

### 2. 컴포넌트 분리 기준

**분리해야 할 때**:
- 재사용 가능한 UI 블록
- 독립적인 책임을 가진 섹션
- 50줄 이상의 JSX 블록

**분리하지 않아도 될 때**:
- 단순한 래퍼 (1-2줄)
- 한 번만 사용되는 작은 요소
- 과도하게 작은 단위 (원자 단위는 atoms/)

### 3. Server vs Client Component 선택

**Server Component 선택 시**:
- 초기 데이터 페칭 (SSR)
- SEO가 중요한 페이지
- 인증 체크 및 리다이렉트
- 정적 콘텐츠

**Client Component 선택 시**:
- 사용자 인터랙션 (버튼 클릭, 폼 입력)
- useState, useEffect 등 React hooks 사용
- 실시간 데이터 업데이트
- 동적 UI 상태 관리

### 4. Hooks 작성 가이드

**도메인 Hooks** (`_hooks/`):
```typescript
// ✅ 도메인 전용 - posts/_hooks/usePosts.ts
export function usePosts(params: GetPostsParams) {
  // posts 도메인에서만 사용
}
```

**전역 Hooks** (`src/hooks/`):
```typescript
// ✅ 여러 도메인에서 공유 - src/hooks/useAuth.ts
export function useAuth() {
  // auth, dashboard, profile 등에서 사용
}
```

### 5. 타입 정의 위치

**도메인 타입** (`_types/` 또는 컴포넌트 내부):
```typescript
// src/app/notifications/_components/NotificationCard.tsx
interface NotificationCardProps {
  notification: Notification;
  onRead: () => void;
}
```

**공유 타입** (`src/models/`):
```typescript
// src/models/notifications.types.ts
export interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
```

### 6. Import 최적화

**Barrel Export 활용**:
```typescript
// ✅ 깔끔한 import
import { NotificationsHeader, NotificationsList } from './_components';

// ❌ 개별 import
import { NotificationsHeader } from './_components/NotificationsHeader';
import { NotificationsList } from './_components/NotificationsList';
```

### 7. 에러 처리 패턴

```typescript
// _components/NotificationsErrorState.tsx
interface NotificationsErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function NotificationsErrorState({ message, onRetry }: NotificationsErrorStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">{message}</p>
      <Button onClick={onRetry}>다시 시도</Button>
    </div>
  );
}
```

### 8. 로딩 및 빈 상태 처리

```typescript
// page.tsx에서 상태별 렌더링
if (isLoading) {
  return (
    <CommunityLayout>
      <NotificationsLoadingState />
    </CommunityLayout>
  );
}

if (notifications.length === 0) {
  return (
    <CommunityLayout>
      <NotificationsEmptyState />
    </CommunityLayout>
  );
}
```

---

## 체크리스트 요약

새 도메인 추가 시 이 체크리스트를 참고하세요:

```markdown
## 새 도메인: {domain-name}

### 계획
- [ ] 도메인 이름: `{domain-name}/`
- [ ] 책임 범위: [설명]
- [ ] 페이지 타입: [ ] Server Component [ ] Client Component
- [ ] 필요한 컴포넌트: [목록]
- [ ] 필요한 hooks: [목록]

### 구현
- [ ] 디렉토리 생성 (`_components/`, `_hooks/`)
- [ ] `page.tsx` 작성 (Development Philosophy 포함)
- [ ] 컴포넌트 분리 및 barrel export
- [ ] Hooks 구현 및 barrel export
- [ ] Import order 규칙 준수

### 검증
- [ ] `npm run type-check` 통과
- [ ] `npm run lint` 통과
- [ ] `npm run build` 성공
- [ ] 코드 리뷰 완료
```

---

## 참고 자료

- [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md) - DDD 아키텍처 전체 개요
- [DOMAIN-STRUCTURE.md](./DOMAIN-STRUCTURE.md) - 도메인 구조 상세 가이드
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 컨텍스트 및 규칙

---

## 문의 및 피드백

도메인 추가 과정에서 문제가 발생하거나 가이드 개선 제안이 있다면:
- GitHub Issues에 등록
- 팀 채널에서 논의
- CLAUDE.md 업데이트 제안
