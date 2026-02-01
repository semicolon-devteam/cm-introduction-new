"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bell,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  Zap,
  Target,
  Activity,
  CheckCircle,
  X,
} from "lucide-react";

// 인사이트 타입
export interface SEOInsight {
  id: string;
  type: "anomaly" | "trend" | "opportunity" | "alert" | "recommendation";
  severity: "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  metric?: string;
  value?: number;
  previousValue?: number;
  changePercent?: number;
  action?: string;
  timestamp: string;
  dismissed?: boolean;
}

// 알림 설정 타입
interface AlertSettings {
  enabled: boolean;
  thresholds: {
    clicksDropPercent: number;
    impressionsDropPercent: number;
    positionChange: number;
    ctrDropPercent: number;
  };
}

const ALERTS_KEY = "seo_alert_settings";

interface SEOInsightEngineProps {
  searchConsoleData?: {
    current: { clicks: number; impressions: number; ctr: number; position: number };
    previous: { clicks: number; impressions: number; ctr: number; position: number };
    change: { clicks: number; impressions: number; ctr: number; position: number };
  };
  analyticsData?: {
    activeUsers: { value: number; changePercent?: number };
    sessions: { value: number; changePercent?: number };
    bounceRate: { value: number; changePercent?: number };
  };
  className?: string;
}

