"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// 목표 카테고리 정의 (로컬)
const GOAL_CATEGORIES = {
  revenue: { label: "수익", icon: "💰" },
  user: { label: "사용자", icon: "👥" },
  performance: { label: "성능", icon: "⚡" },
  feature: { label: "기능", icon: "🛠️" },
  other: { label: "기타", icon: "📋" },
};

interface GoalProgressData {
  category: keyof typeof GOAL_CATEGORIES;
  achieved: number;
  total: number;
  percentage: number;
}

interface GoalProgressChartProps {
  data: GoalProgressData[];
  isLoading?: boolean;
}

const CATEGORY_COLORS = {
  revenue: "#10b981",
  user: "#3b82f6",
  performance: "#f59e0b",
  feature: "#8b5cf6",
  other: "#6b7280",
};

function ChartSkeleton() {
  return (
    <div className="h-[250px] flex items-center justify-center">
      <div className="w-full h-full flex items-end justify-around px-4 pb-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-12 bg-[#25262b] animate-pulse rounded-t"
            style={{ height: `${30 + Math.random() * 50}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function GoalProgressChart({ data, isLoading }: GoalProgressChartProps) {
  if (isLoading) {
    return (
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <h3 className="text-base font-semibold text-white mb-4">목표 달성 현황</h3>
        <ChartSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <h3 className="text-base font-semibold text-white mb-4">목표 달성 현황</h3>
        <div className="h-[250px] flex items-center justify-center text-[#5c5f66]">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    name: `${GOAL_CATEGORIES[item.category].icon} ${GOAL_CATEGORIES[item.category].label}`,
    displayLabel: GOAL_CATEGORIES[item.category].label,
  }));

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <h3 className="text-base font-semibold text-white mb-4">목표 달성 현황</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#373A40" vertical={false} />
          <XAxis
            dataKey="displayLabel"
            tick={{ fontSize: 11, fill: "#909296" }}
            axisLine={{ stroke: "#373A40" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#909296" }}
            axisLine={{ stroke: "#373A40" }}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#25262b",
              border: "1px solid #373A40",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#fff" }}
            formatter={(value, _name, props) => {
              const payload = props.payload as GoalProgressData;
              const numValue = typeof value === "number" ? value : 0;
              return [`${numValue.toFixed(0)}% (${payload.achieved}/${payload.total})`, "달성률"];
            }}
          />
          <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
