"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle2, Waypoints } from "lucide-react";
import { winWinData } from "../_data/techData";

export function SpecialOfferSection() {
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
      className="relative min-h-screen w-full flex flex-col pt-[200px] pb-20 snap-start overflow-hidden"
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/tech/special-offer-bg.png')" }}
      />
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="mb-16">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Special</span>
            </div>

            {/* 헤드라인 */}
            <div
              className={`mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                사업 초기 단계팀의
              </h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#068FFF] leading-tight mt-2">
                특별한 제안
              </h2>
            </div>

            {/* 설명 */}
            <p
              className={`text-base text-gray-300 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              저렴한 가격에도 최고 품질의 서비스를 제공할 수 있는 이유
            </p>
          </div>

          {/* Win-Win 카드 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 클라이언트 혜택 카드 */}
            <div
              className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 opacity-0 translate-y-8 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "800ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <h3 className="text-xl font-bold text-white">{winWinData.client.title}</h3>
              </div>
              <ul className="space-y-4">
                {winWinData.client.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                    <span className="text-sm text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 세미콜론 혜택 카드 */}
            <div
              className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 opacity-0 translate-y-8 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "900ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <h3 className="text-xl font-bold text-white">{winWinData.semicolon.title}</h3>
              </div>
              <ul className="space-y-4">
                {winWinData.semicolon.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                    <span className="text-sm text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Win-Win 메시지 */}
          <div
            className={`flex items-center justify-center gap-3 opacity-0 translate-y-6 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "1100ms" }}
          >
            <Waypoints size={24} className="text-white/80" />
            <span className="text-base text-white/80">
              양쪽 모두에게 이득이 되는 Win-Win 파트너십
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
