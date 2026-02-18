"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Wrench } from "lucide-react";
import { coreSkills, stats } from "../_data/techData";

export function DifferentiationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col snap-start overflow-hidden"
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/tech/differentiation-bg.png')" }}
      />
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="mb-8">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-gray-300 text-base font-medium">Differentiation</span>
            </div>

            {/* 헤드라인 */}
            <div
              className={`mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-[#068FFF]">10년</span>
                <span className="text-white">+</span>
              </h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-white">경력의 </span>
                <span className="text-[#068FFF]">기술 리더십</span>
              </h2>
            </div>

            {/* 설명 */}
            <p
              className={`text-base text-gray-300 mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              AI 의존도가 높은 팀과의 결정적 차별점
            </p>
          </div>

          {/* 메인 카드 */}
          <div
            className={`bg-[#1E1E1E] border border-gray-700/50 rounded-2xl p-6 opacity-0 translate-y-8 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "800ms" }}
          >
            {/* 배지 */}
            <span className="inline-block px-4 py-1.5 bg-[#068FFF]/20 text-[#068FFF] text-sm font-medium rounded-full border border-[#068FFF]/30 mb-4">
              300% 생산성 향상
            </span>

            {/* 카드 타이틀 */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">리드 엔지니어 팀</h3>

            {/* 카드 설명 */}
            <p className="text-sm text-gray-300 mb-6">
              대규모 프로젝트 경험과 깊은 기술적 이해를 바탕으로, 복잡한 아키텍처 설계부터 위기 상황
              대처까지 완벽하게 수행합니다.
            </p>

            {/* 위기 대처 + 핵심 역량 (3컬럼 grid, 하단 통계와 정렬) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* 위기 대처 능력 */}
              <div className="lg:col-span-2 bg-[#068FFF]/10 border border-[#068FFF]/30 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Users size={18} className="text-[#068FFF]" />
                  <h4 className="text-base font-semibold text-white">위기 대처 능력</h4>
                </div>
                <p className="text-sm text-gray-400">
                  AI가 해결 못하는 복잡한 문제의 근본 원인 파악 및 해결
                </p>
              </div>

              {/* 핵심 역량 */}
              <div className="lg:col-span-1 bg-[#2A2A2A] border border-gray-600/50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Wrench size={18} className="text-gray-400" />
                  <h4 className="text-base font-semibold text-white">핵심 역량</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {coreSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#068FFF]" />
                      <span className="text-sm text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 통계 영역 */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-[#2A2A2A] border border-gray-600/50 rounded-xl py-4 px-3 text-center"
                >
                  <div className="text-xl md:text-2xl font-bold text-[#068FFF] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
