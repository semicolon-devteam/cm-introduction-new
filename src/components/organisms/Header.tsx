"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "홈", href: "/" },
  { name: "팀", href: "/leaders" },
  { name: "기술력", href: "/skills" },
  { name: "문의하기", href: "/contacts" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/main/Logo.svg"
              alt="SEMICOLON"
              width={132}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Menu */}
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn("text-sm text-gray-light hover:text-brand-white transition-colors")}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
