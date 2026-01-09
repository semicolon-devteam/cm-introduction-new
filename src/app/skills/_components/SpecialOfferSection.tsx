import { Link2 } from "lucide-react";

export function SpecialOfferSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Blue gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0a4a7c 0%, #0d5a94 50%, #1a6aa8 100%)",
        }}
      />

      <div className="max-w-screen-xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Special</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">사업 초기 단계팀의</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-4">특별한 제안</h2>
          <p className="text-white/70 text-sm">
            저렴한 가격에도 최고 품질의 서비스를 제공할 수 있는 이유
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {/* 클라이언트 혜택 */}
          <div className="rounded-xl p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-xs text-white">
                ✓
              </span>
              <h3 className="text-white font-bold">클라이언트 혜택</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>빠른 개발 속도</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>저렴한 가격</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>고품질 산출물</span>
              </li>
            </ul>
          </div>

          {/* 세미콜론 혜택 */}
          <div className="rounded-xl p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-xs text-white">
                ✓
              </span>
              <h3 className="text-white font-bold">세미콜론 혜택</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>포트폴리오 구축</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>실전 데이터 확보</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>레퍼런스 축적</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-white/80 text-sm">
            <Link2 className="w-4 h-4" />
            <span>양쪽 모두에게 이득이 되는 Win-Win 파트너십</span>
          </div>
        </div>
      </div>
    </section>
  );
}
