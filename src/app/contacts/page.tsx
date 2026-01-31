"use client";

/**
 * Contact Page
 *
 * 외부 문의 폼 페이지
 */

import { useEffect, useState, useRef } from "react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { ContactForm } from "./_components";

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141622] to-[#000000]">
      <Header />

      <section ref={sectionRef} className="relative w-full pt-32 pb-20">
        <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
          {/* 타이틀 영역 */}
          <div className="mb-12">
            {/* 태그 */}
            <div
              className={`opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <span className="text-[#068FFF] text-base font-medium">Contact</span>
              <span className="text-white text-base font-medium"> us</span>
            </div>

            {/* 헤드라인 */}
            <div
              className={`mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "400ms" }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                프로젝트
              </h1>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#068FFF] leading-tight mt-2">
                문의하기
              </h1>
            </div>

            {/* 설명 */}
            <div
              className={`mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out
                ${isVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: "600ms" }}
            >
              <p className="text-base text-gray-400">세미콜론 팀이 여러분의 성공을 위해</p>
              <p className="text-base text-gray-400 mt-1">함께하겠습니다.</p>
            </div>
          </div>

          {/* 폼 카드 */}
          <div
            className={`bg-[#1E1E1E] border border-gray-700/50 rounded-2xl p-8 opacity-0 translate-y-8 transition-all duration-700 ease-out
              ${isVisible ? "opacity-100 translate-y-0" : ""}`}
            style={{ transitionDelay: "800ms" }}
          >
            {/* 폼 헤더 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">상담 문의하기</h2>
              <p className="text-sm text-gray-400">문의하실 내용을 작성해 보내주세요.</p>
              <p className="text-sm text-gray-400">빠르고 신속하게 답변드리겠습니다.</p>
            </div>

            {/* 폼 */}
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
