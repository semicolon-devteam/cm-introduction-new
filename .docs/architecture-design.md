# 아키텍처 설계 문서

## 📐 시스템 아키텍처 개요

### 아키텍처 원칙

1. **관심사의 분리** (Separation of Concerns)
2. **단일 책임 원칙** (Single Responsibility)
3. **의존성 역전 원칙** (Dependency Inversion)
4. **확장 가능한 설계** (Scalable Architecture)

### 3-Tier Architecture

```
┌────────────────────────────────────────────┐
│            Presentation Layer              │
│         (UI Components - Shadcn/ui)        │
├────────────────────────────────────────────┤
│           Application Layer                │
│    (Business Logic - community-core)       │
├────────────────────────────────────────────┤
│              Data Layer                    │
│         (Database - Supabase)              │
└────────────────────────────────────────────┘
```

## 🎨 Atomic Design System

### 디자인 시스템 계층 구조

```
Templates (페이지 레이아웃)
    ↑
Organisms (복잡한 UI 컴포넌트)
    ↑
Molecules (간단한 UI 컴포넌트)
    ↑
Atoms (기본 UI 요소)
```

### Atoms (기본 구성 요소)

```typescript
// components/atoms/button.tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "danger" | "ghost";
  size: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

// components/atoms/input.tsx
interface InputProps {
  type: "text" | "email" | "password" | "search";
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
}

// components/atoms/typography.tsx
interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "body" | "caption";
  color?: "primary" | "secondary" | "muted";
}
```

### Molecules (조합 컴포넌트)

```typescript
// components/molecules/form-field.tsx
const FormField = () => {
  return (
    <div>
      <Label />
      <Input />
      <ErrorMessage />
    </div>
  );
};

// components/molecules/post-card.tsx
const PostCard = () => {
  return (
    <Card>
      <UserAvatar />
      <PostContent />
      <PostActions />
    </Card>
  );
};
```

### Organisms (복합 컴포넌트)

```typescript
// components/organisms/post-list.tsx
const PostList = () => {
  const { posts } = usePostQuery();

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
      <Pagination />
    </div>
  );
};

// components/organisms/navigation.tsx
const Navigation = () => {
  return (
    <nav>
      <Logo />
      <SearchBar />
      <MainMenu />
      <UserMenu />
    </nav>
  );
};
```

### Templates (페이지 템플릿)

```typescript
// components/templates/community-layout.tsx
const CommunityLayout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
```

## 🔄 데이터 흐름 아키텍처

### Unidirectional Data Flow

```
User Action → Dispatch → Store → UI Update
     ↑                              ↓
     ←──────── Re-render ←──────────
```

### 상태 관리 전략

#### 1. Local State (컴포넌트 상태)

```typescript
// UI 관련 상태 (모달, 드롭다운 등)
const [isOpen, setIsOpen] = useState(false);
```

#### 2. Global State (Redux Toolkit)

```typescript
// store/slices/user.slice.ts
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
  },
});
```

#### 3. Server State (React Query)

```typescript
// hooks/queries/use-posts.ts
export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: PostService.fetchPosts,
    staleTime: 5 * 60 * 1000, // 5분
  });
};
```

## 🔐 인증 & 권한 아키텍처

### 인증 플로우

```
Login Request → Supabase Auth → JWT Token
      ↓              ↓              ↓
   Validate      Store Token    Set Cookie
      ↓              ↓              ↓
   Response     Update State    Protected Route
```

### 권한 관리 시스템

```typescript
// types/permissions.ts
enum Role {
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
  GUEST = "guest",
}

interface Permission {
  resource: string;
  action: "create" | "read" | "update" | "delete";
  condition?: (user: User, resource: any) => boolean;
}

// hooks/use-permission.ts
const usePermission = (resource: string, action: string) => {
  const { user } = useAuth();
  return checkPermission(user, resource, action);
};
```

## 🗄️ 데이터베이스 설계

### ERD (Entity Relationship Diagram)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts Table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes Table
CREATE TABLE likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);
```

### Row Level Security (RLS)

```sql
-- Posts RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Read: 모든 사용자가 읽기 가능
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

-- Create: 인증된 사용자만 작성 가능
CREATE POLICY "Users can create their own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Update: 작성자만 수정 가능
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);

