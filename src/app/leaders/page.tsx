import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Monitor, Sparkles } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import { getAllLeaders } from "@/data/leaders";

export default function LeadersPage() {
  const leaders = getAllLeaders();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      {/* Section 1: Overview */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Overview</p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
            연결과 소통의 가치를 실현하다
          </h1>
          <p className="text-gray-light text-sm">
            세미콜론의 리더들과 함께하는 전체들을 소개합니다.
          </p>
        </div>
      </section>

      {/* Section 2: Leaders - Background */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-brand-primary text-sm tracking-widest">Background</p>
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-2">세미콜론의</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-6">
              리더들을 소개합니다.
            </h2>
            <p className="text-gray-light text-sm">
              세미콜론의 리더들은 각자의 전문성으로 회사의 비전을 실현하고 있습니다.
            </p>
          </div>

          {/* Leaders Grid - 4 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader) => (
              <Link key={leader.id} href={`/leaders/${leader.slug}`} className="group">
                {/* Profile Image - Grayscale */}
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-brand-surface">
                  <Image
                    src={leader.profileImage}
                    alt={leader.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-brand-white">{leader.name}</span>
                      <span className="text-sm text-gray-light">{leader.nickname}</span>
                    </div>
                    <span className="text-brand-primary">→</span>
                  </div>
                  {/* Skills Tags */}
                  <div className="space-y-1">
                    {leader.skills.map((skill) => (
                      <div key={skill} className="flex items-center gap-2 text-xs text-gray-light">
                        <span className="text-brand-primary">○</span>
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: 참여 구성원 */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">참여 구성원</h2>
            <p className="text-gray-light text-sm">
              다양한 분야의 전문가들이 세미콜론과 함께 성장하고 있습니다.
            </p>
          </div>

          {/* 개발자 */}
          <div className="mb-12">
            <p className="text-gray-light text-sm mb-6">개발자</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "장 현 봉",
                  role: "프론트엔드 개발",
                  company: "회사 UI/UX Designer",
                  experience: "경력 8년",
                },
                {
                  name: "강 동 현",
                  role: "프론트엔드 개발",
                  company: "회사 UI/UX Designer",
                  experience: "경력 8년",
                },
                {
                  name: "박 지 호",
                  role: "프론트엔드 개발",
                  company: "회사 UI/UX Designer",
                  experience: "경력 8년",
                },
                {
                  name: "이 안",
                  role: "백엔드 개발",
                  company: "회사 UI/UX Designer",
                  experience: "경력 8년",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden"
                  style={{ backgroundColor: "#0D0E16", padding: "16px", minHeight: "167px" }}
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-widest">{member.name}</h3>
                    <p className="text-sm" style={{ color: "#C7C7C7" }}>
                      {member.role}
                    </p>
                    <p
                      className="text-xs flex items-center gap-2 pt-2"
                      style={{ color: "#888888" }}
                    >
                      <span
                        className="flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: "#1A1A1A",
                          borderRadius: "4px",
                          width: "21px",
                          height: "21px",
                          color: "#068FFF",
                        }}
                      >
                        현
                      </span>
                      <span>{member.company}</span>
                    </p>
                    <span
                      className="inline-block mt-3 px-4 py-1.5 text-xs rounded-full"
                      style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                    >
                      #{member.experience}
                    </span>
                  </div>
                  {/* Semicolon logo - positioned to right side */}
                  <Image
                    src="/images/main/Group 22 (1) 1.png"
                    alt="SEMICOLON"
                    width={180}
                    height={180}
                    className="absolute top-1/2 right-4 -translate-y-1/2"
                    style={{ opacity: 0.15 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 디자이너 */}
          <div className="mb-12">
            <p className="text-gray-light text-sm mb-6">디자이너</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "엄 현 준",
                  role: "UI / UX 디자인",
                  company: "회사 UI/UX Designer",
                  experience: "경력 8년",
                },
                {
                  name: "이 가 연",
                  role: "UI / UX 디자인",
                  company: "회사 UI/UX Designer",
                  experience: "경력 8년",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden"
                  style={{ backgroundColor: "#0D0E16", padding: "16px", minHeight: "167px" }}
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-widest">{member.name}</h3>
                    <p className="text-sm" style={{ color: "#C7C7C7" }}>
                      {member.role}
                    </p>
                    <p
                      className="text-xs flex items-center gap-2 pt-2"
                      style={{ color: "#888888" }}
                    >
                      <span
                        className="flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: "#1A1A1A",
                          borderRadius: "4px",
                          width: "21px",
                          height: "21px",
                          color: "#068FFF",
                        }}
                      >
                        현
                      </span>
                      <span>{member.company}</span>
                    </p>
                    <span
                      className="inline-block mt-3 px-4 py-1.5 text-xs rounded-full"
                      style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                    >
                      #{member.experience}
                    </span>
                  </div>
                  {/* Semicolon logo - positioned to right side */}
                  <Image
                    src="/images/main/Group 22 (1) 1.png"
                    alt="SEMICOLON"
                    width={180}
                    height={180}
                    className="absolute top-1/2 right-4 -translate-y-1/2"
                    style={{ opacity: 0.15 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 솔루션 */}
          <div>
            <p className="text-gray-light text-sm mb-6">솔루션</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "고 권 희",
                  role: "서비스운영",
                  company: "회사 UI/UX Designer",
                  experience: "경력 8년",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden"
                  style={{ backgroundColor: "#0D0E16", padding: "16px", minHeight: "167px" }}
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-widest">{member.name}</h3>
                    <p className="text-sm" style={{ color: "#C7C7C7" }}>
                      {member.role}
                    </p>
                    <p
                      className="text-xs flex items-center gap-2 pt-2"
                      style={{ color: "#888888" }}
                    >
                      <span
                        className="flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: "#1A1A1A",
                          borderRadius: "4px",
                          width: "21px",
                          height: "21px",
                          color: "#068FFF",
                        }}
                      >
                        현
                      </span>
                      <span>{member.company}</span>
                    </p>
                    <span
                      className="inline-block mt-3 px-4 py-1.5 text-xs rounded-full"
                      style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                    >
                      #{member.experience}
                    </span>
                  </div>
                  {/* Semicolon logo - positioned to right side */}
                  <Image
                    src="/images/main/Group 22 (1) 1.png"
                    alt="SEMICOLON"
                    width={180}
                    height={180}
                    className="absolute top-1/2 right-4 -translate-y-1/2"
                    style={{ opacity: 0.15 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Culture */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto">
          {/* Decorative dot and line */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
            <div className="w-px h-16 border-l border-dashed border-gray-light/30" />
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-brand-primary text-sm tracking-widest mb-4">Culture</p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-2">세미콜론의</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-6">
              문화를 소개합니다.
            </h2>
            <p className="text-gray-light text-sm">세미콜론은 언제나 연결과 소통을 우선합니다.</p>
          </div>

          {/* Culture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: MessageSquare,
                title: "수평적 소통",
                desc: "직급과 상관없이 누구나 자유롭게 의견을 나누고 존중합니다.",
              },
              {
                icon: Monitor,
                title: "성장 지원",
                desc: "교육비 지원, 컨퍼런스 참여 등 개인의 성장을 적극 지원합니다.",
              },
              {
                icon: Sparkles,
                title: "워라밸",
                desc: "유연 근무제와 재택근무로 일과 삶의 균형을 지켜드립니다.",
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white/5 border border-white/10 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-light leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Contact Us */}
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
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-2">세미콜론과</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-6">
              함께 성장할 파트너를 찾습니다.
            </h2>
            <p className="text-gray-light text-sm mb-8 max-w-xl mx-auto">
              세미콜론은 함께 미래를 만들어갈 파트너를 기다립니다.
            </p>
            <Link href="/contacts">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-white px-6 py-2 text-sm">
                문의하기 →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
