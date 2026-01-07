import { DollarSign, MessageSquare, Zap, Target } from "lucide-react";

export function CompetitivenessSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Decorative dot */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
          <div className="w-px h-16 border-l border-dashed border-gray-light/30" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Competitiveness</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">타업체 대비</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">세미콜론의 경쟁력</h2>
          <p className="text-gray-light text-sm">같은 규모의 회사 대비 차별화된 강점</p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-24">
          {/* 중소기업/스타트업 대비 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <h3 className="text-white font-bold mb-4">중소기업/스타트업 대비</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">›</span>
                <span>훨씬 체계적인 엔지니어링 및 설계</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">›</span>
                <span>AI/ML 기술활용 능숙에 따른 효율</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">›</span>
                <span>대형 프로젝트 경험 및 기업 대응력</span>
              </li>
            </ul>
          </div>

          {/* 중견기업/대기업 대비 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <h3 className="text-white font-bold mb-4">중견기업/대기업 대비</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">›</span>
                <span>소수 리더급 팀의 빠른 실행력</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">›</span>
                <span>의사결정이 신속해 빠른 대응 가능</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">›</span>
                <span>동일 품질 대비 합리적인 비용</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 6: 클라이언트 가치 제안 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">클라이언트 가치 제안</h2>
          <p className="text-gray-light text-sm">세미콜론과 협업하면 왜 당신이 이득</p>
        </div>

        {/* Value Cards - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Card 1: 최고의 가성비 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2">최고의 가성비</h3>
                <p className="text-gray-light text-sm leading-relaxed">
                  주니어 프리랜서/대행사 비용으로 시니어급 결과물을 제공합니다. 수정 비용, 리소스
                  절약으로 큰 절감 효과. Win-Win 관계
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: 엔지니어 직접 소통 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2">엔지니어 직접 소통</h3>
                <p className="text-gray-light text-sm leading-relaxed">
                  클라이언트의 의도와 목표에 대해 기술 팀이 직접 소통하여 더 나은 솔루션을
                  제안합니다
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: 빠른 개발 속도 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2">빠른 개발 속도</h3>
                <p className="text-gray-light text-sm leading-relaxed">
                  AI 활용으로 빠른 프로토타입과 개발 속도 향상. 일정 지연 없이 빠른 대응 가능
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: 정확한 요구사항 구현 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2">정확한 요구사항 구현</h3>
                <p className="text-gray-light text-sm leading-relaxed">
                  클라이언트 목표와 요구 사항에 초점을 맞춰 딱 니즈에 맞는 솔루션을 제공합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
