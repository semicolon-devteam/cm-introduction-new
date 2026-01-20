"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Target, BarChart3, CheckCircle2 } from "lucide-react";

import { ProjectTabs, ReportPreview, GoalCard, GOAL_CATEGORIES, GOAL_STATUS } from "../_components";
import type { GoalItem } from "../_components";

interface ProjectGoals {
  id: string;
  projectName: string;
  goals: GoalItem[];
  quarterlyTarget: string;
  yearlyTarget: string;
  notes: string;
}

const DEFAULT_PROJECTS = ["세미콜론 소개 사이트", "내부 관리 시스템", "클라이언트 프로젝트"];

export default function ProjectGoalsPage() {
  const [selectedProject, setSelectedProject] = useState("전체");
  const [projects, setProjects] = useState<ProjectGoals[]>(
    DEFAULT_PROJECTS.map((name, index) => ({
      id: String(index + 1),
      projectName: name,
      goals: [],
      quarterlyTarget: "",
      yearlyTarget: "",
      notes: "",
    })),
  );

  const currentProject = projects.find((p) => p.projectName === selectedProject);

  const updateProject = (projectId: string, updates: Partial<ProjectGoals>) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p)));
  };

  const addGoal = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        goals: [
          ...project.goals,
          {
            id: Date.now().toString(),
            category: "revenue",
            title: "",
            currentValue: "",
            targetValue: "",
            unit: "",
            deadline: new Date().toISOString().split("T")[0],
            status: "not_started",
          },
        ],
      });
    }
  };

  const updateGoal = (projectId: string, goalId: string, updates: Partial<GoalItem>) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        goals: project.goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g)),
      });
    }
  };

  const removeGoal = (projectId: string, goalId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, { goals: project.goals.filter((g) => g.id !== goalId) });
    }
  };

  const addProject = (name: string) => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        projectName: name,
        goals: [],
        quarterlyTarget: "",
        yearlyTarget: "",
        notes: "",
      },
    ]);
    setSelectedProject(name);
  };

  const removeProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && confirm(`"${project.projectName}" 프로젝트를 삭제하시겠습니까?`)) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (selectedProject === project.projectName) setSelectedProject("전체");
    }
  };

  const calculateProgress = (current: string, target: string) => {
    const curr = Number(current);
    const tgt = Number(target);
    if (!curr || !tgt) return null;
    return Math.min((curr / tgt) * 100, 100);
  };

  const generateProjectReport = (project: ProjectGoals) => {
    const goalsByCategory = project.goals.reduce(
      (acc, goal) => {
        if (!acc[goal.category]) acc[goal.category] = [];
        acc[goal.category].push(goal);
        return acc;
      },
      {} as Record<string, GoalItem[]>,
    );

    let goalList = "";
    for (const [category, goals] of Object.entries(goalsByCategory)) {
      const catInfo = GOAL_CATEGORIES[category as keyof typeof GOAL_CATEGORIES];
      goalList += `\n${catInfo.icon} ${catInfo.label} 목표:\n`;
      goals.forEach((g) => {
        const progress = calculateProgress(g.currentValue, g.targetValue);
        const progressStr = progress !== null ? ` (${progress.toFixed(1)}%)` : "";
        goalList += `  - [${GOAL_STATUS[g.status].label}] ${g.title || "제목 없음"}\n`;
        goalList += `    현재: ${g.currentValue || "0"}${g.unit} / 목표: ${g.targetValue || "0"}${g.unit}${progressStr}\n`;
        goalList += `    마감: ${g.deadline}\n`;
      });
    }

    if (!goalList) goalList = "  - 등록된 목표 없음";

    const achievedCount = project.goals.filter((g) => g.status === "achieved").length;
    const totalCount = project.goals.length;

    return `📁 ${project.projectName}

🎯 목표 현황: ${achievedCount}/${totalCount} 달성

📊 기간별 목표:
  - 분기 목표: ${project.quarterlyTarget ? `${Number(project.quarterlyTarget).toLocaleString()}원` : "미설정"}
  - 연간 목표: ${project.yearlyTarget ? `${Number(project.yearlyTarget).toLocaleString()}원` : "미설정"}
${goalList}${project.notes ? `\n📝 비고:\n${project.notes}` : ""}`;
  };

  const generateReport = () => {
    if (selectedProject === "전체") {
      const totalGoals = projects.reduce((sum, p) => sum + p.goals.length, 0);
      const achievedGoals = projects.reduce(
        (sum, p) => sum + p.goals.filter((g) => g.status === "achieved").length,
        0,
      );
      const totalQuarterly = projects.reduce((sum, p) => sum + (Number(p.quarterlyTarget) || 0), 0);
      const totalYearly = projects.reduce((sum, p) => sum + (Number(p.yearlyTarget) || 0), 0);
      const projectReports = projects
        .map(generateProjectReport)
        .join("\n\n" + "─".repeat(40) + "\n\n");

      return `📋 프로젝트별 목표치

📈 전체 현황:
  - 총 목표 수: ${totalGoals}개
  - 달성 목표: ${achievedGoals}개 (${totalGoals ? ((achievedGoals / totalGoals) * 100).toFixed(1) : 0}%)
  - 총 분기 목표: ${totalQuarterly.toLocaleString()}원
  - 총 연간 목표: ${totalYearly.toLocaleString()}원

${"═".repeat(40)}

${projectReports}`;
    }

    const project = projects.find((p) => p.projectName === selectedProject);
    return project ? `📋 프로젝트별 목표치\n\n${generateProjectReport(project)}` : "";
  };

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <header className="sticky top-0 z-10 border-b border-[#373A40] bg-[#1a1b23]/95 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/admin/reports"
            className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-white">프로젝트별 목표치</h1>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <ProjectTabs
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onAddProject={addProject}
          onRemoveProject={removeProject}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#373A40]">
              <h2 className="text-base font-semibold text-white">
                목표 관리{" "}
                {selectedProject !== "전체" && (
                  <span className="text-brand-primary ml-1">- {selectedProject}</span>
                )}
              </h2>
            </div>

            <div className="p-5">
              {selectedProject === "전체" ? (
                <div className="bg-[#25262b] rounded-md p-4 border border-[#373A40]">
                  <p className="text-[#909296] text-sm mb-2">
                    전체 보기에서는 모든 프로젝트의 목표 현황을 한 번에 볼 수 있습니다.
                  </p>
                  <p className="text-[#5c5f66] text-sm">
                    개별 프로젝트를 선택하여 내용을 입력하세요.
                  </p>
                </div>
              ) : currentProject ? (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-3">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      기간별 목표 (원)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          분기 목표
                        </label>
                        <input
                          type="number"
                          value={currentProject.quarterlyTarget}
                          onChange={(e) =>
                            updateProject(currentProject.id, { quarterlyTarget: e.target.value })
                          }
                          placeholder="예: 10000000"
                          className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          연간 목표
                        </label>
                        <input
                          type="number"
                          value={currentProject.yearlyTarget}
                          onChange={(e) =>
                            updateProject(currentProject.id, { yearlyTarget: e.target.value })
                          }
                          placeholder="예: 50000000"
                          className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <Target className="w-4 h-4 text-amber-400" />
                      세부 목표
                    </label>
                    <div className="space-y-3">
                      {currentProject.goals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onUpdate={(updates) => updateGoal(currentProject.id, goal.id, updates)}
                          onRemove={() => removeGoal(currentProject.id, goal.id)}
                        />
                      ))}
                    </div>
                    {currentProject.goals.length === 0 && (
                      <div className="text-center py-6 text-[#5c5f66] text-sm">
                        등록된 목표가 없습니다
                      </div>
                    )}
                    <button
                      onClick={() => addGoal(currentProject.id)}
                      className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all duration-150"
                    >
                      <Plus className="w-4 h-4" />
                      <span>목표 추가</span>
                    </button>
                  </div>

                  {currentProject.goals.length > 0 && (
                    <div className="bg-[#25262b] rounded-md p-4 border border-[#373A40]">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-gray-200">달성 현황</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        {(Object.keys(GOAL_STATUS) as Array<keyof typeof GOAL_STATUS>).map(
                          (status) => {
                            const count = currentProject.goals.filter(
                              (g) => g.status === status,
                            ).length;
                            return (
                              <div key={status} className="bg-[#1a1b23] rounded-md p-2">
                                <div
                                  className={`text-lg font-semibold ${GOAL_STATUS[status].color}`}
                                >
                                  {count}
                                </div>
                                <div className="text-xs text-[#5c5f66]">
                                  {GOAL_STATUS[status].label}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">📝 비고</label>
                    <textarea
                      value={currentProject.notes}
                      onChange={(e) => updateProject(currentProject.id, { notes: e.target.value })}
                      placeholder="추가 메모..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 resize-none transition-all duration-150"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <ReportPreview
            content={generateReport()}
            reportType="goals"
            reportTitle="프로젝트별 목표치"
          />
        </div>
      </main>
    </div>
  );
}
