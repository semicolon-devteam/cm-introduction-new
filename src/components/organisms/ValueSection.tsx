"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

// 가치 카드 데이터
const valueCards = [
  {
    title: "검증된 기술 리더십",
    description: "10년+ 경력의 리드 엔지니어가 직접 프로젝트 리딩",
    badge: "100+ 프로젝트 완료",
  },
  {
    title: "AI 를 활용 압도적 생산성",
    description: "AI를 적극 활용해 개발 속도를 3-5배 향상",
    badge: "300% 생산성 향상",
  },
  {
    title: "최고의 가성비",
    description: "초기 단계 팀으로 저렴한 가격에 고품질 서비스",
    badge: "Win-Win 파트너십",
  },
];

// 가치 카드 컴포넌트
function ValueCard({
  title,
  description,
  badge,
  delay,
  isVisible,
}: {
  title: string;
  description: string;
  badge: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <div
      className={`p-6 bg-[#1E1E1E] border border-gray-700/50 rounded-2xl
        opacity-0 translate-y-8 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <span className="inline-block px-4 py-2 bg-[#068FFF]/20 text-[#068FFF] text-sm font-medium rounded-full border border-[#068FFF]/30">
        {badge}
      </span>
    </div>
  );
}

export function ValueSection() {
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
      className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#141622] to-[#000000] snap-start"
    >
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">
            {/* 좌측: 텍스트 영역 */}
            <div className="flex flex-col gap-6 lg:gap-8 lg:max-w-[520px]">
              {/* 헤드라인 */}
              <div
                className={`space-y-1 opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  당신의 커뮤니티
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="text-[#068FFF] underline underline-offset-8 decoration-[#068FFF]">
                    우리의 솔루션
                  </span>
                </h2>
              </div>

              {/* 서브 헤드라인 */}
              <p
                className={`text-base md:text-lg text-gray-300 opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "400ms" }}
              >
                <span className="text-[#068FFF]">AI 시대</span>, 개발은 더 빨라져야 합니다.
              </p>

              {/* 본문 텍스트 */}
              <div
                className={`space-y-4 text-sm md:text-base text-gray-400 leading-relaxed opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "600ms" }}
              >
                <p>
                  우리는 AI를 적극 활용해 일반 팀 대비{" "}
                  <span className="text-[#068FFF] underline underline-offset-2">
                    3-5배 빠른 개발 속도
                  </span>
                  를 자랑합니다.
                  <br />
                  하지만 속도만으로는 부족합니다.
                  <br />
                  AI 도구가 해결하지 못하는 복잡한 아키텍처 문제, 예상치 못한 버그, 성능 최적화...
                  이런 순간에 필요한 것은{" "}
                  <span className="text-[#068FFF] underline underline-offset-2">검증된 기술력</span>
                  입니다.
                </p>
                <p>
                  10년 이상의 경력을 가진 리드 엔지니어가 직접 프로젝트를 이끌며, 대규모 트래픽
                  처리와 마이크로서비스 아키텍처 경험을 바탕으로 안정적이고 확장 가능한 시스템을
                  구축합니다.
                </p>
                <p>
                  무엇보다{" "}
                  <span className="text-[#068FFF] underline underline-offset-2">초기 단계 팀</span>
                  이기에 가능한 특별한 제안이 있습니다. 우리는 포트폴리오와 실험 데이터를,
                  클라이언트는 빠르고 저렴한 고품질 산출물을 얻는{" "}
                  <span className="text-[#068FFF] underline underline-offset-2">
                    Win-Win 파트너십
                  </span>
                  . 이것이 세미콜론의 시작입니다.
                </p>
              </div>

              {/* CTA 버튼들 */}
              <div
                className={`flex gap-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "800ms" }}
              >
                <Link
                  href="/tech"
                  className="flex items-center gap-2 px-6 py-3 bg-[#068FFF] text-white text-sm md:text-base font-medium rounded-full hover:bg-[#068FFF]/90 transition-colors"
                >
                  기술력 자세히 보기
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/leaders"
                  className="px-6 py-3 border border-gray-500 text-white text-sm md:text-base font-medium rounded-full hover:bg-white/10 transition-colors"
                >
                  팀 만나보기
                </Link>
              </div>
            </div>

            {/* 우측: 가치 카드 영역 */}
            <div className="flex flex-col gap-4 lg:w-[400px]">
              {valueCards.map((card, index) => (
                <ValueCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  badge={card.badge}
                  delay={400 + index * 300}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
