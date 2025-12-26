"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

import type { UsageTrend } from "../_api-clients";

interface UsageTrendChartProps {
  data: UsageTrend[] | undefined;
  isLoading: boolean;
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-full h-full flex items-end justify-around px-4 pb-8">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-8 bg-muted animate-pulse rounded-t"
            style={{ height: `${30 + Math.random() * 50}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function UsageTrendChart({ data, isLoading }: UsageTrendChartProps) {
  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const chartData = data?.map((item) => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">사용 추이</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            데이터가 없습니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(label) => `날짜: ${label}`}
                formatter={(value, name) => [
                  `${value}건`,
                  name === "interactions" ? "상호작용" : "메모리",
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "interactions" ? "상호작용" : "메모리"
                }
              />
              <Line
                type="monotone"
                dataKey="interactions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="memories"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
