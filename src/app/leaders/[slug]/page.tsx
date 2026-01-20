import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, ExternalLink, Briefcase, Target } from "lucide-react";
import Image from "next/image";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { getLeaderBySlug, getOtherLeaders } from "@/data/leaders";
import { RadarChart } from "../_components/RadarChart";
import { ProjectsCarousel } from "../_components/ProjectsCarousel";
import { OtherLeadersCarousel } from "../_components/OtherLeadersCarousel";

interface LeaderPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LeaderPage({ params }: LeaderPageProps) {
  const { slug } = await params;
  const leader = getLeaderBySlug(slug);

  if (!leader) {
    notFound();
  }

  const otherLeaders = getOtherLeaders(slug);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Back Button */}
          <Link
            href="/leaders"
            className="inline-flex items-center gap-2 text-gray-light hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">팀 페이지로 돌아가기</span>
          </Link>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0D0E16" }}>
                {/* Profile Image */}
                <div className="relative aspect-square bg-brand-surface">
                  {leader.profileImage ? (
                    <Image
                      src={leader.profileImage}
                      alt={`${leader.name} profile`}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                      <span className="text-6xl text-gray-light">{leader.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h1 className="text-2xl font-bold text-white">{leader.nickname}</h1>
                    <span className="text-gray-light">{leader.name}</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm text-gray-light mb-4">
                    <Mail className="w-4 h-4 text-brand-primary" />
                    <span>{leader.slug}@semi-colon.space</span>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    {leader.skills.map((skill) => (
                      <div key={skill} className="flex items-center gap-2 text-sm text-gray-light">
                        <span className="text-brand-primary">○</span>
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* 한줄 소개 */}
              <div className="rounded-xl p-6" style={{ backgroundColor: "#0D0E16" }}>
                <h2 className="text-center text-gray-light text-sm mb-4">한줄 소개</h2>
                <p className="text-center text-brand-primary text-lg whitespace-pre-line">
                  &quot;{leader.oneLiner}&quot;
                </p>
              </div>

              {/* 대표 프로젝트 */}
              <div className="rounded-xl p-6" style={{ backgroundColor: "#0D0E16" }}>
                <h2 className="text-gray-light text-sm mb-4">대표 프로젝트</h2>
                <ProjectsCarousel projects={leader.projects} />
              </div>
            </div>
          </div>

          {/* Bottom Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* 전문이력 */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#0D0E16" }}>
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center mb-3">
                  <Briefcase className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-white font-bold">전문이력</h2>
              </div>
              <ul className="space-y-3">
                {leader.professionalHistory.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-light">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 기술력 */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#0D0E16" }}>
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center mb-3">
                  <Briefcase className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-white font-bold">기술력</h2>
              </div>
              {/* Radar Chart */}
              <RadarChart technicalSkills={leader.technicalSkills} />
            </div>

            {/* 주요 업무 영역 */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#0D0E16" }}>
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-white font-bold">주요 업무 영역</h2>
              </div>
              <ul className="space-y-3">
                {leader.workAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-light">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 다른 리더들 Section */}
          {otherLeaders.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">다른 리더들</h2>
                <p className="text-gray-light text-sm whitespace-pre-line">
                  {"세미콜론을 이끌어가는\n리더들 입니다."}
                </p>
              </div>

              <OtherLeadersCarousel leaders={otherLeaders} />
            </div>
          )}
        </div>
      </div>

      {/* Contact Us Section */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Decorative dot and line */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-px h-16 border-l border-dashed border-gray-light/30" />
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
            <div className="w-px h-16 border-l border-dashed border-gray-light/30" />
          </div>

          {/* Content */}
          <div className="text-center">
            <p className="text-brand-primary text-sm tracking-widest mb-4">Contact Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              세미콜론과 함께 성장할 파트너를 찾습니다.
            </h2>
            <p className="text-gray-light text-sm mb-8 max-w-xl mx-auto whitespace-pre-line">
              {"세미콜론은 함께 미래를 만들어갈\n파트너를 기다립니다."}
            </p>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-lg text-sm transition-colors"
            >
              문의하기 <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
