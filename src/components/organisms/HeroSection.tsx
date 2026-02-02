"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// 통계 데이터
const stats = [
  { value: 100, suffix: "+", label: "완료 프로젝트" },
  { value: 50, suffix: "+", label: "고객사" },
  { value: 99.9, suffix: "%", label: "만족도" },
];

// 카운트업 훅 (delay 지원)
function useCountUp(
  end: number,
  duration: number = 1500,
  startAnimation: boolean,
  delay: number = 0,
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!startAnimation) return;

    // 딜레이 후 애니메이션 시작
    const delayTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [startAnimation, delay]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // easeOutQuart for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(easeOut * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return count;
}

// 통계 카드 컴포넌트
function StatCard({
  value,
  suffix,
  label,
  delay,
  countDelay,
  startAnimation,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  countDelay: number;
  startAnimation: boolean;
}) {
  const count = useCountUp(value, 1500, startAnimation, countDelay);
  const displayValue = suffix === "%" ? count.toFixed(1) : Math.floor(count);

  return (
    <div
      className={`w-[110px] md:w-[130px] py-4 px-3 bg-[#2A2A2A]/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-center
        opacity-0 translate-y-4 transition-all duration-700 ease-out
        ${startAnimation ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-xl md:text-2xl font-bold text-[#068FFF]">
        {displayValue}
        {suffix}
      </div>
      <div className="text-[10px] md:text-xs text-gray-400 mt-1 whitespace-nowrap">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat snap-start"
      style={{
        backgroundImage: "url('/images/main/hero-bg.png')",
      }}
    >
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">
            {/* 좌측: 텍스트 영역 */}
            <div className="flex flex-col gap-6 lg:gap-8 lg:max-w-[500px]">
              {/* 태그라인 */}
              <div
                className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-[#068FFF] text-base md:text-lg font-medium">Semicolon</span>
                <span className="text-white text-base md:text-lg font-medium"> Solution</span>
              </div>

              {/* 헤드라인 */}
              <div
                className={`space-y-1 opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "400ms" }}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  당신의 커뮤니티
                </h1>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#068FFF] leading-tight">
                  우리의 솔루션
                </h1>
              </div>

              {/* 설명 텍스트 */}
              <p
                className={`text-sm md:text-base text-gray-300 leading-relaxed opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "600ms" }}
              >
                연결과 소통을 통해 모두가 쉽게 참여할 수 있는
                <br />
                <span className="text-[#068FFF] underline underline-offset-4 decoration-[#068FFF]">
                  혁신적인 커뮤니티 생태계
                </span>
                를 만듭니다.
              </p>

              {/* CTA 버튼들 */}
              <div
                className={`flex gap-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "800ms" }}
              >
                <Link
                  href="/skills"
                  className="flex items-center gap-2 px-6 py-3 bg-[#068FFF] text-white text-sm md:text-base font-medium rounded-full hover:bg-[#068FFF]/90 transition-colors"
                >
                  우리의 기술력 보기
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contacts"
                  className="px-6 py-3 border border-gray-500 text-white text-sm md:text-base font-medium rounded-full hover:bg-white/10 transition-colors"
                >
                  문의하기
                </Link>
              </div>
            </div>

            {/* 우측: 로고 + 통계 영역 */}
            <div className="flex flex-col items-center lg:items-end gap-8">
              {/* 큰 로고 */}
              <div
                className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "500ms" }}
              >
                <Image
                  src="/images/logo/logo-full.svg"
                  alt="Semicolon"
                  width={280}
                  height={88}
                  className="w-[200px] md:w-[280px] lg:w-[320px] h-auto"
                />
              </div>

              {/* 통계 카드들 */}
              <div className="flex gap-2 md:gap-3">
                {stats.map((stat, index) => (
                  <StatCard
                    key={index}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    delay={1000 + index * 150}
                    countDelay={1200 + index * 600}
                    startAnimation={isVisible}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1
          opacity-0 transition-opacity duration-700
          ${isVisible ? "opacity-100" : ""}`}
        style={{ transitionDelay: "1500ms" }}
      >
        <span className="text-[10px] text-gray-400 tracking-widest">SCROLL</span>
        <div className="w-5 h-8 border border-gray-500 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-3 bg-[#068FFF] rounded-full animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
}
