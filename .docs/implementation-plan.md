# 커뮤니티 템플릿 구현 계획

## 📋 프로젝트 개요

### 목표

Next.js + Tailwind CSS + Atomic Design 패턴을 활용한 확장 가능한 커뮤니티 사이트 템플릿 구축

### 핵심 요구사항

- Atomic Design Pattern 적용
- @team-semicolon/community-core 기능 통합
- Supabase 백엔드 연동
- 완벽한 TypeScript 타입 안정성

## 🏗️ 아키텍처 구조

### 레이어 분리

```
┌─────────────────────────────────────────┐
│         UI Layer (Shadcn/ui)            │
├─────────────────────────────────────────┤
│    Business Logic (community-core)      │
├─────────────────────────────────────────┤
│      Data Layer (Supabase)              │
└─────────────────────────────────────────┘
```

### 폴더 구조

```
src/
├── components/
│   ├── atoms/          # Shadcn/ui 기본 컴포넌트
│   ├── molecules/      # 조합 컴포넌트
│   ├── organisms/      # 기능 연결 컴포넌트
│   └── templates/      # 페이지 레이아웃
├── hooks/              # community-core + custom hooks
├── services/           # 비즈니스 로직 어댑터
├── lib/
│   ├── supabase/      # Supabase 클라이언트 설정
│   └── utils/         # 유틸리티 함수
├── styles/            # 글로벌 스타일
└── types/             # TypeScript 타입 정의
```

## 🚀 구현 단계

### Phase 1: 기초 설정 (Week 1)

#### 1.1 프로젝트 초기화

- [x] Next.js 15 + TypeScript 설정
- [x] Tailwind CSS 설정
- [ ] ESLint + Prettier 설정
- [ ] Git hooks (Husky) 설정

#### 1.2 UI 라이브러리 설치

```bash
# Shadcn/ui 초기화
npx shadcn-ui@latest init

# 필수 컴포넌트 설치
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add table
npx shadcn-ui@latest add skeleton
```

#### 1.3 Supabase 설정

```bash
npm install @supabase/supabase-js
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

### Phase 2: Atomic 컴포넌트 구축 (Week 2)

#### 2.1 Atoms 구성

- [ ] Button variants (primary, secondary, danger, ghost)
- [ ] Input types (text, email, password, textarea)
- [ ] Typography components (Heading, Text, Label)
- [ ] Icon system
- [ ] Loading states

#### 2.2 Molecules 구성

- [ ] FormField (Label + Input + Error)
- [ ] UserAvatar (Avatar + Badge + Status)
- [ ] PostCard (Card + Avatar + Actions)
- [ ] CommentItem (Avatar + Text + Timestamp)
- [ ] SearchBar (Input + Button + Icon)

#### 2.3 Organisms 구성

- [ ] Navigation (Logo + Menu + UserMenu)
- [ ] PostList (Cards + Pagination)
- [ ] CommentSection (Comments + Form)
- [ ] UserProfile (Info + Stats + Actions)
- [ ] Sidebar (Categories + Filters)

### Phase 3: 기능 통합 (Week 3)

#### 3.1 Community-Core 통합

```typescript
// services/adapters/auth.adapter.ts
import { AuthService } from "@team-semicolon/community-core";
import { supabase } from "@/lib/supabase";

export class SupabaseAuthAdapter extends AuthService {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return this.handleAuthResponse(data, error);
  }

  async logout() {
    await supabase.auth.signOut();
  }

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }
}
```

#### 3.2 상태 관리 설정

- [ ] Redux Toolkit 설정
- [ ] React Query 설정
- [ ] Auth Context 구현
- [ ] Global state 구조 설계

#### 3.3 라우팅 구조

```
pages/
├── index.tsx           # 홈 (게시물 피드)
├── auth/
│   ├── login.tsx      # 로그인
│   └── register.tsx   # 회원가입
├── posts/
│   ├── index.tsx      # 게시물 목록
│   ├── [id].tsx       # 게시물 상세
│   └── create.tsx     # 게시물 작성
├── profile/
│   └── [username].tsx # 사용자 프로필
└── admin/
    └── dashboard.tsx   # 관리자 대시보드
