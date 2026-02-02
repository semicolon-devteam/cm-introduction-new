import { NextRequest, NextResponse } from "next/server";

interface LinkCheckResult {
  url: string;
  status: number | null;
  statusText: string;
  type: "internal" | "external";
  isWorking: boolean;
  redirectTo?: string;
  error?: string;
}

interface BrokenLinksResult {
  domain: string;
  totalLinks: number;
  workingLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  links: LinkCheckResult[];
  checkedAt: string;
}

async function checkLink(url: string, baseUrl: string): Promise<LinkCheckResult> {
  const type = url.startsWith(baseUrl) || url.startsWith("/") ? "internal" : "external";
  const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(fullUrl, {
      method: "HEAD",
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOBot/1.0)",
      },
    });

    clearTimeout(timeout);

    const isRedirect = response.status >= 300 && response.status < 400;
    const isWorking = response.status >= 200 && response.status < 400;

    return {
      url,
      status: response.status,
      statusText: response.statusText,
      type,
      isWorking,
      redirectTo: isRedirect ? response.headers.get("location") || undefined : undefined,
    };
  } catch (error) {
    return {
      url,
      status: null,
      statusText: "Failed",
      type,
      isWorking: false,
      error: error instanceof Error ? error.message : "연결 실패",
    };
  }
}

function extractLinks(html: string, _baseUrl: string): string[] {
  const links: string[] = [];
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    // 유효한 링크만 필터링
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("javascript:") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      !href.startsWith("data:")
    ) {
      // 상대 경로를 절대 경로로 변환
      if (href.startsWith("/")) {
        links.push(href);
      } else if (href.startsWith("http://") || href.startsWith("https://")) {
        links.push(href);
      }
    }
  }

  // 중복 제거
  return [...new Set(links)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, maxLinks = 50 } = body as { domain: string; maxLinks?: number };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;

    // 1. 메인 페이지 HTML 가져오기
    let html: string;
    try {
      const response = await fetch(baseUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SEOBot/1.0)",
        },
      });
      html = await response.text();
    } catch {
      return NextResponse.json(
        { success: false, error: "사이트에 접근할 수 없습니다." },
        { status: 500 },
      );
    }

    // 2. 링크 추출
    const allLinks = extractLinks(html, baseUrl);
    const linksToCheck = allLinks.slice(0, maxLinks);

    // 3. 링크 체크 (병렬 처리, 동시 10개)
    const results: LinkCheckResult[] = [];
    const batchSize = 10;

    for (let i = 0; i < linksToCheck.length; i += batchSize) {
      const batch = linksToCheck.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((link) => checkLink(link, baseUrl)));
      results.push(...batchResults);
    }

    // 4. 통계 계산
    const workingLinks = results.filter((r) => r.isWorking && !r.redirectTo).length;
    const brokenLinks = results.filter((r) => !r.isWorking).length;
    const redirectLinks = results.filter((r) => r.redirectTo).length;

    // 5. 결과 정렬 (깨진 링크 먼저)
    const sortedResults = results.sort((a, b) => {
      if (!a.isWorking && b.isWorking) return -1;
      if (a.isWorking && !b.isWorking) return 1;
      if (a.redirectTo && !b.redirectTo) return -1;
      if (!a.redirectTo && b.redirectTo) return 1;
      return 0;
    });

    const result: BrokenLinksResult = {
      domain,
      totalLinks: results.length,
      workingLinks,
      brokenLinks,
      redirectLinks,
      links: sortedResults,
      checkedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Broken links check error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "링크 체크 실패" },
      { status: 500 },
    );
  }
}
