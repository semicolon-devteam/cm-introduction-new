"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, BarChart3, Calendar } from "lucide-react";

// 트렌드 데이터 타입
export interface SEOTrendData {
  date: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
  sessions?: number;
  pageViews?: number;
}

interface SEOTrendChartProps {
  data: SEOTrendData[];
  title?: string;
  className?: string;
}

type MetricKey = "clicks" | "impressions" | "ctr" | "position" | "sessions" | "pageViews";
type ChartType = "line" | "bar";

const METRIC_CONFIG: Record<MetricKey, { label: string; color: string; yAxisId: string }> = {
  clicks: { label: "클릭수", color: "#3B82F6", yAxisId: "left" },
  impressions: { label: "노출수", color: "#10B981", yAxisId: "left" },
  ctr: { label: "CTR (%)", color: "#F59E0B", yAxisId: "right" },
  position: { label: "순위", color: "#EF4444", yAxisId: "right" },
  sessions: { label: "세션", color: "#8B5CF6", yAxisId: "left" },
  pageViews: { label: "페이지뷰", color: "#EC4899", yAxisId: "left" },
};

export function SEOTrendChart({ data, title = "SEO 트렌드", className = "" }: SEOTrendChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(["clicks", "impressions"]);
  const [period, setPeriod] = useState<"7" | "14" | "28">("14");

  // 기간에 따른 데이터 필터링
  const filteredData = data.slice(-Number(period));

  // 메트릭 토글
  const toggleMetric = (metric: MetricKey) => {
    if (selectedMetrics.includes(metric)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  // 사용 가능한 메트릭 (데이터에 존재하는 것만)
  const availableMetrics = (Object.keys(METRIC_CONFIG) as MetricKey[]).filter((metric) =>
    data.some((d) => d[metric] !== undefined),
  );

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 숫자 포맷
  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // 커스텀 툴팁
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
  }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#1a1b23] border border-[#373A40] rounded-lg p-3 shadow-lg">
          <p className="text-xs text-[#909296] mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#909296]">
                {METRIC_CONFIG[entry.dataKey as MetricKey]?.label}:
              </span>
              <span className="text-white font-medium">
                {entry.dataKey === "ctr" ? `${entry.value}%` : formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 기간 선택 */}
          <div className="flex items-center gap-1 bg-[#25262b] rounded-lg p-0.5">
            {(["7", "14", "28"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  period === p ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
                }`}
              >
                {p}일
              </button>
            ))}
          </div>
          {/* 차트 타입 선택 */}
          <div className="flex items-center gap-1 bg-[#25262b] rounded-lg p-0.5">
            <button
              onClick={() => setChartType("line")}
              className={`p-1.5 rounded transition-colors ${
                chartType === "line"
                  ? "bg-brand-primary text-white"
                  : "text-[#909296] hover:text-white"
              }`}
              title="선 차트"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded transition-colors ${
                chartType === "bar"
                  ? "bg-brand-primary text-white"
                  : "text-[#909296] hover:text-white"
              }`}
              title="막대 차트"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* 메트릭 선택 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {availableMetrics.map((metric) => {
            const config = METRIC_CONFIG[metric];
            const isSelected = selectedMetrics.includes(metric);
            return (
              <button
                key={metric}
                onClick={() => toggleMetric(metric)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  isSelected
                    ? "border-transparent text-white"
                    : "border-[#373A40] text-[#909296] hover:border-[#5c5f66]"
                }`}
                style={{
                  backgroundColor: isSelected ? `${config.color}30` : "transparent",
                  borderColor: isSelected ? config.color : undefined,
                }}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 차트 */}
        {filteredData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#373A40" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fill: "#909296", fontSize: 11 }}
                    axisLine={{ stroke: "#373A40" }}
                    tickLine={{ stroke: "#373A40" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#909296", fontSize: 11 }}
                    axisLine={{ stroke: "#373A40" }}
                    tickLine={{ stroke: "#373A40" }}
                    tickFormatter={formatNumber}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#909296", fontSize: 11 }}
                    axisLine={{ stroke: "#373A40" }}
                    tickLine={{ stroke: "#373A40" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 10 }}
                    formatter={(value) => (
                      <span className="text-xs text-[#909296]">
                        {METRIC_CONFIG[value as MetricKey]?.label}
                      </span>
                    )}
                  />
                  {selectedMetrics.map((metric) => {
                    const config = METRIC_CONFIG[metric];
                    return (
                      <Line
                        key={metric}
                        type="monotone"
                        dataKey={metric}
                        stroke={config.color}
                        strokeWidth={2}
                        dot={{ fill: config.color, strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                        yAxisId={config.yAxisId}
                      />
                    );
                  })}
                </LineChart>
              ) : (
                <BarChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#373A40" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fill: "#909296", fontSize: 11 }}
                    axisLine={{ stroke: "#373A40" }}
                    tickLine={{ stroke: "#373A40" }}
                  />
                  <YAxis
                    tick={{ fill: "#909296", fontSize: 11 }}
                    axisLine={{ stroke: "#373A40" }}
                    tickLine={{ stroke: "#373A40" }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 10 }}
                    formatter={(value) => (
                      <span className="text-xs text-[#909296]">
                        {METRIC_CONFIG[value as MetricKey]?.label}
                      </span>
                    )}
                  />
                  {selectedMetrics.map((metric) => {
                    const config = METRIC_CONFIG[metric];
                    return (
                      <Bar
                        key={metric}
                        dataKey={metric}
                        fill={config.color}
                        radius={[4, 4, 0, 0]}
                      />
                    );
                  })}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-[#5c5f66]">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">트렌드 데이터가 없습니다</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 플랫폼 비교 차트 컴포넌트
interface PlatformComparisonData {
  platform: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  sessions?: number;
}

interface SEOPlatformComparisonProps {
  data: PlatformComparisonData[];
  className?: string;
}

export function SEOPlatformComparison({ data, className = "" }: SEOPlatformComparisonProps) {
  const [metric, setMetric] = useState<"clicks" | "impressions" | "sessions">("clicks");

  const metricLabels = {
    clicks: "클릭수",
    impressions: "노출수",
    sessions: "세션",
  };

  const platformColors: Record<string, string> = {
    Google: "#4285F4",
    Naver: "#03C75A",
    Bing: "#00809D",
    Direct: "#8B5CF6",
    Referral: "#F59E0B",
  };

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-white">플랫폼 비교</span>
        </div>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as typeof metric)}
          className="h-8 px-2 text-xs bg-[#25262b] border border-[#373A40] rounded text-white"
        >
          {Object.entries(metricLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-5">
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item) => {
              const value = item[metric] || 0;
              const maxValue = Math.max(...data.map((d) => d[metric] || 0), 1);
              const percentage = (value / maxValue) * 100;
              const color = platformColors[item.platform] || "#6B7280";

              return (
                <div key={item.platform}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-medium">{item.platform}</span>
                    <span className="text-[#909296]">{value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-[#25262b] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[#5c5f66]">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">플랫폼 데이터가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
