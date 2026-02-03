"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Target,
  Loader2,
  CheckCircle,
  Circle,
  PlayCircle,
  Lightbulb,
  FileText,
  Settings,
  Link,
  Image,
  Tag,
  RefreshCw,
} from "lucide-react";

interface WeeklyAction {
  id: string;
  title: string;
  description: string;
  category: "content" | "technical" | "link" | "image" | "meta";
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  estimatedTime: string;
  aiTip?: string;
}

interface WeeklyMissionCardProps {
  domain: string;
  keywords: string[];
}

const categoryIcons = {
  content: FileText,
  technical: Settings,
  link: Link,
  image: Image,
  meta: Tag,
};

const priorityColors = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-blue-400",
};

export function WeeklyMissionCard({ domain, keywords }: WeeklyMissionCardProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [actions, setActions] = useState<WeeklyAction[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [initialLoaded, setInitialLoaded] = useState(false);

  // 초기 로드: DB에서 이번 주 미션 가져오기
  const loadMissions = useCallback(async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dashboard/seo/weekly-actions?domain=${encodeURIComponent(domain)}`,
      );
      const data = await res.json();
      if (data.success) {
        setActions(data.actions || []);
        setSummary(data.summary || "");
      }
    } catch (error) {
      console.error("미션 로드 실패:", error);
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  }, [domain]);

  useEffect(() => {
    void loadMissions();
  }, [loadMissions]);

  // 새로운 미션 생성 (사이트 분석 기반)
  const handleGenerate = async (forceRegenerate = false) => {
    setGenerating(true);
    try {
      const response = await fetch("/api/dashboard/seo/weekly-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, keywords, forceRegenerate }),
      });
      const data = await response.json();
      if (data.success) {
        setActions(data.actions || []);
        setSummary(data.summary || "");
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("주간 액션 생성 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  // 미션 상태 변경 (DB 업데이트)
  const handleStatusChange = async (id: string, newStatus: WeeklyAction["status"]) => {
    // 낙관적 업데이트
    const updated = actions.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setActions(updated);

    try {
      const res = await fetch("/api/dashboard/seo/weekly-actions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        // 실패 시 롤백
        setActions(actions);
        console.error("상태 업데이트 실패:", data.error);
      }
    } catch (error) {
      // 실패 시 롤백
      setActions(actions);
      console.error("상태 업데이트 오류:", error);
    }
  };

  const completedCount = actions.filter((a) => a.status === "completed").length;
  const inProgressCount = actions.filter((a) => a.status === "in_progress").length;

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const dateStr = `${weekStart.getMonth() + 1}/${weekStart.getDate()} ~ ${today.getMonth() + 1}/${today.getDate()}`;

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-400" />
          <h3 className="text-white font-medium">이번 주 SEO 미션</h3>
          <span className="text-xs text-[#5c5f66]">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          {actions.length > 0 && (
            <button
              onClick={() => void handleGenerate(true)}
              disabled={generating}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#909296] hover:text-white hover:bg-white/5 rounded transition-colors disabled:opacity-50"
              title="사이트 재분석 후 미션 새로 생성"
            >
              <RefreshCw className={`w-3 h-3 ${generating ? "animate-spin" : ""}`} />
            </button>
          )}
          <button
            onClick={() => void handleGenerate(actions.length > 0)}
            disabled={generating}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Lightbulb className="w-3 h-3" />
            )}
            {generating ? "분석중..." : actions.length > 0 ? "새로 생성" : "AI 미션 생성"}
          </button>
        </div>
      </div>

      {summary && <p className="text-sm text-[#909296] mb-4 bg-[#25262b] rounded p-3">{summary}</p>}

      {loading && !initialLoaded ? (
        <div className="text-center py-8 text-[#5c5f66]">
          <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin opacity-50" />
          <p className="text-sm">미션 불러오는 중...</p>
        </div>
      ) : actions.length > 0 ? (
        <>
          <div className="flex items-center gap-4 mb-4 text-xs text-[#5c5f66]">
            <span>
              완료: {completedCount}/{actions.length}
            </span>
            <span>진행중: {inProgressCount}</span>
            <div className="flex-1 h-2 bg-[#25262b] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${(completedCount / actions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {actions.map((action) => {
              const Icon = categoryIcons[action.category];
              return (
                <div
                  key={action.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    action.status === "completed"
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : action.status === "in_progress"
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-[#25262b] border-[#373A40]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        const next =
                          action.status === "pending"
                            ? "in_progress"
                            : action.status === "in_progress"
                              ? "completed"
                              : "pending";
                        void handleStatusChange(action.id, next);
                      }}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {action.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : action.status === "in_progress" ? (
                        <PlayCircle className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#5c5f66]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#5c5f66]" />
                        <span
                          className={`text-sm font-medium ${
                            action.status === "completed"
                              ? "text-[#5c5f66] line-through"
                              : "text-white"
                          }`}
                        >
                          {action.title}
                        </span>
                        <span className={`text-xs ${priorityColors[action.priority]}`}>
                          {action.priority === "high"
                            ? "높음"
                            : action.priority === "medium"
                              ? "중간"
                              : "낮음"}
                        </span>
                      </div>
                      <p className="text-xs text-[#909296] mt-1">{action.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#5c5f66]">
                        <span>예상: {action.estimatedTime}</span>
                      </div>
                      {action.aiTip && (
                        <div className="mt-2 p-2 bg-[#1a1b23] rounded text-xs text-cyan-400">
                          💡 {action.aiTip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-[#5c5f66]">
          <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">AI가 이번 주 SEO 미션을 생성해드립니다</p>
          <p className="text-xs mt-1">키워드와 사이트 분석을 기반으로 맞춤 액션을 추천합니다</p>
        </div>
      )}
    </div>
  );
}
