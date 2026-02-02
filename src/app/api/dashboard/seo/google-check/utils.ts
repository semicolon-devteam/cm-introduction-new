import type { GoogleCheckItem } from "./route";

export async function checkHTTPS(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}`, { method: "HEAD" });
    return {
      id: "https",
      category: "basic",
      title: "HTTPS 보안 연결",
      description: response.ok
        ? "HTTPS가 올바르게 적용되어 있습니다."
        : "HTTPS 연결에 문제가 있습니다.",
      status: response.ok ? "pass" : "fail",
      priority: "high",
      howToFix: response.ok ? undefined : "SSL 인증서를 설치하고 HTTPS를 활성화하세요.",
    };
  } catch {
    return {
      id: "https",
      category: "basic",
      title: "HTTPS 보안 연결",
      description: "HTTPS 연결을 확인할 수 없습니다.",
      status: "fail",
      priority: "high",
      howToFix: "SSL 인증서를 설치하고 HTTPS를 활성화하세요.",
    };
  }
}

export async function checkSitemap(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}/sitemap.xml`);
    const isValid = response.ok;
    let hasValidFormat = false;

    if (isValid) {
      const text = await response.text();
      hasValidFormat = text.includes("<urlset") || text.includes("<sitemapindex");
    }

    return {
      id: "sitemap",
      category: "technical",
      title: "XML 사이트맵",
      description: isValid
        ? hasValidFormat
          ? "유효한 sitemap.xml이 존재합니다."
          : "sitemap.xml이 있지만 형식이 올바르지 않습니다."
        : "sitemap.xml을 찾을 수 없습니다.",
      status: isValid && hasValidFormat ? "pass" : isValid ? "warning" : "fail",
      priority: "high",
      howToFix:
        isValid && hasValidFormat
          ? undefined
          : "sitemap.xml을 생성하고 Search Console에 제출하세요.",
    };
  } catch {
    return {
      id: "sitemap",
      category: "technical",
      title: "XML 사이트맵",
      description: "사이트맵 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}

export async function checkRobots(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}/robots.txt`);
    if (!response.ok) {
      return {
        id: "robots",
        category: "technical",
        title: "Robots.txt",
        description: "robots.txt 파일이 없습니다.",
        status: "warning",
        priority: "medium",
        howToFix: "robots.txt를 생성하여 크롤러 접근을 관리하세요.",
      };
    }
    const content = await response.text();
    const blocksGooglebot =
      content.toLowerCase().includes("user-agent: googlebot") &&
      content.toLowerCase().includes("disallow: /");

    return {
      id: "robots",
      category: "technical",
      title: "Robots.txt",
      description: blocksGooglebot
        ? "Googlebot이 차단되어 있습니다!"
        : "robots.txt가 올바르게 설정되어 있습니다.",
      status: blocksGooglebot ? "fail" : "pass",
      priority: blocksGooglebot ? "high" : "medium",
      howToFix: blocksGooglebot ? "Googlebot 차단을 해제하세요." : undefined,
    };
  } catch {
    return {
      id: "robots",
      category: "technical",
      title: "Robots.txt",
      description: "robots.txt 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "medium",
    };
  }
}

export async function checkCanonical(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();
    const hasCanonical = html.includes('rel="canonical"') || html.includes("rel='canonical'");

    return {
      id: "canonical",
      category: "technical",
      title: "Canonical 태그",
      description: hasCanonical
        ? "Canonical 태그가 설정되어 있습니다."
        : "Canonical 태그가 없습니다.",
      status: hasCanonical ? "pass" : "warning",
      priority: "medium",
      howToFix: hasCanonical
        ? undefined
        : '<link rel="canonical" href="페이지URL"> 태그를 추가하세요.',
    };
  } catch {
    return {
      id: "canonical",
      category: "technical",
      title: "Canonical 태그",
      description: "Canonical 태그 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "medium",
    };
  }
}

export async function checkStructuredData(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();
    const hasJsonLd = html.includes('type="application/ld+json"');
    const hasMicrodata = html.includes("itemscope") && html.includes("itemtype");
    const hasStructuredData = hasJsonLd || hasMicrodata;

    return {
      id: "structured-data",
      category: "structured",
      title: "구조화 데이터 (JSON-LD)",
      description: hasStructuredData
        ? hasJsonLd
          ? "JSON-LD 구조화 데이터가 있습니다."
          : "Microdata 형식의 구조화 데이터가 있습니다."
        : "구조화 데이터가 없습니다.",
      status: hasStructuredData ? "pass" : "warning",
      priority: "medium",
      howToFix: hasStructuredData
        ? undefined
        : "JSON-LD 구조화 데이터를 추가하여 리치 스니펫을 활성화하세요.",
    };
  } catch {
    return {
      id: "structured-data",
      category: "structured",
      title: "구조화 데이터 (JSON-LD)",
      description: "구조화 데이터 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "medium",
    };
  }
}

export async function checkMobileFriendly(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();
    const hasViewport = html.includes('name="viewport"') || html.includes("name='viewport'");
    const hasResponsiveMeta = html.includes("width=device-width");

    return {
      id: "mobile-friendly",
      category: "mobile",
      title: "모바일 친화성",
      description:
        hasViewport && hasResponsiveMeta
          ? "모바일 반응형 설정이 되어 있습니다."
          : hasViewport
            ? "Viewport는 있지만 반응형 설정이 부족합니다."
            : "Viewport 메타태그가 없습니다.",
      status: hasViewport && hasResponsiveMeta ? "pass" : hasViewport ? "warning" : "fail",
      priority: "high",
      howToFix:
        hasViewport && hasResponsiveMeta
          ? undefined
          : '<meta name="viewport" content="width=device-width, initial-scale=1">을 추가하세요.',
    };
  } catch {
    return {
      id: "mobile-friendly",
      category: "mobile",
      title: "모바일 친화성",
      description: "모바일 친화성 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}

export async function checkMetaTags(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();

    const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
    const hasDescription =
      html.includes('name="description"') || html.includes("name='description'");
    const hasOgTags = html.includes('property="og:') || html.includes("property='og:");

    const score = [hasTitle, hasDescription, hasOgTags].filter(Boolean).length;

    return {
      id: "meta-tags",
      category: "content",
      title: "메타 태그",
      description:
        score === 3
          ? "Title, Description, OG 태그가 모두 설정되어 있습니다."
          : `메타 태그 ${score}/3 설정됨 (${!hasTitle ? "Title 없음, " : ""}${!hasDescription ? "Description 없음, " : ""}${!hasOgTags ? "OG 태그 없음" : ""})`.replace(
              /, $/,
              "",
            ),
      status: score === 3 ? "pass" : score >= 2 ? "warning" : "fail",
      priority: "high",
      howToFix: score === 3 ? undefined : "누락된 메타 태그를 추가하세요.",
    };
  } catch {
    return {
      id: "meta-tags",
      category: "content",
      title: "메타 태그",
      description: "메타 태그 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}

export async function checkHeadings(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();

    const h1Matches = html.match(/<h1[^>]*>/gi);
    const h1Count = h1Matches?.length || 0;

    return {
      id: "headings",
      category: "content",
      title: "H1 헤딩 태그",
      description:
        h1Count === 1
          ? "H1 태그가 1개 있습니다 (권장)."
          : h1Count === 0
            ? "H1 태그가 없습니다."
            : `H1 태그가 ${h1Count}개 있습니다 (1개 권장).`,
      status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warning",
      priority: "medium",
      howToFix: h1Count === 1 ? undefined : "페이지당 H1 태그를 1개만 사용하세요.",
    };
  } catch {
    return {
      id: "headings",
      category: "content",
      title: "H1 헤딩 태그",
      description: "헤딩 태그 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "medium",
    };
  }
}

export async function checkImageAlt(domain: string): Promise<GoogleCheckItem> {
  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();

    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    const totalImages = imgMatches.length;
    const imagesWithAlt = imgMatches.filter(
      (img) => img.includes("alt=") && !img.includes('alt=""') && !img.includes("alt=''"),
    ).length;

    if (totalImages === 0) {
      return {
        id: "image-alt",
        category: "content",
        title: "이미지 Alt 태그",
        description: "페이지에 이미지가 없습니다.",
        status: "pass",
        priority: "medium",
      };
    }

    const ratio = imagesWithAlt / totalImages;

    return {
      id: "image-alt",
      category: "content",
      title: "이미지 Alt 태그",
      description: `${totalImages}개 이미지 중 ${imagesWithAlt}개에 alt 태그가 있습니다 (${Math.round(ratio * 100)}%).`,
      status: ratio >= 0.9 ? "pass" : ratio >= 0.5 ? "warning" : "fail",
      priority: "medium",
      howToFix: ratio >= 0.9 ? undefined : "모든 이미지에 의미있는 alt 태그를 추가하세요.",
    };
  } catch {
    return {
      id: "image-alt",
      category: "content",
      title: "이미지 Alt 태그",
      description: "이미지 alt 태그 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "medium",
    };
  }
}

export async function checkPageSpeed(domain: string): Promise<GoogleCheckItem> {
  try {
    const start = Date.now();
    await fetch(`https://${domain}`);
    const responseTime = Date.now() - start;

    return {
      id: "page-speed",
      category: "technical",
      title: "페이지 응답 속도",
      description:
        responseTime < 1000
          ? `응답 시간: ${responseTime}ms (양호)`
          : responseTime < 3000
            ? `응답 시간: ${responseTime}ms (개선 필요)`
            : `응답 시간: ${responseTime}ms (느림)`,
      status: responseTime < 1000 ? "pass" : responseTime < 3000 ? "warning" : "fail",
      priority: "high",
      howToFix:
        responseTime < 1000
          ? undefined
          : "이미지 최적화, CDN 사용, 서버 응답 시간 개선을 고려하세요.",
    };
  } catch {
    return {
      id: "page-speed",
      category: "technical",
      title: "페이지 응답 속도",
      description: "페이지 속도 확인 중 오류가 발생했습니다.",
      status: "unknown",
      priority: "high",
    };
  }
}
