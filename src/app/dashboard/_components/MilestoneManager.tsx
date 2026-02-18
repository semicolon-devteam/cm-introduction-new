"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import type { MilestoneItem } from "./types";

const MILESTONE_STATUS = {
  planned: { label: "예정", color: "text-blue-400", bg: "bg-blue-500/20" },
  in_progress: { label: "진행중", color: "text-amber-400", bg: "bg-amber-500/20" },
  achieved: { label: "달성", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  delayed: { label: "지연", color: "text-red-400", bg: "bg-red-500/20" },
};

interface MilestoneManagerProps {
  milestones: MilestoneItem[];
  onSave: (milestones: MilestoneItem[]) => void;
}

export function MilestoneManager({ milestones, onSave }: MilestoneManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MilestoneItem | null>(null);

  const addMilestone = () => {
    const newMilestone: MilestoneItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      title: "",
      targetRevenue: "",
      description: "",
      status: "planned",
    };
    setEditingId(newMilestone.id);
    setEditForm(newMilestone);
    onSave([...milestones, newMilestone]);
  };

  const startEdit = (milestone: MilestoneItem) => {
    setEditingId(milestone.id);
    setEditForm({ ...milestone });
  };

  const cancelEdit = () => {
    // 새로 추가된 항목이고 제목이 비어있으면 삭제
    if (editForm && !editForm.title) {
      onSave(milestones.filter((m) => m.id !== editForm.id));
    }
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (!editForm) return;
    onSave(milestones.map((m) => (m.id === editForm.id ? editForm : m)));
    setEditingId(null);
    setEditForm(null);
  };

  const deleteMilestone = (id: string) => {
    if (confirm("이 마일스톤을 삭제하시겠습니까?")) {
      onSave(milestones.filter((m) => m.id !== id));
    }
  };

  const formatCurrency = (value: string) => {
    const num = Number(value);
    return num ? `${num.toLocaleString()}원` : "-";
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">마일스톤 관리</h2>
        <button
          onClick={addMilestone}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>추가</span>
        </button>
      </div>

      <div className="p-5">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-[#5c5f66]">
            <p className="mb-2">등록된 마일스톤이 없습니다</p>
            <p className="text-sm">위의 추가 버튼을 클릭하여 마일스톤을 등록하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-[#25262b] rounded-lg border border-[#373A40] p-4"
              >
                {editingId === milestone.id && editForm ? (
                  // 편집 모드
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          제목 *
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="마일스톤 제목"
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          날짜
                        </label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          목표 수익 (원)
                        </label>
                        <input
                          type="number"
                          value={editForm.targetRevenue}
                          onChange={(e) =>
                            setEditForm({ ...editForm, targetRevenue: e.target.value })
                          }
                          placeholder="예: 5000000"
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#909296] mb-1.5">
                          상태
                        </label>
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              status: e.target.value as MilestoneItem["status"],
                            })
                          }
                          className="w-full h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary"
                        >
                          {Object.entries(MILESTONE_STATUS).map(([key, { label }]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#909296] mb-1.5">
                        설명
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="마일스톤 설명..."
                        rows={2}
                        className="w-full px-3 py-2 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary resize-none"
                      />
                    </div>
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
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-medium ${MILESTONE_STATUS[milestone.status].color}`}
                        >
                          {milestone.title || "(제목 없음)"}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${MILESTONE_STATUS[milestone.status].bg} ${MILESTONE_STATUS[milestone.status].color}`}
                        >
                          {MILESTONE_STATUS[milestone.status].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#909296]">
                        <span>{milestone.date}</span>
                        <span>목표: {formatCurrency(milestone.targetRevenue)}</span>
                      </div>
                      {milestone.description && (
                        <p className="mt-1 text-xs text-[#5c5f66] truncate">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(milestone)}
                        className="p-1.5 text-[#909296] hover:text-white hover:bg-white/5 rounded-md transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMilestone(milestone.id)}
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
