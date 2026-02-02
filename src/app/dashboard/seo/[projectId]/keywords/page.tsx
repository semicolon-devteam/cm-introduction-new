"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 기존 /seo/[projectId]/keywords 경로를 새 통합 페이지로 리다이렉트
 */
export default function KeywordsRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  useEffect(() => {
    // 새 통합 페이지의 키워드 탭으로 리다이렉트
    router.replace(`/dashboard/seo/${projectId}?tab=keywords`);
  }, [projectId, router]);

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
      <p className="text-[#909296]">리다이렉트 중...</p>
    </div>
  );
}
