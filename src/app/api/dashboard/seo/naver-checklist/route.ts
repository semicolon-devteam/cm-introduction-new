import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/**
 * 네이버 SEO 체크리스트 아이템 타입
 */
export interface NaverSEOCheckItem {
  id: string;
  category: "basic" | "content" | "technical" | "mobile" | "social";
  title: string;
  description: string;
  importance: "critical" | "high" | "medium" | "low";
  status: "pending" | "completed" | "na";
  howTo: string[];
  naverTip?: string;
}

/**
 * 네이버 SEO 분석 결과
 */
export interface NaverSEOAnalysis {
  success: boolean;
  domain: string;
  overallScore: number;
  categories: {
    basic: { score: number; completed: number; total: number };
    content: { score: number; completed: number; total: number };
    technical: { score: number; completed: number; total: number };
    mobile: { score: number; completed: number; total: number };
    social: { score: number; completed: number; total: number };
  };
  checklist: NaverSEOCheckItem[];
  aiRecommendations?: string[];
  error?: string;
}

/**
 * 네이버 SEO 기본 체크리스트
 */
function getDefaultChecklist(): NaverSEOCheckItem[] {
  return [
    // 기본 설정
    {
      id: "naver-basic-1",
      category: "basic",
      title: "네이버 서치어드바이저 등록",
      description: "사이트를 네이버 서치어드바이저에 등록하여 검색 노출 관리",
      importance: "critical",
      status: "pending",
      howTo: [
        "https://searchadvisor.naver.com 접속",
        "네이버 계정으로 로그인",
        "사이트 추가 클릭",
        "사이트 소유권 확인 (HTML 파일 또는 메타태그)",
      ],
      naverTip: "서치어드바이저 등록은 네이버 검색 노출의 첫 단계입니다.",
    },
    {
      id: "naver-basic-2",
      category: "basic",
      title: "robots.txt 설정",
      description: "네이버봇(Yeti)이 사이트를 크롤링할 수 있도록 허용",
      importance: "critical",
      status: "pending",
      howTo: [
        "robots.txt 파일에 'User-agent: Yeti' 추가",
        "'Allow: /' 설정으로 전체 허용",
        "서치어드바이저에서 robots.txt 검사",
      ],
      naverTip: "네이버봇 이름은 'Yeti'입니다. Googlebot과 별도로 설정하세요.",
    },
    {
      id: "naver-basic-3",
      category: "basic",
      title: "사이트맵 제출",
      description: "XML 사이트맵을 네이버 서치어드바이저에 제출",
      importance: "critical",
      status: "pending",
      howTo: [
        "sitemap.xml 파일 생성",
        "서치어드바이저 > 요청 > 사이트맵 제출",
        "사이트맵 URL 입력 후 확인",
      ],
      naverTip: "사이트맵은 1MB 이하, URL 50,000개 이하로 제한됩니다.",
    },
    {
      id: "naver-basic-4",
      category: "basic",
      title: "IndexNow 연동",
      description: "새 콘텐츠 발행 시 네이버에 즉시 색인 요청",
      importance: "high",
      status: "pending",
      howTo: [
        "IndexNow API 키 생성",
        "사이트 루트에 키 파일 배포",
        "콘텐츠 발행 시 자동 제출 설정",
      ],
      naverTip: "IndexNow는 Bing, 네이버 모두 지원합니다.",
    },

    // 콘텐츠 최적화
    {
      id: "naver-content-1",
      category: "content",
      title: "키워드 최적화된 제목",
      description: "타겟 키워드를 포함한 명확한 제목 작성",
      importance: "critical",
      status: "pending",
      howTo: [
        "제목 앞쪽에 핵심 키워드 배치",
        "제목 길이 30-40자 권장",
        "클릭을 유도하는 매력적인 문구",
      ],
      naverTip: "네이버는 제목 앞부분의 키워드를 중요하게 봅니다.",
    },
    {
      id: "naver-content-2",
      category: "content",
      title: "충분한 콘텐츠 길이",
      description: "검색 의도를 충족하는 상세한 콘텐츠 작성",
      importance: "high",
      status: "pending",
      howTo: ["최소 2,000자 이상 작성 권장", "주제를 깊이 있게 다루기", "관련 소주제 포함"],
      naverTip: "네이버 블로그는 특히 긴 글을 선호합니다. 3,000자 이상 권장.",
    },
    {
      id: "naver-content-3",
      category: "content",
      title: "이미지 최적화",
      description: "관련 이미지 추가 및 alt 태그 설정",
      importance: "high",
      status: "pending",
      howTo: [
        "글당 최소 3-5개 이미지 추가",
        "모든 이미지에 설명적인 alt 태그",
        "이미지 파일명에 키워드 포함",
        "WebP 포맷으로 최적화",
      ],
      naverTip: "네이버 이미지 검색 노출을 위해 alt 태그 필수입니다.",
    },
    {
      id: "naver-content-4",
      category: "content",
      title: "정기적인 콘텐츠 발행",
      description: "꾸준한 콘텐츠 업데이트로 신선도 유지",
      importance: "high",
      status: "pending",
      howTo: [
        "주 2-3회 이상 새 글 발행",
        "기존 글도 주기적으로 업데이트",
        "계절/트렌드에 맞는 콘텐츠",
      ],
      naverTip: "네이버는 최신 콘텐츠를 선호합니다. 발행일이 중요합니다.",
    },
    {
      id: "naver-content-5",
      category: "content",
      title: "구조화된 헤딩 태그",
      description: "H1, H2, H3 태그로 콘텐츠 구조화",
      importance: "medium",
      status: "pending",
      howTo: [
        "페이지당 H1 태그 1개만 사용",
        "H2로 주요 섹션 구분",
        "H3로 세부 내용 구분",
        "헤딩에 키워드 자연스럽게 포함",
      ],
    },

    // 기술적 SEO
    {
      id: "naver-tech-1",
      category: "technical",
      title: "HTTPS 적용",
      description: "SSL 인증서로 보안 연결 제공",
      importance: "critical",
      status: "pending",
      howTo: ["SSL 인증서 설치", "HTTP → HTTPS 리다이렉트 설정", "혼합 콘텐츠 문제 해결"],
      naverTip: "2019년부터 HTTPS는 네이버 SEO 필수 요소입니다.",
    },
    {
      id: "naver-tech-2",
      category: "technical",
      title: "페이지 로딩 속도",
      description: "3초 이내 페이지 로딩 달성",
      importance: "high",
      status: "pending",
      howTo: ["이미지 압축 및 지연 로딩", "CSS/JS 최소화", "CDN 사용", "서버 응답 시간 최적화"],
      naverTip: "네이버 서치어드바이저에서 사이트 성능 확인 가능합니다.",
    },
    {
      id: "naver-tech-3",
      category: "technical",
      title: "정규 URL 설정",
      description: "canonical 태그로 중복 콘텐츠 방지",
      importance: "medium",
      status: "pending",
      howTo: ["모든 페이지에 canonical 태그 추가", "www와 non-www 통일", "중복 URL 정리"],
    },
    {
      id: "naver-tech-4",
      category: "technical",
      title: "구조화 데이터 마크업",
      description: "JSON-LD로 검색 결과 강화",
      importance: "medium",
      status: "pending",
      howTo: [
        "Article, FAQ, HowTo 등 적절한 스키마 선택",
        "JSON-LD 형식으로 구현",
        "Google 리치 결과 테스트로 검증",
      ],
      naverTip: "네이버도 일부 구조화 데이터를 지원합니다.",
    },

    // 모바일 최적화
    {
      id: "naver-mobile-1",
      category: "mobile",
      title: "반응형 디자인",
      description: "모든 기기에서 최적화된 화면 제공",
      importance: "critical",
      status: "pending",
      howTo: ["viewport 메타 태그 설정", "미디어 쿼리로 반응형 CSS", "터치 타겟 최소 48px"],
      naverTip: "네이버 검색의 70% 이상이 모바일에서 발생합니다.",
    },
    {
      id: "naver-mobile-2",
      category: "mobile",
      title: "모바일 페이지 속도",
      description: "모바일에서 빠른 로딩 속도 달성",
      importance: "high",
      status: "pending",
      howTo: ["모바일 전용 이미지 최적화", "불필요한 스크립트 제거", "AMP 또는 모바일 퍼스트 접근"],
    },
    {
      id: "naver-mobile-3",
      category: "mobile",
      title: "모바일 UX 최적화",
      description: "모바일 사용자 경험 개선",
      importance: "medium",
      status: "pending",
      howTo: ["가독성 좋은 폰트 크기 (16px+)", "충분한 줄 간격", "팝업/인터스티셜 최소화"],
    },

    // 소셜/외부 신호
    {
      id: "naver-social-1",
      category: "social",
      title: "네이버 블로그 연동",
      description: "네이버 블로그와 사이트 연동",
      importance: "high",
      status: "pending",
      howTo: ["네이버 블로그 개설", "사이트 콘텐츠 요약 발행", "사이트 링크 자연스럽게 포함"],
      naverTip: "네이버 블로그는 네이버 검색에서 우대됩니다.",
    },
    {
      id: "naver-social-2",
      category: "social",
      title: "네이버 카페 활동",
      description: "관련 네이버 카페에서 활동",
      importance: "medium",
      status: "pending",
      howTo: ["관련 주제 카페 가입", "유용한 정보 공유", "사이트 홍보는 자연스럽게"],
    },
    {
      id: "naver-social-3",
      category: "social",
      title: "Open Graph 태그",
      description: "소셜 공유 시 썸네일/설명 최적화",
      importance: "medium",
      status: "pending",
      howTo: [
        "og:title, og:description, og:image 설정",
        "이미지 크기 1200x630px 권장",
        "각 페이지별 고유 OG 태그",
      ],
    },
  ];
}

