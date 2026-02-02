import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-brand-primary text-sm tracking-widest mb-4">Why Choose Semicolon</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          AI 시대의 최고의 개발 파트너
        </h1>
        <p className="text-gray-light text-sm mb-8">
          압도적인 생산성과 검증된 기술력으로
          <br />
          빠르고 정확한 솔루션을 제공합니다
        </p>
        <Link
          href="/contacts"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg text-sm transition-colors"
        >
          솔루션 문의하기 <ExternalLink className="w-4 h-4" />
        </Link>

        {/* Decorative dot */}
        <div className="flex flex-col items-center mt-16">
          <div className="w-2 h-2 rounded-full bg-brand-primary" />
        </div>
      </div>
    </section>
  );
}
