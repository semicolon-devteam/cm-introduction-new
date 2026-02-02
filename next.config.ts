// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const resourceUrl = process.env.NEXT_RESOURCE_URL ?? "";

const nextConfig: NextConfig = {
  // 배포/도커
  output: "standalone",

  // ESLint - 빌드 시 경고를 에러로 처리하지 않음
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 런타임 최적화
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  httpAgentOptions: { keepAlive: true },

  // 로깅 설정 - 프로덕션에서는 에러만
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  // 번들 최적화
  experimental: {
    optimizePackageImports: [
      // "@reduxjs/toolkit",
      // "@tanstack/react-query",
      "lodash",
      "@supabase/supabase-js",
      "lucide-react", // Icon library 최적화
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      // "@toast-ui/react-editor",
    ],
  },

  // 모듈 해석 최적화
  modularizeImports: {
    lodash: { transform: "lodash/{{member}}" },
  },

  // 개발환경에서 /storage → 외부 리소스 서버 프록시
  async rewrites() {
    if (isDev && resourceUrl) {
      return [
        {
          source: "/storage/:path*",
          destination: `${resourceUrl}/storage/:path*`,
        },
      ];
    }
    return [];
  },

  // 캐시/보안 헤더 최소 구성
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/storage/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // 외부/CDN 최적화 사용 가정
    // 실사용 해상도만
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128],
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
