"use client";

import { useEffect, useState, useRef } from "react";
import { CheckSquare, Users, Heart, Clock } from "lucide-react";

// 성과 데이터
const results = [
  {
    icon: CheckSquare,
    value: "100+",
    label: "완료 프로젝트",
  },
  {
    icon: Users,
    value: "50+",
    label: "고객사",
  },
  {
    icon: Heart,
    value: "99.9%",
    label: "만족도",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "기술 지원",
  },
];

// 성과 카드 컴포넌트
function ResultCard({
  icon: Icon,
  value,
  label,
  delay,
  isVisible,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  label: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <div
      className={`aspect-square flex flex-col items-center justify-center p-6 bg-[#1a3a5c]/60 backdrop-blur-sm border border-[#2a5a8c]/50 rounded-2xl
        opacity-0 translate-y-8 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* 아이콘 */}
      <div className="w-12 h-12 rounded-lg bg-[#1a3a5c] border border-[#2a5a8c]/50 flex items-center justify-center mb-4">
        <Icon size={24} className="text-white/80" />
      </div>

      {/* 수치 */}
      <div className="text-2xl md:text-3xl font-bold text-white mb-2">{value}</div>

      {/* 라벨 */}
      <div className="text-sm text-white/60">{label}</div>
    </div>
  );
}

export function ResultSection() {
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
      className="relative h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat snap-start"
      style={{
        backgroundImage: "url('/images/main/contact-bg.png')",
      }}
    >
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="text-center mb-16">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#7dd3fc] text-base font-medium">Result</span>
            </div>

            {/* 헤드라인 */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              숫자로 보는 세미콜론
            </h2>

            {/* 설명 */}
            <p
              className={`text-base text-white/60 mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              우리의 성과를 객관적인 지표로 확인하세요
            </p>
          </div>

          {/* 성과 카드 그리드 */}
          <div className="flex justify-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[900px]">
              {results.map((result, index) => (
                <ResultCard
                  key={index}
                  icon={result.icon}
                  value={result.value}
                  label={result.label}
                  delay={800 + index * 150}
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
