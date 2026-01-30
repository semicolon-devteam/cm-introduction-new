"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Activity,
  Target,
  FileText,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { GoogleAnalyticsCard, SearchConsoleCard } from "../_components";

type SEOTab = "overview" | "tasks" | "reports" | "settings";

export default function SEODashboardPage() {
  const [activeTab, setActiveTab] = useState<SEOTab>("overview");

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-400" />
                SEO Command Center
              </h1>
              <p className="text-sm text-[#909296] mt-1">검색 엔진 최적화 통합 관리</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-1 mb-6 bg-[#1a1b23] rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "overview" ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            개요
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "tasks" ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
            }`}
          >
            <Target className="w-4 h-4" />
            작업 관리
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "reports" ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            리포트
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "settings" ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            설정
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "overview" && <SEOOverviewTab />}
        {activeTab === "tasks" && <SEOTasksTab />}
        {activeTab === "reports" && <SEOReportsTab />}
        {activeTab === "settings" && <SEOSettingsTab />}
      </main>
    </div>
  );
}

// 개요 탭
function SEOOverviewTab() {
  return (
    <div className="space-y-6">
      {/* 빠른 현황 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          label="검색 순위 상승"
          value="12"
          subtext="지난 7일"
          trend="up"
        />
        <QuickStatCard
          icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
          label="주의 필요"
          value="3"
          subtext="순위 하락 키워드"
          trend="warning"
        />
        <QuickStatCard
          icon={<CheckCircle className="w-5 h-5 text-blue-400" />}
          label="완료된 작업"
          value="8"
          subtext="이번 주"
          trend="neutral"
        />
        <QuickStatCard
          icon={<Clock className="w-5 h-5 text-purple-400" />}
          label="대기 중 작업"
          value="5"
          subtext="SEO 개선 항목"
          trend="neutral"
        />
      </div>

      {/* Analytics + Search Console */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GoogleAnalyticsCard />
        <SearchConsoleCard />
      </div>

      {/* 추가 플랫폼 연동 안내 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlatformCard
          name="Naver Search Advisor"
          description="네이버 검색 노출 현황"
          status="pending"
          color="text-green-400"
        />
        <PlatformCard
          name="Meta Business"
          description="소셜 트래픽 분석"
          status="pending"
          color="text-blue-400"
        />
        <PlatformCard
          name="Google AdSense"
          description="광고 수익 연동"
          status="pending"
          color="text-amber-400"
        />
      </div>
    </div>
  );
}

// 작업 관리 탭
function SEOTasksTab() {
  const [tasks] = useState([
    { id: 1, title: "메타 태그 최적화 - 메인 페이지", priority: "high", status: "in_progress", dueDate: "2026-02-05" },
    { id: 2, title: "이미지 alt 태그 추가", priority: "medium", status: "pending", dueDate: "2026-02-10" },
    { id: 3, title: "사이트맵 업데이트", priority: "low", status: "completed", dueDate: "2026-01-28" },
    { id: 4, title: "페이지 로딩 속도 개선", priority: "high", status: "pending", dueDate: "2026-02-07" },
    { id: 5, title: "모바일 UX 최적화", priority: "medium", status: "pending", dueDate: "2026-02-15" },
  ]);

  const priorityColors = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-amber-500/20 text-amber-400",
    low: "bg-blue-500/20 text-blue-400",
  };

  const statusLabels = {
    pending: { label: "대기", color: "text-[#909296]" },
    in_progress: { label: "진행중", color: "text-amber-400" },
    completed: { label: "완료", color: "text-emerald-400" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">SEO 작업 목록</h2>
        <button className="px-3 py-1.5 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary/90">
          + 작업 추가
        </button>
      </div>

      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#373A40]">
              <th className="text-left p-4 text-[#909296] font-medium">작업</th>
              <th className="text-center p-4 text-[#909296] font-medium w-24">우선순위</th>
              <th className="text-center p-4 text-[#909296] font-medium w-24">상태</th>
              <th className="text-center p-4 text-[#909296] font-medium w-28">마감일</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-[#373A40]/50 last:border-b-0 hover:bg-white/5">
                <td className="p-4 text-white">{task.title}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 text-xs rounded ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                    {task.priority === "high" ? "높음" : task.priority === "medium" ? "중간" : "낮음"}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={statusLabels[task.status as keyof typeof statusLabels].color}>
                    {statusLabels[task.status as keyof typeof statusLabels].label}
                  </span>
                </td>
                <td className="p-4 text-center text-[#909296]">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 리포트 탭
function SEOReportsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">SEO 리포트</h2>
        <button className="px-3 py-1.5 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary/90">
          리포트 생성
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <h3 className="text-sm font-medium text-white mb-2">주간 SEO 리포트</h3>
          <p className="text-xs text-[#909296] mb-4">매주 자동 생성되는 SEO 성과 리포트</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5c5f66]">마지막 생성: 2026-01-27</span>
            <button className="text-xs text-brand-primary hover:underline">보기</button>
          </div>
        </div>

        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <h3 className="text-sm font-medium text-white mb-2">월간 SEO 리포트</h3>
          <p className="text-xs text-[#909296] mb-4">월별 SEO 트렌드 및 개선 현황</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5c5f66]">마지막 생성: 2026-01-01</span>
            <button className="text-xs text-brand-primary hover:underline">보기</button>
          </div>
        </div>

        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 md:col-span-2">
          <h3 className="text-sm font-medium text-white mb-2">키워드 순위 추적 리포트</h3>
          <p className="text-xs text-[#909296] mb-4">주요 키워드의 순위 변동 추이</p>
          <div className="text-center py-8 text-[#5c5f66]">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">추적 중인 키워드가 없습니다</p>
            <button className="mt-2 text-xs text-brand-primary hover:underline">키워드 추가하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 설정 탭
function SEOSettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">SEO 설정</h2>

      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] divide-y divide-[#373A40]">
        {/* Google Analytics */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Google Analytics</h3>
              <p className="text-xs text-[#909296] mt-1">GA4 Property 연동</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-amber-500/20 text-amber-400">설정 필요</span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">
            환경 변수: GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY
          </div>
        </div>

        {/* Search Console */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Google Search Console</h3>
              <p className="text-xs text-[#909296] mt-1">검색 성과 데이터 연동</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-amber-500/20 text-amber-400">설정 필요</span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">환경 변수: SEARCH_CONSOLE_SITE_URL</div>
        </div>

        {/* Naver */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Naver Search Advisor</h3>
              <p className="text-xs text-[#909296] mt-1">네이버 검색 노출 현황</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-[#373A40] text-[#909296]">준비 중</span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">환경 변수: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET</div>
        </div>

        {/* Meta */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Meta Business</h3>
              <p className="text-xs text-[#909296] mt-1">소셜 트래픽 분석</p>
            </div>
            <span className="px-2 py-0.5 text-xs rounded bg-[#373A40] text-[#909296]">준비 중</span>
          </div>
          <div className="mt-3 text-xs text-[#5c5f66]">환경 변수: META_ACCESS_TOKEN, META_PIXEL_ID</div>
        </div>
      </div>
    </div>
  );
}

// 빠른 통계 카드 컴포넌트
function QuickStatCard({
  icon,
  label,
  value,
  subtext,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend: "up" | "down" | "warning" | "neutral";
}) {
  const trendBg = {
    up: "bg-emerald-500/10",
    down: "bg-red-500/10",
    warning: "bg-amber-500/10",
    neutral: "bg-[#25262b]",
  };

  return (
    <div className={`rounded-lg p-4 ${trendBg[trend]}`}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-[#909296]">{label}</div>
      <div className="text-xs text-[#5c5f66] mt-1">{subtext}</div>
    </div>
  );
}

// 플랫폼 카드 컴포넌트
function PlatformCard({
  name,
  description,
  status,
  color,
}: {
  name: string;
  description: string;
  status: "connected" | "pending" | "error";
  color: string;
}) {
  const statusConfig = {
    connected: { label: "연결됨", bg: "bg-emerald-500/20", text: "text-emerald-400" },
    pending: { label: "연동 대기", bg: "bg-[#373A40]", text: "text-[#909296]" },
    error: { label: "오류", bg: "bg-red-500/20", text: "text-red-400" },
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${color}`}>{name}</span>
        <span className={`px-2 py-0.5 text-xs rounded ${statusConfig[status].bg} ${statusConfig[status].text}`}>
          {statusConfig[status].label}
        </span>
      </div>
      <p className="text-xs text-[#5c5f66]">{description}</p>
      {status === "pending" && (
        <button className="mt-3 text-xs text-brand-primary hover:underline">연동하기 →</button>
      )}
    </div>
  );
}
