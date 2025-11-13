# 📚 @team-semicolon/community-core v2.0 통합 가이드

> cm-template 프로젝트를 위한 공식 통합 가이드라인

## 🎯 Overview

`@team-semicolon/community-core` v2.0은 이전 버전의 모든 이슈를 해결하고, 더 가볍고 효율적인 아키텍처로 재설계되었습니다.

### 주요 변경사항

- ✅ **Redux 제거**: Zustand 기반 경량 상태 관리
- ✅ **UI 컴포넌트 제거**: 순수 로직 중심
- ✅ **번들 크기 75% 감소**
- ✅ **Next.js 15 & React 19 완벽 호환**

## 🚀 Quick Start

### 1. 설치

```bash
npm install @team-semicolon/community-core@^2.0.0 zustand@^4.5.0
```

### 2. Provider 설정

**app/layout.tsx** (Next.js App Router):

```typescript
import { CommunityProvider } from '@team-semicolon/community-core';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <CommunityProvider
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
        >
          {children}
        </CommunityProvider>
      </body>
    </html>
  );
}
```

## 📦 Core Features Integration

### 1. 인증 시스템 (Authentication)

```typescript
import {
  useAuth,
  useSupabaseAuth,
  SupabaseAuthClientAdapter
} from '@team-semicolon/community-core';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 어댑터 설정
const authAdapter = new SupabaseAuthClientAdapter(supabase);

// 컴포넌트에서 사용
function LoginComponent() {
  const { user, signIn, signOut, isLoading } = useAuth();

  // 또는 Supabase 전용 훅 사용
  const auth = useSupabaseAuth(authAdapter, {
    onLoginSuccess: () => router.push('/dashboard'),
    onLoginError: (error) => toast.error(error.message)
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn({ email, password });
      // 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* 폼 구현 */}
    </form>
  );
}
```

### 2. 폼 검증 (Validation)

```typescript
import {
  validateEmail,
  validatePassword,
  validateNickname
} from '@team-semicolon/community-core';

function SignupForm() {
  const [errors, setErrors] = useState({});

  const handleValidation = (field: string, value: string) => {
    switch (field) {
      case 'email':
        const emailResult = validateEmail(value);
        if (!emailResult.valid) {
          setErrors(prev => ({ ...prev, email: emailResult.error }));
        }
        break;

      case 'password':
        const pwResult = validatePassword(value);
        if (!pwResult.valid) {
          setErrors(prev => ({ ...prev, password: pwResult.error }));
        }
        break;

      case 'nickname':
        const nickResult = validateNickname(value);
        if (!nickResult.valid) {
          setErrors(prev => ({ ...prev, nickname: nickResult.error }));
        }
        break;
    }
  };

  return (
    <form>
      <input
        type="email"
        onChange={(e) => handleValidation('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      {/* 나머지 필드들 */}
    </form>
  );
}
```

### 3. 권한 관리 (Permissions)

```typescript
import {
  usePermission,
  USER_ROLES,
  USER_LEVELS,
  checkRolePermission,
  checkLevelPermission
} from '@team-semicolon/community-core';

function ProtectedComponent() {
  const { hasPermission, isAdmin, userLevel } = usePermission();

  // Hook 기반 권한 체크
  if (!hasPermission) {
    return <div>접근 권한이 없습니다.</div>;
  }

  // 유틸리티 함수로 권한 체크
  const canEdit = checkRolePermission(user.role, USER_ROLES.EDITOR);
  const canAccessPremium = checkLevelPermission(user.level, USER_LEVELS.PREMIUM);

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {canEdit && <EditButton />}
      {canAccessPremium && <PremiumContent />}
    </div>
  );
}
```

### 4. 상태 관리 (State Management with Zustand)

```typescript
import { useAuthStore, useUIStore } from '@team-semicolon/community-core';

function AppHeader() {
  // 인증 상태
  const { user, isAuthenticated, logout } = useAuthStore();

  // UI 상태
  const { theme, toggleTheme, showModal } = useUIStore();

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>안녕하세요, {user.name}님</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <button onClick={() => showModal('login')}>로그인</button>
      )}

      <button onClick={toggleTheme}>
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
    </header>
  );
}
```

### 5. 데이터 페칭 (React Query Integration)

```typescript
import {
  useUser,
  usePosts,
  useComments,
  useInfiniteScroll
} from '@team-semicolon/community-core';

function PostList() {
  // 기본 데이터 페칭
  const { data: posts, isLoading, error, refetch } = usePosts({
    page: 1,
    limit: 20,
    category: 'notice'
  });

  // 무한 스크롤
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteScroll({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  if (isLoading) return null; // 글로벌 로더가 표시됨
  if (error) return <ErrorComponent error={error} />;

  return (
    <div>
      {posts?.map(post => <PostItem key={post.id} post={post} />)}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? '로딩 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
}
```

### 6. 실시간 기능 (Realtime Features)

