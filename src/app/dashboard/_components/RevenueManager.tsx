"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  Target,
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ProjectType, ProjectRevenue, MonthlyRevenue } from "./types";
import { PROJECT_INFO } from "./types";

interface RevenueData {
  currentRevenue: number;
  targetRevenue: number;
  monthlyData: MonthlyRevenue[];
  projectRevenues?: ProjectRevenue[];
}

interface RevenueManagerProps {
  revenue: RevenueData;
  onSave: (revenue: RevenueData) => void;
}

// 현재 연도의 12개월 생성
function generateMonths(): string[] {
  const months: string[] = [];
  for (let i = 1; i <= 12; i++) {
    months.push(`${i}월`);
  }
  return months;
}

export function RevenueManager({ revenue, onSave }: RevenueManagerProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectType>("all");
  const [showMonthlyInput, setShowMonthlyInput] = useState(false);

  const months = useMemo(() => generateMonths(), []);

  // 프로젝트별 수익 데이터 초기화
  const projectRevenues =
    revenue.projectRevenues ||
    (Object.keys(PROJECT_INFO) as Array<Exclude<ProjectType, "all">>).map((project) => ({
      project,
      currentRevenue: 0,
      targetRevenue: 0,
      monthlyData: months.map((month) => ({ month, current: 0, target: 0 })),
    }));

  // 전체 수익 계산
  const totalCurrentRevenue = useMemo(() => {
    return projectRevenues.reduce((sum, p) => sum + p.currentRevenue, 0);
  }, [projectRevenues]);

  const totalTargetRevenue = useMemo(() => {
    return projectRevenues.reduce((sum, p) => sum + p.targetRevenue, 0);
  }, [projectRevenues]);

  // 현재 선택된 프로젝트의 수익 데이터
  const currentProjectRevenue = useMemo(() => {
    if (selectedProject === "all") {
      return {
        currentRevenue: totalCurrentRevenue,
        targetRevenue: totalTargetRevenue,
        monthlyData: months.map((month) => ({
          month,
          current: projectRevenues.reduce((sum, p) => {
            const monthData = p.monthlyData.find((m) => m.month === month);
            return sum + (monthData?.current || 0);
          }, 0),
          target: projectRevenues.reduce((sum, p) => {
            const monthData = p.monthlyData.find((m) => m.month === month);
            return sum + (monthData?.target || 0);
          }, 0),
        })),
      };
    }
    return (
      projectRevenues.find((p) => p.project === selectedProject) || {
        currentRevenue: 0,
        targetRevenue: 0,
        monthlyData: months.map((month) => ({ month, current: 0, target: 0 })),
      }
    );
  }, [selectedProject, projectRevenues, totalCurrentRevenue, totalTargetRevenue, months]);

  const progress =
    currentProjectRevenue.targetRevenue > 0
      ? Math.round(
          (currentProjectRevenue.currentRevenue / currentProjectRevenue.targetRevenue) * 100,
        )
      : 0;

  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return (value / 100000000).toFixed(1) + "억원";
    } else if (value >= 10000) {
      return (value / 10000).toFixed(0) + "만원";
    }
    return value.toLocaleString() + "원";
  };

  // 프로젝트별 수익 업데이트
  const updateProjectRevenue = (
    project: Exclude<ProjectType, "all">,
    field: "currentRevenue" | "targetRevenue",
    value: number,
  ) => {
    const updatedProjectRevenues = projectRevenues.map((p) => {
      if (p.project === project) {
        return { ...p, [field]: value };
      }
      return p;
    });

    const newTotalCurrent = updatedProjectRevenues.reduce((sum, p) => sum + p.currentRevenue, 0);
    const newTotalTarget = updatedProjectRevenues.reduce((sum, p) => sum + p.targetRevenue, 0);

    onSave({
      ...revenue,
      currentRevenue: newTotalCurrent,
      targetRevenue: newTotalTarget,
      projectRevenues: updatedProjectRevenues,
    });
  };

  // 월별 수익 업데이트
  const updateMonthlyRevenue = (
    project: Exclude<ProjectType, "all">,
    monthIndex: number,
    field: "current" | "target",
    value: number,
  ) => {
    const updatedProjectRevenues = projectRevenues.map((p) => {
      if (p.project === project) {
        const updatedMonthlyData = [...p.monthlyData];
        updatedMonthlyData[monthIndex] = {
          ...updatedMonthlyData[monthIndex],
          [field]: value,
        };

        // 월별 합계로 전체 수익 자동 계산
        const newCurrent =
          field === "current"
            ? updatedMonthlyData.reduce((sum, m) => sum + m.current, 0)
            : p.currentRevenue;
        const newTarget =
          field === "target"
            ? updatedMonthlyData.reduce((sum, m) => sum + m.target, 0)
            : p.targetRevenue;

        return {
          ...p,
          currentRevenue: newCurrent,
          targetRevenue: newTarget,
          monthlyData: updatedMonthlyData,
        };
      }
      return p;
    });

    const newTotalCurrent = updatedProjectRevenues.reduce((sum, p) => sum + p.currentRevenue, 0);
    const newTotalTarget = updatedProjectRevenues.reduce((sum, p) => sum + p.targetRevenue, 0);

    onSave({
      ...revenue,
      currentRevenue: newTotalCurrent,
      targetRevenue: newTotalTarget,
      projectRevenues: updatedProjectRevenues,
      monthlyData: months.map((month, idx) => ({
        month,
        current: updatedProjectRevenues.reduce(
          (sum, p) => sum + (p.monthlyData[idx]?.current || 0),
          0,
        ),
        target: updatedProjectRevenues.reduce(
          (sum, p) => sum + (p.monthlyData[idx]?.target || 0),
          0,
        ),
      })),
    });
  };

  return (
    <div className="bg-[#1a1b23]">
      {/* 프로젝트 선택 탭 */}
      <div className="px-5 py-3 border-b border-[#373A40] bg-[#25262b]/50">
        <div className="flex bg-[#1a1b23] rounded-md p-0.5">
          <button
            onClick={() => setSelectedProject("all")}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              selectedProject === "all"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            전체
          </button>
          {(Object.keys(PROJECT_INFO) as Array<Exclude<ProjectType, "all">>).map((project) => {
            const info = PROJECT_INFO[project];
            const isActive = selectedProject === project;
            return (
              <button
                key={project}
                onClick={() => setSelectedProject(project)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  isActive ? `${info.bg} ${info.color}` : "text-[#909296] hover:text-white"
                }`}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 수익 입력 (프로젝트별) */}
        {selectedProject !== "all" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                현재 수익 (원)
              </label>
              <input
                type="number"
                value={
                  projectRevenues.find((p) => p.project === selectedProject)?.currentRevenue || ""
                }
                onChange={(e) =>
                  updateProjectRevenue(
                    selectedProject as Exclude<ProjectType, "all">,
                    "currentRevenue",
                    Number(e.target.value) || 0,
                  )
                }
                placeholder="예: 5000000"
                className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-2">
                <Target className="w-4 h-4 text-amber-400" />
                목표 수익 (원)
              </label>
              <input
                type="number"
                value={
                  projectRevenues.find((p) => p.project === selectedProject)?.targetRevenue || ""
                }
                onChange={(e) =>
                  updateProjectRevenue(
                    selectedProject as Exclude<ProjectType, "all">,
                    "targetRevenue",
                    Number(e.target.value) || 0,
                  )
                }
                placeholder="예: 10000000"
                className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
              />
            </div>
          </div>
        )}

        {/* 달성률 표시 */}
        {(currentProjectRevenue.currentRevenue > 0 || currentProjectRevenue.targetRevenue > 0) && (
          <div className="bg-[#25262b] rounded-lg p-4 border border-[#373A40]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-200">
                {selectedProject === "all"
                  ? "전체 달성률"
                  : `${PROJECT_INFO[selectedProject as Exclude<ProjectType, "all">].label} 달성률`}
              </span>
              <span
                className={`text-lg font-bold ${
                  progress >= 100
                    ? "text-emerald-400"
                    : progress >= 70
                      ? "text-blue-400"
                      : progress >= 30
                        ? "text-amber-400"
                        : "text-red-400"
                }`}
              >
                {progress}%
              </span>
            </div>
            <div className="h-3 bg-[#373A40] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress >= 100
                    ? "bg-emerald-500"
                    : progress >= 70
                      ? "bg-blue-500"
                      : progress >= 30
                        ? "bg-amber-500"
                        : "bg-red-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#909296]">
              <span>현재: {formatCurrency(currentProjectRevenue.currentRevenue)}</span>
              <span>목표: {formatCurrency(currentProjectRevenue.targetRevenue)}</span>
            </div>
          </div>
        )}

        {/* 프로젝트별 수익 요약 (전체 선택 시) */}
        {selectedProject === "all" && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-200">프로젝트별 수익</h3>
            {(Object.keys(PROJECT_INFO) as Array<Exclude<ProjectType, "all">>).map((project) => {
              const info = PROJECT_INFO[project];
              const projectData = projectRevenues.find((p) => p.project === project);
              const projectProgress =
                projectData && projectData.targetRevenue > 0
                  ? Math.round((projectData.currentRevenue / projectData.targetRevenue) * 100)
                  : 0;

              return (
                <div key={project} className="bg-[#25262b] rounded-lg p-3 border border-[#373A40]">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${info.color}`}>{info.label}</span>
                    <span className="text-xs text-[#909296]">
                      {formatCurrency(projectData?.currentRevenue || 0)} /{" "}
                      {formatCurrency(projectData?.targetRevenue || 0)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#373A40] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300`}
                      style={{
                        width: `${Math.min(projectProgress, 100)}%`,
                        backgroundColor: info.color.includes("emerald")
                          ? "#10b981"
                          : info.color.includes("blue")
                            ? "#3b82f6"
                            : "#8b5cf6",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 월별 수익 입력 토글 */}
        {selectedProject !== "all" && (
          <div>
            <button
              onClick={() => setShowMonthlyInput(!showMonthlyInput)}
              className="flex items-center gap-2 text-sm text-[#909296] hover:text-white transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>월별 수익 입력</span>
              {showMonthlyInput ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showMonthlyInput && (
              <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
                {months.map((month, idx) => {
                  const projectData = projectRevenues.find((p) => p.project === selectedProject);
                  const monthData = projectData?.monthlyData[idx] || {
                    month,
                    current: 0,
                    target: 0,
                  };

                  return (
                    <div key={month} className="grid grid-cols-[60px_1fr_1fr] gap-2 items-center">
                      <span className="text-xs text-[#909296]">{month}</span>
                      <input
                        type="number"
                        value={monthData.current || ""}
                        onChange={(e) =>
                          updateMonthlyRevenue(
                            selectedProject as Exclude<ProjectType, "all">,
                            idx,
                            "current",
                            Number(e.target.value) || 0,
                          )
                        }
                        placeholder="현재"
                        className="h-8 px-2 bg-[#25262b] border border-[#373A40] rounded text-xs text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                      />
                      <input
                        type="number"
                        value={monthData.target || ""}
                        onChange={(e) =>
                          updateMonthlyRevenue(
                            selectedProject as Exclude<ProjectType, "all">,
                            idx,
                            "target",
                            Number(e.target.value) || 0,
                          )
                        }
                        placeholder="목표"
                        className="h-8 px-2 bg-[#25262b] border border-[#373A40] rounded text-xs text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 전체 수익 요약 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#25262b] rounded-lg p-3 border border-[#373A40] text-center">
            <div className="text-xs text-[#909296] mb-1">현재 수익</div>
            <div className="text-lg font-semibold text-emerald-400">
              {formatCurrency(currentProjectRevenue.currentRevenue)}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3 border border-[#373A40] text-center">
            <div className="text-xs text-[#909296] mb-1">목표 수익</div>
            <div className="text-lg font-semibold text-amber-400">
              {formatCurrency(currentProjectRevenue.targetRevenue)}
            </div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3 border border-[#373A40] text-center">
            <div className="text-xs text-[#909296] mb-1">남은 금액</div>
            <div
              className={`text-lg font-semibold ${
                currentProjectRevenue.targetRevenue - currentProjectRevenue.currentRevenue <= 0
                  ? "text-emerald-400"
                  : "text-blue-400"
              }`}
            >
              {formatCurrency(
                Math.max(
                  0,
                  currentProjectRevenue.targetRevenue - currentProjectRevenue.currentRevenue,
                ),
              )}
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        {totalCurrentRevenue === 0 && totalTargetRevenue === 0 && (
          <div className="text-center py-4 text-[#5c5f66] text-sm">
            <p>프로젝트별 수익 정보를 입력하면 대시보드에 진행률이 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
