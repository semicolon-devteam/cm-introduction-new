"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Filter,
  TrendingUp,
  MessageSquare,
  History,
  ChevronDown,
  ChevronUp,
  Target,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { GoalItem, GoalHistory, GoalMilestone, GoalPrediction, ProjectType } from "./types";
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

const PREDICTION_STATUS = {
  high: { label: "달성 가능성 높음", color: "text-emerald-400", icon: CheckCircle },
  medium: { label: "노력 필요", color: "text-amber-400", icon: TrendingUp },
  low: { label: "달성 어려움", color: "text-orange-400", icon: AlertTriangle },
  impossible: { label: "달성 불가", color: "text-red-400", icon: X },
};

interface GoalManagerProps {
  goals: GoalItem[];
  onSave: (goals: GoalItem[]) => void;
}

// 목표 달성 예측 계산
function calculatePrediction(goal: GoalItem): GoalPrediction | null {
  const current = Number(goal.currentValue);
  const target = Number(goal.targetValue);
  const start = Number(goal.startValue) || 0;

  if (!target || target <= 0) return null;
  if (current >= target) {
    return {
      estimatedDate: null,
      requiredDailyRate: 0,
      currentDailyRate: 0,
      probability: "high",
      daysRemaining: 0,
      onTrack: true,
    };
  }

  const now = new Date();
  const deadline = new Date(goal.deadline);
  const startDate = goal.startDate ? new Date(goal.startDate) : new Date(goal.createdAt || now);

  const daysElapsed = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const progressMade = current - start;
  const remainingProgress = target - current;

  // 현재 일일 진행률
  const currentDailyRate = progressMade / daysElapsed;

  // 목표 달성에 필요한 일일 진행률
  const requiredDailyRate = daysRemaining > 0 ? remainingProgress / daysRemaining : remainingProgress;

  // 예상 달성일 계산
  let estimatedDate: string | null = null;
  if (currentDailyRate > 0) {
    const daysToComplete = remainingProgress / currentDailyRate;
    const estimated = new Date(now.getTime() + daysToComplete * 24 * 60 * 60 * 1000);
    estimatedDate = estimated.toISOString().split("T")[0];
  }

  // 달성 확률 판단
  let probability: GoalPrediction["probability"] = "medium";
  const ratio = currentDailyRate / requiredDailyRate;

  if (daysRemaining <= 0 && current < target) {
    probability = "impossible";
  } else if (ratio >= 1.2) {
    probability = "high";
  } else if (ratio >= 0.8) {
    probability = "medium";
  } else if (ratio >= 0.5) {
    probability = "low";
  } else {
    probability = "impossible";
  }

  return {
    estimatedDate,
    requiredDailyRate: Math.round(requiredDailyRate * 100) / 100,
    currentDailyRate: Math.round(currentDailyRate * 100) / 100,
    probability,
    daysRemaining,
    onTrack: ratio >= 1,
  };
}

// 히스토리 기록 추가
function addHistoryEntry(
  field: string,
  oldValue: string,
  newValue: string,
  reason?: string
): GoalHistory {
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    field,
    oldValue,
    newValue,
    reason,
  };
}

