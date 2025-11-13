# 기술 스택 가이드

## 🎯 기술 스택 선정 기준

### 핵심 원칙

1. **개발자 경험** (DX) - 생산성과 유지보수성
2. **성능** - 빠른 로딩과 반응성
3. **확장성** - 기능 추가와 스케일링 용이성
4. **커뮤니티** - 활발한 생태계와 지원
5. **타입 안정성** - TypeScript 완전 지원

## 🏗️ 프론트엔드 스택

### Next.js 15.1.4

**선정 이유:**

- React 19 지원으로 최신 기능 활용
- App Router로 향상된 라우팅
- Server Components로 성능 최적화
- Built-in 이미지 최적화
- Vercel 배포 최적화

**핵심 기능:**

```typescript
// app/posts/[id]/page.tsx
export default async function PostPage({
  params
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id);
  return <PostDetail post={post} />;
}
```

### TypeScript 5.x

**설정:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Tailwind CSS 3.4.1

**설정:**

```javascript
// tailwind.config.ts
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        // 커뮤니티 브랜드 색상
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
```

## 🎨 UI 라이브러리

### Shadcn/ui

**설치 및 설정:**

```bash
# 초기 설정
npx shadcn-ui@latest init

# 컴포넌트 추가
npx shadcn-ui@latest add button card dialog form
```

**컴포넌트 커스터마이징:**

```typescript
// components/ui/button.tsx
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Radix UI (Shadcn/ui 기반)

**헤드리스 컴포넌트 활용:**

```typescript
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Toast from "@radix-ui/react-toast";
```

## 📦 상태 관리

### Redux Toolkit

**Store 설정:**

```typescript
// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import uiReducer from "./slices/ui.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Slice 예시:**

```typescript
// store/slices/user.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/fetch", async (userId: string) => {
  return await UserService.getUser(userId);
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      });
  },
});
```

### TanStack React Query

**설정:**

```typescript
// lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Custom Hook:**

```typescript
// hooks/queries/use-posts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePosts = (params?: GetPostsParams) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => PostService.getPosts(params),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PostService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
```

## 🗄️ 백엔드 (Supabase)

### Supabase 클라이언트 설정

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
```

### Server-Side 클라이언트

```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
};
```

### 타입 생성

```bash
# Supabase 타입 자동 생성
npx supabase gen types typescript --project-id [project-id] > lib/supabase/database.types.ts
```

## 🔧 개발 도구

### ESLint 설정

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier 설정

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Husky + lint-staged

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```bash
# Husky 설정
npx husky-init && npm install
npx husky add .husky/pre-commit "npx lint-staged"
```

## 📚 커뮤니티 코어 패키지

### @team-semicolon/community-core

**통합 방법:**

```typescript
// hooks/use-community-core.ts
import { useAuth, usePermission, usePostQuery, useUserQuery } from "@team-semicolon/community-core";

// Supabase와 통합
export const useSupabaseAuth = () => {
  const coreAuth = useAuth();
  const supabase = createClient();

  return {
    ...coreAuth,
    login: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data) {
        coreAuth.setUser(data.user);
      }
      return { data, error };
    },
  };
};
```

## 🧪 테스팅 스택

### Vitest + React Testing Library

```typescript
// __tests__/components/PostCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PostCard } from '@/components/molecules/PostCard';

describe('PostCard', () => {
  it('renders post title', () => {
    render(<PostCard title="Test Post" />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });
});
```

### Playwright (E2E)

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("/auth/login");
  await page.fill("[name=email]", "test@example.com");
  await page.fill("[name=password]", "password");
  await page.click("[type=submit]");

  await expect(page).toHaveURL("/dashboard");
});
```

## 📊 분석 및 모니터링

### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Sentry

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.BrowserTracing()],
});
```

## 🚀 배포 및 인프라

### Vercel 배포

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["icn1"], // 서울 리전
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

## 📦 패키지 관리

### 필수 Dependencies

```json
{
  "dependencies": {
    "next": "^15.1.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "@reduxjs/toolkit": "^2.x",
    "react-redux": "^9.x",
    "@tanstack/react-query": "^5.x",
    "@team-semicolon/community-core": "^1.9.0",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

### 개발 Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "eslint": "^8.x",
    "eslint-config-next": "^15.x",
    "prettier": "^3.x",
    "husky": "^9.x",
    "lint-staged": "^15.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "vitest": "^2.x",
    "@vitest/ui": "^2.x",
    "jsdom": "^25.x"
  }
}
```

## 🔄 버전 관리 전략

### Semantic Versioning

```
MAJOR.MINOR.PATCH
1.0.0 - 첫 정식 릴리즈
1.1.0 - 새 기능 추가
1.1.1 - 버그 수정
```

### Git Branch 전략

```
main          → 프로덕션
├── develop   → 개발 통합
    ├── feature/[name]  → 기능 개발
    ├── fix/[name]      → 버그 수정
    └── refactor/[name] → 리팩토링
```

## 📝 코드 컨벤션

### 네이밍 컨벤션

```typescript
// 컴포넌트: PascalCase
export const PostCard = () => {};

// 함수: camelCase
export const getUserPosts = () => {};

// 상수: UPPER_SNAKE_CASE
export const MAX_POST_LENGTH = 5000;

// 타입/인터페이스: PascalCase
interface PostCardProps {}
type UserRole = "admin" | "user";

// 파일명
components / PostCard.tsx; // 컴포넌트
hooks / use - posts.ts; // 훅
lib / supabase.ts; // 유틸리티
types / post.types.ts; // 타입 정의
```

### Import 순서

```typescript
// 1. React/Next
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. 외부 라이브러리
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";

// 3. 내부 모듈
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/use-posts";

// 4. 타입
import type { Post } from "@/types";

// 5. 스타일
import styles from "./PostCard.module.css";
```

---

_이 문서는 프로젝트의 기술 스택 선정과 설정을 안내합니다._
_최종 수정: 2025-09-17_
