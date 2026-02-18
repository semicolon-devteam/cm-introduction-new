"use client";

/**
 * ContactForm Component
 *
 * 외부 문의 폼 (다크 테마)
 */

import { useState } from "react";
import { ExternalLink, CheckCircle } from "lucide-react";

import { useCreateContact } from "@/app/contacts/_hooks";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: createContact, isPending } = useCreateContact();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "성함을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요.";
    }

    if (!formData.company.trim()) {
      newErrors.company = "회사/조직명을 입력해주세요.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "문의 내용을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createContact(
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        message: formData.message.trim(),
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
          });
        },
      },
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#068FFF]/10 border border-[#068FFF]/30 rounded-xl p-8 text-center">
        <CheckCircle size={48} className="text-[#068FFF] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">문의가 접수되었습니다</h3>
        <p className="text-gray-400 mb-6">빠른 시일 내에 답변 드리겠습니다.</p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="text-[#068FFF] hover:underline"
        >
          새로운 문의하기
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full px-4 py-3 bg-[#12131A] border border-white/10 rounded-lg text-white placeholder-gray-500";
  const inputFocus =
    "focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50";
  const inputError = "border-red-500 focus:border-red-500 focus:ring-red-500/50";

  return (
    <form onSubmit={handleSubmit}>
      {/* 2컬럼 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* 왼쪽: 입력 필드들 */}
        <div className="flex flex-col">
          {/* 성함 */}
          <div className="relative pb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              성함<span className="text-[#068FFF]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isPending}
              className={`w-full px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#068FFF] focus:border-transparent transition-colors ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="absolute bottom-0 left-0 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="relative pb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              이메일<span className="text-[#068FFF]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isPending}
              className={`w-full px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#068FFF] focus:border-transparent transition-colors ${
                errors.email ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="yourname@email.com"
            />
            {errors.email && (
              <p className="absolute bottom-0 left-0 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* 연락처 */}
          <div className="relative pb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              연락처<span className="text-[#068FFF]">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isPending}
              className={`w-full px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#068FFF] focus:border-transparent transition-colors ${
                errors.phone ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="010-1234-5678"
            />
            {errors.phone && (
              <p className="absolute bottom-0 left-0 text-sm text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* 회사/조직명 */}
          <div className="relative pb-6">
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
              회사/조직명<span className="text-[#068FFF]">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              disabled={isPending}
              className={`w-full px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#068FFF] focus:border-transparent transition-colors ${
                errors.company ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="회사명"
            />
            {errors.company && (
              <p className="absolute bottom-0 left-0 text-sm text-red-400">{errors.company}</p>
            )}
          </div>
        </div>

        {/* 오른쪽: 문의 내용 */}
        <div className="relative flex flex-col pb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            문의 내용<span className="text-[#068FFF]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={isPending}
            className={`w-full flex-1 min-h-[280px] px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#068FFF] focus:border-transparent transition-colors resize-none ${
              errors.message ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="문의 내용을 입력해주세요."
          />
          {errors.message && (
            <p className="absolute bottom-0 left-0 text-sm text-red-400">{errors.message}</p>
          )}
        </div>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-6 flex items-center justify-center gap-2 bg-[#068FFF] text-white py-4 px-6 rounded-lg font-medium hover:bg-[#0570CC] disabled:bg-[#068FFF]/50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "전송 중..." : "문의하기"}
        <ExternalLink size={18} />
      </button>
    </form>
  );
}
