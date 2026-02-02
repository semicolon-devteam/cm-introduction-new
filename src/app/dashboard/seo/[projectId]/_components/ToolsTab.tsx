"use client";

import { useState, useRef } from "react";
import type { SEOSite } from "@app/dashboard/_lib/seo-sites";
import { RankChecker } from "./RankChecker";
import { PageAnalyzer } from "./PageAnalyzer";
import { CompetitorAnalyzer } from "./CompetitorAnalyzer";
import { SiteConfigValidator } from "./SiteConfigValidator";
import { MetaTagGenerator } from "./MetaTagGenerator";
import { GTMTagGenerator } from "./GTMTagGenerator";
import { IndexNowSubmitter } from "./IndexNowSubmitter";
import { WeeklyMissionCard } from "./WeeklyMissionCard";
import { NaverSEOChecklist } from "./NaverSEOChecklist";
import { GoogleSEOChecklist } from "./GoogleSEOChecklist";
import { ImageSEOAudit } from "./ImageSEOAudit";
import { OnboardingWizard } from "./OnboardingWizard";

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
  const weeklyMissionRef = useRef<HTMLDivElement>(null);

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
      weeklyMission: weeklyMissionRef,
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

      {/* 이번 주 SEO 미션 */}
      <div ref={weeklyMissionRef}>
        <WeeklyMissionCard domain={site.domain} keywords={keywords} />
      </div>

      {/* 순위 추적 */}
      <RankChecker domain={site.domain} keywords={keywords} />

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

      {/* 검색엔진별 SEO 체크리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GoogleSEOChecklist domain={site.domain} />
        <NaverSEOChecklist domain={site.domain} />
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
