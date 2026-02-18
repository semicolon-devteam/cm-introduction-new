"use client";

import { useState, useRef } from "react";

import { RankChecker } from "./RankChecker";
import { PageAnalyzer } from "./PageAnalyzer";
import { CompetitorAnalyzer } from "./CompetitorAnalyzer";
import { SiteConfigValidator } from "./SiteConfigValidator";
import { MetaTagGenerator } from "./MetaTagGenerator";
import { GTMTagGenerator } from "./GTMTagGenerator";
import { IndexNowSubmitter } from "./IndexNowSubmitter";
import { NaverSEOChecklist } from "./NaverSEOChecklist";
import { GoogleSEOChecklist } from "./GoogleSEOChecklist";
import { ImageSEOAudit } from "./ImageSEOAudit";
import { OnboardingWizard } from "./OnboardingWizard";
import { CoreWebVitals } from "./CoreWebVitals";
import { BrokenLinkChecker } from "./BrokenLinkChecker";
import { SERPPreview } from "./SERPPreview";
import { RankHistoryChart } from "./RankHistoryChart";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface ToolsTabProps {
  site: SEOSite;
  keywords: string[];
  onAddKeyword?: (keyword: string) => void;
}

export function ToolsTab({ site, keywords, onAddKeyword }: ToolsTabProps) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const siteConfigRef = useRef<HTMLDivElement>(null);
  const competitorRef = useRef<HTMLDivElement>(null);
  const pageAnalyzerRef = useRef<HTMLDivElement>(null);
  const imageSeoRef = useRef<HTMLDivElement>(null);

  const handleAddKeyword = (keyword: string) => {
    if (onAddKeyword) {
      onAddKeyword(keyword);
    }
  };

  const handleNavigateToTool = (tool: string) => {
    const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      siteConfig: siteConfigRef,
      competitor: competitorRef,
      pageAnalyzer: pageAnalyzerRef,
      imageSeo: imageSeoRef,
    };
    const ref = refMap[tool];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 초보자 온보딩 가이드 */}
      {showOnboarding && (
        <OnboardingWizard
          domain={site.domain}
          onComplete={() => setShowOnboarding(false)}
          onNavigateToTool={handleNavigateToTool}
        />
      )}

      {/* 순위 추적 */}
      <RankChecker domain={site.domain} keywords={keywords} />

      {/* 순위 히스토리 차트 */}
      <RankHistoryChart domain={site.domain} keywords={keywords} />

      {/* 페이지 SEO 분석 */}
      <div ref={pageAnalyzerRef}>
        <PageAnalyzer domain={site.domain} />
      </div>

      {/* 이미지 SEO 분석 */}
      <div ref={imageSeoRef}>
        <ImageSEOAudit domain={site.domain} keywords={keywords} />
      </div>

      {/* 경쟁사 분석 */}
      <div ref={competitorRef}>
        <CompetitorAnalyzer myKeywords={keywords} onAddKeyword={handleAddKeyword} />
      </div>

      {/* Core Web Vitals */}
      <CoreWebVitals domain={site.domain} />

      {/* 검색엔진별 SEO 체크리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GoogleSEOChecklist domain={site.domain} />
        <NaverSEOChecklist domain={site.domain} />
      </div>

      {/* SERP 미리보기 & 깨진 링크 체커 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SERPPreview domain={site.domain} />
        <BrokenLinkChecker domain={site.domain} />
      </div>

      {/* 사이트맵/Robots.txt 검증 */}
      <div ref={siteConfigRef}>
        <SiteConfigValidator domain={site.domain} />
      </div>

      {/* 기존 도구들 */}
      <MetaTagGenerator site={site} keywords={keywords} />
      <GTMTagGenerator site={site} keywords={keywords} />
      <IndexNowSubmitter site={site} />
    </div>
  );
}
