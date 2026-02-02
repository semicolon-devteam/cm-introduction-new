"use client";

import { Loader2, Lightbulb, Zap, HelpCircle, Flame, Link2 } from "lucide-react";

interface KeywordSuggestion {
  keyword: string;
  searchVolume: "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard";
  relevance: number;
  reason: string;
  type: "related" | "longtail" | "question" | "trending";
}

interface KeywordsSuggestionSectionProps {
  aiSuggesting: boolean;
  aiSuggestions: KeywordSuggestion[];
  aiAnalysis: string | null;
  disabled: boolean;
  onSuggest: () => void;
  onAddSuggested: (keyword: string) => void;
}

export function KeywordsSuggestionSection({
  aiSuggesting,
  aiSuggestions,
  aiAnalysis,
  disabled,
  onSuggest,
  onAddSuggested,
}: KeywordsSuggestionSectionProps) {
  const getTypeIcon = (type: KeywordSuggestion["type"]) => {
    switch (type) {
      case "related":
        return <Link2 className="w-3.5 h-3.5" />;
      case "longtail":
        return <Zap className="w-3.5 h-3.5" />;
      case "question":
        return <HelpCircle className="w-3.5 h-3.5" />;
      case "trending":
        return <Flame className="w-3.5 h-3.5" />;
    }
  };

  const getTypeLabel = (type: KeywordSuggestion["type"]) => {
    switch (type) {
      case "related":
        return "연관";
      case "longtail":
        return "롱테일";
      case "question":
        return "질문형";
      case "trending":
        return "트렌드";
    }
  };

  const getVolumeColor = (volume: KeywordSuggestion["searchVolume"]) => {
    switch (volume) {
      case "high":
        return "text-emerald-400";
      case "medium":
        return "text-amber-400";
      case "low":
        return "text-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: KeywordSuggestion["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "text-emerald-400";
      case "medium":
        return "text-amber-400";
      case "hard":
        return "text-red-400";
    }
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-medium">AI 키워드 추천</h3>
        </div>
        <button
          onClick={onSuggest}
          disabled={aiSuggesting || disabled}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {aiSuggesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              키워드 추천받기
            </>
          )}
        </button>
      </div>

      {aiAnalysis && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-200">{aiAnalysis}</p>
        </div>
      )}

      {aiSuggestions.length > 0 && (
        <div className="space-y-2">
          {aiSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="bg-[#25262b] rounded-lg p-3 hover:bg-[#2a2b33] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{suggestion.keyword}</span>
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-[#1a1b23] ${
                        suggestion.type === "trending"
                          ? "text-red-400"
                          : suggestion.type === "question"
                            ? "text-blue-400"
                            : suggestion.type === "longtail"
                              ? "text-purple-400"
                              : "text-gray-400"
                      }`}
                    >
                      {getTypeIcon(suggestion.type)}
                      {getTypeLabel(suggestion.type)}
                    </span>
                  </div>
                  <p className="text-xs text-[#909296] mb-2">{suggestion.reason}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#5c5f66]">
                      검색량:{" "}
                      <span className={getVolumeColor(suggestion.searchVolume)}>
                        {suggestion.searchVolume === "high"
                          ? "높음"
                          : suggestion.searchVolume === "medium"
                            ? "중간"
                            : "낮음"}
                      </span>
                    </span>
                    <span className="text-[#5c5f66]">
                      난이도:{" "}
                      <span className={getDifficultyColor(suggestion.difficulty)}>
                        {suggestion.difficulty === "easy"
                          ? "쉬움"
                          : suggestion.difficulty === "medium"
                            ? "보통"
                            : "어려움"}
                      </span>
                    </span>
                    <span className="text-[#5c5f66]">
                      관련도: <span className="text-brand-primary">{suggestion.relevance}%</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onAddSuggested(suggestion.keyword)}
                  className="ml-3 px-3 py-1.5 text-xs bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 transition-colors whitespace-nowrap"
                >
                  + 추가
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!aiSuggestions.length && !aiSuggesting && !aiAnalysis && (
        <p className="text-sm text-[#5c5f66]">
          현재 키워드를 기반으로 AI가 관련 키워드, 롱테일, 질문형, 트렌드 키워드를 추천합니다.
        </p>
      )}
    </div>
  );
}