export function GoalManager({ goals, onSave }: GoalManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GoalItem | null>(null);
  const [projectFilter, setProjectFilter] = useState<ProjectType>("all");
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [showMilestoneInput, setShowMilestoneInput] = useState<string | null>(null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneValue, setNewMilestoneValue] = useState("");

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
    const now = new Date().toISOString();
    const newGoal: GoalItem = {
      id: Date.now().toString(),
      category: "revenue",
      title: "",
      currentValue: "",
      targetValue: "",
      unit: "",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30일 후
      status: "not_started",
      project: projectFilter === "all" ? "cm-land" : projectFilter,
      memo: "",
      history: [],
      milestones: [],
      createdAt: now,
      startValue: "0",
      startDate: now.split("T")[0],
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
    if (progress > 0 && daysLeft < 0) return "at_risk";
    if (progress > 0 && daysLeft < 7 && progress < 70) return "at_risk";
    if (progress > 0) return "in_progress";
    return "not_started";
  };

  const saveEdit = () => {
    if (!editForm) return;

    const originalGoal = goals.find((g) => g.id === editForm.id);
    const history = [...(editForm.history || [])];

    // 변경 사항 히스토리에 기록
    if (originalGoal) {
      if (originalGoal.currentValue !== editForm.currentValue) {
        history.push(addHistoryEntry("현재값", originalGoal.currentValue, editForm.currentValue));
      }
      if (originalGoal.targetValue !== editForm.targetValue) {
        history.push(addHistoryEntry("목표값", originalGoal.targetValue, editForm.targetValue));
      }
      if (originalGoal.deadline !== editForm.deadline) {
        history.push(addHistoryEntry("마감일", originalGoal.deadline, editForm.deadline));
      }
    }

    const autoStatus = calculateAutoStatus(editForm.currentValue, editForm.targetValue, editForm.deadline);
    const updatedGoal = { ...editForm, status: autoStatus, history };

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

  // 마일스톤 추가
  const addMilestone = (goalId: string) => {
    if (!newMilestoneTitle.trim()) return;

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newMilestone: GoalMilestone = {
      id: Date.now().toString(),
      title: newMilestoneTitle,
      targetValue: newMilestoneValue || "0",
      completed: false,
    };

    const updatedGoal = {
      ...goal,
      milestones: [...(goal.milestones || []), newMilestone],
    };

    onSave(goals.map((g) => (g.id === goalId ? updatedGoal : g)));
    setNewMilestoneTitle("");
    setNewMilestoneValue("");
    setShowMilestoneInput(null);
  };

  // 마일스톤 완료 토글
  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || !goal.milestones) return;

    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
        : m
    );

    onSave(goals.map((g) => (g.id === goalId ? { ...g, milestones: updatedMilestones } : g)));
  };

  // 마일스톤 삭제
  const deleteMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || !goal.milestones) return;

    const updatedMilestones = goal.milestones.filter((m) => m.id !== milestoneId);
    onSave(goals.map((g) => (g.id === goalId ? { ...g, milestones: updatedMilestones } : g)));
  };

  return (
    <div className="bg-[#1a1b23]">
      {/* 상단 툴바 */}
      <div className="px-5 py-3 border-b border-[#373A40] bg-[#25262b]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#909296]" />
          <div className="flex bg-[#1a1b23] rounded-md p-0.5">
            <button
              onClick={() => setProjectFilter("all")}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                projectFilter === "all" ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
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
                    isActive ? `${info.bg} ${info.color}` : "text-[#909296] hover:text-white"
                  }`}
                >
                  {info.label} ({projectCounts[project] || 0})
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={addGoal}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>목표 추가</span>
        </button>
      </div>

      <div className="p-5">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 text-[#5c5f66]">
            <p className="mb-2">등록된 목표가 없습니다</p>
            <p className="text-sm">위의 추가 버튼을 클릭하여 목표를 등록하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGoals.map((goal) => {
              const prediction = calculatePrediction(goal);
              const isExpanded = expandedGoalId === goal.id;

              return (
                <div key={goal.id} className="bg-[#25262b] rounded-lg border border-[#373A40] overflow-hidden">
                  {editingId === goal.id && editForm ? (
                    // 편집 모드
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">제목 *</label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            placeholder="목표 제목"
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">프로젝트</label>
                          <select
                            value={editForm.project || "cm-land"}
                            onChange={(e) =>
                              setEditForm({ ...editForm, project: e.target.value as Exclude<ProjectType, "all"> })
                            }
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                          >
                            {(Object.keys(PROJECT_INFO) as Array<Exclude<ProjectType, "all">>).map((project) => (
                              <option key={project} value={project}>
                                {PROJECT_INFO[project].label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">카테고리</label>
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value as GoalItem["category"] })
                            }
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                          >
                            {Object.entries(GOAL_CATEGORIES).map(([key, { label, icon }]) => (
                              <option key={key} value={key}>
                                {icon} {label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">마감일</label>
                          <input
                            type="date"
                            value={editForm.deadline}
                            onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">시작값</label>
                          <input
                            type="number"
                            value={editForm.startValue || ""}
                            onChange={(e) => setEditForm({ ...editForm, startValue: e.target.value })}
                            placeholder="0"
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">현재값</label>
                          <input
                            type="number"
                            value={editForm.currentValue}
                            onChange={(e) => setEditForm({ ...editForm, currentValue: e.target.value })}
                            placeholder="0"
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">목표값</label>
                          <input
                            type="number"
                            value={editForm.targetValue}
                            onChange={(e) => setEditForm({ ...editForm, targetValue: e.target.value })}
                            placeholder="100"
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#909296] mb-1.5">단위</label>
                          <input
                            type="text"
                            value={editForm.unit}
                            onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                            placeholder="예: 원, 명, %"
                            className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      </div>
                      {/* 메모 필드 */}
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          메모
                        </label>
                        <textarea
                          value={editForm.memo || ""}
                          onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
                          placeholder="이 목표에 대한 메모를 작성하세요..."
                          rows={2}
                          className="w-full px-3 py-2 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary resize-none"
                        />
                      </div>
                      {/* 진행률 미리보기 */}
                      {calculateProgress(editForm.currentValue, editForm.targetValue) !== null && (
                        <div className="p-3 bg-[#1a1b23] rounded-md border border-[#373A40]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#909296]">진행률</span>
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
                    <>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {goal.project && (
                                <span
                                  className={`px-1.5 py-0.5 text-xs rounded ${PROJECT_INFO[goal.project].bg} ${PROJECT_INFO[goal.project].color}`}
                                >
                                  {PROJECT_INFO[goal.project].label}
                                </span>
                              )}
                              <span className="text-sm">{GOAL_CATEGORIES[goal.category].icon}</span>
                              <span className="text-sm font-medium text-white">{goal.title || "(제목 없음)"}</span>
                              <span
                                className={`px-2 py-0.5 text-xs rounded ${GOAL_STATUS[goal.status].bg} ${GOAL_STATUS[goal.status].color}`}
                              >
                                {GOAL_STATUS[goal.status].label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-[#909296]">
                              <span>{GOAL_CATEGORIES[goal.category].label}</span>
                              <span>
                                {goal.currentValue || 0}
                                {goal.unit} / {goal.targetValue || 0}
                                {goal.unit}
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
                                    goal.status === "achieved"
                                      ? "bg-emerald-500"
                                      : goal.status === "at_risk"
                                        ? "bg-red-500"
                                        : "bg-brand-primary"
                                  }`}
                                  style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                                />
                              </div>
                            )}
                            {/* 예측 정보 */}
                            {prediction && prediction.probability !== "high" && goal.status !== "achieved" && (
                              <div className="mt-2 flex items-center gap-2 text-xs">
                                {(() => {
                                  const PredIcon = PREDICTION_STATUS[prediction.probability].icon;
                                  return (
                                    <>
                                      <PredIcon
                                        className={`w-3.5 h-3.5 ${PREDICTION_STATUS[prediction.probability].color}`}
                                      />
                                      <span className={PREDICTION_STATUS[prediction.probability].color}>
                                        {PREDICTION_STATUS[prediction.probability].label}
                                      </span>
                                      {prediction.estimatedDate && (
                                        <span className="text-[#909296]">
                                          · 예상 달성일: {prediction.estimatedDate}
                                        </span>
                                      )}
                                      {prediction.daysRemaining > 0 && (
                                        <span className="text-[#909296]">· {prediction.daysRemaining}일 남음</span>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                            {/* 메모 미리보기 */}
                            {goal.memo && (
                              <div className="mt-2 text-xs text-[#5c5f66] truncate">
                                <MessageSquare className="w-3 h-3 inline mr-1" />
                                {goal.memo}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                              className="p-1.5 text-[#909296] hover:text-white hover:bg-white/5 rounded-md transition-all"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
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
                      </div>

                      {/* 확장 영역 - 마일스톤, 히스토리 */}
                      {isExpanded && (
                        <div className="border-t border-[#373A40] bg-[#1a1b23]">
                          {/* 예측 상세 */}
                          {prediction && (
                            <div className="p-4 border-b border-[#373A40]">
                              <h4 className="text-xs font-medium text-[#909296] mb-2 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                달성 예측
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div className="bg-[#25262b] rounded p-2">
                                  <div className="text-[#5c5f66]">현재 일일 진행률</div>
                                  <div className="text-white font-medium">
                                    {prediction.currentDailyRate}
                                    {goal.unit}/일
                                  </div>
                                </div>
                                <div className="bg-[#25262b] rounded p-2">
                                  <div className="text-[#5c5f66]">필요 일일 진행률</div>
                                  <div
                                    className={`font-medium ${prediction.onTrack ? "text-emerald-400" : "text-amber-400"}`}
                                  >
                                    {prediction.requiredDailyRate}
                                    {goal.unit}/일
                                  </div>
                                </div>
                                <div className="bg-[#25262b] rounded p-2">
                                  <div className="text-[#5c5f66]">예상 달성일</div>
                                  <div className="text-white font-medium">{prediction.estimatedDate || "-"}</div>
                                </div>
                                <div className="bg-[#25262b] rounded p-2">
                                  <div className="text-[#5c5f66]">남은 일수</div>
                                  <div
                                    className={`font-medium ${prediction.daysRemaining < 0 ? "text-red-400" : "text-white"}`}
                                  >
                                    {prediction.daysRemaining}일
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 마일스톤 */}
                          <div className="p-4 border-b border-[#373A40]">
                            <h4 className="text-xs font-medium text-[#909296] mb-2 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Target className="w-3.5 h-3.5" />
                                마일스톤 ({goal.milestones?.length || 0})
                              </span>
                              <button
                                onClick={() => setShowMilestoneInput(showMilestoneInput === goal.id ? null : goal.id)}
                                className="text-brand-primary hover:text-brand-primary/80"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </h4>
                            {showMilestoneInput === goal.id && (
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={newMilestoneTitle}
                                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                                  placeholder="마일스톤 제목"
                                  className="flex-1 h-8 px-2 bg-[#25262b] border border-[#373A40] rounded text-xs text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                                />
                                <input
                                  type="text"
                                  value={newMilestoneValue}
                                  onChange={(e) => setNewMilestoneValue(e.target.value)}
                                  placeholder={`목표값 (${goal.unit})`}
                                  className="w-24 h-8 px-2 bg-[#25262b] border border-[#373A40] rounded text-xs text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                                />
                                <button
                                  onClick={() => addMilestone(goal.id)}
                                  className="h-8 px-3 bg-brand-primary text-white text-xs rounded hover:bg-brand-primary/90"
                                >
                                  추가
                                </button>
                              </div>
                            )}
                            {goal.milestones && goal.milestones.length > 0 ? (
                              <div className="space-y-1">
                                {goal.milestones.map((milestone) => (
                                  <div
                                    key={milestone.id}
                                    className="flex items-center gap-2 text-xs bg-[#25262b] rounded p-2"
                                  >
                                    <button
                                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                                      className={`w-4 h-4 rounded border ${
                                        milestone.completed
                                          ? "bg-emerald-500 border-emerald-500 text-white"
                                          : "border-[#373A40] hover:border-brand-primary"
                                      } flex items-center justify-center`}
                                    >
                                      {milestone.completed && <Check className="w-3 h-3" />}
                                    </button>
                                    <span
                                      className={`flex-1 ${milestone.completed ? "text-[#5c5f66] line-through" : "text-white"}`}
                                    >
                                      {milestone.title}
                                    </span>
                                    {milestone.targetValue && (
                                      <span className="text-[#909296]">
                                        {milestone.targetValue}
                                        {goal.unit}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => deleteMilestone(goal.id, milestone.id)}
                                      className="text-[#5c5f66] hover:text-red-400"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-[#5c5f66]">마일스톤이 없습니다</p>
                            )}
                          </div>

                          {/* 히스토리 */}
                          <div className="p-4">
                            <h4 className="text-xs font-medium text-[#909296] mb-2 flex items-center gap-1">
                              <History className="w-3.5 h-3.5" />
                              변경 히스토리 ({goal.history?.length || 0})
                            </h4>
                            {goal.history && goal.history.length > 0 ? (
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {goal.history
                                  .slice()
                                  .reverse()
                                  .map((h) => (
                                    <div key={h.id} className="text-xs bg-[#25262b] rounded p-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[#909296]">
                                          {h.field}: {h.oldValue || "(없음)"} → {h.newValue}
                                        </span>
                                        <span className="text-[#5c5f66]">
                                          {new Date(h.timestamp).toLocaleDateString("ko-KR")}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-xs text-[#5c5f66]">변경 기록이 없습니다</p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
