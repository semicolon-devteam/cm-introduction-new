"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TaskSection, TaskItem, ProjectTabs, ReportPreview } from "../_components";

interface ProjectReport {
  id: string;
  projectName: string;
  spending: string;
  completedTasks: TaskItem[];
  inProgressTasks: TaskItem[];
  blockers: TaskItem[];
  nextWeekPlan: TaskItem[];
}

const DEFAULT_PROJECTS = ["세미콜론 소개 사이트", "내부 관리 시스템", "클라이언트 프로젝트"];

export default function POWeeklyReportPage() {
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
      spending: "",
      completedTasks: [{ id: "1", text: "" }],
      inProgressTasks: [{ id: "1", text: "" }],
      blockers: [{ id: "1", text: "" }],
      nextWeekPlan: [{ id: "1", text: "" }],
    })),
  );

  const currentProject = projects.find((p) => p.projectName === selectedProject);

  type TaskField = "completedTasks" | "inProgressTasks" | "blockers" | "nextWeekPlan";

  const updateProject = (
    projectId: string,
    field: TaskField | "spending",
    value: TaskItem[] | string,
  ) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, [field]: value } : p)));
  };

  const addTask = (projectId: string, field: TaskField) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, field, [...project[field], { id: Date.now().toString(), text: "" }]);
    }
  };

  const removeTask = (projectId: string, field: TaskField, taskId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && project[field].length > 1) {
      updateProject(
        projectId,
        field,
        project[field].filter((t) => t.id !== taskId),
      );
    }
  };

  const updateTask = (projectId: string, field: TaskField, taskId: string, text: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        field,
        project[field].map((t) => (t.id === taskId ? { ...t, text } : t)),
      );
    }
  };

  const addProject = (name: string) => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        projectName: name,
        spending: "",
        completedTasks: [{ id: "1", text: "" }],
        inProgressTasks: [{ id: "1", text: "" }],
        blockers: [{ id: "1", text: "" }],
        nextWeekPlan: [{ id: "1", text: "" }],
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

  const formatTaskList = (tasks: TaskItem[]) => {
    const filtered = tasks.filter((t) => t.text.trim());
    return filtered.length > 0 ? filtered.map((t) => `  - ${t.text}`).join("\n") : "  - 없음";
  };

  const generateProjectReport = (project: ProjectReport) => `📁 ${project.projectName}

💰 주간 지출: ${project.spending ? `${Number(project.spending).toLocaleString()}원` : "미입력"}

✅ 완료된 작업:
${formatTaskList(project.completedTasks)}

🔄 진행 중인 작업:
${formatTaskList(project.inProgressTasks)}

🚧 블로커:
${formatTaskList(project.blockers)}

📌 다음 주 계획:
${formatTaskList(project.nextWeekPlan)}`;

  const generateReport = () => {
    const totalSpending = projects.reduce((sum, p) => sum + (Number(p.spending) || 0), 0);

    if (selectedProject === "전체") {
      const projectReports = projects
        .map(generateProjectReport)
        .join("\n\n" + "─".repeat(40) + "\n\n");
      return `📋 PO 주간 리포트 (${formatDate(weekStart)})

💰 총 주간 지출: ${totalSpending.toLocaleString()}원

${"═".repeat(40)}

${projectReports}`;
    }

    const project = projects.find((p) => p.projectName === selectedProject);
    if (!project) return "";
    return `📋 PO 주간 리포트 (${formatDate(weekStart)})\n\n${generateProjectReport(project)}`;
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
          <h1 className="text-lg font-semibold text-white">PO 주간 리포트</h1>
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
              {/* Date Input - Mantine style */}
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
                  {/* Spending Input - Mantine NumberInput style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      주간 지출 금액 (원)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={currentProject.spending}
                        onChange={(e) =>
                          updateProject(currentProject.id, "spending", e.target.value)
                        }
                        placeholder="예: 500000"
                        className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                      />
                    </div>
                  </div>

                  <TaskSection
                    title="✅ 완료된 작업"
                    tasks={currentProject.completedTasks}
                    placeholder="완료된 작업"
                    onAdd={() => addTask(currentProject.id, "completedTasks")}
                    onRemove={(taskId) => removeTask(currentProject.id, "completedTasks", taskId)}
                    onUpdate={(taskId, text) =>
                      updateTask(currentProject.id, "completedTasks", taskId, text)
                    }
                  />

                  <TaskSection
                    title="🔄 진행 중인 작업"
                    tasks={currentProject.inProgressTasks}
                    placeholder="진행 중인 작업"
                    onAdd={() => addTask(currentProject.id, "inProgressTasks")}
                    onRemove={(taskId) => removeTask(currentProject.id, "inProgressTasks", taskId)}
                    onUpdate={(taskId, text) =>
                      updateTask(currentProject.id, "inProgressTasks", taskId, text)
                    }
                  />

                  <TaskSection
                    title="🚧 블로커 (장애물)"
                    tasks={currentProject.blockers}
                    placeholder="블로커"
                    onAdd={() => addTask(currentProject.id, "blockers")}
                    onRemove={(taskId) => removeTask(currentProject.id, "blockers", taskId)}
                    onUpdate={(taskId, text) =>
                      updateTask(currentProject.id, "blockers", taskId, text)
                    }
                  />

                  <TaskSection
                    title="📌 다음 주 계획"
                    tasks={currentProject.nextWeekPlan}
                    placeholder="다음 주 계획"
                    onAdd={() => addTask(currentProject.id, "nextWeekPlan")}
                    onRemove={(taskId) => removeTask(currentProject.id, "nextWeekPlan", taskId)}
                    onUpdate={(taskId, text) =>
                      updateTask(currentProject.id, "nextWeekPlan", taskId, text)
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>

          <ReportPreview
            content={generateReport()}
            reportType="po"
            reportTitle={`PO 주간 리포트 (${formatDate(weekStart)})`}
          />
        </div>
      </main>
    </div>
  );
}
