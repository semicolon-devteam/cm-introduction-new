"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "홈", href: "/" },
  { name: "팀소개", href: "/leaders" },
  { name: "기술력", href: "/skills" },
  { name: "문의하기", href: "/contacts" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
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

            {/* Desktop Navigation Menu */}
            <ul className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-gray-light hover:text-brand-white transition-colors",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-white"
              aria-label="메뉴 열기"
            >
              <Menu className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Full-screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0f] md:hidden">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <Link href="/" onClick={closeMenu} className="flex items-center">
              <Image
                src="/images/main/Logo.svg"
                alt="SEMICOLON"
                width={132}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <button onClick={closeMenu} className="p-2 text-white" aria-label="메뉴 닫기">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
            <ul className="flex flex-col items-center gap-12">
              {navigation.map((item, index) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "text-xl font-medium transition-colors",
                      index === 0 ? "text-brand-primary" : "text-white hover:text-brand-primary",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
