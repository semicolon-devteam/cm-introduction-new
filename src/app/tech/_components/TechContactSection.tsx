"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TechContactSection() {
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
      className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#0a0a14] to-[#141622] snap-start"
    >
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20 text-center">
          {/* 태그 */}
          <div
            className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-[#068FFF] text-base font-medium">Contact Us</span>
          </div>

          {/* 헤드라인 */}
          <div
            className={`mt-8 opacity-0 translate-y-6 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "400ms" }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              당신의 비전을
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-2">
              함께 실현하겠습니다.
            </h2>
          </div>

          {/* 설명 */}
          <div
            className={`mt-8 opacity-0 translate-y-6 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="text-base text-gray-400">세미콜론과 함께라면</p>
            <p className="text-base text-gray-400 mt-1">
              불가능해 보이는 아이디어도 현실이 됩니다.
            </p>
            <p className="text-base text-gray-400 mt-1">지금바로 여정을 시작하세요.</p>
          </div>

          {/* CTA 버튼 */}
          <div
            className={`flex items-center justify-center gap-4 mt-10 opacity-0 translate-y-6 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "800ms" }}
          >
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#068FFF] text-white font-medium rounded-lg hover:bg-[#0570CC] transition-colors"
            >
              무료상담 시작하기
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/leaders"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-500 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              기술력 살펴보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
