"use client";

import { useEffect, useState, useRef } from "react";
import { Users, MessageSquare, Lightbulb, Heart, Target, Zap } from "lucide-react";

// 핵심 가치 데이터
const coreValues = [
  {
    icon: Users,
    title: "연결",
    description: "사람과 사람, 커뮤니티와 기술을 연결하여 새로운 가치를 창출합니다",
  },
  {
    icon: MessageSquare,
    title: "소통",
    description: "열린 소통과 협업을 통해 최고의 솔루션을 제공합니다",
  },
  {
    icon: Lightbulb,
    title: "혁신",
    description: "끊임없는 도전과 혁신으로 더 나은 미래를 만들어 갑니다",
  },
  {
    icon: Heart,
    title: "진정성",
    description: "고객의 성공을 최우선으로 생각하며 진심을 다해 임합니다",
  },
  {
    icon: Target,
    title: "목표 지향",
    description: "명확한 목표 설정과 데이터 기반의 의사결정을 지향합니다",
  },
  {
    icon: Zap,
    title: "빠른 실행",
    description: "신속한 프로토타이핑과 애자일 방법론으로 빠르게 움직입니다",
  },
];

// 가치 카드 컴포넌트
function ValueCard({
  icon: Icon,
  title,
  description,
  delay,
  isVisible,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
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
      <div className="flex items-center gap-3 mb-3">
        <Icon size={24} className="text-gray-400" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export function CoreValuesSection() {
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
      className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#000000] to-[#0a0a0a] snap-start"
    >
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 상단 장식 */}
          <div
            className={`flex flex-col items-center mb-6 opacity-0 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500 to-[#068FFF]" />
            <div className="w-2 h-2 rounded-full bg-[#068FFF] mt-1" />
          </div>

          {/* 타이틀 영역 */}
          <div className="text-center mb-12">
            {/* 태그 */}
            <div
              className={`opacity-0 -translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Core Values</span>
            </div>

            {/* 헤드라인 */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 -translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              우리를 움직이는 가치
            </h2>

            {/* 설명 */}
            <p
              className={`text-base text-gray-400 mt-4 opacity-0 -translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "800ms" }}
            >
              세미콜론 팀이 매일 실천하는 6가지 핵심 가치입니다.
            </p>
          </div>

          {/* 가치 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreValues.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={1000 + index * 150}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
