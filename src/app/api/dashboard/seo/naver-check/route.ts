import { NextRequest, NextResponse } from "next/server";

export interface NaverCheckItem {
  id: string;
  category: "basic" | "content" | "technical" | "blog" | "store";
  title: string;
  description: string;
  status: "pass" | "warning" | "fail" | "unknown";
  priority: "high" | "medium" | "low";
  howToFix?: string;
}

export interface NaverCheckResponse {
  success: boolean;
  result?: {
    domain: string;
    score: number;
    items: NaverCheckItem[];
    recommendations: string[];
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body as { domain: string };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const items: NaverCheckItem[] = [];
    let passCount = 0;

    // 1. 네이버 웹마스터 도구 등록 체크 (robots.txt에서 Yeti 확인)
    const robotsCheck = await checkRobotsTxt(cleanDomain);
    items.push(robotsCheck);
    if (robotsCheck.status === "pass") passCount++;

    // 2. 사이트맵 체크
    const sitemapCheck = await checkSitemap(cleanDomain);
    items.push(sitemapCheck);
    if (sitemapCheck.status === "pass") passCount++;

    // 3. RSS 피드 체크
    const rssCheck = await checkRSSFeed(cleanDomain);
    items.push(rssCheck);
    if (rssCheck.status === "pass") passCount++;

    // 4. Open Graph 메타태그 체크
    const ogCheck = await checkOpenGraph(cleanDomain);
    items.push(ogCheck);
    if (ogCheck.status === "pass") passCount++;

    // 5. 모바일 최적화 체크
    const mobileCheck = await checkMobileOptimization(cleanDomain);
    items.push(mobileCheck);
    if (mobileCheck.status === "pass") passCount++;

    // 6. HTTPS 체크
    const httpsCheck = await checkHTTPS(cleanDomain);
    items.push(httpsCheck);
    if (httpsCheck.status === "pass") passCount++;

    // 기본 체크리스트 항목 추가 (수동 확인 필요)
    items.push(
      {
        id: "naver-webmaster",
        category: "basic",
        title: "네이버 서치어드바이저 등록",
        description: "네이버 서치어드바이저에 사이트를 등록하고 소유권을 인증하세요.",
        status: "unknown",
        priority: "high",
        howToFix: "https://searchadvisor.naver.com 에서 사이트 등록",
      },
      {
        id: "naver-blog",
        category: "blog",
        title: "네이버 블로그 백링크",
        description:
          "네이버 블로그에서 사이트로 연결되는 백링크가 있으면 네이버 검색에 유리합니다.",
        status: "unknown",
        priority: "medium",
        howToFix: "네이버 블로그에 관련 콘텐츠를 작성하고 사이트 링크 포함",
      },
      {
        id: "naver-place",
        category: "store",
        title: "네이버 플레이스 등록",
        description: "오프라인 비즈니스라면 네이버 플레이스에 등록하세요.",
        status: "unknown",
        priority: "low",
        howToFix: "네이버 플레이스에서 비즈니스 정보 등록",
      },
    );

    const score = Math.round((passCount / 6) * 100);

    const recommendations: string[] = [];
    if (items.some((i) => i.id === "robots-yeti" && i.status !== "pass")) {
      recommendations.push("robots.txt에서 Yeti(네이버봇)의 크롤링을 허용하세요.");
    }
    if (items.some((i) => i.id === "rss-feed" && i.status !== "pass")) {
      recommendations.push("RSS 피드를 생성하여 네이버에 콘텐츠 업데이트를 빠르게 알리세요.");
    }
    if (items.some((i) => i.id === "og-tags" && i.status !== "pass")) {
      recommendations.push(
        "Open Graph 메타태그를 추가하여 네이버 검색 결과 미리보기를 개선하세요.",
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        domain: cleanDomain,
        score,
        items,
        recommendations,
      },
    } as NaverCheckResponse);
  } catch (error) {
    console.error("Naver check error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "네이버 SEO 체크 실패" },
      { status: 500 },
    );
  }
}

