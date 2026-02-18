"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, ScrollText, Layers } from "lucide-react";

import { Leader } from "@/models/leader";
import { AnimatedRadarChart } from "./AnimatedRadarChart";
import { ProjectSlider } from "./ProjectSlider";

interface LeaderDetailSectionProps {
  leader: Leader;
}

export function LeaderDetailSection({ leader }: LeaderDetailSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen pt-[120px] pb-12 snap-start">
      {/* 기존 organisms 패턴과 동일한 컨테이너 구조 */}
      <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
        {/* Back Button Row - 별도 영역 */}
        <div className="mb-10">
          <Link
            href="/leaders"
            className={`inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-500 py-4 opacity-0 ${isVisible ? "opacity-100" : ""}`}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-base font-semibold">팀 페이지로 돌아가기</span>
          </Link>
        </div>

        {/* Main Content - CSS Grid로 정확한 컬럼 너비 지정 */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-[40px]">
          {/* Left Column - Profile */}
          <div
            className={`opacity-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100" : ""}`}
            style={{ transitionDelay: "100ms" }}
          >
            {/* 1. Profile Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden">
              {leader.profileImage ? (
                <Image
                  src={leader.profileImage}
                  alt={`${leader.name} profile`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-6xl text-gray-500">{leader.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* 2. Name + Nickname (12px gap from image, padding 12px horizontal / 6px vertical) */}
            <div className="mt-3 px-3 py-1.5">
              <span className="text-white text-xl font-medium tracking-[0.3em]">
                {leader.name.split("").join(" ")}
              </span>
              <span className="text-gray-400 text-lg ml-3">| {leader.nickname}</span>
            </div>

            {/* 3. Skills card (8px gap from name) - 배경색 #1E1E1E */}
            <div className="mt-2 rounded-xl bg-[#1E1E1E] border border-gray-700/50 p-4 space-y-2">
              {leader.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-[#068FFF]">○</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>

            {/* 4. Email card - 배경색 #1E1E1E */}
            <div className="mt-3 rounded-xl bg-[#1E1E1E] border border-gray-700/50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[#068FFF]" />
                <span>{leader.slug}@semi-colon.space</span>
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="flex flex-col gap-5 min-w-0">
            {/* One-liner - 패딩 16px, 타이틀-설명 간격 12px, 배경색 #1E1E1E */}
            <div
              className={`p-4 rounded-xl bg-[#1E1E1E] border border-gray-700/50 opacity-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100" : ""}`}
              style={{ transitionDelay: "300ms" }}
            >
              <h2 className="text-center text-gray-400 text-sm mb-3">한줄 소개</h2>
              <p className="text-center text-[#068FFF] text-xl whitespace-pre-line">
                &quot;{leader.oneLiner}&quot;
              </p>
            </div>

            {/* Projects - 패딩 16px, 타이틀-이미지 간격 12px */}
            <div
              className={`rounded-xl p-4 bg-[#1E1E1E] border border-gray-700/50 flex-1 flex flex-col opacity-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100" : ""}`}
              style={{ transitionDelay: "500ms" }}
            >
              <h2 className="text-gray-400 text-sm mb-3">대표 프로젝트</h2>
              <div className="flex-1">
                <ProjectSlider projects={leader.projects} isVisible={isVisible} delay={600} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards Grid - 상단과 40px 간격 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Professional History */}
          <div
            className={`rounded-xl p-4 bg-[#1E1E1E] border border-gray-700/50 opacity-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100" : ""}`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-white font-bold mb-3">전문이력</h2>
              <div className="w-12 h-12 rounded-lg bg-[#068FFF]/20 flex items-center justify-center">
                <ScrollText className="w-6 h-6 text-[#068FFF]" />
              </div>
            </div>
            <ul className="space-y-3">
              {leader.professionalHistory.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-gray-600 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Skills - Radar Chart */}
          <div
            className={`rounded-xl p-4 bg-[#1E1E1E] border border-gray-700/50 h-[298px] opacity-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100" : ""}`}
            style={{ transitionDelay: "900ms" }}
          >
            <h2 className="text-white font-bold text-center mb-4">기술력</h2>
            <AnimatedRadarChart
              technicalSkills={leader.technicalSkills.map((skill) => ({
                name: skill.name,
                level: skill.level * 20,
              }))}
              delay={1000}
              isVisible={isVisible}
            />
          </div>

          {/* Work Areas */}
          <div
            className={`rounded-xl p-4 bg-[#1E1E1E] border border-gray-700/50 opacity-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100" : ""}`}
            style={{ transitionDelay: "1100ms" }}
          >
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-white font-bold mb-3">주요 업무 영역</h2>
              <div className="w-12 h-12 rounded-lg bg-[#068FFF]/20 flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#068FFF]" />
              </div>
            </div>
            <ul className="space-y-3">
              {leader.workAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-gray-600 mt-0.5">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
