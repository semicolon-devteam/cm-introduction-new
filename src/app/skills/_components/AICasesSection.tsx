export function AICasesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Example</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">세미콜론의</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-4">AI 활용 사례</h2>
          <p className="text-gray-light text-sm">일상적으로 AI를 활용해 생산성을 극대화합니다</p>
        </div>

        {/* Cards Grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Card 1: AI 코드 리뷰 자동화 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <h3 className="text-white font-bold mb-2">AI 코드 리뷰 자동화</h3>
            <p className="text-gray-light text-sm mb-4">GPT-4를 활용한 실시간 코드 품질 검증</p>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ color: "#068FFF", border: "1px solid #068FFF" }}
            >
              300% 생산성 향상
            </span>
          </div>

          {/* Card 2: AI 기반 테스트 생성 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <h3 className="text-white font-bold mb-2">AI 기반 테스트 생성</h3>
            <p className="text-gray-light text-sm mb-4">자동화된 유닛 테스트 및 E2E 테스트 생성</p>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ color: "#068FFF", border: "1px solid #068FFF" }}
            >
              테스트 커버리지 90% 달성
            </span>
          </div>

          {/* Card 3: AI 문서 자동화 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <h3 className="text-white font-bold mb-2">AI 문서 자동화</h3>
            <p className="text-gray-light text-sm mb-4">코드베이스 자동 분석 및 API 문서 생성</p>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ color: "#068FFF", border: "1px solid #068FFF" }}
            >
              문서화 시간 80% 절감
            </span>
          </div>

          {/* Card 4: AI 디버깅 어시스턴트 */}
          <div
            className="rounded-xl p-6 border border-white/10"
            style={{ backgroundColor: "#12131A" }}
          >
            <h3 className="text-white font-bold mb-2">AI 디버깅 어시스턴트</h3>
            <p className="text-gray-light text-sm mb-4">버그 패턴 분석 및 자동 해결 방안 제시</p>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ color: "#068FFF", border: "1px solid #068FFF" }}
            >
              디버깅 시간 60% 단축
            </span>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8">
          <p className="text-gray-light text-xs">이 외에도 다양한 AI 도구를</p>
          <p className="text-gray-light text-xs">개발 프로세스 전반에 활용합니다</p>
        </div>
      </div>
    </section>
  );
}
