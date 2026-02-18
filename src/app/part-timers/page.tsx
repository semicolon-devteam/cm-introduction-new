/**
 * Part-timers Page
 *
 * 파트타이머 목록 페이지 (SSR + CSR 하이브리드)
 */

import { Metadata } from "next";

import { PartTimersSection } from "./_components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Part-timers | Semicolon",
  description: "세미콜론 팀의 파트타이머들을 소개합니다.",
};

export default function PartTimersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Part-timers
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              세미콜론 팀과 함께하는 파트타이머들입니다.
            </p>
          </div>
        </div>
        <PartTimersSection />
      </div>
    </main>
  );
}
