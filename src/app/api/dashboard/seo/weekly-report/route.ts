import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries?: { query: string; clicks: number; impressions: number }[];
  topPages?: { page: string; clicks: number; impressions: number }[];
}

interface AnalyticsData {
  users: number;
  sessions: number;
  pageviews: number;
  bounceRate: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, domain, keywords, searchConsoleData, analyticsData, previousWeekData } =
      body as {
        projectId: string;
        domain: string;
        keywords: string[];
        searchConsoleData?: SearchConsoleData;
        analyticsData?: AnalyticsData;
        previousWeekData?: {
          searchConsole?: SearchConsoleData;
          analytics?: AnalyticsData;
        };
      };

    // 변화율 계산
    const calculateChange = (current: number, previous: number): string => {
      if (!previous) return "N/A";
      const change = ((current - previous) / previous) * 100;
      const sign = change >= 0 ? "+" : "";
      return `${sign}${change.toFixed(1)}%`;
    };

    // 기본 리포트 데이터 구성
    const reportDate = new Date();
    const weekStart = new Date(reportDate);
    weekStart.setDate(reportDate.getDate() - 7);

    const reportSummary = {
      period: {
        start: weekStart.toISOString().split("T")[0],
        end: reportDate.toISOString().split("T")[0],
      },
      searchConsole: searchConsoleData
        ? {
            clicks: searchConsoleData.clicks,
            impressions: searchConsoleData.impressions,
            ctr: `${(searchConsoleData.ctr * 100).toFixed(2)}%`,
            position: searchConsoleData.position.toFixed(1),
            clicksChange: previousWeekData?.searchConsole
              ? calculateChange(searchConsoleData.clicks, previousWeekData.searchConsole.clicks)
              : "N/A",
            impressionsChange: previousWeekData?.searchConsole
              ? calculateChange(
                  searchConsoleData.impressions,
                  previousWeekData.searchConsole.impressions,
                )
              : "N/A",
          }
        : null,
      analytics: analyticsData
        ? {
            users: analyticsData.users,
            sessions: analyticsData.sessions,
            pageviews: analyticsData.pageviews,
            bounceRate: `${analyticsData.bounceRate.toFixed(1)}%`,
            usersChange: previousWeekData?.analytics
              ? calculateChange(analyticsData.users, previousWeekData.analytics.users)
              : "N/A",
          }
        : null,
      keywords: keywords.slice(0, 5),
    };

    // AI를 통한 인사이트 생성
    let aiInsights = null;
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      try {
        const groq = new Groq({ apiKey });

        const prompt = `당신은 SEO 전문가입니다. 다음 주간 SEO 데이터를 분석하고 인사이트를 제공해주세요.

## 사이트 정보
- 도메인: ${domain}
- 기간: ${reportSummary.period.start} ~ ${reportSummary.period.end}

## 타겟 키워드
${keywords.map((k, i) => `${i + 1}. ${k}`).join("\n")}

## Search Console 데이터
${
  reportSummary.searchConsole
    ? `- 클릭: ${reportSummary.searchConsole.clicks} (${reportSummary.searchConsole.clicksChange})
- 노출: ${reportSummary.searchConsole.impressions} (${reportSummary.searchConsole.impressionsChange})
- CTR: ${reportSummary.searchConsole.ctr}
- 평균 순위: ${reportSummary.searchConsole.position}`
    : "데이터 없음"
}

## Analytics 데이터
${
  reportSummary.analytics
    ? `- 사용자: ${reportSummary.analytics.users} (${reportSummary.analytics.usersChange})
- 세션: ${reportSummary.analytics.sessions}
- 페이지뷰: ${reportSummary.analytics.pageviews}
- 이탈률: ${reportSummary.analytics.bounceRate}`
    : "데이터 없음"
}

## 요청사항
다음 형식의 JSON으로 응답해주세요 (JSON만 출력):

{
  "summary": "전체 요약 (2-3문장)",
  "highlights": [
    "주요 성과 1",
    "주요 성과 2",
    "주요 성과 3"
  ],
  "concerns": [
    "개선 필요 사항 1",
    "개선 필요 사항 2"
  ],
  "recommendations": [
    {
      "priority": "high/medium/low",
      "action": "권장 조치",
      "expectedImpact": "예상 효과"
    }
  ],
  "nextWeekFocus": "다음 주 집중 포인트"
}`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";

        try {
          const cleanedResponse = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          aiInsights = JSON.parse(cleanedResponse);
        } catch {
          // JSON 파싱 실패 시 무시
        }
      } catch (error) {
        console.error("AI insight generation failed:", error);
      }
    }

    // Markdown 리포트 생성
    const markdownReport = generateMarkdownReport(domain, reportSummary, aiInsights);

    return NextResponse.json({
      success: true,
      report: {
        projectId,
        domain,
        generatedAt: reportDate.toISOString(),
        summary: reportSummary,
        aiInsights,
        markdown: markdownReport,
      },
    });
  } catch (error) {
    console.error("Weekly report error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "리포트 생성 실패",
      },
      { status: 500 },
    );
  }
}

