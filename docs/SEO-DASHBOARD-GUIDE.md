# SEO Command Center 사용 가이드

> SEO 대시보드를 통해 여러 프로젝트의 검색 엔진 최적화를 관리합니다.

## 목차

1. [개요](#개요)
2. [GTM 설정](#gtm-설정)
3. [웹훅 연동](#웹훅-연동)
4. [IndexNow 색인 요청](#indexnow-색인-요청)
5. [주간 SEO 리포트](#주간-seo-리포트)
6. [환경 변수 설정](#환경-변수-설정)

---

## 개요

SEO Command Center는 다음 기능을 제공합니다:

| 기능          | 설명                              |
| ------------- | --------------------------------- |
| GTM 태그 관리 | Google Tag Manager 설치 코드 생성 |
| 키워드 관리   | 타겟 키워드 등록 및 AI 최적화     |
| IndexNow      | Naver/Bing 즉시 색인 요청         |
| 웹훅 연동     | 새 글 발행 시 자동 색인           |
| 주간 리포트   | AI 기반 SEO 성과 분석             |

### 접속 URL

- 대시보드: https://www.semi-colon.space/dashboard/seo
- 프로젝트별: https://www.semi-colon.space/dashboard/seo/{projectId}/keywords

---

## GTM 설정

### Step 1: GTM Container ID 확인

1. [Google Tag Manager](https://tagmanager.google.com/) 접속
2. 컨테이너 선택 또는 새로 생성
3. Container ID 복사 (예: `GTM-TJHH9X6N`)

### Step 2: SEO 대시보드에서 코드 생성

1. 대시보드 접속: `/dashboard/seo/{projectId}/keywords`
2. "GTM 태그 관리" 섹션에서 Container ID 입력
3. "생성" 버튼 클릭
4. 3가지 코드가 생성됨:
   - Head Script
   - Body Script
   - SEO 추적 이벤트 코드

### Step 3: 프로젝트에 코드 적용

#### Next.js App Router (layout.tsx)

```tsx
// src/app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* GTM Head Script */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX');`}
        </Script>
      </head>
      <body>
        {/* GTM Body Script (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

#### 환경변수로 관리하기 (권장)

```tsx
// .env.local
NEXT_PUBLIC_GTM_ID = GTM - XXXXXXX;

// layout.tsx
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
```

---

## 웹훅 연동

새 글이 발행될 때 자동으로 검색엔진에 색인 요청을 보냅니다.

### Endpoint

```
POST https://www.semi-colon.space/api/dashboard/seo/webhook
```

### Request Body

```json
{
  "url": "https://jungchipan.net/posts/new-article",
  "host": "jungchipan.net",
  "title": "새 글 제목",
  "content": "글 내용 요약 (메타태그 생성용, 선택)",
  "keywords": ["키워드1", "키워드2"],
  "autoIndexNow": true,
  "autoMetaTags": true
}
```

### 필드 설명

| 필드         | 필수 | 설명                            |
| ------------ | ---- | ------------------------------- |
| url          | O    | 새 글의 전체 URL                |
| host         | O    | 도메인 (예: jungchipan.net)     |
| title        | X    | 글 제목                         |
| content      | X    | 글 내용 (500자 이내 권장)       |
| keywords     | X    | 타겟 키워드 배열                |
| autoIndexNow | X    | IndexNow 자동 제출 (기본: true) |
| autoMetaTags | X    | AI 메타태그 생성 (기본: true)   |

### 프로젝트에서 웹훅 호출하기

#### Next.js API Route에서 호출

```typescript
// src/app/api/posts/route.ts
export async function POST(request: Request) {
  const body = await request.json();

  // 1. 글 저장 로직
  const post = await savePost(body);

  // 2. SEO 웹훅 호출
  try {
    await fetch("https://www.semi-colon.space/api/dashboard/seo/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `https://jungchipan.net/posts/${post.slug}`,
        host: "jungchipan.net",
        title: post.title,
        content: post.excerpt || post.content.slice(0, 500),
        keywords: post.tags || [],
        autoIndexNow: true,
        autoMetaTags: true,
      }),
    });
  } catch (error) {
    console.error("SEO webhook failed:", error);
    // 웹훅 실패해도 글 발행은 성공 처리
  }

  return Response.json({ success: true, post });
}
```

#### 인증 추가 (선택)

```typescript
// 환경변수에 WEBHOOK_SECRET 설정 시
headers: {
  "Content-Type": "application/json",
  "x-webhook-secret": process.env.SEO_WEBHOOK_SECRET,
}
```

### Response

```json
{
  "success": true,
  "message": "웹훅 처리 완료",
  "url": "https://jungchipan.net/posts/new-article",
  "results": [
    { "action": "indexnow_naver", "success": true, "data": { "status": 202 } },
    { "action": "indexnow_bing", "success": true, "data": { "status": 200 } },
    { "action": "meta_tags", "success": true, "data": { ... } }
  ]
}
```

---

## IndexNow 색인 요청

### 수동 요청 (대시보드 UI)

1. 대시보드의 "IndexNow 색인 요청" 섹션
2. URL 입력 (줄바꿈으로 여러 개 입력 가능)
3. "색인 요청 제출" 클릭

### API 직접 호출

```typescript
await fetch("https://www.semi-colon.space/api/dashboard/seo/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    urls: ["https://jungchipan.net/page1", "https://jungchipan.net/page2"],
    host: "jungchipan.net",
    searchEngines: ["naver", "bing"],
  }),
});
```

### 지원 검색엔진

- Naver: https://searchadvisor.naver.com/indexnow
- Bing: https://www.bing.com/indexnow

---

## 주간 SEO 리포트

### 기능

- Search Console 데이터 기반 성과 분석
- AI가 인사이트 및 개선 권장사항 제공
- Markdown 형식으로 리포트 생성

### 사용법

1. 대시보드에서 "주간 리포트 생성" 클릭
2. AI가 분석 후 리포트 생성
3. "복사" 버튼으로 Markdown 복사
4. Notion, GitHub 등에 붙여넣기

### 리포트 내용

- 클릭/노출/CTR/순위 변화
- 주요 성과 하이라이트
- 개선 필요 사항
- 권장 조치 (우선순위별)
- 다음 주 집중 포인트

---

## 환경 변수 설정

SEO 대시보드 API가 정상 작동하려면 다음 환경변수가 필요합니다:

### 필수

```env
# Google Search Console API
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# IndexNow
INDEXNOW_KEY=your-indexnow-key
```

### 선택

```env
# AI 리포트 생성 (Groq API - 무료)
GROQ_API_KEY=your-groq-api-key

# 웹훅 인증
WEBHOOK_SECRET=your-webhook-secret

# Search Console 기본 사이트 (단일 프로젝트용)
SEARCH_CONSOLE_SITE_URL=https://jungchipan.net
```

### IndexNow Key 파일 생성

IndexNow 사용 시 도메인 루트에 키 파일이 필요합니다:

```
https://jungchipan.net/{INDEXNOW_KEY}.txt
```

파일 내용: 키 값 그대로 (예: `abc123def456`)

---

## 새 프로젝트 추가하기

### 1. 설정 파일 수정

```typescript
// src/app/dashboard/_config/seo-projects.ts
export const SEO_PROJECTS: SEOProjectConfig[] = [
  // 기존 프로젝트...
  {
    id: "new-project",
    name: "새 프로젝트",
    description: "프로젝트 설명",
    domain: "new-project.com",
    searchConsole: {
      siteUrl: "https://new-project.com",
      enabled: true,
    },
    analytics: {
      propertyId: "GA_PROPERTY_ID",
      enabled: true,
    },
    gtm: {
      containerId: "GTM-XXXXXXX",
      enabled: true,
    },
    icon: "🚀",
    color: "#10B981",
  },
];
```

### 2. Search Console 권한 추가

Google Cloud Console에서 Service Account에 새 도메인 권한 추가

### 3. 배포

```bash
npm run build
# Vercel 자동 배포 또는 수동 배포
```

---

## 문제 해결

### IndexNow 실패

- INDEXNOW_KEY 환경변수 확인
- 도메인 루트에 `{key}.txt` 파일 존재 확인
- URL이 해당 도메인과 일치하는지 확인

### Search Console 연동 실패

- Service Account 이메일이 Search Console에 사용자로 추가되었는지 확인
- GOOGLE_PRIVATE_KEY의 `\n`이 실제 줄바꿈으로 변환되는지 확인

### AI 리포트 생성 실패

- GROQ_API_KEY 확인
- Groq API 무료 할당량 확인 (일 30,000 토큰)

---

## 관련 링크

- [Google Tag Manager](https://tagmanager.google.com/)
- [Google Search Console](https://search.google.com/search-console)
- [IndexNow Protocol](https://www.indexnow.org/)
- [Groq API (무료)](https://console.groq.com/)
- [Naver Search Advisor](https://searchadvisor.naver.com/)
