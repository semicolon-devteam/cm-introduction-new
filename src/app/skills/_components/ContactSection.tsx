import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Decorative dot and line */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
          <div className="w-px h-16 border-l border-dashed border-gray-light/30" />
        </div>

        {/* Content */}
        <div className="text-center">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Contact Us</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">세미콜론과 함께하며</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            신속하고 정확한 개발을 경험하세요
          </h2>
          <p className="text-gray-light text-sm mb-8 max-w-xl mx-auto">
            압도적인 생산성과 검증된 기술력, 합리적인 가격
            <br />
            지금 바로 시작하세요!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg text-sm transition-colors"
            >
              무료상담 시작하기 <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/leaders"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg text-sm transition-colors"
            >
              팀 소개 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
