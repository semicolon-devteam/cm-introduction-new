import { Inter } from "next/font/google";

import { CoreAuthProvider } from "@providers/core-auth-provider";

import type { Metadata } from "next";


import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Semicolon Community",
  description: "솔루션 기반 커뮤니티 플랫폼",
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
        <CoreAuthProvider>{children}</CoreAuthProvider>
      </body>
    </html>
  );
}
