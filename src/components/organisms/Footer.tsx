"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";

const navigation = [
  { name: "홈", href: "/" },
  { name: "팀", href: "/leaders" },
  { name: "기술력", href: "/tech" },
  { name: "문의하기", href: "/contacts" },
];

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="w-full bg-[#1a1a1a] py-8 snap-start">
      <div className="w-full max-w-[1220px] mx-auto px-6 md:px-10 lg:px-20">
        {/* 상단 영역: 로고 + 네비게이션 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          {/* 로고 */}
          <Link href="/">
            <Logo size="sm" />
          </Link>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? "text-[#068FFF] font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 하단 영역: 이메일 + 저작권 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 이메일 */}
          <div className="flex items-center gap-2 text-gray-400">
            <Mail size={16} />
            <a
              href="mailto:roki@semi-colon.space"
              className="text-sm hover:text-white transition-colors"
            >
              roki@semi-colon.space
            </a>
          </div>

          {/* 저작권 */}
          <p className="text-sm text-gray-500">Copy By © SEMICOLON. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
