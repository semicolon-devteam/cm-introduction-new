"use client";

import { useEffect, useState, useRef } from "react";

import { LeaderSliderCard } from "./LeaderSliderCard";
import { leaders } from "./leadersData";

interface OtherLeadersSectionProps {
  currentSlug: string;
}

export function OtherLeadersSection({ currentSlug }: OtherLeadersSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  // 현재 리더를 제외한 다른 리더들
  const otherLeaders = leaders.filter((leader) => leader.slug !== currentSlug);
  // 무한 스크롤을 위해 목록 복제
  const duplicatedLeaders = [...otherLeaders, ...otherLeaders];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-[#000000] to-[#0a0a14] pt-[200px] pb-20 snap-start"
    >
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {/* Title Area */}
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              다른 리더들
            </h2>
            <p
              className={`text-base text-gray-400 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              세미콜론을 이끌어가는 리더들입니다.
            </p>
          </div>
        </div>

        {/* Leaders Slider - Fixed width container */}
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          <div
            className="relative overflow-hidden pb-16"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div ref={scrollRef} className="flex gap-6 pb-2">
              {duplicatedLeaders.map((leader, index) => (
                <LeaderSliderCard
                  key={`${leader.slug}-${index}`}
                  name={leader.name}
                  nickname={leader.nickname}
                  slug={leader.slug}
                  image={leader.image}
                  roles={leader.roles}
                  delay={600 + (index % otherLeaders.length) * 150}
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
