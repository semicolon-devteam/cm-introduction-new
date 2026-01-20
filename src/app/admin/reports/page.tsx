"use client";

import Link from "next/link";
import {
  FileText,
  TrendingUp,
  LogOut,
  ChevronRight,
  DollarSign,
  Target,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode } from "react";

interface ReportCard {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  footer: string;
}

function IconWrapper({
  icon: Icon,
  color,
  bg,
  bgHover,
}: {
  icon: LucideIcon;
  color: string;
  bg: string;
  bgHover: string;
}) {
  return (
    <div
      className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center ${bgHover} transition-colors`}
    >
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  );
}

export default function ReportsPage() {
  const handleLogout = () => {
    sessionStorage.removeItem("reports_auth");
    window.location.reload();
  };

  const reportCards: ReportCard[] = [
    {
      href: "/admin/reports/po",
      icon: (
        <IconWrapper
          icon={FileText}
          color="text-brand-primary"
          bg="bg-brand-primary/15"
          bgHover="group-hover:bg-brand-primary/25"
        />
      ),
      title: "PO 주간 리포트",
      description:
        "주간 지출 금액, 완료된 작업, 진행 중인 작업, 블로커 및 다음 주 계획을 기록합니다.",
      footer: "프로젝트별 PO 관점 리포트",
    },
    {
      href: "/admin/reports/operations",
      icon: (
        <IconWrapper
          icon={TrendingUp}
          color="text-blue-400"
          bg="bg-blue-400/15"
          bgHover="group-hover:bg-blue-400/25"
        />
      ),
      title: "운영 주간 리포트",
      description: "서비스 상태, 인시던트/장애 기록, 인프라 변경 및 모니터링 지표를 기록합니다.",
      footer: "프로젝트별 운영 현황 리포트",
    },
    {
      href: "/admin/reports/revenue",
      icon: (
        <IconWrapper
          icon={DollarSign}
          color="text-emerald-400"
          bg="bg-emerald-400/15"
          bgHover="group-hover:bg-emerald-400/25"
        />
      ),
      title: "수익 전환 일정표",
      description: "프로젝트별 수익 목표, 현재 달성률, 마일스톤 및 수익 전환 일정을 관리합니다.",
      footer: "수익화 로드맵 관리",
    },
    {
      href: "/admin/reports/goals",
      icon: (
        <IconWrapper
          icon={Target}
          color="text-amber-400"
          bg="bg-amber-400/15"
          bgHover="group-hover:bg-amber-400/25"
        />
      ),
      title: "프로젝트별 목표치",
      description: "분기/연간 목표, 카테고리별 세부 목표, 달성 현황 및 진척도를 추적합니다.",
      footer: "KPI 및 목표 관리",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#373A40] bg-[#1a1b23]/95 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">리포트 관리</h1>
          <button
            onClick={handleLogout}
            className="h-9 px-3 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all duration-150 text-sm"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reportCards.map((card) => (
            <Link key={card.href} href={card.href} className="group">
              <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden hover:border-brand-primary/50 transition-all duration-200">
                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {card.icon}
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2">{card.title}</h2>
                  <p className="text-[#909296] text-sm leading-relaxed">{card.description}</p>
                </div>
                {/* Card Footer */}
                <div className="px-6 py-3 border-t border-[#373A40] bg-[#25262b]/50">
                  <span className="text-xs text-[#5c5f66]">{card.footer}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
