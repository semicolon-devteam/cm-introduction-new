"use client";

import { ReactNode, useState, useEffect } from "react";
import { Lock, Loader2 } from "lucide-react";

interface ReportsLayoutProps {
  children: ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("reports_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    fetch("/api/dashboard/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((response) => {
        if (response.ok) {
          sessionStorage.setItem("reports_auth", "true");
          setIsAuthenticated(true);
        } else {
          setError("비밀번호가 올바르지 않습니다");
        }
      })
      .catch(() => {
        setError("인증 중 오류가 발생했습니다");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#909296]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Mantine Card style */}
          <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
            {/* Card Body */}
            <div className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-lg bg-brand-primary/15 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-brand-primary" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-lg font-semibold text-white text-center mb-1.5">관리자 인증</h1>
              <p className="text-[#909296] text-sm text-center mb-6">
                리포트 페이지에 접근하려면 비밀번호를 입력하세요
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mantine PasswordInput style */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
                    autoFocus
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-md">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Mantine Button style */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      인증 중...
                    </>
                  ) : (
                    "로그인"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      {children}
    </div>
  );
}
