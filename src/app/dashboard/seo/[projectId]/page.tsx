/* eslint-disable max-lines */
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Target,
  Zap,
  Settings,
  RefreshCw,
  Loader2,
  Wrench,
  FileText,
} from "lucide-react";

import {
  getSEOSite,
  getSiteKeywords,
  saveSiteStats,
  type SEOSite,
} from "@/app/dashboard/_lib/seo-sites";

interface SEOTrendData {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
}

// 탭 컴포넌트 임포트 (분리된 파일)
import { OverviewTab } from "./_components/OverviewTab";
import { KeywordsTab } from "./_components/KeywordsTab";
import { ToolsTab } from "./_components/ToolsTab";
import { AnalysisTab } from "./_components/AnalysisTab";
import { ReportsTab } from "./_components/ReportsTab";
import { SettingsTab } from "./_components/SettingsTab";

type SiteTab = "overview" | "keywords" | "tools" | "analysis" | "reports" | "settings";

interface SearchConsoleData {
  connected: boolean;
  overview?: {
    current: { clicks: number; impressions: number; ctr: number; position: number };
    previous: { clicks: number; impressions: number; ctr: number; position: number };
    change: { clicks: number; impressions: number; ctr: number; position: number };
  };
  dailyData?: Array<{
    date: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topQueries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
  }>;
}

interface AnalyticsData {
  connected: boolean;
  metrics?: {
    activeUsers: { value: number; changePercent?: number };
    sessions: { value: number; changePercent?: number };
    bounceRate: { value: number; changePercent?: number };
  };
}

export default function SiteSEOPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;

  // URL 쿼리에서 초기 탭 설정
  const initialTab = (searchParams.get("tab") as SiteTab) || "overview";

  const [site, setSite] = useState<SEOSite | null>(null);
  const [activeTab, setActiveTab] = useState<SiteTab>(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [searchConsoleData, setSearchConsoleData] = useState<SearchConsoleData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  // Load site config
  useEffect(() => {
    const loadedSite = getSEOSite(projectId);
    if (!loadedSite) {
      router.push("/dashboard/seo");
      return;
    }
    setSite(loadedSite);
    setKeywords(getSiteKeywords(projectId));
    setIsLoading(false);
  }, [projectId, router]);

  // Load data
  const loadData = useCallback(async () => {
    if (!site) return;

    try {
      const promises: Promise<Response>[] = [];

      if (site.searchConsole?.enabled) {
        promises.push(
          fetch(
            `/api/dashboard/search-console?period=28days&siteUrl=${encodeURIComponent(site.searchConsole.siteUrl)}`,
          ),
        );
      }

      if (site.analytics?.enabled && site.analytics.propertyId) {
        promises.push(
          fetch(
            `/api/dashboard/analytics?period=30days&propertyId=${encodeURIComponent(site.analytics.propertyId)}`,
          ),
        );
      }

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map((r) => r.json()));

      let scIndex = 0;
      if (site.searchConsole?.enabled) {
        const scData = results[scIndex];
        setSearchConsoleData(scData);

        if (scData.connected && scData.overview?.current) {
          saveSiteStats(projectId, {
            clicks: scData.overview.current.clicks || 0,
            impressions: scData.overview.current.impressions || 0,
            position: scData.overview.current.position || 0,
            ctr: scData.overview.current.ctr || 0,
            keywordCount: keywords.length,
          });
        }
        scIndex++;
      }

      if (site.analytics?.enabled) {
        setAnalyticsData(results[scIndex]);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }, [site, projectId, keywords.length]);

  useEffect(() => {
    if (site) {
      void loadData();
    }
  }, [site, loadData]);

  // Trend data
  const trendData: SEOTrendData[] =
    searchConsoleData?.dailyData?.map((d) => ({
      date: d.date,
      clicks: d.clicks,
      impressions: d.impressions,
      ctr: d.ctr,
      position: d.position,
    })) || [];

  if (isLoading || !site) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/seo"
              className="p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{site.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{site.name}</h1>
                <p className="text-sm text-[#909296]">{site.domain}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => void loadData()}
            className="p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-1 mb-6 bg-[#1a1b23] rounded-lg p-1 w-fit overflow-x-auto">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<Activity className="w-4 h-4" />}
            label="개요"
          />
          <TabButton
            active={activeTab === "keywords"}
            onClick={() => setActiveTab("keywords")}
            icon={<Target className="w-4 h-4" />}
            label="키워드"
          />
          <TabButton
            active={activeTab === "tools"}
            onClick={() => setActiveTab("tools")}
            icon={<Wrench className="w-4 h-4" />}
            label="도구"
          />
          <TabButton
            active={activeTab === "analysis"}
            onClick={() => setActiveTab("analysis")}
            icon={<Zap className="w-4 h-4" />}
            label="분석"
          />
          <TabButton
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            icon={<FileText className="w-4 h-4" />}
            label="리포트"
          />
          <TabButton
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon={<Settings className="w-4 h-4" />}
            label="설정"
          />
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "overview" && (
          <OverviewTab
            site={site}
            searchConsoleData={searchConsoleData}
            analyticsData={analyticsData}
            trendData={trendData}
            keywords={keywords}
          />
        )}
        {activeTab === "keywords" && (
          <KeywordsTab
            site={site}
            keywords={keywords}
            setKeywords={setKeywords}
            searchConsoleData={searchConsoleData}
            analyticsData={analyticsData}
          />
        )}
        {activeTab === "tools" && (
          <ToolsTab
            site={site}
            keywords={keywords}
            onAddKeyword={(keyword) => {
              if (!keywords.includes(keyword)) {
                setKeywords([...keywords, keyword]);
              }
            }}
          />
        )}
        {activeTab === "analysis" && (
          <AnalysisTab
            site={site}
            keywords={keywords}
            searchConsoleData={searchConsoleData}
            analyticsData={analyticsData}
            trendData={trendData}
          />
        )}
        {activeTab === "reports" && (
          <ReportsTab site={site} keywords={keywords} searchConsoleData={searchConsoleData} />
        )}
        {activeTab === "settings" && <SettingsTab site={site} />}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${
        active ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
