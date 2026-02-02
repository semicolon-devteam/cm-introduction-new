"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  MousePointer,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SearchConsoleMetric { clicks: number; impressions: number; ctr: number; position: number; }
interface QueryData extends SearchConsoleMetric { query: string; }
interface PageData extends SearchConsoleMetric { page: string; }
interface DeviceData extends SearchConsoleMetric { device: string; }
interface DailyData extends SearchConsoleMetric { date: string; }

interface SearchConsoleData {
  connected: boolean;
  siteUrl?: string;
  period?: { startDate: string; endDate: string };
  overview?: {
    current: SearchConsoleMetric;
    previous: SearchConsoleMetric;
    change: { clicks: number; impressions: number; ctr: number; position: number };
  };
  topQueries?: QueryData[];
  topPages?: PageData[];
  deviceBreakdown?: DeviceData[];
  dailyData?: DailyData[];
  error?: string;
}

type SCPeriod = "7days" | "28days" | "3months";

interface SearchConsoleCardProps {
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
}

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  DESKTOP: Monitor,
  MOBILE: Smartphone,
  TABLET: Tablet,
};

const DEVICE_LABELS: Record<string, string> = {
  DESKTOP: "데스크톱",
  MOBILE: "모바일",
  TABLET: "태블릿",
};

