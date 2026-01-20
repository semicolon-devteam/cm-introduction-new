"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";

import {
  TaskItem,
  ProjectTabs,
  ReportPreview,
  IncidentSection,
  IncidentItem,
  INCIDENT_STATUS,
} from "../_components";

interface ProjectReport {
  id: string;
  projectName: string;
  serviceStatus: "normal" | "degraded" | "down";
  incidents: IncidentItem[];
  infraChanges: TaskItem[];
  metrics: { uptime: string; responseTime: string; errorRate: string; activeUsers: string };
  notes: string;
}

const DEFAULT_PROJECTS = ["세미콜론 소개 사이트", "내부 관리 시스템", "클라이언트 프로젝트"];
const STATUS_LABELS = {
  normal: { label: "정상", color: "bg-green-500" },
  degraded: { label: "성능 저하", color: "bg-yellow-500" },
  down: { label: "장애", color: "bg-red-500" },
};

export default function OperationsWeeklyReportPage() {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff)).toISOString().split("T")[0];
  });

  const [selectedProject, setSelectedProject] = useState("전체");
  const [projects, setProjects] = useState<ProjectReport[]>(
    DEFAULT_PROJECTS.map((name, index) => ({
      id: String(index + 1),
      projectName: name,
      serviceStatus: "normal" as const,
      incidents: [],
      infraChanges: [{ id: "1", text: "" }],
      metrics: { uptime: "", responseTime: "", errorRate: "", activeUsers: "" },
      notes: "",
    })),
  );

  const currentProject = projects.find((p) => p.projectName === selectedProject);

  const updateProject = (projectId: string, updates: Partial<ProjectReport>) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p)));
  };

  const addIncident = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        incidents: [
          ...project.incidents,
          {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            description: "",
            status: "resolved",
          },
        ],
      });
    }
  };

  const updateIncident = (
    projectId: string,
    incidentId: string,
    updates: Partial<IncidentItem>,
  ) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        incidents: project.incidents.map((i) => (i.id === incidentId ? { ...i, ...updates } : i)),
      });
    }
  };

  const removeIncident = (projectId: string, incidentId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project)
      updateProject(projectId, { incidents: project.incidents.filter((i) => i.id !== incidentId) });
  };

  const addProject = (name: string) => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        projectName: name,
        serviceStatus: "normal" as const,
        incidents: [],
        infraChanges: [{ id: "1", text: "" }],
        metrics: { uptime: "", responseTime: "", errorRate: "", activeUsers: "" },
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    return `${date.getMonth() + 1}/${date.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
  };

  const generateProjectReport = (project: ProjectReport) => {
    const incidentList =
      project.incidents.length > 0
        ? project.incidents
            .map(
              (i) =>
                `  - [${INCIDENT_STATUS[i.status].label}] ${i.date}: ${i.description || "내용 없음"}`,
            )
            .join("\n")
        : "  - 없음";
    const infraList =
      project.infraChanges.filter((c) => c.text.trim()).length > 0
        ? project.infraChanges
            .filter((c) => c.text.trim())
            .map((c) => `  - ${c.text}`)
            .join("\n")
        : "  - 없음";

    return `📁 ${project.projectName}

🚦 서비스 상태: ${STATUS_LABELS[project.serviceStatus].label}

📊 주요 지표:
  - Uptime: ${project.metrics.uptime || "N/A"}
  - 평균 응답시간: ${project.metrics.responseTime || "N/A"}
  - 에러율: ${project.metrics.errorRate || "N/A"}
  - 활성 사용자: ${project.metrics.activeUsers || "N/A"}

🚨 인시던트/장애:
${incidentList}

