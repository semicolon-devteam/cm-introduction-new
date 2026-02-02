"use client";

import {
  SEOInsightEngine,
  SEOTrendChart,
  CompetitorAnalysis,
  NaverSEOChecklist,
  ImageSEOAudit,
  type SEOTrendData,
} from "@app/dashboard/_components";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface SearchConsoleData {
  overview?: {
    current: { clicks: number; impressions: number; ctr: number; position: number };
    previous: { clicks: number; impressions: number; ctr: number; position: number };
    change: { clicks: number; impressions: number; ctr: number; position: number };
  };
}

interface AnalyticsData {
  metrics?: {
    activeUsers: { value: number; changePercent?: number };
    sessions: { value: number; changePercent?: number };
    bounceRate: { value: number; changePercent?: number };
  };
}

interface AnalysisTabProps {
  site: SEOSite;
  keywords: string[];
  searchConsoleData: SearchConsoleData | null;
  analyticsData: AnalyticsData | null;
  trendData: SEOTrendData[];
}

export function AnalysisTab({
  site,
  keywords,
  searchConsoleData,
  analyticsData,
  trendData,
}: AnalysisTabProps) {
  return (
    <div className="space-y-6">
      {/* 인사이트 엔진 + 트렌드 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SEOInsightEngine
          searchConsoleData={searchConsoleData?.overview}
          analyticsData={analyticsData?.metrics}
        />
        {trendData.length > 0 && <SEOTrendChart data={trendData} title="성과 트렌드 분석" />}
      </div>

      {/* 네이버 SEO 체크리스트 */}
      <NaverSEOChecklist domain={site.domain} keywords={keywords} />

      {/* 경쟁사 분석 */}
      <CompetitorAnalysis myDomain={site.domain} myKeywords={keywords} />

      {/* 이미지 SEO 진단 */}
      <ImageSEOAudit domain={site.domain} keywords={keywords} />
    </div>
  );
}
