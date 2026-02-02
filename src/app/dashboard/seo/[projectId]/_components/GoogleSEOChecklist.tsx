"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  MousePointer,
  Eye,
  Search,
  BarChart3,
} from "lucide-react";

interface GoogleCheckItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: "pass" | "warning" | "fail" | "unknown";
  priority: "high" | "medium" | "low";
  howToFix?: string;
  data?: Record<string, unknown>;
}

interface SearchConsoleData {
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  topQueries: { query: string; clicks: number; impressions: number }[];
}

interface GoogleSEOChecklistProps {
  domain: string;
}

export function GoogleSEOChecklist({ domain }: GoogleSEOChecklistProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    items: GoogleCheckItem[];
    recommendations: string[];
    searchConsoleData?: SearchConsoleData;
    searchConsoleConnected: boolean;
  } | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/dashboard/seo/google-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("Google SEO 체크 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: GoogleCheckItem["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "fail":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-[#5c5f66]" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const categoryLabels: Record<string, string> = {
    basic: "기본 설정",
    technical: "기술적 SEO",
    content: "콘텐츠",
    mobile: "모바일 최적화",
    structured: "구조화 데이터",
    "search-console": "Search Console",
  };

  const categorizedItems = result?.items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, GoogleCheckItem[]>,
  );

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#4285F4] rounded flex items-center justify-center text-white text-xs font-bold">
            G
          </div>
          <h3 className="text-white font-medium">Google SEO 체크리스트</h3>
        </div>
        <button
          onClick={() => void handleCheck()}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#4285F4] text-white rounded hover:bg-[#3367D6] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {result ? "다시 체크" : "체크 시작"}
        </button>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* Score & Search Console Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-[#25262b] rounded-lg">
              <div>
                <p className="text-sm text-[#909296]">Google SEO 점수</p>
                <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </p>
              </div>
              <div className="text-right text-xs text-[#5c5f66]">
                <p>통과: {result.items.filter((i) => i.status === "pass").length}</p>
                <p>경고: {result.items.filter((i) => i.status === "warning").length}</p>
                <p>실패: {result.items.filter((i) => i.status === "fail").length}</p>
              </div>
            </div>

            {result.searchConsoleConnected && result.searchConsoleData && (
              <div className="p-4 bg-[#25262b] rounded-lg">
                <p className="text-xs text-[#909296] mb-2">Search Console (최근 28일)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <MousePointer className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-white">
                      {result.searchConsoleData.clicks.toLocaleString()} 클릭
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-white">
                      {result.searchConsoleData.impressions.toLocaleString()} 노출
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-white">
                      CTR {result.searchConsoleData.ctr.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-white">
                      평균 {result.searchConsoleData.position.toFixed(1)}위
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!result.searchConsoleConnected && (
              <div className="p-4 bg-[#25262b] rounded-lg border border-dashed border-[#373A40]">
                <p className="text-xs text-[#909296] mb-2">Search Console 미연동</p>
                <p className="text-xs text-[#5c5f66]">
                  환경변수 설정 후 실시간 검색 데이터를 확인할 수 있습니다.
                </p>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 mt-2 text-xs text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Search Console 바로가기
                </a>
              </div>
            )}
          </div>

          {/* Top Queries */}
          {result.searchConsoleData?.topQueries &&
            result.searchConsoleData.topQueries.length > 0 && (
              <div className="bg-[#25262b] rounded-lg p-3">
                <p className="text-xs text-[#909296] mb-2 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  인기 검색어 TOP 5
                </p>
                <div className="space-y-1">
                  {result.searchConsoleData.topQueries.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#373A40] last:border-0"
                    >
                      <span className="text-white truncate flex-1">{q.query}</span>
                      <span className="text-[#5c5f66] ml-2">{q.clicks} 클릭</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-[#4285F4]/10 border border-[#4285F4]/30 rounded-lg p-3">
              <p className="text-xs text-[#4285F4] font-medium mb-2">AI 추천</p>
              <ul className="space-y-1">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-[#909296]">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Categorized Items */}
          {categorizedItems &&
            Object.entries(categorizedItems).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs text-[#5c5f66] font-medium mb-2">
                  {categoryLabels[category] || category}
                </p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded border ${
                        item.status === "pass"
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : item.status === "fail"
                            ? "bg-red-500/5 border-red-500/20"
                            : item.status === "warning"
                              ? "bg-amber-500/5 border-amber-500/20"
                              : "bg-[#25262b] border-[#373A40]"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <p className="text-sm text-white">{item.title}</p>
                          <p className="text-xs text-[#909296] mt-0.5">{item.description}</p>
                          {item.howToFix && item.status !== "pass" && (
                            <div className="mt-2 text-xs">
                              {item.howToFix.startsWith("http") ? (
                                <a
                                  href={item.howToFix}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-400 hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  해결 방법 보기
                                </a>
                              ) : (
                                <p className="text-cyan-400">💡 {item.howToFix}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#5c5f66]">
          <div className="w-10 h-10 mx-auto mb-2 bg-[#4285F4]/20 rounded-lg flex items-center justify-center">
            <span className="text-[#4285F4] font-bold">G</span>
          </div>
          <p className="text-sm">Google 검색 최적화 상태를 확인합니다</p>
          <p className="text-xs mt-1">메타태그, 구조화 데이터, Search Console 등을 점검합니다</p>
        </div>
      )}
    </div>
  );
}
