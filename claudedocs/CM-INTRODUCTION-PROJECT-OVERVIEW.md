# 📚 cm-introduction 프로젝트 개요

> Semicolon 팀 소개 사이트 - 프로젝트 전체 구조 및 개발 가이드

## 🎯 프로젝트 목적

**cm-introduction**은 Semicolon DevTeam을 외부에 소개하기 위한 공식 웹사이트입니다.

### 핵심 기능

1. **People 페이지**: 팀 리더 및 파트타이머 소개
2. **Contact 페이지**: 외부 문의 접수
3. **Admin 페이지**: 운영자 전용 관리 기능

## 📁 프로젝트 구조

### 도메인 기반 구조 (DDD)

```
src/app/
├── leaders/              # 🎯 Leader 도메인
│   ├── _repositories/    # LeadersRepository
│   ├── _api-clients/     # leadersClient
│   ├── _hooks/           # useLeaders, useLeader, useUpdateLeader
│   ├── _components/      # LeaderCard, LeaderProfile, LeaderMessage
│   ├── [id]/page.tsx     # 리더 상세 페이지
│   └── page.tsx          # 리더 목록 (People 페이지)
│
├── part-timers/          # 🎯 PartTimer 도메인
│   ├── _repositories/    # PartTimersRepository
│   ├── _api-clients/     # partTimersClient
│   ├── _hooks/           # usePartTimers
│   ├── _components/      # PartTimerList (단순 리스트)
│   └── page.tsx          # People 페이지 하단 섹션
│
├── contacts/             # 🎯 Contact 도메인
│   ├── _repositories/    # ContactsRepository
│   ├── _api-clients/     # contactsClient
│   ├── _hooks/           # useContacts, useContactStatus
│   ├── _components/      # ContactForm, ContactStatusBadge
│   └── page.tsx          # 문의 폼 페이지
│
└── admin/                # 관리자 페이지
    ├── leaders/          # 리더 관리
    ├── part-timers/      # 파트타이머 관리
    └── contacts/         # 문의 관리 (상태 변경)
```

## 🎨 도메인 상세 설명

### 1. Leader 도메인 (Epic #134)

**목적**: 팀 리더의 프로필, 경력, 메시지를 관리하고 People 페이지에 노출

**엔티티 스키마**:

```typescript
interface Leader {
  id: string; // UUID
  name: string; // 이름 (필수)
  position: string; // 직책 (필수)
  summary: string; // 한줄 소개 (필수, 최대 200자)
  career: string; // 경력 (필수)
  profile_image: string; // 프로필 이미지 URL (필수)
  sns_links?: object[]; // SNS 링크 (선택)
  is_active: boolean; // 활성화 상태 (기본값: true)
  display_order?: number; // 표시 순서 (선택)
  created_at: Date;
  updated_at: Date;
}
```

**페이지**:

- `/leaders` - People 페이지 (활성화된 리더 4명 표시)
- `/leaders/[id]` - 리더 상세 페이지 (프로필, 경력, 메시지)

**권한**:

- **운영자(Admin)**: 등록, 수정, 삭제, 순서 변경, 상태 변경
- **일반 사용자**: 조회, 상세 보기

**Figma**: https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=12-1103

---

### 2. PartTimer 도메인 (Epic #135)

**목적**: 파트타이머 정보를 간단한 텍스트 리스트로 관리

**엔티티 스키마**:

```typescript
interface PartTimer {
  id: string; // UUID
  nickname: string; // 닉네임 (필수)
  role: string; // 역할 (필수)
  team: string; // 소속 팀 (필수)
  is_active: boolean; // 활성화 상태 (기본값: true)
  display_order?: number; // 표시 순서 (선택)
  created_at: Date;
  updated_at: Date;
}
```

**페이지**:

- `/part-timers` - People 페이지 하단 섹션 (단순 리스트)
- **상세 페이지 없음**, **이미지 없음**

**권한**:

- **운영자(Admin)**: 등록, 수정, 삭제, 상태 변경, 순서 변경
- **일반 사용자**: 조회

**특징**:

- 한 페이지 내 텍스트 리스트 형태로만 표시
- 닉네임 / 역할 / 팀명 3개 필드만 노출
- 개별 클릭 링크 없음

---

### 3. Contact 도메인 (Epic #149)

**목적**: 외부 사용자의 문의를 수집하고 처리 상태를 관리

**엔티티 스키마**:

```typescript
interface Inquiry {
  id: string; // UUID
  name: string; // 성함 (필수)
  email: string; // 이메일 (필수)
  phone: string; // 전화번호 (필수)
  company?: string; // 회사명 (선택)
  message: string; // 문의 내용 (필수)
  status: InquiryStatus; // 상태 (NEW, ACK, IN_PROGRESS, RESOLVED, CLOSED)
  source: string; // 출처 (WEB_FORM, EMAIL_FORWARD, IMPORT)
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
}

enum InquiryStatus {
  NEW = "NEW", // 신규
  ACK = "ACK", // 접수
  IN_PROGRESS = "IN_PROGRESS", // 처리중
  RESOLVED = "RESOLVED", // 해결
  CLOSED = "CLOSED", // 종결
}
```

