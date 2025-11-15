"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Button } from "@/components/atoms/Button";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 성함 검증
    if (!formData.name.trim()) {
      newErrors.name = "성함을 입력해주세요.";
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 연락처 검증
    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요.";
    } else if (!/^[\d-]+$/.test(formData.phone)) {
      newErrors.phone = "올바른 연락처 형식이 아닙니다.";
    }

    // 회사/조직명 검증
    if (!formData.company.trim()) {
      newErrors.company = "회사/조직명을 입력해주세요.";
    }

    // 문의 내용 검증
    if (!formData.message.trim()) {
      newErrors.message = "문의 내용을 입력해주세요.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "문의 내용을 최소 10자 이상 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Async submission without await
    void (async () => {
      try {
        // API 연동: 이메일 전송
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send email");
        }

        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });
        setErrors({});

        // 3초 후 성공 메시지 초기화
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } catch (error) {
        console.error("Form submission error:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-brand-surface rounded-8 p-8 md:p-12">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Personal Info */}
        <div className="space-y-8">
          {/* 성함 */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-body-1 text-gray-light">
              성함*
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isSubmitting}
            />
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-body-1 text-gray-light">
              이메일*
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="yourname@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting}
            />
          </div>

          {/* 연락처 */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-body-1 text-gray-light">
              연락처*
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              disabled={isSubmitting}
            />
          </div>

          {/* 회사/조직명 */}
          <div className="space-y-2">
            <label htmlFor="company" className="block text-body-1 text-gray-light">
              회사/조직명*
            </label>
            <Input
              id="company"
              name="company"
              type="text"
              placeholder="회사명"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Right Column - Message & Submit */}
        <div className="space-y-8">
          {/* 문의 내용 */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-body-1 text-gray-light">
              문의 내용*
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="문의 내용을 입력해주세요."
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-white text-body-2 font-semibold py-3 px-3 rounded-8 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>전송 중...</span>
              </>
            ) : (
              <>
                <span>문의하기</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-8 text-green-500 text-body-2 text-center">
              문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-8 text-red-500 text-body-2 text-center">
              문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
