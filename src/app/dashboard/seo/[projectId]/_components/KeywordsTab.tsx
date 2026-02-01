"use client";

import { useState, useEffect } from "react";
import { Plus, X, Sparkles, Loader2, TrendingUp } from "lucide-react";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface Keyword {
  id: string;
  text: string;
  type: "main" | "sub";
  createdAt: string;
}

interface SearchConsoleData {
  topQueries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
  }>;
}

interface KeywordsTabProps {
  site: SEOSite;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  searchConsoleData: SearchConsoleData | null;
}

export function KeywordsTab({
  site,
  keywords: _keywords,
  setKeywords,
  searchConsoleData,
}: KeywordsTabProps) {
  const [keywordItems, setKeywordItems] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Load keywords from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`seo-keywords-${site.id}`);
    if (saved) {
      setKeywordItems(JSON.parse(saved));
    }
  }, [site.id]);

  // Save keywords
  const saveKeywords = (items: Keyword[]) => {
    setKeywordItems(items);
    localStorage.setItem(`seo-keywords-${site.id}`, JSON.stringify(items));
    setKeywords(items.map((k) => k.text));
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

    saveKeywords([...keywordItems, keyword]);
    setNewKeyword("");
  };

  // Remove keyword
  const handleRemoveKeyword = (id: string) => {
    saveKeywords(keywordItems.filter((k) => k.id !== id));
  };

  // Add recommended keyword
  const handleAddRecommended = (query: string) => {
    if (keywordItems.some((k) => k.text === query)) return;

    const keyword: Keyword = {
      id: Date.now().toString(),
      text: query,
      type: "sub",
      createdAt: new Date().toISOString(),
    };

    saveKeywords([...keywordItems, keyword]);
  };

  // AI Optimize
  const handleAiOptimize = async () => {
    if (keywordItems.length === 0) {
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
          projectId: site.id,
          domain: site.domain,
          keywords: keywordItems.map((k) => k.text),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResult(data.result);
      } else {
        setAiResult(`오류: ${data.error}`);
      }
    } catch {
      setAiResult("AI 최적화 실행 중 오류가 발생했습니다.");
    } finally {
      setAiOptimizing(false);
    }
  };

  // Get recommended keywords from Search Console
  const recommendedKeywords =
    searchConsoleData?.topQueries
      ?.filter((q) => !keywordItems.some((k) => k.text.toLowerCase() === q.query.toLowerCase()))
      .slice(0, 10) || [];

  return (
    <div className="space-y-6">
      {/* 키워드 입력 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <h3 className="text-white font-medium mb-4">키워드 관리</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
            placeholder="새 키워드 입력"
            className="flex-1 px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
          />
          <button
            onClick={handleAddKeyword}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 등록된 키워드 */}
        <div className="flex flex-wrap gap-2">
          {keywordItems.map((keyword) => (
            <div
              key={keyword.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                keyword.type === "main"
                  ? "bg-brand-primary/20 text-brand-primary"
                  : "bg-[#25262b] text-[#909296]"
              }`}
            >
              <span>{keyword.text}</span>
              <button
                onClick={() => handleRemoveKeyword(keyword.id)}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {keywordItems.length === 0 && (
            <p className="text-sm text-[#5c5f66]">등록된 키워드가 없습니다.</p>
          )}
        </div>
      </div>

      {/* AI SEO 최적화 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-medium">AI SEO 최적화</h3>
          </div>
          <button
            onClick={() => void handleAiOptimize()}
            disabled={aiOptimizing || keywordItems.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {aiOptimizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI 분석 실행
              </>
            )}
          </button>
        </div>

        {aiResult && (
          <div className="bg-[#25262b] rounded-lg p-4">
            <pre className="text-sm text-[#909296] whitespace-pre-wrap font-sans">{aiResult}</pre>
          </div>
        )}

        {!aiResult && !aiOptimizing && (
          <p className="text-sm text-[#5c5f66]">
            등록된 키워드를 기반으로 AI가 SEO 최적화 추천을 제공합니다.
          </p>
        )}
      </div>

      {/* 추천 키워드 */}
      {recommendedKeywords.length > 0 && (
        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-medium">Search Console 추천 키워드</h3>
          </div>

          <div className="space-y-2">
            {recommendedKeywords.map((query, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#25262b] rounded-lg"
              >
                <div>
                  <span className="text-white text-sm">{query.query}</span>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#5c5f66]">
                    <span>클릭: {query.clicks}</span>
                    <span>노출: {query.impressions}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddRecommended(query.query)}
                  className="px-3 py-1.5 text-xs bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 transition-colors"
                >
                  추가
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