async function checkRobotsTxt(domain: string): Promise<NaverCheckItem> {
  try {
    const response = await fetch(`https://${domain}/robots.txt`);
    if (!response.ok) {
      return {
        id: "robots-yeti",
        category: "technical",
        title: "Yeti (네이버봇) 크롤링 허용",
        description: "robots.txt가 없거나 접근할 수 없습니다.",
        status: "warning",
        priority: "high",
        howToFix: "robots.txt 파일을 생성하고 Yeti 봇을 허용하세요.",
      };
    }
    const content = await response.text();
    const blocksYeti =
      content.toLowerCase().includes("user-agent: yeti") &&
      content.toLowerCase().includes("disallow: /");
    return {
      id: "robots-yeti",
      category: "technical",
      title: "Yeti (네이버봇) 크롤링 허용",
      description: blocksYeti
        ? "Yeti 봇이 차단되어 있습니다."
        : "Yeti 봇의 크롤링이 허용되어 있습니다.",
      status: blocksYeti ? "fail" : "pass",
      priority: "high",
      howToFix: blocksYeti ? "robots.txt에서 Yeti 봇 차단을 해제하세요." : undefined,
    };
  } catch {
    return {
      id: "robots-yeti",
      category: "technical",
      title: "Yeti (네이버봇) 크롤링 허용",
      description: "robots.txt 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}

async function checkSitemap(domain: string): Promise<NaverCheckItem> {
  try {
    const response = await fetch(`https://${domain}/sitemap.xml`);
    return {
      id: "sitemap",
      category: "technical",
      title: "사이트맵 등록",
      description: response.ok ? "sitemap.xml이 존재합니다." : "sitemap.xml을 찾을 수 없습니다.",
      status: response.ok ? "pass" : "fail",
      priority: "high",
      howToFix: response.ok
        ? undefined
        : "sitemap.xml을 생성하고 네이버 서치어드바이저에 제출하세요.",
    };
  } catch {
    return {
      id: "sitemap",
      category: "technical",
      title: "사이트맵 등록",
      description: "사이트맵 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}

async function checkRSSFeed(domain: string): Promise<NaverCheckItem> {
  const rssPaths = ["/rss", "/rss.xml", "/feed", "/feed.xml", "/atom.xml"];
  for (const path of rssPaths) {
    try {
      const response = await fetch(`https://${domain}${path}`, { method: "HEAD" });
      if (response.ok) {
        return {
          id: "rss-feed",
          category: "content",
          title: "RSS 피드 제공",
          description: `RSS 피드가 ${path}에서 제공됩니다.`,
          status: "pass",
          priority: "medium",
        };
      }
    } catch {
      continue;
    }
  }
  return {
    id: "rss-feed",
    category: "content",
    title: "RSS 피드 제공",
    description: "RSS 피드를 찾을 수 없습니다.",
    status: "warning",
    priority: "medium",
    howToFix: "RSS 피드를 생성하여 콘텐츠 업데이트를 쉽게 배포하세요.",
  };
}

async function checkOpenGraph(domain: string): Promise<NaverCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();
    const hasOgTitle = html.includes('property="og:title"') || html.includes("property='og:title'");
    const hasOgDesc =
      html.includes('property="og:description"') || html.includes("property='og:description'");
    const hasOgImage = html.includes('property="og:image"') || html.includes("property='og:image'");
    const allPresent = hasOgTitle && hasOgDesc && hasOgImage;
    return {
      id: "og-tags",
      category: "content",
      title: "Open Graph 메타태그",
      description: allPresent
        ? "Open Graph 메타태그가 설정되어 있습니다."
        : "일부 Open Graph 메타태그가 누락되었습니다.",
      status: allPresent ? "pass" : "warning",
      priority: "medium",
      howToFix: allPresent
        ? undefined
        : "og:title, og:description, og:image 메타태그를 추가하세요.",
    };
  } catch {
    return {
      id: "og-tags",
      category: "content",
      title: "Open Graph 메타태그",
      description: "Open Graph 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "medium",
    };
  }
}

async function checkMobileOptimization(domain: string): Promise<NaverCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();
    const hasViewport = html.includes('name="viewport"') || html.includes("name='viewport'");
    return {
      id: "mobile-viewport",
      category: "technical",
      title: "모바일 최적화 (Viewport)",
      description: hasViewport
        ? "Viewport 메타태그가 설정되어 있습니다."
        : "Viewport 메타태그가 없습니다.",
      status: hasViewport ? "pass" : "fail",
      priority: "high",
      howToFix: hasViewport
        ? undefined
        : '<meta name="viewport" content="width=device-width, initial-scale=1"> 태그를 추가하세요.',
    };
  } catch {
    return {
      id: "mobile-viewport",
      category: "technical",
      title: "모바일 최적화 (Viewport)",
      description: "모바일 최적화 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}

async function checkHTTPS(domain: string): Promise<NaverCheckItem> {
  try {
    const response = await fetch(`https://${domain}`, { method: "HEAD" });
    return {
      id: "https",
      category: "technical",
      title: "HTTPS 적용",
      description: response.ok ? "HTTPS가 적용되어 있습니다." : "HTTPS 연결에 문제가 있습니다.",
      status: response.ok ? "pass" : "fail",
      priority: "high",
      howToFix: response.ok ? undefined : "SSL 인증서를 설치하고 HTTPS를 적용하세요.",
    };
  } catch {
    return {
      id: "https",
      category: "technical",
      title: "HTTPS 적용",
      description: "HTTPS 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}
