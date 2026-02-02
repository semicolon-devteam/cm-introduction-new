"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

interface RankHistoryEntry {
  date: string;
  [keyword: string]: string | number;
}

interface RankHistoryChartProps {
  domain: string;
  keywords: string[];
}

// 색상 팔레트
const COLORS = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

export function RankHistoryChart({ domain, keywords }: RankHistoryChartProps) {
  const [historyData, setHistoryData] = useState<RankHistoryEntry[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const storageKey = `seo-rank-history-${domain}`;

  // localStorage에서 히스토리 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RankHistoryEntry[];
        setHistoryData(parsed);
      } catch {
        setHistoryData([]);
      }
    }

    // 기본 선택 키워드 설정
    if (keywords.length > 0 && selectedKeywords.length === 0) {
      setSelectedKeywords(keywords.slice(0, 3));
    }
  }, [storageKey, keywords, selectedKeywords.length]);

  // 기간에 따른 데이터 필터링
  const getFilteredData = () => {
    const now = new Date();
    const cutoffDays = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000);

    return historyData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
  };

  const filteredData = getFilteredData();

  // 키워드별 변화량 계산
  const getKeywordTrend = (keyword: string) => {
    if (filteredData.length < 2) return { change: 0, direction: "neutral" as const };

    const oldestRank = filteredData[0][keyword];
    const newestRank = filteredData[filteredData.length - 1][keyword];

    if (typeof oldestRank !== "number" || typeof newestRank !== "number") {
      return { change: 0, direction: "neutral" as const };
    }

    const change = oldestRank - newestRank; // 순위가 낮아지면 좋음
    const direction = change > 0 ? "up" : change < 0 ? "down" : "neutral";

    return { change: Math.abs(change), direction } as const;
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword],
    );
  };

  // 커스텀 툴팁
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { dataKey: string; value: number; color: string }[];
    label?: string;
  }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-[#25262b] border border-[#373A40] rounded-lg p-3 shadow-lg">
        <p className="text-xs text-[#909296] mb-2">{label}</p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-white">{item.dataKey}:</span>
            <span className="text-[#909296]">{item.value}위</span>
          </div>
        ))}
      </div>
    );
  };

  // Y축 반전 (1위가 위로)
  const maxRank = Math.max(
    ...filteredData.flatMap((entry) =>
      selectedKeywords.map((k) => {
        const val = entry[k];
        return typeof val === "number" ? val : 0;
      }),
    ),
    10,
  );

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-medium">순위 변화 추이</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* 기간 선택 */}
          <div className="flex bg-[#25262b] rounded-lg p-0.5">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-1 text-xs rounded ${
                  period === p ? "bg-cyan-600 text-white" : "text-[#909296] hover:text-white"
                }`}
              >
                {p === "7d" ? "7일" : p === "30d" ? "30일" : "90일"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 키워드 선택 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {keywords.map((keyword, idx) => {
          const isSelected = selectedKeywords.includes(keyword);
          const trend = getKeywordTrend(keyword);
          const color = COLORS[idx % COLORS.length];

          return (
            <button
              key={keyword}
              onClick={() => toggleKeyword(keyword)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition-all ${
                isSelected
                  ? "border-transparent text-white"
                  : "border-[#373A40] text-[#909296] hover:text-white hover:border-[#5c5f66]"
              }`}
              style={{
                backgroundColor: isSelected ? `${color}30` : "transparent",
                borderColor: isSelected ? color : undefined,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span>{keyword}</span>
              {trend.direction === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
              {trend.direction === "down" && <TrendingDown className="w-3 h-3 text-red-400" />}
              {trend.direction === "neutral" && <Minus className="w-3 h-3 text-[#5c5f66]" />}
            </button>
          );
        })}
      </div>

      {filteredData.length > 0 ? (
        <>
          {/* 차트 */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#373A40" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#909296", fontSize: 10 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  stroke="#373A40"
                />
                <YAxis
                  tick={{ fill: "#909296", fontSize: 10 }}
                  stroke="#373A40"
                  reversed
                  domain={[1, maxRank]}
                  tickFormatter={(value) => `${value}위`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#909296" }}
                  formatter={(value) => <span style={{ color: "#909296" }}>{value}</span>}
                />
                {selectedKeywords.map((keyword) => (
                  <Line
                    key={keyword}
                    type="monotone"
                    dataKey={keyword}
                    stroke={COLORS[keywords.indexOf(keyword) % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 요약 통계 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {selectedKeywords.slice(0, 4).map((keyword) => {
              const trend = getKeywordTrend(keyword);
              const latestEntry = filteredData[filteredData.length - 1];
              const currentRank = latestEntry?.[keyword];

              return (
                <div key={keyword} className="p-3 bg-[#25262b] rounded-lg">
                  <p className="text-xs text-[#909296] truncate">{keyword}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-white">
                      {typeof currentRank === "number" ? `${currentRank}위` : "-"}
                    </span>
                    {trend.change > 0 && (
                      <span
                        className={`text-xs flex items-center gap-0.5 ${
                          trend.direction === "up" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {trend.direction === "up" ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {trend.change}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-[#5c5f66]">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">순위 추적 데이터가 아직 없습니다</p>
          <p className="text-xs mt-1">
            &quot;순위 추적&quot; 도구를 사용하면 자동으로 히스토리가 기록됩니다
          </p>
        </div>
      )}

      {/* 도움말 */}
      <div className="mt-4 p-3 bg-[#25262b] rounded-lg">
        <p className="text-xs text-[#5c5f66]">
          💡 Y축이 반전되어 상위 순위(1위)가 위쪽에 표시됩니다. 그래프가 위로 갈수록 순위가 좋아지는
          것입니다.
        </p>
      </div>
    </div>
  );
}
