"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// 파트너 데이터
const partners = [
  { name: "메리츠화재", logo: "/images/partners/meritz.png" },
  { name: "희림", logo: "/images/partners/heerim.png" },
  { name: "AhnLab", logo: "/images/partners/ahnlab.png" },
  { name: "Smilegate Holdings", logo: "/images/partners/smilegate.png" },
  { name: "대우건설", logo: "/images/partners/daewoo.png" },
  { name: "HDC 아이파크몰", logo: "/images/partners/hdc.png" },
  { name: "SeAH", logo: "/images/partners/seah.png" },
  { name: "Salesinsight", logo: "/images/partners/salesinsight.png" },
  { name: "일신화학공업주식회사", logo: "/images/partners/ilshin.png" },
  { name: "everon", logo: "/images/partners/everon.png" },
];

// 파트너 로고 컴포넌트
function PartnerLogo({ name, logo }: { name: string; logo: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex-shrink-0 w-[180px] h-[60px] flex items-center justify-center px-6">
      {!imageError ? (
        <Image
          src={logo}
          alt={name}
          width={150}
          height={40}
          className="object-contain max-h-[40px] w-auto opacity-70 hover:opacity-100 transition-opacity"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-gray-400 text-sm whitespace-nowrap">{name}</span>
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

      // 절반 지점에서 리셋 (무한 스크롤 효과)
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPositionRef.current >= halfWidth) {
        scrollPositionRef.current = 0;
      }

      scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, isPaused]);

  // 파트너 목록 복제 (무한 스크롤용)
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#0a0a14] to-[#141622] snap-start"
    >
      {/* 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
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
          <div
            ref={scrollRef}
            className="flex items-center gap-8 py-8 border-t border-b border-gray-800/50"
          >
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
