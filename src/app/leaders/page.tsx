import Link from "next/link";
import Image from "next/image";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { LeadersRepository } from "@/app/leaders/_repositories";

export default async function LeadersPage() {
  const repository = new LeadersRepository();
  const { leaders } = await repository.getLeaders();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141622] to-[#000000]">
      <Header />

      <div className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-6 py-16">
          <div className="max-w-screen-xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Leaders
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              세미콜론을 이끄는 리더들을 소개합니다
            </p>
          </div>
        </section>

        {/* Leaders Grid */}
        <section className="px-6 py-12">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => (
                <Link
                  key={leader.id}
                  href={`/leaders/${leader.slug}`}
                  className="group bg-gray-800/50 rounded-lg overflow-hidden transition-transform hover:scale-105"
                >
                  {/* Profile Image */}
                  <div className="relative w-full aspect-square bg-gray-700">
                    {leader.profileImage ? (
                      <Image
                        src={leader.profileImage}
                        alt={`${leader.name} profile`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-gray-500">
                          {leader.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                      {leader.nickname && (
                        <span className="text-gray-400">({leader.nickname})</span>
                      )}
                    </div>
                    <p className="text-blue-400 font-medium mb-4">{leader.position}</p>

                    {leader.summary && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {leader.summary}
                      </p>
                    )}

                    {/* Skills */}
                    {leader.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {leader.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 text-xs bg-blue-900/50 text-blue-300 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {leader.skills.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full">
                            +{leader.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
