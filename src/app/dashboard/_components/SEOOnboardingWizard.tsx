"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  Circle,
  Target,
  Users,
  Globe,
  Trophy,
  Sparkles,
  Loader2,
  BookOpen,
  ArrowRight,
  X,
  CheckCircle,
  Info,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  step: number;
  title: string;
  description: string;
  tasks: OnboardingTask[];
  estimatedMinutes: number;
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  actionType: "input" | "select" | "link" | "verify";
  actionData?: {
    placeholder?: string;
    options?: string[];
    url?: string;
  };
  required: boolean;
}

interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  projectData: {
    domain?: string;
    businessType?: string;
    targetKeywords?: string[];
    targetAudience?: string;
    competitors?: string[];
    goals?: string[];
  };
  startedAt: string;
  lastUpdatedAt: string;
}

interface AIRecommendations {
  summary: string;
  priorities: string[];
  weeklyActions: string[];
  tips: string[];
}

interface SEOOnboardingWizardProps {
  onComplete?: (data: OnboardingProgress["projectData"]) => void;
  className?: string;
}

const STORAGE_KEY = "seo-onboarding-progress";

const STEP_ICONS = [Globe, Target, Users, Trophy, Rocket];

export function SEOOnboardingWizard({ onComplete, className = "" }: SEOOnboardingWizardProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [showWizard, setShowWizard] = useState(true);

  // 로컬 폼 데이터
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});

  // 온보딩 데이터 로드
  const loadOnboarding = useCallback(async () => {
    setLoading(true);
    try {
      // LocalStorage에서 진행 상황 로드
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress) as OnboardingProgress;
        setProgress(parsed);
        setCurrentStep(parsed.currentStep);

        // 폼 데이터 복원
        const restoredFormData: Record<string, string | string[]> = {};
        if (parsed.projectData.domain) restoredFormData.domain = parsed.projectData.domain;
        if (parsed.projectData.businessType)
          restoredFormData["business-type"] = parsed.projectData.businessType;
        if (parsed.projectData.targetKeywords)
          restoredFormData["primary-keywords"] = parsed.projectData.targetKeywords.join(", ");
        if (parsed.projectData.targetAudience)
          restoredFormData["target-audience"] = parsed.projectData.targetAudience;
        if (parsed.projectData.competitors)
          restoredFormData["competitor-urls"] = parsed.projectData.competitors.join(", ");
        if (parsed.projectData.goals) restoredFormData["seo-goals"] = parsed.projectData.goals;
        setFormData(restoredFormData);
      }

      // API에서 단계 정보 로드
      const response = await fetch("/api/dashboard/seo/onboarding");
      const data = await response.json();

      if (data.success) {
        setSteps(data.steps);
      }
    } catch (error) {
      console.error("Failed to load onboarding:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOnboarding();
  }, [loadOnboarding]);

  // 진행 상황 저장
  const saveProgress = useCallback(
    (step: number, data: Record<string, string | string[]>) => {
      const projectData: OnboardingProgress["projectData"] = {
        domain: typeof data.domain === "string" ? data.domain : undefined,
        businessType: typeof data["business-type"] === "string" ? data["business-type"] : undefined,
        targetKeywords:
          typeof data["primary-keywords"] === "string"
            ? data["primary-keywords"].split(",").map((k) => k.trim())
            : undefined,
        targetAudience:
          typeof data["target-audience"] === "string" ? data["target-audience"] : undefined,
        competitors:
          typeof data["competitor-urls"] === "string" && data["competitor-urls"].trim()
            ? data["competitor-urls"].split(",").map((c) => c.trim())
            : undefined,
        goals: Array.isArray(data["seo-goals"]) ? data["seo-goals"] : undefined,
      };

      const newProgress: OnboardingProgress = {
        currentStep: step,
        completedSteps: progress?.completedSteps || [],
        projectData,
        startedAt: progress?.startedAt || new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    },
    [progress],
  );

  // 다음 단계로 이동
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const step = steps[currentStep];
      const isValid = validateStep(step);

      if (!isValid) {
        return;
      }

      saveProgress(currentStep + 1, formData);
      setCurrentStep(currentStep + 1);
    }
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 0) {
      saveProgress(currentStep - 1, formData);
      setCurrentStep(currentStep - 1);
    }
  };

  // 단계 유효성 검사
  const validateStep = (step: OnboardingStep): boolean => {
    for (const task of step.tasks) {
      if (task.required) {
        const value = formData[task.id];
        if (!value || (typeof value === "string" && !value.trim())) {
          return false;
        }
        if (Array.isArray(value) && value.length === 0) {
          return false;
        }
      }
    }
    return true;
  };

  // 온보딩 완료
  const handleComplete = async () => {
    setSubmitting(true);
    try {
      saveProgress(steps.length - 1, formData);

      // AI 추천 생성
      const response = await fetch("/api/dashboard/seo/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get-recommendations",
          data: progress,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }

      // 완료 콜백
      if (onComplete && progress?.projectData) {
        onComplete(progress.projectData);
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 입력 핸들러
  const handleInputChange = (taskId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [taskId]: value }));
  };

  // 선택 핸들러 (단일)
  const handleSelectChange = (taskId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [taskId]: value }));
  };

  // 선택 핸들러 (복수)
  const handleMultiSelectToggle = (taskId: string, value: string) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[taskId]) ? (prev[taskId] as string[]) : [];
      if (current.includes(value)) {
        return { ...prev, [taskId]: current.filter((v) => v !== value) };
      }
      return { ...prev, [taskId]: [...current, value] };
    });
  };

  // 온보딩 재시작
  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(null);
    setFormData({});
    setCurrentStep(0);
    setRecommendations(null);
    setShowWizard(true);
  };

  // 온보딩 닫기
  const handleClose = () => {
    setShowWizard(false);
  };

  if (loading) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  // 이미 완료된 경우 또는 닫은 경우 - 미니 카드 표시
  if (!showWizard && progress && progress.currentStep >= steps.length - 1) {
    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-emerald-500/30 p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">온보딩 완료!</p>
              <p className="text-xs text-gray-500">
                {progress.projectData.domain || "프로젝트"} 설정 완료
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            다시 보기
          </button>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  if (!step) return null;

  const StepIcon = STEP_ICONS[currentStep] || Rocket;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const canProceed = validateStep(step);

  return (
    <div
      className={`bg-[#1a1b23] rounded-lg border border-cyan-500/30 overflow-hidden ${className}`}
    >
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-5 border-b border-[#373A40]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">SEO 시작하기</h2>
              <p className="text-xs text-gray-500">
                단계 {currentStep + 1} / {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className="mt-4 flex items-center gap-1">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < currentStep
                  ? "bg-emerald-500"
                  : i === currentStep
                    ? "bg-cyan-500"
                    : "bg-[#373A40]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-5">
        {/* 완료 화면 + 추천 */}
        {isLastStep && recommendations ? (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">설정 완료!</h3>
              <p className="text-sm text-gray-400">{recommendations.summary}</p>
            </div>

            {/* 우선순위 */}
            <div className="bg-[#25262b] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-cyan-400" />
                우선순위 작업
              </h4>
              <ol className="space-y-2">
                {recommendations.priorities.map((priority, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-cyan-400 font-medium">{i + 1}.</span>
                    {priority}
                  </li>
                ))}
              </ol>
            </div>

            {/* 이번 주 액션 */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                이번 주 할 일
              </h4>
              <ul className="space-y-2">
                {recommendations.weeklyActions.map((action, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <Circle className="w-3 h-3 mt-1 text-purple-400 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            {/* 팁 */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-amber-400" />
                한국 SEO 팁
              </h4>
              <ul className="space-y-2">
                {recommendations.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-amber-400">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* 대시보드로 이동 */}
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 px-4 py-2.5 text-sm text-gray-400 hover:text-white border border-[#373A40] rounded-lg hover:border-[#4a4b53] transition-colors"
              >
                처음부터 다시
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 text-sm text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
              >
                대시보드 보기
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 단계 제목 */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#25262b] flex items-center justify-center flex-shrink-0">
                <StepIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>

            {/* 태스크 목록 */}
            <div className="space-y-4">
              {step.tasks.map((task) => (
                <div key={task.id} className="bg-[#25262b] rounded-lg p-4">
                  <label className="block text-sm font-medium text-white mb-1">
                    {task.title}
                    {task.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <p className="text-xs text-gray-500 mb-3">{task.description}</p>

                  {/* 입력 타입별 렌더링 */}
                  {task.actionType === "input" && (
                    <input
                      type="text"
                      value={(formData[task.id] as string) || ""}
                      onChange={(e) => handleInputChange(task.id, e.target.value)}
                      placeholder={task.actionData?.placeholder}
                      className="w-full px-3 py-2 bg-[#1a1b23] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 text-sm"
                    />
                  )}

                  {task.actionType === "select" && task.actionData?.options && (
                    <div className="flex flex-wrap gap-2">
                      {task.id === "seo-goals"
                        ? // 복수 선택
                          task.actionData.options.map((option) => {
                            const selected = Array.isArray(formData[task.id])
                              ? (formData[task.id] as string[]).includes(option)
                              : false;
                            return (
                              <button
                                key={option}
                                onClick={() => handleMultiSelectToggle(task.id, option)}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${
                                  selected
                                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                    : "bg-[#1a1b23] border-[#373A40] text-gray-400 hover:border-[#4a4b53]"
                                }`}
                              >
                                {selected ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Circle className="w-3 h-3" />
                                )}
                                {option}
                              </button>
                            );
                          })
                        : // 단일 선택
                          task.actionData.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleSelectChange(task.id, option)}
                              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                formData[task.id] === option
                                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                  : "bg-[#1a1b23] border-[#373A40] text-gray-400 hover:border-[#4a4b53]"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                    </div>
                  )}

                  {task.actionType === "link" && task.actionData?.url && (
                    <a
                      href={task.actionData.url}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
                    >
                      대시보드로 이동
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 네비게이션 */}
      {!(isLastStep && recommendations) && (
        <div className="flex items-center justify-between p-5 border-t border-[#373A40] bg-[#25262b]/30">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </button>

          <p className="text-xs text-gray-600">예상 소요 시간: {step.estimatedMinutes}분</p>

          {isLastStep ? (
            <button
              onClick={() => void handleComplete()}
              disabled={submitting}
              className="flex items-center gap-1 px-4 py-1.5 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  완료
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              다음
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 용어 사전 링크 */}
      <div className="px-5 py-3 border-t border-[#373A40] bg-[#0d0e12]">
        <a
          href="#glossary"
          onClick={(e) => {
            e.preventDefault();
            // 용어 사전 모달이나 섹션으로 스크롤
          }}
          className="text-xs text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <BookOpen className="w-3 h-3" />
          SEO 용어가 어려우신가요? 용어 사전 보기
        </a>
      </div>
    </div>
  );
}

export default SEOOnboardingWizard;
