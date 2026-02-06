"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { BarChart3, MousePointerClick, Eye, Target } from "lucide-react";

interface SEOTrendData {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
  ctr?: number;
}

interface SEOTrendChartProps {
  trendData: SEOTrendData[];
}

type MetricType = "clicks" | "impressions" | "position" | "ctr";

const METRIC_CONFIG = {
  clicks: {
    label: "클릭수",
    color: "#10b981",
    icon: MousePointerClick,
    format: (v: number) => v.toLocaleString(),
  },
  impressions: {
    label: "노출수",
    color: "#3b82f6",
    icon: Eye,
    format: (v: number) => v.toLocaleString(),
  },
  position: {
    label: "평균 순위",
    color: "#f59e0b",
    icon: Target,
    format: (v: number) => v.toFixed(1),
    reversed: true,
  },
  ctr: {
    label: "CTR",
    color: "#8b5cf6",
    icon: BarChart3,
    format: (v: number) => `${(v * 100).toFixed(2)}%`,
  },
};

export function SEOTrendChart({ trendData }: SEOTrendChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(["clicks", "impressions"]);
  const [chartType, setChartType] = useState<"line" | "area">("area");

  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-medium">Search Console 트렌드</h3>
        </div>
        <div className="text-center py-8 text-[#5c5f66]">
          <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Search Console 데이터가 없습니다</p>
          <p className="text-xs mt-1">설정에서 Search Console을 연결해주세요</p>
        </div>
      </div>
    );
  }

  const toggleMetric = (metric: MetricType) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric],
    );
  };

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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
        {payload.map((item, idx) => {
          const config = METRIC_CONFIG[item.dataKey as MetricType];
          return (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-white">{config?.label}:</span>
              <span className="text-[#909296]">{config?.format(item.value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // 차트 데이터 포맷
  const chartData = trendData.map((d) => ({
    ...d,
    date: formatDate(d.date),
    ctr: d.ctr ?? 0,
  }));

  // Y축 도메인 계산 (position은 반전)
  const hasPosition = selectedMetrics.includes("position");
  const hasOtherMetrics = selectedMetrics.some((m) => m !== "position");

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-medium">Search Console 트렌드</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* 차트 타입 선택 */}
          <div className="flex bg-[#25262b] rounded-lg p-0.5">
            <button
              onClick={() => setChartType("area")}
              className={`px-2 py-1 text-xs rounded ${
                chartType === "area" ? "bg-blue-600 text-white" : "text-[#909296] hover:text-white"
              }`}
            >
              영역
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-2 py-1 text-xs rounded ${
                chartType === "line" ? "bg-blue-600 text-white" : "text-[#909296] hover:text-white"
              }`}
            >
              선형
            </button>
          </div>
        </div>
      </div>

      {/* 메트릭 선택 버튼 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(METRIC_CONFIG) as MetricType[]).map((metric) => {
          const config = METRIC_CONFIG[metric];
          const Icon = config.icon;
          const isSelected = selectedMetrics.includes(metric);

          return (
            <button
              key={metric}
              onClick={() => toggleMetric(metric)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
                isSelected
                  ? "border-transparent text-white"
                  : "border-[#373A40] text-[#909296] hover:text-white hover:border-[#5c5f66]"
              }`}
              style={{
                backgroundColor: isSelected ? `${config.color}20` : "transparent",
                borderColor: isSelected ? config.color : undefined,
              }}
            >
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: isSelected ? config.color : undefined }}
              />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* 차트 */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                {selectedMetrics.map((metric) => (
                  <linearGradient
                    key={metric}
                    id={`gradient-${metric}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={METRIC_CONFIG[metric].color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={METRIC_CONFIG[metric].color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#373A40" />
              <XAxis dataKey="date" tick={{ fill: "#909296", fontSize: 10 }} stroke="#373A40" />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#909296", fontSize: 10 }}
                stroke="#373A40"
                hide={!hasOtherMetrics}
              />
              {hasPosition && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  reversed
                  tick={{ fill: "#909296", fontSize: 10 }}
                  stroke="#373A40"
                  tickFormatter={(v) => `${v}위`}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => (
                  <span style={{ color: "#909296" }}>
                    {METRIC_CONFIG[value as MetricType]?.label}
                  </span>
                )}
              />
              {selectedMetrics.map((metric) => (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={METRIC_CONFIG[metric].color}
                  fill={`url(#gradient-${metric})`}
                  strokeWidth={2}
                  yAxisId={metric === "position" ? "right" : "left"}
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#373A40" />
              <XAxis dataKey="date" tick={{ fill: "#909296", fontSize: 10 }} stroke="#373A40" />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#909296", fontSize: 10 }}
                stroke="#373A40"
                hide={!hasOtherMetrics}
              />
              {hasPosition && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  reversed
                  tick={{ fill: "#909296", fontSize: 10 }}
                  stroke="#373A40"
                  tickFormatter={(v) => `${v}위`}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => (
                  <span style={{ color: "#909296" }}>
                    {METRIC_CONFIG[value as MetricType]?.label}
                  </span>
                )}
              />
              {selectedMetrics.map((metric) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={METRIC_CONFIG[metric].color}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  yAxisId={metric === "position" ? "right" : "left"}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {(Object.keys(METRIC_CONFIG) as MetricType[]).map((metric) => {
          const config = METRIC_CONFIG[metric];
          const Icon = config.icon;
          const values = chartData.map((d) => d[metric] as number).filter((v) => v > 0);
          const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          const latest = chartData[chartData.length - 1]?.[metric] as number;

          return (
            <div key={metric} className="p-3 bg-[#25262b] rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                <span className="text-xs text-[#909296]">{config.label}</span>
              </div>
              <div className="text-lg font-bold text-white">{config.format(latest || 0)}</div>
              <div className="text-xs text-[#5c5f66]">평균: {config.format(avg)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
