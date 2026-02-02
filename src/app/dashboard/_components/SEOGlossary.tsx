"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Tag,
  Settings,
  FileText,
  BarChart2,
  Info,
  Lightbulb,
} from "lucide-react";

interface SEOTerm {
  id: string;
  term: string;
  termEn: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
  category: "basic" | "technical" | "content" | "analytics";
}

interface SEOGlossaryProps {
  className?: string;
  initialCategory?: string;
  compact?: boolean;
}

const CATEGORY_CONFIG = {
  basic: {
    label: "기본 개념",
    icon: BookOpen,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
  technical: {
    label: "기술적 SEO",
    icon: Settings,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  content: {
    label: "콘텐츠 SEO",
    icon: FileText,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  analytics: {
    label: "분석/측정",
    icon: BarChart2,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
};

export function SEOGlossary({
  className = "",
  initialCategory,
  compact = false,
}: SEOGlossaryProps) {
  const [glossary, setGlossary] = useState<SEOTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  // 용어 사전 로드
  const loadGlossary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/seo/onboarding");
      const data = await response.json();

      if (data.success && data.glossary) {
        setGlossary(data.glossary);
      }
    } catch (error) {
      console.error("Failed to load glossary:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGlossary();
  }, [loadGlossary]);

  // 필터링된 용어
  const filteredTerms = useMemo(() => {
    let filtered = glossary;

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter((term) => term.category === selectedCategory);
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.termEn.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [glossary, selectedCategory, searchQuery]);

  // 카테고리별 그룹
  const groupedTerms = useMemo(() => {
    if (selectedCategory) {
      return { [selectedCategory]: filteredTerms };
    }

    return filteredTerms.reduce(
      (acc, term) => {
        if (!acc[term.category]) {
          acc[term.category] = [];
        }
        acc[term.category].push(term);
        return acc;
      },
      {} as Record<string, SEOTerm[]>,
    );
  }, [filteredTerms, selectedCategory]);

  // 관련 용어 클릭
  const handleRelatedTermClick = (termName: string) => {
    const found = glossary.find(
      (t) => t.term === termName || t.termEn.toLowerCase() === termName.toLowerCase(),
    );
    if (found) {
      setExpandedTerm(found.id);
      setSelectedCategory(null);
      setSearchQuery("");
    }
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
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 border-b border-[#373A40]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-white">SEO 용어 사전</h2>
          <span className="text-xs text-gray-500 ml-1">({glossary.length}개)</span>
        </div>
      </div>

      {/* 검색 & 필터 */}
      <div className="p-4 border-b border-[#373A40] space-y-3">
        {/* 검색 */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="용어 검색..."
            className="w-full pl-10 pr-4 py-2 bg-[#0d0e12] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 text-sm"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
              !selectedCategory
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                : "bg-[#25262b] border-[#373A40] text-gray-400 hover:border-[#4a4b53]"
            }`}
          >
            전체
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                className={`px-3 py-1 text-xs rounded-lg border transition-colors flex items-center gap-1 ${
                  selectedCategory === key
                    ? config.color
                    : "bg-[#25262b] border-[#373A40] text-gray-400 hover:border-[#4a4b53]"
                }`}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 용어 목록 */}
      <div className={`p-4 space-y-4 ${compact ? "max-h-96 overflow-y-auto" : ""}`}>
        {filteredTerms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          Object.entries(groupedTerms).map(([category, terms]) => (
            <div key={category}>
              {/* 카테고리 헤더 (전체 보기시만) */}
              {!selectedCategory && (
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                    const Icon = config?.icon || BookOpen;
                    return (
                      <>
                        <Icon
                          className={`w-4 h-4 ${config?.color.split(" ")[0] || "text-gray-400"}`}
                        />
                        <h3 className="text-sm font-medium text-white">
                          {config?.label || category}
                        </h3>
                        <span className="text-xs text-gray-500">({terms.length})</span>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* 용어 카드들 */}
              <div className="space-y-2">
                {terms.map((term) => {
                  const isExpanded = expandedTerm === term.id;
                  const config = CATEGORY_CONFIG[term.category];

                  return (
                    <div
                      key={term.id}
                      className={`border rounded-lg overflow-hidden transition-colors ${
                        isExpanded ? "border-cyan-500/30" : "border-[#373A40]"
                      }`}
                    >
                      {/* 용어 헤더 */}
                      <button
                        onClick={() => setExpandedTerm(isExpanded ? null : term.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-[#25262b] transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 text-xs rounded border ${config.color}`}>
                            {config.label.slice(0, 2)}
                          </span>
                          <span className="text-sm font-medium text-white">{term.term}</span>
                          <span className="text-xs text-gray-500">({term.termEn})</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {/* 용어 상세 */}
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-[#373A40] bg-[#25262b]/50">
                          {/* 정의 */}
                          <div>
                            <p className="text-sm text-gray-300">{term.definition}</p>
                          </div>

                          {/* 예시 */}
                          {term.example && (
                            <div className="flex items-start gap-2 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded">
                              <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-cyan-300">{term.example}</p>
                            </div>
                          )}

                          {/* 관련 용어 */}
                          {term.relatedTerms && term.relatedTerms.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">관련 용어:</p>
                              <div className="flex flex-wrap gap-1">
                                {term.relatedTerms.map((related) => (
                                  <button
                                    key={related}
                                    onClick={() => handleRelatedTermClick(related)}
                                    className="px-2 py-0.5 text-xs bg-[#1a1b23] border border-[#373A40] rounded text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                                  >
                                    {related}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 푸터 */}
      <div className="px-4 py-3 border-t border-[#373A40] bg-[#0d0e12]">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">
            <Info className="w-3 h-3 inline mr-1" />
            용어를 클릭하면 상세 설명을 볼 수 있습니다
          </p>
          <a
            href="https://developers.google.com/search/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            Google SEO 가이드
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default SEOGlossary;
