"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "홈", href: "/" },
  // { name: "팀", href: "/leaders" },
  // { name: "기술력", href: "/tech" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]">
      <div className="max-w-screen-xl mx-auto px-6 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <div className="relative w-[165px] h-10">
              <Image
                src="/images/logo/header-logo.svg"
                alt="Semicolon"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation Menu */}
          <div className="flex items-center gap-5">
            {/* <ul className="flex items-center gap-5">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-base font-medium px-3 py-2 transition-colors",
                      pathname === item.href
                        ? "text-brand-primary font-bold"
                        : "text-brand-white hover:text-brand-primary",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul> */}

            {/* Divider */}
            {/* <div className="w-px h-4 bg-[#5C5C5C]" /> */}

            {/* Contact Button */}
            <Link
              href="/contact"
              className="px-2 py-1.5 bg-brand-white text-brand-black text-base font-medium rounded-8 hover:bg-gray-100 transition-colors"
            >
              문의하기
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
