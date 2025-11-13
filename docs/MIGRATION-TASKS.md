# Community Core v3.0 Migration Tasks

> 실행 가능한 마이그레이션 태스크와 체크리스트
> **Start Date**: 2024-09-23
> **Target Version**: @team-semicolon/community-core v3.0.0

## 📋 Executive Summary

기존 cm-land, cm-cointalk 프로젝트의 공통 기능을 추출하고 최적화하여 새로운 커뮤니티 코어 패키지 v3.0을 구축합니다.

**핵심 목표:**

- 코드 재사용률 70% 이상
- 번들 크기 30% 감소
- 개발 속도 50% 향상

---

## 🎯 Week 1: Foundation Setup

### Day 1-2: 프로젝트 초기 설정

```bash
# 실행 명령어
npm install zustand immer @tanstack/react-query @tanstack/query-devtools
npm install @supabase/supabase-js @supabase/ssr
npm install zod date-fns clsx
npm uninstall lodash moment redux @reduxjs/toolkit  # 제거
```

**Tasks:**

- [ ] 패키지 설치 및 정리
- [ ] `tsconfig.json` 경로 별칭 설정
- [ ] `.env.local` 환경변수 구성
- [ ] 기본 폴더 구조 생성

### Day 3-4: 핵심 설정 파일 작성

**파일 생성 목록:**

```typescript
// src/shared/lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

```typescript
// src/shared/lib/supabase/client.ts
import { createBrowserClient as createClient } from "@supabase/ssr";

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

```typescript
// src/shared/lib/supabase/server.ts
import { createServerClient as createClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerClient() {
  const cookieStore = cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    },
  );
}
```

**Tasks:**

- [ ] Query Client 설정
- [ ] Supabase Client (Browser) 설정
- [ ] Supabase Client (Server) 설정
- [ ] Provider 컴포넌트 작성

### Day 5-7: 인증 시스템 구현

**구현 항목:**

1. **Server Actions** (`src/features/auth/actions/auth.actions.ts`)

```typescript
"use server";

export async function signIn(email: string, password: string) {
  // httpOnly 쿠키 기반 인증
}

export async function signOut() {
  // 로그아웃 처리
}

export async function getSession() {
  // 세션 확인
}
```

2. **Auth Store** (`src/features/auth/stores/auth.store.ts`)

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}
```

3. **Auth Hooks** (`src/features/auth/hooks/useAuth.ts`)

```typescript
export function useAuth() {
  // 인증 상태 관리
}

export function useSession() {
  // 세션 관리
}
```

**Tasks:**

- [ ] Server Actions 구현
- [ ] Zustand Auth Store 구현
- [ ] useAuth Hook 구현
- [ ] LoginForm 컴포넌트
- [ ] SignupForm 컴포넌트
- [ ] Middleware 인증 체크

---

## 🔄 Week 2: Common Service Extraction

### Day 8-9: BaseService 구현

```typescript
// src/core/services/base.service.ts
export abstract class BaseService {
  protected supabase: SupabaseClient;

  constructor() {
    this.supabase = createBrowserClient();
  }

  protected async handleRequest<T>(request: Promise<PostgrestResponse<T>>): Promise<T> {
    const { data, error } = await request;
    if (error) throw error;
    return data;
  }
}
```

**Tasks:**

- [ ] BaseService 클래스 작성
- [ ] 에러 핸들링 로직
- [ ] 타입 안전성 보장
- [ ] 유닛 테스트 작성

### Day 10-11: Board Service 마이그레이션

**추출할 공통 기능:**

```typescript
// src/features/board/services/board.service.ts
export class BoardService extends BaseService {
  async getList(page: number, limit: number = 20) {
    // 게시판 목록
  }

  async getById(id: number) {
    // 게시판 상세
  }

  async create(data: CreateBoardDto) {
    // 게시판 생성
  }

  async update(id: number, data: UpdateBoardDto) {
    // 게시판 수정
  }

  async delete(id: number) {
    // 게시판 삭제
  }
}
```

**Tasks:**

- [ ] BoardService 구현
- [ ] TanStack Query Hooks
- [ ] Board 컴포넌트 리팩토링
- [ ] 타입 정의

### Day 12-14: Comment & User Service

**Tasks:**

- [ ] CommentService 추출
- [ ] UserService 추출
- [ ] NotificationService 추출
- [ ] 공통 DTO/Types 정의

---

## 💬 Week 3: Realtime Features

### Day 15-16: Realtime 기반 구조

```typescript
// src/features/realtime/hooks/useRealtimeSubscription.ts
export function useRealtimeSubscription(channel: string, options: RealtimeOptions) {
  // Supabase Realtime 구독 로직
}
```

**Tasks:**

- [ ] Realtime Hook 구현
- [ ] Channel 관리 로직
- [ ] 재연결 처리
- [ ] 에러 핸들링

### Day 17-19: 채팅 시스템

```typescript
// src/features/realtime/chat/services/chat.service.ts
export class ChatService extends BaseService {
  async sendMessage(roomId: string, message: string) {
    // 메시지 전송
  }

