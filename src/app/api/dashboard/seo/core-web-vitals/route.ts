import { NextRequest, NextResponse } from "next/server";

interface CoreWebVitalsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  rating: "good" | "needs-improvement" | "poor";
  description: string;
  threshold: { good: number; poor: number };
}

interface CoreWebVitalsResult {
  url: string;
  strategy: "mobile" | "desktop";
  performanceScore: number;
  metrics: CoreWebVitalsMetric[];
  opportunities: {
    id: string;
    title: string;
    description: string;
    savings?: string;
  }[];
  diagnostics: {
    id: string;
    title: string;
    description: string;
  }[];
  fetchedAt: string;
}

function getRating(
  value: number,
  thresholds: { good: number; poor: number },
): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, strategy = "mobile" } = body as { url: string; strategy?: "mobile" | "desktop" };

    if (!url) {
      return NextResponse.json({ success: false, error: "URL이 필요합니다." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    apiUrl.searchParams.set("url", url.startsWith("http") ? url : `https://${url}`);
    apiUrl.searchParams.set("strategy", strategy);
    apiUrl.searchParams.set(
      "category",
      ["performance", "accessibility", "best-practices", "seo"].join(","),
    );
    if (apiKey) {
      apiUrl.searchParams.set("key", apiKey);
    }

    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      const errorText = await response.text();
      console.error("PageSpeed API error:", errorText);
      return NextResponse.json(
        { success: false, error: "PageSpeed API 호출 실패" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse?.audits || {};

    // Core Web Vitals 메트릭 추출
    const metrics: CoreWebVitalsMetric[] = [];

    // LCP (Largest Contentful Paint)
    if (audits["largest-contentful-paint"]) {
      const lcpValue = audits["largest-contentful-paint"].numericValue / 1000;
      metrics.push({
        id: "lcp",
        name: "LCP (Largest Contentful Paint)",
        value: Math.round(lcpValue * 100) / 100,
        unit: "s",
        rating: getRating(lcpValue * 1000, { good: 2500, poor: 4000 }),
        description: "페이지에서 가장 큰 콘텐츠가 표시되는 시간",
        threshold: { good: 2.5, poor: 4.0 },
      });
    }

    // FID → INP (Interaction to Next Paint) - 대체 지표
    if (audits["interactive"]) {
      const ttiValue = audits["interactive"].numericValue / 1000;
      metrics.push({
        id: "tti",
        name: "TTI (Time to Interactive)",
        value: Math.round(ttiValue * 100) / 100,
        unit: "s",
        rating: getRating(ttiValue * 1000, { good: 3800, poor: 7300 }),
        description: "페이지가 완전히 상호작용 가능해지는 시간",
        threshold: { good: 3.8, poor: 7.3 },
      });
    }

    // CLS (Cumulative Layout Shift)
    if (audits["cumulative-layout-shift"]) {
      const clsValue = audits["cumulative-layout-shift"].numericValue;
      metrics.push({
        id: "cls",
        name: "CLS (Cumulative Layout Shift)",
        value: Math.round(clsValue * 1000) / 1000,
        unit: "",
        rating: getRating(clsValue, { good: 0.1, poor: 0.25 }),
        description: "페이지 로드 중 레이아웃 이동 정도",
        threshold: { good: 0.1, poor: 0.25 },
      });
    }

    // FCP (First Contentful Paint)
    if (audits["first-contentful-paint"]) {
      const fcpValue = audits["first-contentful-paint"].numericValue / 1000;
      metrics.push({
        id: "fcp",
        name: "FCP (First Contentful Paint)",
        value: Math.round(fcpValue * 100) / 100,
        unit: "s",
        rating: getRating(fcpValue * 1000, { good: 1800, poor: 3000 }),
        description: "첫 번째 콘텐츠가 화면에 표시되는 시간",
        threshold: { good: 1.8, poor: 3.0 },
      });
    }

    // TBT (Total Blocking Time)
    if (audits["total-blocking-time"]) {
      const tbtValue = audits["total-blocking-time"].numericValue;
      metrics.push({
        id: "tbt",
        name: "TBT (Total Blocking Time)",
        value: Math.round(tbtValue),
        unit: "ms",
        rating: getRating(tbtValue, { good: 200, poor: 600 }),
        description: "메인 스레드가 차단된 총 시간",
        threshold: { good: 200, poor: 600 },
      });
    }

    // Speed Index
    if (audits["speed-index"]) {
      const siValue = audits["speed-index"].numericValue / 1000;
      metrics.push({
        id: "si",
        name: "Speed Index",
        value: Math.round(siValue * 100) / 100,
        unit: "s",
        rating: getRating(siValue * 1000, { good: 3400, poor: 5800 }),
        description: "콘텐츠가 시각적으로 표시되는 속도",
        threshold: { good: 3.4, poor: 5.8 },
      });
    }

    // 개선 기회 추출
    const opportunities: CoreWebVitalsResult["opportunities"] = [];
    const opportunityIds = [
      "render-blocking-resources",
      "unused-css-rules",
      "unused-javascript",
      "modern-image-formats",
      "uses-optimized-images",
      "uses-text-compression",
      "uses-responsive-images",
      "efficient-animated-content",
      "duplicated-javascript",
      "legacy-javascript",
    ];

    for (const id of opportunityIds) {
      const audit = audits[id];
      if (audit && audit.score !== null && audit.score < 1) {
        opportunities.push({
          id,
          title: audit.title,
          description: audit.description?.replace(/<[^>]*>/g, "") || "",
          savings: audit.displayValue,
        });
      }
    }

    // 진단 정보 추출
    const diagnostics: CoreWebVitalsResult["diagnostics"] = [];
    const diagnosticIds = [
      "dom-size",
      "critical-request-chains",
      "font-display",
      "largest-contentful-paint-element",
      "layout-shift-elements",
      "long-tasks",
      "non-composited-animations",
      "unsized-images",
    ];

    for (const id of diagnosticIds) {
      const audit = audits[id];
      if (audit && audit.score !== null && audit.score < 1) {
        diagnostics.push({
          id,
          title: audit.title,
          description: audit.description?.replace(/<[^>]*>/g, "") || "",
        });
      }
    }

    const performanceScore = Math.round((lighthouse?.categories?.performance?.score || 0) * 100);

    const result: CoreWebVitalsResult = {
      url: url.startsWith("http") ? url : `https://${url}`,
      strategy,
      performanceScore,
      metrics,
      opportunities: opportunities.slice(0, 5),
      diagnostics: diagnostics.slice(0, 5),
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Core Web Vitals check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Core Web Vitals 체크 실패",
      },
      { status: 500 },
    );
  }
}
