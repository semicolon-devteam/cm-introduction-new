"use client";

import { useEffect, useState, useRef } from "react";
import { comparisonData, clientValues } from "../_data/techData";

export function CompetitivenessSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#141622] to-[#0a0a14] snap-start py-20"
    >
      <div className="flex flex-col justify-center min-h-[calc(100vh-160px)]">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="text-center mb-16">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Competitiveness</span>
            </div>

            {/* 헤드라인 */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              타업체 대비
            </h2>
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[#068FFF] leading-tight mt-2 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "500ms" }}
            >
              세미콜론의 경쟁력
            </h2>

            {/* 설명 */}
            <p
              className={`text-base text-gray-400 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              모든 규모의 회사 대비 차별화된 강점
            </p>
          </div>

          {/* 비교 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {/* 중소기업 카드 */}
            <div
              className={`bg-[#1E1E1E] border border-gray-700/50 rounded-2xl p-8 cursor-pointer
              hover:bg-[#068FFF]/10 hover:border-[#068FFF]/30 transition-colors duration-150
              ${isVisible ? "" : "opacity-0 translate-y-8"}`}
              style={{
                transition:
                  "opacity 700ms ease-out, transform 700ms ease-out, background-color 150ms, border-color 150ms",
                transitionDelay: isVisible ? "0ms" : "800ms",
              }}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {comparisonData.smallCompany.title}
              </h3>
              <ul className="space-y-4">
                {comparisonData.smallCompany.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#068FFF] mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 대기업 카드 */}
            <div
              className={`bg-[#1E1E1E] border border-gray-700/50 rounded-2xl p-8 cursor-pointer
              hover:bg-[#068FFF]/10 hover:border-[#068FFF]/30 transition-colors duration-150
              ${isVisible ? "" : "opacity-0 translate-y-8"}`}
              style={{
                transition:
                  "opacity 700ms ease-out, transform 700ms ease-out, background-color 150ms, border-color 150ms",
                transitionDelay: isVisible ? "0ms" : "900ms",
              }}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {comparisonData.largeCompany.title}
              </h3>
              <ul className="space-y-4">
                {comparisonData.largeCompany.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#068FFF] mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 구분선 */}
          <div
            className={`flex flex-col items-center mb-16 opacity-0 transition-all duration-700 ease-out
            ${isVisible ? "opacity-100" : ""}`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600 to-[#068FFF]" />
            <div className="w-2 h-2 rounded-full bg-[#068FFF]" />
          </div>

          {/* 클라이언트 가치 제안 타이틀 */}
          <div
            className={`text-center mb-12 opacity-0 translate-y-6 transition-all duration-700 ease-out
            ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "1100ms" }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white">클라이언트 가치 제안</h3>
            <p className="text-sm text-gray-400 mt-3">세미콜론과 협업했을 때 얻는 이점</p>
          </div>

          {/* 가치 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientValues.map((value, index) => (
              <div
                key={index}
                className={`bg-[#1E1E1E] border border-gray-700/50 rounded-2xl p-6 opacity-0 translate-y-8 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: `${1200 + index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#068FFF]/20 flex items-center justify-center flex-shrink-0">
                    <value.icon size={24} className="text-[#068FFF]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{value.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{value.description}</p>
                  </div>
                </div>
                <div className="bg-[#2A2A2A] rounded-xl p-4">
                  <p className="text-sm text-gray-300">{value.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
