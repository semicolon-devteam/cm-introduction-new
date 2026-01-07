"use client";

/**
 * ContactForm Component
 *
 * 외부 문의 폼
 */

import { useState } from "react";
import { ChevronRight } from "lucide-react";

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
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
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
      <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-brand-primary mb-2">문의가 접수되었습니다</h3>
        <p className="text-gray-light mb-4">빠른 시일 내에 답변 드리겠습니다.</p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="text-brand-primary underline hover:text-brand-primary/80"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-white mb-2">
              성함 <span className="text-brand-primary">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isPending}
              className={`${inputBase} ${inputFocus} ${errors.name ? inputError : ""}`}
              placeholder="홍길동"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-white mb-2">
              이메일 <span className="text-brand-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isPending}
              className={`${inputBase} ${inputFocus} ${errors.email ? inputError : ""}`}
              placeholder="yourname@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm text-white mb-2">
              연락처 <span className="text-brand-primary">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isPending}
              className={`${inputBase} ${inputFocus}`}
              placeholder="010-1234-5678"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm text-white mb-2">
              회사/조직명 <span className="text-brand-primary">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              disabled={isPending}
              className={`${inputBase} ${inputFocus}`}
              placeholder="회사명"
            />
          </div>
        </div>

        {/* Right Column - Message */}
        <div className="flex flex-col">
          <label htmlFor="message" className="block text-sm text-white mb-2">
            문의 내용 <span className="text-brand-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={isPending}
            rows={10}
            className={`${inputBase} ${inputFocus} flex-1 resize-none ${errors.message ? inputError : ""}`}
            placeholder="문의 내용을 간략히 작성해주세요."
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-primary/90 disabled:bg-brand-primary/50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "전송 중..." : "문의하기"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
