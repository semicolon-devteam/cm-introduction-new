import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { SkillBadge } from "@/components/atoms/SkillBadge";
import { ContentCard } from "@/components/molecules/ContentCard";
import { LeaderCard } from "@/components/molecules/LeaderCard";
import { Button } from "@/components/atoms/Button";
import { getLeaderBySlug, getOtherLeaders } from "@/data/leaders";

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
    <div className="min-h-screen bg-gradient-to-b from-[#141622] to-[#000000]">
      <Header />

      <div className="pt-24 pb-20">
        {/* Leader Profile Section */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Profile Image */}
              <div className="w-full lg:w-auto flex-shrink-0">
                <div className="relative w-64 h-64 mx-auto lg:mx-0 rounded-8 overflow-hidden bg-brand-surface">
                  <Image
                    src={leader.profileImage}
                    alt={`${leader.name} profile`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-heading-1 font-bold text-brand-white mb-2">{leader.name}</h1>
                  <p className="text-heading-3 text-gray-medium mb-4">
                    {leader.nickname} · {leader.position}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {leader.skills.map((skill) => (
                      <SkillBadge key={skill}>{skill}</SkillBadge>
                    ))}
                  </div>
                </div>

                {/* One-liner */}
                <div className="mt-8 p-6 rounded-8 bg-brand-surface text-brand-white">
                  <p className="text-body-1">{leader.oneLiner}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional History */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto">
            <ContentCard title="전문이력">
              <ul className="space-y-2">
                {leader.professionalHistory.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-brand-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          </div>
        </section>

        {/* Leadership Philosophy */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto">
            <ContentCard title="리더 철학">
              <p className="leading-relaxed">{leader.philosophy}</p>
            </ContentCard>
          </div>
        </section>

        {/* Work Areas */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto">
            <ContentCard title="주요 업무 영역">
              <ul className="space-y-2">
                {leader.workAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-brand-primary">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          </div>
        </section>

        {/* Representative Projects */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto">
            <ContentCard title="대표 프로젝트">
              <div className="space-y-6">
                {leader.projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-brand-primary font-bold">{project.year}</span>
                      <h4 className="text-body-1 font-bold text-brand-white">{project.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-4 bg-brand-black text-caption text-gray-light"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-body-2">{project.description}</p>
                  </div>
                ))}
              </div>
            </ContentCard>
          </div>
        </section>

        {/* Other Leaders */}
        {otherLeaders.length > 0 && (
          <section className="px-6 py-12 bg-brand-surface">
            <div className="max-w-screen-xl mx-auto">
              <h2 className="text-heading-2 font-bold text-brand-white mb-8 text-center">
                다른 리더들
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherLeaders.map((otherLeader) => (
                  <LeaderCard
                    key={otherLeader.id}
                    slug={otherLeader.slug}
                    name={otherLeader.name}
                    nickname={otherLeader.nickname}
                    profileImage={otherLeader.profileImage}
                    skills={otherLeader.skills}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Team Page Button */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto text-center">
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-gray-light text-gray-light hover:bg-brand-surface hover:text-brand-white"
              >
                <ArrowLeft className="w-5 h-5" />팀 페이지로 돌아가기
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
