import Link from "next/link";
import { Users, MessageCircle, Lightbulb, Heart, Target, Zap } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { SemicolonHero } from "@/components/organisms/SemicolonHero";
import { Button } from "@/components/atoms/Button";
import { getAllLeaders } from "@/data/leaders";

import { StatsSection, PartnersSection, JourneySection } from "./_components";
import { HomeLeadersSection } from "./_components/HomeLeadersSection";

export default function HomePage() {
  const leaders = getAllLeaders();

  const coreValues = [
    {
      icon: Users,
      title: "연결",
      desc: "사람과 사람, 커뮤니티와 기술을 연결하여\n새로운 가치를 창출합니다",
    },
    {
      icon: MessageCircle,
      title: "소통",
      desc: "열린 소통과 협업을 통해 최고의\n솔루션을 제공합니다",
    },
    {
      icon: Lightbulb,
      title: "혁신",
      desc: "끊임없는 도전과 혁신으로 더 나은\n미래를 만들어 갑니다",
    },
    {
      icon: Heart,
      title: "진정성",
      desc: "고객의 성공을 최우선으로 생각하며\n진심을 다해 임합니다",
    },
    {
      icon: Target,
      title: "목표 지향",
      desc: "명확한 목표 설정과 데이터 기반의\n의사결정을 지향합니다",
    },
    {
      icon: Zap,
      title: "빠른 실행",
      desc: "신속한 프로토타이핑과 애자일 방법론으로\n빠르게 움직입니다",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <SemicolonHero />

      {/* Section 2: Introduction */}
      <section className="py-16 md:py-24 px-6 border-b border-white/10">
        <div className="max-w-screen-xl mx-auto">
          {/* Mobile: Single column, Desktop: Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
            {/* Title, Description, and Buttons (Desktop: left column) */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-brand-white leading-tight">
                  당신의 커뮤니티
                </h2>
                <p className="text-brand-primary text-3xl md:text-5xl font-bold">우리의 솔루션</p>
              </div>
              <div className="space-y-4 pt-2">
                <p className="text-brand-primary text-sm">
                  <span className="text-brand-primary">AI 시대</span>, 개발은 더 빨라져야 합니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  우리는 AI를 적극 활용해 일반 팀 대비{" "}
                  <span className="text-brand-primary">3-5배 빠른 개발 속도</span>를 자랑합니다.
                  하지만 속도만으로는 부족합니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  AI 도구가 해결하지 못하는 복잡한 아키텍처 문제, 예상치 못한 버그, 성능 최적화...
                  이런 순간에 필요한 것은 <span className="text-brand-primary">검증된 기술력</span>
                  입니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  10년 이상의 경력을 가진 리드 엔지니어가 직접 프로젝트를 이끌며, 대규모 트래픽
                  처리와 마이크로서비스 아키텍처 경험을 바탕으로 안정적이고 확장 가능한 시스템을
                  구축합니다.
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  무엇보다 <span className="text-brand-primary">초기 단계 팀</span>이기에 가능한
                  특별한 제안이 있습니다. 우리는 포트폴리오와 실력 데이터를, 클라이언트는 빠르고
                  저렴한 고품질 산출물을 얻는{" "}
                  <span className="text-brand-primary">Win-Win 파트너십</span>, 이것이 세미콜론의
                  시작입니다.
                </p>
              </div>
              {/* Buttons - Desktop: inside left column */}
              <div className="hidden lg:flex gap-4 mt-8">
                <Link href="/skills">
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

            {/* Cards - Mobile: after description, Desktop: right column */}
            <div className="space-y-4 mt-8 lg:mt-0">
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

            {/* Buttons - Mobile only: after cards, centered */}
            <div className="flex lg:hidden gap-4 mt-8 justify-center">
              <Link href="/skills">
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
        </div>
      </section>

      {/* Section 3: Leaders */}
      <HomeLeadersSection leaders={leaders} />

      {/* Section 4: Core Values */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            {/* Decorative element - dashed line with dot */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-px h-16"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(156, 163, 175, 0.3) 50%, transparent 50%)",
                  backgroundSize: "1px 8px",
                }}
              />
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-1" />
            </div>
            <p className="text-brand-primary text-sm tracking-widest mb-4">Core Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
              우리를 움직이는 가치
            </h2>
            <p className="text-gray-light text-sm whitespace-pre-line">
              {"세미콜론 팀이 매일 실천하는\n6가지 핵심 가치입니다."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreValues.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white/5 border border-white/10 text-center md:text-left"
                >
                  <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                    <IconComponent className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-lg font-bold text-brand-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-light leading-relaxed whitespace-pre-line">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <JourneySection />
      {/* <StatsSection /> */}
      <PartnersSection />

      {/* Section 8: CTA */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
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
