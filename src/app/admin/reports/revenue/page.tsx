"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Calendar, DollarSign, TrendingUp } from "lucide-react";

import { ProjectTabs, ReportPreview } from "../_components";

interface MilestoneItem {
  id: string;
  date: string;
  title: string;
  targetRevenue: string;
  description: string;
  status: "planned" | "in_progress" | "achieved" | "delayed";
}

interface ProjectRevenue {
  id: string;
  projectName: string;
  milestones: MilestoneItem[];
  currentRevenue: string;
  targetRevenue: string;
  notes: string;
}

const DEFAULT_PROJECTS = ["세미콜론 소개 사이트", "내부 관리 시스템", "클라이언트 프로젝트"];

const MILESTONE_STATUS = {
  planned: {
    label: "예정",
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    border: "border-gray-400/30",
  },
  in_progress: {
    label: "진행중",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  achieved: {
    label: "달성",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  delayed: {
    label: "지연",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
};

export default function RevenueSchedulePage() {
  const [selectedProject, setSelectedProject] = useState("전체");
  const [projects, setProjects] = useState<ProjectRevenue[]>(
    DEFAULT_PROJECTS.map((name, index) => ({
      id: String(index + 1),
      projectName: name,
      milestones: [],
      currentRevenue: "",
      targetRevenue: "",
      notes: "",
    })),
  );

  const currentProject = projects.find((p) => p.projectName === selectedProject);

  const updateProject = (projectId: string, updates: Partial<ProjectRevenue>) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p)));
  };

  const addMilestone = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        milestones: [
          ...project.milestones,
          {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            title: "",
            targetRevenue: "",
            description: "",
            status: "planned",
          },
        ],
      });
    }
  };

  const updateMilestone = (
    projectId: string,
    milestoneId: string,
    updates: Partial<MilestoneItem>,
  ) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        milestones: project.milestones.map((m) =>
          m.id === milestoneId ? { ...m, ...updates } : m,
        ),
      });
    }
  };

  const removeMilestone = (projectId: string, milestoneId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        milestones: project.milestones.filter((m) => m.id !== milestoneId),
      });
    }
  };

  const addProject = (name: string) => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        projectName: name,
        milestones: [],
        currentRevenue: "",
        targetRevenue: "",
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

  const formatCurrency = (value: string) => {
    const num = Number(value);
    return num ? `${num.toLocaleString()}원` : "미입력";
  };

  const generateProjectReport = (project: ProjectRevenue) => {
    const milestoneList =
      project.milestones.length > 0
        ? project.milestones
            .map(
              (m) =>
                `  - [${MILESTONE_STATUS[m.status].label}] ${m.date}: ${m.title || "제목 없음"}\n    목표 수익: ${formatCurrency(m.targetRevenue)}${m.description ? `\n    ${m.description}` : ""}`,
            )
            .join("\n")
        : "  - 등록된 마일스톤 없음";

    const progress =
      project.currentRevenue && project.targetRevenue
        ? `${((Number(project.currentRevenue) / Number(project.targetRevenue)) * 100).toFixed(1)}%`
        : "N/A";

    return `📁 ${project.projectName}

💰 수익 현황:
  - 현재 수익: ${formatCurrency(project.currentRevenue)}
  - 목표 수익: ${formatCurrency(project.targetRevenue)}
  - 달성률: ${progress}

📅 수익 전환 마일스톤:
${milestoneList}${project.notes ? `\n\n📝 비고:\n${project.notes}` : ""}`;
  };

  const generateReport = () => {
    if (selectedProject === "전체") {
      const totalCurrent = projects.reduce((sum, p) => sum + (Number(p.currentRevenue) || 0), 0);
      const totalTarget = projects.reduce((sum, p) => sum + (Number(p.targetRevenue) || 0), 0);
      const totalProgress = totalTarget
        ? `${((totalCurrent / totalTarget) * 100).toFixed(1)}%`
        : "N/A";
      const projectReports = projects
        .map(generateProjectReport)
        .join("\n\n" + "─".repeat(40) + "\n\n");

      return `📋 수익 전환 일정표

📈 전체 현황:
  - 총 현재 수익: ${totalCurrent.toLocaleString()}원
  - 총 목표 수익: ${totalTarget.toLocaleString()}원
  - 전체 달성률: ${totalProgress}

${"═".repeat(40)}

${projectReports}`;
    }

    const project = projects.find((p) => p.projectName === selectedProject);
    return project ? `📋 수익 전환 일정표\n\n${generateProjectReport(project)}` : "";
  };

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#373A40] bg-[#1a1b23]/95 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/admin/reports"
            className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-white">수익 전환 일정표</h1>
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
          {/* Form Card */}
          <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-[#373A40]">
              <h2 className="text-base font-semibold text-white">
                일정 관리{" "}
                {selectedProject !== "전체" && (
                  <span className="text-brand-primary ml-1">- {selectedProject}</span>
                )}
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-5">
              {selectedProject === "전체" ? (
                <div className="bg-[#25262b] rounded-md p-4 border border-[#373A40]">
                  <p className="text-[#909296] text-sm mb-2">
                    전체 보기에서는 모든 프로젝트의 수익 현황을 한 번에 볼 수 있습니다.
                  </p>
                  <p className="text-[#5c5f66] text-sm">
                    개별 프로젝트를 선택하여 내용을 입력하세요.
                  </p>
                </div>
              ) : currentProject ? (
                <div className="space-y-6">
                  {/* Revenue Summary */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-3">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      수익 현황
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          현재 수익 (원)
                        </label>
                        <input
                          type="number"
                          value={currentProject.currentRevenue}
                          onChange={(e) =>
                            updateProject(currentProject.id, { currentRevenue: e.target.value })
                          }
                          placeholder="예: 1000000"
                          className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          목표 수익 (원)
                        </label>
                        <input
                          type="number"
                          value={currentProject.targetRevenue}
                          onChange={(e) =>
                            updateProject(currentProject.id, { targetRevenue: e.target.value })
                          }
                          placeholder="예: 5000000"
                          className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                        />
                      </div>
                    </div>
                    {/* Progress Bar */}
                    {currentProject.currentRevenue && currentProject.targetRevenue && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-[#909296] mb-1">
                          <span>달성률</span>
                          <span>
                            {(
                              (Number(currentProject.currentRevenue) /
                                Number(currentProject.targetRevenue)) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="h-2 bg-[#25262b] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-primary rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((Number(currentProject.currentRevenue) / Number(currentProject.targetRevenue)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      수익 전환 마일스톤
                    </label>

                    <div className="space-y-3">
                      {currentProject.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`bg-[#1a1b23] rounded-lg p-4 border ${MILESTONE_STATUS[milestone.status].border} transition-all duration-150`}
                        >
                          {/* Row 1: Date, Status, Delete */}
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="date"
                              value={milestone.date}
                              onChange={(e) =>
                                updateMilestone(currentProject.id, milestone.id, {
                                  date: e.target.value,
                                })
                              }
                              className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                            />
                            <select
                              value={milestone.status}
                              onChange={(e) =>
                                updateMilestone(currentProject.id, milestone.id, {
                                  status: e.target.value as MilestoneItem["status"],
                                })
                              }
                              className={`h-9 px-3 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150 ${MILESTONE_STATUS[milestone.status].bg} ${MILESTONE_STATUS[milestone.status].color} border ${MILESTONE_STATUS[milestone.status].border}`}
                            >
                              {(
                                Object.keys(MILESTONE_STATUS) as Array<
                                  keyof typeof MILESTONE_STATUS
                                >
                              ).map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                  className="bg-[#25262b] text-white"
                                >
                                  {MILESTONE_STATUS[status].label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => removeMilestone(currentProject.id, milestone.id)}
                              className="ml-auto w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
                              aria-label="마일스톤 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Row 2: Title and Target Revenue */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              value={milestone.title}
                              onChange={(e) =>
                                updateMilestone(currentProject.id, milestone.id, {
                                  title: e.target.value,
                                })
                              }
                              placeholder="마일스톤 제목"
                              className="h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                            />
                            <input
                              type="number"
                              value={milestone.targetRevenue}
                              onChange={(e) =>
                                updateMilestone(currentProject.id, milestone.id, {
                                  targetRevenue: e.target.value,
                                })
                              }
                              placeholder="목표 수익 (원)"
                              className="h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                            />
                          </div>

                          {/* Row 3: Description */}
                          <input
                            type="text"
                            value={milestone.description}
                            onChange={(e) =>
                              updateMilestone(currentProject.id, milestone.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="상세 설명 (선택)"
                            className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                          />
                        </div>
                      ))}
                    </div>

                    {currentProject.milestones.length === 0 && (
                      <div className="text-center py-6 text-[#5c5f66] text-sm">
                        등록된 마일스톤이 없습니다
                      </div>
                    )}

                    <button
                      onClick={() => addMilestone(currentProject.id)}
                      className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all duration-150"
                    >
                      <Plus className="w-4 h-4" />
                      <span>마일스톤 추가</span>
                    </button>
                  </div>

                  {/* Notes */}
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
            reportType="revenue"
            reportTitle="수익 전환 일정표"
          />
        </div>
      </main>
    </div>
  );
}
