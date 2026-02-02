"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Check,
  Trash2,
  Edit3,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Target,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";

// SEO 작업 타입 정의
export interface SEOTask {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  category: "technical" | "content" | "backlink" | "performance" | "other";
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  effect?: {
    metric: string; // clicks, impressions, ctr, position
    before?: number;
    after?: number;
    measured?: boolean;
  };
  notes?: string;
}

// 작업 히스토리 타입
interface TaskHistory {
  id: string;
  taskId: string;
  action: "created" | "updated" | "completed" | "deleted";
  timestamp: string;
  details?: string;
}

const STORAGE_KEY = "seo_tasks";
const HISTORY_KEY = "seo_task_history";

interface SEOTaskManagerProps {
  className?: string;
  onTasksChange?: (tasks: SEOTask[]) => void;
}

export function SEOTaskManager({ className = "", onTasksChange }: SEOTaskManagerProps) {
  const [tasks, setTasks] = useState<SEOTask[]>([]);
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<SEOTask | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

  // LocalStorage에서 로드
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse tasks:", e);
      }
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  // LocalStorage에 저장
  const saveTasks = useCallback(
    (newTasks: SEOTask[]) => {
      setTasks(newTasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      onTasksChange?.(newTasks);
    },
    [onTasksChange],
  );

  const saveHistory = useCallback((newHistory: TaskHistory[]) => {
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  }, []);

  // 히스토리 추가
  const addHistory = useCallback(
    (taskId: string, action: TaskHistory["action"], details?: string) => {
      const newEntry: TaskHistory = {
        id: crypto.randomUUID(),
        taskId,
        action,
        timestamp: new Date().toISOString(),
        details,
      };
      const newHistory = [newEntry, ...history].slice(0, 100); // 최대 100개 유지
      saveHistory(newHistory);
    },
    [history, saveHistory],
  );

  // 작업 추가
  const addTask = (taskData: Omit<SEOTask, "id" | "createdAt">) => {
    const newTask: SEOTask = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const newTasks = [newTask, ...tasks];
    saveTasks(newTasks);
    addHistory(newTask.id, "created", newTask.title);
    setShowAddForm(false);
  };

  // 작업 수정
  const updateTask = (taskId: string, updates: Partial<SEOTask>) => {
    const newTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task));
    saveTasks(newTasks);
    addHistory(taskId, "updated");
    setEditingTask(null);
  };

  // 작업 완료
  const completeTask = (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: "completed" as const,
            completedAt: new Date().toISOString(),
          }
        : task,
    );
    saveTasks(newTasks);
    addHistory(taskId, "completed");
  };

  // 작업 삭제
  const deleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const newTasks = tasks.filter((t) => t.id !== taskId);
    saveTasks(newTasks);
    addHistory(taskId, "deleted", task?.title);
  };

  // 효과 측정 업데이트
  const updateEffect = (taskId: string, metric: string, before?: number, after?: number) => {
    updateTask(taskId, {
      effect: { metric, before, after, measured: after !== undefined },
    });
  };

  // 필터링된 작업
  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  // 통계
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    highPriority: tasks.filter((t) => t.priority === "high" && t.status !== "completed").length,
  };

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-[#909296]" />,
    in_progress: <AlertCircle className="w-4 h-4 text-amber-400" />,
    completed: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  };

  const categoryLabels = {
    technical: "기술적 SEO",
    content: "콘텐츠",
    backlink: "백링크",
    performance: "성능",
    other: "기타",
  };

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <span className="font-medium text-white">SEO 작업 관리</span>
          <span className="text-xs text-[#5c5f66]">({stats.total}개)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1.5 text-[#909296] hover:text-white hover:bg-white/5 rounded transition-all"
            title="히스토리"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 text-xs bg-brand-primary text-white rounded hover:bg-brand-primary/90 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            작업 추가
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-[#25262b] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white">{stats.pending}</div>
            <div className="text-xs text-[#909296]">대기</div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-amber-400">{stats.inProgress}</div>
            <div className="text-xs text-[#909296]">진행</div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-400">{stats.completed}</div>
            <div className="text-xs text-[#909296]">완료</div>
          </div>
          <div className="bg-[#25262b] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-400">{stats.highPriority}</div>
            <div className="text-xs text-[#909296]">긴급</div>
          </div>
        </div>

        {/* 필터 */}
        <div className="flex gap-1 mb-4 bg-[#25262b] rounded-lg p-1">
          {(["all", "pending", "in_progress", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                filter === f ? "bg-brand-primary text-white" : "text-[#909296] hover:text-white"
              }`}
            >
              {f === "all"
                ? "전체"
                : f === "pending"
                  ? "대기"
                  : f === "in_progress"
                    ? "진행"
                    : "완료"}
            </button>
          ))}
        </div>

        {/* 작업 목록 */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-[#5c5f66]">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">작업이 없습니다</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                priorityColors={priorityColors}
                statusIcons={statusIcons}
                categoryLabels={categoryLabels}
                onComplete={completeTask}
                onEdit={setEditingTask}
                onDelete={deleteTask}
                onUpdateEffect={updateEffect}
              />
            ))
          )}
        </div>

        {/* 히스토리 패널 */}
        {showHistory && (
          <div className="mt-4 bg-[#25262b] rounded-lg p-3">
            <h4 className="text-xs font-medium text-[#909296] mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              최근 활동
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {history.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center gap-2 text-xs">
                  <span className="text-[#5c5f66]">
                    {new Date(entry.timestamp).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-white">
                    {entry.action === "created" && "작업 추가"}
                    {entry.action === "updated" && "작업 수정"}
                    {entry.action === "completed" && "작업 완료"}
                    {entry.action === "deleted" && "작업 삭제"}
                  </span>
                  {entry.details && (
                    <span className="text-[#909296] truncate">{entry.details}</span>
                  )}
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-[#5c5f66] text-center py-2">활동 기록이 없습니다</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 작업 추가/수정 모달 */}
      {(showAddForm || editingTask) && (
        <TaskFormModal
          task={editingTask}
          onSubmit={(data) => {
            if (editingTask) {
              updateTask(editingTask.id, data);
            } else {
              addTask(data);
            }
          }}
          onClose={() => {
            setShowAddForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

// 작업 아이템 컴포넌트
function TaskItem({
  task,
  priorityColors,
  statusIcons: _statusIcons,
  categoryLabels,
  onComplete,
  onEdit,
  onDelete,
  onUpdateEffect,
}: {
  task: SEOTask;
  priorityColors: Record<string, string>;
  statusIcons: Record<string, React.ReactNode>;
  categoryLabels: Record<string, string>;
  onComplete: (id: string) => void;
  onEdit: (task: SEOTask) => void;
  onDelete: (id: string) => void;
  onUpdateEffect: (id: string, metric: string, before?: number, after?: number) => void;
}) {
  const [showEffect, setShowEffect] = useState(false);

  return (
    <div className="bg-[#25262b] rounded-lg p-3 group">
      <div className="flex items-start gap-3">
        {/* 체크박스 */}
        <button
          onClick={() => task.status !== "completed" && onComplete(task.id)}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border ${
            task.status === "completed"
              ? "bg-emerald-500 border-emerald-500"
              : "border-[#373A40] hover:border-brand-primary"
          } flex items-center justify-center transition-colors`}
        >
          {task.status === "completed" && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          {/* 제목 & 메타 */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-medium ${task.status === "completed" ? "text-[#5c5f66] line-through" : "text-white"}`}
            >
              {task.title}
            </span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded border ${priorityColors[task.priority]}`}
            >
              {task.priority === "high" ? "긴급" : task.priority === "medium" ? "중간" : "낮음"}
            </span>
          </div>

          {/* 설명 */}
          {task.description && (
            <p className="text-xs text-[#909296] mb-2 line-clamp-2">{task.description}</p>
          )}

          {/* 태그 */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5c5f66]">{categoryLabels[task.category]}</span>
            {task.dueDate && (
              <span className="flex items-center gap-0.5 text-[#5c5f66]">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {task.effect?.measured && (
              <span className="flex items-center gap-0.5 text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                효과 측정됨
              </span>
            )}
          </div>

          {/* 효과 측정 섹션 */}
          {task.status === "completed" && (
            <div className="mt-2">
              <button
                onClick={() => setShowEffect(!showEffect)}
                className="text-xs text-brand-primary hover:underline flex items-center gap-1"
              >
                <BarChart3 className="w-3 h-3" />
                효과 측정
                {showEffect ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {showEffect && (
                <div className="mt-2 bg-[#1a1b23] rounded p-2">
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={task.effect?.metric || "clicks"}
                      onChange={(e) =>
                        onUpdateEffect(
                          task.id,
                          e.target.value,
                          task.effect?.before,
                          task.effect?.after,
                        )
                      }
                      className="col-span-3 h-7 px-2 text-xs bg-[#25262b] border border-[#373A40] rounded text-white"
                    >
                      <option value="clicks">클릭수</option>
                      <option value="impressions">노출수</option>
                      <option value="ctr">CTR</option>
                      <option value="position">순위</option>
                    </select>
                    <input
                      type="number"
                      placeholder="이전"
                      value={task.effect?.before || ""}
                      onChange={(e) =>
                        onUpdateEffect(
                          task.id,
                          task.effect?.metric || "clicks",
                          Number(e.target.value),
                          task.effect?.after,
                        )
                      }
                      className="h-7 px-2 text-xs bg-[#25262b] border border-[#373A40] rounded text-white"
                    />
                    <span className="flex items-center justify-center text-[#5c5f66]">→</span>
                    <input
                      type="number"
                      placeholder="이후"
                      value={task.effect?.after || ""}
                      onChange={(e) =>
                        onUpdateEffect(
                          task.id,
                          task.effect?.metric || "clicks",
                          task.effect?.before,
                          Number(e.target.value),
                        )
                      }
                      className="h-7 px-2 text-xs bg-[#25262b] border border-[#373A40] rounded text-white"
                    />
                  </div>
                  {task.effect?.before !== undefined && task.effect?.after !== undefined && (
                    <div className="mt-2 text-xs text-center">
                      <span
                        className={
                          task.effect.after > task.effect.before
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {task.effect.after > task.effect.before ? "▲" : "▼"}{" "}
                        {Math.abs(
                          ((task.effect.after - task.effect.before) / task.effect.before) * 100,
                        ).toFixed(1)}
                        % 변화
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-[#909296] hover:text-white hover:bg-white/10 rounded"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-[#909296] hover:text-red-400 hover:bg-red-500/10 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 작업 추가/수정 폼 모달
function TaskFormModal({
  task,
  onSubmit,
  onClose,
}: {
  task: SEOTask | null;
  onSubmit: (data: Omit<SEOTask, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || ("medium" as const),
    status: task?.status || ("pending" as const),
    category: task?.category || ("technical" as const),
    dueDate: task?.dueDate || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] w-full max-w-md mx-4">
        <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
          <span className="font-medium text-white">{task ? "작업 수정" : "새 작업 추가"}</span>
          <button onClick={onClose} className="p-1 text-[#909296] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs text-[#909296] block mb-1">제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="SEO 작업 제목"
              className="w-full h-9 px-3 text-sm bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-[#909296] block mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="작업에 대한 상세 설명"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#909296] block mb-1">우선순위</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as SEOTask["priority"] })
                }
                className="w-full h-9 px-3 text-sm bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="high">긴급</option>
                <option value="medium">중간</option>
                <option value="low">낮음</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#909296] block mb-1">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as SEOTask["category"] })
                }
                className="w-full h-9 px-3 text-sm bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="technical">기술적 SEO</option>
                <option value="content">콘텐츠</option>
                <option value="backlink">백링크</option>
                <option value="performance">성능</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#909296] block mb-1">상태</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as SEOTask["status"] })
                }
                className="w-full h-9 px-3 text-sm bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="pending">대기</option>
                <option value="in_progress">진행중</option>
                <option value="completed">완료</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#909296] block mb-1">마감일</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full h-9 px-3 text-sm bg-[#25262b] border border-[#373A40] rounded text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 text-sm border border-[#373A40] text-[#909296] rounded hover:bg-white/5"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 h-9 text-sm bg-brand-primary text-white rounded hover:bg-brand-primary/90"
            >
              {task ? "수정" : "추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
