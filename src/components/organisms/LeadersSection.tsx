"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// 리더 데이터 (이미지는 추후 업로드)
const leaders = [
  {
    name: "서 정 원",
    nickname: "Garden",
    image: "/images/leaders/leader-1.png",
    roles: ["시스템 아키텍처", "기술 통합 리드"],
  },
  {
    name: "전 준 영",
    nickname: "Reus",
    image: "/images/leaders/leader-2.png",
    roles: ["프론트 리드 엔지니어", "협업 매니저"],
  },
  {
    name: "노 영 록",
    nickname: "Roki",
    image: "/images/leaders/leader-3.png",
    roles: ["서비스총괄", "그로스 디렉터"],
  },
  {
    name: "강 용 준",
    nickname: "Kyago",
    image: "/images/leaders/leader-4.png",
    roles: ["백엔드 리드", "기술 자문"],
  },
  {
    name: "염 현 준",
    nickname: "Yeomso",
    image: "/images/leaders/leader-5.png",
    roles: ["디자인 리드", "UX 전략"],
  },
];

// 리더 카드 컴포넌트
function LeaderCard({
  name,
  nickname,
  image,
  roles,
  delay,
  isVisible,
}: {
  name: string;
  nickname: string;
  image: string;
  roles: string[];
  delay: number;
  isVisible: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`flex-shrink-0 w-[260px] opacity-0 translate-y-8 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* 이미지 */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 mb-3">
        {!imageError && (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover z-10"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        {/* 플레이스홀더 - 이미지 로드 전이나 에러 시 표시 */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-4xl text-gray-600">{name[0]}</span>
          </div>
        )}
      </div>

      {/* 이름 + 화살표 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{name}</span>
          <span className="text-sm text-gray-500">| {nickname}</span>
        </div>
        <ArrowRight size={20} className="text-[#068FFF]" />
      </div>

      {/* 역할 */}
      <div className="space-y-1">
        {roles.map((role, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            {role}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeadersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // PC에서 4개 표시, 총 5개 → 1번만 슬라이드
  const visibleCards = 4;
  const maxIndex = Math.max(0, leaders.length - visibleCards); // 5 - 4 = 1

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

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#141622] to-[#000000] snap-start"
    >
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="mb-12">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Leaders</span>
            </div>

            {/* 헤드라인 */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              세미콜론을 이끄는 <span className="text-[#068FFF]">리더들</span>
            </h2>

            {/* 설명 */}
            <p
              className={`text-base text-gray-400 mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              세미콜론의 리더들은 각자의 전문성으로 회사의 비전을 실현하고 있습니다.
            </p>
          </div>

          {/* 리더 슬라이더 */}
          <div className="relative overflow-x-clip">
            <div className="pb-2">
              <div
                ref={sliderRef}
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 284}px)` }}
              >
                {leaders.map((leader, index) => (
                  <LeaderCard
                    key={index}
                    name={leader.name}
                    nickname={leader.nickname}
                    image={leader.image}
                    roles={leader.roles}
                    delay={800 + index * 150}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div
              className={`flex gap-2 justify-end mt-8 opacity-0 transition-opacity duration-700
                ${isVisible ? "opacity-100" : ""}`}
              style={{ transitionDelay: "1200ms" }}
            >
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors
                  ${
                    currentIndex === 0
                      ? "border-gray-700 text-gray-600 cursor-not-allowed"
                      : "border-gray-500 text-white hover:bg-white/10"
                  }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors
                  ${
                    currentIndex === maxIndex
                      ? "border-gray-700 text-gray-600 cursor-not-allowed"
                      : "border-gray-500 text-white hover:bg-white/10"
                  }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
