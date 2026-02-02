"use client";

import { useState } from "react";
import { Users, Loader2, Globe, Plus, ExternalLink } from "lucide-react";

interface CompetitorKeyword {
  keyword: string;
  frequency: number;
  inTitle: boolean;
  inH1: boolean;
  importance: "high" | "medium" | "low";
}

interface CompetitorAnalysisResult {
  url: string;
  domain: string;
  meta: { title: string | null; description: string | null };
  keywords: CompetitorKeyword[];
  topKeywords: string[];
  contentSummary: {
    wordCount: number;
    h1Count: number;
    imageCount: number;
  };
  aiAnalysis?: {
    strengths: string[];
    opportunities: string[];
    suggestedKeywords: string[];
  };
}

interface CompetitorAnalyzerProps {
  myKeywords: string[];
  onAddKeyword: (keyword: string) => void;
}

export function CompetitorAnalyzer({ myKeywords, onAddKeyword }: CompetitorAnalyzerProps) {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CompetitorAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      alert("경쟁사 URL을 입력해주세요.");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/competitor-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, myKeywords }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("경쟁사 분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-amber-500/20 text-amber-400";
      default:
        return "bg-[#373A40] text-[#909296]";
    }
  };

  const isKeywordAdded = (keyword: string) =>
    myKeywords.some((k) => k.toLowerCase() === keyword.toLowerCase());

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-rose-400" />
        <h3 className="text-white font-medium">경쟁사 키워드 분석</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg">
          <Globe className="w-4 h-4 text-[#5c5f66]" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="경쟁사 URL (예: competitor.com)"
            className="flex-1 bg-transparent text-white placeholder-[#5c5f66] focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={() => void handleAnalyze()}
          disabled={analyzing}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors text-sm"
        >
          {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "분석"}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* 기본 정보 */}
          <div className="bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{result.domain}</span>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-primary hover:underline flex items-center gap-1"
              >
                방문 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {result.meta.title && (
              <p className="text-xs text-[#909296] truncate">{result.meta.title}</p>
            )}
            <div className="flex gap-4 mt-2 text-xs text-[#5c5f66]">
              <span>{result.contentSummary.wordCount}단어</span>
              <span>H1: {result.contentSummary.h1Count}개</span>
              <span>이미지: {result.contentSummary.imageCount}개</span>
            </div>
          </div>

          {/* 추출된 키워드 */}
          <div>
            <p className="text-sm text-[#909296] font-medium mb-2">
              추출된 키워드 ({result.keywords.length}개)
            </p>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {result.keywords.slice(0, 20).map((kw, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getImportanceColor(kw.importance)}`}
                >
                  <span>{kw.keyword}</span>
                  <span className="opacity-60">({kw.frequency})</span>
                  {!isKeywordAdded(kw.keyword) && (
                    <button
                      onClick={() => onAddKeyword(kw.keyword)}
                      className="ml-1 hover:text-white"
                      title="내 키워드에 추가"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI 분석 */}
          {result.aiAnalysis && (
            <div className="space-y-3">
              {result.aiAnalysis.strengths.length > 0 && (
                <div className="bg-[#25262b] rounded p-3">
                  <p className="text-xs text-rose-400 font-medium mb-1">경쟁사 강점</p>
                  <ul className="space-y-1">
                    {result.aiAnalysis.strengths.map((s, idx) => (
                      <li key={idx} className="text-xs text-[#909296]">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.aiAnalysis.opportunities.length > 0 && (
                <div className="bg-[#25262b] rounded p-3">
                  <p className="text-xs text-emerald-400 font-medium mb-1">공략 기회</p>
                  <ul className="space-y-1">
                    {result.aiAnalysis.opportunities.map((o, idx) => (
                      <li key={idx} className="text-xs text-[#909296]">
                        • {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.aiAnalysis.suggestedKeywords.length > 0 && (
                <div className="bg-[#25262b] rounded p-3">
                  <p className="text-xs text-blue-400 font-medium mb-2">추천 키워드</p>
                  <div className="flex flex-wrap gap-2">
                    {result.aiAnalysis.suggestedKeywords.map((kw, idx) => (
                      <button
                        key={idx}
                        onClick={() => onAddKeyword(kw)}
                        disabled={isKeywordAdded(kw)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
