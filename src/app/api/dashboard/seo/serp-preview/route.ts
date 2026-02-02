import { NextRequest, NextResponse } from "next/server";

interface SERPPreviewData {
  url: string;
  title: string;
  description: string;
  favicon?: string;
  structuredData?: {
    type: string;
    name?: string;
    rating?: { value: number; count: number };
    price?: string;
    availability?: string;
    breadcrumbs?: string[];
    sitelinks?: { title: string; url: string }[];
  };
  ogImage?: string;
  publishedDate?: string;
  author?: string;
  issues: {
    type: "error" | "warning" | "info";
    message: string;
    field: string;
  }[];
}

function extractMetaContent(html: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i"),
    new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${name}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractStructuredData(html: string): SERPPreviewData["structuredData"] | undefined {
  const jsonLdMatch = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!jsonLdMatch) return undefined;

  try {
    const data = JSON.parse(jsonLdMatch[1]);
    const item = Array.isArray(data) ? data[0] : data;

    const result: SERPPreviewData["structuredData"] = {
      type: item["@type"] || "Unknown",
    };

    if (item.name) result.name = item.name;
    if (item.aggregateRating) {
      result.rating = {
        value: parseFloat(item.aggregateRating.ratingValue) || 0,
        count: parseInt(item.aggregateRating.reviewCount) || 0,
      };
    }
    if (item.offers) {
      result.price = item.offers.price
        ? `${item.offers.priceCurrency || ""} ${item.offers.price}`
        : undefined;
      result.availability = item.offers.availability?.replace("https://schema.org/", "");
    }
    if (item.breadcrumb?.itemListElement) {
      result.breadcrumbs = item.breadcrumb.itemListElement.map((b: { name: string }) => b.name);
    }

    return result;
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url) {
      return NextResponse.json({ success: false, error: "URL이 필요합니다." }, { status: 400 });
    }

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    // HTML 가져오기
    let html: string;
    try {
      const response = await fetch(fullUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      });
      html = await response.text();
    } catch {
      return NextResponse.json(
        { success: false, error: "사이트에 접근할 수 없습니다." },
        { status: 500 },
      );
    }

    // 메타 데이터 추출
    const title = extractMetaContent(html, "og:title") || extractTitle(html);
    const description =
      extractMetaContent(html, "og:description") || extractMetaContent(html, "description") || "";
    const ogImage = extractMetaContent(html, "og:image") || undefined;
    const author = extractMetaContent(html, "author") || undefined;
    const publishedDate =
      extractMetaContent(html, "article:published_time") ||
      extractMetaContent(html, "datePublished") ||
      undefined;

    // Favicon 추출
    const faviconMatch = html.match(
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i,
    );
    let favicon = faviconMatch ? faviconMatch[1] : undefined;
    if (favicon && !favicon.startsWith("http")) {
      const urlObj = new URL(fullUrl);
      favicon = favicon.startsWith("/")
        ? `${urlObj.origin}${favicon}`
        : `${urlObj.origin}/${favicon}`;
    }

    // 구조화 데이터 추출
    const structuredData = extractStructuredData(html);

    // 이슈 분석
    const issues: SERPPreviewData["issues"] = [];

    // 타이틀 체크
    if (!title) {
      issues.push({ type: "error", message: "타이틀이 없습니다", field: "title" });
    } else if (title.length < 30) {
      issues.push({
        type: "warning",
        message: "타이틀이 너무 짧습니다 (30자 이상 권장)",
        field: "title",
      });
    } else if (title.length > 60) {
      issues.push({
        type: "warning",
        message: "타이틀이 너무 깁니다 (60자 이하 권장)",
        field: "title",
      });
    }

    // 설명 체크
    if (!description) {
      issues.push({ type: "error", message: "메타 설명이 없습니다", field: "description" });
    } else if (description.length < 70) {
      issues.push({
        type: "warning",
        message: "메타 설명이 너무 짧습니다 (70자 이상 권장)",
        field: "description",
      });
    } else if (description.length > 160) {
      issues.push({
        type: "warning",
        message: "메타 설명이 너무 깁니다 (160자 이하 권장)",
        field: "description",
      });
    }

    // OG 이미지 체크
    if (!ogImage) {
      issues.push({ type: "warning", message: "OG 이미지가 없습니다", field: "ogImage" });
    }

    // 구조화 데이터 체크
    if (!structuredData) {
      issues.push({
        type: "info",
        message: "구조화 데이터(JSON-LD)가 없습니다",
        field: "structuredData",
      });
    }

    const result: SERPPreviewData = {
      url: fullUrl,
      title,
      description,
      favicon,
      structuredData,
      ogImage,
      publishedDate,
      author,
      issues,
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("SERP preview error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "SERP 미리보기 실패" },
      { status: 500 },
    );
  }
}
