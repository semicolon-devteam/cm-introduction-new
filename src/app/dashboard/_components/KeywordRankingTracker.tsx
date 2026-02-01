"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Search,
  RefreshCw,
  Calendar,
  Target,
  Edit3,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  History,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * 키워드 순위 기록 타입
 */
interface KeywordRankingEntry {
  id: string;
  keyword: string;
  date: string;
  rankings: {
    google?: number | null;
    naver?: number | null;
  };
  source: "manual" | "search_console" | "auto";
  notes?: string;
}

/**
 * 키워드별 순위 히스토리
 */
interface KeywordRankingHistory {
  keyword: string;
  history: KeywordRankingEntry[];
  currentRank: {
    google?: number | null;
    naver?: number | null;
  };
  trend: {
    google: "up" | "down" | "neutral";
    naver: "up" | "down" | "neutral";
  };
  change: {
    google: number;
    naver: number;
  };
}

interface KeywordRankingTrackerProps {
  projectId: string;
  keywords: string[];
  className?: string;
}

const STORAGE_KEY_PREFIX = "seo-keyword-rankings";

export function KeywordRankingTracker({
  projectId,
  keywords,
  className = "",
}: KeywordRankingTrackerProps) {
  const [rankings, setRankings] = useState<KeywordRankingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualEntries, setManualEntries] = useState<
    { keyword: string; google: string; naver: string }[]
  >([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [savingManual, setSavingManual] = useState(false);

  // LocalStorage 키
  const storageKey = `${STORAGE_KEY_PREFIX}-${projectId}`;

  // LocalStorage에서 히스토리 로드
  const loadFromStorage = useCallback((): KeywordRankingEntry[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  }, [storageKey]);

  // LocalStorage에 저장
  const saveToStorage = useCallback(
    (entries: KeywordRankingEntry[]) => {
      if (typeof window === "undefined") return;
      localStorage.setItem(storageKey, JSON.stringify(entries));
    },
    [storageKey],
  );

  // 순위 변화 계산
  const calculateTrend = (
    history: KeywordRankingEntry[],
    engine: "google" | "naver",
  ): { trend: "up" | "down" | "neutral"; change: number } => {
    const validEntries = history.filter(
      (h) => h.rankings[engine] !== null && h.rankings[engine] !== undefined,
    );
    if (validEntries.length < 2) {
      return { trend: "neutral", change: 0 };
    }

    const sorted = [...validEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const current = sorted[0].rankings[engine]!;
    const previous = sorted[1].rankings[engine]!;
    const change = previous - current; // 순위가 낮아지면(숫자가 작아지면) 긍정적

    if (change > 0) return { trend: "up", change };
    if (change < 0) return { trend: "down", change: Math.abs(change) };
    return { trend: "neutral", change: 0 };
  };

  // 데이터 로드 및 처리
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // LocalStorage에서 기존 데이터 로드
      const storedEntries = loadFromStorage();

      // API에서 Search Console 데이터 가져오기
      let scData: { keyword: string; position: number }[] = [];
      try {
        const response = await fetch(`/api/dashboard/seo/keyword-rankings?projectId=${projectId}`);
        const data = await response.json();
        if (data.success && data.rankings) {
          scData = data.rankings.map((r: { keyword: string; history: KeywordRankingEntry[] }) => ({
            keyword: r.keyword,
            position: r.history[0]?.rankings.google || null,
          }));
        }
      } catch (e) {
        console.error("Failed to fetch SC data:", e);
      }

      // 키워드별로 히스토리 그룹화
      const historyMap = new Map<string, KeywordRankingEntry[]>();

      // 기존 저장된 데이터 추가
      storedEntries.forEach((entry: KeywordRankingEntry) => {
        const existing = historyMap.get(entry.keyword) || [];
        existing.push(entry);
        historyMap.set(entry.keyword, existing);
      });

      // 등록된 키워드들에 대해 히스토리 생성
      const processedRankings: KeywordRankingHistory[] = keywords.map((keyword) => {
        const history = historyMap.get(keyword) || [];

        // Search Console 데이터에서 현재 순위 찾기
        const scEntry = scData.find((d) => d.keyword.toLowerCase() === keyword.toLowerCase());

        // 현재 순위 결정
        const sorted = [...history].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        const latestEntry = sorted[0];

        const currentRank = {
          google: scEntry?.position ?? latestEntry?.rankings.google ?? null,
          naver: latestEntry?.rankings.naver ?? null,
        };

        const googleTrend = calculateTrend(history, "google");
        const naverTrend = calculateTrend(history, "naver");

        return {
          keyword,
          history: sorted,
          currentRank,
          trend: {
            google: googleTrend.trend,
            naver: naverTrend.trend,
          },
          change: {
            google: googleTrend.change,
            naver: naverTrend.change,
          },
        };
      });

      setRankings(processedRankings);
    } catch (error) {
      console.error("Failed to load rankings:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId, keywords, loadFromStorage]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // 수동 입력 시작
  const handleStartManualInput = () => {
    setManualEntries(
      keywords.map((keyword) => ({
        keyword,
        google: "",
        naver: "",
      })),
    );
    setIsAddingManual(true);
  };

  // 수동 입력 저장
  const handleSaveManual = async () => {
    setSavingManual(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const existingEntries = loadFromStorage();

      const newEntries: KeywordRankingEntry[] = manualEntries
        .filter((e) => e.google || e.naver)
        .map((entry, idx) => ({
          id: `manual-${Date.now()}-${idx}`,
          keyword: entry.keyword,
          date: today,
          rankings: {
            google: entry.google ? parseInt(entry.google, 10) : null,
            naver: entry.naver ? parseInt(entry.naver, 10) : null,
          },
          source: "manual" as const,
        }));

      // 같은 날짜의 기존 수동 입력 제거 후 새 데이터 추가
      const filteredEntries = existingEntries.filter(
        (e: KeywordRankingEntry) =>
          !(
            e.date === today &&
            e.source === "manual" &&
            newEntries.some((n) => n.keyword === e.keyword)
          ),
      );

      const allEntries = [...filteredEntries, ...newEntries];
      saveToStorage(allEntries);

      setIsAddingManual(false);
      await loadData();
    } catch (error) {
      console.error("Failed to save manual entries:", error);
    } finally {
      setSavingManual(false);
    }
  };

  // 순위 입력 변경
  const handleManualEntryChange = (keyword: string, field: "google" | "naver", value: string) => {
    setManualEntries((prev) =>
      prev.map((e) => (e.keyword === keyword ? { ...e, [field]: value } : e)),
    );
  };

  // 차트 데이터 생성
  const getChartData = (keyword: string) => {
    const ranking = rankings.find((r) => r.keyword === keyword);
    if (!ranking) return [];

    // 최근 30일 데이터만 표시
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return ranking.history
      .filter((h) => new Date(h.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((h) => ({
        date: h.date.slice(5), // MM-DD
        google: h.rankings.google ?? undefined,
        naver: h.rankings.naver ?? undefined,
      }));
  };

  // 트렌드 아이콘
  const TrendIcon = ({ trend, change }: { trend: "up" | "down" | "neutral"; change: number }) => {
    if (trend === "up") {
      return (
        <span className="flex items-center gap-0.5 text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-xs">+{change}</span>
        </span>
      );
    }
    if (trend === "down") {
      return (
        <span className="flex items-center gap-0.5 text-red-400">
          <TrendingDown className="w-3.5 h-3.5" />
          <span className="text-xs">-{change}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-gray-500">
        <Minus className="w-3.5 h-3.5" />
      </span>
    );
  };

  // 순위 색상
  const getRankColor = (rank: number | null | undefined) => {
    if (rank === null || rank === undefined) return "text-gray-500";
    if (rank <= 3) return "text-amber-400"; // 1-3위: 금
    if (rank <= 10) return "text-emerald-400"; // 4-10위: 첫 페이지
    if (rank <= 30) return "text-blue-400"; // 11-30위
    return "text-gray-400"; // 30위 이상
  };

  // 요약 통계
  const summary = {
    trackedCount: rankings.length,
    avgGoogle:
      rankings.filter((r) => r.currentRank.google).length > 0
        ? Math.round(
            (rankings
              .filter((r) => r.currentRank.google)
              .reduce((sum, r) => sum + (r.currentRank.google || 0), 0) /
              rankings.filter((r) => r.currentRank.google).length) *
              10,
          ) / 10
        : null,
    improved: rankings.filter((r) => r.trend.google === "up" || r.trend.naver === "up").length,
    declined: rankings.filter((r) => r.trend.google === "down" || r.trend.naver === "down").length,
  };

  if (loading) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-[#373A40] rounded animate-pulse" />
          <div className="h-5 w-32 bg-[#373A40] rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#25262b] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 border-b border-[#373A40]">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-white">키워드 순위 추적</h2>
          <span className="text-xs text-gray-500 ml-2">{summary.trackedCount}개 키워드</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadData()}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="새로고침"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleStartManualInput}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            수동 입력
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-3 p-5 border-b border-[#373A40]">
        <div className="bg-[#25262b] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">추적 키워드</p>
          <p className="text-xl font-bold text-white">{summary.trackedCount}</p>
        </div>
        <div className="bg-[#25262b] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">평균 Google 순위</p>
          <p className={`text-xl font-bold ${getRankColor(summary.avgGoogle)}`}>
            {summary.avgGoogle ?? "-"}
          </p>
        </div>
        <div className="bg-[#25262b] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">상승 키워드</p>
          <p className="text-xl font-bold text-emerald-400">{summary.improved}</p>
        </div>
        <div className="bg-[#25262b] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">하락 키워드</p>
          <p className="text-xl font-bold text-red-400">{summary.declined}</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 p-3 border-b border-[#373A40]">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeTab === "overview"
              ? "bg-blue-500/20 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          현재 순위
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeTab === "history"
              ? "bg-blue-500/20 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          히스토리
        </button>
      </div>

      {/* 수동 입력 모달 */}
      {isAddingManual && (
        <div className="p-5 border-b border-[#373A40] bg-blue-500/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              오늘 순위 입력 ({new Date().toLocaleDateString("ko-KR")})
            </h3>
            <button
              onClick={() => setIsAddingManual(false)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-[1fr_100px_100px] gap-2 text-xs text-gray-500 px-2">
              <span>키워드</span>
              <span className="text-center">Google</span>
              <span className="text-center">Naver</span>
            </div>
            {manualEntries.map((entry) => (
              <div
                key={entry.keyword}
                className="grid grid-cols-[1fr_100px_100px] gap-2 items-center"
              >
                <span className="text-sm text-white truncate px-2">{entry.keyword}</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={entry.google}
                  onChange={(e) => handleManualEntryChange(entry.keyword, "google", e.target.value)}
                  placeholder="-"
                  className="w-full px-2 py-1.5 bg-[#0d0e12] border border-[#373A40] rounded text-sm text-white text-center placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={entry.naver}
                  onChange={(e) => handleManualEntryChange(entry.keyword, "naver", e.target.value)}
                  placeholder="-"
                  className="w-full px-2 py-1.5 bg-[#0d0e12] border border-[#373A40] rounded text-sm text-white text-center placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>직접 검색하여 확인한 순위를 입력하세요. 100위권 밖이면 비워두세요.</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => void handleSaveManual()}
              disabled={savingManual}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
            >
              {savingManual ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              저장
            </button>
            <button
              onClick={() => setIsAddingManual(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 현재 순위 탭 */}
      {activeTab === "overview" && (
        <div className="p-5">
          <div className="space-y-2">
            {rankings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">추적할 키워드가 없습니다.</p>
                <p className="text-xs mt-1">키워드를 먼저 등록해주세요.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 text-xs text-gray-500 px-3 py-2">
                  <span>키워드</span>
                  <span className="text-center">Google</span>
                  <span className="text-center">변화</span>
                  <span className="text-center">Naver</span>
                  <span className="text-center">변화</span>
                </div>
                {rankings.map((ranking) => (
                  <div
                    key={ranking.keyword}
                    className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 items-center p-3 bg-[#25262b] rounded-lg hover:bg-[#2a2b33] transition-colors cursor-pointer"
                    onClick={() =>
                      setSelectedKeyword(
                        selectedKeyword === ranking.keyword ? null : ranking.keyword,
                      )
                    }
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Search className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-white truncate">{ranking.keyword}</span>
                    </div>
                    <span
                      className={`text-center font-medium ${getRankColor(ranking.currentRank.google)}`}
                    >
                      {ranking.currentRank.google ?? "-"}
                    </span>
                    <div className="flex justify-center">
                      <TrendIcon trend={ranking.trend.google} change={ranking.change.google} />
                    </div>
                    <span
                      className={`text-center font-medium ${getRankColor(ranking.currentRank.naver)}`}
                    >
                      {ranking.currentRank.naver ?? "-"}
                    </span>
                    <div className="flex justify-center">
                      <TrendIcon trend={ranking.trend.naver} change={ranking.change.naver} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* 선택된 키워드 차트 */}
          {selectedKeyword && (
            <div className="mt-6 p-4 bg-[#25262b] rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  &quot;{selectedKeyword}&quot; 순위 추이
                </h3>
                <button
                  onClick={() => setSelectedKeyword(null)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {getChartData(selectedKeyword).length > 1 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData(selectedKeyword)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#373A40" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#909296", fontSize: 11 }}
                        axisLine={{ stroke: "#373A40" }}
                      />
                      <YAxis
                        domain={[1, "auto"]}
                        reversed
                        tick={{ fill: "#909296", fontSize: 11 }}
                        axisLine={{ stroke: "#373A40" }}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1b23",
                          border: "1px solid #373A40",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#909296" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="google"
                        stroke="#4285F4"
                        strokeWidth={2}
                        dot={{ fill: "#4285F4" }}
                        name="Google"
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="naver"
                        stroke="#03C75A"
                        strokeWidth={2}
                        dot={{ fill: "#03C75A" }}
                        name="Naver"
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">차트를 표시하려면 최소 2일 이상의 데이터가 필요합니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 히스토리 탭 */}
      {activeTab === "history" && (
        <div className="p-5">
          {rankings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">순위 히스토리가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rankings.map((ranking) => (
                <div key={ranking.keyword} className="border border-[#373A40] rounded-lg">
                  <button
                    onClick={() =>
                      setSelectedKeyword(
                        selectedKeyword === ranking.keyword ? null : ranking.keyword,
                      )
                    }
                    className="w-full flex items-center justify-between p-3 hover:bg-[#25262b] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-white">{ranking.keyword}</span>
                      <span className="text-xs text-gray-500">
                        ({ranking.history.length}개 기록)
                      </span>
                    </div>
                    {selectedKeyword === ranking.keyword ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {selectedKeyword === ranking.keyword && ranking.history.length > 0 && (
                    <div className="border-t border-[#373A40] p-3 bg-[#25262b]/50">
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-[100px_60px_60px_1fr] gap-2 text-xs text-gray-500 px-2">
                          <span>날짜</span>
                          <span className="text-center">Google</span>
                          <span className="text-center">Naver</span>
                          <span>소스</span>
                        </div>
                        {ranking.history.map((entry) => (
                          <div
                            key={entry.id}
                            className="grid grid-cols-[100px_60px_60px_1fr] gap-2 items-center px-2 py-1.5 bg-[#1a1b23] rounded"
                          >
                            <span className="text-xs text-gray-400">{entry.date}</span>
                            <span
                              className={`text-xs text-center ${getRankColor(entry.rankings.google)}`}
                            >
                              {entry.rankings.google ?? "-"}
                            </span>
                            <span
                              className={`text-xs text-center ${getRankColor(entry.rankings.naver)}`}
                            >
                              {entry.rankings.naver ?? "-"}
                            </span>
                            <span className="text-xs">
                              {entry.source === "manual" && (
                                <span className="text-amber-400">수동 입력</span>
                              )}
                              {entry.source === "search_console" && (
                                <span className="text-blue-400">Search Console</span>
                              )}
                              {entry.source === "auto" && (
                                <span className="text-emerald-400">자동 수집</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 도움말 */}
      <div className="p-4 border-t border-[#373A40] bg-[#25262b]/30">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-500">
            <p className="mb-1">
              <strong className="text-gray-400">Google 순위</strong>: Search Console 평균 순위 자동
              연동
            </p>
            <p>
              <strong className="text-gray-400">Naver 순위</strong>: 직접 검색 후 수동 입력 필요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeywordRankingTracker;
