import { Database, MessageSquare, Zap, Target } from "lucide-react";

export function CompetitivenessSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Competitiveness</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">타업체 대비</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-4">
            세미콜론의 경쟁력
          </h2>
          <p className="text-gray-light text-sm">모든 규모의 회사 대비 차별화된 강점</p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {/* 중소기업/스타트업 대비 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <h3 className="text-white font-bold mb-4">중소기업/스타트업 대비</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">○</span>
                <span>높은 비율의 엔지니어 리드 팀 구성</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">○</span>
                <span>속도와 기술력을 동시에 확보</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">○</span>
                <span>빠른 의사결정과 즉각적인 실행</span>
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
                <span className="text-brand-primary mt-0.5">○</span>
                <span>느린 의사결정 없는 빠른 실행력</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">○</span>
                <span>AI 기술을 이미 적극 활용 중</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-light">
                <span className="text-brand-primary mt-0.5">○</span>
                <span>혁신적인 솔루션 빠른 적용</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative dot and line */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-px h-8 border-l border-dashed border-gray-light/30" />
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
        </div>

        {/* 클라이언트 가치 제안 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">클라이언트 가치 제안</h2>
          <p className="text-gray-light text-sm">세미콜론과 협업했을 때 얻는 이점</p>
        </div>

        {/* Value Cards - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Card 1: 최고의 가성비 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold">최고의 가성비</h3>
                <p className="text-gray-light text-xs">
                  초기 단계 팀으로 저렴한 가격에 고품질 서비스 제공
                </p>
              </div>
            </div>
            <p className="text-gray-light text-sm leading-relaxed">
              당사는 포트폴리오와 실전 데이터를, 클라이언트는 빠르고 저렴한 산출물을 가져가는
              Win-Win 관계
            </p>
          </div>

          {/* Card 2: 엔지니어 직접 소통 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold">엔지니어 직접 소통</h3>
                <p className="text-gray-light text-xs">
                  전문 엔지니어가 직접 미팅 참여 및 솔루션 설계
                </p>
              </div>
            </div>
            <p className="text-gray-light text-sm leading-relaxed">
              클라이언트의 페인포인트를 정확히 이해하고 최적의 소프트웨어 솔루션 제공
            </p>
          </div>

          {/* Card 3: 빠른 개발 속도 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold">빠른 개발 속도</h3>
                <p className="text-gray-light text-xs">AI 활용으로 일반 팀 대비 3-5배 빠른 개발</p>
              </div>
            </div>
            <p className="text-gray-light text-sm leading-relaxed">
              압도적인 생산성으로 빠른 시장 진입과 비용 절감 동시 달성
            </p>
          </div>

          {/* Card 4: 정확한 요구사항 구현 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold">정확한 요구사항 구현</h3>
                <p className="text-gray-light text-xs">
                  엔지니어 직접 소통으로 잘못된 산출물 발생 최소화
                </p>
              </div>
            </div>
            <p className="text-gray-light text-sm leading-relaxed">
              기술적 이해도가 높은 커뮤니케이션으로 정확한 결과물 보장
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
