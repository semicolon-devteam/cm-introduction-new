"use client";

import { Loader2, BarChart3, ArrowUpRight, ArrowDownRight, Minus, RefreshCw } from "lucide-react";

interface TrendData {
  keyword: string;
  period: string;
  ratio: number;
  change: number;
}

interface KeywordsTrendSectionProps {
  trendData: TrendData[];
  trendLoading: boolean;
  trendSource: "naver" | "mock" | null;
  relatedKeywords: string[];
  disabled: boolean;
  existingKeywords: string[];
  onFetchTrends: () => void;
  onAddKeyword: (keyword: string) => void;
  errorMessage?: string | null;
}

export function KeywordsTrendSection({
  trendData,
  trendLoading,
  trendSource,
  relatedKeywords,
  disabled,
  existingKeywords,
  onFetchTrends,
  onAddKeyword,
  errorMessage,
}: KeywordsTrendSectionProps) {
  const getTrendIcon = (change: number) => {
    if (change > 5) return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    if (change < -5) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 5) return "text-emerald-400";
    if (change < -5) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-medium">실시간 검색 트렌드</h3>
          {trendSource && (
            <span className="text-xs px-2 py-0.5 rounded bg-[#25262b] text-[#909296]">
              {trendSource === "naver" ? "네이버 데이터랩" : "예상 데이터"}
            </span>
          )}
        </div>
        <button
          onClick={onFetchTrends}
          disabled={trendLoading || disabled}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {trendLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              조회 중...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              트렌드 조회
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-200">{errorMessage}</p>
        </div>
      )}

      {trendData.length > 0 && (
        <div className="space-y-3">
          {trendData.map((trend, idx) => (
            <div key={idx} className="bg-[#25262b] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{trend.keyword}</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend.change)}
                  <span className={`text-sm ${getTrendColor(trend.change)}`}>
                    {trend.change > 0 ? "+" : ""}
                    {trend.change}%
                  </span>
                </div>
              </div>
              <div className="relative h-6 bg-[#1a1b23] rounded overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                  style={{ width: `${Math.min(trend.ratio, 100)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                  검색량 지수: {trend.ratio}
                </span>
              </div>
              <div className="text-xs text-[#5c5f66] mt-1">기준일: {trend.period}</div>
            </div>
          ))}

          {relatedKeywords.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#373A40]">
              <p className="text-sm text-[#909296] mb-2">연관 검색어</p>
              <div className="flex flex-wrap gap-2">
                {relatedKeywords.map((kw, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAddKeyword(kw)}
                    disabled={existingKeywords.some((k) => k.toLowerCase() === kw.toLowerCase())}
                    className="px-3 py-1.5 text-xs bg-[#1a1b23] text-[#909296] rounded hover:bg-blue-600/20 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    + {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!trendData.length && !trendLoading && (
        <div className="text-center py-6">
          <BarChart3 className="w-12 h-12 text-[#373A40] mx-auto mb-3" />
          <p className="text-sm text-[#5c5f66]">등록된 키워드의 실시간 검색 트렌드를 확인합니다.</p>
          <p className="text-xs text-[#5c5f66] mt-1">네이버 데이터랩 / Google Trends 기반</p>
        </div>
      )}
    </div>
  );
}
