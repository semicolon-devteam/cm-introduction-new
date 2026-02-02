"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import {
  LeaderSliderCard,
  MemberCard,
  CultureCard,
  leaders,
  memberCategories,
  cultureItems,
} from "./_components";

export default function LeadersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMemberVisible, setIsMemberVisible] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(0);
  const [isCultureVisible, setIsCultureVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [maxScrollOffset, setMaxScrollOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const memberSectionRef = useRef<HTMLElement>(null);
  const cultureSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // 카드 크기 및 간격
  const cardWidth = 260;
  const gap = 24;
  const totalContentWidth = leaders.length * cardWidth + (leaders.length - 1) * gap;
  const maxIndex = 1; // 시작과 끝 두 위치만

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 컨테이너 너비 측정 및 최대 스크롤 오프셋 계산
  useEffect(() => {
    const calculateMaxScroll = () => {
      if (sliderContainerRef.current) {
        const containerWidth = sliderContainerRef.current.offsetWidth;
        const maxOffset = totalContentWidth - containerWidth;
        setMaxScrollOffset(Math.max(0, maxOffset));
      }
    };

    calculateMaxScroll();
    window.addEventListener("resize", calculateMaxScroll);
    return () => window.removeEventListener("resize", calculateMaxScroll);
  }, [totalContentWidth]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isMemberVisible) {
          setIsMemberVisible(true);
          memberCategories.forEach((_, index) => {
            setTimeout(
              () => setVisibleCategories((prev) => Math.max(prev, index + 1)),
              800 + index * 400,
            );
          });
        }
      },
      { threshold: 0.3 },
    );
    if (memberSectionRef.current) observer.observe(memberSectionRef.current);
    return () => observer.disconnect();
  }, [isMemberVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isCultureVisible) setIsCultureVisible(true);
      },
      { threshold: 0.3 },
    );
    if (cultureSectionRef.current) observer.observe(cultureSectionRef.current);
    return () => observer.disconnect();
  }, [isCultureVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isContactVisible) setIsContactVisible(true);
      },
      { threshold: 0.3 },
    );
    if (contactSectionRef.current) observer.observe(contactSectionRef.current);
    return () => observer.disconnect();
  }, [isContactVisible]);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-black">
      <Header />

      {/* 첫 번째 섹션: 리더 소개 */}
      <section
        ref={sectionRef}
        className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#141622] to-[#000000] pt-20 snap-start"
      >
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="text-center mb-16">
              <div
                className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-[#068FFF] text-base font-medium">Leaders</span>
              </div>
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "400ms" }}
              >
                세미콜론의
                <br />
                <span className="text-[#068FFF]">리더들</span>을 소개합니다.
              </h1>
              <p
                className={`text-base text-gray-400 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "600ms" }}
              >
                세미콜론의 리더들은 각자의 전문성으로
                <br />
                회사의 비전을 실현하고 있습니다.
              </p>
            </div>
            <div ref={sliderContainerRef} className="relative overflow-x-clip">
              <div className="pb-2">
                <div
                  className="flex gap-6 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentIndex === 0 ? 0 : maxScrollOffset}px)`,
                  }}
                >
                  {leaders.map((leader, index) => (
                    <LeaderSliderCard
                      key={index}
                      name={leader.name}
                      nickname={leader.nickname}
                      slug={leader.slug}
                      image={leader.image}
                      roles={leader.roles}
                      delay={800 + index * 150}
                      isVisible={isVisible}
                    />
                  ))}
                </div>
              </div>
              <div
                className={`flex gap-2 justify-end mt-8 opacity-0 transition-opacity duration-700 ${isVisible ? "opacity-100" : ""}`}
                style={{ transitionDelay: "1200ms" }}
              >
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${currentIndex === 0 ? "border-gray-700 text-gray-600 cursor-not-allowed" : "border-gray-500 text-white hover:bg-white/10"}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))}
                  disabled={currentIndex === maxIndex}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${currentIndex === maxIndex ? "border-gray-700 text-gray-600 cursor-not-allowed" : "border-gray-500 text-white hover:bg-white/10"}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 두 번째 섹션: 참여 구성원 */}
      <section
        ref={memberSectionRef}
        className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#000000] to-[#0a0a14] py-20 snap-start"
      >
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="text-center mb-16">
              <div
                className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${isMemberVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-[#068FFF] text-base font-medium">Member</span>
              </div>
              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isMemberVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "400ms" }}
              >
                참여 구성원
              </h2>
              <p
                className={`text-base text-gray-400 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isMemberVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "600ms" }}
              >
                다양한 분야의 전문가들이
                <br />
                세미콜론과 함께 성장하고 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {memberCategories.map((category, categoryIndex) => (
                <div key={category.title}>
                  <h3
                    className={`text-white font-medium mb-4 opacity-0 transition-all duration-500 ${visibleCategories > categoryIndex ? "opacity-100" : ""}`}
                  >
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.members.map((member, memberIndex) => (
                      <MemberCard
                        key={member.nickname}
                        nickname={member.nickname}
                        role={member.role}
                        company={member.company}
                        experience={member.experience}
                        delay={memberIndex * 150}
                        isVisible={visibleCategories > categoryIndex}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 세 번째 섹션: 문화 */}
      <section
        ref={cultureSectionRef}
        className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#0a0a14] to-[#000000] py-20 snap-start"
      >
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
            <div
              className={`flex flex-col items-center mb-6 opacity-0 transition-all duration-700 ease-out ${isCultureVisible ? "opacity-100" : ""}`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="w-px h-16 border-l border-dashed border-gray-600" />
              <div className="w-2 h-2 rounded-full bg-[#068FFF]" />
            </div>
            <div className="text-center mb-16">
              <div
                className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${isCultureVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-[#068FFF] text-base font-medium">Culture</span>
              </div>
              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isCultureVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "400ms" }}
              >
                세미콜론의
                <br />
                문화를 소개합니다.
              </h2>
              <p
                className={`text-base text-gray-400 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isCultureVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "600ms" }}
              >
                세미콜론은 언제나 연결과 소통을 우선합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cultureItems.map((item, index) => (
                <CultureCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  delay={800 + index * 150}
                  isVisible={isCultureVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 네 번째 섹션: Contact Us */}
      <section
        ref={contactSectionRef}
        className="relative h-screen w-full flex flex-col bg-gradient-to-b from-[#000000] to-[#0a0a14] py-20 snap-start"
      >
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="text-center">
              <div
                className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${isContactVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                <span className="text-[#068FFF] text-base font-medium">Contact Us</span>
              </div>
              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isContactVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "400ms" }}
              >
                당신의 비전을
                <br />
                함께 실현하겠습니다.
              </h2>
              <p
                className={`text-base text-gray-400 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isContactVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "600ms" }}
              >
                세미콜론과 함께라면 불가능해 보이는 아이디어도 현실이 됩니다.
                <br />
                지금 바로 여정을 시작하세요.
              </p>
              <div
                className={`mt-10 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isContactVisible ? "opacity-100 translate-y-0" : ""}`}
                style={{ transitionDelay: "900ms" }}
              >
                <a
                  href="/contacts"
                  className="inline-flex items-center gap-2 bg-[#068FFF] hover:bg-[#0570CC] text-white font-medium px-8 py-4 rounded-lg transition-colors"
                >
                  무료상담 시작하기
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
