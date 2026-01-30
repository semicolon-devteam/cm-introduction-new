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
  Cell,
} from "recharts";
import type { ProjectType, ProjectRevenue, MonthlyRevenue } from "./types";
import { PROJECT_INFO } from "./types";

interface RevenueData {
  month: string;
  current: number;
  target: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  projectRevenues?: ProjectRevenue[];
  isLoading?: boolean;
}

const PROJECT_COLORS = {
  "cm-land": "#10b981",
  "cm-office": "#3b82f6",
  "cm-jungchipan": "#8b5cf6",
};

function ChartSkeleton() {
  return (
    <div className="h-[250px] flex items-center justify-center">
      <div className="w-full h-full flex items-end justify-around px-4 pb-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-8 bg-[#25262b] animate-pulse rounded-t"
            style={{ height: `${30 + Math.random() * 50}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// 금액 포맷팅 함수
function formatCurrency(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}만`;
  }
  return value.toLocaleString();
}

type ChartView = "trend" | "project";

export function RevenueChart({ data, projectRevenues, isLoading }: RevenueChartProps) {
  const [chartView, setChartView] = useState<ChartView>("trend");

  // 프로젝트별 데이터 변환
  const projectChartData = projectRevenues?.map((p) => ({
    name: PROJECT_INFO[p.project].label,
    project: p.project,
    current: p.currentRevenue,
    target: p.targetRevenue,
    progress: p.targetRevenue > 0 ? Math.round((p.currentRevenue / p.targetRevenue) * 100) : 0,
  })) || [];

  if (isLoading) {
    return (
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <h3 className="text-base font-semibold text-white mb-4">매출 트렌드</h3>
        <ChartSkeleton />
      </div>
    );
  }

  const hasProjectData = projectRevenues && projectRevenues.some(p => p.currentRevenue > 0 || p.targetRevenue > 0);
  const hasTrendData = data && data.length > 0 && data.some(d => d.current > 0 || d.target > 0);

  if (!hasProjectData && !hasTrendData) {
    return (
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <h3 className="text-base font-semibold text-white mb-4">매출 현황</h3>
        <div className="h-[250px] flex items-center justify-center text-[#5c5f66]">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">매출 현황</h3>
        {hasProjectData && hasTrendData && (
          <div className="flex bg-[#25262b] rounded-md p-0.5">
            <button
              onClick={() => setChartView("project")}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                chartView === "project"
                  ? "bg-brand-primary text-white"
                  : "text-[#909296] hover:text-white"
              }`}
            >
              프로젝트별
            </button>
            <button
              onClick={() => setChartView("trend")}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                chartView === "trend"
                  ? "bg-brand-primary text-white"
                  : "text-[#909296] hover:text-white"
              }`}
            >
              월별 트렌드
            </button>
          </div>
        )}
      </div>

      {/* 프로젝트별 차트 */}
      {(chartView === "project" || !hasTrendData) && hasProjectData && (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={projectChartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#373A40" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#909296" }}
              axisLine={{ stroke: "#373A40" }}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#909296" }}
              axisLine={{ stroke: "#373A40" }}
              tickLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#25262b",
                border: "1px solid #373A40",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(value, name, props) => {
                const numValue = typeof value === "number" ? value : 0;
                const payload = props.payload as typeof projectChartData[0];
                if (name === "current") {
                  return [`${numValue.toLocaleString()}원 (${payload.progress}%)`, "현재 매출"];
                }
                return [`${numValue.toLocaleString()}원`, "목표 매출"];
              }}
            />
            <Legend
              formatter={(value: string) =>
                value === "current" ? "현재 매출" : "목표 매출"
              }
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Bar dataKey="target" fill="#5c5f66" radius={[0, 4, 4, 0]} barSize={20} />
            <Bar dataKey="current" radius={[0, 4, 4, 0]} barSize={20}>
              {projectChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PROJECT_COLORS[entry.project as keyof typeof PROJECT_COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* 월별 트렌드 차트 */}
      {(chartView === "trend" || !hasProjectData) && hasTrendData && (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#373A40" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#909296" }}
              axisLine={{ stroke: "#373A40" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#909296" }}
              axisLine={{ stroke: "#373A40" }}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#25262b",
                border: "1px solid #373A40",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(value, name) => {
                const numValue = typeof value === "number" ? value : 0;
                return [
                  `${numValue.toLocaleString()}원`,
                  name === "current" ? "현재 매출" : "목표 매출",
                ];
              }}
            />
            <Legend
              formatter={(value: string) =>
                value === "current" ? "현재 매출" : "목표 매출"
              }
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#5c5f66"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: "#5c5f66" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* 프로젝트별 요약 */}
      {hasProjectData && chartView === "project" && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {projectChartData.map((project) => (
            <div
              key={project.project}
              className="text-center p-2 bg-[#25262b] rounded border border-[#373A40]"
            >
              <div className="text-xs text-[#909296] mb-1">{project.name}</div>
              <div
                className="text-sm font-semibold"
                style={{ color: PROJECT_COLORS[project.project as keyof typeof PROJECT_COLORS] }}
              >
                {project.progress}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
