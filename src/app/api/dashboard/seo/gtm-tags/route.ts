import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { containerId, domain, keywords, pageType } = body as {
      containerId: string;
      domain: string;
      keywords: string[];
      pageType?: "homepage" | "article" | "category" | "product";
    };

    if (!containerId) {
      return NextResponse.json(
        { success: false, error: "GTM Container ID가 필요합니다." },
        { status: 400 },
      );
    }

    // GTM 기본 설치 코드 생성
    const headScript = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');</script>
<!-- End Google Tag Manager -->`;

    const bodyScript = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

    // SEO 추적을 위한 DataLayer 이벤트 코드 생성
    const dataLayerEvents = generateDataLayerEvents(keywords, pageType || "homepage");

    // AI를 통한 커스텀 태그 제안 생성
    let aiSuggestions = null;
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && keywords.length > 0) {
      try {
        const groq = new Groq({ apiKey });

        const prompt = `당신은 GTM(Google Tag Manager) 전문가입니다. 다음 정보를 바탕으로 SEO 트래킹에 유용한 GTM 태그 설정을 제안해주세요.

## 사이트 정보
- 도메인: ${domain}
- 페이지 유형: ${pageType || "homepage"}

## 타겟 키워드
${keywords.map((k, i) => `${i + 1}. ${k}`).join("\n")}

## 요청사항
다음 형식의 JSON으로 응답해주세요 (JSON만 출력):

{
  "tags": [
    {
      "name": "태그 이름",
      "type": "GA4 이벤트 / Custom HTML / 변환 추적",
      "trigger": "트리거 조건",
      "purpose": "목적 설명",
      "code": "필요한 경우 코드 스니펫"
    }
  ],
  "variables": [
    {
      "name": "변수 이름",
      "type": "Data Layer / DOM / URL",
      "value": "변수 값 또는 설정"
    }
  ],
  "recommendations": [
    "추가 권장 사항 1",
    "추가 권장 사항 2"
  ]
}

3-5개의 SEO 및 사용자 행동 추적에 유용한 태그를 제안해주세요.`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 2048,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";

        try {
          const cleanedResponse = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          aiSuggestions = JSON.parse(cleanedResponse);
        } catch {
          // JSON 파싱 실패 시 무시
        }
      } catch (error) {
        console.error("AI suggestion generation failed:", error);
      }
    }

    return NextResponse.json({
      success: true,
      containerId,
      scripts: {
        head: headScript,
        body: bodyScript,
      },
      dataLayerEvents,
      aiSuggestions,
    });
  } catch (error) {
    console.error("GTM tags generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "GTM 태그 생성 실패",
      },
      { status: 500 },
    );
  }
}

function generateDataLayerEvents(keywords: string[], pageType: string): string {
  const keywordsString = keywords.length > 0 ? keywords.join(", ") : "미설정";

  return `<!-- SEO DataLayer Events -->
<script>
  // 페이지 로드 시 SEO 데이터 전송
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'seo_page_view',
    'page_type': '${pageType}',
    'target_keywords': '${keywordsString}',
    'page_url': window.location.href,
    'page_title': document.title
  });

  // 스크롤 깊이 추적 (25%, 50%, 75%, 100%)
  (function() {
    var scrollDepths = [25, 50, 75, 100];
    var fired = {};

    window.addEventListener('scroll', function() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = Math.round((window.scrollY / docHeight) * 100);

      scrollDepths.forEach(function(depth) {
        if (scrollPercent >= depth && !fired[depth]) {
          fired[depth] = true;
          window.dataLayer.push({
            'event': 'scroll_depth',
            'scroll_depth_threshold': depth,
            'page_type': '${pageType}'
          });
        }
      });
    });
  })();

  // 페이지 체류 시간 추적
  (function() {
    var startTime = new Date().getTime();
    var intervals = [30, 60, 120, 300]; // 초 단위
    var fired = {};

    setInterval(function() {
      var elapsed = Math.floor((new Date().getTime() - startTime) / 1000);
      intervals.forEach(function(interval) {
        if (elapsed >= interval && !fired[interval]) {
          fired[interval] = true;
          window.dataLayer.push({
            'event': 'time_on_page',
            'time_seconds': interval,
            'page_type': '${pageType}'
          });
        }
      });
    }, 5000);
  })();
</script>`;
}
