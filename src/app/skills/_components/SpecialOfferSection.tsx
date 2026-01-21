export function SpecialOfferSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Blue gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a4a7c 0%, #0d5a94 50%, #1a6aa8 100%)",
        }}
      />

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">사업 초기 단계팀의</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">특별한 제안</h2>
          <p className="text-white/70 text-sm">
            저렴한 가격에도 최고 품질의 서비스를 제공할 수 있는 이유
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {/* 클라이언트 혜택 */}
          <div className="rounded-xl p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-white font-bold mb-4">클라이언트 혜택</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>시간 비용 미포함</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>레퍼런스 용도 활용 가능</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>고품질 서비스 제공</span>
              </li>
            </ul>
          </div>

          {/* 세미콜론 혜택 */}
          <div className="rounded-xl p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-white font-bold mb-4">세미콜론 혜택</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>포트폴리오 추가</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>레퍼런스 확보</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <span className="text-brand-primary">🤝</span>
            <span className="text-white/80 text-sm">
              상호 실리적에 기반한 진정한 Win-Win 제휴사업
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
