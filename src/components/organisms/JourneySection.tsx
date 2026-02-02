"use client";

import { useEffect, useState, useRef } from "react";

// 연혁 데이터
const journeyData = [
  {
    year: "2025",
    events: [
      {
        title: "세미콜론 설립",
        description: "5명의 공동 창업자가 모여\n커뮤니티 기술의 미래를 그리다",
      },
      {
        title: "첫 프로젝트 수주",
        description: "A 대학교 커뮤니티 플랫폼 구축으로\n10만 사용자 확보 경험",
      },
      {
        title: "팀 확장",
        description: "파트타임 전문가 6명 합류,\n다양한 분야의 역량 강화",
      },
    ],
  },
  {
    year: "2026",
    events: [
      {
        title: "기술 혁신",
        description: "AI 기반 추천 시스템 개발로\n고객사 매출 35% 증가 달성",
      },
      {
        title: "10+ 고객사 돌파",
        description: "다양한 산업군의 10개 이상의 고객사와 함께 성장",
      },
    ],
  },
];

// 연도별 이벤트 컴포넌트
function YearEvents({
  year,
  events,
  isVisible,
}: {
  year: string;
  events: { title: string; description: string }[];
  isVisible: boolean;
}) {
  return (
    <div
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
    >
      {/* 연도 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#068FFF]" />
        <span className="text-[#068FFF] text-lg font-bold">{year}</span>
      </div>

      {/* 이벤트들 */}
      <div className="ml-4 pl-4 border-l border-dashed border-gray-600 space-y-6">
        {events.map((event, index) => (
          <div key={index}>
            <h4 className="text-white font-bold mb-2">· {event.title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JourneySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleYears, setVisibleYears] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false); // 모든 연도 노출 후 한 번 고정
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 첫 번째 연도 표시 (한 번만 실행)
  useEffect(() => {
    if (!isVisible || visibleYears > 0) return;

    const initialDelay = setTimeout(() => {
      setVisibleYears(1);
    }, 1000);

    return () => clearTimeout(initialDelay);
  }, [isVisible, visibleYears]);

  // 스크롤 이벤트로 연도 노출 제어
  useEffect(() => {
    if (!isVisible) return;

    const handleWheel = (e: WheelEvent) => {
      // 아래로 스크롤 (deltaY > 0)
      if (e.deltaY > 0 && visibleYears < journeyData.length) {
        e.preventDefault();
        setVisibleYears((prev) => Math.min(prev + 1, journeyData.length));
      }
      // 모든 연도가 표시됐지만 아직 완료 상태가 아닌 경우 - 한 번 고정
      else if (e.deltaY > 0 && visibleYears === journeyData.length && !isCompleted) {
        e.preventDefault();
        setIsCompleted(true);
      }
      // isCompleted가 true면 다음 섹션으로 자연스럽게 이동 (기본 동작 허용)
      // 위로 스크롤 (deltaY < 0) - 완료 상태 해제
      else if (e.deltaY < 0 && isCompleted) {
        e.preventDefault();
        setIsCompleted(false);
      }
      // 위로 스크롤 - 첫 번째 연도만 보이면 이전 섹션으로
      else if (e.deltaY < 0 && visibleYears <= 1 && !isCompleted) {
        // 기본 스크롤 동작 허용 (이전 섹션으로 이동)
      }
      // 위로 스크롤하면서 연도 숨기기
      else if (e.deltaY < 0 && visibleYears > 1 && !isCompleted) {
        e.preventDefault();
        setVisibleYears((prev) => Math.max(prev - 1, 1));
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isVisible, visibleYears, isCompleted]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#0a0a0a] to-[#141622] snap-start"
    >
      {/* 콘텐츠 영역 */}
      <div ref={contentRef} className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="mb-12">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Our Journey</span>
            </div>

            {/* 헤드라인 */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              함께 걸어온 길
            </h2>

            {/* 설명 */}
            <p
              className={`text-base text-gray-400 mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              세미콜론의 성장 이야기를 연도별로 만나보세요
            </p>
          </div>

          {/* 타임라인 */}
          <div className="space-y-8 max-w-[500px]">
            {journeyData.map((yearData, index) => (
              <YearEvents
                key={yearData.year}
                year={yearData.year}
                events={yearData.events}
                isVisible={visibleYears > index}
              />
            ))}
          </div>

          {/* 스크롤 힌트 */}
          {visibleYears < journeyData.length && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm animate-pulse">
              스크롤하여 더 보기
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
