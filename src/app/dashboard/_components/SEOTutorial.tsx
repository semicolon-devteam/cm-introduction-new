"use client";

import { useState, useCallback } from "react";
import {
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  Play,
  ExternalLink,
  Clock,
  Target,
  Lightbulb,
  AlertCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  tips?: string[];
  warnings?: string[];
  externalLinks?: { label: string; url: string }[];
  estimatedMinutes: number;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  category: "basics" | "technical" | "content" | "analytics" | "tools";
  steps: TutorialStep[];
  totalMinutes: number;
}

interface SEOTutorialProps {
  className?: string;
}

const STORAGE_KEY = "seo-tutorial-progress";

const LEVEL_CONFIG = {
  beginner: {
    label: "입문",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  intermediate: {
    label: "중급",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
  advanced: {
    label: "고급",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
};

const CATEGORY_CONFIG = {
  basics: { label: "SEO 기초", icon: BookOpen },
  technical: { label: "기술적 SEO", icon: Target },
  content: { label: "콘텐츠 최적화", icon: Lightbulb },
  analytics: { label: "분석/측정", icon: Target },
  tools: { label: "도구 활용", icon: Target },
};

// 튜토리얼 데이터
const TUTORIALS: Tutorial[] = [
  {
    id: "seo-basics",
    title: "SEO 기초 완벽 가이드",
    description: "검색엔진 최적화의 기본 개념과 원리를 배웁니다.",
    level: "beginner",
    category: "basics",
    totalMinutes: 15,
    steps: [
      {
        id: "what-is-seo",
        title: "SEO란 무엇인가?",
        description: "검색엔진 최적화의 정의와 중요성",
        content: `SEO(Search Engine Optimization)는 검색엔진에서 웹사이트가 더 높은 순위에 노출되도록 최적화하는 과정입니다.

**왜 SEO가 중요한가?**
- 검색 결과 1페이지에 노출된 사이트가 전체 클릭의 90% 이상을 차지합니다
- 유료 광고와 달리 지속적인 트래픽을 무료로 얻을 수 있습니다
- 브랜드 신뢰도와 인지도를 높일 수 있습니다

**검색엔진의 작동 원리:**
1. **크롤링**: 검색엔진 봇이 웹페이지를 방문하여 콘텐츠를 수집
2. **인덱싱**: 수집된 정보를 데이터베이스에 저장
3. **랭킹**: 검색어와 관련성이 높은 순서로 결과 표시`,
        tips: [
          "Google과 네이버의 알고리즘은 다르므로 각각에 맞는 전략이 필요합니다",
          "SEO는 단기간에 효과가 나타나지 않으므로 꾸준한 노력이 필요합니다",
        ],
        estimatedMinutes: 3,
      },
      {
        id: "keywords-basics",
        title: "키워드 이해하기",
        description: "타겟 키워드 선정의 기초",
        content: `키워드는 사용자가 검색창에 입력하는 검색어입니다. 올바른 키워드 선정은 SEO 성공의 핵심입니다.

**키워드 유형:**
- **헤드 키워드**: 짧고 검색량이 많음 (예: "카페")
- **롱테일 키워드**: 길고 구체적 (예: "강남역 조용한 스터디 카페")

**좋은 키워드의 조건:**
1. 적절한 검색량 (너무 적지 않게)
2. 낮은 경쟁도 (초보자에게 중요)
3. 비즈니스 관련성 (전환 가능성)
4. 검색 의도 일치`,
        tips: [
          "처음에는 경쟁이 낮은 롱테일 키워드부터 시작하세요",
          "네이버 키워드 도구나 Google 키워드 플래너를 활용하세요",
        ],
        externalLinks: [
          { label: "네이버 키워드 도구", url: "https://searchad.naver.com/my-screen/keyword-tool" },
        ],
        estimatedMinutes: 4,
      },
      {
        id: "on-page-basics",
        title: "온페이지 SEO 기초",
        description: "페이지 내 최적화 요소",
        content: `온페이지 SEO는 웹페이지 내부에서 직접 최적화할 수 있는 요소들입니다.

**핵심 온페이지 요소:**

1. **타이틀 태그 (Title Tag)**
   - 60자 이내 권장
   - 핵심 키워드 포함
   - 브랜드명 뒤에 추가

2. **메타 디스크립션**
   - 155자 이내
   - 클릭을 유도하는 문구
   - 키워드 자연스럽게 포함

3. **헤딩 태그 (H1, H2, H3...)**
   - H1은 페이지당 하나만
   - 계층 구조 유지
   - 키워드 포함

4. **이미지 최적화**
   - 의미 있는 파일명 사용
   - alt 텍스트 필수
   - 적절한 파일 크기`,
        tips: [
          "타이틀 태그가 SEO에서 가장 중요한 요소 중 하나입니다",
          "각 페이지마다 고유한 타이틀과 메타 디스크립션을 사용하세요",
        ],
        warnings: ["키워드를 과도하게 반복하면 오히려 페널티를 받을 수 있습니다"],
        estimatedMinutes: 5,
      },
      {
        id: "content-quality",
        title: "양질의 콘텐츠 작성",
        description: "검색엔진과 사용자를 만족시키는 콘텐츠",
        content: `Google의 E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) 기준을 충족하는 콘텐츠가 상위 노출됩니다.

**좋은 콘텐츠의 특징:**
- 사용자의 검색 의도를 정확히 충족
- 충분한 깊이와 정보 제공
- 읽기 쉬운 구조와 포맷
- 정확하고 신뢰할 수 있는 정보
- 정기적인 업데이트

**콘텐츠 작성 팁:**
1. 타겟 독자를 명확히 정의
2. 검색 의도를 파악 (정보성/거래성/탐색성)
3. 경쟁 콘텐츠 분석
4. 고유한 가치 제공
5. CTA(Call to Action) 포함`,
        tips: [
          "1,500자 이상의 깊이 있는 콘텐츠가 상위 노출에 유리합니다",
          "글 상단에 핵심 정보를 배치하세요 (역피라미드 구조)",
        ],
        estimatedMinutes: 3,
      },
    ],
  },
  {
    id: "google-search-console",
    title: "Google Search Console 시작하기",
    description: "무료 SEO 도구 활용법을 배웁니다.",
    level: "beginner",
    category: "tools",
    totalMinutes: 10,
    steps: [
      {
        id: "gsc-setup",
        title: "Search Console 등록",
        description: "사이트 소유권 인증하기",
        content: `Google Search Console은 Google에서 무료로 제공하는 필수 SEO 도구입니다.

**등록 단계:**
1. Google Search Console 접속 (search.google.com/search-console)
2. '속성 추가' 클릭
3. 도메인 또는 URL 접두사 방식 선택
4. 소유권 인증 (HTML 태그, DNS 레코드, HTML 파일 등)
5. 인증 완료 후 데이터 수집 시작

**인증 방법 추천:**
- **HTML 태그**: 가장 쉬움, 헤드 섹션에 메타 태그 추가
- **DNS 레코드**: 도메인 전체에 적용됨
- **HTML 파일**: 서버 접근이 필요함`,
        tips: [
          "인증 후 데이터가 표시되기까지 며칠이 걸릴 수 있습니다",
          "도메인 방식으로 등록하면 www와 non-www 모두 한 번에 관리됩니다",
        ],
        externalLinks: [
          { label: "Google Search Console", url: "https://search.google.com/search-console" },
        ],
        estimatedMinutes: 4,
      },
      {
        id: "gsc-sitemap",
        title: "사이트맵 제출",
        description: "크롤링 효율화하기",
        content: `사이트맵은 웹사이트의 모든 페이지 목록을 담은 XML 파일입니다.

**사이트맵 제출 방법:**
1. Search Console에서 '사이트맵' 메뉴 클릭
2. 사이트맵 URL 입력 (예: /sitemap.xml)
3. '제출' 클릭
4. 상태가 '성공'으로 바뀌면 완료

**사이트맵 생성 방법:**
- Next.js: next-sitemap 패키지 사용
- WordPress: Yoast SEO 플러그인
- 직접 생성: XML 포맷으로 작성`,
        tips: [
          "사이트맵은 50,000개 URL 또는 50MB 이하여야 합니다",
          "새 콘텐츠 추가 시 사이트맵도 업데이트하세요",
        ],
        estimatedMinutes: 3,
      },
      {
        id: "gsc-reports",
        title: "주요 보고서 활용",
        description: "성능과 문제점 파악하기",
        content: `Search Console의 핵심 보고서를 활용하여 SEO 성과를 분석합니다.

**실적 보고서:**
- 총 클릭수, 노출수, CTR, 평균 순위 확인
- 키워드별, 페이지별 분석 가능
- 날짜 범위 조절로 트렌드 파악

**색인 생성 범위:**
- 인덱싱된 페이지 수 확인
- 오류 및 경고 페이지 식별
- 제외된 페이지 이유 파악

**Core Web Vitals:**
- LCP, FID, CLS 점수 확인
- 모바일/데스크톱 별도 확인
- 개선이 필요한 URL 식별`,
        tips: [
          "매주 '실적' 보고서를 확인하여 트렌드를 파악하세요",
          "'색인 생성 범위'의 오류는 즉시 수정하세요",
        ],
        estimatedMinutes: 3,
      },
    ],
  },
  {
    id: "naver-seo",
    title: "네이버 SEO 완벽 가이드",
    description: "한국 1위 검색엔진 네이버 최적화 방법을 배웁니다.",
    level: "intermediate",
    category: "basics",
    totalMinutes: 12,
    steps: [
      {
        id: "naver-algorithm",
        title: "네이버 검색 알고리즘 이해",
        description: "C-Rank와 D.I.A. 알고리즘",
        content: `네이버는 Google과 다른 독자적인 검색 알고리즘을 사용합니다.

**C-Rank (Creator Rank):**
- 콘텐츠 생산자의 신뢰도 평가
- 꾸준한 양질의 콘텐츠 생산이 중요
- 전문성과 일관성 평가

**D.I.A. (Deep Intent Analysis):**
- 사용자 검색 의도 심층 분석
- 문맥과 의도 파악
- 적절한 콘텐츠 매칭

**네이버 SEO의 특징:**
- 블로그, 카페 등 자체 서비스 우대
- 모바일 최적화 중시
- 사용자 체류 시간 중요`,
        tips: [
          "네이버 블로그를 활용하면 검색 노출에 유리합니다",
          "정기적인 콘텐츠 발행이 C-Rank 향상에 도움됩니다",
        ],
        estimatedMinutes: 4,
      },
      {
        id: "naver-searchadvisor",
        title: "서치어드바이저 설정",
        description: "네이버 웹마스터 도구 활용",
        content: `네이버 서치어드바이저는 네이버 SEO의 필수 도구입니다.

**등록 방법:**
1. 서치어드바이저 접속 (searchadvisor.naver.com)
2. 네이버 계정으로 로그인
3. '사이트 추가' 클릭
4. 사이트 URL 입력
5. 소유 확인 (HTML 태그 또는 파일)

**주요 기능:**
- 사이트 진단: SEO 문제점 자동 분석
- 색인 현황: 인덱싱된 페이지 확인
- 웹 페이지 수집 요청: 새 페이지 크롤링 요청
- RSS/사이트맵 제출`,
        tips: [
          "사이트 진단 기능으로 네이버 SEO 점수를 확인하세요",
          "새 콘텐츠 발행 후 웹 페이지 수집 요청을 하세요",
        ],
        externalLinks: [{ label: "네이버 서치어드바이저", url: "https://searchadvisor.naver.com" }],
        estimatedMinutes: 4,
      },
      {
        id: "naver-optimization",
        title: "네이버 최적화 체크리스트",
        description: "실전 최적화 포인트",
        content: `네이버에서 상위 노출되기 위한 핵심 최적화 포인트입니다.

**필수 설정:**
1. 서치어드바이저 사이트 등록
2. 사이트맵 제출
3. robots.txt에 네이버봇 허용
4. 모바일 반응형 디자인

**콘텐츠 최적화:**
1. 제목에 핵심 키워드 포함
2. 본문 상단에 키워드 배치
3. 이미지에 alt 텍스트 추가
4. 내부 링크 구조 최적화
5. 체류 시간을 높이는 콘텐츠

**네이버 특화 전략:**
- 네이버 블로그/포스트 연동
- 네이버 지도 등록 (로컬 비즈니스)
- 네이버 쇼핑 연동 (이커머스)`,
        tips: [
          "네이버 검색 결과의 블로그 영역 노출을 노려보세요",
          "스마트 블록에 노출되면 클릭률이 크게 높아집니다",
        ],
        warnings: ["네이버는 키워드 스터핑에 민감하니 자연스러운 문맥을 유지하세요"],
        estimatedMinutes: 4,
      },
    ],
  },
];

export function SEOTutorial({ className = "" }: SEOTutorialProps) {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({});
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);

  // 진행 상황 로드
  const loadProgress = useCallback(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);

  // 진행 상황 저장
  const saveProgress = useCallback((progress: Record<string, string[]>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    setCompletedSteps(progress);
  }, []);

  // 초기 로드
  useState(() => {
    loadProgress();
  });

  // 단계 완료 토글
  const toggleStepComplete = (tutorialId: string, stepId: string) => {
    const tutorialProgress = completedSteps[tutorialId] || [];
    let newProgress: string[];

    if (tutorialProgress.includes(stepId)) {
      newProgress = tutorialProgress.filter((id) => id !== stepId);
    } else {
      newProgress = [...tutorialProgress, stepId];
    }

    saveProgress({ ...completedSteps, [tutorialId]: newProgress });
  };

  // 튜토리얼 진행률 계산
  const getTutorialProgress = (tutorial: Tutorial): number => {
    const completed = completedSteps[tutorial.id]?.length || 0;
    return Math.round((completed / tutorial.steps.length) * 100);
  };

  // 튜토리얼 시작
  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStepIndex(0);
  };

  // 뒤로 가기
  const goBack = () => {
    setSelectedTutorial(null);
    setCurrentStepIndex(0);
  };

  // 다음 단계
  const nextStep = () => {
    if (selectedTutorial && currentStepIndex < selectedTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // 이전 단계
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // 튜토리얼 상세 뷰
  if (selectedTutorial) {
    const step = selectedTutorial.steps[currentStepIndex];
    const isCompleted = completedSteps[selectedTutorial.id]?.includes(step.id) || false;
    const totalCompleted = completedSteps[selectedTutorial.id]?.length || 0;

    return (
      <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] ${className}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-[#373A40]">
          <button
            onClick={goBack}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          >
            ← 목록으로
          </button>
          <div className="text-center">
            <p className="text-sm font-medium text-white">{selectedTutorial.title}</p>
            <p className="text-xs text-gray-500">
              {currentStepIndex + 1} / {selectedTutorial.steps.length} 단계
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-400">{totalCompleted} 완료</p>
          </div>
        </div>

        {/* 프로그레스 */}
        <div className="px-5 pt-4">
          <div className="flex gap-1">
            {selectedTutorial.steps.map((s, i) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < currentStepIndex
                    ? "bg-emerald-500"
                    : i === currentStepIndex
                      ? "bg-cyan-500"
                      : "bg-[#373A40]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
            <button
              onClick={() => toggleStepComplete(selectedTutorial.id, step.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-[#25262b] text-gray-500 hover:text-white"
              }`}
            >
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
          </div>

          {/* 본문 */}
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
              {step.content}
            </div>
          </div>

          {/* 팁 */}
          {step.tips && step.tips.length > 0 && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-xs text-cyan-400 font-medium mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> 팁
              </p>
              <ul className="space-y-1">
                {step.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 경고 */}
          {step.warnings && step.warnings.length > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-400 font-medium mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> 주의
              </p>
              <ul className="space-y-1">
                {step.warnings.map((warning, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 외부 링크 */}
          {step.externalLinks && step.externalLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.externalLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-[#25262b] border border-[#373A40] rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 네비게이션 */}
        <div className="flex items-center justify-between p-5 border-t border-[#373A40]">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {step.estimatedMinutes}분
          </p>
          <button
            onClick={nextStep}
            disabled={currentStepIndex === selectedTutorial.steps.length - 1}
            className="px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      </div>
    );
  }

  // 튜토리얼 목록 뷰
  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 border-b border-[#373A40]">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-white">SEO 튜토리얼</h2>
        </div>
        <span className="text-xs text-gray-500">{TUTORIALS.length}개 코스</span>
      </div>

      {/* 튜토리얼 목록 */}
      <div className="p-4 space-y-3">
        {TUTORIALS.map((tutorial) => {
          const progress = getTutorialProgress(tutorial);
          const levelConfig = LEVEL_CONFIG[tutorial.level];
          const isExpanded = expandedTutorial === tutorial.id;

          return (
            <div key={tutorial.id} className="border border-[#373A40] rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedTutorial(isExpanded ? null : tutorial.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#25262b] transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#25262b] flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-white">{tutorial.title}</h3>
                      <span className={`px-1.5 py-0.5 text-xs rounded border ${levelConfig.color}`}>
                        {levelConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{tutorial.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-emerald-400">{progress}%</p>
                    <p className="text-xs text-gray-500">{tutorial.totalMinutes}분</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[#373A40] bg-[#25262b]/50 p-4 space-y-3">
                  {/* 단계 목록 */}
                  <div className="space-y-2">
                    {tutorial.steps.map((step, i) => {
                      const isStepCompleted =
                        completedSteps[tutorial.id]?.includes(step.id) || false;
                      return (
                        <div key={step.id} className="flex items-center gap-2 text-sm">
                          {isStepCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          )}
                          <span
                            className={
                              isStepCompleted ? "text-gray-500 line-through" : "text-gray-300"
                            }
                          >
                            {i + 1}. {step.title}
                          </span>
                          <span className="text-xs text-gray-600 ml-auto">
                            {step.estimatedMinutes}분
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 시작 버튼 */}
                  <button
                    onClick={() => startTutorial(tutorial)}
                    className="w-full px-4 py-2 bg-cyan-500 text-white text-sm rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {progress > 0 ? "이어서 학습" : "학습 시작"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 푸터 */}
      <div className="px-4 py-3 border-t border-[#373A40] bg-[#0d0e12]">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Sparkles className="w-3 h-3" />
          <span>튜토리얼을 완료하면 SEO 전문가로 성장할 수 있습니다!</span>
        </div>
      </div>
    </div>
  );
}

export default SEOTutorial;
