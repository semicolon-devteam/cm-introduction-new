"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Target,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  Play,
  RefreshCw,
  Lightbulb,
  FileText,
  Code,
  Link2,
  Image,
  Layout,
  Zap,
  Calendar,
  AlertCircle,
} from "lucide-react";

// Types
interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "content" | "technical" | "backlink" | "image" | "meta" | "structure";
  estimatedTime: string;
  steps: string[];
  aiTip: string;
  status: "pending" | "in_progress" | "completed";
}

interface WeeklyMissionData {
  weekStart: string;
  weekEnd: string;
  summary: string;
  focusKeyword: string;
  missions: WeeklyMission[];
  generatedAt: string;
}

interface WeeklyMissionCardProps {
  projectId: string;
  domain: string;
  keywords: string[];
  searchConsoleData?: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  className?: string;
}

const STORAGE_KEY_PREFIX = "seo_weekly_missions_";

const CATEGORY_CONFIG = {
  content: { icon: FileText, label: "콘텐츠", color: "text-blue-400" },
  technical: { icon: Code, label: "기술적 SEO", color: "text-purple-400" },
  backlink: { icon: Link2, label: "백링크", color: "text-green-400" },
  image: { icon: Image, label: "이미지 SEO", color: "text-pink-400" },
  meta: { icon: Layout, label: "메타태그", color: "text-cyan-400" },
  structure: { icon: Layout, label: "구조 개선", color: "text-orange-400" },
};

