import { NextRequest, NextResponse } from "next/server";
import { getProjectKeywords, getProjectConfig } from "@/app/dashboard/_config/seo-projects";

/**
 * GET /api/dashboard/seo/keywords?projectId=jungchipan
 * 프로젝트의 타겟 키워드 조회 API
 *
 * 외부 프로젝트(예: jungchipan.net)에서 웹훅 호출 시
 * 키워드를 자동으로 가져올 수 있도록 제공
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId가 필요합니다." },
        { status: 400 },
      );
    }

    const project = getProjectConfig(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: `프로젝트를 찾을 수 없습니다: ${projectId}` },
        { status: 404 },
      );
    }

    const keywords = getProjectKeywords(projectId);

    return NextResponse.json({
      success: true,
      projectId,
      domain: project.domain,
      keywords,
    });
  } catch (error) {
    console.error("Keywords API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "키워드 조회 실패",
      },
      { status: 500 },
    );
  }
}
