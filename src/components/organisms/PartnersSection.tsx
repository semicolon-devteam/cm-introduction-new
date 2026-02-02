"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// 파트너 데이터
const partners = [
  { name: "정치판", logo: "/images/partners/jungchipan.png" },
  { name: "링크타", logo: "/images/partners/linkta.png" },
  { name: "PS", logo: "/images/partners/ps-logo.png" },
  { name: "Keep", logo: "/images/partners/keep-logo.png" },
  { name: "민주노총", logo: "/images/partners/minjunochong.png" },
  { name: "차곡", logo: "/images/partners/chagok.png" },
  { name: "Coin Talk", logo: "/images/partners/cointalk.png" },
];

// 파트너 로고 컴포넌트
function PartnerLogo({ name, logo }: { name: string; logo: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex-shrink-0 h-[96px] flex items-center justify-center bg-white/90 px-6">
      {!imageError ? (
        <Image
          src={logo}
          alt={name}
          width={150}
          height={48}
          className="object-contain max-h-[48px] w-auto"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-gray-600 text-sm whitespace-nowrap">{name}</span>
      )}
    </div>
  );
}

export function PartnersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0); // 현재 스크롤 위치 저장

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

  // 자동 스크롤 애니메이션
  useEffect(() => {
    if (!isVisible || isPaused) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const speed = 0.5; // 스크롤 속도 (픽셀/프레임)

    const animate = () => {
      scrollPositionRef.current += speed;

      // 1/4 지점에서 리셋 (무한 스크롤 효과)
      const resetPoint = scrollContainer.scrollWidth / 4;
      if (scrollPositionRef.current >= resetPoint) {
        scrollPositionRef.current = 0;
      }

      scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, isPaused]);

  // 파트너 목록 복제 (무한 스크롤용 - 4배 복제로 매끄러운 연결)
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#0a0a14] to-[#141622] snap-start"
    >
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="text-center mb-32">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Partners</span>
            </div>

            {/* 헤드라인 */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              함께하는 파트너들
            </h2>

            {/* 설명 */}
            <p
              className={`text-base text-gray-400 mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              세미콜론은 다양한 파트너들과 함께합니다
            </p>
          </div>
        </div>

        {/* 파트너 배너 (전체 너비) */}
        <div
          className={`w-full overflow-hidden opacity-0 transition-all duration-700 ease-out
            ${isVisible ? "opacity-100" : ""}`}
          style={{ transitionDelay: "800ms" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div ref={scrollRef} className="flex items-center border-t border-b border-gray-800/50">
            {duplicatedPartners.map((partner, index) => (
              <PartnerLogo
                key={`${partner.name}-${index}`}
                name={partner.name}
                logo={partner.logo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
