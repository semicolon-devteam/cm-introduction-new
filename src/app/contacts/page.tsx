/**
 * Contact Page
 *
 * 외부 문의 폼 페이지
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

import { Header } from "@/components/organisms/Header";
import { ContactForm } from "./_components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact | Semicolon",
  description: "세미콜론 팀에 문의하기",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">프로젝트</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">상담이 필요하신가요?</h2>
            <p className="text-gray-light text-sm">
              세미콜론 팀이 여러분의 성공을 위해 함께하겠습니다.
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </main>

      {/* Divider */}
      <div className="bg-gradient-to-r from-brand-primary/20 via-brand-primary/40 to-brand-primary/20 py-12" />

      {/* Bottom Footer */}
      <footer className="bg-[#0a0a0f] border-t border-white/10 py-8">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left: Logo + Contact */}
            <div className="space-y-4">
              <Image
                src="/images/main/Logo.svg"
                alt="SEMICOLON"
                width={132}
                height={32}
                className="h-8 w-auto"
              />
              <div className="flex items-center gap-2 text-gray-light text-sm">
                <Mail className="w-4 h-4" />
                <span>info@semi-colon.space</span>
              </div>
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

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-light">Copy By. © SEMICOLON. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
