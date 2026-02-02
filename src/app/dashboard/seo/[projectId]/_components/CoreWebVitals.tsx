"use client";

import { useState } from "react";
import {
  Loader2,
  RefreshCw,
  Gauge,
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface CoreWebVitalsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  rating: "good" | "needs-improvement" | "poor";
  description: string;
  threshold: { good: number; poor: number };
}

interface CoreWebVitalsResult {
  url: string;
  strategy: "mobile" | "desktop";
  performanceScore: number;
  metrics: CoreWebVitalsMetric[];
  opportunities: { id: string; title: string; description: string; savings?: string }[];
  diagnostics: { id: string; title: string; description: string }[];
  fetchedAt: string;
}

interface CoreWebVitalsProps {
  domain: string;
}

export function CoreWebVitals({ domain }: CoreWebVitalsProps) {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [result, setResult] = useState<CoreWebVitalsResult | null>(null);
  const [showOpportunities, setShowOpportunities] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/dashboard/seo/core-web-vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: domain, strategy }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("Core Web Vitals 체크 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getRatingColor = (rating: CoreWebVitalsMetric["rating"]) => {
    switch (rating) {
      case "good":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "needs-improvement":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "poor":
        return "text-red-400 bg-red-500/10 border-red-500/30";
    }
  };

  const getRatingIcon = (rating: CoreWebVitalsMetric["rating"]) => {
    switch (rating) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "needs-improvement":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "poor":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const getRatingLabel = (rating: CoreWebVitalsMetric["rating"]) => {
    switch (rating) {
      case "good":
        return "양호";
      case "needs-improvement":
        return "개선 필요";
      case "poor":
        return "나쁨";
    }
  };

  // 원형 프로그레스 바 (CSS conic-gradient)
  const CircularProgress = ({ score }: { score: number }) => {
    const progressColor = score >= 90 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
    const progressDeg = (score / 100) * 360;

    return (
      <div className="relative w-24 h-24">
        <div
          className="w-24 h-24 rounded-full"
          style={{
            background: `conic-gradient(${progressColor} ${progressDeg}deg, #373A40 ${progressDeg}deg)`,
          }}
        >
          <div className="absolute inset-2 bg-[#1a1b23] rounded-full flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-medium">Core Web Vitals</h3>
          <span className="text-xs text-[#5c5f66]">Google PageSpeed</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 전략 선택 */}
          <div className="flex bg-[#25262b] rounded-lg p-0.5">
            <button
              onClick={() => setStrategy("mobile")}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                strategy === "mobile"
                  ? "bg-violet-600 text-white"
                  : "text-[#909296] hover:text-white"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              모바일
            </button>
            <button
              onClick={() => setStrategy("desktop")}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                strategy === "desktop"
                  ? "bg-violet-600 text-white"
                  : "text-[#909296] hover:text-white"
              }`}
            >
              <Monitor className="w-3 h-3" />
              데스크톱
            </button>
          </div>
          <button
            onClick={() => void handleCheck()}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-violet-600 text-white rounded hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {result ? "다시 측정" : "측정 시작"}
          </button>
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* 성능 점수 & 핵심 메트릭 */}
          <div className="flex items-start gap-6">
            {/* 원형 점수 */}
            <div className="flex flex-col items-center">
              <CircularProgress score={result.performanceScore} />
              <p className="text-xs text-[#909296] mt-2">성능 점수</p>
            </div>

            {/* Core Web Vitals 메트릭 */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
              {result.metrics.slice(0, 6).map((metric) => (
                <div
                  key={metric.id}
                  className={`p-3 rounded-lg border ${getRatingColor(metric.rating)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#909296]">{metric.id.toUpperCase()}</span>
                    {getRatingIcon(metric.rating)}
                  </div>
                  <p className="text-lg font-bold text-white">
                    {metric.value}
                    <span className="text-sm font-normal text-[#909296]">{metric.unit}</span>
                  </p>
                  <p className="text-xs text-[#5c5f66] mt-1">
                    {getRatingLabel(metric.rating)} (≤{metric.threshold.good}
                    {metric.unit})
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 점수 범례 */}
          <div className="flex items-center gap-4 text-xs text-[#909296] bg-[#25262b] rounded-lg p-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>90-100: 양호</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>50-89: 개선 필요</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>0-49: 나쁨</span>
            </div>
          </div>

          {/* 개선 기회 */}
          {result.opportunities.length > 0 && (
            <div className="border border-[#373A40] rounded-lg overflow-hidden">
              <button
                onClick={() => setShowOpportunities(!showOpportunities)}
                className="w-full flex items-center justify-between p-3 bg-[#25262b] hover:bg-[#2c2d32] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-white">개선 기회</span>
                  <span className="text-xs text-[#5c5f66]">({result.opportunities.length}개)</span>
                </div>
                {showOpportunities ? (
                  <ChevronUp className="w-4 h-4 text-[#5c5f66]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#5c5f66]" />
                )}
              </button>
              {showOpportunities && (
                <div className="p-3 space-y-2">
                  {result.opportunities.map((opp) => (
                    <div key={opp.id} className="p-2 bg-[#1a1b23] rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{opp.title}</span>
                        {opp.savings && (
                          <span className="text-xs text-amber-400">{opp.savings}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#5c5f66] mt-1 line-clamp-2">{opp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 진단 */}
          {result.diagnostics.length > 0 && (
            <div className="border border-[#373A40] rounded-lg overflow-hidden">
              <button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="w-full flex items-center justify-between p-3 bg-[#25262b] hover:bg-[#2c2d32] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">진단</span>
                  <span className="text-xs text-[#5c5f66]">({result.diagnostics.length}개)</span>
                </div>
                {showDiagnostics ? (
                  <ChevronUp className="w-4 h-4 text-[#5c5f66]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#5c5f66]" />
                )}
              </button>
              {showDiagnostics && (
                <div className="p-3 space-y-2">
                  {result.diagnostics.map((diag) => (
                    <div key={diag.id} className="p-2 bg-[#1a1b23] rounded">
                      <span className="text-sm text-white">{diag.title}</span>
                      <p className="text-xs text-[#5c5f66] mt-1 line-clamp-2">{diag.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 측정 시간 */}
          <p className="text-xs text-[#5c5f66] text-right">
            측정: {new Date(result.fetchedAt).toLocaleString("ko-KR")} ({result.strategy})
          </p>
        </div>
      ) : (
        <div className="text-center py-8 text-[#5c5f66]">
          <Gauge className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Google PageSpeed Insights로 Core Web Vitals를 측정합니다</p>
          <p className="text-xs mt-1">
            LCP, CLS, TTI 등 Google 순위에 영향을 주는 지표를 확인하세요
          </p>
        </div>
      )}
    </div>
  );
}
