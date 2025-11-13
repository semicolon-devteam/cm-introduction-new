# Core Community Package Migration Context

이 문서는 `@semicolon-devteam/core-community-package`로 마이그레이션할 때 필요한 컨텍스트를 정리합니다.

## 📦 마이그레이션 대상 코드

### 1. 인증 관련 Custom Hooks

현재 `/src/hooks/auth/` 디렉토리에 있는 모든 파일들이 마이그레이션 대상입니다.

```
src/hooks/auth/
├── index.ts          # Barrel export
├── useLogin.ts       # 로그인 관련 비즈니스 로직
├── useRegister.ts    # 회원가입 관련 비즈니스 로직
└── useProfile.ts     # 프로필 관련 비즈니스 로직
```

## 🏗️ Core Package 구조 설계

```
@semicolon-devteam/core-community-package/
├── src/
│   ├── hooks/
│   │   ├── auth/
│   │   │   ├── index.ts
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── useProfile.ts
│   │   ├── posts/           # 추후 추가
│   │   ├── comments/        # 추후 추가
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth/
│   │   │   └── auth.service.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## 📝 마이그레이션 작업 순서

### Phase 1: Package Setup

1. Repository 생성: `semicolon-devteam/core-community-package`
2. TypeScript 설정
3. Build 설정 (tsup 또는 rollup 추천)
4. Package.json 설정

### Phase 2: Code Migration

1. Types 정의 이동
2. Hooks 코드 이동
3. Service abstractions 생성
4. Export 설정

### Phase 3: Package Publishing

1. NPM 계정 설정
2. Package 빌드
3. NPM publish
4. Version tagging

### Phase 4: Integration

1. 기존 프로젝트에서 package 설치
2. Import path 변경
3. 테스트 및 검증

## 🔧 기술 스택 요구사항

### Dependencies

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "next": ">=13.0.0"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x"
  },
  "devDependencies": {
    "@types/react": "^18.x.x",
    "@types/node": "^20.x.x",
    "typescript": "^5.x.x",
    "tsup": "^8.x.x"
  }
}
```

## 🎯 Core Package의 주요 기능

### 1. Authentication Hooks

- `useLogin`: 이메일/비밀번호 로그인, OAuth 로그인
- `useRegister`: 회원가입, 닉네임 중복 체크, 비밀번호 검증
- `useProfile`: 사용자 프로필 관리, 로그아웃

### 2. Type Definitions

```typescript
// auth.types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  login_id: string;
  nickname: string;
}

export interface AuthResponse {
  error?: string;
  success?: boolean;
  url?: string;
}
```

### 3. Service Abstractions

```typescript
// auth.service.ts
export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  checkNickname(nickname: string): Promise<boolean>;
}
```

## 🔌 Adapter Pattern 구현

Core package는 다양한 백엔드와 호환되도록 adapter pattern을 사용합니다:

```typescript
// 사용 예시
import { useLogin } from "@semicolon-devteam/core-community-package";
import { SupabaseAuthAdapter } from "./adapters/supabase";

const loginHook = useLogin({
  adapter: new SupabaseAuthAdapter(supabaseClient),
});
```

## 📋 Claude Code에 전달할 Context

Core Package 레포지토리에서 Claude Code를 사용할 때 다음 내용을 전달하세요:

### 1. 프로젝트 설정

```markdown
이 프로젝트는 Semicolon Community의 핵심 비즈니스 로직을 담은 NPM 패키지입니다.

주요 기능:

- Authentication hooks (로그인, 회원가입, 프로필)
- 재사용 가능한 React hooks
- TypeScript 완전 지원
- Supabase 통합 (adapter pattern)

기술 스택:

- TypeScript 5.x
- React 18+ (peer dependency)
- Next.js 13+ (peer dependency)
- Supabase Client 2.x

빌드 도구: tsup (또는 rollup)
패키지 이름: @semicolon-devteam/core-community-package
```

### 2. 파일 구조

```markdown
다음 구조로 프로젝트를 설정해주세요:

src/
├── hooks/auth/ # 인증 관련 hooks
├── types/ # TypeScript 타입 정의
├── services/ # 서비스 추상화
└── adapters/ # 백엔드 어댑터
```

### 3. 코드 마이그레이션

```markdown
아래 파일들을 마이그레이션해야 합니다:

- useLogin.ts: 로그인 기능
- useRegister.ts: 회원가입 기능
- useProfile.ts: 프로필 관리

각 hook은 다음 패턴을 따릅니다:

1. Loading/Error state 관리
2. 비즈니스 로직 캡슐화
3. Clean API 제공
```

### 4. Build & Publish 설정

```markdown
NPM 패키지로 배포하기 위한 설정:

- ESM/CJS 둘 다 지원
- Type definitions 포함
- Source maps 생성
- Tree-shaking 가능한 구조
```

## 🚀 예상 사용법

### Installation

```bash
npm install @semicolon-devteam/core-community-package
# or
yarn add @semicolon-devteam/core-community-package
```

### Usage

```typescript
import { useLogin, useRegister } from "@semicolon-devteam/core-community-package";

function LoginComponent() {
  const { login, loading, error } = useLogin();

  const handleLogin = async (email: string, password: string) => {
    await login({ email, password });
  };

  // UI implementation
}
```

## ⚠️ 주의사항

1. **Version Management**: Semantic versioning 엄격히 준수
2. **Breaking Changes**: Major version에서만 허용
3. **Documentation**: 모든 public API 문서화
4. **Testing**: 단위 테스트 필수
5. **Backward Compatibility**: 기존 프로젝트 호환성 유지

## 📈 향후 확장 계획

- Posts management hooks
- Comments system hooks
- Real-time features
- File upload utilities
- Search functionality
- Notification system

이 문서를 참고하여 core-community-package를 구현하고, 기존 프로젝트에서 성공적으로 마이그레이션할 수 있습니다.
