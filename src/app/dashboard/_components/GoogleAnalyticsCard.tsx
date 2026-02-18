"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Users,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

interface GAMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

interface GAData {
  connected: boolean;
  demo?: boolean;
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

type GAPeriod = "7days" | "30days" | "90days";

interface GoogleAnalyticsCardProps {
  className?: string;
}

// 시간 포맷팅 (초 → 분:초)
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}분 ${secs}초`;
}

// 숫자 포맷팅
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
}

export function GoogleAnalyticsCard({ className = "" }: GoogleAnalyticsCardProps) {
  const [data, setData] = useState<GAData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<GAPeriod>("7days");
  const [showDetails, setShowDetails] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dashboard/analytics?period=${period}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch GA data:", error);
      setData({ connected: false, error: "데이터 로드 실패" });
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // 트렌드 아이콘 & 색상
  const getTrendIcon = (changePercent: number | undefined) => {
    if (changePercent === undefined) return <Minus className="w-3 h-3 text-[#909296]" />;
    if (changePercent > 0) return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (changePercent < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-[#909296]" />;
  };

  const getTrendColor = (changePercent: number | undefined, inverse = false) => {
    if (changePercent === undefined) return "text-[#909296]";
    if (inverse) {
      // 이탈률은 낮을수록 좋음
      if (changePercent > 0) return "text-red-400";
      if (changePercent < 0) return "text-emerald-400";
    } else {
      if (changePercent > 0) return "text-emerald-400";
      if (changePercent < 0) return "text-red-400";
    }
    return "text-[#909296]";
  };

  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            <span className="font-medium text-white">Google Analytics</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#25262b] rounded-lg p-3 animate-pulse">
              <div className="h-3 bg-[#373A40] rounded w-16 mb-2" />
              <div className="h-6 bg-[#373A40] rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 미연결 상태
  if (!data?.connected) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            <span className="font-medium text-white">Google Analytics</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
          <p className="text-sm text-[#909296] mb-2">GA 연동이 필요합니다</p>
          <p className="text-xs text-[#5c5f66] max-w-sm">
            .env.local에 GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY 환경 변수를
            설정하세요
          </p>
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-1 text-xs text-brand-primary hover:underline"
          >
            Google Cloud Console에서 설정
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  const metrics = data.metrics;

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-400" />
          <span className="font-medium text-white">Google Analytics</span>
          {data.demo && (
            <span className="px-2 py-0.5 text-xs rounded bg-amber-500/20 text-amber-400">데모</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* 기간 선택 */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as GAPeriod)}
            className="h-8 px-2 text-xs bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary"
          >
            <option value="7days">최근 7일</option>
            <option value="30days">최근 30일</option>
            <option value="90days">최근 90일</option>
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
        {/* 주요 메트릭 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {/* 활성 사용자 */}
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>활성 사용자</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {formatNumber(metrics?.activeUsers.value || 0)}
              </span>
              {metrics?.activeUsers.changePercent !== undefined && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${getTrendColor(metrics.activeUsers.changePercent)}`}
                >
                  {getTrendIcon(metrics.activeUsers.changePercent)}
                  {Math.abs(metrics.activeUsers.changePercent)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>세션</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {formatNumber(metrics?.sessions.value || 0)}
              </span>
              {metrics?.sessions.changePercent !== undefined && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${getTrendColor(metrics.sessions.changePercent)}`}
                >
                  {getTrendIcon(metrics.sessions.changePercent)}
                  {Math.abs(metrics.sessions.changePercent)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>페이지뷰</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {formatNumber(metrics?.pageViews.value || 0)}
              </span>
              {metrics?.pageViews.changePercent !== undefined && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${getTrendColor(metrics.pageViews.changePercent)}`}
                >
                  {getTrendIcon(metrics.pageViews.changePercent)}
                  {Math.abs(metrics.pageViews.changePercent)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>신규 사용자</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-400">
                {formatNumber(metrics?.newUsers.value || 0)}
              </span>
              {metrics?.newUsers.changePercent !== undefined && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${getTrendColor(metrics.newUsers.changePercent)}`}
                >
                  {getTrendIcon(metrics.newUsers.changePercent)}
                  {Math.abs(metrics.newUsers.changePercent)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>평균 세션 시간</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {formatDuration(metrics?.avgSessionDuration.value || 0)}
              </span>
              {metrics?.avgSessionDuration.changePercent !== undefined && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${getTrendColor(metrics.avgSessionDuration.changePercent)}`}
                >
                  {getTrendIcon(metrics.avgSessionDuration.changePercent)}
                  {Math.abs(metrics.avgSessionDuration.changePercent)}%
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#909296] mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span>이탈률</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {metrics?.bounceRate.value || 0}%
              </span>
              {metrics?.bounceRate.changePercent !== undefined && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${getTrendColor(metrics.bounceRate.changePercent, true)}`}
                >
                  {getTrendIcon(metrics.bounceRate.changePercent)}
                  {Math.abs(metrics.bounceRate.changePercent)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 상세 정보 토글 */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 text-xs text-[#909296] hover:text-white transition-colors"
        >
          {showDetails ? "간략히 보기 ▲" : "상세 정보 보기 ▼"}
        </button>

        {/* 상세 정보 */}
        {showDetails && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 인기 페이지 */}
            {data.topPages && data.topPages.length > 0 && (
              <div className="bg-[#25262b] rounded-lg p-3">
                <h4 className="text-xs font-medium text-[#909296] mb-2">인기 페이지</h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {data.topPages.slice(0, 5).map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-white truncate max-w-[150px]" title={page.path}>
                        {page.path}
                      </span>
                      <span className="text-[#909296]">{formatNumber(page.pageViews)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.trafficSources && data.trafficSources.length > 0 && (
              <div className="bg-[#25262b] rounded-lg p-3">
                <h4 className="text-xs font-medium text-[#909296] mb-2">트래픽 소스</h4>
                <div className="space-y-2">
                  {data.trafficSources.slice(0, 5).map((source, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white">{source.source}</span>
                        <span className="text-[#909296]">{source.percentage}%</span>
                      </div>
                      <div className="h-1 bg-[#373A40] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-primary rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.dailyData && data.dailyData.length > 0 && (
              <div className="bg-[#25262b] rounded-lg p-3 md:col-span-2">
                <h4 className="text-xs font-medium text-[#909296] mb-2">일별 활성 사용자</h4>
                <div className="flex items-end gap-1 h-16">
                  {data.dailyData.slice(-14).map((day, idx) => {
                    const maxUsers = Math.max(...data.dailyData!.map((d) => d.activeUsers), 1);
                    const height = (day.activeUsers / maxUsers) * 100;

                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-brand-primary/60 hover:bg-brand-primary rounded-t transition-colors"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${day.date}: ${day.activeUsers}명`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-[#5c5f66]">
                  <span>
                    {data.dailyData.length > 14
                      ? data.dailyData[data.dailyData.length - 14]?.date
                      : data.dailyData[0]?.date}
                  </span>
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
