import type { SEOIssue, PageAnalysisResult } from "./route";

// HTML 파싱 유틸리티
export function parseHTML(html: string) {
  const getMetaContent = (name: string): string | null => {
    const match =
      html.match(
        new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
      ) ||
      html.match(
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, "i"),
      );
    return match?.[1] || null;
  };

  const getTitle = (): string | null => {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match?.[1] || null;
  };

  const getCanonical = (): string | null => {
    const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    return match?.[1] || null;
  };

  const countHeadings = (level: number): { count: number; texts: string[] } => {
    const regex = new RegExp(`<h${level}[^>]*>([^<]*(?:<[^/h][^>]*>[^<]*)*)<\/h${level}>`, "gi");
    const texts: string[] = [];
    for (const match of html.matchAll(regex)) {
      texts.push(match[1].replace(/<[^>]*>/g, "").trim());
    }
    return { count: texts.length, texts };
  };

  const countImages = (): { total: number; withoutAlt: number } => {
    const allImages = html.match(/<img[^>]*>/gi) || [];
    const withoutAlt = allImages.filter(
      (img) => !img.includes("alt=") || img.match(/alt=["']\s*["']/i),
    ).length;
    return { total: allImages.length, withoutAlt };
  };

  const countLinks = (): { internal: number; external: number } => {
    const links = html.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
    let internal = 0,
      external = 0;
    links.forEach((link) => {
      if (link.includes("http://") || link.includes("https://")) external++;
      else internal++;
    });
    return { internal, external };
  };

  const getWordCount = (): number => {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (!bodyMatch) return 0;
    const text = bodyMatch[1]
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.split(/\s+/).filter((w) => w.length > 0).length;
  };

  return {
    title: getTitle(),
    description: getMetaContent("description"),
    robots: getMetaContent("robots"),
    canonical: getCanonical(),
    ogTitle: getMetaContent("og:title"),
    ogDescription: getMetaContent("og:description"),
    ogImage: getMetaContent("og:image"),
    hasViewport: html.includes('name="viewport"') || html.includes("name='viewport'"),
    hasCharset: html.includes("charset=") || html.includes("<meta charset"),
    h1: countHeadings(1),
    images: countImages(),
    links: countLinks(),
    wordCount: getWordCount(),
  };
}

// SEO 이슈 분석
export function analyzeIssues(
  meta: PageAnalysisResult["meta"],
  content: PageAnalysisResult["content"],
  technical: PageAnalysisResult["technical"],
): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Meta 분석
  if (!meta.title) {
    issues.push({
      type: "error",
      category: "meta",
      message: "페이지 제목(title)이 없습니다",
      suggestion: "60자 이내의 고유한 페이지 제목을 추가하세요",
    });
  } else if (meta.titleLength < 30) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `페이지 제목이 너무 짧습니다 (${meta.titleLength}자)`,
      suggestion: "30-60자 사이의 설명적인 제목을 권장합니다",
    });
  } else if (meta.titleLength > 60) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `페이지 제목이 너무 깁니다 (${meta.titleLength}자)`,
      suggestion: "검색 결과에서 잘리지 않도록 60자 이내로 줄이세요",
    });
  }

  if (!meta.description) {
    issues.push({
      type: "error",
      category: "meta",
      message: "메타 설명(description)이 없습니다",
      suggestion: "155자 이내의 페이지 설명을 추가하세요",
    });
  } else if (meta.descriptionLength < 70) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `메타 설명이 너무 짧습니다 (${meta.descriptionLength}자)`,
      suggestion: "70-155자 사이의 설명을 권장합니다",
    });
  } else if (meta.descriptionLength > 155) {
    issues.push({
      type: "warning",
      category: "meta",
      message: `메타 설명이 너무 깁니다 (${meta.descriptionLength}자)`,
      suggestion: "검색 결과에서 잘리지 않도록 155자 이내로 줄이세요",
    });
  }

  if (!meta.canonical) {
    issues.push({
      type: "warning",
      category: "meta",
      message: "Canonical URL이 설정되지 않았습니다",
      suggestion: "중복 콘텐츠 문제 방지를 위해 canonical 태그를 추가하세요",
    });
  }

  if (!meta.ogTitle || !meta.ogDescription || !meta.ogImage) {
    issues.push({
      type: "info",
      category: "meta",
      message: "Open Graph 메타태그가 불완전합니다",
      suggestion: "SNS 공유 시 미리보기를 위해 og:title, og:description, og:image를 추가하세요",
    });
  }

  // Content 분석
  if (content.h1Count === 0) {
    issues.push({
      type: "error",
      category: "content",
      message: "H1 태그가 없습니다",
      suggestion: "페이지당 하나의 H1 태그를 사용하세요",
    });
  } else if (content.h1Count > 1) {
    issues.push({
      type: "warning",
      category: "content",
      message: `H1 태그가 ${content.h1Count}개 있습니다`,
      suggestion: "페이지당 하나의 H1 태그만 사용하는 것을 권장합니다",
    });
  }

  if (content.wordCount < 300) {
    issues.push({
      type: "warning",
      category: "content",
      message: `콘텐츠가 너무 짧습니다 (${content.wordCount}단어)`,
      suggestion: "SEO를 위해 최소 300단어 이상의 콘텐츠를 권장합니다",
    });
  }

  if (content.imagesWithoutAlt > 0) {
    issues.push({
      type: "warning",
      category: "image",
      message: `${content.imagesWithoutAlt}개의 이미지에 alt 속성이 없습니다`,
      suggestion: "모든 이미지에 설명적인 alt 텍스트를 추가하세요",
    });
  }

  if (content.internalLinks < 2) {
    issues.push({
      type: "warning",
      category: "link",
      message: "내부 링크가 부족합니다",
      suggestion: "관련 페이지로의 내부 링크를 추가하여 사이트 구조를 개선하세요",
    });
  }

  // Technical 분석
  if (!technical.isHttps) {
    issues.push({
      type: "error",
      category: "technical",
      message: "HTTPS를 사용하지 않습니다",
      suggestion: "보안과 SEO를 위해 HTTPS를 적용하세요",
    });
  }

  if (!technical.hasViewport) {
    issues.push({
      type: "error",
      category: "technical",
      message: "Viewport 메타태그가 없습니다",
      suggestion: "모바일 최적화를 위해 viewport 메타태그를 추가하세요",
    });
  }

  return issues;
}

// SEO 점수 계산
export function calculateScore(issues: SEOIssue[]): number {
  let score = 100;
  issues.forEach((issue) => {
    if (issue.type === "error") score -= 10;
    else if (issue.type === "warning") score -= 5;
  });
  return Math.max(0, Math.min(100, score));
}
