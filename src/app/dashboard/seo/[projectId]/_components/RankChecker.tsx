"use client";

import { useState } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RankingResult {
  keyword: string;
  google?: { rank: number | null; url: string | null; title: string | null };
  naver?: { rank: number | null; url: string | null; title: string | null };
  checkedAt: string;
}

interface RankCheckerProps {
  domain: string;
  keywords: string[];
}

export function RankChecker({ domain, keywords }: RankCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<RankingResult[]>([]);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const handleCheck = async () => {
    if (keywords.length === 0) {
      alert("키워드를 먼저 등록해주세요.");
      return;
    }

    setChecking(true);
    try {
      const response = await fetch("/api/dashboard/seo/rank-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, domain }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.results);
        setLastChecked(new Date().toLocaleString("ko-KR"));
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("순위 체크 중 오류가 발생했습니다.");
    } finally {
      setChecking(false);
    }
  };

  const getRankDisplay = (rank: number | null | undefined) => {
    if (rank === null || rank === undefined) {
      return <span className="text-[#5c5f66]">-</span>;
    }
    if (rank <= 10) {
      return (
        <span className="flex items-center gap-1 text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          {rank}위
        </span>
      );
    }
    if (rank <= 30) {
      return (
        <span className="flex items-center gap-1 text-amber-400">
          <Minus className="w-3 h-3" />
          {rank}위
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-red-400">
        <TrendingDown className="w-3 h-3" />
        {rank}위
      </span>
    );
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-medium">키워드 순위 추적</h3>
        </div>
        <button
          onClick={() => void handleCheck()}
          disabled={checking || keywords.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors text-sm"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              체크 중...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              순위 체크
            </>
          )}
        </button>
      </div>

      {lastChecked && <p className="text-xs text-[#5c5f66] mb-3">마지막 체크: {lastChecked}</p>}

      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#373A40]">
                <th className="text-left py-2 text-[#909296] font-medium">키워드</th>
                <th className="text-center py-2 text-[#909296] font-medium">Google</th>
                <th className="text-center py-2 text-[#909296] font-medium">Naver</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} className="border-b border-[#373A40]/50">
                  <td className="py-3 text-white">{result.keyword}</td>
                  <td className="py-3 text-center">{getRankDisplay(result.google?.rank)}</td>
                  <td className="py-3 text-center">{getRankDisplay(result.naver?.rank)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-[#5c5f66]">
          {keywords.length > 0
            ? "순위 체크 버튼을 클릭하여 키워드 순위를 확인하세요."
            : "키워드 탭에서 키워드를 먼저 등록해주세요."}
        </p>
      )}
    </div>
  );
}
