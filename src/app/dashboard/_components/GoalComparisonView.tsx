"use client";

import { useState, useMemo } from "react";
import { BarChart2, Check, X, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { PROJECT_INFO } from "./types";

import type { GoalItem, GoalPrediction } from "./types";

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

interface GoalComparisonViewProps {
  goals: GoalItem[];
  isOpen: boolean;
  onClose: () => void;
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

  const daysElapsed = Math.max(
    1,
    Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const progressMade = current - start;
  const remainingProgress = target - current;

  const currentDailyRate = progressMade / daysElapsed;
  const requiredDailyRate =
    daysRemaining > 0 ? remainingProgress / daysRemaining : remainingProgress;

  let estimatedDate: string | null = null;
  if (currentDailyRate > 0) {
    const daysToComplete = remainingProgress / currentDailyRate;
    const estimated = new Date(now.getTime() + daysToComplete * 24 * 60 * 60 * 1000);
    estimatedDate = estimated.toISOString().split("T")[0];
  }

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

export function GoalComparisonView({ goals, isOpen, onClose }: GoalComparisonViewProps) {
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const selectedGoals = useMemo(
    () => goals.filter((g) => selectedGoalIds.includes(g.id)),
    [goals, selectedGoalIds],
  );
  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoalIds((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : prev.length < 4
          ? [...prev, goalId]
          : prev,
    );
  };
  const calculateProgress = (current: string, target: string) => {
    const curr = Number(current),
      tgt = Number(target);
    if (!curr || !tgt) return 0;
    return Math.min((curr / tgt) * 100, 100);
  };
  const comparisonData = useMemo(() => {
    return selectedGoals.map((goal) => {
      const prediction = calculatePrediction(goal);
      const progress = calculateProgress(goal.currentValue, goal.targetValue);

      return {
        goal,
        progress,
        prediction,
        daysRemaining: prediction?.daysRemaining ?? 0,
        onTrack: prediction?.onTrack ?? false,
        currentDailyRate: prediction?.currentDailyRate ?? 0,
        requiredDailyRate: prediction?.requiredDailyRate ?? 0,
      };
    });
  }, [selectedGoals]);

  // 최고/최저 지표 찾기
  const stats = useMemo(() => {
    if (comparisonData.length === 0) return null;

    const progressValues = comparisonData.map((d) => d.progress);
    const maxProgress = Math.max(...progressValues);
    const minProgress = Math.min(...progressValues);

    return {
      maxProgress,
      minProgress,
      bestGoal: comparisonData.find((d) => d.progress === maxProgress)?.goal,
      worstGoal: comparisonData.find((d) => d.progress === minProgress)?.goal,
    };
  }, [comparisonData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1b23] rounded-xl border border-[#373A40] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-semibold text-white">목표 비교</h2>
            <span className="text-sm text-[#909296]">({selectedGoals.length}/4 선택됨)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 목표 선택 패널 */}
            <div>
              <h3 className="text-sm font-medium text-[#909296] mb-3">
                비교할 목표 선택 (최대 4개)
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {goals.map((goal) => {
                  const isSelected = selectedGoalIds.includes(goal.id);
                  const progress = calculateProgress(goal.currentValue, goal.targetValue);

                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoalSelection(goal.id)}
                      disabled={!isSelected && selectedGoalIds.length >= 4}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-brand-primary/10 border-brand-primary"
                          : "bg-[#25262b] border-[#373A40] hover:border-[#4a4d54]"
                      } ${!isSelected && selectedGoalIds.length >= 4 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              isSelected
                                ? "bg-brand-primary border-brand-primary"
                                : "border-[#373A40]"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm">{GOAL_CATEGORIES[goal.category].icon}</span>
                          <span className="text-sm font-medium text-white">
                            {goal.title || "(제목 없음)"}
                          </span>
                        </div>
                        {goal.project && (
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded ${PROJECT_INFO[goal.project].bg} ${PROJECT_INFO[goal.project].color}`}
                          >
                            {PROJECT_INFO[goal.project].label}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-[#909296]">
                        <span>
                          {goal.currentValue}/{goal.targetValue}
                          {goal.unit}
                        </span>
                        <span className="text-brand-primary">{progress.toFixed(0)}%</span>
                        <span>마감: {goal.deadline}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 비교 결과 패널 */}
            <div>
              {selectedGoals.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[#5c5f66] text-sm">
                  <p>비교할 목표를 선택하세요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 요약 통계 */}
                  {stats && selectedGoals.length >= 2 && (
                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#373A40]">
                      <h4 className="text-xs font-medium text-[#909296] mb-3">비교 요약</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#1a1b23] rounded p-3">
                          <div className="text-xs text-[#5c5f66] mb-1">최고 진행률</div>
                          <div className="text-lg font-semibold text-emerald-400">
                            {stats.maxProgress.toFixed(0)}%
                          </div>
                          <div className="text-xs text-[#909296] truncate">
                            {stats.bestGoal?.title}
                          </div>
                        </div>
                        <div className="bg-[#1a1b23] rounded p-3">
                          <div className="text-xs text-[#5c5f66] mb-1">최저 진행률</div>
                          <div className="text-lg font-semibold text-red-400">
                            {stats.minProgress.toFixed(0)}%
                          </div>
                          <div className="text-xs text-[#909296] truncate">
                            {stats.worstGoal?.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-[#25262b] rounded-lg border border-[#373A40] overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#373A40]">
                          <th className="text-left p-3 text-[#909296] font-medium">목표</th>
                          <th className="text-center p-3 text-[#909296] font-medium">진행률</th>
                          <th className="text-center p-3 text-[#909296] font-medium">상태</th>
                          <th className="text-center p-3 text-[#909296] font-medium">남은 일</th>
                          <th className="text-center p-3 text-[#909296] font-medium">트랙</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map(
                          ({ goal, progress, prediction, daysRemaining, onTrack }) => (
                            <tr key={goal.id} className="border-b border-[#373A40] last:border-b-0">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span>{GOAL_CATEGORIES[goal.category].icon}</span>
                                  <span className="text-white font-medium truncate max-w-[120px]">
                                    {goal.title}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 h-1.5 bg-[#373A40] rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        progress >= 100
                                          ? "bg-emerald-500"
                                          : progress >= 70
                                            ? "bg-blue-500"
                                            : progress >= 30
                                              ? "bg-amber-500"
                                              : "bg-red-500"
                                      }`}
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-white w-10">{progress.toFixed(0)}%</span>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded ${GOAL_STATUS[goal.status].bg} ${GOAL_STATUS[goal.status].color}`}
                                >
                                  {GOAL_STATUS[goal.status].label}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span
                                  className={
                                    daysRemaining < 0
                                      ? "text-red-400"
                                      : daysRemaining < 7
                                        ? "text-amber-400"
                                        : "text-white"
                                  }
                                >
                                  {daysRemaining}일
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                {prediction ? (
                                  onTrack ? (
                                    <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 text-red-400 mx-auto" />
                                  )
                                ) : (
                                  <Minus className="w-4 h-4 text-[#5c5f66] mx-auto" />
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                  {comparisonData.some((d) => d.prediction) && (
                    <div className="bg-[#25262b] rounded-lg p-4 border border-[#373A40]">
                      <h4 className="text-xs font-medium text-[#909296] mb-3">일일 진행률 비교</h4>
                      <div className="space-y-3">
                        {comparisonData.map(
                          ({ goal, currentDailyRate, requiredDailyRate, onTrack }) => {
                            const maxRate = Math.max(currentDailyRate, requiredDailyRate, 1);
                            const currentWidth = (currentDailyRate / maxRate) * 100;
                            const requiredWidth = (requiredDailyRate / maxRate) * 100;

                            return (
                              <div key={goal.id}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-white truncate max-w-[150px]">
                                    {goal.title}
                                  </span>
                                  <span
                                    className={`text-xs ${onTrack ? "text-emerald-400" : "text-amber-400"}`}
                                  >
                                    {currentDailyRate} / {requiredDailyRate} {goal.unit}/일
                                  </span>
                                </div>
                                <div className="flex gap-1 h-2">
                                  <div className="flex-1 bg-[#1a1b23] rounded overflow-hidden">
                                    <div
                                      className="h-full bg-brand-primary rounded"
                                      style={{ width: `${currentWidth}%` }}
                                      title={`현재: ${currentDailyRate}`}
                                    />
                                  </div>
                                  <div className="flex-1 bg-[#1a1b23] rounded overflow-hidden">
                                    <div
                                      className="h-full bg-amber-500/60 rounded"
                                      style={{ width: `${requiredWidth}%` }}
                                      title={`필요: ${requiredDailyRate}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-between text-[10px] text-[#5c5f66] mt-0.5">
                                  <span>현재 일일</span>
                                  <span>필요 일일</span>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                  <div className="bg-[#25262b] rounded-lg p-4 border border-[#373A40]">
                    <h4 className="text-xs font-medium text-[#909296] mb-3">진행률 비교 차트</h4>
                    <div className="flex items-end gap-4 h-32">
                      {comparisonData.map(({ goal, progress }) => {
                        const barHeight = Math.max(progress, 5);
                        const projectInfo = goal.project ? PROJECT_INFO[goal.project] : null;

                        return (
                          <div key={goal.id} className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-white mb-1">{progress.toFixed(0)}%</div>
                            <div className="w-full bg-[#1a1b23] rounded-t h-24 relative">
                              <div
                                className={`absolute bottom-0 w-full rounded-t transition-all duration-300 ${
                                  projectInfo
                                    ? projectInfo.color.includes("emerald")
                                      ? "bg-emerald-500"
                                      : projectInfo.color.includes("blue")
                                        ? "bg-blue-500"
                                        : "bg-purple-500"
                                    : "bg-brand-primary"
                                }`}
                                style={{ height: `${barHeight}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-[#909296] mt-2 truncate max-w-full text-center px-1">
                              {goal.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="px-5 py-3 border-t border-[#373A40] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
