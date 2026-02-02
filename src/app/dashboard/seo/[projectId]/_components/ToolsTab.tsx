"use client";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";
import { RankChecker } from "./RankChecker";
import { PageAnalyzer } from "./PageAnalyzer";
import { CompetitorAnalyzer } from "./CompetitorAnalyzer";
import { SiteConfigValidator } from "./SiteConfigValidator";
import { MetaTagGenerator } from "./MetaTagGenerator";
import { GTMTagGenerator } from "./GTMTagGenerator";
import { IndexNowSubmitter } from "./IndexNowSubmitter";

interface ToolsTabProps {
  site: SEOSite;
  keywords: string[];
  onAddKeyword?: (keyword: string) => void;
}

export function ToolsTab({ site, keywords, onAddKeyword }: ToolsTabProps) {
  const handleAddKeyword = (keyword: string) => {
    if (onAddKeyword) {
      onAddKeyword(keyword);
    }
  };

  return (
    <div className="space-y-6">
      {/* 순위 추적 */}
      <RankChecker domain={site.domain} keywords={keywords} />

      {/* 페이지 SEO 분석 */}
      <PageAnalyzer domain={site.domain} />

      {/* 경쟁사 분석 */}
      <CompetitorAnalyzer myKeywords={keywords} onAddKeyword={handleAddKeyword} />

      {/* 사이트맵/Robots.txt 검증 */}
      <SiteConfigValidator domain={site.domain} />

      {/* 기존 도구들 */}
      <MetaTagGenerator site={site} keywords={keywords} />
      <GTMTagGenerator site={site} keywords={keywords} />
      <IndexNowSubmitter site={site} />
    </div>
  );
}
