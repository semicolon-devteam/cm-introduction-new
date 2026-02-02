"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

type PeriodFilter = "week" | "month" | "quarter";

interface DashboardHeaderProps {
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
}

export function DashboardHeader({ period, onPeriodChange }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/reports"
          className="flex items-center gap-2 text-[#909296] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">리포트 목록</span>
        </Link>
        <div className="h-6 w-px bg-[#373A40]" />
        <h1 className="text-xl font-semibold text-white">통합 대시보드</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* 기간 선택 */}
        <div className="flex bg-[#25262b] rounded-md p-0.5">
          {(
            [
              { value: "week", label: "주간" },
              { value: "month", label: "월간" },
              { value: "quarter", label: "분기" },
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              onClick={() => onPeriodChange(item.value)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                period === item.value
                  ? "bg-brand-primary text-white"
                  : "text-[#909296] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 리포트 생성 버튼 */}
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm rounded-md transition-colors">
          <FileText className="w-4 h-4" />
          리포트 생성
        </button>
      </div>
    </div>
  );
}
