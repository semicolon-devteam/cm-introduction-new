"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Edit2, Check, X, Filter } from "lucide-react";
import type { GoalItem, ProjectType } from "./types";
import { PROJECT_INFO } from "./types";

const GOAL_CATEGORIES = {
  revenue: { label: "매출", icon: "💰", color: "text-emerald-400" },
  user: { label: "사용자", icon: "👥", color: "text-blue-400" },
  performance: { label: "성능", icon: "⚡", color: "text-amber-400" },
  feature: { label: "기능", icon: "🚀", color: "text-purple-400" },
  other: { label: "기타", icon: "📋", color: "text-gray-400" },
};

const GOAL_STATUS = {
  not_started: { label: "시작 전", color: "text-gray-400", bg: "bg-gray-500/20" },
  in_progress: { label: "진행중", color: "text-amber-400", bg: "bg-amber-500/20" },
  achieved: { label: "달성", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  at_risk: { label: "위험", color: "text-red-400", bg: "bg-red-500/20" },
};

interface GoalManagerProps {
  goals: GoalItem[];
  onSave: (goals: GoalItem[]) => void;
}

export function GoalManager({ goals, onSave }: GoalManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GoalItem | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectType>("all");

  // 프로젝트별 필터링된 목표
  const filteredGoals = useMemo(() => {
    if (projectFilter === "all") return goals;
    return goals.filter((g) => g.project === projectFilter);
  }, [goals, projectFilter]);

  // 프로젝트별 목표 수 계산
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = { all: goals.length };
    (Object.keys(PROJECT_INFO) as Array<Exclude<ProjectType, "all">>).forEach((project) => {
      counts[project] = goals.filter((g) => g.project === project).length;
    });
    return counts;
  }, [goals]);

  const addGoal = () => {
    const newGoal: GoalItem = {
      id: Date.now().toString(),
      category: "revenue",
      title: "",
      currentValue: "",
      targetValue: "",
      unit: "",
      deadline: new Date().toISOString().split("T")[0],
      status: "not_started",
      project: projectFilter === "all" ? "cm-land" : projectFilter,
    };
    setEditingId(newGoal.id);
    setEditForm(newGoal);
    onSave([...goals, newGoal]);
  };

  const startEdit = (goal: GoalItem) => {
    setEditingId(goal.id);
    setEditForm({ ...goal });
  };

  const cancelEdit = () => {
    if (editForm && !editForm.title) {
      onSave(goals.filter((g) => g.id !== editForm.id));
    }
    setEditingId(null);
    setEditForm(null);
  };

  // 진행률 기반 자동 상태 계산
  const calculateAutoStatus = (current: string, target: string, deadline: string): GoalItem["status"] => {
    const curr = Number(current);
    const tgt = Number(target);
    if (!curr || !tgt) return "not_started";

    const progress = (curr / tgt) * 100;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (progress >= 100) return "achieved";
    if (progress > 0 && daysLeft < 0) return "at_risk"; // 마감일 지났는데 미달성
    if (progress > 0 && daysLeft < 7 && progress < 70) return "at_risk"; // 7일 남았는데 70% 미만
    if (progress > 0) return "in_progress";
    return "not_started";
  };

  const saveEdit = () => {
    if (!editForm) return;

    // 자동 상태 계산 (수동 변경 안 했으면)
    const autoStatus = calculateAutoStatus(editForm.currentValue, editForm.targetValue, editForm.deadline);
    const updatedGoal = { ...editForm, status: autoStatus };

    onSave(goals.map((g) => (g.id === editForm.id ? updatedGoal : g)));
    setEditingId(null);
    setEditForm(null);
  };

  const deleteGoal = (id: string) => {
    if (confirm("이 목표를 삭제하시겠습니까?")) {
      onSave(goals.filter((g) => g.id !== id));
    }
  };

  const calculateProgress = (current: string, target: string) => {
    const curr = Number(current);
    const tgt = Number(target);
    if (!curr || !tgt) return null;
    return Math.min((curr / tgt) * 100, 100);
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">목표 관리</h2>
        <button
          onClick={addGoal}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>추가</span>
        </button>
      </div>

      {/* 프로젝트 필터 */}
      <div className="px-5 py-3 border-b border-[#373A40] bg-[#25262b]/50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#909296]" />
          <div className="flex bg-[#1a1b23] rounded-md p-0.5">
            <button
              onClick={() => setProjectFilter("all")}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                projectFilter === "all"
                  ? "bg-brand-primary text-white"
                  : "text-[#909296] hover:text-white"
              }`}
            >
              전체 ({projectCounts.all})
            </button>
            {(Object.keys(PROJECT_INFO) as Array<Exclude<ProjectType, "all">>).map((project) => {
              const info = PROJECT_INFO[project];
              const isActive = projectFilter === project;
              return (
                <button
                  key={project}
                  onClick={() => setProjectFilter(project)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    isActive
                      ? `${info.bg} ${info.color}`
                      : "text-[#909296] hover:text-white"
                  }`}
                >
                  {info.label} ({projectCounts[project] || 0})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-5">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 text-[#5c5f66]">
            <p className="mb-2">등록된 목표가 없습니다</p>
            <p className="text-sm">위의 추가 버튼을 클릭하여 목표를 등록하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-[#25262b] rounded-lg border border-[#373A40] p-4"
              >
                {editingId === goal.id && editForm ? (
                  // 편집 모드
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          제목 *
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="목표 제목"
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          프로젝트
                        </label>
                        <select
                          value={editForm.project || "cm-land"}
                          onChange={(e) => setEditForm({ ...editForm, project: e.target.value as Exclude<ProjectType, "all"> })}
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        >
                          {(Object.keys(PROJECT_INFO) as Array<Exclude<ProjectType, "all">>).map((project) => (
                            <option key={project} value={project}>{PROJECT_INFO[project].label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          카테고리
                        </label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value as GoalItem["category"] })}
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        >
                          {Object.entries(GOAL_CATEGORIES).map(([key, { label, icon }]) => (
                            <option key={key} value={key}>{icon} {label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          마감일
                        </label>
                        <input
                          type="date"
                          value={editForm.deadline}
                          onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          현재값
                        </label>
                        <input
                          type="number"
                          value={editForm.currentValue}
                          onChange={(e) => setEditForm({ ...editForm, currentValue: e.target.value })}
                          placeholder="0"
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          목표값
                        </label>
                        <input
                          type="number"
                          value={editForm.targetValue}
                          onChange={(e) => setEditForm({ ...editForm, targetValue: e.target.value })}
                          placeholder="100"
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          단위
                        </label>
                        <input
                          type="text"
                          value={editForm.unit}
                          onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                          placeholder="예: 원, 명, %"
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    {/* 자동 계산된 진행률 미리보기 */}
                    {calculateProgress(editForm.currentValue, editForm.targetValue) !== null && (
                      <div className="p-3 bg-[#1a1b23] rounded-md border border-[#373A40]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[#909296]">진행률 (자동 계산)</span>
                          <span className="text-sm font-medium text-brand-primary">
                            {calculateProgress(editForm.currentValue, editForm.targetValue)?.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#373A40] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-primary rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress(editForm.currentValue, editForm.targetValue)}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-[#5c5f66]">
                          예상 상태: <span className={GOAL_STATUS[calculateAutoStatus(editForm.currentValue, editForm.targetValue, editForm.deadline)].color}>
                            {GOAL_STATUS[calculateAutoStatus(editForm.currentValue, editForm.targetValue, editForm.deadline)].label}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 h-8 px-3 text-sm text-[#909296] hover:text-white hover:bg-white/5 rounded-md transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>취소</span>
                      </button>
                      <button
                        onClick={saveEdit}
                        disabled={!editForm.title}
                        className="inline-flex items-center gap-1 h-8 px-3 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-4 h-4" />
                        <span>저장</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // 보기 모드
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* 프로젝트 뱃지 */}
                        {goal.project && (
                          <span className={`px-1.5 py-0.5 text-xs rounded ${PROJECT_INFO[goal.project].bg} ${PROJECT_INFO[goal.project].color}`}>
                            {PROJECT_INFO[goal.project].label}
                          </span>
                        )}
                        <span className="text-sm">{GOAL_CATEGORIES[goal.category].icon}</span>
                        <span className="text-sm font-medium text-white">
                          {goal.title || "(제목 없음)"}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${GOAL_STATUS[goal.status].bg} ${GOAL_STATUS[goal.status].color}`}>
                          {GOAL_STATUS[goal.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#909296]">
                        <span>{GOAL_CATEGORIES[goal.category].label}</span>
                        <span>
                          {goal.currentValue || 0}{goal.unit} / {goal.targetValue || 0}{goal.unit}
                          {calculateProgress(goal.currentValue, goal.targetValue) !== null && (
                            <span className="ml-1 text-brand-primary">
                              ({calculateProgress(goal.currentValue, goal.targetValue)?.toFixed(0)}%)
                            </span>
                          )}
                        </span>
                        <span>마감: {goal.deadline}</span>
                      </div>
                      {/* 진행률 바 */}
                      {calculateProgress(goal.currentValue, goal.targetValue) !== null && (
                        <div className="mt-2 h-1.5 bg-[#373A40] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              goal.status === "achieved" ? "bg-emerald-500" :
                              goal.status === "at_risk" ? "bg-red-500" :
                              "bg-brand-primary"
                            }`}
                            style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(goal)}
                        className="p-1.5 text-[#909296] hover:text-white hover:bg-white/5 rounded-md transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 text-[#909296] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
