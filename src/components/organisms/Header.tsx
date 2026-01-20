"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { Menu, X } from "lucide-react";

const navigation = [
  { name: "홈", href: "/" },
  { name: "팀", href: "/leaders" },
  { name: "기술력", href: "/tech" },
  { name: "문의하기", href: "/contacts" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#3D3D3D]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
        <nav className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo/logo-full.svg"
              alt="Semicolon"
              width={120}
              height={38}
              priority
            />
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white md:hidden"
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`relative text-[15px] font-medium transition-colors py-2 ${
                    isActive(item.href) ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#068FFF]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-[#3D3D3D] md:hidden">
          <ul className="flex flex-col items-center gap-8 pt-12">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl font-medium transition-colors ${
                    isActive(item.href) ? "text-[#068FFF]" : "text-white hover:text-[#068FFF]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
