import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.semi-colon.space"),
  title: "Semicolon - 당신의 커뮤니티, 우리의 솔루션",
  description: "연결과 소통을 통해 혁신적인 커뮤니티 생태계를 만듭니다.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Semicolon - 당신의 커뮤니티, 우리의 솔루션",
    description: "연결과 소통을 통해 혁신적인 커뮤니티 생태계를 만듭니다.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Semicolon",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semicolon - 당신의 커뮤니티, 우리의 솔루션",
    description: "연결과 소통을 통해 혁신적인 커뮤니티 생태계를 만듭니다.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