```typescript
import {
  useRealtimeChat,
  useRealtimePresence,
  useRealtimeUpdates
} from '@team-semicolon/community-core';

function ChatRoom({ roomId }: { roomId: string }) {
  // 실시간 채팅
  const {
    messages,
    sendMessage,
    isConnected,
    typingUsers
  } = useRealtimeChat(roomId);

  // 사용자 프레전스
  const { onlineUsers, updatePresence } = useRealtimePresence(roomId);

  // 실시간 업데이트 구독
  useRealtimeUpdates('posts', (payload) => {
    console.log('New post:', payload.new);
    // UI 업데이트
  });

  return (
    <div>
      <div>온라인: {onlineUsers.length}명</div>

      <div className="messages">
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}

        {typingUsers.length > 0 && (
          <div>{typingUsers.join(', ')}님이 입력 중...</div>
        )}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
```

### 7. 유틸리티 함수 활용

```typescript
import {
  formatDate,
  formatNumber,
  formatCurrency,
  debounce,
  throttle,
  retry
} from '@team-semicolon/community-core';

function UtilityExamples() {
  // 포맷팅
  const formattedDate = formatDate(new Date(), 'ko-KR');
  const formattedNumber = formatNumber(1234567); // "1,234,567"
  const formattedPrice = formatCurrency(50000, 'KRW'); // "₩50,000"

  // 성능 최적화
  const debouncedSearch = debounce((term: string) => {
    searchAPI(term);
  }, 500);

  const throttledScroll = throttle(() => {
    updateScrollPosition();
  }, 100);

  // 네트워크 재시도
  const fetchWithRetry = retry(async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed');
    return response.json();
  }, { retries: 3, delay: 1000 });

  return (
    <div>
      <input onChange={(e) => debouncedSearch(e.target.value)} />
      <div onScroll={throttledScroll}>스크롤 영역</div>
      <div>날짜: {formattedDate}</div>
      <div>가격: {formattedPrice}</div>
    </div>
  );
}
```

## 🎨 UI 컴포넌트 구현 가이드

v2.0부터 UI 컴포넌트는 제공하지 않습니다. 대신 다음 방법을 권장합니다:

### shadcn/ui 사용 (권장)

```bash
# shadcn/ui 설치
npx shadcn-ui@latest init

# 필요한 컴포넌트 추가
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

### 커스텀 컴포넌트 예시

```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          {
            'bg-primary text-white hover:bg-primary-dark': variant === 'primary',
            'bg-secondary text-gray-900 hover:bg-secondary-dark': variant === 'secondary',
            'hover:bg-gray-100': variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'opacity-50 cursor-not-allowed': loading
          },
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

## 📋 마이그레이션 체크리스트

### v1.x에서 v2.0으로

- [ ] Redux 관련 코드 제거
  - [ ] `@reduxjs/toolkit` 언인스톨
  - [ ] `react-redux` 언인스톨
  - [ ] Redux store 설정 제거

- [ ] Zustand로 상태 관리 마이그레이션
  - [ ] `zustand` 설치
  - [ ] Store hooks로 교체

- [ ] UI 컴포넌트 교체
  - [ ] 기존 코어 패키지 UI 컴포넌트 import 제거
  - [ ] 자체 UI 컴포넌트 구현 또는 UI 라이브러리 도입

- [ ] Import 경로 업데이트
  - [ ] `/dist/` 경로 제거
  - [ ] 새로운 import 패턴 적용

- [ ] Provider 교체
  - [ ] Redux Provider → CommunityProvider

## 🐛 트러블슈팅

### 1. TypeScript 타입 에러

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // Next.js 15의 경우
    "paths": {
      "@team-semicolon/community-core": [
        "./node_modules/@team-semicolon/community-core/dist/index"
      ]
    }
  }
}
```

### 2. Supabase 연결 실패

```typescript
// 환경 변수 확인
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

// 디버깅
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

### 3. Hydration 에러

```typescript
// 클라이언트 전용 컴포넌트로 래핑
"use client";

import dynamic from "next/dynamic";

const ClientOnlyAuth = dynamic(() => import("./ClientAuth"), { ssr: false });
```

## 📊 성능 최적화 팁

### 1. 번들 크기 최적화

```typescript
// ✅ 필요한 것만 import
import { useAuth } from "@team-semicolon/community-core/hooks";

// ❌ 전체 패키지 import 피하기
import * as CommunityCore from "@team-semicolon/community-core";
```

### 2. React Query 최적화

```typescript
// 캐싱 전략
const { data } = usePosts({
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
  refetchOnWindowFocus: false, // 포커스 시 재조회 비활성화
});
```

### 3. 실시간 연결 관리

```typescript
// 컴포넌트 언마운트 시 정리
useEffect(() => {
  const subscription = subscribeToChannel();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## 🔗 추가 리소스

- [API Reference](https://github.com/team-semicolon/community-core/docs/API_REFERENCE.md)
- [Examples](https://github.com/team-semicolon/community-core/docs/USAGE_EXAMPLES.md)
- [Migration Guide](https://github.com/team-semicolon/community-core/docs/MIGRATION.md)
- [GitHub Issues](https://github.com/team-semicolon/community-core/issues)

## 📞 지원

문제가 있으신가요?

- **GitHub Issues**: 버그 리포트 및 기능 요청
- **GitHub Discussions**: 질문 및 토론
- **Email**: dev@team-semicolon.com

---

> 📝 이 가이드는 @team-semicolon/community-core v2.0.0 기준으로 작성되었습니다.
>
> 최종 업데이트: 2025-01-19