-- Delete: 작성자 또는 관리자만 삭제 가능
CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
USING (
  auth.uid() = author_id OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

## 🔌 API 레이어 설계

### Service Pattern

```typescript
// services/base.service.ts
export abstract class BaseService {
  protected supabase = createClient();

  protected async handleRequest<T>(request: Promise<PostgrestResponse<T>>): Promise<T> {
    const { data, error } = await request;
    if (error) throw new ServiceError(error.message);
    return data;
  }
}

// services/post.service.ts
export class PostService extends BaseService {
  async createPost(post: CreatePostDto): Promise<Post> {
    return this.handleRequest(this.supabase.from("posts").insert(post).select().single());
  }

  async getPosts(params: GetPostsParams): Promise<Post[]> {
    let query = this.supabase.from("posts").select(`
      *,
      author:users(*),
      comments(count),
      likes(count)
    `);

    if (params.category) {
      query = query.eq("category_id", params.category);
    }

    return this.handleRequest(query.order("created_at", { ascending: false }));
  }
}
```

### API 어댑터 패턴

```typescript
// adapters/community-core.adapter.ts
import { PostService as CorePostService } from "@team-semicolon/community-core";
import { PostService as SupabasePostService } from "@/services/post.service";

export class PostServiceAdapter implements CorePostService {
  private supabaseService = new SupabasePostService();

  async fetchPosts(params: any) {
    // community-core 인터페이스를 Supabase로 변환
    const supabaseParams = this.transformParams(params);
    const posts = await this.supabaseService.getPosts(supabaseParams);
    return this.transformResponse(posts);
  }

  private transformParams(coreParams: any) {
    // 파라미터 변환 로직
  }

  private transformResponse(supabasePosts: any) {
    // 응답 변환 로직
  }
}
```

## 🚀 실시간 기능 아키텍처

### WebSocket Connection

```typescript
// lib/realtime.ts
export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToPost(
    postId: string,
    callbacks: {
      onComment?: (comment: Comment) => void;
      onLike?: (like: Like) => void;
    },
  ) {
    const channel = supabase
      .channel(`post:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        callbacks.onComment,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          filter: `post_id=eq.${postId}`,
        },
        callbacks.onLike,
      )
      .subscribe();

    this.channels.set(postId, channel);
  }

  unsubscribe(channelId: string) {
    const channel = this.channels.get(channelId);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelId);
    }
  }
}
```

### 실시간 업데이트 플로우

```
Database Change → Postgres Publication → Supabase Realtime
        ↓                    ↓                   ↓
    Row Modified      Change Detection     WebSocket Broadcast
        ↓                    ↓                   ↓
    Trigger Event      Filter Changes      Client Subscription
        ↓                    ↓                   ↓
     Log Change         Apply Filters        Update UI
```

## 🔒 보안 아키텍처

### 보안 계층

1. **네트워크 보안**
   - HTTPS 강제
   - CORS 설정
   - Rate Limiting

2. **인증 보안**
   - JWT Token 검증
   - Refresh Token 관리
   - Session 타임아웃

3. **데이터 보안**
   - Input Validation
   - SQL Injection 방지
   - XSS 방지
   - CSRF 토큰

4. **권한 보안**
   - Row Level Security
   - Role-Based Access Control
   - Resource-Based Permissions

### 보안 미들웨어

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // CSRF Protection
  if (request.method !== "GET") {
    const token = request.headers.get("x-csrf-token");
    if (!validateCSRFToken(token)) {
      return new Response("Invalid CSRF token", { status: 403 });
    }
  }

  // Authentication Check
  const session = await getSession(request);
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect("/auth/login");
  }

  // Rate Limiting
  const identifier = getIdentifier(request);
  if (isRateLimited(identifier)) {
    return new Response("Too many requests", { status: 429 });
  }

  return NextResponse.next();
}
```

## 📊 성능 최적화 전략

### 프론트엔드 최적화

1. **코드 분할**

   ```typescript
   const DashboardPage = lazy(() => import("./pages/Dashboard"));
   ```

2. **이미지 최적화**

   ```typescript
   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority
     placeholder="blur"
   />
   ```

3. **메모이제이션**
   ```typescript
   const MemoizedPostCard = memo(
     PostCard,
     (prev, next) => prev.id === next.id && prev.updatedAt === next.updatedAt,
   );
   ```

### 백엔드 최적화

1. **쿼리 최적화**
   - Indexed columns
   - Batch operations
   - Connection pooling

2. **캐싱 전략**
   - Browser Cache
   - CDN Cache
   - API Response Cache

3. **데이터베이스 최적화**
   - Query optimization
   - Index strategy
   - Partitioning

## 🔄 배포 아키텍처

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v3
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 환경 구성

```
Development → Staging → Production
    ↓           ↓           ↓
  Local      Preview     Vercel
Database    Database    Database
```

## 📈 모니터링 및 로깅

### 모니터링 스택

- **Application Monitoring**: Sentry
- **Performance Monitoring**: Vercel Analytics
- **User Analytics**: Google Analytics
- **Database Monitoring**: Supabase Dashboard

### 로깅 전략

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    // Send to logging service
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    Sentry.captureException(error);
  },
  metric: (name: string, value: number) => {
    // Send to metrics service
  },
};
```

---

_이 문서는 시스템의 기술적 설계를 정의합니다._
_최종 수정: 2025-09-17_
