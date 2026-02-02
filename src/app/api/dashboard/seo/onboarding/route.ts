import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/**
 * 온보딩 단계 타입
 */
export interface OnboardingStep {
  id: string;
  step: number;
  title: string;
  description: string;
  tasks: OnboardingTask[];
  estimatedMinutes: number;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  actionType: "input" | "select" | "link" | "verify";
  actionData?: {
    placeholder?: string;
    options?: string[];
    url?: string;
    verifyEndpoint?: string;
  };
  required: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  projectData: {
    domain?: string;
    businessType?: string;
    targetKeywords?: string[];
    targetAudience?: string;
    competitors?: string[];
    goals?: string[];
  };
  startedAt: string;
  lastUpdatedAt: string;
}

/**
 * SEO 기초 용어 사전
 */
export interface SEOTerm {
  id: string;
  term: string;
  termEn: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
  category: "basic" | "technical" | "content" | "analytics";
}

/**
 * 온보딩 단계 정의
 */
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    step: 1,
    title: "환영합니다! 🎉",
    description:
      "AI SEO 어시스턴트와 함께 SEO 여정을 시작해보세요. 몇 가지 기본 정보만 입력하면 맞춤형 SEO 전략을 제안해드립니다.",
    tasks: [
      {
        id: "domain",
        title: "웹사이트 도메인 입력",
        description: "SEO 최적화를 진행할 웹사이트의 도메인을 입력해주세요.",
        actionType: "input",
        actionData: { placeholder: "example.com" },
        required: true,
      },
      {
        id: "business-type",
        title: "비즈니스 유형 선택",
        description: "어떤 종류의 웹사이트인가요?",
        actionType: "select",
        actionData: {
          options: [
            "이커머스/쇼핑몰",
            "기업 홈페이지",
            "블로그/미디어",
            "서비스/SaaS",
            "포트폴리오",
            "커뮤니티/포럼",
            "기타",
          ],
        },
        required: true,
      },
    ],
    estimatedMinutes: 2,
  },
  {
    id: "keywords",
    step: 2,
    title: "타겟 키워드 설정",
    description:
      "고객이 어떤 검색어로 여러분의 사이트를 찾길 원하시나요? 핵심 키워드를 설정해보세요.",
    tasks: [
      {
        id: "primary-keywords",
        title: "핵심 키워드 입력 (최대 5개)",
        description: "가장 중요한 키워드를 입력해주세요. 쉼표로 구분합니다.",
        actionType: "input",
        actionData: { placeholder: "SEO 대행, 검색엔진 최적화, 마케팅" },
        required: true,
      },
      {
        id: "target-audience",
        title: "타겟 고객층",
        description: "주요 타겟 고객은 누구인가요?",
        actionType: "select",
        actionData: {
          options: [
            "일반 소비자 (B2C)",
            "기업 고객 (B2B)",
            "스타트업/소규모 사업자",
            "전문가/프리랜서",
            "학생/교육",
            "혼합 (B2B + B2C)",
          ],
        },
        required: true,
      },
    ],
    estimatedMinutes: 3,
  },
  {
    id: "competitors",
    step: 3,
    title: "경쟁사 분석 준비",
    description: "경쟁사를 파악하면 더 효과적인 SEO 전략을 세울 수 있습니다.",
    tasks: [
      {
        id: "competitor-urls",
        title: "경쟁사 URL 입력 (선택, 최대 3개)",
        description: "비슷한 서비스를 제공하는 경쟁사 웹사이트를 입력해주세요.",
        actionType: "input",
        actionData: { placeholder: "competitor1.com, competitor2.com" },
        required: false,
      },
    ],
    estimatedMinutes: 2,
  },
  {
    id: "goals",
    step: 4,
    title: "SEO 목표 설정",
    description: "SEO를 통해 달성하고 싶은 목표를 선택해주세요. 맞춤형 액션 플랜을 제공해드립니다.",
    tasks: [
      {
        id: "seo-goals",
        title: "SEO 목표 선택 (복수 선택 가능)",
        description: "가장 중요한 목표들을 선택해주세요.",
        actionType: "select",
        actionData: {
          options: [
            "검색 순위 1페이지 진입",
            "웹사이트 트래픽 증가",
            "브랜드 인지도 향상",
            "전환율/매출 증가",
            "지역 검색 노출 강화",
            "네이버 검색 최적화",
          ],
        },
        required: true,
      },
    ],
    estimatedMinutes: 1,
  },
  {
    id: "setup-complete",
    step: 5,
    title: "설정 완료! 🚀",
    description: "기본 설정이 완료되었습니다. 이제 AI가 분석한 맞춤형 SEO 전략을 확인해보세요.",
    tasks: [
      {
        id: "view-dashboard",
        title: "대시보드로 이동",
        description: "SEO 대시보드에서 상세 분석 결과를 확인하세요.",
        actionType: "link",
        actionData: { url: "/dashboard/seo" },
        required: false,
      },
    ],
    estimatedMinutes: 1,
  },
];

