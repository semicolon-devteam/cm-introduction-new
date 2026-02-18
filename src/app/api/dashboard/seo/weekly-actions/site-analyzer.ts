/**
 * 실제 사이트를 분석하여 SEO 이슈를 발견하는 모듈
 */

export interface SiteAnalysisResult {
  issues: { type: string; message: string; priority: "high" | "medium" | "low" }[];
  pageData: {
    title?: string;
    description?: string;
    h1Count: number;
    imgWithoutAlt: number;
  };
}

/**
 * 사이트를 분석하여 SEO 이슈 및 페이지 데이터를 반환
 */
export async function analyzeSite(domain: string): Promise<SiteAnalysisResult> {
  const issues: SiteAnalysisResult["issues"] = [];
  const pageData: SiteAnalysisResult["pageData"] = {
    title: "",
    description: "",
    h1Count: 0,
    imgWithoutAlt: 0,
  };

  try {
    const url = domain.startsWith("http") ? domain : `https://${domain}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "SEO-Analyzer/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      issues.push({
        type: "technical",
        message: `사이트 접근 불가 (${response.status})`,
        priority: "high",
      });
      return { issues, pageData };
    }

    const html = await response.text();

    // Title 체크
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    pageData.title = titleMatch?.[1] || "";
    if (!pageData.title) {
      issues.push({ type: "meta", message: "title 태그가 없습니다", priority: "high" });
    } else if (pageData.title.length < 30) {
      issues.push({
        type: "meta",
        message: `title이 너무 짧습니다 (${pageData.title.length}자)`,
        priority: "medium",
      });
    } else if (pageData.title.length > 60) {
      issues.push({
        type: "meta",
        message: `title이 너무 깁니다 (${pageData.title.length}자)`,
        priority: "low",
      });
    }

    // Meta description 체크
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
    );
    pageData.description = descMatch?.[1] || "";
    if (!pageData.description) {
      issues.push({ type: "meta", message: "meta description이 없습니다", priority: "high" });
    } else if (pageData.description.length < 70) {
      issues.push({
        type: "meta",
        message: `meta description이 너무 짧습니다 (${pageData.description.length}자)`,
        priority: "medium",
      });
    } else if (pageData.description.length > 160) {
      issues.push({
        type: "meta",
        message: `meta description이 너무 깁니다 (${pageData.description.length}자)`,
        priority: "low",
      });
    }

    // H1 체크
    const h1Matches = html.match(/<h1[^>]*>/gi) || [];
    pageData.h1Count = h1Matches.length;
    if (pageData.h1Count === 0) {
      issues.push({ type: "content", message: "H1 태그가 없습니다", priority: "high" });
    } else if (pageData.h1Count > 1) {
      issues.push({
        type: "content",
        message: `H1 태그가 ${pageData.h1Count}개입니다 (1개 권장)`,
        priority: "medium",
      });
    }

    // 이미지 alt 체크
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    const imgWithoutAlt = imgMatches.filter(
      (img) => !img.includes("alt=") || img.includes('alt=""'),
    ).length;
    pageData.imgWithoutAlt = imgWithoutAlt;
    if (imgWithoutAlt > 0) {
      issues.push({
        type: "image",
        message: `alt 속성이 없는 이미지가 ${imgWithoutAlt}개 있습니다`,
        priority: "medium",
      });
    }

    // 내부 링크 체크
    const internalLinks = html.match(/<a[^>]*href=["']\/[^"']*["']/gi) || [];
    if (internalLinks.length < 3) {
      issues.push({ type: "link", message: "내부 링크가 부족합니다", priority: "medium" });
    }

    // robots.txt 체크
    try {
      const robotsRes = await fetch(`${url}/robots.txt`, { signal: AbortSignal.timeout(5000) });
      if (!robotsRes.ok) {
        issues.push({
          type: "technical",
          message: "robots.txt 파일이 없습니다",
          priority: "medium",
        });
      }
    } catch {
      issues.push({ type: "technical", message: "robots.txt 확인 실패", priority: "low" });
    }

    // sitemap.xml 체크
    try {
      const sitemapRes = await fetch(`${url}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      if (!sitemapRes.ok) {
        issues.push({
          type: "technical",
          message: "sitemap.xml 파일이 없습니다",
          priority: "medium",
        });
      }
    } catch {
      issues.push({ type: "technical", message: "sitemap.xml 확인 실패", priority: "low" });
    }

    // OG 태그 체크
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["']/i);
    const ogDesc = html.match(/<meta[^>]*property=["']og:description["']/i);
    const ogImage = html.match(/<meta[^>]*property=["']og:image["']/i);
    if (!ogTitle || !ogDesc || !ogImage) {
      issues.push({ type: "meta", message: "Open Graph 태그가 불완전합니다", priority: "low" });
    }
  } catch (error) {
    issues.push({
      type: "technical",
      message: `사이트 분석 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      priority: "high",
    });
  }

  return { issues, pageData };
}
