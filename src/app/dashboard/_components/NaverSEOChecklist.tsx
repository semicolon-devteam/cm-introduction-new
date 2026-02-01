"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Sparkles,
  ExternalLink,
  Target,
  FileText,
  Settings,
  Smartphone,
  Share2,
  Info,
} from "lucide-react";

/**
 * 네이버 SEO 체크리스트 아이템 타입
 */
interface NaverSEOCheckItem {
  id: string;
  category: "basic" | "content" | "technical" | "mobile" | "social";
  title: string;
  description: string;
  importance: "critical" | "high" | "medium" | "low";
  status: "pending" | "completed" | "na";
  howTo: string[];
  naverTip?: string;
}

interface CategoryScore {
  score: number;
  completed: number;
  total: number;
}

interface NaverSEOChecklistProps {
  domain: string;
  keywords: string[];
  className?: string;
}

const STORAGE_KEY_PREFIX = "seo-naver-checklist";

const CATEGORY_ICONS = {
  basic: Settings,
  content: FileText,
  technical: Settings,
  mobile: Smartphone,
  social: Share2,
};

const CATEGORY_LABELS = {
  basic: "기본 설정",
  content: "콘텐츠 최적화",
  technical: "기술적 SEO",
  mobile: "모바일 최적화",
  social: "소셜/외부 신호",
};

const CATEGORY_COLORS = {
  basic: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  content: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  technical: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  mobile: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  social: "text-pink-400 bg-pink-500/10 border-pink-500/30",
};

const IMPORTANCE_COLORS = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const IMPORTANCE_LABELS = {
  critical: "필수",
  high: "높음",
  medium: "중간",
  low: "낮음",
};

export function NaverSEOChecklist({ domain, keywords, className = "" }: NaverSEOChecklistProps) {
  const [checklist, setChecklist] = useState<NaverSEOCheckItem[]>([]);
  const [categories, setCategories] = useState<Record<string, CategoryScore>>({});
  const [overallScore, setOverallScore] = useState(0);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("basic");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}-${domain}`;

  // LocalStorage에서 완료된 항목 로드
  const loadCompletedItems = useCallback((): string[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  }, [storageKey]);

  // LocalStorage에 완료된 항목 저장
  const saveCompletedItems = useCallback(
    (items: string[]) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(storageKey, JSON.stringify(items));
    },
    [storageKey],
  );

  // 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const completedItems = loadCompletedItems();

      const response = await fetch("/api/dashboard/seo/naver-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, keywords, completedItems }),
      });

      const data = await response.json();

      if (data.success) {
        setChecklist(data.checklist);
        setCategories(data.categories);
        setOverallScore(data.overallScore);
        setAiRecommendations(data.aiRecommendations || []);
      }
    } catch (error) {
      console.error("Failed to load Naver SEO checklist:", error);
    } finally {
      setLoading(false);
    }
  }, [domain, keywords, loadCompletedItems]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // 항목 완료 토글
  const handleToggleItem = async (itemId: string) => {
    const completedItems = loadCompletedItems();
    let newCompleted: string[];

    if (completedItems.includes(itemId)) {
      newCompleted = completedItems.filter((id) => id !== itemId);
    } else {
      newCompleted = [...completedItems, itemId];
    }

    saveCompletedItems(newCompleted);

    // UI 즉시 업데이트
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: newCompleted.includes(itemId) ? "completed" : "pending" }
          : item,
      ),
    );

    // 점수 재계산
    await loadData();
  };

  // 점수 색상
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  // 프로그레스바 색상
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // 카테고리별 아이템
  const getItemsByCategory = (category: string) => {
    return checklist.filter((item) => item.category === category);
  };

  if (loading) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-green-500/30 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 border-b border-[#373A40]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <span className="text-lg">🌐</span>
          </div>
          <div>
            <h2 className="font-semibold text-white">네이버 SEO 체크리스트</h2>
            <p className="text-xs text-gray-500">{domain}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</p>
            <p className="text-xs text-gray-500">/ 100점</p>
          </div>
          <button
            onClick={() => void loadData()}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 전체 프로그레스 */}
      <div className="p-5 border-b border-[#373A40]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">전체 진행률</span>
          <span className="text-sm text-white">
            {checklist.filter((i) => i.status === "completed").length} / {checklist.length} 완료
          </span>
        </div>
        <div className="h-2 bg-[#25262b] rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(overallScore)} transition-all duration-500`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      {/* AI 추천 */}
      {aiRecommendations.length > 0 && (
        <div className="p-5 border-b border-[#373A40] bg-purple-500/5">
          <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI 추천
          </h3>
          <ul className="space-y-2">
            {aiRecommendations.map((rec, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-purple-400">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 카테고리별 점수 */}
      <div className="p-5 border-b border-[#373A40]">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(categories).map(([cat, score]) => {
            const Icon = CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS];
            return (
              <button
                key={cat}
                onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  expandedCategory === cat
                    ? CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS]
                    : "bg-[#25262b] border-[#373A40] hover:border-[#4a4b53]"
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{score.score}</p>
                <p className="text-xs text-gray-500 truncate">
                  {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 체크리스트 */}
      <div className="p-5 space-y-4">
        {Object.keys(CATEGORY_LABELS).map((category) => {
          const items = getItemsByCategory(category);
          const categoryScore = categories[category as keyof typeof categories];
          const isExpanded = expandedCategory === category;
          const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];

          return (
            <div key={category} className="border border-[#373A40] rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#25262b] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-white">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({categoryScore?.completed || 0}/{categoryScore?.total || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${getScoreColor(categoryScore?.score || 0)}`}
                  >
                    {categoryScore?.score || 0}점
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[#373A40] divide-y divide-[#373A40]">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 bg-[#25262b]/50">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => void handleToggleItem(item.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {item.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-500 hover:text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-medium ${
                                item.status === "completed"
                                  ? "text-gray-500 line-through"
                                  : "text-white"
                              }`}
                            >
                              {item.title}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 text-xs rounded border ${
                                IMPORTANCE_COLORS[item.importance]
                              }`}
                            >
                              {IMPORTANCE_LABELS[item.importance]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>

                          {/* 상세 정보 토글 */}
                          <button
                            onClick={() =>
                              setExpandedItem(expandedItem === item.id ? null : item.id)
                            }
                            className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1"
                          >
                            {expandedItem === item.id ? "접기" : "방법 보기"}
                            {expandedItem === item.id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {expandedItem === item.id && (
                            <div className="mt-3 p-3 bg-[#1a1b23] rounded-lg">
                              <p className="text-xs text-gray-400 mb-2">실행 방법:</p>
                              <ol className="space-y-1">
                                {item.howTo.map((step, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-gray-300 flex items-start gap-2"
                                  >
                                    <span className="text-blue-400">{i + 1}.</span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                              {item.naverTip && (
                                <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded">
                                  <p className="text-xs text-green-400 flex items-start gap-1">
                                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    {item.naverTip}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 도움말 링크 */}
      <div className="p-4 border-t border-[#373A40] bg-[#25262b]/30">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">네이버 SEO 공식 가이드를 참고하세요</p>
          <a
            href="https://searchadvisor.naver.com/guide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
          >
            서치어드바이저 가이드
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default NaverSEOChecklist;
