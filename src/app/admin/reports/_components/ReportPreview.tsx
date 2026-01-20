"use client";

import { useState, useEffect } from "react";
import { Copy, Check, FileText, Github, Loader2, ExternalLink } from "lucide-react";

interface ReportPreviewProps {
  content: string;
  reportType?: "po" | "operations" | "revenue" | "goals";
  reportTitle?: string;
}

export function ReportPreview({ content, reportType, reportTitle }: ReportPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    url?: string;
    error?: string;
  } | null>(null);
  const [isGithubConnected, setIsGithubConnected] = useState<boolean | null>(null);

  // GitHub 연결 상태 확인
  useEffect(() => {
    fetch("/api/admin/reports/github-status")
      .then((res) => res.json())
      .then((data) => setIsGithubConnected(data.connected))
      .catch(() => setIsGithubConnected(false));
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        alert("복사에 실패했습니다");
      });
  };

  const submitToGitHub = async () => {
    if (!content || !reportType) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/admin/reports/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: reportType,
          title: reportTitle || `${reportType.toUpperCase()} 리포트`,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "제출에 실패했습니다");
      }

      setSubmitResult({ success: true, url: data.issue.url });
    } catch (err) {
      setSubmitResult({
        success: false,
        error: err instanceof Error ? err.message : "제출에 실패했습니다",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-8 h-fit">
      {/* Mantine Card style */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#373A40]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-primary" />
            <h2 className="text-base font-semibold text-white">미리보기</h2>
          </div>
          {/* Mantine Button style */}
          <button
            onClick={copyToClipboard}
            className={`h-9 px-4 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-brand-primary hover:bg-brand-primary/90 text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                복사하기
              </>
            )}
          </button>
        </div>

        {/* Card Body - Code block style */}
        <div className="p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-[#141517] rounded-md p-4 border border-[#2C2E33] overflow-auto max-h-[600px] font-mono leading-relaxed">
            {content || (
              <span className="text-[#5c5f66] italic">
                리포트 내용을 입력하면 여기에 미리보기가 표시됩니다.
              </span>
            )}
          </pre>
        </div>

        {/* GitHub 제출 섹션 */}
        {reportType && (
          <div className="px-4 pb-4">
            <div className="border-t border-[#373A40] pt-4">
              {/* 제출 결과 메시지 */}
              {submitResult && (
                <div
                  className={`mb-3 px-3 py-2 rounded-md text-sm ${
                    submitResult.success
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {submitResult.success ? (
                    <div className="flex items-center justify-between">
                      <span>GitHub Issue로 제출되었습니다!</span>
                      {submitResult.url && (
                        <a
                          href={submitResult.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline"
                        >
                          보러가기 <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    submitResult.error
                  )}
                </div>
              )}

              {/* GitHub 제출 버튼 */}
              {isGithubConnected === false ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-md">
                  <Github className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-400">
                    GitHub 연결이 필요합니다 (.env.local 설정)
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => void submitToGitHub()}
                  disabled={!content || isSubmitting || isGithubConnected === null}
                  className="w-full h-10 flex items-center justify-center gap-2 bg-[#25262b] hover:bg-[#2c2d33] border border-[#373A40] hover:border-[#4a4d54] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium text-white transition-all duration-150"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      제출 중...
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      GitHub Issue로 제출
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
