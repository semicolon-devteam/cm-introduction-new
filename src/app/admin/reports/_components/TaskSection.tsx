"use client";

import { Plus, Trash2 } from "lucide-react";

export interface TaskItem {
  id: string;
  text: string;
}

interface TaskSectionProps {
  title: string;
  tasks: TaskItem[];
  placeholder: string;
  onAdd: () => void;
  onRemove: (taskId: string) => void;
  onUpdate: (taskId: string, text: string) => void;
}

export function TaskSection({
  title,
  tasks,
  placeholder,
  onAdd,
  onRemove,
  onUpdate,
}: TaskSectionProps) {
  return (
    <div className="space-y-3">
      {/* Label - Mantine style */}
      <label className="block text-sm font-medium text-gray-200 mb-1">{title}</label>

      {/* Task Items */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={task.id} className="group flex items-center gap-2">
            {/* Input - Mantine TextInput style */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={task.text}
                onChange={(e) => onUpdate(task.id, e.target.value)}
                placeholder={`${placeholder} ${index + 1}`}
                className="w-full h-10 px-3 bg-[#1a1b23] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] transition-all duration-150 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
              />
            </div>

            {/* Remove Button - Mantine ActionIcon style */}
            <button
              type="button"
              onClick={() => onRemove(task.id)}
              disabled={tasks.length === 1}
              className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              aria-label="항목 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Button - Mantine subtle button style */}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all duration-150"
      >
        <Plus className="w-4 h-4" />
        <span>항목 추가</span>
      </button>
    </div>
  );
}
