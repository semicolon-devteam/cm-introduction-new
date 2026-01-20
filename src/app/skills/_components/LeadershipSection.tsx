import { Link2, Wrench } from "lucide-react";

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
        <div className="mb-12 text-center">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Differentiation</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-brand-primary">10년+</span>
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">경력의 </span>
            <span className="text-brand-primary">기술 리더십</span>
          </h2>
          <p className="text-gray-light text-sm">AI 의존도가 높은 팀과의 결정적 차별점</p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl p-8 backdrop-blur-sm border border-white/10 max-w-4xl mx-auto"
          style={{ backgroundColor: "rgba(13, 14, 22, 0.8)" }}
        >
          {/* 리드 엔지니어 팀 섹션 */}
          <div className="mb-6">
            <span
              className="inline-block text-xs px-3 py-1 rounded-full mb-3"
              style={{ color: "#068FFF", border: "1px solid #068FFF" }}
            >
              300% 생산성 향상
            </span>
            <h3 className="text-brand-primary font-bold text-lg mb-2">리드 엔지니어 팀</h3>
            <p className="text-gray-light text-sm leading-relaxed">
              대규모 프로젝트 경험과 깊은 기술적 이해를 바탕으로, 복잡한 아키텍처 설계부터 위기 상황
              대처까지 완벽하게 수행합니다.
            </p>
          </div>

          {/* 위기 대처 능력 */}
          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: "rgba(18, 19, 26, 0.8)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-5 h-5 text-brand-primary" />
              <h3 className="text-white font-bold">위기 대처 능력</h3>
            </div>
            <p className="text-gray-light text-sm">
              AI가 해결 못하는 복잡한 문제의 근본 원인 파악 및 해결
            </p>
          </div>

          {/* 핵심 역량 */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(18, 19, 26, 0.8)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-brand-primary" />
              <h4 className="text-white font-bold">핵심 역량</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Full-Stack", "Architecture", "AI/ML", "DevOps", "Performance", "Database"].map(
                (skill) => (
                  <div key={skill} className="flex items-center gap-2 text-sm text-gray-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>{skill}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
