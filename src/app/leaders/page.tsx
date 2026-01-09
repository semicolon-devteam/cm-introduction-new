import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Monitor, Sparkles } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import { getAllLeaders } from "@/data/leaders";
import { LeadersCarousel } from "./_components/LeadersCarousel";

export default function LeadersPage() {
  const leaders = getAllLeaders();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      {/* Section 1: Leaders - Background */}
      <section className="pt-32 pb-24 px-6">
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
            <p className="text-gray-light text-sm whitespace-pre-line">
              {"세미콜론의 리더들은 각자의 전문성으로\n회사의 비전을 실현하고 있습니다."}
            </p>
          </div>

          {/* Leaders Carousel - 3 columns with slide */}
          <LeadersCarousel leaders={leaders} />
        </div>
      </section>

      {/* Section 3: 참여 구성원 */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">참여 구성원</h2>
            <p className="text-gray-light text-sm whitespace-pre-line">
              {"다양한 분야의 전문가들이\n세미콜론과 함께 성장하고 있습니다."}
            </p>
          </div>

          {/* 3 columns: 개발자, 디자이너, 솔루션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 개발자 */}
            <div>
              <p className="text-gray-light text-sm mb-6">개발자</p>
              <div className="space-y-4">
                {[
                  {
                    name: "Bon",
                    role: "프론트엔드 개발",
                    company: "Frontend Developer",
                    experience: "경력 9년",
                  },
                  {
                    name: "Dwight",
                    role: "프론트엔드 개발",
                    company: "Frontend Developer",
                    experience: "경력 10년",
                  },
                  {
                    name: "Joshua",
                    role: "프론트엔드 개발",
                    company: "Frontend Developer",
                    experience: "경력 5년",
                  },
                  {
                    name: "Bae",
                    role: "백엔드 개발",
                    company: "Backend Developer",
                    experience: "경력 5년",
                  },
                  {
                    name: "Kai",
                    role: "개발",
                    company: "Software Developer",
                    experience: "경력 3년",
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden"
                    style={{ backgroundColor: "#0D0E16", padding: "16px", minHeight: "140px" }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-widest">
                        {member.name}{" "}
                        <span className="text-sm font-normal text-gray-400">{member.role}</span>
                      </h3>
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
                      className="absolute top-1/2 right-0 -translate-y-1/2"
                      style={{ opacity: 0.15 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 디자이너 */}
            <div>
              <p className="text-gray-light text-sm mb-6">디자이너</p>
              <div className="space-y-4">
                {[
                  {
                    name: "Yeon",
                    role: "UI / UX 디자인",
                    company: "UI/UX Designer",
                    experience: "경력 8년",
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden"
                    style={{ backgroundColor: "#0D0E16", padding: "16px", minHeight: "140px" }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-widest">
                        {member.name}{" "}
                        <span className="text-sm font-normal text-gray-400">{member.role}</span>
                      </h3>
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
                      className="absolute top-1/2 right-0 -translate-y-1/2"
                      style={{ opacity: 0.15 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 솔루션 */}
            <div>
              <p className="text-gray-light text-sm mb-6">솔루션</p>
              <div className="space-y-4">
                {[
                  {
                    name: "Goni",
                    role: "서비스운영",
                    company: "Service Operations",
                    experience: "경력 5년",
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden"
                    style={{ backgroundColor: "#0D0E16", padding: "16px", minHeight: "140px" }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-widest">
                        {member.name}{" "}
                        <span className="text-sm font-normal text-gray-400">{member.role}</span>
                      </h3>
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
                      className="absolute top-1/2 right-0 -translate-y-1/2"
                      style={{ opacity: 0.15 }}
                    />
                  </div>
                ))}
              </div>
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
            <p className="text-gray-light text-sm whitespace-pre-line">
              {"세미콜론은 언제나\n연결과 소통을 우선합니다."}
            </p>
          </div>

          {/* Culture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: MessageSquare,
                title: "수평적 소통",
                desc: "직급과 상관없이 누구나 자유롭게\n의견을 나누고 존중합니다.",
              },
              {
                icon: Monitor,
                title: "성장 지원",
                desc: "교육비 지원, 컨퍼런스 참여 등\n개인의 성장을 적극 지원합니다.",
              },
              {
                icon: Sparkles,
                title: "워라밸",
                desc: "유연 근무제와 재택근무로\n일과 삶의 균형을 지켜드립니다.",
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
                  <p className="text-sm text-gray-light leading-relaxed whitespace-pre-line">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Contact Us */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Content */}
          <div className="text-center">
            <p className="text-brand-primary text-sm tracking-widest mb-4">Contact Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-2">당신의 비전을</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-6">
              함께 실현하겠습니다.
            </h2>
            <p className="text-gray-light text-sm mb-8 max-w-xl mx-auto whitespace-pre-line">
              {
                "세미콜론과 함께라면\n불가능해 보이는 아이디어도 현실이 됩니다.\n지금 바로 여정을 시작하세요."
              }
            </p>
            <Link href="/contacts">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-white px-6 py-2 text-sm">
                무료상담 시작하기 →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