function generateMarkdownReport(
  domain: string,
  summary: {
    period: { start: string; end: string };
    searchConsole: {
      clicks: number;
      impressions: number;
      ctr: string;
      position: string;
      clicksChange: string;
      impressionsChange: string;
    } | null;
    analytics: {
      users: number;
      sessions: number;
      pageviews: number;
      bounceRate: string;
      usersChange: string;
    } | null;
    keywords: string[];
  },
  aiInsights: {
    summary: string;
    highlights: string[];
    concerns: string[];
    recommendations: {
      priority: string;
      action: string;
      expectedImpact: string;
    }[];
    nextWeekFocus: string;
  } | null,
): string {
  let report = `# 📊 SEO 주간 리포트 - ${domain}

**기간**: ${summary.period.start} ~ ${summary.period.end}
**생성일**: ${new Date().toLocaleDateString("ko-KR")}

---

## 🎯 타겟 키워드
${summary.keywords.map((k) => `- ${k}`).join("\n")}

---

`;

  if (summary.searchConsole) {
    report += `## 📈 Search Console 성과

| 지표 | 값 | 변화 |
|------|-----|------|
| 클릭 | ${summary.searchConsole.clicks.toLocaleString()} | ${summary.searchConsole.clicksChange} |
| 노출 | ${summary.searchConsole.impressions.toLocaleString()} | ${summary.searchConsole.impressionsChange} |
| CTR | ${summary.searchConsole.ctr} | - |
| 평균 순위 | ${summary.searchConsole.position} | - |

---

`;
  }

  if (summary.analytics) {
    report += `## 📊 Analytics 성과

| 지표 | 값 | 변화 |
|------|-----|------|
| 사용자 | ${summary.analytics.users.toLocaleString()} | ${summary.analytics.usersChange} |
| 세션 | ${summary.analytics.sessions.toLocaleString()} | - |
| 페이지뷰 | ${summary.analytics.pageviews.toLocaleString()} | - |
| 이탈률 | ${summary.analytics.bounceRate} | - |

---

`;
  }

  if (aiInsights) {
    report += `## 🤖 AI 분석 인사이트

### 요약
${aiInsights.summary}

### ✅ 주요 성과
${aiInsights.highlights.map((h) => `- ${h}`).join("\n")}

### ⚠️ 개선 필요 사항
${aiInsights.concerns.map((c) => `- ${c}`).join("\n")}

### 📋 권장 조치
${aiInsights.recommendations
  .map(
    (r) => `
**[${r.priority.toUpperCase()}]** ${r.action}
> 예상 효과: ${r.expectedImpact}
`,
  )
  .join("\n")}

### 🎯 다음 주 집중 포인트
${aiInsights.nextWeekFocus}

---

`;
  }

  report += `
*이 리포트는 AI에 의해 자동 생성되었습니다.*
`;

  return report;
}
