"use client";

import { useEffect, useState, useRef } from "react";
import { AICaseCard } from "./AICaseCard";
import { aiUseCases } from "../_data/techData";

export function AIUseCasesSection() {
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
      className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-[#000000] to-[#0a0a14] pt-[200px] pb-20 snap-start"
    >
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="text-center mb-16">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Example</span>
            </div>

            {/* 헤드라인 */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              세미콜론의 AI 활용 사례
            </h2>

            {/* 설명 */}
            <p
              className={`text-base text-gray-400 mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              일상적으로 AI를 활용해 생산성을 극대화합니다
            </p>
          </div>

          {/* 2x2 그리드 카드 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            {aiUseCases.map((item, index) => (
              <AICaseCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                badge={item.badge}
                delay={800 + index * 150}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* 하단 설명 */}
          <p
            className={`text-center text-sm text-gray-500 mt-12 opacity-0 translate-y-6 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "1400ms" }}
          >
            이 외에도 다양한 AI 도구를 개발 프로세스 전반에 활용합니다
          </p>
        </div>
      </div>
    </section>
  );
}
