import { NextRequest, NextResponse } from "next/server";

export interface RobotsDirective {
  type: "user-agent" | "disallow" | "allow" | "sitemap" | "crawl-delay" | "other";
  value: string;
  userAgent?: string;
}

export interface RobotsValidationResult {
  url: string;
  found: boolean;
  content: string;
  directives: RobotsDirective[];
  userAgents: string[];
  sitemaps: string[];
  issues: { type: "error" | "warning" | "info"; message: string }[];
  testResults?: { path: string; allowed: boolean; matchedRule?: string }[];
}

export interface RobotsValidateResponse {
  success: boolean;
  result?: RobotsValidationResult;
  error?: string;
}

// robots.txt 파싱
function parseRobotsTxt(content: string): {
  directives: RobotsDirective[];
  userAgents: string[];
  sitemaps: string[];
} {
  const directives: RobotsDirective[] = [];
  const userAgents: Set<string> = new Set();
  const sitemaps: string[] = [];
  let currentUserAgent = "*";

  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim().toLowerCase();
    const value = trimmed.substring(colonIndex + 1).trim();

    if (key === "user-agent") {
      currentUserAgent = value;
      userAgents.add(value);
      directives.push({ type: "user-agent", value });
    } else if (key === "disallow") {
      directives.push({ type: "disallow", value, userAgent: currentUserAgent });
    } else if (key === "allow") {
      directives.push({ type: "allow", value, userAgent: currentUserAgent });
    } else if (key === "sitemap") {
      sitemaps.push(value);
      directives.push({ type: "sitemap", value });
    } else if (key === "crawl-delay") {
      directives.push({ type: "crawl-delay", value, userAgent: currentUserAgent });
    } else {
      directives.push({ type: "other", value: `${key}: ${value}` });
    }
  }

  return { directives, userAgents: Array.from(userAgents), sitemaps };
}

// 경로 테스트
function testPath(
  path: string,
  directives: RobotsDirective[],
  userAgent: string = "*",
): { allowed: boolean; matchedRule?: string } {
  // 해당 User-Agent에 맞는 규칙 찾기
  const applicableDirectives = directives.filter(
    (d) =>
      (d.type === "allow" || d.type === "disallow") &&
      (d.userAgent === userAgent || d.userAgent === "*"),
  );

  // 가장 구체적인 매칭 규칙 찾기
  let bestMatch: { directive: RobotsDirective; specificity: number } | null = null;

  for (const directive of applicableDirectives) {
    const pattern = directive.value;
    if (!pattern) continue;

    // 간단한 패턴 매칭
    let matches = false;
    if (pattern === "/") {
      matches = true;
    } else if (pattern.endsWith("$")) {
      matches = path === pattern.slice(0, -1);
    } else if (pattern.includes("*")) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*").replace(/\$/g, "$"));
      matches = regex.test(path);
    } else {
      matches = path.startsWith(pattern);
    }

    if (matches) {
      const specificity = pattern.length;
      if (!bestMatch || specificity > bestMatch.specificity) {
        bestMatch = { directive, specificity };
      }
    }
  }

  if (bestMatch) {
    return {
      allowed: bestMatch.directive.type === "allow",
      matchedRule: `${bestMatch.directive.type}: ${bestMatch.directive.value}`,
    };
  }

  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, testPaths = [] } = body as {
      domain: string;
      testPaths?: string[];
    };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const robotsUrl = `https://${domain.replace(/^https?:\/\//, "")}/robots.txt`;
    const issues: RobotsValidationResult["issues"] = [];

    // robots.txt 가져오기
    let response: Response;
    try {
      response = await fetch(robotsUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOBot/1.0)" },
      });
    } catch {
      return NextResponse.json({
        success: true,
        result: {
          url: robotsUrl,
          found: false,
          content: "",
          directives: [],
          userAgents: [],
          sitemaps: [],
          issues: [{ type: "warning", message: "robots.txt에 접근할 수 없습니다" }],
        },
      } as RobotsValidateResponse);
    }

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        result: {
          url: robotsUrl,
          found: false,
          content: "",
          directives: [],
          userAgents: [],
          sitemaps: [],
          issues: [
            {
              type: response.status === 404 ? "warning" : "error",
              message:
                response.status === 404
                  ? "robots.txt가 없습니다. 모든 크롤러가 전체 사이트를 크롤링할 수 있습니다"
                  : `robots.txt 접근 실패 (${response.status})`,
            },
          ],
        },
      } as RobotsValidateResponse);
    }

    const content = await response.text();
    const { directives, userAgents, sitemaps } = parseRobotsTxt(content);

    // 이슈 분석
    if (content.length === 0) {
      issues.push({ type: "warning", message: "robots.txt가 비어있습니다" });
    }

    if (userAgents.length === 0) {
      issues.push({ type: "warning", message: "User-agent 지시어가 없습니다" });
    }

    if (!userAgents.includes("*")) {
      issues.push({
        type: "info",
        message: "와일드카드 User-agent(*)가 없습니다. 일부 봇이 규칙을 무시할 수 있습니다",
      });
    }

    if (sitemaps.length === 0) {
      issues.push({
        type: "warning",
        message: "Sitemap 지시어가 없습니다. sitemap.xml 위치를 명시하는 것이 좋습니다",
      });
    } else {
      issues.push({ type: "info", message: `${sitemaps.length}개의 사이트맵이 선언되어 있습니다` });
    }

    // 전체 차단 검사
    const globalDisallowAll = directives.some(
      (d) => d.type === "disallow" && d.value === "/" && d.userAgent === "*",
    );
    if (globalDisallowAll) {
      issues.push({
        type: "error",
        message: "모든 크롤러가 전체 사이트에서 차단되어 있습니다 (Disallow: /)",
      });
    }

    // 주요 봇 확인
    const majorBots = ["Googlebot", "Bingbot", "NaverBot", "Yeti"];
    const blockedBots = majorBots.filter((bot) => {
      const test = testPath("/", directives, bot);
      return !test.allowed;
    });
    if (blockedBots.length > 0) {
      issues.push({
        type: "warning",
        message: `주요 검색엔진 봇이 차단됨: ${blockedBots.join(", ")}`,
      });
    }

    // Crawl-delay 검사
    const crawlDelays = directives.filter((d) => d.type === "crawl-delay");
    if (crawlDelays.length > 0) {
      const delays = crawlDelays.map((d) => parseFloat(d.value)).filter((d) => !isNaN(d));
      const maxDelay = Math.max(...delays);
      if (maxDelay > 10) {
        issues.push({
          type: "warning",
          message: `Crawl-delay가 ${maxDelay}초로 설정되어 있습니다. 크롤링 속도가 느려질 수 있습니다`,
        });
      }
    }

    // 경로 테스트
    let testResults: RobotsValidationResult["testResults"];
    if (testPaths.length > 0) {
      testResults = testPaths.map((path) => {
        const result = testPath(path, directives);
        return { path, ...result };
      });
    }

    return NextResponse.json({
      success: true,
      result: {
        url: robotsUrl,
        found: true,
        content: content.length > 5000 ? content.substring(0, 5000) + "..." : content,
        directives,
        userAgents,
        sitemaps,
        issues,
        testResults,
      },
    } as RobotsValidateResponse);
  } catch (error) {
    console.error("Robots validate error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "robots.txt 검증 실패" },
      { status: 500 },
    );
  }
}
