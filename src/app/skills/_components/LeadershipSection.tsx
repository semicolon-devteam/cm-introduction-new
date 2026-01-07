import { AlertTriangle } from "lucide-react";

export function LeadershipSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6, 143, 255, 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="text-brand-primary">10년+</span>
            <span className="text-white"> 경력의</span>
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">기술 리더십</h2>
          <p className="text-gray-light text-sm">AI 의존도가 높은 팀과의 결정적 차별점</p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl p-8 backdrop-blur-sm border border-white/10 max-w-4xl mx-auto"
          style={{ backgroundColor: "rgba(13, 14, 22, 0.8)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* 리드 엔지니어 팀 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ color: "#068FFF", border: "1px solid #068FFF" }}
                  >
                    분석 시간 80% 절감
                  </span>
                </div>
                <h3 className="text-brand-primary font-bold text-lg mb-2">리드 엔지니어 팀</h3>
                <p className="text-gray-light text-sm leading-relaxed">
                  대규모 프로젝트 경험과 깊은 기술적 이해를 바탕으로, 복잡한 아키텍처 설계부터 위기
                  상황 대처까지 완벽하게 수행합니다.
                </p>
              </div>

              {/* 위기 대처 능력 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-white font-bold">위기 대처 능력</h3>
                </div>
                <p className="text-gray-light text-sm leading-relaxed">
                  AI가 해결 못하는 복잡한 문제의 근본 원인 파악 및 해결
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(6, 143, 255, 0.1)" }}
                >
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-xs text-gray-light mt-1">프로젝트</div>
                </div>
                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(6, 143, 255, 0.1)" }}
                >
                  <div className="text-2xl font-bold text-white">100만+</div>
                  <div className="text-xs text-gray-light mt-1">DAU</div>
                </div>
                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(6, 143, 255, 0.1)" }}
                >
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-gray-light mt-1">지원</div>
                </div>
              </div>

              {/* 핵심 역량 */}
              <div>
                <h4 className="text-white font-bold mb-3">핵심 역량</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["Full-Stack", "Architecture", "AI/ML", "DevOps", "Performance", "Database"].map(
                    (skill) => (
                      <div key={skill} className="flex items-center gap-2 text-sm text-gray-light">
                        <span className="text-brand-primary">○</span>
                        <span>{skill}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