export function SearchConsoleCard({ className = "" }: SearchConsoleCardProps) {
  const [data, setData] = useState<SearchConsoleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<SCPeriod>("28days");
  const [activeTab, setActiveTab] = useState<"queries" | "pages">("queries");
  const [showDetails, setShowDetails] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dashboard/search-console?period=${period}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch Search Console data:", error);
      setData({ connected: false, error: "데이터 로드 실패" });
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const getTrendIcon = (change: number, inverse = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    const isNegative = inverse ? change > 0 : change < 0;
    if (isPositive) return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (isNegative) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-[#909296]" />;
  };

  const getTrendColor = (change: number, inverse = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    const isNegative = inverse ? change > 0 : change < 0;
    if (isPositive) return "text-emerald-400";
    if (isNegative) return "text-red-400";
    return "text-[#909296]";
  };

  if (isLoading) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-white">Google Search Console</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#25262b] rounded-lg p-3 animate-pulse">
              <div className="h-3 bg-[#373A40] rounded w-16 mb-2" />
              <div className="h-6 bg-[#373A40] rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.connected) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-white">Google Search Console</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
          <p className="text-sm text-[#909296] mb-2">Search Console 연동이 필요합니다</p>
          <p className="text-xs text-[#5c5f66] max-w-sm">
            .env.local에 SEARCH_CONSOLE_SITE_URL 환경 변수를 설정하고, Service Account를 Search Console 사용자로 추가하세요
          </p>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-1 text-xs text-brand-primary hover:underline"
          >
            Search Console 열기
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  const overview = data.overview;

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-white">Google Search Console</span>
          {data.siteUrl && (
            <span className="text-xs text-[#5c5f66] truncate max-w-[150px]">{data.siteUrl}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as SCPeriod)}
            className="h-8 px-2 text-xs bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary"
          >
            <option value="7days">최근 7일</option>
            <option value="28days">최근 28일</option>
            <option value="3months">최근 3개월</option>
          </select>
          <button
            onClick={() => void fetchData()}
            className="p-1.5 text-[#909296] hover:text-white hover:bg-white/5 rounded transition-all"
            title="새로고침"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <MousePointer className="w-3.5 h-3.5" />
              <span>클릭수</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {formatNumber(overview?.current.clicks || 0)}
              </span>
              {overview?.change && (
                <span className={`text-xs flex items-center gap-0.5 ${getTrendColor(overview.change.clicks)}`}>
                  {getTrendIcon(overview.change.clicks)}
                  {Math.abs(overview.change.clicks)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>노출수</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {formatNumber(overview?.current.impressions || 0)}
              </span>
              {overview?.change && (
                <span className={`text-xs flex items-center gap-0.5 ${getTrendColor(overview.change.impressions)}`}>
                  {getTrendIcon(overview.change.impressions)}
                  {Math.abs(overview.change.impressions)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>CTR</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-400">{overview?.current.ctr || 0}%</span>
              {overview?.change && (
                <span className={`text-xs flex items-center gap-0.5 ${getTrendColor(overview.change.ctr)}`}>
                  {getTrendIcon(overview.change.ctr)}
                  {Math.abs(overview.change.ctr)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>평균 순위</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">{overview?.current.position || 0}</span>
              {overview?.change && (
                <span className={`text-xs flex items-center gap-0.5 ${getTrendColor(overview.change.position)}`}>
                  {getTrendIcon(overview.change.position)}
                  {Math.abs(overview.change.position)}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 mb-3 bg-[#25262b] rounded-lg p-1">
          <button
            onClick={() => setActiveTab("queries")}
            className={`flex-1 py-1.5 text-xs rounded transition-colors ${
              activeTab === "queries" ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
            }`}
          >
            인기 검색어
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`flex-1 py-1.5 text-xs rounded transition-colors ${
              activeTab === "pages" ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
            }`}
          >
            인기 페이지
          </button>
        </div>
        <div className="bg-[#25262b] rounded-lg overflow-hidden mb-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#373A40]">
                <th className="text-left p-2 text-[#909296] font-medium">
                  {activeTab === "queries" ? "검색어" : "페이지"}
                </th>
                <th className="text-right p-2 text-[#909296] font-medium w-16">클릭</th>
                <th className="text-right p-2 text-[#909296] font-medium w-16">노출</th>
                <th className="text-right p-2 text-[#909296] font-medium w-14">순위</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "queries"
                ? data.topQueries?.slice(0, 10).map((item, idx) => (
                    <tr key={idx} className="border-b border-[#373A40]/50 last:border-b-0">
                      <td className="p-2 text-white truncate max-w-[200px]" title={item.query}>
                        {item.query}
                      </td>
                      <td className="p-2 text-right text-[#909296]">{formatNumber(item.clicks)}</td>
                      <td className="p-2 text-right text-[#909296]">{formatNumber(item.impressions)}</td>
                      <td className="p-2 text-right text-amber-400">{item.position}</td>
                    </tr>
                  ))
                : data.topPages?.slice(0, 10).map((item, idx) => (
                    <tr key={idx} className="border-b border-[#373A40]/50 last:border-b-0">
                      <td className="p-2 text-white truncate max-w-[200px]" title={item.page}>
                        {item.page.replace(data.siteUrl || "", "")}
                      </td>
                      <td className="p-2 text-right text-[#909296]">{formatNumber(item.clicks)}</td>
                      <td className="p-2 text-right text-[#909296]">{formatNumber(item.impressions)}</td>
                      <td className="p-2 text-right text-amber-400">{item.position}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 text-xs text-[#909296] hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          {showDetails ? (
            <>
              간략히 보기 <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              상세 정보 보기 <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
        {showDetails && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.deviceBreakdown && data.deviceBreakdown.length > 0 && (
              <div className="bg-[#25262b] rounded-lg p-3">
                <h4 className="text-xs font-medium text-[#909296] mb-2">기기별 분석</h4>
                <div className="space-y-2">
                  {data.deviceBreakdown.map((device, idx) => {
                    const totalClicks = data.deviceBreakdown!.reduce((sum, d) => sum + d.clicks, 0);
                    const percentage = totalClicks > 0 ? Math.round((device.clicks / totalClicks) * 100) : 0;
                    const DeviceIcon = DEVICE_ICONS[device.device] || Globe;

                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1.5 text-white">
                            <DeviceIcon className="w-3.5 h-3.5 text-[#909296]" />
                            {DEVICE_LABELS[device.device] || device.device}
                          </span>
                          <span className="text-[#909296]">{percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-[#373A40] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {data.dailyData && data.dailyData.length > 0 && (
              <div className="bg-[#25262b] rounded-lg p-3">
                <h4 className="text-xs font-medium text-[#909296] mb-2">일별 클릭 추이</h4>
                <div className="flex items-end gap-0.5 h-16">
                  {data.dailyData.slice(-14).map((day, idx) => {
                    const maxClicks = Math.max(...data.dailyData!.map((d) => d.clicks), 1);
                    const height = (day.clicks / maxClicks) * 100;

                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-blue-500/60 hover:bg-blue-500 rounded-t transition-colors"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${day.date}: ${day.clicks}클릭`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-[#5c5f66]">
                  <span>{data.dailyData.slice(-14)[0]?.date}</span>
                  <span>{data.dailyData[data.dailyData.length - 1]?.date}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
