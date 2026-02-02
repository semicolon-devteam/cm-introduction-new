"use client";

import { useState, useCallback } from "react";
import {
  Users,
  Plus,
  X,
  Search,
  Loader2,
  Globe,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  BarChart3,
  ExternalLink,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/**
 * 경쟁사 데이터 타입
 */
interface CompetitorData {
  url: string;
  domain: string;
  meta: {
    title: string | null;
    description: string | null;
    keywords: string[];
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    canonical: string | null;
  };
  headings: {
    h1: string[];
    h2: string[];
  };
  wordCount: number;
  analyzedAt: string;
}

interface AIAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  keywordGap: {
    competitorOnlyKeywords: string[];
    sharedKeywords: string[];
    myOnlyKeywords: string[];
  };
  recommendations: {
    priority: "high" | "medium" | "low";
    action: string;
    reason: string;
  }[];
  contentComparison: {
    category: string;
    myScore: number;
    avgCompetitorScore: number;
    verdict: "ahead" | "behind" | "even";
  }[];
}

interface CompetitorAnalysisProps {
  myDomain: string;
  myKeywords: string[];
  className?: string;
}

const STORAGE_KEY_PREFIX = "seo-competitor-analysis";

export function CompetitorAnalysis({
  myDomain,
  myKeywords,
  className = "",
}: CompetitorAnalysisProps) {
  const [competitorUrls, setCompetitorUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<CompetitorData[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"competitors" | "analysis">("competitors");

  // URL 추가
  const handleAddUrl = () => {
    if (!newUrl.trim()) return;

    let url = newUrl.trim();
    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    try {
      new URL(url);
      if (competitorUrls.length >= 5) {
        setError("최대 5개의 경쟁사만 추가할 수 있습니다.");
        return;
      }
      if (competitorUrls.includes(url)) {
        setError("이미 추가된 URL입니다.");
        return;
      }
      setCompetitorUrls([...competitorUrls, url]);
      setNewUrl("");
      setError(null);
    } catch {
      setError("유효한 URL을 입력해주세요.");
    }
  };

  // URL 제거
  const handleRemoveUrl = (url: string) => {
    setCompetitorUrls(competitorUrls.filter((u) => u !== url));
  };

  // 경쟁사 분석 실행
  const handleAnalyze = useCallback(async () => {
    if (competitorUrls.length === 0) {
      setError("분석할 경쟁사 URL을 추가해주세요.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults([]);
    setAiAnalysis(null);

    try {
      const response = await fetch("/api/dashboard/seo/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myDomain,
          myKeywords,
          competitorUrls,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.competitors || []);
        setAiAnalysis(data.aiAnalysis || null);
        setActiveTab("analysis");

        // LocalStorage에 저장
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}-${myDomain}`,
          JSON.stringify({
            competitorUrls,
            results: data.competitors,
            aiAnalysis: data.aiAnalysis,
            analyzedAt: new Date().toISOString(),
          }),
        );
      } else {
        setError(data.error || "분석 실패");
      }
    } catch (err) {
      setError("경쟁사 분석 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  }, [competitorUrls, myDomain, myKeywords]);

  // 점수 색상
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  // 우선순위 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // 비교 차트 데이터
  const comparisonChartData = aiAnalysis?.contentComparison.map((item) => ({
    name: item.category,
    me: item.myScore,
    competitor: item.avgCompetitorScore,
  }));

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 border-b border-[#373A40]">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h2 className="font-semibold text-white">경쟁사 분석</h2>
          {results.length > 0 && (
            <span className="text-xs text-gray-500 ml-2">{results.length}개 분석 완료</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* 탭 */}
          <div className="flex gap-1 bg-[#25262b] rounded-lg p-1">
            <button
              onClick={() => setActiveTab("competitors")}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === "competitors"
                  ? "bg-purple-500/20 text-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              경쟁사 설정
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              disabled={results.length === 0}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === "analysis"
                  ? "bg-purple-500/20 text-purple-400"
                  : "text-gray-400 hover:text-white disabled:opacity-50"
              }`}
            >
              분석 결과
            </button>
          </div>
        </div>
      </div>

      {/* 경쟁사 설정 탭 */}
      {activeTab === "competitors" && (
        <div className="p-5 space-y-4">
          {/* URL 입력 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">경쟁사 URL 추가 (최대 5개)</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2 bg-[#0d0e12] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <button
                onClick={handleAddUrl}
                disabled={!newUrl.trim() || competitorUrls.length >= 5}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          {/* 추가된 경쟁사 목록 */}
          {competitorUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">추가된 경쟁사 ({competitorUrls.length}/5)</p>
              <div className="space-y-2">
                {competitorUrls.map((url) => (
                  <div
                    key={url}
                    className="flex items-center justify-between p-3 bg-[#25262b] rounded-lg"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-white truncate">{url}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveUrl(url)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 내 사이트 정보 */}
          <div className="p-4 bg-[#25262b] rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />내 사이트 정보
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">도메인</span>
                <span className="text-white">{myDomain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">타겟 키워드</span>
                <span className="text-blue-400">{myKeywords.length}개</span>
              </div>
            </div>
          </div>

          {/* 분석 버튼 */}
          <button
            onClick={() => void handleAnalyze()}
            disabled={analyzing || competitorUrls.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                경쟁사 분석 중...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                경쟁사 분석 시작
              </>
            )}
          </button>
        </div>
      )}

      {/* 분석 결과 탭 */}
      {activeTab === "analysis" && results.length > 0 && (
        <div className="p-5 space-y-6">
          {/* AI 요약 */}
          {aiAnalysis && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI 분석 요약
              </h3>
              <p className="text-sm text-gray-300">{aiAnalysis.summary}</p>
            </div>
          )}

          {/* SWOT 분석 */}
          {aiAnalysis && (
            <div className="grid grid-cols-2 gap-3">
              {/* 강점 */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <h4 className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  강점
                </h4>
                <ul className="space-y-1">
                  {aiAnalysis.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-gray-300">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              {/* 약점 */}
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  약점
                </h4>
                <ul className="space-y-1">
                  {aiAnalysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-gray-300">
                      • {w}
                    </li>
                  ))}
                </ul>
              </div>
              {/* 기회 */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg col-span-2">
                <h4 className="text-xs font-medium text-blue-400 mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  기회
                </h4>
                <ul className="space-y-1">
                  {aiAnalysis.opportunities.map((o, i) => (
                    <li key={i} className="text-xs text-gray-300">
                      • {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 키워드 갭 분석 */}
          {aiAnalysis?.keywordGap && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                키워드 갭 분석
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#25262b] rounded-lg">
                  <p className="text-xs text-red-400 mb-2">경쟁사만 타겟</p>
                  <div className="flex flex-wrap gap-1">
                    {aiAnalysis.keywordGap.competitorOnlyKeywords.length > 0 ? (
                      aiAnalysis.keywordGap.competitorOnlyKeywords.map((k, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded"
                        >
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">없음</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-[#25262b] rounded-lg">
                  <p className="text-xs text-amber-400 mb-2">공통 키워드</p>
                  <div className="flex flex-wrap gap-1">
                    {aiAnalysis.keywordGap.sharedKeywords.length > 0 ? (
                      aiAnalysis.keywordGap.sharedKeywords.map((k, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded"
                        >
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">없음</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-[#25262b] rounded-lg">
                  <p className="text-xs text-emerald-400 mb-2">내만 타겟</p>
                  <div className="flex flex-wrap gap-1">
                    {aiAnalysis.keywordGap.myOnlyKeywords.length > 0 ? (
                      aiAnalysis.keywordGap.myOnlyKeywords.map((k, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded"
                        >
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">없음</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 콘텐츠 비교 차트 */}
          {comparisonChartData && comparisonChartData.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                경쟁사 대비 점수
              </h3>
              <div className="h-48 bg-[#25262b] rounded-lg p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#373A40" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "#909296", fontSize: 11 }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#909296", fontSize: 10 }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1b23",
                        border: "1px solid #373A40",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="me" name="내 사이트" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    <Bar
                      dataKey="competitor"
                      name="경쟁사 평균"
                      fill="#9333EA"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 추천 액션 */}
          {aiAnalysis?.recommendations && aiAnalysis.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                추천 액션
              </h3>
              <div className="space-y-2">
                {aiAnalysis.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 bg-[#25262b] rounded-lg">
                    <div className="flex items-start gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded border ${getPriorityColor(rec.priority)}`}
                      >
                        {rec.priority === "high"
                          ? "높음"
                          : rec.priority === "medium"
                            ? "중간"
                            : "낮음"}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-white">{rec.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 경쟁사 상세 정보 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              경쟁사 상세
            </h3>
            <div className="space-y-2">
              {results.map((competitor) => (
                <div key={competitor.url} className="border border-[#373A40] rounded-lg">
                  <button
                    onClick={() =>
                      setExpandedCompetitor(
                        expandedCompetitor === competitor.url ? null : competitor.url,
                      )
                    }
                    className="w-full flex items-center justify-between p-3 hover:bg-[#25262b] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-white">{competitor.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {competitor.wordCount.toLocaleString()}단어
                      </span>
                      {expandedCompetitor === competitor.url ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedCompetitor === competitor.url && (
                    <div className="border-t border-[#373A40] p-3 bg-[#25262b]/50 space-y-3">
                      {/* 메타 정보 */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Title</p>
                        <p className="text-sm text-white">{competitor.meta.title || "없음"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-300">
                          {competitor.meta.description || "없음"}
                        </p>
                      </div>
                      {competitor.meta.keywords.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Keywords</p>
                          <div className="flex flex-wrap gap-1">
                            {competitor.meta.keywords.map((k, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs bg-[#373A40] text-gray-300 rounded"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {competitor.headings.h1.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">H1 태그</p>
                          <ul className="text-sm text-gray-300">
                            {competitor.headings.h1.map((h, i) => (
                              <li key={i}>• {h}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <a
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        사이트 방문
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 분석 결과 없음 */}
      {activeTab === "analysis" && results.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">분석 결과가 없습니다.</p>
          <p className="text-xs mt-1">경쟁사 설정 탭에서 분석을 실행해주세요.</p>
        </div>
      )}

      {/* 도움말 */}
      <div className="p-4 border-t border-[#373A40] bg-[#25262b]/30">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-500">
            <p>
              경쟁사 URL을 추가하면 메타태그, 콘텐츠 구조, 키워드를 자동으로 분석합니다. AI가 경쟁사
              대비 개선점을 제안합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompetitorAnalysis;
