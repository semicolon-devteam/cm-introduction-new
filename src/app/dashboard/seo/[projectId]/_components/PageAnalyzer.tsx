"use client";

import { useState } from "react";
import {
  FileSearch,
  Loader2,
  Globe,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";

interface SEOIssue {
  type: "error" | "warning" | "info";
  category: string;
  message: string;
  suggestion: string;
}

interface PageAnalysisResult {
  url: string;
  score: number;
  issues: SEOIssue[];
  meta: {
    title: string | null;
    titleLength: number;
    description: string | null;
    descriptionLength: number;
  };
  content: {
    h1Count: number;
    wordCount: number;
    imageCount: number;
    imagesWithoutAlt: number;
  };
  aiSuggestions?: string[];
}

interface PageAnalyzerProps {
  domain: string;
}

export function PageAnalyzer({ domain }: PageAnalyzerProps) {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PageAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    const targetUrl = url.startsWith("http")
      ? url
      : `https://${domain}${url.startsWith("/") ? url : `/${url}`}`;

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/page-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("페이지 분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/20";
    if (score >= 60) return "bg-amber-500/20";
    return "bg-red-500/20";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileSearch className="w-5 h-5 text-cyan-400" />
        <h3 className="text-white font-medium">페이지 SEO 분석</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg">
          <Globe className="w-4 h-4 text-[#5c5f66]" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="분석할 페이지 URL 또는 경로"
            className="flex-1 bg-transparent text-white placeholder-[#5c5f66] focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={() => void handleAnalyze()}
          disabled={analyzing}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 transition-colors text-sm"
        >
          {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "분석"}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Score */}
          <div
            className={`flex items-center justify-between p-4 rounded-lg ${getScoreBg(result.score)}`}
          >
            <div>
              <p className="text-sm text-[#909296]">SEO 점수</p>
              <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#5c5f66]">{result.url}</p>
              <div className="flex items-center gap-2 mt-1">
                {result.score >= 80 && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                <span className={`text-sm ${getScoreColor(result.score)}`}>
                  {result.score >= 80 ? "양호" : result.score >= 60 ? "개선 필요" : "심각"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#25262b] rounded p-2 text-center">
              <p className="text-lg font-bold text-white">{result.meta.titleLength}</p>
              <p className="text-xs text-[#5c5f66]">제목 길이</p>
            </div>
            <div className="bg-[#25262b] rounded p-2 text-center">
              <p className="text-lg font-bold text-white">{result.content.h1Count}</p>
              <p className="text-xs text-[#5c5f66]">H1 태그</p>
            </div>
            <div className="bg-[#25262b] rounded p-2 text-center">
              <p className="text-lg font-bold text-white">{result.content.wordCount}</p>
              <p className="text-xs text-[#5c5f66]">단어 수</p>
            </div>
            <div className="bg-[#25262b] rounded p-2 text-center">
              <p className="text-lg font-bold text-white">{result.content.imageCount}</p>
              <p className="text-xs text-[#5c5f66]">이미지</p>
            </div>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-[#909296] font-medium">
                발견된 이슈 ({result.issues.length}개)
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {result.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-[#25262b] rounded text-sm"
                  >
                    {getIssueIcon(issue.type)}
                    <div>
                      <p className="text-white">{issue.message}</p>
                      <p className="text-xs text-[#5c5f66] mt-1">{issue.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {result.aiSuggestions && result.aiSuggestions.length > 0 && (
            <div className="bg-[#25262b] rounded-lg p-4">
              <p className="text-sm text-cyan-400 font-medium mb-2">AI 개선 제안</p>
              <ul className="space-y-1">
                {result.aiSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-xs text-[#909296]">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
