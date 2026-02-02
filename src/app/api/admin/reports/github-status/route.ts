import { NextResponse } from "next/server";
import { checkGitHubConnection } from "@/lib/github";

export async function GET() {
  try {
    const status = await checkGitHubConnection();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "GitHub 연결 확인 실패",
    });
  }
}
