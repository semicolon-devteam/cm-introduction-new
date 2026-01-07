import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0f] text-brand-white py-8 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-6">
            <Image
              src="/images/main/Logo.svg"
              alt="SEMICOLON"
              width={132}
              height={32}
              className="h-8 w-auto"
            />
            <p className="text-xs text-gray-light">© SEMICOLON. All rights reserved.</p>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-gray-light hover:text-brand-white transition-colors"
            >
              홈
            </Link>
            <Link
              href="/skills"
              className="text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              기술력
            </Link>
            <Link
              href="/contacts"
              className="text-sm text-gray-light hover:text-brand-white transition-colors"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
