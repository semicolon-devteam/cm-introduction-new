"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Activity,
  Target,
  FileText,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  RefreshCw,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import {
  GoogleAnalyticsCard,
  SearchConsoleCard,
  SEOTaskManager,
  SEOInsightEngine,
  SEOTrendChart,
  SEOPlatformComparison,
  WeeklyMissionCard,
  KeywordRankingTracker,
  CompetitorAnalysis,
  NaverSEOChecklist,
  ImageSEOAudit,
  SEOOnboardingWizard,
  SEOGlossary,
  SEOTutorial,
  type SEOTrendData,
} from "../_components";

type SEOTab = "overview" | "tasks" | "insights" | "reports" | "learn" | "settings";

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
}

interface AnalyticsData {
  connected: boolean;
  metrics?: {
    activeUsers: { value: number; changePercent?: number };
    sessions: { value: number; changePercent?: number };
    bounceRate: { value: number; changePercent?: number };
  };
  dailyData?: Array<{ date: string; activeUsers: number; sessions: number; pageViews: number }>;
}

export default function SEODashboardPage() {
  const [activeTab, setActiveTab] = useState<SEOTab>("overview");
  const [searchConsoleData, setSearchConsoleData] = useState<SearchConsoleData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [scResponse, gaResponse] = await Promise.all([
        fetch("/api/dashboard/search-console?period=28days"),
        fetch("/api/dashboard/analytics?period=30days"),
      ]);

      const scData = await scResponse.json();
      const gaData = await gaResponse.json();

      setSearchConsoleData(scData);
      setAnalyticsData(gaData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // 트렌드 데이터 변환
  const trendData: SEOTrendData[] =
    searchConsoleData?.dailyData?.map((d) => ({
      date: d.date,
      clicks: d.clicks,
      impressions: d.impressions,
      ctr: d.ctr,
      position: d.position,
    })) || [];

  // 플랫폼 비교 데이터 (목업 - 실제로는 API에서 가져와야 함)
  const platformData = [
    {
      platform: "Google",
      clicks: searchConsoleData?.overview?.current.clicks || 0,
      impressions: searchConsoleData?.overview?.current.impressions || 0,
    },
    { platform: "Naver", clicks: 0, impressions: 0 },
    { platform: "Bing", clicks: 0, impressions: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-400" />
                SEO Command Center
              </h1>
              <p className="text-sm text-[#909296] mt-1">검색 엔진 최적화 통합 관리</p>
            </div>
          </div>
          <button
            onClick={() => void loadData()}
            disabled={isLoading}
            className={`p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-lg transition-colors ${isLoading ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-1 mb-6 bg-[#1a1b23] rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "overview"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            개요
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "tasks"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <Target className="w-4 h-4" />
            작업 관리
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "insights"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            인사이트
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "reports"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            리포트
          </button>
          <button
            onClick={() => setActiveTab("learn")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "learn"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            학습
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "settings"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            설정
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "overview" && (
          <SEOOverviewTab
            searchConsoleData={searchConsoleData}
            analyticsData={analyticsData}
            trendData={trendData}
            platformData={platformData}
            isLoading={isLoading}
          />
        )}
        {activeTab === "tasks" && <SEOTasksTab />}
        {activeTab === "insights" && (
          <SEOInsightsTab
            searchConsoleData={searchConsoleData}
            analyticsData={analyticsData}
            trendData={trendData}
          />
        )}
        {activeTab === "reports" && <SEOReportsTab />}
        {activeTab === "learn" && <SEOLearnTab />}
        {activeTab === "settings" && <SEOSettingsTab />}
      </main>
    </div>
  );
}

// 개요 탭
function SEOOverviewTab({
  searchConsoleData,
  analyticsData,
  trendData,
  platformData,
  isLoading,
}: {
  searchConsoleData: SearchConsoleData | null;
  analyticsData: AnalyticsData | null;
  trendData: SEOTrendData[];
  platformData: Array<{ platform: string; clicks: number; impressions: number }>;
  isLoading: boolean;
}) {
  // 빠른 통계 계산
  const stats = {
    totalClicks: searchConsoleData?.overview?.current.clicks || 0,
    clicksChange: searchConsoleData?.overview?.change.clicks || 0,
    avgPosition: searchConsoleData?.overview?.current.position || 0,
    positionChange: searchConsoleData?.overview?.change.position || 0,
    totalSessions: analyticsData?.metrics?.sessions.value || 0,
    sessionsChange: analyticsData?.metrics?.sessions.changePercent || 0,
    bounceRate: analyticsData?.metrics?.bounceRate.value || 0,
    bounceChange: analyticsData?.metrics?.bounceRate.changePercent || 0,
  };

  return (
    <div className="space-y-6">
      {/* 온보딩 위자드 */}
      <SEOOnboardingWizard />

      {/* 빠른 현황 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          label="총 클릭수"
          value={stats.totalClicks.toLocaleString()}
          subtext={`${stats.clicksChange > 0 ? "+" : ""}${stats.clicksChange}% 변화`}
          trend={stats.clicksChange > 0 ? "up" : stats.clicksChange < 0 ? "down" : "neutral"}
          loading={isLoading}
        />
        <QuickStatCard
          icon={<Target className="w-5 h-5 text-amber-400" />}
          label="평균 순위"
          value={stats.avgPosition.toFixed(1)}
          subtext={`${stats.positionChange > 0 ? "▼" : stats.positionChange < 0 ? "▲" : ""} ${Math.abs(stats.positionChange).toFixed(1)} 변화`}
          trend={stats.positionChange < 0 ? "up" : stats.positionChange > 0 ? "down" : "neutral"}
          loading={isLoading}
        />
        <QuickStatCard
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          label="총 세션"
          value={stats.totalSessions.toLocaleString()}
          subtext={`${stats.sessionsChange > 0 ? "+" : ""}${stats.sessionsChange}% 변화`}
          trend={stats.sessionsChange > 0 ? "up" : stats.sessionsChange < 0 ? "down" : "neutral"}
          loading={isLoading}
        />
        <QuickStatCard
          icon={<AlertCircle className="w-5 h-5 text-red-400" />}
          label="이탈률"
          value={`${stats.bounceRate}%`}
          subtext={`${stats.bounceChange > 0 ? "+" : ""}${stats.bounceChange}% 변화`}
          trend={stats.bounceChange < 0 ? "up" : stats.bounceChange > 0 ? "down" : "neutral"}
          loading={isLoading}
        />
      </div>

      {/* AI 주간 미션 - 핵심 기능 */}
      <WeeklyMissionCard
        projectId="global"
        domain="jungchipan.net"
        keywords={["정치판", "정치 뉴스", "국회"]}
        searchConsoleData={
          searchConsoleData?.overview?.current
            ? {
                clicks: searchConsoleData.overview.current.clicks,
                impressions: searchConsoleData.overview.current.impressions,
                ctr: searchConsoleData.overview.current.ctr / 100,
                position: searchConsoleData.overview.current.position,
              }
            : undefined
        }
      />

      {/* 키워드 순위 추적 */}
      <KeywordRankingTracker
        projectId="global"
        keywords={["정치판", "정치 뉴스", "국회", "정치", "선거", "여론"]}
      />

      {/* Analytics + Search Console */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GoogleAnalyticsCard />
        <SearchConsoleCard />
      </div>

      {/* 트렌드 차트 + 플랫폼 비교 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SEOTrendChart data={trendData} title="SEO 성과 트렌드" />
        </div>
        <SEOPlatformComparison data={platformData} />
      </div>

      {/* 인사이트 엔진 미리보기 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SEOInsightEngine
          searchConsoleData={searchConsoleData?.overview}
          analyticsData={analyticsData?.metrics}
        />
        {/* 프로젝트 바로가기 */}
        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">프로젝트별 SEO</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/seo/jungchipan/keywords"
              className="flex items-center gap-3 p-4 bg-[#25262b] rounded-lg hover:bg-[#2a2b33] transition-colors group"
            >
              <span className="text-2xl">🏛️</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-white">정치판</span>
                <p className="text-xs text-[#5c5f66]">jungchipan.net</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#5c5f66] group-hover:text-white" />
            </Link>
            <Link
              href="/dashboard/seo/land/keywords"
              className="flex items-center gap-3 p-4 bg-[#25262b] rounded-lg hover:bg-[#2a2b33] transition-colors group"
            >
              <span className="text-2xl">🏠</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-white">랜드</span>
                <p className="text-xs text-[#5c5f66]">land.example.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#5c5f66] group-hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 작업 관리 탭
function SEOTasksTab() {
  return (
    <div className="space-y-6">
      {/* AI 주간 미션 - 메인 */}
      <WeeklyMissionCard
        projectId="global"
        domain="jungchipan.net"
        keywords={["정치판", "정치 뉴스", "국회"]}
      />

      {/* 키워드 순위 추적 */}
      <KeywordRankingTracker
        projectId="global"
        keywords={["정치판", "정치 뉴스", "국회", "정치", "선거", "여론"]}
      />

      {/* 네이버 SEO 체크리스트 */}
      <NaverSEOChecklist
        domain="jungchipan.net"
        keywords={["정치판", "정치 뉴스", "국회", "정치", "선거", "여론"]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SEOTaskManager />
        <div className="space-y-6">
          {/* 작업 팁 */}
          <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-white">SEO 작업 가이드</span>
            </div>
            <div className="space-y-3">
              <TaskTip
                priority="high"
                title="기술적 SEO"
                tips={["사이트맵 업데이트", "robots.txt 점검", "구조화 데이터 마크업"]}
              />
              <TaskTip
                priority="medium"
                title="콘텐츠 최적화"
                tips={["메타 태그 최적화", "헤딩 태그 구조화", "이미지 alt 속성"]}
              />
              <TaskTip
                priority="low"
                title="성능 개선"
                tips={["Core Web Vitals 개선", "이미지 압축", "캐싱 설정"]}
              />
            </div>
          </div>
          {/* 빠른 링크 */}
          <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
            <div className="flex items-center gap-2 mb-4">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">유용한 도구</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ExternalToolLink
                href="https://search.google.com/search-console"
                label="Search Console"
              />
              <ExternalToolLink href="https://pagespeed.web.dev" label="PageSpeed" />
              <ExternalToolLink href="https://validator.schema.org" label="Schema Validator" />
              <ExternalToolLink href="https://www.indexnow.org" label="IndexNow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 인사이트 탭
function SEOInsightsTab({
  searchConsoleData,
  analyticsData,
  trendData,
}: {
  searchConsoleData: SearchConsoleData | null;
  analyticsData: AnalyticsData | null;
  trendData: SEOTrendData[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SEOInsightEngine
          searchConsoleData={searchConsoleData?.overview}
          analyticsData={analyticsData?.metrics}
        />
        <SEOTrendChart data={trendData} title="성과 트렌드 분석" />
      </div>

      {/* 이상 탐지 설명 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-white">인사이트 엔진 안내</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#25262b] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-white">이상 탐지</span>
            </div>
            <p className="text-xs text-[#909296]">
              클릭수, 노출수, CTR의 급격한 변화를 감지하고 알려드립니다.
            </p>
          </div>
          <div className="bg-[#25262b] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">트렌드 분석</span>
            </div>
            <p className="text-xs text-[#909296]">
              장기적인 성과 추이를 분석하여 개선 방향을 제안합니다.
            </p>
          </div>
          <div className="bg-[#25262b] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">기회 발견</span>
            </div>
            <p className="text-xs text-[#909296]">
              순위 개선 기회, CTR 최적화 등 성과 개선 포인트를 발견합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 경쟁사 분석 */}
      <CompetitorAnalysis
        myDomain="jungchipan.net"
        myKeywords={["정치판", "정치 뉴스", "국회", "정치", "선거", "여론"]}
      />

      {/* 이미지 SEO 진단 */}
      <ImageSEOAudit domain="jungchipan.net" keywords={["정치판", "정치 뉴스", "국회"]} />
    </div>
  );
}

// 리포트 탭
function SEOReportsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">SEO 리포트</h2>
        <Link
          href="/dashboard/seo/jungchipan/keywords"
          className="px-3 py-1.5 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary/90"
        >
          리포트 생성
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <h3 className="text-sm font-medium text-white mb-2">주간 SEO 리포트</h3>
          <p className="text-xs text-[#909296] mb-4">매주 자동 생성되는 SEO 성과 리포트</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5c5f66]">프로젝트별 키워드 페이지에서 생성 가능</span>
            <Link
              href="/dashboard/seo/jungchipan/keywords"
              className="text-xs text-brand-primary hover:underline"
            >
              생성하기 →
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <h3 className="text-sm font-medium text-white mb-2">월간 SEO 리포트</h3>
          <p className="text-xs text-[#909296] mb-4">월별 SEO 트렌드 및 개선 현황</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5c5f66]">준비 중</span>
          </div>
        </div>

        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 md:col-span-2">
          <h3 className="text-sm font-medium text-white mb-2">경쟁사 분석 리포트</h3>
          <p className="text-xs text-[#909296] mb-4">경쟁사 키워드 및 순위 비교</p>
          <div className="text-center py-8 text-[#5c5f66]">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">준비 중입니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 학습 탭
function SEOLearnTab() {
  return (
    <div className="space-y-6">
      {/* 온보딩 위자드 (전체 보기) */}
      <SEOOnboardingWizard />

      {/* 튜토리얼 + 용어사전 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SEOTutorial />
        <SEOGlossary />
      </div>

      {/* 추가 리소스 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-5 h-5 text-cyan-400" />
          <span className="font-medium text-white">추가 학습 리소스</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href="https://developers.google.com/search/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#25262b] rounded-lg hover:bg-[#2a2b33] transition-colors"
          >
            <span className="text-xl">🔍</span>
            <div>
              <p className="text-sm font-medium text-white">Google SEO 가이드</p>
              <p className="text-xs text-gray-500">공식 문서</p>
            </div>
          </a>
          <a
            href="https://searchadvisor.naver.com/guide"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#25262b] rounded-lg hover:bg-[#2a2b33] transition-colors"
          >
            <span className="text-xl">🌐</span>
            <div>
              <p className="text-sm font-medium text-white">네이버 SEO 가이드</p>
              <p className="text-xs text-gray-500">서치어드바이저</p>
            </div>
          </a>
          <a
            href="https://web.dev/learn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#25262b] rounded-lg hover:bg-[#2a2b33] transition-colors"
          >
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm font-medium text-white">Web.dev 학습</p>
              <p className="text-xs text-gray-500">성능 최적화</p>
            </div>
          </a>
          <a
            href="https://schema.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#25262b] rounded-lg hover:bg-[#2a2b33] transition-colors"
          >
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm font-medium text-white">Schema.org</p>
              <p className="text-xs text-gray-500">구조화 데이터</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// 설정 탭
function SEOSettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">SEO 설정</h2>

      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] divide-y divide-[#373A40]">
        {/* Google Analytics */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Google Analytics</h3>
              <p className="text-xs text-[#909296] mt-1">GA4 Property 연동</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-amber-500/20 text-amber-400">
              설정 필요
            </span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">
            환경 변수: GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY
          </div>
        </div>

        {/* Search Console */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Google Search Console</h3>
              <p className="text-xs text-[#909296] mt-1">검색 성과 데이터 연동</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-400">
              연결됨
            </span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">환경 변수: SEARCH_CONSOLE_SITE_URL</div>
        </div>

        {/* Naver */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Naver Search Advisor</h3>
              <p className="text-xs text-[#909296] mt-1">네이버 검색 노출 현황</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-[#373A40] text-[#909296]">준비 중</span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">
            환경 변수: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
          </div>
        </div>

        {/* Meta */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Meta Business</h3>
              <p className="text-xs text-[#909296] mt-1">소셜 트래픽 분석</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-[#373A40] text-[#909296]">준비 중</span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">
            환경 변수: META_ACCESS_TOKEN, META_PIXEL_ID
          </div>
        </div>

        {/* IndexNow */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">IndexNow</h3>
              <p className="text-xs text-[#909296] mt-1">Naver/Bing 즉시 색인</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-400">
              설정됨
            </span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">환경 변수: INDEXNOW_KEY</div>
        </div>
      </div>
    </div>
  );
}

// 빠른 통계 카드 컴포넌트
function QuickStatCard({
  icon,
  label,
  value,
  subtext,
  trend,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend: "up" | "down" | "warning" | "neutral";
  loading?: boolean;
}) {
  const trendBg = {
    up: "bg-emerald-500/10",
    down: "bg-red-500/10",
    warning: "bg-amber-500/10",
    neutral: "bg-[#25262b]",
  };

  const trendText = {
    up: "text-emerald-400",
    down: "text-red-400",
    warning: "text-amber-400",
    neutral: "text-[#909296]",
  };

  if (loading) {
    return (
      <div className={`rounded-lg p-4 bg-[#25262b] animate-pulse`}>
        <div className="h-5 w-5 bg-[#373A40] rounded mb-2" />
        <div className="h-7 w-16 bg-[#373A40] rounded mb-1" />
        <div className="h-4 w-20 bg-[#373A40] rounded" />
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 ${trendBg[trend]}`}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-[#909296]">{label}</div>
      <div className={`text-xs mt-1 ${trendText[trend]}`}>{subtext}</div>
    </div>
  );
}

// 작업 팁 컴포넌트
function TaskTip({ priority, title, tips }: { priority: string; title: string; tips: string[] }) {
  const priorityColors = {
    high: "border-red-500/30 bg-red-500/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    low: "border-blue-500/30 bg-blue-500/5",
  };

  return (
    <div
      className={`rounded-lg p-3 border ${priorityColors[priority as keyof typeof priorityColors]}`}
    >
      <h4 className="text-xs font-medium text-white mb-2">{title}</h4>
      <ul className="space-y-1">
        {tips.map((tip, idx) => (
          <li key={idx} className="text-xs text-[#909296] flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#5c5f66]" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 외부 도구 링크 컴포넌트
function ExternalToolLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 bg-[#25262b] rounded-lg text-xs text-[#909296] hover:text-white hover:bg-[#2a2b33] transition-colors"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      {label}
    </a>
  );
}
