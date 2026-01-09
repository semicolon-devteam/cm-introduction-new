import Link from "next/link";
import { ArrowRight, Zap, Users, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Decorative diagonal lines */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
        <div
          className="absolute w-[500px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ transform: "rotate(-45deg)", top: "20%", left: "-30%" }}
        />
        <div
          className="absolute w-[500px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ transform: "rotate(-45deg)", top: "50%", left: "-20%" }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Title & CTA */}
          <div>
            <p className="text-brand-primary text-sm tracking-widest mb-4">Why Choose Semicolon</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">AI 시대의 최고의</h1>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-6">개발 파트너</h1>
            <p className="text-gray-light text-sm mb-8 leading-relaxed">
              압도적인 생산성과 검증된 기술력으로
              <br />
              빠르고 정확한 솔루션을 제공합니다
            </p>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg text-sm transition-colors"
            >
              솔루션 문의하기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            {/* Card 1 - 검증된 기술 리더십 */}
            <div className="bg-[#12131A] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1">
                  {/* Mobile */}
                  <div className="md:hidden">
                    <h3 className="text-white font-semibold mb-1">검증된 기술 리더십</h3>
                    <p className="text-gray-light text-xs mb-3 whitespace-pre-line">
                      {"AI를 적극 활용해 개발 속도를\n3-5배 향상시킵니다"}
                    </p>
                    <span className="text-brand-primary text-xs font-medium bg-brand-primary/10 px-3 py-1 rounded-full">
                      300% 생산성 향상
                    </span>
                  </div>
                  {/* Desktop */}
                  <div className="hidden md:flex md:items-start md:justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">검증된 기술 리더십</h3>
                      <p className="text-gray-light text-xs">
                        AI를 적극 활용해 개발 속도를 3-5배 향상시킵니다
                      </p>
                    </div>
                    <span className="text-brand-primary text-xs font-medium bg-brand-primary/10 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      300% 생산성 향상
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - 고수준 엔지니어링 */}
            <div className="bg-[#12131A] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1">
                  {/* Mobile */}
                  <div className="md:hidden">
                    <h3 className="text-white font-semibold mb-1">고수준 엔지니어링</h3>
                    <p className="text-gray-light text-xs mb-3 whitespace-pre-line">
                      {"AI 의존도가 높은 팀 대비 트러블슈팅과\n위기 대처 능력 보유"}
                    </p>
                    <span className="text-brand-primary text-xs font-medium bg-brand-primary/10 px-3 py-1 rounded-full">
                      리드 엔지니어 직접 참여
                    </span>
                  </div>
                  {/* Desktop */}
                  <div className="hidden md:flex md:items-start md:justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">고수준 엔지니어링</h3>
                      <p className="text-gray-light text-xs">
                        AI 의존도가 높은 팀 대비 트러블슈팅과 위기 대처 능력 보유
                      </p>
                    </div>
                    <span className="text-brand-primary text-xs font-medium bg-brand-primary/10 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      리드 엔지니어 직접 참여
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - 검증된 기술력 */}
            <div className="bg-[#12131A] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1">
                  {/* Mobile */}
                  <div className="md:hidden">
                    <h3 className="text-white font-semibold mb-1">검증된 기술력</h3>
                    <p className="text-gray-light text-xs mb-3 whitespace-pre-line">
                      {"AI 미활용 시에도 뛰어난 개발 역량으로\n안정적인 결과물 보장"}
                    </p>
                    <span className="text-brand-primary text-xs font-medium bg-brand-primary/10 px-3 py-1 rounded-full">
                      신뢰할 수 있는 기술력
                    </span>
                  </div>
                  {/* Desktop */}
                  <div className="hidden md:flex md:items-start md:justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">검증된 기술력</h3>
                      <p className="text-gray-light text-xs">
                        AI 미활용 시에도 뛰어난 개발 역량으로 안정적인 결과물 보장
                      </p>
                    </div>
                    <span className="text-brand-primary text-xs font-medium bg-brand-primary/10 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      신뢰할 수 있는 기술력
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
