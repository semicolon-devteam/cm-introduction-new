"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

import type { SkillUsageStat } from "../_api-clients";

interface SkillUsageChartProps {
  data: SkillUsageStat[] | undefined;
  isLoading: boolean;
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="space-y-4 w-full px-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-24 h-4 bg-muted animate-pulse rounded" />
            <div
              className="h-6 bg-muted animate-pulse rounded"
              style={{ width: `${80 - i * 15}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillUsageChart({ data, isLoading }: SkillUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">스킬 사용 빈도 (Top 10)</CardTitle>
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
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="skillName"
                tick={{ fontSize: 12 }}
                width={90}
              />
              <Tooltip
                formatter={(value) => [`${value}회`, "호출 횟수"]}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
