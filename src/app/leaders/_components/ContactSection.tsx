"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a0a14] to-[#000000] pt-[200px] pb-20 snap-start"
    >
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="text-center">
            {/* Tag */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Contact Us</span>
            </div>

            {/* Title */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              당신의 비전을
              <br />
              함께 실현하겠습니다.
            </h2>

            {/* Description */}
            <p
              className={`text-base text-gray-400 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              세미콜론과 함께라면
              <br />
              불가능해 보이는 아이디어도 현실이 됩니다.
              <br />
              지금바로 여정을 시작하세요.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex gap-4 justify-center mt-10 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "800ms" }}
            >
              <Link
                href="/contacts"
                className="inline-flex items-center gap-2 bg-[#068FFF] hover:bg-[#0570CC] text-white font-medium px-8 py-4 rounded-lg transition-colors"
              >
                무료상담 시작하기
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/tech"
                className="inline-flex items-center px-8 py-4 border border-gray-500 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                기술력 살펴보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