const PRIORITY_CONFIG = {
  high: { label: "긴급", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  medium: { label: "중간", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  low: { label: "낮음", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

export function WeeklyMissionCard({
  projectId,
  domain,
  keywords,
  searchConsoleData,
  className = "",
}: WeeklyMissionCardProps) {
  const [missionData, setMissionData] = useState<WeeklyMissionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}${projectId}`;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as WeeklyMissionData;
        // 같은 주인지 확인
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1);
        const currentWeekStart = weekStart.toISOString().split("T")[0];

        if (parsed.weekStart === currentWeekStart) {
          setMissionData(parsed);
        } else {
          // 새로운 주이면 자동으로 새 미션 생성
          void generateMissions();
        }
      } catch {
        console.error("Failed to parse saved missions");
      }
    }
  }, [storageKey]);

  // Save to localStorage
  const saveMissions = useCallback(
    (data: WeeklyMissionData) => {
      setMissionData(data);
      localStorage.setItem(storageKey, JSON.stringify(data));
    },
    [storageKey],
  );

  // Generate missions from AI
  const generateMissions = async () => {
    if (keywords.length === 0) {
      setError("키워드를 먼저 등록해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completedMissions = missionData?.missions
        .filter((m) => m.status === "completed")
        .map((m) => m.title);

      const response = await fetch("/api/dashboard/seo/weekly-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          domain,
          keywords,
          searchConsoleData,
          completedMissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newData: WeeklyMissionData = {
          weekStart: data.weekStart,
          weekEnd: data.weekEnd,
          summary: data.summary,
          focusKeyword: data.focusKeyword,
          missions: data.missions,
          generatedAt: new Date().toISOString(),
        };
        saveMissions(newData);
      } else {
        setError(data.error || "미션 생성에 실패했습니다.");
      }
    } catch (err) {
      setError("AI 미션 생성 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update mission status
  const updateMissionStatus = (missionId: string, newStatus: WeeklyMission["status"]) => {
    if (!missionData) return;

    const updatedMissions = missionData.missions.map((m) =>
      m.id === missionId ? { ...m, status: newStatus } : m,
    );

    saveMissions({
      ...missionData,
      missions: updatedMissions,
    });
  };

  // Toggle mission expansion
  const toggleMission = (missionId: string) => {
    setExpandedMission(expandedMission === missionId ? null : missionId);
  };

  // Calculate progress
  const completedCount = missionData?.missions.filter((m) => m.status === "completed").length || 0;
  const totalCount = missionData?.missions.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Format date for display
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
  };

  return (
    <div className={`bg-[#1a1b23] rounded-xl border border-[#373A40] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#373A40]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                이번 주 SEO 미션
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </h2>
              {missionData && (
                <p className="text-xs text-[#909296] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateRange(missionData.weekStart, missionData.weekEnd)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => void generateMissions()}
            disabled={loading || keywords.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#25262b] text-[#909296]
                     hover:text-white rounded-lg transition-colors disabled:opacity-50"
            title={keywords.length === 0 ? "키워드를 먼저 등록하세요" : "새로운 미션 생성"}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {loading ? "생성 중..." : "새로 생성"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && !missionData && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
            <p className="text-sm text-[#909296]">AI가 맞춤형 미션을 생성하고 있습니다...</p>
            <p className="text-xs text-[#5c5f66] mt-1">약 10-15초 소요됩니다</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !missionData && !error && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-[#373A40] mx-auto mb-3" />
            <p className="text-[#909296] mb-4">AI가 생성한 맞춤형 SEO 미션을 받아보세요</p>
            <button
              onClick={() => void generateMissions()}
              disabled={keywords.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm
                       rounded-lg font-medium hover:from-purple-600 hover:to-blue-600
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {keywords.length === 0 ? "키워드 등록 후 이용 가능" : "미션 생성하기"}
            </button>
          </div>
        )}

        {/* Mission Data */}
        {missionData && (
          <>
            {/* Summary */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20 mb-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm text-white mb-1">{missionData.summary}</p>
                  <p className="text-xs text-[#909296]">
                    이번 주 집중 키워드:{" "}
                    <span className="text-purple-400 font-medium">{missionData.focusKeyword}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#909296]">진행률</span>
                <span className="text-white font-medium">
                  {completedCount}/{totalCount} 완료
                </span>
              </div>
              <div className="h-2 bg-[#25262b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Missions List */}
            <div className="space-y-3">
              {missionData.missions.map((mission) => {
                const categoryConfig = CATEGORY_CONFIG[mission.category];
                const priorityConfig = PRIORITY_CONFIG[mission.priority];
                const CategoryIcon = categoryConfig.icon;
                const isExpanded = expandedMission === mission.id;

                return (
                  <div
                    key={mission.id}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      mission.status === "completed"
                        ? "border-green-500/30 bg-green-500/5"
                        : mission.status === "in_progress"
                          ? "border-amber-500/30 bg-amber-500/5"
                          : "border-[#373A40] bg-[#0d0e12]"
                    }`}
                  >
                    {/* Mission Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => toggleMission(mission.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (mission.status === "pending") {
                              updateMissionStatus(mission.id, "in_progress");
                            } else if (mission.status === "in_progress") {
                              updateMissionStatus(mission.id, "completed");
                            } else {
                              updateMissionStatus(mission.id, "pending");
                            }
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                   transition-colors flex-shrink-0 mt-0.5 ${
                                     mission.status === "completed"
                                       ? "bg-green-500 border-green-500"
                                       : mission.status === "in_progress"
                                         ? "bg-amber-500 border-amber-500"
                                         : "border-[#5c5f66] hover:border-white"
                                   }`}
                        >
                          {mission.status === "completed" && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                          {mission.status === "in_progress" && (
                            <Play className="w-3 h-3 text-white fill-white" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          {/* Title & Tags */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className={`text-sm font-medium ${
                                mission.status === "completed"
                                  ? "text-[#5c5f66] line-through"
                                  : "text-white"
                              }`}
                            >
                              {mission.title}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 text-[10px] rounded border ${priorityConfig.color}`}
                            >
                              {priorityConfig.label}
                            </span>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 text-xs text-[#5c5f66]">
                            <span className={`flex items-center gap-1 ${categoryConfig.color}`}>
                              <CategoryIcon className="w-3 h-3" />
                              {categoryConfig.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {mission.estimatedTime}
                            </span>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <div className="text-[#5c5f66]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-[#373A40]">
                        {/* Description */}
                        <p className="text-sm text-[#909296] mt-3 mb-4">{mission.description}</p>

                        {/* Steps */}
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-white mb-2">실행 단계</h4>
                          <ol className="space-y-2">
                            {mission.steps.map((step, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-[#909296]"
                              >
                                <span className="w-5 h-5 rounded-full bg-[#25262b] flex items-center justify-center text-[10px] text-[#5c5f66] flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* AI Tip */}
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-medium text-yellow-400">AI 팁</span>
                              <p className="text-xs text-[#909296] mt-0.5">{mission.aiTip}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
