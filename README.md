# Semicolon Introduction Site (cm-introduction)

> Semicolon 팀을 소개하는 공식 웹사이트. 팀 리더 프로필, 파트타이머 정보, 외부 문의 기능을 제공합니다.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green?logo=supabase)](https://supabase.com/)
[![DDD](https://img.shields.io/badge/Architecture-DDD-success)](#architecture)

## ✨ Features

- **👥 Team Leaders**: 리더 프로필, 경력, 메시지 관리 (이미지 포함)
- **🤝 Part-timers**: 파트타이머 정보 단순 리스트 관리
- **📬 Contact Form**: 외부 문의 수집 및 상태 관리 (NEW → CLOSED)
- **🔐 Admin Panel**: 운영자 전용 관리 페이지
- **🏗️ DDD Architecture**: Domain-Driven Design with clear boundaries
- **🎨 Modern UI**: Shadcn/ui with Tailwind CSS (Figma 기반 디자인)
- **📱 Responsive**: Mobile-first design approach
- **🚀 SSR First**: Server Components by default

## 📋 Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Supabase account (for backend)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/semicolon-devteam/cm-introduction.git
cd cm-introduction

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# API Mode Selection
NEXT_PUBLIC_API_MODE=next-api                    # "next-api" | "spring"
NEXT_PUBLIC_SPRING_API_URL=http://localhost:8080 # Optional: Spring Boot URL
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 🏗️ Architecture

### DDD-Based Structure

```
src/
├── app/
│   ├── leaders/               # 🎯 Leader domain (팀 리더)
│   │   ├── _repositories/     # Server-side data access
│   │   ├── _api-clients/      # Browser HTTP communication
│   │   ├── _hooks/            # React state management
│   │   ├── _components/       # Domain-specific UI
│   │   ├── [id]/page.tsx      # Leader detail page
│   │   └── page.tsx           # People page (leaders list)
│   ├── part-timers/           # 🎯 PartTimer domain (파트타이머)
│   │   ├── _repositories/
│   │   ├── _api-clients/
│   │   ├── _hooks/
│   │   ├── _components/       # Simple list component
│   │   └── page.tsx           # Part-timers section
│   ├── contacts/              # 🎯 Contact domain (외부 문의)
│   │   ├── _repositories/
│   │   ├── _api-clients/
│   │   ├── _hooks/
│   │   ├── _components/       # Contact form, status badge
│   │   └── page.tsx           # Contact form page
│   └── admin/                 # 관리자 페이지
│       ├── leaders/           # Leader management
│       ├── part-timers/       # PartTimer management
│       └── contacts/          # Contact status management
├── components/                # Atomic Design components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── models/                    # Global types
└── lib/
    ├── supabase/             # Supabase configuration
    └── utils/                # Utility functions
```

**Key Principles**:

- **Domain cohesion**: Related code grouped under `/app/{domain}/`
- **Clear boundaries**: Leader, PartTimer, Contact 도메인 명확히 구분
- **Backend alignment**: Matches Spring Boot core-backend structure
- **Shared infrastructure**: Common elements separated from domains

### Data Flow

```
Browser → API Client → Next.js API Route → Repository → Supabase
          (3️⃣)        (1️⃣)                (2️⃣)
          ↓
        Hooks (4️⃣)
          ↓
      Components (6️⃣)
```

## 🎯 Domain Details

### Leader Domain (Epic #134)

**엔티티**: Leader

- id (UUID), name, position, summary, career
- profile_image (Supabase Storage URL)
- is_active, display_order, created_at, updated_at

**페이지**:

- `/leaders` - People 페이지 (리더 목록)
- `/leaders/[id]` - 리더 상세 페이지 (프로필, 경력, 메시지)

### PartTimer Domain (Epic #135)

**엔티티**: PartTimer

- id (UUID), nickname, role, team
- is_active, display_order, created_at, updated_at

**페이지**:

- `/part-timers` - People 페이지 하단 섹션 (단순 리스트)
- 상세 페이지 없음, 이미지 없음

### Contact Domain (Epic #149)

**엔티티**: Inquiry

- id (UUID), name, email, phone, message
- status (NEW → ACK → IN_PROGRESS → RESOLVED → CLOSED)
- source, created_at, updated_at, closed_at

**페이지**:

- `/contacts` - 문의 폼 페이지
- `/admin/contacts` - 문의 관리 페이지 (운영자 전용)

## 🎨 Design

### Figma

- **People Page (Leaders & Part-timers)**: [View Design](https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=12-1103)
- **Contact Page**: [View Design](https://www.figma.com/design/ZDib5vvZ2HNwJww9Zu5MY0/introduction-site?node-id=29-248)

### Design System

- Shadcn/ui components with Tailwind CSS
- Mobile-first responsive design
- Figma 디자인 기준 1:1 구현

## 📦 Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ui      # Open Vitest UI

# Formatting
npm run format       # Format code with Prettier
```

## 🎨 UI Components

This project uses [Shadcn/ui](https://ui.shadcn.com/) for components.

### Adding Components

```bash
# Initialize Shadcn/ui (already done)
npx shadcn-ui@latest init

# Add a new component
npx shadcn-ui@latest add [component-name]
```

### Available Components

- Button, Input, Card, Tabs
- Avatar, Label, Separator
- ScrollArea, and more

## 🗄️ Database

### Supabase Type Generation

```bash
npx supabase gen types typescript --project-id [project-id] > lib/supabase/database.types.ts
```

### Database Schema

**Required Tables**:

- `leaders`: 팀 리더 정보 (Epic #134)
  - id, name, position, summary, career, profile_image, is_active, display_order
- `part_timers`: 파트타이머 정보 (Epic #135)
  - id, nickname, role, team, is_active, display_order
- `inquiries`: 외부 문의 (Epic #149)
  - id, name, email, phone, message, status, source, created_at, updated_at, closed_at

**Optional Tables**:

- `admins`: 관리자 계정 (if needed)

## 📚 Documentation

- [CLAUDE.md](CLAUDE.md) - Complete development guide
- [DDD Architecture](docs/architecture/DDD-ARCHITECTURE.md) (템플릿 참고용)
- [Domain Structure](docs/architecture/DOMAIN-STRUCTURE.md) (템플릿 참고용)

## 🔗 Related Repositories & Epics

### Base Template

- [cm-template](https://github.com/semicolon-devteam/cm-template) - Community template base
- [Epic #129](https://github.com/semicolon-devteam/command-center/issues/129) - DDD 기반 아키텍처

### Domain Epics

- [Epic #134](https://github.com/semicolon-devteam/command-center/issues/134) - LEADER 도메인 관리
- [Epic #135](https://github.com/semicolon-devteam/command-center/issues/135) - PART_TIMER 도메인 관리
- [Epic #149](https://github.com/semicolon-devteam/command-center/issues/149) - CONTACT 도메인 관리

### Infrastructure

- [command-center](https://github.com/semicolon-devteam/command-center) - Epic management
- [core-supabase](https://github.com/semicolon-devteam/core-supabase) - Shared Supabase setup
- [docs](https://github.com/semicolon-devteam/docs) - Organization documentation

## 📄 License

This project is part of the Semicolon DevTeam organization.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Backend by [Supabase](https://supabase.com/)
- Design with [Figma](https://www.figma.com/)

---

**프로젝트 상태**: 🚧 개발 중 (3개 도메인 구현 예정)
