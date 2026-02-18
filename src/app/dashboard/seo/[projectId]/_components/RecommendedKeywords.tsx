"use client";

import { TrendingUp } from "lucide-react";

interface SearchConsoleQuery {
  query: string;
  clicks: number;
  impressions: number;
}

interface RecommendedKeywordsProps {
  queries: SearchConsoleQuery[];
  onAdd: (query: string) => void;
}

export function RecommendedKeywords({ queries, onAdd }: RecommendedKeywordsProps) {
  if (queries.length === 0) return null;

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-medium">Search Console 추천 키워드</h3>
      </div>
      <div className="space-y-2">
        {queries.map((query, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-[#25262b] rounded-lg">
            <div>
              <span className="text-white text-sm">{query.query}</span>
              <div className="flex items-center gap-3 mt-1 text-xs text-[#5c5f66]">
                <span>클릭: {query.clicks}</span>
                <span>노출: {query.impressions}</span>
              </div>
            </div>
            <button
              onClick={() => onAdd(query.query)}
              className="px-3 py-1.5 text-xs bg-brand-primary/20 text-brand-primary rounded hover:bg-brand-primary/30 transition-colors"
            >
              추가
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
