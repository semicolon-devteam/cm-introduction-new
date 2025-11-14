import Link from "next/link";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { SemicolonHero } from "@/components/organisms/SemicolonHero";
import { LeaderCard } from "@/components/molecules/LeaderCard";
import { Button } from "@/components/atoms/Button";
import { getAllLeaders } from "@/data/leaders";

export default function HomePage() {
  const leaders = getAllLeaders();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141622] to-[#000000]">
      <Header />

      {/* Hero Section with Animation */}
      <SemicolonHero />

      {/* Leaders Section */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 font-bold text-brand-white mb-4">Team Leaders</h2>
            <p className="text-body-2 text-gray-medium">
              세미콜론의 리더들은 각자의 전문성으로 회사의 비전을 실현하고 있습니다.
            </p>
          </div>

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* <div className="flex md:hidden overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory"> */}
            {leaders.map((leader) => (
              <div key={leader.id} className="flex-shrink-0 snap-start">
                <LeaderCard
                  slug={leader.slug}
                  name={leader.name}
                  nickname={leader.nickname}
                  profileImage={leader.profileImage}
                  skills={leader.skills}
                />
              </div>
            ))}
            {/* </div> */}
            {/* <div className="hidden md:contents">
              {leaders.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  slug={leader.slug}
                  name={leader.name}
                  nickname={leader.nickname}
                  profileImage={leader.profileImage}
                  skills={leader.skills}
                />
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Part-timers Section */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 font-bold text-brand-white mb-4">참여 구성원</h2>
            <p className="text-body-2 text-gray-light">
              다양한 분야의 전문가들이 세미콜론과 함께 성장하고 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Yeomso", role: "UI / UX 디자이너" },
              { name: "Bon", role: "소프트웨어 엔지니어(프론트)" },
              { name: "Dwight", role: "소프트웨어 엔지니어(프론트)" },
              { name: "Yeon", role: "UI / UX 디자이너" },
              { name: "Joshua", role: "소프트웨어 엔지니어(백엔드)" },
              { name: "Goni", role: "서비스 운영" },
              { name: "Ayaan", role: "소프트웨어 엔지니어(풀스택)" },
            ].map((member, index) => (
              <div
                key={index}
                className="p-4 text-center rounded-8 bg-brand-surface text-brand-white"
              >
                <div className="text-body-2 font-bold mb-1">{member.name}</div>
                <div className="text-caption text-gray-light">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 px-6 bg-brand-surface text-brand-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 font-bold mb-4">Our Culture</h2>
            <p className="text-body-2 text-gray-light">Semicolon이 추구하는 팀 문화입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-8 bg-brand-black">
              <h3 className="text-heading-3 font-bold mb-4">수평적 소통</h3>
              <p className="text-body-2 text-gray-light">
                직급과 상관없이 누구나 자유롭게 의견을 나누고 존중받습니다.
              </p>
            </div>

            <div className="p-8 rounded-8 bg-brand-black">
              <h3 className="text-heading-3 font-bold mb-4">성장 지원</h3>
              <p className="text-body-2 text-gray-light">
                교육비 지원, 컨퍼런스 참석 등 개인의 성장을 적극 지원합니다.
              </p>
            </div>

            <div className="p-8 rounded-8 bg-brand-black">
              <h3 className="text-heading-3 font-bold mb-4">워라밸</h3>
              <p className="text-body-2 text-gray-light">
                유연 근무제와 재택근무로 일과 삶의 균형을 지킵니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-heading-2 font-bold text-brand-white mb-6">
            세미콜론과 함께 성장할 파트너를 찾습니다.
          </h2>
          <p className="text-body-1 text-gray-medium mb-8">
            세미콜론은 함께 미래를 만들어갈 파트너를 기다립니다.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary/90 text-brand-white px-8 py-4 text-body-1"
            >
              문의하기
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