/**
 * SEO 용어 사전
 */
const SEO_GLOSSARY: SEOTerm[] = [
  // Basic
  {
    id: "seo",
    term: "SEO",
    termEn: "Search Engine Optimization",
    definition:
      "검색엔진 최적화. 웹사이트가 검색 결과에서 더 높은 순위에 노출되도록 최적화하는 과정입니다.",
    example: "SEO를 통해 '맛집 추천' 검색 시 내 블로그가 1페이지에 노출됩니다.",
    relatedTerms: ["SEM", "SERP", "키워드"],
    category: "basic",
  },
  {
    id: "keyword",
    term: "키워드",
    termEn: "Keyword",
    definition: "사용자가 검색엔진에 입력하는 검색어. SEO의 핵심 요소입니다.",
    example: "'서울 카페 추천'이라는 키워드를 타겟팅합니다.",
    relatedTerms: ["롱테일 키워드", "검색량", "키워드 난이도"],
    category: "basic",
  },
  {
    id: "serp",
    term: "SERP",
    termEn: "Search Engine Results Page",
    definition: "검색 결과 페이지. 사용자가 검색어를 입력했을 때 표시되는 결과 페이지입니다.",
    example: "구글 SERP에서 상위 3개 결과가 클릭의 60%를 차지합니다.",
    relatedTerms: ["순위", "CTR", "노출"],
    category: "basic",
  },
  {
    id: "organic-traffic",
    term: "자연 트래픽",
    termEn: "Organic Traffic",
    definition: "유료 광고가 아닌 자연 검색을 통해 유입되는 방문자입니다.",
    example: "SEO 최적화 후 자연 트래픽이 50% 증가했습니다.",
    relatedTerms: ["유료 트래픽", "CTR", "세션"],
    category: "basic",
  },
  {
    id: "backlink",
    term: "백링크",
    termEn: "Backlink",
    definition: "다른 웹사이트에서 내 사이트로 연결되는 링크. 검색 순위에 중요한 영향을 미칩니다.",
    example: "신뢰도 높은 사이트에서 백링크를 받으면 순위가 상승합니다.",
    relatedTerms: ["도메인 권위", "링크 빌딩", "앵커 텍스트"],
    category: "basic",
  },
  // Technical
  {
    id: "meta-tag",
    term: "메타 태그",
    termEn: "Meta Tag",
    definition:
      "웹페이지의 정보를 설명하는 HTML 태그. 검색엔진이 페이지를 이해하는데 도움을 줍니다.",
    example: "메타 디스크립션에 키워드를 포함하면 CTR이 향상됩니다.",
    relatedTerms: ["타이틀 태그", "메타 디스크립션", "OG 태그"],
    category: "technical",
  },
  {
    id: "crawling",
    term: "크롤링",
    termEn: "Crawling",
    definition: "검색엔진 봇이 웹페이지를 방문하여 콘텐츠를 수집하는 과정입니다.",
    example: "robots.txt로 크롤링을 허용/차단할 수 있습니다.",
    relatedTerms: ["인덱싱", "Googlebot", "robots.txt"],
    category: "technical",
  },
  {
    id: "indexing",
    term: "인덱싱",
    termEn: "Indexing",
    definition: "크롤링된 페이지가 검색엔진 데이터베이스에 저장되는 과정입니다.",
    example: "새 페이지가 인덱싱되면 검색 결과에 노출됩니다.",
    relatedTerms: ["크롤링", "사이트맵", "색인"],
    category: "technical",
  },
  {
    id: "sitemap",
    term: "사이트맵",
    termEn: "Sitemap",
    definition: "웹사이트의 모든 페이지 목록을 담은 XML 파일. 검색엔진의 크롤링을 돕습니다.",
    example: "sitemap.xml을 Google Search Console에 제출합니다.",
    relatedTerms: ["robots.txt", "크롤링", "인덱싱"],
    category: "technical",
  },
  {
    id: "canonical",
    term: "캐노니컬 태그",
    termEn: "Canonical Tag",
    definition: "중복 콘텐츠 문제를 해결하기 위해 대표 URL을 지정하는 태그입니다.",
    example: "www와 non-www 버전 중 하나를 캐노니컬로 지정합니다.",
    relatedTerms: ["중복 콘텐츠", "URL 정규화"],
    category: "technical",
  },
  {
    id: "core-web-vitals",
    term: "코어 웹 바이탈",
    termEn: "Core Web Vitals",
    definition: "Google이 정한 웹 성능 핵심 지표 (LCP, FID, CLS)입니다.",
    example: "LCP 2.5초 이하면 '좋음' 등급입니다.",
    relatedTerms: ["LCP", "FID", "CLS", "페이지 속도"],
    category: "technical",
  },
  // Content
  {
    id: "alt-text",
    term: "Alt 텍스트",
    termEn: "Alt Text",
    definition: "이미지를 설명하는 대체 텍스트. 이미지 SEO와 접근성에 중요합니다.",
    example: 'alt="서울 강남역 근처 분위기 좋은 카페 내부"',
    relatedTerms: ["이미지 SEO", "접근성"],
    category: "content",
  },
  {
    id: "long-tail-keyword",
    term: "롱테일 키워드",
    termEn: "Long-tail Keyword",
    definition: "3개 이상의 단어로 구성된 구체적인 검색어. 경쟁이 낮고 전환율이 높습니다.",
    example: "'카페' 대신 '강남역 조용한 스터디 카페'를 타겟팅합니다.",
    relatedTerms: ["키워드", "검색 의도", "전환율"],
    category: "content",
  },
  {
    id: "content-optimization",
    term: "콘텐츠 최적화",
    termEn: "Content Optimization",
    definition: "검색엔진과 사용자 모두를 위해 콘텐츠를 개선하는 과정입니다.",
    example: "키워드 밀도, 가독성, 구조화된 헤딩을 최적화합니다.",
    relatedTerms: ["키워드 밀도", "가독성", "E-E-A-T"],
    category: "content",
  },
  // Analytics
  {
    id: "ctr",
    term: "CTR",
    termEn: "Click-Through Rate",
    definition: "노출 대비 클릭 비율. 검색 결과에서 얼마나 클릭되는지 나타냅니다.",
    example: "CTR 5%면 100번 노출 중 5번 클릭됩니다.",
    relatedTerms: ["노출", "클릭", "순위"],
    category: "analytics",
  },
  {
    id: "bounce-rate",
    term: "이탈률",
    termEn: "Bounce Rate",
    definition: "한 페이지만 보고 사이트를 떠나는 방문자 비율입니다.",
    example: "이탈률이 높으면 콘텐츠가 검색 의도와 맞지 않을 수 있습니다.",
    relatedTerms: ["세션", "체류 시간", "페이지뷰"],
    category: "analytics",
  },
  {
    id: "conversion-rate",
    term: "전환율",
    termEn: "Conversion Rate",
    definition: "방문자 중 원하는 행동(구매, 가입 등)을 완료한 비율입니다.",
    example: "SEO 트래픽의 전환율이 3%입니다.",
    relatedTerms: ["목표", "ROI", "CTA"],
    category: "analytics",
  },
];

