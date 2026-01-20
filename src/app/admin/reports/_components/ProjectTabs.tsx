"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Project {
  id: string;
  projectName: string;
  serviceStatus?: "normal" | "degraded" | "down";
}

interface ProjectTabsProps {
  projects: Project[];
  selectedProject: string;
  onSelectProject: (name: string) => void;
  onAddProject: (name: string) => void;
  onRemoveProject: (id: string) => void;
  showStatus?: boolean;
}

const STATUS_COLORS = {
  normal: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

export function ProjectTabs({
  projects,
  selectedProject,
  onSelectProject,
  onAddProject,
  onRemoveProject,
  showStatus = false,
}: ProjectTabsProps) {
  const [newProjectName, setNewProjectName] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setNewProjectName("");
      setShowAddProject(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Mantine Tabs - Pills variant style */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#1a1b23] rounded-lg">
        {/* 전체 탭 */}
        <button
          onClick={() => onSelectProject("전체")}
          className={`h-9 px-4 rounded-md text-sm font-medium transition-all duration-150 ${
            selectedProject === "전체"
              ? "bg-brand-primary text-white shadow-sm"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          전체
        </button>

        {/* 프로젝트 탭들 */}
        {projects.map((project) => (
          <div key={project.id} className="relative group">
            <button
              onClick={() => onSelectProject(project.projectName)}
              className={`h-9 px-4 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                selectedProject === project.projectName
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {showStatus && project.serviceStatus && (
                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[project.serviceStatus]}`} />
              )}
              {project.projectName}
            </button>
            {/* 삭제 버튼 - 호버 시 표시 */}
            <button
              onClick={() => onRemoveProject(project.id)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#25262b] border border-[#373A40] rounded-full text-gray-400 hover:text-red-400 hover:border-red-400/50 text-xs opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* 프로젝트 추가 */}
        {showAddProject ? (
          <div className="flex items-center gap-2 ml-1">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="프로젝트명"
              className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
            />
            <button
              onClick={handleAddProject}
              className="h-9 px-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-md text-sm font-medium transition-colors"
            >
              추가
            </button>
            <button
              onClick={() => {
                setShowAddProject(false);
                setNewProjectName("");
              }}
              className="h-9 px-3 text-gray-400 hover:text-white rounded-md hover:bg-white/5 text-sm transition-all duration-150"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddProject(true)}
            className="h-9 px-3 rounded-md text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-dashed border-[#373A40] hover:border-gray-500 transition-all duration-150 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            프로젝트 추가
          </button>
        )}
      </div>
    </div>
  );
}
