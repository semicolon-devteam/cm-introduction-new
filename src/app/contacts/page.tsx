/**
 * Contact Page
 *
 * 외부 문의 폼 페이지
 */

import { Metadata } from "next";

import { ContactForm } from "./_components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact | Semicolon",
  description: "세미콜론 팀에 문의하기",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600">
                궁금한 점이나 협업 제안이 있으시면 언제든 연락주세요.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
