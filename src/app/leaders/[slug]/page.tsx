import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import { LeadersRepository } from "@/app/leaders/_repositories";

interface LeaderPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LeaderPage({ params }: LeaderPageProps) {
  const { slug } = await params;
  const repository = new LeadersRepository();
  const leader = await repository.getLeaderBySlug(slug);

  if (!leader) {
    notFound();
  }

  // 다른 리더들 조회
  const { leaders: allLeaders } = await repository.getLeaders();
  const otherLeaders = allLeaders.filter((l) => l.slug !== slug);

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
                <div className="relative w-64 h-64 mx-auto lg:mx-0 rounded-lg overflow-hidden bg-gray-800">
                  {leader.profileImage ? (
                    <Image
                      src={leader.profileImage}
                      alt={`${leader.name} profile`}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-6xl text-gray-400">
                        {leader.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-white mb-2">{leader.name}</h1>
                  <p className="text-xl text-gray-400 mb-4">
                    {leader.nickname && `${leader.nickname} · `}{leader.position}
                  </p>
                  {leader.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {leader.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                {leader.summary && (
                  <div className="mt-8 p-6 rounded-lg bg-gray-800 text-white">
                    <p className="text-lg">{leader.summary}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Career History */}
        {leader.career.length > 0 && (
          <section className="px-6 py-12">
            <div className="max-w-screen-xl mx-auto">
              <div className="p-6 rounded-lg bg-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">경력</h2>
                <div className="space-y-4">
                  {leader.career.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.company}</p>
                        <p className="text-gray-400">{item.role}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Message */}
        {leader.message && (
          <section className="px-6 py-12">
            <div className="max-w-screen-xl mx-auto">
              <div className="p-6 rounded-lg bg-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">메시지</h2>
                <blockquote className="p-6 bg-blue-900/30 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-300 italic text-lg">&quot;{leader.message}&quot;</p>
                </blockquote>
              </div>
            </div>
          </section>
        )}

        {/* Other Leaders */}
        {otherLeaders.length > 0 && (
          <section className="px-6 py-12 bg-gray-900/50">
            <div className="max-w-screen-xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                다른 리더들
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherLeaders.map((otherLeader) => (
                  <Link
                    key={otherLeader.id}
                    href={`/leaders/${otherLeader.slug}`}
                    className="group flex flex-col gap-4 transition-transform hover:scale-105"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800">
                      {otherLeader.profileImage ? (
                        <Image
                          src={otherLeader.profileImage}
                          alt={`${otherLeader.name} profile`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <span className="text-4xl text-gray-400">
                            {otherLeader.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{otherLeader.name}</h3>
                      {otherLeader.nickname && (
                        <span className="text-sm text-gray-400">{otherLeader.nickname}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {otherLeader.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs bg-blue-900/50 text-blue-300 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Team Page Button */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto text-center">
            <Link href="/leaders">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-gray-400 text-gray-400 hover:bg-gray-800 hover:text-white"
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
