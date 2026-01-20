"use client";

import { Trash2 } from "lucide-react";

export interface GoalItem {
  id: string;
  category: "revenue" | "user" | "performance" | "feature" | "other";
  title: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  deadline: string;
  status: "not_started" | "in_progress" | "achieved" | "at_risk";
}

export const GOAL_CATEGORIES = {
  revenue: { label: "수익", icon: "💰" },
  user: { label: "사용자", icon: "👥" },
  performance: { label: "성능", icon: "⚡" },
  feature: { label: "기능", icon: "🛠️" },
  other: { label: "기타", icon: "📋" },
};

export const GOAL_STATUS = {
  not_started: {
    label: "시작 전",
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
  at_risk: {
    label: "위험",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
};

interface GoalCardProps {
  goal: GoalItem;
  onUpdate: (updates: Partial<GoalItem>) => void;
  onRemove: () => void;
}

export function GoalCard({ goal, onUpdate, onRemove }: GoalCardProps) {
  const calculateProgress = (current: string, target: string) => {
    const curr = Number(current);
    const tgt = Number(target);
    if (!curr || !tgt) return null;
    return Math.min((curr / tgt) * 100, 100);
  };

  const progress = calculateProgress(goal.currentValue, goal.targetValue);

  return (
    <div
      className={`bg-[#1a1b23] rounded-lg p-4 border ${GOAL_STATUS[goal.status].border} transition-all duration-150`}
    >
      {/* Row 1: Category, Status, Delete */}
      <div className="flex items-center gap-3 mb-3">
        <select
          value={goal.category}
          onChange={(e) => onUpdate({ category: e.target.value as GoalItem["category"] })}
          className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        >
          {(Object.keys(GOAL_CATEGORIES) as Array<keyof typeof GOAL_CATEGORIES>).map((cat) => (
            <option key={cat} value={cat} className="bg-[#25262b] text-white">
              {GOAL_CATEGORIES[cat].icon} {GOAL_CATEGORIES[cat].label}
            </option>
          ))}
        </select>
        <select
          value={goal.status}
          onChange={(e) => onUpdate({ status: e.target.value as GoalItem["status"] })}
          className={`h-9 px-3 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150 ${GOAL_STATUS[goal.status].bg} ${GOAL_STATUS[goal.status].color} border ${GOAL_STATUS[goal.status].border}`}
        >
          {(Object.keys(GOAL_STATUS) as Array<keyof typeof GOAL_STATUS>).map((status) => (
            <option key={status} value={status} className="bg-[#25262b] text-white">
              {GOAL_STATUS[status].label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={goal.deadline}
          onChange={(e) => onUpdate({ deadline: e.target.value })}
          className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        />
        <button
          onClick={onRemove}
          className="ml-auto w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
          aria-label="목표 삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Row 2: Title */}
      <input
        type="text"
        value={goal.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="목표 제목"
        className="w-full h-10 px-3 mb-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
      />

      {/* Row 3: Values */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input
          type="number"
          value={goal.currentValue}
          onChange={(e) => onUpdate({ currentValue: e.target.value })}
          placeholder="현재값"
          className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        />
        <input
          type="number"
          value={goal.targetValue}
          onChange={(e) => onUpdate({ targetValue: e.target.value })}
          placeholder="목표값"
          className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        />
        <input
          type="text"
          value={goal.unit}
          onChange={(e) => onUpdate({ unit: e.target.value })}
          placeholder="단위 (원, 명, %)"
          className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        />
      </div>

      {/* Progress Bar */}
      {progress !== null && (
        <div>
          <div className="flex justify-between text-xs text-[#909296] mb-1">
            <span>
              {goal.currentValue}
              {goal.unit} / {goal.targetValue}
              {goal.unit}
            </span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-[#25262b] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress >= 100
                  ? "bg-emerald-500"
                  : progress >= 70
                    ? "bg-brand-primary"
                    : progress >= 30
                      ? "bg-amber-500"
                      : "bg-red-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
