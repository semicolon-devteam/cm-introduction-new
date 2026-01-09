import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Content */}
        <div className="text-center">
          <p className="text-brand-primary text-sm tracking-widest mb-6">Contact Us</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">당신의 비전을</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">함께 실현하겠습니다.</h2>
          <p className="text-gray-light text-sm mb-2">세미콜론과 함께라면</p>
          <p className="text-gray-light text-sm mb-2">불가능해 보이는 아이디어도 현실이 됩니다.</p>
          <p className="text-gray-light text-sm mb-8">지금바로 여정을 시작하세요.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg text-sm transition-colors"
            >
              무료상담 시작하기 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg text-sm transition-colors"
            >
              기술력 살펴보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
