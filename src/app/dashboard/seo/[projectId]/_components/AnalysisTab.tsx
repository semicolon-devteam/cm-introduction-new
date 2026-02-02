"use client";

import { NaverSEOChecklist } from "./NaverSEOChecklist";
import { CompetitorAnalyzer } from "./CompetitorAnalyzer";
import { ImageSEOAudit } from "./ImageSEOAudit";
import type { SEOSite } from "@/app/dashboard/_lib/seo-sites";

interface SEOTrendData {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
}

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

export function AnalysisTab({ site, keywords }: AnalysisTabProps) {
  return (
    <div className="space-y-6">
      {/* 네이버 SEO 체크리스트 */}
      <NaverSEOChecklist domain={site.domain} />

      {/* 경쟁사 분석 */}
      <CompetitorAnalyzer myKeywords={keywords} onAddKeyword={() => {}} />

      {/* 이미지 SEO 진단 */}
      <ImageSEOAudit domain={site.domain} keywords={keywords} />
    </div>
  );
}
