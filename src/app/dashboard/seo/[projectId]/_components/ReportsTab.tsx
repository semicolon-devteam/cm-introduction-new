"use client";

import { useState } from "react";
import { FileText, Loader2, Copy, Check, Sparkles } from "lucide-react";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface SearchConsoleData {
  overview?: {
    current: { clicks: number; impressions: number; ctr: number; position: number };
  };
  topQueries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
  }>;
}

interface AnalyticsData {
  connected: boolean;
  metrics?: {
    activeUsers: { value: number; changePercent?: number };
    sessions: { value: number; changePercent?: number };
    bounceRate: { value: number; changePercent?: number };
  };
}

interface ReportsTabProps {
  site: SEOSite;
  keywords: string[];
  searchConsoleData: SearchConsoleData | null;
  analyticsData: AnalyticsData | null;
}

export function ReportsTab({ site, keywords, searchConsoleData, analyticsData }: ReportsTabProps) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<{
    markdown: string;
    aiInsights?: {
      summary: string;
      highlights: string[];
      concerns: string[];
      recommendations: { priority: string; action: string; expectedImpact: string }[];
      nextWeekFocus: string;
    };
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    setReport(null);

    try {
      const response = await fetch("/api/dashboard/seo/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: site.id,
          domain: site.domain,
          keywords,
          searchConsoleData: searchConsoleData?.overview?.current
            ? {
                clicks: searchConsoleData.overview.current.clicks,
                impressions: searchConsoleData.overview.current.impressions,
                ctr: searchConsoleData.overview.current.ctr / 100,
                position: searchConsoleData.overview.current.position,
                topQueries: searchConsoleData.topQueries,
              }
            : null,
          analyticsData: analyticsData?.metrics
            ? {
                users: analyticsData.metrics.activeUsers.value,
                sessions: analyticsData.metrics.sessions.value,
                pageviews: analyticsData.metrics.sessions.value, // sessions as proxy for pageviews
                bounceRate: analyticsData.metrics.bounceRate.value,
              }
            : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReport({
          markdown: data.report.markdown,
          aiInsights: data.report.aiInsights,
        });
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("리포트 생성 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!report?.markdown) return;
    void navigator.clipboard.writeText(report.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 리포트 생성 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-medium">주간 SEO 리포트</h3>
          </div>
          <button
            onClick={() => void handleGenerateReport()}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                리포트 생성
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-[#909296]">
          Search Console 데이터와 키워드를 기반으로 AI가 주간 SEO 성과 리포트를 생성합니다.
        </p>
      </div>

      {/* AI 인사이트 */}
      {report?.aiInsights && (
        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-medium">AI 인사이트</h3>
          </div>

          <div className="space-y-4">
            {/* 요약 */}
            <div className="bg-[#25262b] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">요약</h4>
              <p className="text-sm text-[#909296]">{report.aiInsights.summary}</p>
            </div>

            {/* 하이라이트 */}
            {report.aiInsights.highlights.length > 0 && (
              <div className="bg-emerald-500/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-emerald-400 mb-2">주요 성과</h4>
                <ul className="space-y-1">
                  {report.aiInsights.highlights.map((h, idx) => (
                    <li key={idx} className="text-sm text-[#909296]">
                      • {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 우려사항 */}
            {report.aiInsights.concerns.length > 0 && (
              <div className="bg-amber-500/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-amber-400 mb-2">개선 필요</h4>
                <ul className="space-y-1">
                  {report.aiInsights.concerns.map((c, idx) => (
                    <li key={idx} className="text-sm text-[#909296]">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 추천 */}
            {report.aiInsights.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">실행 추천</h4>
                {report.aiInsights.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-[#25262b] rounded-lg p-3 flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        rec.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : rec.priority === "medium"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {rec.priority === "high"
                        ? "높음"
                        : rec.priority === "medium"
                          ? "중간"
                          : "낮음"}
                    </span>
                    <div>
                      <p className="text-sm text-white">{rec.action}</p>
                      <p className="text-xs text-[#5c5f66] mt-1">예상 효과: {rec.expectedImpact}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 다음 주 포커스 */}
            {report.aiInsights.nextWeekFocus && (
              <div className="bg-brand-primary/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-brand-primary mb-2">다음 주 집중 사항</h4>
                <p className="text-sm text-[#909296]">{report.aiInsights.nextWeekFocus}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 마크다운 리포트 */}
      {report?.markdown && (
        <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">리포트 내용</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm text-brand-primary hover:text-brand-primary/80"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "복사됨" : "복사"}
            </button>
          </div>

          <div className="bg-[#25262b] rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-[#909296] whitespace-pre-wrap font-sans">
              {report.markdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
