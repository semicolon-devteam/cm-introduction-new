/**
 * SEO 이슈 기반 액션 생성 모듈
 */

import type { WeeklyAction } from "./types";

/**
 * 이슈 기반 액션 생성
 */
export function generateActionsFromIssues(
  issues: { type: string; message: string; priority: "high" | "medium" | "low" }[],
  keywords: string[],
): WeeklyAction[] {
  const actions: WeeklyAction[] = [];
  const keyword = keywords[0] || "메인 키워드";

  // 우선순위별 정렬
  const sortedIssues = [...issues].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  for (const issue of sortedIssues.slice(0, 5)) {
    let action: WeeklyAction | null = null;

    if (issue.message.includes("title")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "Title 태그 최적화",
        description: issue.message + " - 키워드를 포함한 30-60자의 title을 작성하세요.",
        category: "meta",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "15분",
        aiTip: `"${keyword}" 키워드를 title 앞쪽에 배치하세요.`,
      };
    } else if (issue.message.includes("description")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "Meta Description 최적화",
        description: issue.message + " - 70-160자의 설명을 작성하세요.",
        category: "meta",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "15분",
        aiTip: "클릭을 유도하는 행동 유도 문구를 포함하세요.",
      };
    } else if (issue.message.includes("H1")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "H1 태그 수정",
        description: issue.message,
        category: "content",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "10분",
        aiTip: "페이지당 H1은 1개만 사용하고, 키워드를 포함시키세요.",
      };
    } else if (issue.message.includes("alt") || issue.message.includes("이미지")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "이미지 alt 태그 추가",
        description: issue.message,
        category: "image",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "30분",
        aiTip: "이미지 내용을 설명하는 자연스러운 텍스트를 사용하세요.",
      };
    } else if (issue.message.includes("robots")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "robots.txt 생성",
        description: "robots.txt 파일을 생성하여 검색엔진 크롤링을 관리하세요.",
        category: "technical",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "20분",
      };
    } else if (issue.message.includes("sitemap")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "sitemap.xml 생성",
        description: "sitemap.xml을 생성하여 검색엔진이 페이지를 쉽게 발견하게 하세요.",
        category: "technical",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "30분",
      };
    } else if (issue.message.includes("내부 링크")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "내부 링크 추가",
        description: "관련 페이지 간 내부 링크를 추가하여 사이트 구조를 강화하세요.",
        category: "link",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "1시간",
      };
    } else if (issue.message.includes("Open Graph")) {
      action = {
        id: `action-${actions.length + 1}`,
        title: "OG 태그 추가",
        description: "소셜 미디어 공유를 위한 Open Graph 태그를 추가하세요.",
        category: "meta",
        priority: issue.priority,
        status: "pending",
        estimatedTime: "20분",
      };
    }

    if (action) {
      actions.push(action);
    }
  }

  // 최소 3개 액션 보장
  if (actions.length < 3) {
    actions.push({
      id: `action-${actions.length + 1}`,
      title: `"${keyword}" 콘텐츠 작성`,
      description: `타겟 키워드 "${keyword}"를 포함한 고품질 콘텐츠를 작성하세요.`,
      category: "content",
      priority: "medium",
      status: "pending",
      estimatedTime: "2시간",
    });
  }

  return actions.slice(0, 5);
}
