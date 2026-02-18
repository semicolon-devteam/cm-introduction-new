"use client";

import { useState } from "react";
import {
  Loader2,
  RefreshCw,
  Link2,
  Link2Off,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface LinkCheckResult {
  url: string;
  status: number | null;
  statusText: string;
  type: "internal" | "external";
  isWorking: boolean;
  redirectTo?: string;
  error?: string;
}

interface BrokenLinksResult {
  domain: string;
  totalLinks: number;
  workingLinks: number;
  brokenLinks: number;
  redirectLinks: number;
  links: LinkCheckResult[];
  checkedAt: string;
}

interface BrokenLinkCheckerProps {
  domain: string;
}

export function BrokenLinkChecker({ domain }: BrokenLinkCheckerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrokenLinksResult | null>(null);
  const [filter, setFilter] = useState<"all" | "broken" | "redirect" | "working">("all");

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/dashboard/seo/broken-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, maxLinks: 100 }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("링크 체크 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (link: LinkCheckResult) => {
    if (!link.isWorking) return "text-red-400";
    if (link.redirectTo) return "text-amber-400";
    return "text-emerald-400";
  };

  const getStatusIcon = (link: LinkCheckResult) => {
    if (!link.isWorking) return <XCircle className="w-4 h-4 text-red-400" />;
    if (link.redirectTo) return <ArrowRight className="w-4 h-4 text-amber-400" />;
    return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  };

  const getStatusBadge = (link: LinkCheckResult) => {
    if (!link.isWorking) {
      return (
        <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
          {link.status || "ERR"}
        </span>
      );
    }
    if (link.redirectTo) {
      return (
        <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded">
          {link.status}
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded">
        {link.status}
      </span>
    );
  };

  const filteredLinks = result?.links.filter((link) => {
    switch (filter) {
      case "broken":
        return !link.isWorking;
      case "redirect":
        return link.redirectTo;
      case "working":
        return link.isWorking && !link.redirectTo;
      default:
        return true;
    }
  });

  const healthScore = result ? Math.round((result.workingLinks / result.totalLinks) * 100) : 0;

  const getHealthColor = (score: number) => {
    if (score >= 95) return "text-emerald-400";
    if (score >= 80) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2Off className="w-5 h-5 text-rose-400" />
          <h3 className="text-white font-medium">깨진 링크 체커</h3>
        </div>
        <button
          onClick={() => void handleCheck()}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {result ? "다시 체크" : "링크 체크"}
        </button>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* 요약 통계 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-[#25262b] rounded-lg text-center">
              <p className="text-2xl font-bold text-white">{result.totalLinks}</p>
              <p className="text-xs text-[#909296]">전체 링크</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-400">{result.workingLinks}</p>
              <p className="text-xs text-emerald-400/70">정상</p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-400">{result.redirectLinks}</p>
              <p className="text-xs text-amber-400/70">리다이렉트</p>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-400">{result.brokenLinks}</p>
              <p className="text-xs text-red-400/70">깨진 링크</p>
            </div>
          </div>

          {/* 링크 건강도 */}
          <div className="flex items-center gap-3 p-3 bg-[#25262b] rounded-lg">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#909296]">링크 건강도</span>
                <span className={`text-sm font-bold ${getHealthColor(healthScore)}`}>
                  {healthScore}%
                </span>
              </div>
              <div className="h-2 bg-[#373A40] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    healthScore >= 95
                      ? "bg-emerald-500"
                      : healthScore >= 80
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            {[
              { key: "all", label: `전체 (${result.totalLinks})` },
              { key: "broken", label: `깨진 (${result.brokenLinks})` },
              { key: "redirect", label: `리다이렉트 (${result.redirectLinks})` },
              { key: "working", label: `정상 (${result.workingLinks})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-2 py-1 text-xs rounded ${
                  filter === key
                    ? "bg-rose-600 text-white"
                    : "bg-[#25262b] text-[#909296] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 링크 목록 */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredLinks?.map((link, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border ${
                  !link.isWorking
                    ? "bg-red-500/5 border-red-500/20"
                    : link.redirectTo
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-[#25262b] border-[#373A40]"
                }`}
              >
                <div className="flex items-start gap-2">
                  {getStatusIcon(link)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a
                        href={link.url.startsWith("/") ? `https://${domain}${link.url}` : link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm truncate hover:underline ${getStatusColor(link)}`}
                      >
                        {link.url}
                      </a>
                      <ExternalLink className="w-3 h-3 text-[#5c5f66] flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(link)}
                      <span className="text-xs text-[#5c5f66]">
                        {link.type === "internal" ? "내부" : "외부"} 링크
                      </span>
                      {link.error && <span className="text-xs text-red-400">{link.error}</span>}
                    </div>
                    {link.redirectTo && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                        <ArrowRight className="w-3 h-3" />
                        <span className="truncate">{link.redirectTo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 권장 조치 */}
          {result.brokenLinks > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">권장 조치</span>
              </div>
              <ul className="text-xs text-[#909296] space-y-1">
                <li>• 깨진 링크를 수정하거나 제거하세요</li>
                <li>• 301 리다이렉트 설정을 확인하세요</li>
                <li>• 외부 링크는 정기적으로 점검하세요</li>
              </ul>
            </div>
          )}

          {/* 체크 시간 */}
          <p className="text-xs text-[#5c5f66] text-right">
            체크: {new Date(result.checkedAt).toLocaleString("ko-KR")}
          </p>
        </div>
      ) : (
        <div className="text-center py-8 text-[#5c5f66]">
          <Link2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">사이트의 모든 링크를 검사합니다</p>
          <p className="text-xs mt-1">깨진 링크, 리다이렉트, 외부 링크 상태를 확인합니다</p>
        </div>
      )}
    </div>
  );
}