  subscribeToRoom(roomId: string, onMessage: (msg: Message) => void) {
    // 채팅방 구독
  }
}
```

**Tasks:**

- [ ] ChatService 구현
- [ ] ChatRoom 컴포넌트
- [ ] Message 컴포넌트
- [ ] 타이핑 인디케이터

### Day 20-21: 알림 시스템

**구현 내용:**

1. **Database Triggers**

```sql
-- Supabase SQL Editor에서 실행
CREATE OR REPLACE FUNCTION notify_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, data)
  VALUES (NEW.user_id, 'comment', NEW);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

2. **Notification Service**

```typescript
export class NotificationService extends BaseService {
  subscribeToUserNotifications(userId: string) {
    // 사용자별 알림 구독
  }
}
```

**Tasks:**

- [ ] DB Trigger 설정
- [ ] NotificationService 구현
- [ ] Toast 컴포넌트
- [ ] 브라우저 알림 통합

---

## ⚡ Week 4: Optimization

### Day 22-23: 코드 경량화

**최적화 작업:**

```javascript
// Before (Lodash)
import _ from "lodash";
const result = _.debounce(fn, 300);

// After (Native)
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

**Tasks:**

- [ ] Lodash 제거 → Native ES6
- [ ] Moment.js 제거 → date-fns
- [ ] 중복 코드 제거
- [ ] Tree Shaking 최적화

### Day 24-25: 번들 최적화

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ["@team-semicolon/community-core", "date-fns"],
  },
};
```

**Tasks:**

- [ ] Bundle Analyzer 설치
- [ ] Dynamic Imports 적용
- [ ] Code Splitting
- [ ] 폰트 최적화

### Day 26-28: 성능 테스트

**측정 항목:**

| 지표          | 이전  | 목표  | 실제 |
| ------------- | ----- | ----- | ---- |
| 초기 번들     | 800KB | 500KB | -    |
| FCP           | 2.5s  | 1.8s  | -    |
| TTI           | 4.5s  | 3.5s  | -    |
| 코드 재사용률 | 20%   | 70%   | -    |

**Tasks:**

- [ ] Lighthouse 테스트
- [ ] Bundle 크기 분석
- [ ] 로딩 성능 테스트
- [ ] 메모리 사용량 체크

---

## 📦 Community Core Package

### Package 구조

```
@team-semicolon/community-core/
├── src/
│   ├── services/
│   │   ├── base.service.ts
│   │   ├── board.service.ts
│   │   ├── comment.service.ts
│   │   └── user.service.ts
│   ├── stores/
│   │   ├── auth.store.ts
│   │   └── ui.store.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useRealtime.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── package.json
└── README.md
```

### Package.json

```json
{
  "name": "@team-semicolon/community-core",
  "version": "3.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./services": "./dist/services/index.js",
    "./hooks": "./dist/hooks/index.js",
    "./stores": "./dist/stores/index.js"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    "@supabase/supabase-js": "^2.45.0"
  }
}
```

---

## 🚦 마이그레이션 체크리스트

### Pre-Migration

- [ ] 현재 프로젝트 백업
- [ ] 의존성 분석 완료
- [ ] 팀 교육 자료 준비
- [ ] 테스트 환경 구축

### During Migration

- [ ] Week 1: Foundation ✅
- [ ] Week 2: Services ⏳
- [ ] Week 3: Realtime ⏳
- [ ] Week 4: Optimization ⏳

### Post-Migration

- [ ] 성능 벤치마크
- [ ] 문서화 완료
- [ ] 팀 피드백 수집
- [ ] v3.1 계획 수립

---

## 📊 성공 지표

### 정량적 지표

| 항목                | 목표      | 측정 방법        |
| ------------------- | --------- | ---------------- |
| **코드 중복**       | 80% → 20% | SonarQube        |
| **번들 크기**       | 30% 감소  | Webpack Analyzer |
| **개발 시간**       | 50% 단축  | JIRA 통계        |
| **테스트 커버리지** | 80% 이상  | Vitest Coverage  |

### 정성적 지표

- 개발자 만족도 향상
- 유지보수 용이성 개선
- 신규 기능 추가 속도 향상
- 버그 발생률 감소

---

## 🔧 문제 해결 가이드

### 자주 발생하는 이슈

**1. Hydration Error**

```typescript
// 해결: dynamic import with ssr: false
const Component = dynamic(() => import("./Component"), {
  ssr: false,
});
```

**2. Cookie 접근 에러**

```typescript
// 해결: Server Component에서만 cookies() 사용
import { cookies } from "next/headers";
```

**3. Zustand SSR 이슈**

```typescript
// 해결: persist 미들웨어 주의
const useStore = create(
  persist(() => ({}), {
    name: "store",
    skipHydration: true, // SSR 스킵
  }),
);
```

---

## 📚 참고 문서

- [Architecture Guide](./ARCHITECTURE-GUIDE.md)
- [Supabase Migration Guide](https://supabase.com/docs/guides/migrations)
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/upgrading)
- [TanStack Query Migration](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)

---

**Document Version**: 1.0.0
**Last Updated**: 2024-09-23
**Next Review**: 2024-10-07
