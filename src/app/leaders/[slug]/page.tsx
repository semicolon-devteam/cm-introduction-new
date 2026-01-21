import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, ExternalLink, Briefcase, Target } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { getLeaderBySlug, getOtherLeaders } from "@/data/leaders";
import { RadarChart } from "../_components/RadarChart";

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
                <p className="text-center text-brand-primary text-lg">
                  &quot;{leader.oneLiner}&quot;
                </p>
              </div>

              {/* 대표 프로젝트 */}
              <div className="rounded-xl p-6" style={{ backgroundColor: "#0D0E16" }}>
                <h2 className="text-white font-bold mb-4">대표 프로젝트</h2>

                {leader.projects.length > 0 ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Project Thumbnail */}
                    <div className="w-full md:w-40 h-32 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex-shrink-0 overflow-hidden">
                      {leader.projects[0].thumbnail ? (
                        <Image
                          src={leader.projects[0].thumbnail}
                          alt={leader.projects[0].name}
                          width={160}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="w-12 h-12 text-brand-primary/50" />
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-brand-primary text-sm">
                          {leader.projects[0].year}
                        </span>
                        <span className="text-white">|</span>
                        {leader.projects[0].link ? (
                          <a
                            href={leader.projects[0].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                          >
                            <span className="text-white font-bold">{leader.projects[0].name}</span>
                            <ExternalLink className="w-4 h-4 text-gray-light" />
                          </a>
                        ) : (
                          <span className="text-white font-bold">{leader.projects[0].name}</span>
                        )}
                      </div>
                      <p className="text-gray-light text-sm leading-relaxed mb-4">
                        {leader.projects[0].description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {leader.projects[0].tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full"
                            style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-light text-sm">등록된 프로젝트가 없습니다.</p>
                )}
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
                <p className="text-gray-light text-sm">세미콜론을 이끌어가는 리더들 입니다.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {otherLeaders.map((otherLeader) => (
                  <Link
                    key={otherLeader.id}
                    href={`/leaders/${otherLeader.slug}`}
                    className="group"
                  >
                    {/* Profile Image */}
                    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 mb-3">
                      {otherLeader.profileImage ? (
                        <Image
                          src={otherLeader.profileImage}
                          alt={`${otherLeader.name} profile`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900">
                          <span className="text-4xl text-gray-600">
                            {otherLeader.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{otherLeader.name}</span>
                        <span className="text-sm text-gray-500">| {otherLeader.nickname}</span>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-brand-primary rotate-180" />
                    </div>
                    <div className="space-y-1">
                      {otherLeader.skills.slice(0, 2).map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">세미콜론과</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              함께 성장할 파트너를 찾습니다.
            </h2>
            <p className="text-gray-light text-sm mb-8 max-w-xl mx-auto">
              세미콜론은 함께 미래를 만들어갈 파트너를 기다립니다.
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
