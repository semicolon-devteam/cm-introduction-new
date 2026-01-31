/* eslint-disable max-lines */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  X,
  Sparkles,
  Settings,
  Send,
  Loader2,
  TrendingUp,
  Target,
  Zap,
  Bell,
  FileText,
  Check,
  Code,
  Copy,
  Globe,
  Tag,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Rocket,
  BarChart3,
  Webhook,
  Info,
} from "lucide-react";
import { getProjectConfig, type SEOProjectConfig } from "@/app/dashboard/_config/seo-projects";

interface Keyword {
  id: string;
  text: string;
  type: "main" | "sub";
  createdAt: string;
}

interface AutomationSettings {
  autoMetaTags: boolean;
  autoIndexNow: boolean;
  weeklyReport: boolean;
}

interface RecommendedKeyword {
  query: string;
  clicks: number;
  impressions: number;
}

export default function KeywordsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<SEOProjectConfig | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recommendedKeywords, setRecommendedKeywords] = useState<RecommendedKeyword[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [automation, setAutomation] = useState<AutomationSettings>({
    autoMetaTags: true,
    autoIndexNow: true,
    weeklyReport: false,
  });
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Meta tag generator states
  const [metaUrl, setMetaUrl] = useState("");
  const [metaGenerating, setMetaGenerating] = useState(false);
  const [generatedMeta, setGeneratedMeta] = useState<{
    metaTags: Record<string, string>;
    htmlCode: string;
  } | null>(null);
  const [metaCopied, setMetaCopied] = useState(false);

  // GTM states
  const [gtmContainerId, setGtmContainerId] = useState("");
  const [gtmGenerating, setGtmGenerating] = useState(false);
  const [gtmResult, setGtmResult] = useState<{
    scripts: { head: string; body: string };
    dataLayerEvents: string;
    aiSuggestions?: {
      tags: { name: string; type: string; trigger: string; purpose: string; code?: string }[];
      variables: { name: string; type: string; value: string }[];
      recommendations: string[];
    };
  } | null>(null);
  const [gtmCopied, setGtmCopied] = useState<string | null>(null);
  const [gtmExpanded, setGtmExpanded] = useState(false);

  // IndexNow states
  const [indexNowUrls, setIndexNowUrls] = useState("");
  const [indexNowSubmitting, setIndexNowSubmitting] = useState(false);
  const [indexNowResult, setIndexNowResult] = useState<{
    message: string;
    results: { engine: string; success: boolean; status?: number }[];
  } | null>(null);

  // Weekly Report states
  const [reportGenerating, setReportGenerating] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<{
    markdown: string;
    aiInsights?: {
      summary: string;
      highlights: string[];
      concerns: string[];
      recommendations: { priority: string; action: string; expectedImpact: string }[];
      nextWeekFocus: string;
    };
  } | null>(null);
  const [reportCopied, setReportCopied] = useState(false);

  // Load project config
  useEffect(() => {
    const config = getProjectConfig(projectId);
    if (!config) {
      router.push("/dashboard/seo");
      return;
    }
    setProject(config);
  }, [projectId, router]);

  // Load saved keywords from localStorage
  useEffect(() => {
    if (!projectId) return;

    const savedKeywords = localStorage.getItem(`seo-keywords-${projectId}`);
    if (savedKeywords) {
      setKeywords(JSON.parse(savedKeywords));
    }

    const savedAutomation = localStorage.getItem(`seo-automation-${projectId}`);
    if (savedAutomation) {
      setAutomation(JSON.parse(savedAutomation));
    }

    const savedGtmId = localStorage.getItem(`seo-gtm-${projectId}`);
    if (savedGtmId) {
      setGtmContainerId(savedGtmId);
    }

    setLoading(false);
  }, [projectId]);

  // Save keywords to localStorage
  const saveKeywords = (newKeywords: Keyword[]) => {
    setKeywords(newKeywords);
    localStorage.setItem(`seo-keywords-${projectId}`, JSON.stringify(newKeywords));
  };

  // Save automation settings
  const saveAutomation = (newSettings: AutomationSettings) => {
    setAutomation(newSettings);
    localStorage.setItem(`seo-automation-${projectId}`, JSON.stringify(newSettings));
  };

  // Add keyword
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;

    const keyword: Keyword = {
      id: Date.now().toString(),
      text: newKeyword.trim(),
      type: "main",
      createdAt: new Date().toISOString(),
    };

    saveKeywords([...keywords, keyword]);
    setNewKeyword("");
  };

  // Remove keyword
  const handleRemoveKeyword = (id: string) => {
    saveKeywords(keywords.filter((k) => k.id !== id));
  };

  // Add recommended keyword
  const handleAddRecommended = (query: string) => {
    if (keywords.some((k) => k.text === query)) return;

    const keyword: Keyword = {
      id: Date.now().toString(),
      text: query,
      type: "sub",
      createdAt: new Date().toISOString(),
    };

    saveKeywords([...keywords, keyword]);
  };

  // Load recommendations from Search Console
  const loadRecommendations = async () => {
    if (!project?.searchConsole.siteUrl) return;

    setLoadingRecommendations(true);
    try {
      const response = await fetch(
        `/api/dashboard/search-console?period=28days&siteUrl=${encodeURIComponent(project.searchConsole.siteUrl)}`,
      );
      const data = await response.json();

      if (data.topQueries) {
        // Filter out already added keywords
        const existingTexts = keywords.map((k) => k.text.toLowerCase());
        const recommendations = data.topQueries
          .filter((q: { query: string }) => !existingTexts.includes(q.query.toLowerCase()))
          .slice(0, 10);
        setRecommendedKeywords(recommendations);
      }
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Load recommendations on mount
  useEffect(() => {
    if (project?.searchConsole.enabled) {
      void loadRecommendations();
    }
  }, [project]);

  // Generate Meta Tags
  const handleGenerateMeta = async () => {
    if (!metaUrl.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    setMetaGenerating(true);
    setGeneratedMeta(null);

    try {
      const response = await fetch("/api/dashboard/seo/generate-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: metaUrl.startsWith("http")
            ? metaUrl
            : `https://${project?.domain}${metaUrl.startsWith("/") ? metaUrl : `/${metaUrl}`}`,
          keywords: keywords.map((k) => k.text),
          domain: project?.domain,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedMeta({
          metaTags: data.metaTags,
          htmlCode: data.htmlCode,
        });
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch (error) {
      alert("메타태그 생성 중 오류가 발생했습니다.");
    } finally {
      setMetaGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopyMeta = () => {
    if (!generatedMeta?.htmlCode) return;
    void navigator.clipboard.writeText(generatedMeta.htmlCode);
    setMetaCopied(true);
    setTimeout(() => setMetaCopied(false), 2000);
  };

  // Save GTM Container ID
  const saveGtmContainerId = (id: string) => {
    setGtmContainerId(id);
    localStorage.setItem(`seo-gtm-${projectId}`, id);
  };

  // Generate GTM Tags
  const handleGenerateGtm = async () => {
    if (!gtmContainerId.trim()) {
      alert("GTM Container ID를 입력해주세요. (예: GTM-XXXXXXX)");
      return;
    }

    setGtmGenerating(true);
    setGtmResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/gtm-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          containerId: gtmContainerId,
          domain: project?.domain,
          keywords: keywords.map((k) => k.text),
          pageType: "homepage",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGtmResult({
          scripts: data.scripts,
          dataLayerEvents: data.dataLayerEvents,
          aiSuggestions: data.aiSuggestions,
        });
        setGtmExpanded(true);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch (error) {
      alert("GTM 태그 생성 중 오류가 발생했습니다.");
    } finally {
      setGtmGenerating(false);
    }
  };

  // Copy GTM code
  const handleCopyGtm = (type: string, code: string) => {
    void navigator.clipboard.writeText(code);
    setGtmCopied(type);
    setTimeout(() => setGtmCopied(null), 2000);
  };

  // Submit URLs to IndexNow
  const handleIndexNowSubmit = async () => {
    if (!indexNowUrls.trim()) {
      alert("URL을 입력해주세요. (줄바꿈으로 여러 URL 입력 가능)");
      return;
    }

    const urls = indexNowUrls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      alert("유효한 URL이 없습니다.");
      return;
    }

    setIndexNowSubmitting(true);
    setIndexNowResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls,
          host: project?.domain,
          searchEngines: ["naver", "bing"],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIndexNowResult({
          message: data.message,
          results: data.results,
        });
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch (error) {
      alert("IndexNow 제출 중 오류가 발생했습니다.");
    } finally {
      setIndexNowSubmitting(false);
    }
  };

  // Generate Weekly Report
  const handleGenerateReport = async () => {
    setReportGenerating(true);
    setWeeklyReport(null);

    try {
      // 먼저 Search Console 데이터 가져오기
      let searchConsoleData: {
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
        topQueries?: { query: string; clicks: number; impressions: number }[];
      } | null = null;
      if (project?.searchConsole.enabled) {
        try {
          const scResponse = await fetch(
            `/api/dashboard/search-console?period=7days&siteUrl=${encodeURIComponent(project.searchConsole.siteUrl)}`,
          );
          const scData = await scResponse.json();
          // Search Console API는 connected 필드 사용, overview.current에 데이터
          if (scData.connected && scData.overview?.current) {
            searchConsoleData = {
              clicks: scData.overview.current.clicks || 0,
              impressions: scData.overview.current.impressions || 0,
              ctr: (scData.overview.current.ctr || 0) / 100, // API는 퍼센트로 반환
              position: scData.overview.current.position || 0,
              topQueries: scData.topQueries,
            };
          }
        } catch (e) {
          console.error("Search Console data fetch failed:", e);
        }
      }

      const response = await fetch("/api/dashboard/seo/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          domain: project?.domain,
          keywords: keywords.map((k) => k.text),
          searchConsoleData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWeeklyReport({
          markdown: data.report.markdown,
          aiInsights: data.report.aiInsights,
        });
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch (error) {
      alert("리포트 생성 중 오류가 발생했습니다.");
    } finally {
      setReportGenerating(false);
    }
  };

  // Copy report
  const handleCopyReport = () => {
    if (!weeklyReport?.markdown) return;
    void navigator.clipboard.writeText(weeklyReport.markdown);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2000);
  };

  // Run AI SEO Optimization
  const handleAiOptimize = async () => {
    if (keywords.length === 0) {
      alert("키워드를 먼저 등록해주세요.");
      return;
    }

    setAiOptimizing(true);
    setAiResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          domain: project?.domain,
          keywords: keywords.map((k) => k.text),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResult(data.result);
      } else {
        setAiResult(`오류: ${data.error}`);
      }
    } catch (error) {
      setAiResult("AI 최적화 실행 중 오류가 발생했습니다.");
    } finally {
      setAiOptimizing(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/dashboard/seo/${projectId}`}
            className="p-2 rounded-lg hover:bg-[#1a1b23] transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{project.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <p className="text-sm text-gray-500">키워드 관리 & AI SEO 설정</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Keywords */}
          <div className="space-y-6">
            {/* Main Keywords */}
            <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  메인 키워드
                </h2>
                <span className="text-sm text-gray-500">{keywords.length}개</span>
              </div>

              {/* Add keyword input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
                  placeholder="키워드 입력 후 Enter"
                  className="flex-1 px-4 py-2 bg-[#0d0e12] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={handleAddKeyword}
                  disabled={!newKeyword.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Keywords list */}
              <div className="flex flex-wrap gap-2">
                {keywords.length === 0 ? (
                  <p className="text-gray-500 text-sm">등록된 키워드가 없습니다.</p>
                ) : (
                  keywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                        keyword.type === "main"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}
                    >
                      {keyword.text}
                      <button
                        onClick={() => handleRemoveKeyword(keyword.id)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  AI 추천 키워드
                </h2>
                <button
                  onClick={() => void loadRecommendations()}
                  disabled={loadingRecommendations}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {loadingRecommendations ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "새로고침"
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Search Console에서 클릭이 많은 검색어를 기반으로 추천합니다.
              </p>

              {loadingRecommendations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              ) : recommendedKeywords.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">추천할 키워드가 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {recommendedKeywords.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-[#0d0e12] rounded-lg"
                    >
                      <div>
                        <span className="text-white text-sm">{rec.query}</span>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-gray-500">클릭 {rec.clicks}</span>
                          <span className="text-xs text-gray-500">
                            노출 {rec.impressions.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddRecommended(rec.query)}
                        className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Settings & AI */}
          <div className="space-y-6">
            {/* Automation Settings */}
            <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-400" />
                자동화 설정
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-[#0d0e12] rounded-lg cursor-pointer hover:bg-[#25262b] transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white text-sm">메타태그 자동 생성</p>
                      <p className="text-xs text-gray-500">
                        새 글 발행 시 AI가 Title, Description 생성
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={automation.autoMetaTags}
                    onChange={(e) =>
                      saveAutomation({ ...automation, autoMetaTags: e.target.checked })
                    }
                    className="w-5 h-5 rounded bg-[#373A40] border-none text-blue-500 focus:ring-0 focus:ring-offset-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#0d0e12] rounded-lg cursor-pointer hover:bg-[#25262b] transition-colors">
                  <div className="flex items-center gap-3">
                    <Send className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white text-sm">IndexNow 자동 제출</p>
                      <p className="text-xs text-gray-500">새 글 발행 시 네이버/Bing에 색인 요청</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={automation.autoIndexNow}
                    onChange={(e) =>
                      saveAutomation({ ...automation, autoIndexNow: e.target.checked })
                    }
                    className="w-5 h-5 rounded bg-[#373A40] border-none text-blue-500 focus:ring-0 focus:ring-offset-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#0d0e12] rounded-lg cursor-pointer hover:bg-[#25262b] transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white text-sm">주간 SEO 리포트</p>
                      <p className="text-xs text-gray-500">매주 월요일 성과 리포트 발송</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={automation.weeklyReport}
                    onChange={(e) =>
                      saveAutomation({ ...automation, weeklyReport: e.target.checked })
                    }
                    className="w-5 h-5 rounded bg-[#373A40] border-none text-blue-500 focus:ring-0 focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>

            {/* AI SEO Optimization */}
            <div className="bg-[#1a1b23] border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-purple-400" />
                AI SEO 최적화
              </h2>

              <p className="text-sm text-gray-400 mb-4">
                등록된 키워드를 기반으로 AI가 사이트 SEO를 분석하고 최적화 제안을 생성합니다.
              </p>

              <button
                onClick={() => void handleAiOptimize()}
                disabled={aiOptimizing || keywords.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiOptimizing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI 분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    AI SEO 최적화 실행
                  </>
                )}
              </button>

              {/* AI Result */}
              {aiResult && (
                <div className="mt-4 p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                  <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    AI 분석 결과
                  </h3>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap">{aiResult}</div>
                </div>
              )}
            </div>

            {/* Meta Tag Generator */}
            <div className="bg-[#1a1b23] border border-cyan-500/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-cyan-400" />
                메타태그 생성기
              </h2>

              <p className="text-sm text-gray-400 mb-4">
                URL을 입력하면 AI가 SEO에 최적화된 메타태그를 생성합니다.
              </p>

              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={metaUrl}
                    onChange={(e) => setMetaUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && void handleGenerateMeta()}
                    placeholder="/page-path 또는 전체 URL"
                    className="w-full pl-10 pr-4 py-2 bg-[#0d0e12] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <button
                  onClick={() => void handleGenerateMeta()}
                  disabled={metaGenerating || !metaUrl.trim()}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {metaGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  생성
                </button>
              </div>

              {/* Generated Meta Tags */}
              {generatedMeta && (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                    <h3 className="text-sm font-medium text-white mb-3">미리보기</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Title</p>
                        <p className="text-sm text-blue-400">{generatedMeta.metaTags.title}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm text-gray-300">
                          {generatedMeta.metaTags.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* HTML Code */}
                  <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">HTML 코드</h3>
                      <button
                        onClick={handleCopyMeta}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {metaCopied ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            복사됨!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            복사
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap font-mono bg-black/30 p-3 rounded">
                      {generatedMeta.htmlCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* GTM Tag Manager */}
            <div className="bg-[#1a1b23] border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-400" />
                  GTM 태그 관리
                </h2>
                <a
                  href="https://tagmanager.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
                >
                  GTM 콘솔
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Google Tag Manager Container ID를 입력하면 설치 코드와 SEO 추적 태그를 생성합니다.
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={gtmContainerId}
                  onChange={(e) => saveGtmContainerId(e.target.value.toUpperCase())}
                  placeholder="GTM-XXXXXXX"
                  className="flex-1 px-4 py-2 bg-[#0d0e12] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 font-mono"
                />
                <button
                  onClick={() => void handleGenerateGtm()}
                  disabled={gtmGenerating || !gtmContainerId.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {gtmGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Code className="w-4 h-4" />
                  )}
                  생성
                </button>
              </div>

              {/* GTM Result */}
              {gtmResult && (
                <div className="space-y-4">
                  {/* Toggle Button */}
                  <button
                    onClick={() => setGtmExpanded(!gtmExpanded)}
                    className="w-full flex items-center justify-between p-3 bg-[#0d0e12] rounded-lg border border-[#373A40] hover:border-orange-500/30 transition-colors"
                  >
                    <span className="text-sm text-white flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      GTM 코드 생성 완료
                    </span>
                    {gtmExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {gtmExpanded && (
                    <div className="space-y-4">
                      {/* Head Script */}
                      <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-white">
                            &lt;head&gt; 태그 안에 삽입
                          </h3>
                          <button
                            onClick={() => handleCopyGtm("head", gtmResult.scripts.head)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            {gtmCopied === "head" ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" />
                                복사됨!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                복사
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-xs text-orange-300/80 overflow-x-auto whitespace-pre-wrap font-mono bg-black/30 p-3 rounded max-h-32 overflow-y-auto">
                          {gtmResult.scripts.head}
                        </pre>
                      </div>

                      {/* Body Script */}
                      <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-white">
                            &lt;body&gt; 태그 바로 뒤에 삽입
                          </h3>
                          <button
                            onClick={() => handleCopyGtm("body", gtmResult.scripts.body)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            {gtmCopied === "body" ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" />
                                복사됨!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                복사
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-xs text-orange-300/80 overflow-x-auto whitespace-pre-wrap font-mono bg-black/30 p-3 rounded">
                          {gtmResult.scripts.body}
                        </pre>
                      </div>

                      {/* DataLayer Events */}
                      <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-white">SEO 추적 이벤트 코드</h3>
                          <button
                            onClick={() => handleCopyGtm("dataLayer", gtmResult.dataLayerEvents)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            {gtmCopied === "dataLayer" ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" />
                                복사됨!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                복사
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          스크롤 깊이, 체류 시간 추적을 위한 코드입니다.
                        </p>
                        <pre className="text-xs text-green-300/80 overflow-x-auto whitespace-pre-wrap font-mono bg-black/30 p-3 rounded max-h-48 overflow-y-auto">
                          {gtmResult.dataLayerEvents}
                        </pre>
                      </div>

                      {/* AI Suggestions */}
                      {gtmResult.aiSuggestions && (
                        <div className="p-4 bg-[#0d0e12] rounded-lg border border-purple-500/30">
                          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            AI 추천 GTM 태그
                          </h3>

                          {/* Recommended Tags */}
                          <div className="space-y-3 mb-4">
                            {gtmResult.aiSuggestions.tags.map((tag, i) => (
                              <div
                                key={i}
                                className="p-3 bg-[#1a1b23] rounded-lg border border-[#373A40]"
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <span className="text-sm font-medium text-white">{tag.name}</span>
                                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                                    {tag.type}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">트리거: {tag.trigger}</p>
                                <p className="text-xs text-gray-500">{tag.purpose}</p>
                                {tag.code && (
                                  <pre className="mt-2 text-xs text-cyan-300/80 bg-black/30 p-2 rounded overflow-x-auto">
                                    {tag.code}
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Recommendations */}
                          {gtmResult.aiSuggestions.recommendations.length > 0 && (
                            <div className="border-t border-[#373A40] pt-3">
                              <h4 className="text-xs font-medium text-gray-400 mb-2">권장 사항</h4>
                              <ul className="space-y-1">
                                {gtmResult.aiSuggestions.recommendations.map((rec, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-gray-500 flex items-start gap-2"
                                  >
                                    <span className="text-yellow-400">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* IndexNow Manual Submit */}
            <div className="bg-[#1a1b23] border border-green-500/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-green-400" />
                IndexNow 색인 요청
              </h2>

              <p className="text-sm text-gray-400 mb-4">
                URL을 입력하면 네이버와 Bing에 즉시 색인 요청을 보냅니다.
              </p>

              <div className="space-y-3">
                <textarea
                  value={indexNowUrls}
                  onChange={(e) => setIndexNowUrls(e.target.value)}
                  placeholder={`https://${project?.domain}/page-1\nhttps://${project?.domain}/page-2\n(줄바꿈으로 여러 URL 입력)`}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0d0e12] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 font-mono text-sm resize-none"
                />

                <button
                  onClick={() => void handleIndexNowSubmit()}
                  disabled={indexNowSubmitting || !indexNowUrls.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {indexNowSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      제출 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      색인 요청 제출
                    </>
                  )}
                </button>

                {indexNowResult && (
                  <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                    <p className="text-sm text-white mb-2">{indexNowResult.message}</p>
                    <div className="space-y-1">
                      {indexNowResult.results.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          {r.success ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <X className="w-3 h-3 text-red-400" />
                          )}
                          <span className={r.success ? "text-green-400" : "text-red-400"}>
                            {r.engine.toUpperCase()}: {r.success ? "성공" : "실패"}
                          </span>
                          {r.status && <span className="text-gray-500">({r.status})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Report */}
            <div className="bg-[#1a1b23] border border-yellow-500/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                주간 SEO 리포트
              </h2>

              <p className="text-sm text-gray-400 mb-4">
                Search Console 데이터를 기반으로 AI가 주간 SEO 성과 리포트를 생성합니다.
              </p>

              <button
                onClick={() => void handleGenerateReport()}
                disabled={reportGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reportGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    리포트 생성 중...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    주간 리포트 생성
                  </>
                )}
              </button>

              {weeklyReport && (
                <div className="mt-4 space-y-4">
                  {/* AI Insights Summary */}
                  {weeklyReport.aiInsights && (
                    <div className="p-4 bg-[#0d0e12] rounded-lg border border-purple-500/30">
                      <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        AI 인사이트
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">
                        {weeklyReport.aiInsights.summary}
                      </p>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-green-400 mb-1">주요 성과</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            {weeklyReport.aiInsights.highlights.slice(0, 3).map((h, i) => (
                              <li key={i}>• {h}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-yellow-400 mb-1">다음 주 집중</p>
                          <p className="text-xs text-gray-400">
                            {weeklyReport.aiInsights.nextWeekFocus}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Markdown Report */}
                  <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">Markdown 리포트</h3>
                      <button
                        onClick={handleCopyReport}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {reportCopied ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            복사됨!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            복사
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap font-mono bg-black/30 p-3 rounded max-h-64 overflow-y-auto">
                      {weeklyReport.markdown}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Webhook Integration Info */}
            <div className="bg-[#1a1b23] border border-[#373A40] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Webhook className="w-5 h-5 text-gray-400" />
                웹훅 연동
              </h2>

              <div className="p-4 bg-[#0d0e12] rounded-lg border border-[#373A40] mb-4">
                <div className="flex items-start gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                  <p className="text-sm text-gray-400">
                    CMS나 블로그 시스템에서 새 글 발행 시 아래 엔드포인트로 웹훅을 전송하면 자동으로
                    색인 요청과 메타태그 생성이 실행됩니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Endpoint</p>
                    <code className="text-xs text-cyan-400 bg-black/30 px-2 py-1 rounded block">
                      POST /api/dashboard/seo/webhook
                    </code>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Request Body</p>
                    <pre className="text-xs text-gray-400 bg-black/30 p-2 rounded overflow-x-auto">
                      {`{
  "url": "https://${project?.domain}/new-post",
  "host": "${project?.domain}",
  "title": "글 제목",
  "content": "글 내용...",
  "keywords": ${JSON.stringify(keywords.slice(0, 3).map((k) => k.text))}
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <a
                href={`/api/dashboard/seo/webhook`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                API 문서 보기
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
