import { NextResponse } from "next/server";

/**
 * Google AdSense API 연동
 *
 * 환경 변수 필요:
 * - GOOGLE_CLIENT_EMAIL: Service Account 이메일
 * - GOOGLE_PRIVATE_KEY: Service Account Private Key
 * - ADSENSE_ACCOUNT_ID: AdSense Account ID (pub-xxxxxxxxxx)
 *
 * API 문서: https://developers.google.com/adsense/management/v2/reference
 */

interface AdSenseMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

interface AdSenseResponse {
  connected: boolean;
  accountId?: string;
  metrics?: {
    estimatedEarnings: AdSenseMetric;
    pageViews: AdSenseMetric;
    clicks: AdSenseMetric;
    ctr: AdSenseMetric;
    cpc: AdSenseMetric;
    rpm: AdSenseMetric;
  };
  topAdUnits?: Array<{
    name: string;
    earnings: number;
    clicks: number;
    impressions: number;
  }>;
  topPages?: Array<{
    page: string;
    earnings: number;
    pageViews: number;
    rpm: number;
  }>;
  dailyData?: Array<{
    date: string;
    earnings: number;
    pageViews: number;
    clicks: number;
  }>;
  error?: string;
}

// Google Auth 토큰 가져오기
async function getAccessToken(): Promise<string | null> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    return null;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/adsense.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const base64url = (obj: object) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const unsignedToken = `${base64url(header)}.${base64url(payload)}`;

    const crypto = await import("crypto");
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(unsignedToken);
    const signature = sign
      .sign(privateKey, "base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const jwt = `${unsignedToken}.${signature}`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return null;
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "7days";
  const accountId = searchParams.get("accountId") || process.env.ADSENSE_ACCOUNT_ID;

  // 환경 변수 체크
  if (!accountId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return NextResponse.json({
      connected: false,
      error:
        "AdSense 연동 필요: ADSENSE_ACCOUNT_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY 환경 변수 설정 필요",
      // 데모 데이터
      demo: true,
      metrics: {
        estimatedEarnings: {
          name: "예상 수익",
          value: 0,
          changePercent: 0,
        },
        pageViews: { name: "페이지뷰", value: 0, changePercent: 0 },
        clicks: { name: "클릭수", value: 0, changePercent: 0 },
        ctr: { name: "CTR", value: 0, changePercent: 0 },
        cpc: { name: "CPC", value: 0, changePercent: 0 },
        rpm: { name: "RPM", value: 0, changePercent: 0 },
      },
      topAdUnits: [],
      topPages: [],
      dailyData: [],
    } as AdSenseResponse);
  }

  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        connected: false,
        error: "Google 인증 실패",
      } as AdSenseResponse);
    }

    // 기간 계산
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (period) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 91 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
    }

    // AdSense Management API 호출
    const apiUrl = `https://adsense.googleapis.com/v2/accounts/${accountId}/reports:generate`;
    const params = new URLSearchParams({
      dateRange: "CUSTOM",
      "startDate.year": startDate.getFullYear().toString(),
      "startDate.month": (startDate.getMonth() + 1).toString(),
      "startDate.day": startDate.getDate().toString(),
      "endDate.year": now.getFullYear().toString(),
      "endDate.month": (now.getMonth() + 1).toString(),
      "endDate.day": now.getDate().toString(),
      metrics: "ESTIMATED_EARNINGS,PAGE_VIEWS,CLICKS,PAGE_VIEWS_CTR,COST_PER_CLICK,PAGE_VIEWS_RPM",
      dimensions: "DATE",
    });

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AdSense API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // 데이터 파싱
    let totalEarnings = 0;
    let totalPageViews = 0;
    let totalClicks = 0;
    const dailyData: AdSenseResponse["dailyData"] = [];

    if (data.rows) {
      for (const row of data.rows) {
        const date = `${row.cells[0].value}-${String(row.cells[1]?.value || "01").padStart(2, "0")}-${String(row.cells[2]?.value || "01").padStart(2, "0")}`;
        const earnings = parseFloat(row.cells[3]?.value || "0") / 1000000; // micros to actual
        const pageViews = parseInt(row.cells[4]?.value || "0");
        const clicks = parseInt(row.cells[5]?.value || "0");

        totalEarnings += earnings;
        totalPageViews += pageViews;
        totalClicks += clicks;

        dailyData.push({
          date,
          earnings,
          pageViews,
          clicks,
        });
      }
    }

    const ctr = totalPageViews > 0 ? (totalClicks / totalPageViews) * 100 : 0;
    const cpc = totalClicks > 0 ? totalEarnings / totalClicks : 0;
    const rpm = totalPageViews > 0 ? (totalEarnings / totalPageViews) * 1000 : 0;

    return NextResponse.json({
      connected: true,
      accountId,
      metrics: {
        estimatedEarnings: {
          name: "예상 수익",
          value: Math.round(totalEarnings * 100) / 100,
          changePercent: 0, // 이전 기간 비교 구현 필요
        },
        pageViews: {
          name: "페이지뷰",
          value: totalPageViews,
          changePercent: 0,
        },
        clicks: {
          name: "클릭수",
          value: totalClicks,
          changePercent: 0,
        },
        ctr: {
          name: "CTR",
          value: Math.round(ctr * 100) / 100,
          changePercent: 0,
        },
        cpc: {
          name: "CPC",
          value: Math.round(cpc * 100) / 100,
          changePercent: 0,
        },
        rpm: {
          name: "RPM",
          value: Math.round(rpm * 100) / 100,
          changePercent: 0,
        },
      },
      topAdUnits: [],
      topPages: [],
      dailyData: dailyData.sort((a, b) => a.date.localeCompare(b.date)),
    } as AdSenseResponse);
  } catch (error) {
    console.error("AdSense API Error:", error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    } as AdSenseResponse);
  }
}
