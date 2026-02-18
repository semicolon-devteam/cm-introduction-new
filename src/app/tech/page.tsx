"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import {
  TechCard,
  AIUseCasesSection,
  DifferentiationSection,
  CompetitivenessSection,
  SpecialOfferSection,
  TechContactSection,
} from "./_components";
import { techCards } from "./_data/techData";

export default function TechPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-gradient-to-b from-[#141622] to-[#000000]">
      <Header />

      {/* 첫 번째 섹션: Why Choose Semicolon */}
      <section
        ref={sectionRef}
        className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#141622] to-[#000000] pt-20 snap-start"
      >
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">
              {/* 좌측: 텍스트 영역 */}
              <div className="flex flex-col gap-6 lg:gap-8 lg:max-w-[480px]">
                {/* 태그 */}
                <div
                  className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                    ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <span className="text-[#068FFF] text-base font-medium">Why Choose</span>
                  <span className="text-white text-base font-medium"> Semicolon</span>
                </div>

                {/* 헤드라인 */}
                <div
                  className={`space-y-1 opacity-0 translate-y-6 transition-all duration-700 ease-out
                    ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                  style={{ transitionDelay: "400ms" }}
                >
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    AI 시대의 최고의
                  </h1>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    <span className="text-[#068FFF]">개발 파트너</span>
                  </h1>
                </div>

                {/* 설명 */}
                <p
                  className={`text-base text-gray-400 leading-relaxed opacity-0 translate-y-6 transition-all duration-700 ease-out
                    ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                  style={{ transitionDelay: "600ms" }}
                >
                  압도적인 생산성과 검증된 기술력으로
                  <br />
                  빠르고 정확한 솔루션을 제공합니다
                </p>

                {/* CTA 버튼 */}
                <div
                  className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                    ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                  style={{ transitionDelay: "800ms" }}
                >
                  <Link
                    href="/contacts"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#068FFF] text-white font-medium rounded-lg hover:bg-[#0570CC] transition-colors"
                  >
                    솔루션 문의하기
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>

              {/* 우측: 기술력 카드 영역 */}
              <div className="flex flex-col gap-4 lg:w-[500px]">
                {techCards.map((card, index) => (
                  <TechCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    badge={card.badge}
                    delay={600 + index * 200}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 두 번째 섹션: AI 활용 사례 */}
      <AIUseCasesSection />

      {/* 세 번째 섹션: 기술 리더십 차별화 */}
      <DifferentiationSection />

      {/* 네 번째 섹션: 경쟁력 */}
      <CompetitivenessSection />

      {/* 다섯 번째 섹션: 특별한 제안 */}
      <SpecialOfferSection />

      {/* 여섯 번째 섹션: Contact */}
      <TechContactSection />

      <Footer />
    </div>
  );
}
