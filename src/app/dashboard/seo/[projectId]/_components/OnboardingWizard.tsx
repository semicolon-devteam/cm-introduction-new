"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Rocket,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  Globe,
  FileText,
  Image,
  Link,
  Target,
  Sparkles,
  X,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingWizardProps {
  domain: string;
  onComplete?: () => void;
  onNavigateToTool?: (tool: string) => void;
}

interface DBOnboarding {
  completed_steps?: string[];
  dismissed?: boolean;
}

export function OnboardingWizard({ domain, onComplete, onNavigateToTool }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isMinimized, setIsMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // DB에서 온보딩 상태 로드
  const loadOnboarding = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/dashboard/seo/data?type=onboarding&domain=${encodeURIComponent(domain)}`,
      );
      const data = await res.json();
      if (data.success && data.data) {
        const onboarding = data.data as DBOnboarding;
        setCompletedSteps(new Set(onboarding.completed_steps || []));
        setDismissed(onboarding.dismissed || false);
      }
    } catch (error) {
      console.error("온보딩 상태 로드 실패:", error);
    }
  }, [domain]);

  useEffect(() => {
    void loadOnboarding();
  }, [loadOnboarding]);

  const saveProgress = async (newCompleted: Set<string>, newDismissed = dismissed) => {
    setCompletedSteps(newCompleted);
    setDismissed(newDismissed);
    try {
      await fetch("/api/dashboard/seo/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "onboarding",
          domain,
          completed_steps: Array.from(newCompleted),
          dismissed: newDismissed,
        }),
      });
    } catch (error) {
      console.error("온보딩 상태 저장 실패:", error);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: "basics",
      title: "SEO 기본 설정 확인",
      description: "사이트의 기본 SEO 설정을 점검합니다",
      icon: <Globe className="w-5 h-5" />,
      tips: [
        "sitemap.xml이 올바르게 설정되어 있는지 확인하세요",
        "robots.txt로 크롤러 접근을 관리하세요",
        "HTTPS를 사용하면 SEO에 유리합니다",
      ],
      action: {
        label: "사이트 설정 검증하기",
        onClick: () => onNavigateToTool?.("siteConfig"),
      },
    },
    {
      id: "keywords",
      title: "키워드 전략 수립",
      description: "타겟 키워드를 정하고 경쟁사를 분석합니다",
      icon: <Target className="w-5 h-5" />,
      tips: [
        "검색량이 적절하고 경쟁이 낮은 롱테일 키워드를 찾으세요",
        "네이버 DataLab에서 트렌드를 확인하세요",
        "경쟁사의 키워드 전략을 분석하세요",
      ],
      action: {
        label: "경쟁사 키워드 분석",
        onClick: () => onNavigateToTool?.("competitor"),
      },
    },
    {
      id: "content",
      title: "콘텐츠 최적화",
      description: "페이지별 SEO 점수를 높입니다",
      icon: <FileText className="w-5 h-5" />,
      tips: [
        "제목 태그에 핵심 키워드를 포함하세요",
        "메타 설명을 155자 내외로 작성하세요",
        "H1~H6 헤딩 태그를 적절히 사용하세요",
        "내부 링크로 페이지간 연결을 강화하세요",
      ],
      action: {
        label: "페이지 SEO 분석",
        onClick: () => onNavigateToTool?.("pageAnalyzer"),
      },
    },
    {
      id: "images",
      title: "이미지 SEO",
      description: "이미지 최적화로 검색 노출을 높입니다",
      icon: <Image className="w-5 h-5" />,
      tips: [
        "모든 이미지에 의미있는 alt 태그를 추가하세요",
        "파일명에 키워드를 포함하세요",
        "이미지 용량을 최적화하세요 (WebP 권장)",
      ],
      action: {
        label: "이미지 SEO 분석",
        onClick: () => onNavigateToTool?.("imageSeo"),
      },
    },
    {
      id: "links",
      title: "백링크 구축",
      description: "외부 사이트에서 링크를 확보합니다",
      icon: <Link className="w-5 h-5" />,
      tips: [
        "품질 높은 콘텐츠로 자연스러운 백링크를 유도하세요",
        "게스트 포스팅을 활용하세요",
        "깨진 링크 빌딩 전략을 시도해보세요",
        "소셜 미디어 공유를 활성화하세요",
      ],
    },
    {
      id: "monitoring",
      title: "모니터링 & 개선",
      description: "지속적으로 순위를 추적하고 개선합니다",
      icon: <Sparkles className="w-5 h-5" />,
      tips: [
        "주요 키워드의 순위를 정기적으로 체크하세요",
        "검색 콘솔에서 클릭률과 노출수를 확인하세요",
        "주간 SEO 미션을 수행하세요",
      ],
      action: {
        label: "주간 미션 확인",
        onClick: () => onNavigateToTool?.("weeklyMission"),
      },
    },
  ];

  const handleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    void saveProgress(newCompleted);

    if (newCompleted.size === steps.length) {
      onComplete?.();
    }
  };

  const handleDismiss = () => {
    void saveProgress(completedSteps, true);
  };

  const progress = (completedSteps.size / steps.length) * 100;
  const currentStepData = steps[currentStep];

  if (dismissed) {
    return (
      <button
        onClick={() => void saveProgress(completedSteps, false)}
        className="fixed bottom-4 right-4 bg-violet-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-violet-700 flex items-center gap-2 z-50"
      >
        <Rocket className="w-4 h-4" />
        SEO 가이드 다시 보기
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-3">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 w-full text-left"
        >
          <Rocket className="w-5 h-5 text-violet-400" />
          <span className="text-white font-medium flex-1">SEO 시작 가이드</span>
          <span className="text-xs text-[#5c5f66]">
            {completedSteps.size}/{steps.length} 완료
          </span>
          <div className="w-20 h-2 bg-[#25262b] rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-medium">SEO 시작 가이드</h3>
          <span className="text-xs text-[#5c5f66]">
            {completedSteps.size}/{steps.length} 완료
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-[#5c5f66] hover:text-white text-xs"
          >
            최소화
          </button>
          <button onClick={handleDismiss} className="text-[#5c5f66] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                completedSteps.has(step.id)
                  ? "bg-emerald-500 text-white"
                  : idx === currentStep
                    ? "bg-violet-500 text-white"
                    : "bg-[#25262b] text-[#5c5f66]"
              }`}
            >
              {completedSteps.has(step.id) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-xs">{idx + 1}</span>
              )}
            </button>
          ))}
        </div>
        <div className="h-1 bg-[#25262b] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-[#25262b] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
            {currentStepData.icon}
          </div>
          <div>
            <h4 className="text-white font-medium">{currentStepData.title}</h4>
            <p className="text-xs text-[#909296]">{currentStepData.description}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {currentStepData.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <Circle className="w-3 h-3 text-violet-400 mt-0.5 flex-shrink-0" />
              <span className="text-[#909296]">{tip}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentStepData.action && (
            <button
              onClick={currentStepData.action.onClick}
              className="px-4 py-2 bg-violet-600 text-white text-sm rounded hover:bg-violet-700 transition-colors"
            >
              {currentStepData.action.label}
            </button>
          )}
          <button
            onClick={() => handleStepComplete(currentStepData.id)}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              completedSteps.has(currentStepData.id)
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-[#373A40] text-[#909296] hover:bg-[#454851]"
            }`}
          >
            {completedSteps.has(currentStepData.id) ? "완료됨 ✓" : "완료로 표시"}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1 text-sm text-[#909296] hover:text-white disabled:opacity-50 disabled:hover:text-[#909296]"
        >
          <ChevronLeft className="w-4 h-4" />
          이전
        </button>
        <div className="text-xs text-[#5c5f66]">
          {currentStep + 1} / {steps.length}
        </div>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-1 text-sm text-[#909296] hover:text-white disabled:opacity-50 disabled:hover:text-[#909296]"
        >
          다음
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
