# 프로젝트 컨벤션 가이드

이 문서는 Semicolon Community Template 프로젝트의 코딩 컨벤션과 명명 규칙을 정의합니다.

## 📁 파일 및 디렉토리 명명 규칙

### React 컴포넌트 파일

**규칙**: PascalCase 사용

```
✅ 올바른 예시:
components/ui/Button.tsx
components/molecules/PostCard.tsx
components/organisms/NavigationHeader.tsx
components/templates/DashboardLayout.tsx

❌ 잘못된 예시:
components/ui/button.tsx
components/molecules/post-card.tsx
```

### Next.js 라우팅 파일

**규칙**: kebab-case 사용 (Next.js 표준)

```
✅ 올바른 예시:
app/auth/login/page.tsx
app/user-profile/page.tsx
app/api/check-nickname/route.ts

❌ 잘못된 예시:
app/auth/Login/page.tsx
app/userProfile/page.tsx
```

### Atomic Design 컴포넌트

**규칙**: PascalCase 사용, 계층별 분류

```
✅ 올바른 예시 (Atomic Design 계층):
components/atoms/Button.tsx         # 기본 UI 요소
components/molecules/FormField.tsx  # 2-3개 atoms 조합
components/organisms/LoginForm.tsx  # 복잡한 컴포넌트
components/templates/Layout.tsx     # 페이지 레이아웃

❌ 잘못된 예시 (기술적 분류 - 사용 금지):
components/client/LoginForm.tsx     # ❌ client/ 디렉토리 금지
components/server/UserList.tsx      # ❌ server/ 디렉토리 금지
components/ui/Button.tsx            # ❌ ui 대신 atoms 사용
```

### TypeScript 타입 정의

**규칙**: PascalCase.types.ts 또는 kebab-case.types.ts

```
✅ 올바른 예시:
types/User.types.ts
types/Post.types.ts
lib/supabase/database.types.ts

❌ 잘못된 예시:
types/user_types.ts
types/POST-TYPES.ts
```

### 유틸리티 및 헬퍼 파일

**규칙**: camelCase 또는 kebab-case

```
✅ 올바른 예시:
utils/formatDate.ts
utils/validate-email.ts
lib/supabase/client.ts
lib/supabase/server.ts

❌ 잘못된 예시:
utils/FormatDate.ts
utils/VALIDATE_EMAIL.ts
```

### 훅 (Hooks)

**규칙**: camelCase, 'use'로 시작

```
✅ 올바른 예시:
hooks/useAuth.ts
hooks/useDebounce.ts
hooks/useMediaQuery.ts

❌ 잘못된 예시:
hooks/UseAuth.ts
hooks/auth.ts
hooks/use-auth.ts
```

### 서비스 및 어댑터

**규칙**: PascalCase.service.ts 또는 PascalCase.adapter.ts

```
✅ 올바른 예시:
services/AuthService.ts
services/adapters/SupabaseAuth.adapter.ts

❌ 잘못된 예시:
services/auth-service.ts
services/adapters/supabase_auth_adapter.ts
```

### 서버 액션

**규칙**: kebab-case.actions.ts

```
✅ 올바른 예시:
app/actions/auth.actions.ts
app/actions/post.actions.ts

❌ 잘못된 예시:
app/actions/AuthActions.ts
app/actions/POST_ACTIONS.ts
```

### 환경 설정 파일

**규칙**: lowercase 또는 UPPERCASE (표준 관례)

```
✅ 올바른 예시:
.env.local
.env.production
next.config.js
tailwind.config.ts
tsconfig.json

❌ 잘못된 예시:
.Env.Local
NextConfig.js
```

## 📝 코드 명명 규칙

### 변수명

**규칙**: camelCase

```typescript
✅ 올바른 예시:
const userName = 'John';
let isLoading = false;
const fetchUserData = async () => {};

❌ 잘못된 예시:
const user_name = 'John';
const UserName = 'John';
const FETCH_USER_DATA = async () => {};
```

### 상수

**규칙**: UPPER_SNAKE_CASE