/**
 * POST /api/dashboard/seo/naver-checklist
 * 네이버 SEO 체크리스트 AI 분석
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, keywords, completedItems } = body as {
      domain: string;
      keywords?: string[];
      completedItems?: string[];
    };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    let checklist = getDefaultChecklist();

    // 완료된 항목 상태 업데이트
    if (completedItems && completedItems.length > 0) {
      checklist = checklist.map((item) => ({
        ...item,
        status: completedItems.includes(item.id) ? "completed" : item.status,
      }));
    }

    // 카테고리별 점수 계산
    const calculateCategoryScore = (category: string) => {
      const items = checklist.filter((item) => item.category === category);
      const completed = items.filter((item) => item.status === "completed").length;
      const total = items.length;
      const score = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { score, completed, total };
    };

    const categories = {
      basic: calculateCategoryScore("basic"),
      content: calculateCategoryScore("content"),
      technical: calculateCategoryScore("technical"),
      mobile: calculateCategoryScore("mobile"),
      social: calculateCategoryScore("social"),
    };

    // 전체 점수 (가중치 적용)
    const weights = { basic: 0.25, content: 0.3, technical: 0.2, mobile: 0.15, social: 0.1 };
    const overallScore = Math.round(
      categories.basic.score * weights.basic +
        categories.content.score * weights.content +
        categories.technical.score * weights.technical +
        categories.mobile.score * weights.mobile +
        categories.social.score * weights.social,
    );

    // AI 추천 생성
    let aiRecommendations: string[] = [];
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && keywords && keywords.length > 0) {
      try {
        const groq = new Groq({ apiKey });
        const incompleteItems = checklist.filter(
          (item) => item.status !== "completed" && item.importance === "critical",
        );

        const prompt = `당신은 네이버 SEO 전문가입니다. 다음 정보를 바탕으로 네이버 검색 최적화 추천을 해주세요.

도메인: ${domain}
타겟 키워드: ${keywords.join(", ")}
현재 점수: ${overallScore}/100
미완료 중요 항목: ${incompleteItems.map((i) => i.title).join(", ") || "없음"}

네이버 SEO 개선을 위한 구체적인 추천 3가지를 JSON 배열로 응답해주세요.
예시: ["추천 1", "추천 2", "추천 3"]

추천은 한국어로 작성하고, 네이버 검색 특성을 반영해주세요.`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 512,
        });

        const responseText = completion.choices[0]?.message?.content || "";
        try {
          const cleaned = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          aiRecommendations = JSON.parse(cleaned);
        } catch {
          // 파싱 실패 시 기본 추천
          aiRecommendations = [
            "네이버 서치어드바이저에 사이트를 등록하고 사이트맵을 제출하세요.",
            "네이버 블로그를 활용하여 사이트 콘텐츠를 홍보하세요.",
            "모바일 페이지 속도를 개선하여 사용자 경험을 향상시키세요.",
          ];
        }
      } catch (e) {
        console.error("AI recommendation failed:", e);
      }
    }

    const result: NaverSEOAnalysis = {
      success: true,
      domain,
      overallScore,
      categories,
      checklist,
      aiRecommendations: aiRecommendations.length > 0 ? aiRecommendations : undefined,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Naver SEO checklist error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "체크리스트 생성 실패" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/dashboard/seo/naver-checklist
 * 기본 네이버 SEO 체크리스트 조회
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    checklist: getDefaultChecklist(),
    categories: ["basic", "content", "technical", "mobile", "social"],
  });
}
