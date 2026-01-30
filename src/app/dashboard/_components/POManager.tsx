"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, CheckCircle, Clock, AlertTriangle, Calendar, DollarSign } from "lucide-react";
import type { POData, TaskItem } from "./types";

interface POManagerProps {
  poData: POData;
  onSave: (poData: POData) => void;
}

type TaskType = "completedTasks" | "inProgressTasks" | "blockers" | "nextWeekPlan";

const TASK_SECTIONS: Array<{
  key: TaskType;
  label: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
}> = [
  {
    key: "completedTasks",
    label: "완료된 작업",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-emerald-400",
    placeholder: "이번 주 완료한 작업...",
  },
  {
    key: "inProgressTasks",
    label: "진행중인 작업",
    icon: <Clock className="w-5 h-5" />,
    color: "text-blue-400",
    placeholder: "현재 진행 중인 작업...",
  },
  {
    key: "blockers",
    label: "블로커",
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "text-red-400",
    placeholder: "진행을 막는 이슈...",
  },
  {
    key: "nextWeekPlan",
    label: "다음 주 계획",
    icon: <Calendar className="w-5 h-5" />,
    color: "text-amber-400",
    placeholder: "다음 주 할 작업...",
  },
];

export function POManager({ poData, onSave }: POManagerProps) {
  const [editingTask, setEditingTask] = useState<{ type: TaskType; id: string } | null>(null);
  const [taskForm, setTaskForm] = useState<TaskItem | null>(null);

  const addTask = (type: TaskType) => {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: "",
    };
    setEditingTask({ type, id: newTask.id });
    setTaskForm(newTask);
    onSave({ ...poData, [type]: [...poData[type], newTask] });
  };

  const saveTask = (type: TaskType) => {
    if (!taskForm) return;
    onSave({
      ...poData,
      [type]: poData[type].map((t) => (t.id === taskForm.id ? taskForm : t)),
    });
    setEditingTask(null);
    setTaskForm(null);
  };

  const cancelTask = (type: TaskType) => {
    if (taskForm && !taskForm.text) {
      onSave({ ...poData, [type]: poData[type].filter((t) => t.id !== taskForm.id) });
    }
    setEditingTask(null);
    setTaskForm(null);
  };

  const deleteTask = (type: TaskType, id: string) => {
    if (confirm("이 항목을 삭제하시겠습니까?")) {
      onSave({ ...poData, [type]: poData[type].filter((t) => t.id !== id) });
    }
  };

  const formatCurrency = (value: string) => {
    const num = Number(value);
    return num ? `${num.toLocaleString()}원` : "-";
  };

  return (
    <div className="space-y-6">
      {/* 지출 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#373A40]">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            이번 주 지출
          </h2>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={poData.spending}
              onChange={(e) => onSave({ ...poData, spending: e.target.value })}
              placeholder="예: 500000"
              className="flex-1 h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
            />
            <span className="text-[#909296]">원</span>
          </div>
          {poData.spending && (
            <p className="mt-2 text-sm text-emerald-400">
              총 지출: {formatCurrency(poData.spending)}
            </p>
          )}
        </div>
      </div>

      {/* 작업 목록들 */}
      {TASK_SECTIONS.map((section) => (
        <div key={section.key} className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
            <h2 className={`text-base font-semibold text-white flex items-center gap-2`}>
              <span className={section.color}>{section.icon}</span>
              {section.label}
              {poData[section.key].length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[#25262b] rounded-full text-[#909296]">
                  {poData[section.key].length}
                </span>
              )}
            </h2>
            <button
              onClick={() => addTask(section.key)}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>추가</span>
            </button>
          </div>
          <div className="p-5">
            {poData[section.key].length === 0 ? (
              <p className="text-center text-[#5c5f66] text-sm py-4">
                등록된 항목이 없습니다
              </p>
            ) : (
              <div className="space-y-2">
                {poData[section.key].map((task, index) => (
                  <div
                    key={task.id}
                    className="bg-[#25262b] rounded-lg border border-[#373A40] p-3"
                  >
                    {editingTask?.type === section.key && editingTask.id === task.id && taskForm ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={taskForm.text}
                          onChange={(e) => setTaskForm({ ...taskForm, text: e.target.value })}
                          placeholder={section.placeholder}
                          className="flex-1 h-9 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && taskForm.text) {
                              saveTask(section.key);
                            } else if (e.key === "Escape") {
                              cancelTask(section.key);
                            }
                          }}
                        />
                        <button
                          onClick={() => cancelTask(section.key)}
                          className="p-1.5 text-[#909296] hover:text-white rounded-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => saveTask(section.key)}
                          disabled={!taskForm.text}
                          className="p-1.5 text-brand-primary hover:bg-brand-primary/10 rounded-md disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#5c5f66] min-w-[20px]">{index + 1}.</span>
                          <span className="text-sm text-white">{task.text || "(내용 없음)"}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingTask({ type: section.key, id: task.id });
                              setTaskForm({ ...task });
                            }}
                            className="p-1.5 text-[#909296] hover:text-white rounded-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(section.key, task.id)}
                            className="p-1.5 text-[#909296] hover:text-red-400 rounded-md"
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
      ))}
    </div>
  );
}