/**
 * POST /api/dashboard/seo/onboarding
 * 온보딩 진행 및 AI 추천 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body as {
      action: "get-steps" | "save-progress" | "get-recommendations";
      data?: OnboardingProgress;
    };

    if (action === "get-steps") {
      return NextResponse.json({
        success: true,
        steps: ONBOARDING_STEPS,
        glossary: SEO_GLOSSARY,
      });
    }

    if (action === "save-progress") {
      // 클라이언트 측 LocalStorage에 저장되므로 여기서는 유효성 검사만
      return NextResponse.json({
        success: true,
        message: "Progress saved",
      });
    }

    if (action === "get-recommendations") {
      if (!data?.projectData) {
        return NextResponse.json(
          { success: false, error: "Project data required" },
          { status: 400 },
        );
      }

      const recommendations = await generateAIRecommendations(data.projectData);
      return NextResponse.json({
        success: true,
        recommendations,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json({ success: false, error: "Onboarding failed" }, { status: 500 });
  }
}

/**
 * AI 기반 맞춤형 추천 생성
 */
async function generateAIRecommendations(projectData: OnboardingProgress["projectData"]): Promise<{
  summary: string;
  priorities: string[];
  weeklyActions: string[];
  tips: string[];
}> {
  const apiKey = process.env.GROQ_API_KEY;

  const defaultRecommendations = {
    summary: `${projectData.domain || "귀하의 웹사이트"}에 대한 SEO 전략이 준비되었습니다.`,
    priorities: [
      "메타 태그(타이틀, 디스크립션) 최적화",
      "타겟 키워드 기반 콘텐츠 작성",
      "사이트맵 및 robots.txt 설정",
      "Google Search Console 연동",
    ],
    weeklyActions: [
      "핵심 키워드 포함 블로그 글 1개 작성",
      "기존 콘텐츠 메타 태그 점검",
      "경쟁사 상위 콘텐츠 분석",
    ],
    tips: [
      "네이버 서치어드바이저에도 사이트를 등록하세요.",
      "이미지에 alt 텍스트를 반드시 추가하세요.",
      "모바일 최적화는 필수입니다.",
    ],
  };

  if (!apiKey) {
    return defaultRecommendations;
  }

  try {
    const groq = new Groq({ apiKey });

    const prompt = `당신은 한국 SEO 전문가입니다. 다음 정보를 바탕으로 맞춤형 SEO 전략을 제안해주세요.

프로젝트 정보:
- 도메인: ${projectData.domain || "미입력"}
- 비즈니스 유형: ${projectData.businessType || "미입력"}
- 타겟 키워드: ${projectData.targetKeywords?.join(", ") || "미입력"}
- 타겟 고객: ${projectData.targetAudience || "미입력"}
- 경쟁사: ${projectData.competitors?.join(", ") || "없음"}
- SEO 목표: ${projectData.goals?.join(", ") || "미입력"}

다음 형식의 JSON으로 응답해주세요:
{
  "summary": "1-2문장의 전체 요약",
  "priorities": ["우선순위 높은 4가지 작업"],
  "weeklyActions": ["이번 주 실행할 3가지 구체적 액션"],
  "tips": ["한국 SEO 특화 팁 3가지"]
}

한국어로 작성하고, Google과 네이버 검색 모두 고려해주세요.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    try {
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(cleaned);
    } catch {
      return defaultRecommendations;
    }
  } catch (error) {
    console.error("AI recommendation generation failed:", error);
    return defaultRecommendations;
  }
}

/**
 * GET /api/dashboard/seo/onboarding
 * 온보딩 단계 및 용어 사전 조회
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    steps: ONBOARDING_STEPS,
    glossary: SEO_GLOSSARY,
    categories: {
      basic: "기본 개념",
      technical: "기술적 SEO",
      content: "콘텐츠 SEO",
      analytics: "분석/측정",
    },
  });
}
