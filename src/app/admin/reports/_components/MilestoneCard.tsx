"use client";

import { Trash2 } from "lucide-react";

export interface MilestoneItem {
  id: string;
  date: string;
  title: string;
  targetRevenue: string;
  description: string;
  status: "planned" | "in_progress" | "achieved" | "delayed";
}

export const MILESTONE_STATUS = {
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

interface MilestoneCardProps {
  milestone: MilestoneItem;
  onUpdate: (updates: Partial<MilestoneItem>) => void;
  onRemove: () => void;
}

export function MilestoneCard({ milestone, onUpdate, onRemove }: MilestoneCardProps) {
  return (
    <div
      className={`bg-[#1a1b23] rounded-lg p-4 border ${MILESTONE_STATUS[milestone.status].border} transition-all duration-150`}
    >
      {/* Row 1: Date, Status, Delete */}
      <div className="flex items-center gap-3 mb-3">
        <input
          type="date"
          value={milestone.date}
          onChange={(e) => onUpdate({ date: e.target.value })}
          className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        />
        <select
          value={milestone.status}
          onChange={(e) => onUpdate({ status: e.target.value as MilestoneItem["status"] })}
          className={`h-9 px-3 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150 ${MILESTONE_STATUS[milestone.status].bg} ${MILESTONE_STATUS[milestone.status].color} border ${MILESTONE_STATUS[milestone.status].border}`}
        >
          {(Object.keys(MILESTONE_STATUS) as Array<keyof typeof MILESTONE_STATUS>).map((status) => (
            <option key={status} value={status} className="bg-[#25262b] text-white">
              {MILESTONE_STATUS[status].label}
            </option>
          ))}
        </select>
        <button
          onClick={onRemove}
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
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="마일스톤 제목"
          className="h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        />
        <input
          type="number"
          value={milestone.targetRevenue}
          onChange={(e) => onUpdate({ targetRevenue: e.target.value })}
          placeholder="목표 수익 (원)"
          className="h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
        />
      </div>

      {/* Row 3: Description */}
      <input
        type="text"
        value={milestone.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="상세 설명 (선택)"
        className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
      />
    </div>
  );
}