```typescript
✅ 올바른 예시:
const MAX_FILE_SIZE = 5242880;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

❌ 잘못된 예시:
const maxFileSize = 5242880;
const api-base-url = 'https://api.example.com';
```

### 타입 및 인터페이스

**규칙**: PascalCase

```typescript
✅ 올바른 예시:
interface User {
  id: string;
  name: string;
}

type PostStatus = 'draft' | 'published' | 'archived';

enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

❌ 잘못된 예시:
interface user {}
type post_status = '';
enum user_role {}
```

### React 컴포넌트

**규칙**: PascalCase

```typescript
✅ 올바른 예시:
export function NavigationBar() {}
export const UserProfile: React.FC = () => {}

❌ 잘못된 예시:
export function navigationBar() {}
export const user_profile = () => {}
```

### Props 타입

**규칙**: ComponentNameProps

```typescript
✅ 올바른 예시:
interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

interface UserCardProps {
  user: User;
}

❌ 잘못된 예시:
interface IButtonProps {}
interface UserCard_Props {}
interface buttonProps {}
```

## 🏗️ 프로젝트 구조

```
src/
├── app/                        # Next.js App Router (kebab-case)
│   ├── (auth)/                # Route groups
│   ├── api/                   # API routes (kebab-case)
│   └── actions/               # Server Actions (kebab-case.actions.ts)
│
├── components/                 # Atomic Design 구조 (엄격한 계층 준수)
│   ├── atoms/                 # 기본 UI 요소 (Button, Input, Card)
│   ├── molecules/             # 2-3개 atoms 조합 (FormField, UserAvatar)
│   ├── organisms/             # 복잡한 컴포넌트 (LoginForm, Navigation)
│   └── templates/             # 페이지 레이아웃 (CommunityLayout)
│
├── hooks/                      # 커스텀 훅 (camelCase, use prefix)
├── services/                   # 서비스 계층 (PascalCase.service.ts)
│   └── adapters/              # 어댑터 패턴 (PascalCase.adapter.ts)
│
├── lib/                        # 라이브러리 설정 (camelCase)
│   └── supabase/              # Supabase 클라이언트
│
├── types/                      # 타입 정의 (PascalCase.types.ts)
├── utils/                      # 유틸리티 함수 (camelCase)
└── styles/                     # 스타일 파일 (kebab-case)
```

## 🎨 CSS 및 스타일링

### CSS 클래스명

**규칙**: kebab-case (Tailwind CSS 표준)

```typescript
✅ 올바른 예시:
<div className="user-profile-card">
<button className="submit-button primary-action">

❌ 잘못된 예시:
<div className="userProfileCard">
<button className="submit_button">
```

### CSS 모듈

**규칙**: kebab-case.module.css

```
✅ 올바른 예시:
user-profile.module.css
navigation-bar.module.css

❌ 잘못된 예시:
UserProfile.module.css
navigationBar.module.css
```

## 📦 Import/Export 규칙

### Import 순서

```typescript
// 1. React/Next.js 임포트
import React from "react";
import { useRouter } from "next/navigation";

// 2. 외부 라이브러리
import { format } from "date-fns";
import { z } from "zod";

// 3. 내부 절대 경로 임포트
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/hooks/useAuth";

// 4. 상대 경로 임포트
import { formatDate } from "./utils";

// 5. 타입 임포트
import type { User } from "@/types/User.types";
```

### Export 규칙

```typescript
// Named export 선호 (유틸리티, 훅, 타입)
export { formatDate, parseDate };
export type { DateFormat };

// Default export (React 컴포넌트)
export default function UserProfile() {}

// Re-export
export { Button } from "./Button";
export * from "./types";
```

## 📝 주석 규칙

### JSDoc 주석

```typescript
/**
 * 사용자 프로필 정보를 표시하는 컴포넌트
 * @param {UserProfileProps} props - 컴포넌트 props
 * @returns {JSX.Element} 렌더링된 프로필 컴포넌트
 */
export function UserProfile(props: UserProfileProps) {}
```

### TODO 주석

```typescript
// TODO: 에러 처리 로직 추가 필요
// FIXME: 성능 최적화 필요
// NOTE: Supabase RLS 정책 확인 필요
```