export function SEOInsightEngine({
  searchConsoleData,
  analyticsData,
  className = "",
}: SEOInsightEngineProps) {
  const [insights, setInsights] = useState<SEOInsight[]>([]);
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    enabled: true,
    thresholds: {
      clicksDropPercent: 20,
      impressionsDropPercent: 30,
      positionChange: 5,
      ctrDropPercent: 15,
    },
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // LocalStorage에서 설정 로드
  useEffect(() => {
    const savedSettings = localStorage.getItem(ALERTS_KEY);
    if (savedSettings) {
      try {
        setAlertSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse alert settings:", e);
      }
    }
  }, []);

  // 설정 저장
  const saveSettings = useCallback((settings: AlertSettings) => {
    setAlertSettings(settings);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(settings));
  }, []);

  // 인사이트 생성 로직
  const generateInsights = useCallback(() => {
    setIsAnalyzing(true);
    const newInsights: SEOInsight[] = [];
    const now = new Date().toISOString();

    if (searchConsoleData) {
      const { current, previous, change } = searchConsoleData;

      // 클릭수 급감 감지
      if (change.clicks < -alertSettings.thresholds.clicksDropPercent) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "anomaly",
          severity: "high",
          title: "클릭수 급감 감지",
          description: `클릭수가 ${Math.abs(change.clicks)}% 감소했습니다. 콘텐츠 품질이나 검색 순위 변동을 확인하세요.`,
          metric: "clicks",
          value: current.clicks,
          previousValue: previous.clicks,
          changePercent: change.clicks,
          action: "콘텐츠 품질 점검 및 키워드 순위 확인",
          timestamp: now,
        });
      }

      // 노출수 급감 감지
      if (change.impressions < -alertSettings.thresholds.impressionsDropPercent) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "anomaly",
          severity: "high",
          title: "노출수 급감 감지",
          description: `노출수가 ${Math.abs(change.impressions)}% 감소했습니다. 색인 상태나 크롤링 오류를 확인하세요.`,
          metric: "impressions",
          value: current.impressions,
          previousValue: previous.impressions,
          changePercent: change.impressions,
          action: "Search Console에서 색인 상태 확인",
          timestamp: now,
        });
      }

      // 순위 하락 감지
      if (current.position - previous.position > alertSettings.thresholds.positionChange) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "alert",
          severity: "medium",
          title: "평균 순위 하락",
          description: `평균 순위가 ${(current.position - previous.position).toFixed(1)}위 하락했습니다.`,
          metric: "position",
          value: current.position,
          previousValue: previous.position,
          action: "경쟁사 분석 및 콘텐츠 업데이트 검토",
          timestamp: now,
        });
      }

      // CTR 하락 감지
      if (change.ctr < -alertSettings.thresholds.ctrDropPercent) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "alert",
          severity: "medium",
          title: "CTR 하락 감지",
          description: `CTR이 ${Math.abs(change.ctr)}% 감소했습니다. 메타 태그 최적화가 필요할 수 있습니다.`,
          metric: "ctr",
          value: current.ctr,
          previousValue: previous.ctr,
          changePercent: change.ctr,
          action: "Title 및 Description 메타태그 개선",
          timestamp: now,
        });
      }

      // 긍정적 트렌드 감지
      if (change.clicks > 20) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "trend",
          severity: "info",
          title: "클릭수 상승 트렌드",
          description: `클릭수가 ${change.clicks}% 증가했습니다! 효과적인 SEO 전략이 적용되고 있습니다.`,
          metric: "clicks",
          value: current.clicks,
          previousValue: previous.clicks,
          changePercent: change.clicks,
          timestamp: now,
        });
      }

      // 순위 개선 기회
      if (current.position > 10 && current.position < 20 && current.impressions > 100) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "opportunity",
          severity: "low",
          title: "순위 개선 기회",
          description: `평균 순위 ${current.position.toFixed(1)}위로, 조금만 개선하면 첫 페이지 진입 가능합니다.`,
          metric: "position",
          value: current.position,
          action: "첫 페이지 진입을 위한 콘텐츠 강화",
          timestamp: now,
        });
      }

      // CTR 개선 기회
      if (current.ctr < 3 && current.impressions > 1000) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "recommendation",
          severity: "low",
          title: "CTR 개선 권장",
          description: `노출은 많지만 CTR이 ${current.ctr}%로 낮습니다. 메타 태그 최적화로 개선하세요.`,
          metric: "ctr",
          value: current.ctr,
          action: "구조화된 데이터 마크업 및 리치 스니펫 활용",
          timestamp: now,
        });
      }
    }

    if (analyticsData) {
      // 이탈률 경고
      if (analyticsData.bounceRate.value > 70) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "alert",
          severity: "medium",
          title: "높은 이탈률 감지",
          description: `이탈률이 ${analyticsData.bounceRate.value}%로 높습니다. 사용자 경험 개선이 필요합니다.`,
          metric: "bounceRate",
          value: analyticsData.bounceRate.value,
          action: "페이지 로딩 속도 및 콘텐츠 품질 개선",
          timestamp: now,
        });
      }

      // 트래픽 감소 경고
      if ((analyticsData.sessions.changePercent || 0) < -20) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: "anomaly",
          severity: "high",
          title: "트래픽 감소 감지",
          description: `세션이 ${Math.abs(analyticsData.sessions.changePercent || 0)}% 감소했습니다.`,
          metric: "sessions",
          value: analyticsData.sessions.value,
          changePercent: analyticsData.sessions.changePercent,
          action: "트래픽 소스 분석 및 마케팅 채널 점검",
          timestamp: now,
        });
      }
    }

    // 데이터 없을 때 기본 권장사항
    if (newInsights.length === 0) {
      newInsights.push({
        id: crypto.randomUUID(),
        type: "recommendation",
        severity: "info",
        title: "SEO 상태 양호",
        description: "현재 특별한 이상 징후가 감지되지 않았습니다. 꾸준히 콘텐츠를 업데이트하세요.",
        timestamp: now,
      });
    }

    setTimeout(() => {
      setInsights(newInsights);
      setIsAnalyzing(false);
    }, 500);
  }, [searchConsoleData, analyticsData, alertSettings.thresholds]);

  // 초기 분석 실행
  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  // 인사이트 무시
  const dismissInsight = (id: string) => {
    setInsights(insights.filter((i) => i.id !== id));
  };

  // 심각도별 아이콘 & 색상
  const severityConfig = {
    high: {
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
    medium: {
      icon: Bell,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    low: {
      icon: Lightbulb,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    info: { icon: Info, color: "text-[#909296]", bg: "bg-[#25262b]", border: "border-[#373A40]" },
  };

  const typeIcons = {
    anomaly: AlertTriangle,
    trend: TrendingUp,
    opportunity: Target,
    alert: Bell,
    recommendation: Lightbulb,
  };

  // 표시할 인사이트 (중요도 순 정렬)
  const sortedInsights = [...insights].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2, info: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const displayInsights = showAll ? sortedInsights : sortedInsights.slice(0, 3);
  const highPriorityCount = insights.filter((i) => i.severity === "high").length;

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-[#373A40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-white">인사이트 엔진</span>
          {highPriorityCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              {highPriorityCount} 긴급
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-[#909296] hover:text-white hover:bg-white/5 rounded transition-all"
            title="알림 설정"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className={`p-1.5 text-[#909296] hover:text-white hover:bg-white/5 rounded transition-all ${isAnalyzing ? "animate-spin" : ""}`}
            title="다시 분석"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* 알림 설정 패널 */}
        {showSettings && (
          <div className="mb-4 bg-[#25262b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">알림 설정</h4>
              <label className="flex items-center gap-2 text-xs text-[#909296]">
                <input
                  type="checkbox"
                  checked={alertSettings.enabled}
                  onChange={(e) => saveSettings({ ...alertSettings, enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-[#373A40] bg-[#1a1b23] text-brand-primary focus:ring-brand-primary"
                />
                알림 활성화
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#909296] block mb-1">클릭 감소 임계값 (%)</label>
                <input
                  type="number"
                  value={alertSettings.thresholds.clicksDropPercent}
                  onChange={(e) =>
                    saveSettings({
                      ...alertSettings,
                      thresholds: {
                        ...alertSettings.thresholds,
                        clicksDropPercent: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full h-8 px-2 text-sm bg-[#1a1b23] border border-[#373A40] rounded text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#909296] block mb-1">노출 감소 임계값 (%)</label>
                <input
                  type="number"
                  value={alertSettings.thresholds.impressionsDropPercent}
                  onChange={(e) =>
                    saveSettings({
                      ...alertSettings,
                      thresholds: {
                        ...alertSettings.thresholds,
                        impressionsDropPercent: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full h-8 px-2 text-sm bg-[#1a1b23] border border-[#373A40] rounded text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#909296] block mb-1">순위 변동 임계값</label>
                <input
                  type="number"
                  value={alertSettings.thresholds.positionChange}
                  onChange={(e) =>
                    saveSettings({
                      ...alertSettings,
                      thresholds: {
                        ...alertSettings.thresholds,
                        positionChange: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full h-8 px-2 text-sm bg-[#1a1b23] border border-[#373A40] rounded text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#909296] block mb-1">CTR 감소 임계값 (%)</label>
                <input
                  type="number"
                  value={alertSettings.thresholds.ctrDropPercent}
                  onChange={(e) =>
                    saveSettings({
                      ...alertSettings,
                      thresholds: {
                        ...alertSettings.thresholds,
                        ctrDropPercent: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full h-8 px-2 text-sm bg-[#1a1b23] border border-[#373A40] rounded text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 분석 중 */}
        {isAnalyzing && (
          <div className="flex items-center justify-center py-8">
            <Activity className="w-6 h-6 text-brand-primary animate-pulse mr-2" />
            <span className="text-sm text-[#909296]">SEO 데이터 분석 중...</span>
          </div>
        )}

        {/* 인사이트 목록 */}
        {!isAnalyzing && (
          <div className="space-y-3">
            {displayInsights.map((insight) => {
              const config = severityConfig[insight.severity];
              const TypeIcon = typeIcons[insight.type];

              return (
                <div
                  key={insight.id}
                  className={`rounded-lg p-4 border ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg}`}>
                      <TypeIcon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                        {insight.changePercent !== undefined && (
                          <span
                            className={`text-xs flex items-center gap-0.5 ${
                              insight.changePercent > 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {insight.changePercent > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(insight.changePercent)}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#909296] mb-2">{insight.description}</p>
                      {insight.action && (
                        <div className="flex items-center gap-1 text-xs text-brand-primary">
                          <CheckCircle className="w-3 h-3" />
                          {insight.action}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => dismissInsight(insight.id)}
                      className="flex-shrink-0 p-1 text-[#5c5f66] hover:text-white rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {insights.length === 0 && !isAnalyzing && (
              <div className="text-center py-8 text-[#5c5f66]">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-50" />
                <p className="text-sm">모든 지표가 정상입니다</p>
              </div>
            )}
          </div>
        )}

        {/* 더보기 버튼 */}
        {insights.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-2 text-xs text-[#909296] hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            {showAll ? (
              <>
                간략히 보기 <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                {insights.length - 3}개 더 보기 <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
