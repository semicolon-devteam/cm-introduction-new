import { NextRequest, NextResponse } from "next/server";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  status?: "ok" | "error" | "redirect";
  statusCode?: number;
}

export interface SitemapValidationResult {
  url: string;
  found: boolean;
  valid: boolean;
  urlCount: number;
  urls: SitemapUrl[];
  issues: { type: "error" | "warning" | "info"; message: string }[];
  sitemapIndex?: { sitemaps: string[] };
}

export interface SitemapValidateResponse {
  success: boolean;
  result?: SitemapValidationResult;
  error?: string;
}

// XML에서 태그 내용 추출
function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = xml.match(regex);
  return match?.[1] || null;
}

// 모든 태그 내용 추출
function extractAllTags(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "gi");
  const matches = xml.matchAll(regex);
  const results: string[] = [];
  for (const match of matches) {
    results.push(match[1]);
  }
  return results;
}

// URL 블록 추출
function extractUrlBlocks(xml: string): string[] {
  const regex = /<url[^>]*>([\s\S]*?)<\/url>/gi;
  const matches = xml.matchAll(regex);
  const results: string[] = [];
  for (const match of matches) {
    results.push(match[1]);
  }
  return results;
}

// Sitemap Index에서 sitemap 블록 추출
function extractSitemapBlocks(xml: string): string[] {
  const regex = /<sitemap[^>]*>([\s\S]*?)<\/sitemap>/gi;
  const matches = xml.matchAll(regex);
  const results: string[] = [];
  for (const match of matches) {
    results.push(match[1]);
  }
  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, checkUrls = false } = body as {
      domain: string;
      checkUrls?: boolean;
    };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const sitemapUrl = `https://${domain.replace(/^https?:\/\//, "")}/sitemap.xml`;
    const issues: SitemapValidationResult["issues"] = [];

    // Sitemap 가져오기
    let response: Response;
    try {
      response = await fetch(sitemapUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOBot/1.0)" },
      });
    } catch {
      return NextResponse.json({
        success: true,
        result: {
          url: sitemapUrl,
          found: false,
          valid: false,
          urlCount: 0,
          urls: [],
          issues: [{ type: "error", message: "사이트맵에 접근할 수 없습니다" }],
        },
      } as SitemapValidateResponse);
    }

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        result: {
          url: sitemapUrl,
          found: false,
          valid: false,
          urlCount: 0,
          urls: [],
          issues: [{ type: "error", message: `사이트맵을 찾을 수 없습니다 (${response.status})` }],
        },
      } as SitemapValidateResponse);
    }

    const xml = await response.text();

    // XML 유효성 검사
    if (!xml.includes("<?xml") && !xml.includes("<urlset") && !xml.includes("<sitemapindex")) {
      issues.push({ type: "error", message: "유효한 XML 형식이 아닙니다" });
      return NextResponse.json({
        success: true,
        result: { url: sitemapUrl, found: true, valid: false, urlCount: 0, urls: [], issues },
      } as SitemapValidateResponse);
    }

    // Sitemap Index 확인
    if (xml.includes("<sitemapindex")) {
      const sitemapBlocks = extractSitemapBlocks(xml);
      const sitemaps = sitemapBlocks
        .map((block) => extractTag(block, "loc"))
        .filter(Boolean) as string[];

      issues.push({
        type: "info",
        message: `사이트맵 인덱스입니다 (${sitemaps.length}개 사이트맵 포함)`,
      });

      return NextResponse.json({
        success: true,
        result: {
          url: sitemapUrl,
          found: true,
          valid: true,
          urlCount: sitemaps.length,
          urls: [],
          issues,
          sitemapIndex: { sitemaps },
        },
      } as SitemapValidateResponse);
    }

    // URL 추출
    const urlBlocks = extractUrlBlocks(xml);
    const urls: SitemapUrl[] = urlBlocks.slice(0, 100).map((block) => ({
      loc: extractTag(block, "loc") || "",
      lastmod: extractTag(block, "lastmod") || undefined,
      changefreq: extractTag(block, "changefreq") || undefined,
      priority: extractTag(block, "priority") || undefined,
    }));

    // 이슈 분석
    if (urlBlocks.length === 0) {
      issues.push({ type: "error", message: "사이트맵에 URL이 없습니다" });
    } else {
      issues.push({ type: "info", message: `총 ${urlBlocks.length}개의 URL이 있습니다` });
    }

    // lastmod 검사
    const urlsWithLastmod = urls.filter((u) => u.lastmod).length;
    if (urlsWithLastmod === 0) {
      issues.push({
        type: "warning",
        message: "lastmod 태그가 없습니다. 검색엔진이 변경 시점을 알 수 없습니다",
      });
    } else if (urlsWithLastmod < urls.length) {
      issues.push({
        type: "warning",
        message: `일부 URL에 lastmod가 없습니다 (${urlsWithLastmod}/${urls.length})`,
      });
    }

    // priority 검사
    const urlsWithPriority = urls.filter((u) => u.priority).length;
    if (urlsWithPriority > 0) {
      const invalidPriorities = urls.filter((u) => {
        if (!u.priority) return false;
        const p = parseFloat(u.priority);
        return isNaN(p) || p < 0 || p > 1;
      });
      if (invalidPriorities.length > 0) {
        issues.push({ type: "warning", message: "일부 priority 값이 0-1 범위를 벗어났습니다" });
      }
    }

    // URL 상태 체크 (옵션)
    if (checkUrls && urls.length > 0) {
      const checkPromises = urls.slice(0, 10).map(async (url) => {
        try {
          const res = await fetch(url.loc, { method: "HEAD", redirect: "manual" });
          url.statusCode = res.status;
          url.status =
            res.status >= 200 && res.status < 300
              ? "ok"
              : res.status >= 300 && res.status < 400
                ? "redirect"
                : "error";
        } catch {
          url.status = "error";
        }
        return url;
      });
      await Promise.all(checkPromises);

      const errorUrls = urls.filter((u) => u.status === "error").length;
      if (errorUrls > 0) {
        issues.push({ type: "error", message: `${errorUrls}개의 URL이 접근 불가합니다` });
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        url: sitemapUrl,
        found: true,
        valid: true,
        urlCount: urlBlocks.length,
        urls,
        issues,
      },
    } as SitemapValidateResponse);
  } catch (error) {
    console.error("Sitemap validate error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "사이트맵 검증 실패" },
      { status: 500 },
    );
  }
}
