import Link from "next/link";
import Image from "next/image";
import { Users, MessageCircle, Lightbulb, Heart, Target, Zap } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { SemicolonHero } from "@/components/organisms/SemicolonHero";
import { Button } from "@/components/atoms/Button";
import { getAllLeaders } from "@/data/leaders";

import { StatsSection, PartnersSection, JourneySection } from "./_components";

export default function HomePage() {
  const leaders = getAllLeaders();

  const coreValues = [
    {
      icon: Users,
      title: "연결",
      desc: "사람과 사람, 커뮤니티와 기술을 연결하여 새로운 가치를 창출합니다",
    },
    {
      icon: MessageCircle,
      title: "소통",
      desc: "열린 소통과 협업을 통해 최고의 솔루션을 제공합니다",
    },
    {
      icon: Lightbulb,
      title: "혁신",
      desc: "끊임없는 도전과 혁신으로 더 나은 미래를 만들어 갑니다",
    },
    {
      icon: Heart,
      title: "진정성",
      desc: "고객의 성공을 최우선으로 생각하며 진심을 다해 임합니다",
    },
    {
      icon: Target,
      title: "목표 지향",
      desc: "명확한 목표 설정과 데이터 기반의 의사결정을 지향합니다",
    },
    {
      icon: Zap,
      title: "빠른 실행",
      desc: "신속한 프로토타이핑과 애자일 방법론으로 빠르게 움직입니다",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <SemicolonHero />

      {/* Section 2: Introduction */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <p className="text-gray-light text-sm tracking-widest">SEMICOLON</p>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-white leading-tight">
                  당신의 커뮤니티
                </h2>
                <p className="text-brand-primary text-4xl md:text-5xl font-bold">우리의 솔루션</p>
              </div>
              <div className="space-y-4 pt-4">
                <p className="text-brand-primary text-sm">
                  <span className="text-brand-primary">AI 시대</span>, 개발은 더 빨라져야 합니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  우리는 AI를 적극 활용해 얻은 팀 대비{" "}
                  <span className="text-brand-white">3-5배 빠른 개발 속도</span>를 자랑합니다.
                  <br />
                  최저가 묶인단가라는 보장합니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  AI 도구가 제공하는 뛰어난 제품 설계 아이데이션, 로직 예상치 못한 버그, 성능
                  최적화.. 이런 순간
                  <br />에 필요한 것은 <span className="text-brand-primary">검증된 기술력</span>
                  입니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  10년 이상의 경력을 가진 리드 엔지니어가 직접 프로젝트를 이끌며, 대규모 트래픽
                  처리와
                  <br />
                  마이크로서비스 아키텍처 경험을 바탕으로 안정적이고 확장 가능한 시스템을
                  구축합니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  우리만의 <span className="text-brand-primary">가격 단계</span> 방식에 기능한
                  특별한 제안이 있습니다. 우리는 포트폴리오와 실력 데이
                  <br />
                  터를, 클라이언트는 빠르고 저렴한 고품질 산출물을 얻은{" "}
                  <span className="text-brand-primary">Win-Win 파트너십</span>, 이것이 세미콜론
                  <br />의 시작입니다.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Link href="/contacts">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-white px-6 py-2 text-sm">
                    기술력 자세히 보기 →
                  </Button>
                </Link>
                <Link href="/leaders">
                  <Button
                    variant="outline"
                    className="border-gray-light text-gray-light hover:bg-white/10 px-6 py-2 text-sm"
                  >
                    팀 만나보기
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-brand-white mb-2">검증된 기술 리더십</h3>
                <p className="text-sm text-gray-light mb-4">
                  10년+ 경력의 리드 엔지니어가 직접 프로젝트 리딩
                </p>
                <span className="inline-block px-3 py-1 text-xs text-brand-primary border border-brand-primary/50 rounded-full">
                  100+ 프로젝트 완료
                </span>
              </div>
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-brand-white mb-2">
                  AI 를 활용 압도적 생산성
                </h3>
                <p className="text-sm text-gray-light mb-4">
                  AI를 적극 활용해 개발 속도를 3-5배 향상
                </p>
                <span className="inline-block px-3 py-1 text-xs text-brand-primary border border-brand-primary/50 rounded-full">
                  300% 생산성 향상
                </span>
              </div>
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-brand-white mb-2">최고의 가성비</h3>
                <p className="text-sm text-gray-light mb-4">
                  초기 단계 팀으로 저렴한 가격에 고품질 서비스
                </p>
                <span className="inline-block px-3 py-1 text-xs text-brand-primary border border-brand-primary/50 rounded-full">
                  Win-Win 파트너십
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Leaders */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <p className="text-brand-primary text-sm tracking-widest mb-4">Background</p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
              세미콜론을 이끄는 리더들
            </h2>
            <p className="text-gray-light text-sm">
              세미콜론의 리더들은 각자의 전문성으로 회사의 비전을 실현하고 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader) => (
              <Link key={leader.id} href={`/leaders/${leader.slug}`} className="group">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-brand-surface">
                  <Image
                    src={leader.profileImage}
                    alt={leader.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-brand-white">{leader.name}</span>
                      <span className="text-sm text-gray-light">{leader.nickname}</span>
                    </div>
                    <span className="text-brand-primary">→</span>
                  </div>
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

      {/* Section 4: Core Values */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-px h-16 border-l border-dashed border-gray-light/30" />
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
          </div>
          <div className="text-center mb-16">
            <p className="text-brand-primary text-sm tracking-widest mb-4">Core Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
              우리를 움직이는 가치
            </h2>
            <p className="text-gray-light text-sm">
              세미콜론 팀이 매일 실천하는 6가지 핵심 가치입니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreValues.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-brand-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-light leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <JourneySection />
      <StatsSection />
      <PartnersSection />

      {/* Section 8: CTA */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-px h-16 border-l border-dashed border-gray-light/30" />
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
          </div>
          <div className="text-center">
            <p className="text-brand-primary text-sm tracking-widest mb-4">Contact Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-2">당신의 비전을</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-6">
              함께 실현하겠습니다.
            </h2>
            <p className="text-gray-light text-sm mb-8 max-w-xl mx-auto">
              세미콜론과 함께라면 불가능해 보이는 아이디어도 현실이 됩니다.
              <br />
              지금바로 여정을 시작하세요.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contacts">
                <Button className="bg-brand-primary hover:bg-brand-primary/90 text-brand-white px-6 py-2 text-sm">
                  무료상담 시작하기 →
                </Button>
              </Link>
              <Link href="/skills">
                <Button
                  variant="outline"
                  className="border-gray-light text-gray-light hover:bg-white/10 px-6 py-2 text-sm"
                >
                  기술력 살펴보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
