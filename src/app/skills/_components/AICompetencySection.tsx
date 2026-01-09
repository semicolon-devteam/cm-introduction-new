import { Sparkles, Users, ShieldCheck } from "lucide-react";

export function AICompetencySection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#0D0E16" }}>
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">AI 활용 경쟁력</h2>
          <p className="text-gray-light text-sm">세미콜론만의 차별화된 기술력</p>
        </div>

        {/* Cards */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* Card 1: AI 활용 압도적 생산성 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold">AI 활용 압도적 생산성</h3>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                  >
                    300% 생산성 향상
                  </span>
                </div>
                <p className="text-gray-light text-sm">
                  AI를 적극 활용해 개발 속도를 3-5배 향상시킵니다
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: 고수준 엔지니어링 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold">고수준 엔지니어링</h3>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                  >
                    시니어급 개발 역량
                  </span>
                </div>
                <p className="text-gray-light text-sm">
                  AI 의존도가 높은 팀 대비 트러블슈팅과 위기 대처 능력 보장
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: 검증된 기술력 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold">검증된 기술력</h3>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                  >
                    신뢰할 수 있는 기술력
                  </span>
                </div>
                <p className="text-gray-light text-sm">
                  AI 라벨링 사이트, 뛰어난 개발 역량으로 안정적인 결과물 보장
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
