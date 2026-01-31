import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Semicolon - 당신의 커뮤니티, 우리의 솔루션",
  description: "연결과 소통을 통해 혁신적인 커뮤니티 생태계를 만듭니다.",
  icons: {
    icon: "/favicon.ico",
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
