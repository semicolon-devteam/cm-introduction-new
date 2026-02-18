/**
 * 미션 검증 모듈
 * 완료된 미션이 실제로 구현되었는지 사이트를 재분석하여 확인
 */

import { analyzeSite, type SiteAnalysisResult } from "./site-analyzer";

export interface VerificationResult {
  verified: boolean;
  message: string;
}

/**
 * 미션 카테고리와 제목을 기반으로 실제 구현 여부 확인
 */
export async function verifyMission(
  domain: string,
  category: string,
  title: string,
  description: string,
): Promise<VerificationResult> {
  try {
    const { issues, pageData } = await analyzeSite(domain);

    // 카테고리별 검증 로직
    switch (category) {
      case "meta":
        return verifyMetaMission(title, description, issues, pageData);
      case "content":
        return verifyContentMission(title, description, issues, pageData);
      case "image":
        return verifyImageMission(title, description, issues, pageData);
      case "technical":
        return verifyTechnicalMission(title, description, issues);
      case "link":
        return verifyLinkMission(title, description, issues);
      default:
        // 검증 불가능한 카테고리는 수동 확인 필요로 표시
        return { verified: true, message: "수동 검증이 필요한 항목입니다" };
    }
  } catch (error) {
    return {
      verified: false,
      message: `검증 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
    };
  }
}

function verifyMetaMission(
  title: string,
  _description: string,
  issues: SiteAnalysisResult["issues"],
  pageData: SiteAnalysisResult["pageData"],
): VerificationResult {
  const titleLower = title.toLowerCase();

  // title 태그 관련 미션
  if (titleLower.includes("title") || titleLower.includes("타이틀")) {
    const hasIssue = issues.some((i) => i.type === "meta" && i.message.includes("title"));
    if (!hasIssue && pageData.title && pageData.title.length >= 30 && pageData.title.length <= 60) {
      return { verified: true, message: `타이틀 적용 확인: "${pageData.title}"` };
    }
    return {
      verified: false,
      message: `타이틀 문제가 여전히 존재합니다 (현재: ${pageData.title?.length || 0}자)`,
    };
  }

  // meta description 관련 미션
  if (titleLower.includes("description") || titleLower.includes("설명")) {
    const hasIssue = issues.some((i) => i.type === "meta" && i.message.includes("description"));
    if (!hasIssue && pageData.description && pageData.description.length >= 70) {
      return { verified: true, message: `메타 설명 적용 확인 (${pageData.description.length}자)` };
    }
    return {
      verified: false,
      message: `메타 설명 문제가 여전히 존재합니다 (현재: ${pageData.description?.length || 0}자)`,
    };
  }

  // OG 태그 관련 미션
  if (
    titleLower.includes("og") ||
    titleLower.includes("open graph") ||
    titleLower.includes("소셜")
  ) {
    const hasIssue = issues.some((i) => i.message.includes("Open Graph"));
    if (!hasIssue) {
      return { verified: true, message: "Open Graph 태그가 올바르게 설정되었습니다" };
    }
    return { verified: false, message: "Open Graph 태그가 아직 불완전합니다" };
  }

  // 일반 메타 태그
  const metaIssues = issues.filter((i) => i.type === "meta");
  if (metaIssues.length === 0) {
    return { verified: true, message: "메타 태그 관련 이슈가 해결되었습니다" };
  }
  return { verified: false, message: `메타 태그 이슈 ${metaIssues.length}개 남음` };
}

function verifyContentMission(
  title: string,
  _description: string,
  issues: SiteAnalysisResult["issues"],
  pageData: SiteAnalysisResult["pageData"],
): VerificationResult {
  const titleLower = title.toLowerCase();

  // H1 태그 관련 미션
  if (titleLower.includes("h1")) {
    if (pageData.h1Count === 1) {
      return { verified: true, message: "H1 태그가 1개로 올바르게 설정되었습니다" };
    }
    return { verified: false, message: `H1 태그가 ${pageData.h1Count}개입니다 (1개 권장)` };
  }

  // 일반 콘텐츠
  const contentIssues = issues.filter((i) => i.type === "content");
  if (contentIssues.length === 0) {
    return { verified: true, message: "콘텐츠 관련 이슈가 해결되었습니다" };
  }
  return { verified: false, message: `콘텐츠 이슈 ${contentIssues.length}개 남음` };
}

function verifyImageMission(
  title: string,
  _description: string,
  issues: SiteAnalysisResult["issues"],
  pageData: SiteAnalysisResult["pageData"],
): VerificationResult {
  const titleLower = title.toLowerCase();

  // alt 속성 관련 미션
  if (titleLower.includes("alt") || titleLower.includes("이미지")) {
    if (pageData.imgWithoutAlt === 0) {
      return { verified: true, message: "모든 이미지에 alt 속성이 추가되었습니다" };
    }
    return {
      verified: false,
      message: `alt 속성이 없는 이미지가 ${pageData.imgWithoutAlt}개 남아있습니다`,
    };
  }

  // 일반 이미지
  const imageIssues = issues.filter((i) => i.type === "image");
  if (imageIssues.length === 0) {
    return { verified: true, message: "이미지 관련 이슈가 해결되었습니다" };
  }
  return { verified: false, message: `이미지 이슈 ${imageIssues.length}개 남음` };
}

function verifyTechnicalMission(
  title: string,
  _description: string,
  issues: SiteAnalysisResult["issues"],
): VerificationResult {
  const titleLower = title.toLowerCase();

  // robots.txt 관련
  if (titleLower.includes("robots")) {
    const hasIssue = issues.some((i) => i.message.includes("robots.txt"));
    if (!hasIssue) {
      return { verified: true, message: "robots.txt 파일이 확인되었습니다" };
    }
    return { verified: false, message: "robots.txt 파일이 없거나 접근할 수 없습니다" };
  }

  // sitemap.xml 관련
  if (titleLower.includes("sitemap") || titleLower.includes("사이트맵")) {
    const hasIssue = issues.some((i) => i.message.includes("sitemap"));
    if (!hasIssue) {
      return { verified: true, message: "sitemap.xml 파일이 확인되었습니다" };
    }
    return { verified: false, message: "sitemap.xml 파일이 없거나 접근할 수 없습니다" };
  }

  // 일반 기술적 이슈
  const techIssues = issues.filter((i) => i.type === "technical");
  if (techIssues.length === 0) {
    return { verified: true, message: "기술적 이슈가 해결되었습니다" };
  }
  return { verified: false, message: `기술적 이슈 ${techIssues.length}개 남음` };
}

function verifyLinkMission(
  title: string,
  _description: string,
  issues: SiteAnalysisResult["issues"],
): VerificationResult {
  const titleLower = title.toLowerCase();

  // 내부 링크 관련
  if (titleLower.includes("내부") || titleLower.includes("internal")) {
    const hasIssue = issues.some((i) => i.message.includes("내부 링크"));
    if (!hasIssue) {
      return { verified: true, message: "내부 링크가 충분히 추가되었습니다" };
    }
    return { verified: false, message: "내부 링크가 아직 부족합니다" };
  }

  // 일반 링크
  const linkIssues = issues.filter((i) => i.type === "link");
  if (linkIssues.length === 0) {
    return { verified: true, message: "링크 관련 이슈가 해결되었습니다" };
  }
  return { verified: false, message: `링크 이슈 ${linkIssues.length}개 남음` };
}