🔧 인프라 변경:
${infraList}${project.notes ? `\n\n📝 비고:\n${project.notes}` : ""}`;
  };

  const generateReport = () => {
    if (selectedProject === "전체") {
      const projectReports = projects
        .map(generateProjectReport)
        .join("\n\n" + "─".repeat(40) + "\n\n");
      const totalIncidents = projects.reduce((sum, p) => sum + p.incidents.length, 0);
      const normalCount = projects.filter((p) => p.serviceStatus === "normal").length;
      return `📋 운영 주간 리포트 (${formatDate(weekStart)})\n\n📈 전체 현황:\n  - 정상 서비스: ${normalCount}/${projects.length}\n  - 총 인시던트: ${totalIncidents}건\n\n${"═".repeat(40)}\n\n${projectReports}`;
    }
    const project = projects.find((p) => p.projectName === selectedProject);
    return project
      ? `📋 운영 주간 리포트 (${formatDate(weekStart)})\n\n${generateProjectReport(project)}`
      : "";
  };

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      {/* Header - Mantine AppShell Header style */}
      <header className="sticky top-0 z-10 border-b border-[#373A40] bg-[#1a1b23]/95 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/admin/reports"
            className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-white">운영 주간 리포트</h1>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <ProjectTabs
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onAddProject={addProject}
          onRemoveProject={removeProject}
          showStatus
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Card - Mantine Card style */}
          <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-[#373A40]">
              <h2 className="text-base font-semibold text-white">
                리포트 작성{" "}
                {selectedProject !== "전체" && (
                  <span className="text-brand-primary ml-1">- {selectedProject}</span>
                )}
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-5">
              {/* Date Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 mb-2">리포트 주차</label>
                <input
                  type="date"
                  value={weekStart}
                  onChange={(e) => setWeekStart(e.target.value)}
                  className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                />
              </div>

              {selectedProject === "전체" ? (
                <div className="bg-[#25262b] rounded-md p-4 border border-[#373A40]">
                  <p className="text-[#909296] text-sm mb-2">
                    전체 보기에서는 모든 프로젝트의 리포트를 한 번에 볼 수 있습니다.
                  </p>
                  <p className="text-[#5c5f66] text-sm">
                    개별 프로젝트를 선택하여 내용을 입력하세요.
                  </p>
                </div>
              ) : currentProject ? (
                <div className="space-y-6">
                  {/* Service Status - Mantine SegmentedControl style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      🚦 서비스 상태
                    </label>
                    <div className="inline-flex p-1 bg-[#25262b] rounded-md gap-1">
                      {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() =>
                              updateProject(currentProject.id, { serviceStatus: status })
                            }
                            className={`h-8 px-4 rounded text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                              currentProject.serviceStatus === status
                                ? "bg-[#1a1b23] text-white shadow-sm"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${STATUS_LABELS[status].color}`}
                            />
                            {STATUS_LABELS[status].label}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Metrics - Mantine SimpleGrid style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      📊 주요 지표
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "uptime", label: "Uptime", placeholder: "예: 99.9%" },
                        { key: "responseTime", label: "평균 응답시간", placeholder: "예: 120ms" },
                        { key: "errorRate", label: "에러율", placeholder: "예: 0.1%" },
                        { key: "activeUsers", label: "활성 사용자", placeholder: "예: 1,234명" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">
                            {label}
                          </label>
                          <input
                            type="text"
                            value={
                              currentProject.metrics[key as keyof typeof currentProject.metrics]
                            }
                            onChange={(e) =>
                              updateProject(currentProject.id, {
                                metrics: { ...currentProject.metrics, [key]: e.target.value },
                              })
                            }
                            placeholder={placeholder}
                            className="w-full h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <IncidentSection
                    incidents={currentProject.incidents}
                    onAdd={() => addIncident(currentProject.id)}
                    onRemove={(id) => removeIncident(currentProject.id, id)}
                    onUpdate={(id, updates) => updateIncident(currentProject.id, id, updates)}
                    onImportFromGitHub={(newIncidents) => {
                      updateProject(currentProject.id, {
                        incidents: [...currentProject.incidents, ...newIncidents],
                      });
                    }}
                  />

                  {/* Infra Changes - Mantine style */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-200">
                      🔧 인프라 변경
                    </label>
                    <div className="space-y-2">
                      {currentProject.infraChanges.map((change, index) => (
                        <div key={change.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={change.text}
                            onChange={(e) => {
                              const project = projects.find((p) => p.id === currentProject.id);
                              if (project)
                                updateProject(currentProject.id, {
                                  infraChanges: project.infraChanges.map((c) =>
                                    c.id === change.id ? { ...c, text: e.target.value } : c,
                                  ),
                                });
                            }}
                            placeholder={`변경 사항 ${index + 1}`}
                            className="flex-1 h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                          />
                          <button
                            onClick={() => {
                              if (currentProject.infraChanges.length > 1)
                                updateProject(currentProject.id, {
                                  infraChanges: currentProject.infraChanges.filter(
                                    (c) => c.id !== change.id,
                                  ),
                                });
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                            disabled={currentProject.infraChanges.length === 1}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        updateProject(currentProject.id, {
                          infraChanges: [
                            ...currentProject.infraChanges,
                            { id: Date.now().toString(), text: "" },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all duration-150"
                    >
                      <Plus className="w-4 h-4" />
                      <span>항목 추가</span>
                    </button>
                  </div>

                  {/* Notes - Mantine Textarea style */}
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
            reportType="operations"
            reportTitle={`운영 주간 리포트 (${formatDate(weekStart)})`}
          />
        </div>
      </main>
    </div>
  );
}