```

### Phase 4: 핵심 기능 구현 (Week 4)

#### 4.1 인증 시스템

- [ ] 이메일 로그인/회원가입
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 비밀번호 재설정
- [ ] 이메일 인증
- [ ] 세션 관리

#### 4.2 게시물 시스템

- [ ] 게시물 CRUD
- [ ] 카테고리/태그
- [ ] 좋아요/북마크
- [ ] 조회수 추적
- [ ] 검색 기능

#### 4.3 댓글 시스템

- [ ] 댓글 CRUD
- [ ] 대댓글 지원
- [ ] 멘션 기능
- [ ] 실시간 업데이트

#### 4.4 사용자 시스템

- [ ] 프로필 관리
- [ ] 팔로우/팔로워
- [ ] 활동 내역
- [ ] 알림 시스템

### Phase 5: 고급 기능 (Week 5-6)

#### 5.1 실시간 기능

- [ ] 실시간 댓글
- [ ] 실시간 알림
- [ ] 온라인 사용자 표시
- [ ] 실시간 채팅 (선택)

#### 5.2 관리자 기능

- [ ] 사용자 관리
- [ ] 게시물 관리
- [ ] 신고 처리
- [ ] 통계 대시보드

#### 5.3 성능 최적화

- [ ] 이미지 최적화
- [ ] 무한 스크롤
- [ ] 가상 스크롤
- [ ] 캐싱 전략
- [ ] SEO 최적화

## 📦 기술 스택

### Frontend

- **Framework**: Next.js 15.1.4
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.1
- **UI Library**: Shadcn/ui
- **State Management**: Redux Toolkit + React Query

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Realtime**: Supabase Realtime
- **Storage**: Supabase Storage

### Business Logic

- **Core Package**: @team-semicolon/community-core
- **Hooks**: Custom hooks for business logic
- **Services**: Service adapters for external APIs

### Development Tools

- **Package Manager**: npm
- **Linter**: ESLint
- **Formatter**: Prettier
- **Git Hooks**: Husky
- **Testing**: Vitest + React Testing Library

## 🎯 성능 목표

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 번들 크기

- Initial JS: < 500KB
- Total Bundle: < 2MB
- Per Route: < 100KB

### 접근성

- WCAG 2.1 AA 준수
- 키보드 네비게이션 100% 지원
- 스크린 리더 호환성

## 📝 개발 가이드라인

### 코드 컨벤션

- Atomic Design Pattern 엄격 준수
- TypeScript strict mode 사용
- 컴포넌트 단위 테스트 필수
- Props drilling 최소화 (Context/Redux 활용)

### Git 워크플로우

- Feature Branch 전략
- Conventional Commits 사용
- PR Template 적용
- Code Review 필수

### 문서화

- 컴포넌트 Storybook 작성
- API 문서 자동 생성
- README 지속 업데이트
- 변경 로그 관리

## 🔄 반복 개선 계획

### 월간 스프린트

- **Sprint 1**: MVP 기능 완성
- **Sprint 2**: UI/UX 개선
- **Sprint 3**: 성능 최적화
- **Sprint 4**: 확장 기능 추가

### 피드백 수집

- 사용자 테스트 세션
- A/B 테스팅
- 성능 모니터링
- 에러 트래킹

## 📊 성공 지표

### 기술적 지표

- [ ] 페이지 로드 속도 < 3초
- [ ] 모바일 성능 점수 > 90
- [ ] 코드 커버리지 > 80%
- [ ] 타입 커버리지 100%

### 비즈니스 지표

- [ ] 일일 활성 사용자 증가율
- [ ] 게시물 작성 전환율
- [ ] 사용자 체류 시간
- [ ] 재방문율

## 🚧 리스크 관리

### 기술적 리스크

- **Supabase 제한**: Row Level Security 복잡도 → 철저한 테스트
- **번들 크기**: Shadcn/ui 컴포넌트 증가 → Tree shaking 최적화
- **타입 안정성**: Community-core 타입 호환성 → 타입 가드 구현

### 일정 리스크

- **Phase 1-2**: 기초 설정 지연 → 템플릿 활용
- **Phase 3-4**: 통합 복잡도 → 단계적 통합
- **Phase 5**: 고급 기능 우선순위 → MVP 우선

## 📅 마일스톤

### M1: 기초 구축 (Week 1-2)

- Atomic 컴포넌트 시스템 완성
- Supabase 연동 완료
- 기본 라우팅 구현

### M2: 핵심 기능 (Week 3-4)

- 인증 시스템 완성
- 게시물 CRUD 구현
- 댓글 시스템 구현

### M3: 프로덕션 준비 (Week 5-6)

- 성능 최적화 완료
- 테스트 커버리지 80%
- 배포 파이프라인 구축

### M4: 출시 (Week 7)

- 프로덕션 배포
- 모니터링 설정
- 피드백 수집 시작

---

_이 문서는 지속적으로 업데이트됩니다._
_최종 수정: 2025-09-17_