**페이지**:

- `/contacts` - 문의 폼 페이지 (공개)
- `/admin/contacts` - 문의 관리 페이지 (운영자 전용)

**권한**:

- **방문자**: 문의 생성
- **운영자**: 조회, 상태 변경, 내부 메모
- **관리자**: 모든 권한 + CSV 내보내기

**상태 전이 규칙**:

```
NEW → ACK → IN_PROGRESS → RESOLVED → CLOSED
```

- CLOSED 이후 재개 불가
- 역전이 금지 (관리자 예외 허용 가능)

**Figma**: https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=29-248

---

## 🔄 데이터 흐름 (Data Flow)

### 로컬 개발 환경

```
Browser → API Client → Next.js API Route → Repository → Supabase
          (Factory)    (Controller)         (Data Layer)
```

### 프로덕션 환경

```
Browser → API Client → Spring Boot Backend → Supabase
          (Factory)    (External Server)
```

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 15.5.6 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS + Shadcn/ui
- **State**: React Query (TanStack Query)

### Backend

- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (이미지 업로드)
- **API**: Next.js API Routes (로컬) / Spring Boot (프로덕션)

### Testing

- **Unit Testing**: Vitest
- **UI Testing**: @testing-library/react

## 📋 환경 변수

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# API Mode Selection
NEXT_PUBLIC_API_MODE=next-api                    # "next-api" | "spring"
NEXT_PUBLIC_SPRING_API_URL=http://localhost:8080 # Spring Boot URL (프로덕션용)

# Optional
NODE_ENV=development                             # development | production
```

## 🎯 개발 우선순위

### Phase 1: Leader 도메인 구현 (Epic #134)

1. Database Schema 설계 및 Migration
2. Repository Layer 구현
3. API Client 구현
4. Hooks 구현
5. UI Components 구현 (Figma 기반)
6. People 페이지 통합
7. 리더 상세 페이지 구현
8. Admin 페이지 (리더 관리)

### Phase 2: PartTimer 도메인 구현 (Epic #135)

1. Database Schema 설계 및 Migration
2. Repository Layer 구현
3. API Client 구현
4. Hooks 구현
5. UI Components 구현 (단순 리스트)
6. People 페이지 통합 (하단 섹션)
7. Admin 페이지 (파트타이머 관리)

### Phase 3: Contact 도메인 구현 (Epic #149)

1. Database Schema 설계 및 Migration
2. Repository Layer 구현
3. API Client 구현
4. Hooks 구현
5. UI Components 구현 (Figma 기반)
6. Contact 폼 페이지 구현
7. Admin 페이지 (문의 관리)
8. 상태 전이 로직 구현

## 🔗 관련 링크

### Epic Issues

- [Epic #134 - LEADER 도메인](https://github.com/semicolon-devteam/command-center/issues/134)
- [Epic #135 - PART_TIMER 도메인](https://github.com/semicolon-devteam/command-center/issues/135)
- [Epic #149 - CONTACT 도메인](https://github.com/semicolon-devteam/command-center/issues/149)

### Design Resources

- [Figma - People Page](https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=12-1103)
- [Figma - Contact Page](https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=29-248)

### Repositories

- [cm-introduction](https://github.com/semicolon-devteam/cm-introduction) - 현재 프로젝트
- [cm-template](https://github.com/semicolon-devteam/cm-template) - 기반 템플릿
- [core-supabase](https://github.com/semicolon-devteam/core-supabase) - Supabase RPC 함수
- [command-center](https://github.com/semicolon-devteam/command-center) - Epic 관리

## 📝 개발 가이드

### 새로운 도메인 추가 시

1. Epic 생성 및 요구사항 정의
2. Database Schema 설계
3. DDD 구조 생성 (`app/{domain}/`)
4. Repository Layer 구현
5. API Client 구현 (Factory Pattern)
6. Hooks 구현
7. UI Components 구현 (Atomic Design)
8. 테스트 작성
9. 문서 업데이트

### 코드 리뷰 체크리스트

- [ ] DDD 구조 준수 (`_repositories/`, `_api-clients/`, `_hooks/`, `_components/`)
- [ ] Factory Pattern 적용 (API Client)
- [ ] Repository는 서버사이드 전용 (`createServerSupabaseClient` 사용)
- [ ] Atomic Design 원칙 준수
- [ ] TypeScript 타입 안전성 확보
- [ ] 테스트 커버리지 80% 이상
- [ ] Figma 디자인 1:1 구현
- [ ] 접근성 (a11y) 검증

---

**프로젝트 상태**: 🚧 개발 중 (3개 도메인 구현 예정)

**최종 업데이트**: 2025-01-19
