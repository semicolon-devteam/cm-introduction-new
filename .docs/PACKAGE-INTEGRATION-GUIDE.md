# @team-semicolon/community-core 패키지 통합 가이드

## 🎯 현재 상황

`@team-semicolon/community-core` 패키지가 이미 NPM에 배포되어 있습니다 (v2.0.0).

- NPM: https://www.npmjs.com/package/@team-semicolon/community-core
- GitHub: https://github.com/semicolon-devteam/community-core
- 버전: 2.0.0

## 📦 패키지가 제공하는 기능

### Core Hooks

1. **useAuth**: 로그인/로그아웃, 세션 관리
2. **useAuthForm**: 폼 상태 관리 및 검증
3. **usePermissionCheck**: 세분화된 권한 확인
4. **useAuthRedirect**: 인증 기반 리다이렉션
5. **useSessionSync**: 멀티탭 세션 동기화

## 🔄 통합 방법

### Option 1: 기존 패키지 사용 (추천) ✅

#### 1. 패키지 설치

```bash
npm install @team-semicolon/community-core
```

#### 2. 기존 hooks 교체

```typescript
// Before (우리가 만든 custom hook)
import { useLogin } from "@/hooks/auth";

// After (community-core 패키지)
import { useAuth } from "@team-semicolon/community-core";
```

#### 3. Adapter Pattern 사용

```typescript
// src/hooks/auth/useAuthAdapter.ts
import { useAuth } from "@team-semicolon/community-core";
import { loginAction } from "@/app/actions/auth.actions";

export function useAuthAdapter() {
  const auth = useAuth({
    onLogin: async (credentials) => {
      return await loginAction(credentials.email, credentials.password);
    },
  });

  return auth;
}
```

### Option 2: 패키지에 기여 (Contribute) 🤝

우리가 구현한 Supabase 특화 기능들을 기존 패키지에 추가:

#### 1. Fork & Clone

```bash
git clone https://github.com/semicolon-devteam/community-core.git
cd community-core
```

#### 2. 우리 기능 추가

```typescript
// src/hooks/auth/useSupabaseAuth.ts
export function useSupabaseAuth() {
  // 우리가 만든 Supabase 특화 로직
}
```

#### 3. PR 제출

- Supabase adapter 추가
- 닉네임 중복 체크 기능
- OAuth (Google, GitHub) 지원

### Option 3: 별도 패키지 생성 📦

Supabase 전용 확장 패키지 생성:

```json
{
  "name": "@team-semicolon/community-core-supabase",
  "version": "1.0.0",
  "dependencies": {
    "@team-semicolon/community-core": "^2.0.0",
    "@supabase/supabase-js": "^2.0.0"
  }
}
```

## 📊 비교 분석

### 우리가 만든 Hooks vs community-core

| 기능        | 우리 Hooks  | community-core     | 차이점           |
| ----------- | ----------- | ------------------ | ---------------- |
| 로그인      | useLogin    | useAuth            | OAuth 지원 추가  |
| 회원가입    | useRegister | useAuthForm        | 닉네임 중복 체크 |
| 프로필      | useProfile  | useAuth            | Supabase 통합    |
| 권한        | -           | usePermissionCheck | community-core만 |
| 세션 동기화 | -           | useSessionSync     | community-core만 |

## 🚀 추천 액션 플랜

### 단기 (즉시)

1. `@team-semicolon/community-core` 패키지 설치
2. Adapter 패턴으로 기존 코드와 호환성 유지
3. 점진적으로 우리 hooks를 community-core로 교체

### 중기 (1-2주)

1. Supabase adapter를 community-core에 PR로 제출
2. OAuth 지원 기능 추가 제안
3. 닉네임 중복 체크 기능 제안

### 장기 (1개월+)

1. community-core 패키지의 공식 Supabase 지원
2. 모든 Semicolon 프로젝트에서 통일된 인증 시스템 사용
3. 패키지 유지보수 참여

## 💡 마이그레이션 예시

### Before (우리 코드)

```typescript
// src/components/organisms/LoginForm.tsx
import { useLogin } from "@/hooks/auth";

export function LoginForm() {
  const { login, loginWithOAuth, loading, error } = useLogin();

  // 컴포넌트 로직
}
```

### After (community-core 사용)

```typescript
// src/components/organisms/LoginForm.tsx
import { useAuth, useAuthForm } from "@team-semicolon/community-core";
import { useAuthAdapter } from "@/hooks/auth/useAuthAdapter";

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const { loginWithOAuth } = useAuthAdapter(); // Supabase OAuth 지원

  // 컴포넌트 로직
}
```

## 📝 결론

1. **즉시 활용 가능**: community-core 패키지가 이미 존재하므로 바로 사용 가능
2. **확장성**: 우리의 Supabase 특화 기능을 추가로 기여 가능
3. **통일성**: 모든 Semicolon 프로젝트에서 동일한 인증 시스템 사용

## 🔗 참고 링크

- [NPM Package](https://www.npmjs.com/package/@team-semicolon/community-core)
- [GitHub Repository](https://github.com/semicolon-devteam/community-core)
- [우리 프로젝트](https://github.com/semicolon-devteam/cm-template)
