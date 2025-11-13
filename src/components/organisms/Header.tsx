"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "홈", href: "/" },
  { name: "팀", href: "/leaders" },
  { name: "기술력", href: "/tech" },
  { name: "문의하기", href: "/contact" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-white border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-heading-3 font-bold text-brand-black">Semicolon</span>
          </Link>

          {/* Navigation Menu */}
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-body-2 text-gray-dark hover:text-brand-primary transition-colors",
                  )}
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