## 🔄 Git 컨벤션

### 브랜치명

```
feature/add-user-authentication
bugfix/fix-login-error
hotfix/critical-security-patch
refactor/improve-performance
```

### 커밋 메시지

```
feat: 사용자 인증 기능 추가
fix: 로그인 에러 수정
refactor: 성능 최적화를 위한 코드 개선
docs: README 업데이트
style: 코드 포맷팅
test: 단위 테스트 추가
chore: 의존성 업데이트
```

## 🚀 Best Practices

### 1. 일관성 유지

- 프로젝트 전체에서 동일한 명명 규칙 적용
- 팀 내에서 합의된 컨벤션 준수

### 2. 의미있는 이름 사용

```typescript
✅ 올바른 예시:
const getUserById = (id: string) => {};
const isUserAuthenticated = true;

❌ 잘못된 예시:
const getData = (x: string) => {};
const flag = true;
```

### 3. 컴포넌트 구조화

```typescript
// 1. 임포트
// 2. 타입 정의
// 3. 컴포넌트 정의
// 4. 스타일 (필요시)
// 5. Export

interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary' }: ButtonProps) {
  return <button className={`btn btn-${variant}`}>Click me</button>;
}
```

### 4. 비동기 함수 명명

```typescript
// 'fetch', 'get', 'load', 'create', 'update', 'delete' 접두사 사용
async function fetchUserData() {}
async function createPost() {}
async function updateProfile() {}
```

### 5. Boolean 변수/함수 명명

```typescript
// 'is', 'has', 'can', 'should' 접두사 사용
const isLoading = true;
const hasPermission = false;
const canEdit = true;
const shouldUpdate = false;
```

## 📋 체크리스트

새 파일이나 컴포넌트를 생성할 때:

- [ ] 파일명이 올바른 컨벤션을 따르는가?
- [ ] 컴포넌트명이 PascalCase인가?
- [ ] Props 타입이 정의되어 있는가?
- [ ] Import 순서가 올바른가?
- [ ] 의미있는 변수명을 사용했는가?
- [ ] 필요한 주석이 추가되었는가?
- [ ] 재사용 가능하게 설계되었는가?

## 🚫 Atomic Design 안티패턴

### 절대 하지 말아야 할 것들

1. **기술적 분류 디렉토리 생성 금지**

   ```
   ❌ components/client/   # 기술적 분류 (사용 금지)
   ❌ components/server/   # 기술적 분류 (사용 금지)
   ❌ components/ui/       # 불명확한 이름 (atoms 사용)
   ```

2. **컴포넌트 계층 혼동**
   - Molecules에 복잡한 폼 넣지 않기 (→ Organisms)
   - Atoms에 상태 관리 로직 넣지 않기
   - Templates에 데이터 페칭 넣지 않기

3. **비즈니스 로직 혼합**

   ```typescript
   // ❌ 잘못된 예: UI 컴포넌트에서 직접 auth import
   import { useAuth } from "@/providers/auth-provider";

   // ✅ 올바른 예: Container 패턴 사용
   // SidebarContainer.tsx (비즈니스 로직)
   // Sidebar.tsx (순수 UI)
   ```

### Container 패턴 사용법

```typescript
// organisms/SidebarContainer.tsx - 비즈니스 로직
export function SidebarContainer() {
  const { user, signOut } = useAuth(); // 비즈니스 로직
  const data = useFetchData();          // 데이터 페칭

  return (
    <Sidebar
      user={user}
      onSignOut={signOut}
      data={data}
    />
  );
}

// organisms/Sidebar.tsx - 순수 UI
interface SidebarProps {
  user?: User;
  onSignOut?: () => void;
  data?: any;
}

export function Sidebar(props: SidebarProps) {
  // 순수 UI 로직만
  return <aside>...</aside>;
}
```

## 🔗 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React TypeScript 치트시트](https://react-typescript-cheatsheet.netlify.app/)
- [Airbnb JavaScript 스타일 가이드](https://github.com/airbnb/javascript)
- [Conventional Commits](https://www.conventionalcommits.org/)
