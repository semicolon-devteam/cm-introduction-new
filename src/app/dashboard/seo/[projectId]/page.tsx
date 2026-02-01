/* eslint-disable max-lines */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Search,
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Loader2,
  Users,
  Clock,
  FileText,
  TrendingUp,
  Eye,
  DollarSign,
  MousePointer,
  Facebook,
  Database,
  Send,
  Plus,
  Check,
  X,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getProjectConfig, type SEOProjectConfig } from "@/app/dashboard/_config/seo-projects";

interface SearchConsoleData {
  connected: boolean;
  siteUrl?: string;
  period?: { startDate: string; endDate: string };
  overview?: {
    current: { clicks: number; impressions: number; ctr: number; position: number };
    previous: { clicks: number; impressions: number; ctr: number; position: number };
    change: { clicks: number; impressions: number; ctr: number; position: number };
  };
  topQueries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topPages?: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  deviceBreakdown?: Array<{
    device: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  countryBreakdown?: Array<{
    country: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  dailyData?: Array<{
    date: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  error?: string;
}

interface GAMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

interface AnalyticsData {
  connected: boolean;
  propertyId?: string;
  metrics?: {
    activeUsers: GAMetric;
    sessions: GAMetric;
    pageViews: GAMetric;
    bounceRate: GAMetric;
    avgSessionDuration: GAMetric;
    newUsers: GAMetric;
  };
  topPages?: Array<{
    path: string;
    pageViews: number;
    avgTime: number;
  }>;
  trafficSources?: Array<{
    source: string;
    sessions: number;
    percentage: number;
  }>;
  dailyData?: Array<{
    date: string;
    activeUsers: number;
    sessions: number;
    pageViews: number;
  }>;
  error?: string;
}

// Naver Search Advisor Data
interface NaverData {
  connected: boolean;
  siteId?: string;
  demo?: boolean;
  metrics?: {
    clicks: GAMetric;
    impressions: GAMetric;
    ctr: GAMetric;
    avgPosition: GAMetric;
  };
  topQueries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  indexStatus?: {
    indexed: number;
    submitted: number;
    errors: number;
  };
  error?: string;
}

// Meta Business (Facebook/Instagram) Data
interface MetaData {
  connected: boolean;
  pixelId?: string;
  demo?: boolean;
  metrics?: {
    pageViews: GAMetric;
    uniqueVisitors: GAMetric;
    contentViews: GAMetric;
  };
  error?: string;
}

// Google AdSense Data
interface AdSenseData {
  connected: boolean;
  accountId?: string;
  demo?: boolean;
  metrics?: {
    estimatedEarnings: GAMetric;
    pageViews: GAMetric;
    clicks: GAMetric;
    ctr: GAMetric;
    cpc: GAMetric;
    rpm: GAMetric;
  };
  dailyData?: Array<{
    date: string;
    earnings: number;
    pageViews: number;
    clicks: number;
  }>;
  error?: string;
}

type PeriodType = "7days" | "28days" | "3months";

const PERIODS: { value: PeriodType; label: string }[] = [
  { value: "7days", label: "7일" },
  { value: "28days", label: "28일" },
  { value: "3months", label: "3개월" },
];

function TrendBadge({ value, inverted = false }: { value: number; inverted?: boolean }) {
  const isPositive = inverted ? value < 0 : value > 0;
  const isNegative = inverted ? value > 0 : value < 0;

  if (value === 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-gray-500">
        <Minus className="w-3 h-3" />
        0%
      </span>
    );
  }

  return (
    <span
      className={`flex items-center gap-0.5 text-xs ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"}`}
    >
      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {value > 0 ? "+" : ""}
      {value}%
    </span>
  );
}

function DeviceIcon({ device }: { device: string }) {
  switch (device.toLowerCase()) {
    case "mobile":
      return <Smartphone className="w-4 h-4" />;
    case "tablet":
      return <Tablet className="w-4 h-4" />;
    default:
      return <Monitor className="w-4 h-4" />;
  }
}

export default function SEOProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<SEOProjectConfig | null>(null);
  const [data, setData] = useState<SearchConsoleData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [naverData, setNaverData] = useState<NaverData | null>(null);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [adsenseData, setAdsenseData] = useState<AdSenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [naverLoading, setNaverLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [adsenseLoading, setAdsenseLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>("28days");
  const [activeTab, setActiveTab] = useState<"queries" | "pages">("queries");

  // IndexNow 상태
  const [indexNowUrls, setIndexNowUrls] = useState<string>("");
  const [indexNowLoading, setIndexNowLoading] = useState(false);
  const [indexNowResult, setIndexNowResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const config = getProjectConfig(projectId);
    if (!config) {
      router.push("/dashboard");
      return;
    }
    setProject(config);
  }, [projectId, router]);

  // Search Console 데이터 fetch
  useEffect(() => {
    if (!project?.searchConsole.enabled) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard/search-console?period=${period}&siteUrl=${encodeURIComponent(project.searchConsole.siteUrl)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setData({ connected: false, error: "데이터를 불러올 수 없습니다" });
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [project, period]);

  // Analytics 데이터 fetch
  useEffect(() => {
    if (!project?.analytics.enabled || !project?.analytics.propertyId) {
      setAnalyticsLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        // period를 Analytics API 형식에 맞게 변환
        const analyticsPeriod =
          period === "3months" ? "90days" : period === "28days" ? "30days" : "7days";
        const response = await fetch(
          `/api/dashboard/analytics?period=${analyticsPeriod}&propertyId=${encodeURIComponent(project.analytics.propertyId)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const result = await response.json();
        setAnalyticsData(result);
      } catch (err) {
        console.error(err);
        setAnalyticsData({ connected: false, error: "Analytics 데이터를 불러올 수 없습니다" });
      } finally {
        setAnalyticsLoading(false);
      }
    };

    void fetchAnalytics();
  }, [project, period]);

  // Naver Search Advisor - API가 공개되지 않아 fetch 불필요
  // 네이버는 웹 대시보드만 제공하므로 데이터 연동 불가
  useEffect(() => {
    setNaverLoading(false);
    // Naver Search Advisor는 공개 API가 없음
    // 추후 수동 데이터 입력 기능 구현 시 이 부분 수정
  }, [project]);

  // Meta Business 데이터 fetch
  useEffect(() => {
    if (!project?.meta?.enabled || !project?.meta?.pixelId) {
      setMetaLoading(false);
      return;
    }

    const fetchMeta = async () => {
      setMetaLoading(true);
      try {
        const metaPeriod =
          period === "3months" ? "90days" : period === "28days" ? "30days" : "7days";
        const response = await fetch(
          `/api/dashboard/meta?period=${metaPeriod}&pixelId=${encodeURIComponent(project.meta?.pixelId || "")}`,
        );
        if (!response.ok) throw new Error("Failed to fetch meta data");
        const result = await response.json();
        setMetaData(result);
      } catch (err) {
        console.error(err);
        setMetaData({ connected: false, error: "Meta 데이터를 불러올 수 없습니다" });
      } finally {
        setMetaLoading(false);
      }
    };

    void fetchMeta();
  }, [project, period]);

  // AdSense 데이터 fetch
  useEffect(() => {
    if (!project?.adsense?.enabled || !project?.adsense?.publisherId) {
      setAdsenseLoading(false);
      return;
    }

    const fetchAdsense = async () => {
      setAdsenseLoading(true);
      try {
        const adsensePeriod =
          period === "3months" ? "90days" : period === "28days" ? "30days" : "7days";
        const response = await fetch(
          `/api/dashboard/adsense?period=${adsensePeriod}&accountId=${encodeURIComponent(project.adsense?.publisherId || "")}`,
        );
        if (!response.ok) throw new Error("Failed to fetch adsense data");
        const result = await response.json();
        setAdsenseData(result);
      } catch (err) {
        console.error(err);
        setAdsenseData({ connected: false, error: "AdSense 데이터를 불러올 수 없습니다" });
      } finally {
        setAdsenseLoading(false);
      }
    };

    void fetchAdsense();
  }, [project, period]);

  const handleRefresh = () => {
    if (project?.searchConsole.enabled) {
      setLoading(true);
      fetch(
        `/api/dashboard/search-console?period=${period}&siteUrl=${encodeURIComponent(project.searchConsole.siteUrl)}`,
      )
        .then((res) => res.json())
        .then((result) => setData(result))
        .catch(() => setData({ connected: false, error: "새로고침 실패" }))
        .finally(() => setLoading(false));
    }
  };

  // IndexNow URL 제출
  const handleIndexNowSubmit = async () => {
    if (!project?.domain || !indexNowUrls.trim()) return;

    setIndexNowLoading(true);
    setIndexNowResult(null);

    try {
      // 줄바꿈으로 URL 분리
      const urls = indexNowUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
        .map((url) => {
          // 상대 경로면 도메인 추가
          if (url.startsWith("/")) {
            return `https://${project.domain}${url}`;
          }
          // http/https 없으면 추가
          if (!url.startsWith("http")) {
            return `https://${project.domain}/${url}`;
          }
          return url;
        });

      const response = await fetch("/api/dashboard/naver-indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: project.domain,
          urls,
        }),
      });

      const result = await response.json();
      setIndexNowResult({
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        setIndexNowUrls(""); // 성공 시 입력 초기화
      }
    } catch (error) {
      setIndexNowResult({
        success: false,
        message: error instanceof Error ? error.message : "요청 실패",
      });
    } finally {
      setIndexNowLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-[#1a1b23] transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{project.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                <p className="text-sm text-gray-500">{project.domain}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1b23] rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              사이트 방문
            </a>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1b23] rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              새로고침
            </button>
            <Link
              href={`/dashboard/seo/${projectId}/keywords`}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4" />
              키워드 설정
            </Link>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2 mb-6">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                period === p.value
                  ? "bg-blue-500 text-white"
                  : "bg-[#1a1b23] text-gray-400 hover:text-white hover:bg-[#25262b]"
              }`}
            >
              {p.label}
            </button>
          ))}
          {data?.period && (
            <span className="text-sm text-gray-500 ml-4">
              {data.period.startDate} ~ {data.period.endDate}
            </span>
          )}
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 ${
              project.searchConsole.enabled
                ? "bg-blue-500/20 text-blue-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            <Search className="w-4 h-4" />
            Search Console
          </span>
          <span
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 ${
              project.analytics.enabled
                ? "bg-orange-500/20 text-orange-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </span>
          <span
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 ${
              project.naver?.enabled
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            <Globe className="w-4 h-4" />
            Naver
            {project.naver?.enabled && <span className="text-[10px] opacity-70">(IndexNow)</span>}
          </span>
          <span
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 ${
              project.meta?.enabled
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            <Facebook className="w-4 h-4" />
            Meta
          </span>
          <span
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 ${
              project.adsense?.enabled
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            AdSense
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : data?.error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{data.error}</p>
          </div>
        ) : !data?.connected ? (
          <div className="text-center py-20 border border-dashed border-[#373A40] rounded-xl">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Search Console이 연동되지 않았습니다</p>
            <p className="text-sm text-gray-500">프로젝트 설정에서 siteUrl을 설정해주세요</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <KPICard
                label="클릭수"
                value={data.overview?.current.clicks || 0}
                change={data.overview?.change.clicks || 0}
                format="number"
              />
              <KPICard
                label="노출수"
                value={data.overview?.current.impressions || 0}
                change={data.overview?.change.impressions || 0}
                format="number"
              />
              <KPICard
                label="CTR"
                value={data.overview?.current.ctr || 0}
                change={data.overview?.change.ctr || 0}
                format="percent"
              />
              <KPICard
                label="평균 순위"
                value={data.overview?.current.position || 0}
                change={data.overview?.change.position || 0}
                format="decimal"
                inverted
              />
            </div>

            {/* Daily Chart */}
            {data.dailyData && data.dailyData.length > 0 && (
              <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">일별 추이</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.dailyData}>
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        tickFormatter={(v) => v.slice(5)}
                      />
                      <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} yAxisId="left" />
                      <YAxis
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        yAxisId="right"
                        orientation="right"
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1b23", border: "1px solid #373A40" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="clicks"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        name="클릭"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="impressions"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        name="노출"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Two columns: Queries/Pages & Device/Country */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Queries/Pages tabs */}
              <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl overflow-hidden">
                <div className="flex border-b border-[#373A40]">
                  <button
                    onClick={() => setActiveTab("queries")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "queries"
                        ? "bg-[#25262b] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    인기 검색어
                  </button>
                  <button
                    onClick={() => setActiveTab("pages")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "pages"
                        ? "bg-[#25262b] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    인기 페이지
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {activeTab === "queries" ? (
                    <table className="w-full">
                      <thead className="sticky top-0 bg-[#1a1b23]">
                        <tr className="text-xs text-gray-500">
                          <th className="text-left px-4 py-2">검색어</th>
                          <th className="text-right px-4 py-2">클릭</th>
                          <th className="text-right px-4 py-2">노출</th>
                          <th className="text-right px-4 py-2">순위</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topQueries?.map((q, i) => (
                          <tr key={i} className="border-t border-[#25262b] hover:bg-[#25262b]">
                            <td className="px-4 py-2 text-sm text-white truncate max-w-[200px]">
                              {q.query}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-300">
                              {q.clicks}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-400">
                              {q.impressions}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-400">
                              {q.position.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full">
                      <thead className="sticky top-0 bg-[#1a1b23]">
                        <tr className="text-xs text-gray-500">
                          <th className="text-left px-4 py-2">페이지</th>
                          <th className="text-right px-4 py-2">클릭</th>
                          <th className="text-right px-4 py-2">노출</th>
                          <th className="text-right px-4 py-2">순위</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topPages?.map((p, i) => (
                          <tr key={i} className="border-t border-[#25262b] hover:bg-[#25262b]">
                            <td className="px-4 py-2 text-sm text-white truncate max-w-[200px]">
                              {p.page.replace(/^https?:\/\/[^/]+/, "")}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-300">
                              {p.clicks}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-400">
                              {p.impressions}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-400">
                              {p.position.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Device & Country breakdown */}
              <div className="space-y-6">
                {/* Device breakdown */}
                <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    기기별 분석
                  </h3>
                  <div className="space-y-2">
                    {data.deviceBreakdown?.map((d, i) => {
                      const total =
                        data.deviceBreakdown?.reduce((sum, item) => sum + item.clicks, 0) || 1;
                      const percent = Math.round((d.clicks / total) * 100);
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <DeviceIcon device={d.device} />
                          <span className="text-sm text-gray-300 capitalize w-16">{d.device}</span>
                          <div className="flex-1 h-2 bg-[#25262b] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-12 text-right">{percent}%</span>
                          <span className="text-sm text-gray-500 w-16 text-right">
                            {d.clicks}클릭
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Country breakdown */}
                <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    국가별 분석
                  </h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.countryBreakdown?.slice(0, 5)} layout="vertical">
                        <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} />
                        <YAxis
                          type="category"
                          dataKey="country"
                          tick={{ fill: "#6B7280", fontSize: 12 }}
                          width={40}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1a1b23", border: "1px solid #373A40" }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Bar dataKey="clicks" fill="#3B82F6" radius={[0, 4, 4, 0]} name="클릭" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Section */}
        {project.analytics.enabled && (
          <div className="mt-8 pt-8 border-t border-[#373A40]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Google Analytics
            </h2>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
              </div>
            ) : analyticsData?.error ? (
              <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-red-400 mb-2">{analyticsData.error}</p>
              </div>
            ) : !analyticsData?.connected ? (
              <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">Analytics가 연동되지 않았습니다</p>
                <p className="text-sm text-gray-500">프로젝트 설정에서 propertyId를 설정해주세요</p>
              </div>
            ) : (
              <>
                {/* Analytics KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <AnalyticsKPICard
                    label="활성 사용자"
                    value={analyticsData.metrics?.activeUsers.value || 0}
                    change={analyticsData.metrics?.activeUsers.changePercent || 0}
                    icon={<Users className="w-4 h-4 text-blue-400" />}
                  />
                  <AnalyticsKPICard
                    label="세션"
                    value={analyticsData.metrics?.sessions.value || 0}
                    change={analyticsData.metrics?.sessions.changePercent || 0}
                    icon={<TrendingUp className="w-4 h-4 text-green-400" />}
                  />
                  <AnalyticsKPICard
                    label="페이지뷰"
                    value={analyticsData.metrics?.pageViews.value || 0}
                    change={analyticsData.metrics?.pageViews.changePercent || 0}
                    icon={<Eye className="w-4 h-4 text-purple-400" />}
                  />
                  <AnalyticsKPICard
                    label="신규 사용자"
                    value={analyticsData.metrics?.newUsers.value || 0}
                    change={analyticsData.metrics?.newUsers.changePercent || 0}
                    icon={<Users className="w-4 h-4 text-cyan-400" />}
                  />
                  <AnalyticsKPICard
                    label="이탈률"
                    value={analyticsData.metrics?.bounceRate.value || 0}
                    change={analyticsData.metrics?.bounceRate.changePercent || 0}
                    suffix="%"
                    inverted
                    icon={<ArrowDownRight className="w-4 h-4 text-red-400" />}
                  />
                  <AnalyticsKPICard
                    label="평균 체류시간"
                    value={analyticsData.metrics?.avgSessionDuration.value || 0}
                    change={analyticsData.metrics?.avgSessionDuration.changePercent || 0}
                    format="time"
                    icon={<Clock className="w-4 h-4 text-yellow-400" />}
                  />
                </div>

                {/* Analytics Daily Chart */}
                {analyticsData.dailyData && analyticsData.dailyData.length > 0 && (
                  <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">방문자 추이</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.dailyData}>
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            tickFormatter={(v) => v.slice(4, 8).replace(/(\d{2})(\d{2})/, "$1/$2")}
                          />
                          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} yAxisId="left" />
                          <YAxis
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            yAxisId="right"
                            orientation="right"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1b23",
                              border: "1px solid #373A40",
                            }}
                            labelStyle={{ color: "#fff" }}
                            formatter={(value) => [
                              typeof value === "number" ? value.toLocaleString() : String(value),
                              "",
                            ]}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="activeUsers"
                            stroke="#F97316"
                            strokeWidth={2}
                            dot={false}
                            name="사용자"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="pageViews"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={false}
                            name="페이지뷰"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Traffic Sources & Top Pages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Sources */}
                  <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-4">
                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      트래픽 소스
                    </h3>
                    <div className="space-y-3">
                      {analyticsData.trafficSources?.map((source, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-sm text-gray-300 w-24 truncate capitalize">
                            {source.source}
                          </span>
                          <div className="flex-1 h-2 bg-[#25262b] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-12 text-right">
                            {source.percentage}%
                          </span>
                          <span className="text-sm text-gray-500 w-16 text-right">
                            {source.sessions.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {(!analyticsData.trafficSources ||
                        analyticsData.trafficSources.length === 0) && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          트래픽 소스 데이터가 없습니다
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Top Pages (Analytics) */}
                  <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#373A40] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-medium text-white">인기 페이지 (Analytics)</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-[#1a1b23]">
                          <tr className="text-xs text-gray-500">
                            <th className="text-left px-4 py-2">페이지</th>
                            <th className="text-right px-4 py-2">조회수</th>
                            <th className="text-right px-4 py-2">체류시간</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.topPages?.map((page, i) => (
                            <tr key={i} className="border-t border-[#25262b] hover:bg-[#25262b]">
                              <td className="px-4 py-2 text-sm text-white truncate max-w-[200px]">
                                {page.path}
                              </td>
                              <td className="px-4 py-2 text-sm text-right text-gray-300">
                                {page.pageViews.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-sm text-right text-gray-400">
                                {formatDuration(page.avgTime)}
                              </td>
                            </tr>
                          ))}
                          {(!analyticsData.topPages || analyticsData.topPages.length === 0) && (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-8 text-sm text-gray-500 text-center"
                              >
                                페이지 데이터가 없습니다
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Naver Search Advisor Section */}
        {project.naver?.enabled && (
          <div className="mt-8 pt-8 border-t border-[#373A40]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              Naver Search Advisor
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* IndexNow 색인 요청 */}
              <div className="bg-[#1a1b23] border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">IndexNow 색인 요청</h3>
                    <p className="text-xs text-gray-500">새 페이지를 네이버에 빠르게 알리기</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      URL 입력 (줄바꿈으로 여러 URL 입력)
                    </label>
                    <textarea
                      value={indexNowUrls}
                      onChange={(e) => setIndexNowUrls(e.target.value)}
                      placeholder={`/new-page\n/blog/new-post\nhttps://${project.domain}/another-page`}
                      className="w-full h-28 px-3 py-2 bg-[#0d0e12] border border-[#373A40] rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-none font-mono"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      상대 경로 (/path), 전체 URL 모두 가능 · 최대 10,000개
                    </p>
                  </div>

                  {/* 결과 메시지 */}
                  {indexNowResult && (
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        indexNowResult.success
                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {indexNowResult.success ? (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{indexNowResult.message}</span>
                    </div>
                  )}

                  <button
                    onClick={() => void handleIndexNowSubmit()}
                    disabled={indexNowLoading || !indexNowUrls.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {indexNowLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        제출 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        네이버에 색인 요청
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 서치어드바이저 링크 및 안내 */}
              <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">성과 데이터 확인</h3>
                    <p className="text-xs text-gray-500">SEO 데이터는 웹사이트에서 확인</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  네이버 Search Advisor는 성과 데이터 API를 제공하지 않습니다. 클릭수, 노출수, CTR
                  등은 웹사이트에서 직접 확인하세요.
                </p>

                <div className="space-y-2">
                  <a
                    href="https://searchadvisor.naver.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-[#0d0e12] rounded-lg hover:bg-[#25262b] transition-colors group"
                  >
                    <span className="text-sm text-white">Search Advisor 대시보드</span>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-green-400" />
                  </a>
                  <a
                    href="https://datalab.naver.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-[#0d0e12] rounded-lg hover:bg-[#25262b] transition-colors group"
                  >
                    <span className="text-sm text-white">DataLab (키워드 트렌드)</span>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-green-400" />
                  </a>
                </div>

                {/* 수동 데이터 Placeholder */}
                <div className="mt-4 pt-4 border-t border-[#373A40]">
                  <p className="text-xs text-gray-600 mb-2">수동 기록 (추후 지원)</p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-[#0d0e12] rounded p-2 text-center">
                      <p className="text-[10px] text-gray-600">클릭</p>
                      <p className="text-sm text-gray-700">-</p>
                    </div>
                    <div className="bg-[#0d0e12] rounded p-2 text-center">
                      <p className="text-[10px] text-gray-600">노출</p>
                      <p className="text-sm text-gray-700">-</p>
                    </div>
                    <div className="bg-[#0d0e12] rounded p-2 text-center">
                      <p className="text-[10px] text-gray-600">CTR</p>
                      <p className="text-sm text-gray-700">-</p>
                    </div>
                    <div className="bg-[#0d0e12] rounded p-2 text-center">
                      <p className="text-[10px] text-gray-600">순위</p>
                      <p className="text-sm text-gray-700">-</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meta Business Section */}
        {project.meta?.enabled && (
          <div className="mt-8 pt-8 border-t border-[#373A40]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Facebook className="w-5 h-5 text-indigo-500" />
              Meta Business
            </h2>

            {metaLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
              </div>
            ) : metaData?.error ? (
              <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
                <Facebook className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-red-400 mb-2">{metaData.error}</p>
              </div>
            ) : !metaData?.connected ? (
              <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
                <Facebook className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">Meta Business가 연동되지 않았습니다</p>
                <p className="text-sm text-gray-500">
                  환경 변수에서 META_ACCESS_TOKEN, META_PIXEL_ID를 설정해주세요
                </p>
              </div>
            ) : (
              <>
                {/* Meta KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <AnalyticsKPICard
                    label="페이지뷰"
                    value={metaData.metrics?.pageViews.value || 0}
                    change={metaData.metrics?.pageViews.changePercent || 0}
                    icon={<Eye className="w-4 h-4 text-indigo-400" />}
                  />
                  <AnalyticsKPICard
                    label="순 방문자"
                    value={metaData.metrics?.uniqueVisitors.value || 0}
                    change={metaData.metrics?.uniqueVisitors.changePercent || 0}
                    icon={<Users className="w-4 h-4 text-indigo-400" />}
                  />
                  <AnalyticsKPICard
                    label="콘텐츠 조회"
                    value={metaData.metrics?.contentViews.value || 0}
                    change={metaData.metrics?.contentViews.changePercent || 0}
                    icon={<FileText className="w-4 h-4 text-indigo-400" />}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* AdSense Section */}
        {project.adsense?.enabled && (
          <div className="mt-8 pt-8 border-t border-[#373A40]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              Google AdSense
            </h2>

            {adsenseLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
              </div>
            ) : adsenseData?.error ? (
              <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
                <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-red-400 mb-2">{adsenseData.error}</p>
              </div>
            ) : !adsenseData?.connected ? (
              <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
                <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">AdSense가 연동되지 않았습니다</p>
                <p className="text-sm text-gray-500">
                  환경 변수에서 ADSENSE_ACCOUNT_ID를 설정해주세요
                </p>
              </div>
            ) : (
              <>
                {/* AdSense KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <AnalyticsKPICard
                    label="예상 수익"
                    value={adsenseData.metrics?.estimatedEarnings.value || 0}
                    change={adsenseData.metrics?.estimatedEarnings.changePercent || 0}
                    suffix="$"
                    icon={<DollarSign className="w-4 h-4 text-yellow-400" />}
                  />
                  <AnalyticsKPICard
                    label="페이지뷰"
                    value={adsenseData.metrics?.pageViews.value || 0}
                    change={adsenseData.metrics?.pageViews.changePercent || 0}
                    icon={<Eye className="w-4 h-4 text-yellow-400" />}
                  />
                  <AnalyticsKPICard
                    label="클릭수"
                    value={adsenseData.metrics?.clicks.value || 0}
                    change={adsenseData.metrics?.clicks.changePercent || 0}
                    icon={<MousePointer className="w-4 h-4 text-yellow-400" />}
                  />
                  <AnalyticsKPICard
                    label="CTR"
                    value={adsenseData.metrics?.ctr.value || 0}
                    change={adsenseData.metrics?.ctr.changePercent || 0}
                    suffix="%"
                    icon={<TrendingUp className="w-4 h-4 text-yellow-400" />}
                  />
                  <AnalyticsKPICard
                    label="CPC"
                    value={adsenseData.metrics?.cpc.value || 0}
                    change={adsenseData.metrics?.cpc.changePercent || 0}
                    suffix="$"
                    icon={<DollarSign className="w-4 h-4 text-yellow-400" />}
                  />
                  <AnalyticsKPICard
                    label="RPM"
                    value={adsenseData.metrics?.rpm.value || 0}
                    change={adsenseData.metrics?.rpm.changePercent || 0}
                    suffix="$"
                    icon={<BarChart3 className="w-4 h-4 text-yellow-400" />}
                  />
                </div>

                {/* AdSense Daily Chart */}
                {adsenseData.dailyData && adsenseData.dailyData.length > 0 && (
                  <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">수익 추이</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={adsenseData.dailyData}>
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            tickFormatter={(v) => v.slice(5).replace("-", "/")}
                          />
                          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} yAxisId="left" />
                          <YAxis
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            yAxisId="right"
                            orientation="right"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1b23",
                              border: "1px solid #373A40",
                            }}
                            labelStyle={{ color: "#fff" }}
                            formatter={(value) => [
                              typeof value === "number" ? `$${value.toFixed(2)}` : String(value),
                              "",
                            ]}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="earnings"
                            stroke="#EAB308"
                            strokeWidth={2}
                            dot={false}
                            name="수익"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="clicks"
                            stroke="#F97316"
                            strokeWidth={2}
                            dot={false}
                            name="클릭"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// KPI Card component
function KPICard({
  label,
  value,
  change,
  format,
  inverted = false,
}: {
  label: string;
  value: number;
  change: number;
  format: "number" | "percent" | "decimal";
  inverted?: boolean;
}) {
  const formatValue = () => {
    switch (format) {
      case "number":
        return value.toLocaleString();
      case "percent":
        return `${value.toFixed(2)}%`;
      case "decimal":
        return value.toFixed(1);
    }
  };

  return (
    <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{formatValue()}</span>
        <TrendBadge value={change} inverted={inverted} />
      </div>
    </div>
  );
}

// Analytics KPI Card component
function AnalyticsKPICard({
  label,
  value,
  change,
  icon,
  suffix = "",
  format = "number",
  inverted = false,
}: {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  suffix?: string;
  format?: "number" | "time";
  inverted?: boolean;
}) {
  const formatValue = () => {
    if (format === "time") {
      return formatDuration(value);
    }
    return value.toLocaleString() + suffix;
  };

  return (
    <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-white">{formatValue()}</span>
        <TrendBadge value={change} inverted={inverted} />
      </div>
    </div>
  );
}

// 시간 포맷팅 (초 → 분:초)
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}초`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}분 ${secs}초`;
}
