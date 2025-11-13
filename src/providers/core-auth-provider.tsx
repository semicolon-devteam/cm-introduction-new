"use client";

/**
 * Enhanced AuthProvider using @team-semicolon/community-core v2.2.0
 * This provider integrates the core package AuthProvider with Supabase
 *
 * Development Philosophy:
 * - onSignedIn should only redirect from auth pages
 * - Session restoration should not trigger navigation
 */

import { type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider } from "@team-semicolon/community-core";

import { createClient } from "@/lib/supabase/client";

interface CoreAuthProviderProps {
  children: ReactNode;
}

/**
 * Enhanced Core Auth Provider
 * Wraps the core package AuthProvider with Supabase client
 */
export function CoreAuthProvider({ children }: CoreAuthProviderProps) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AuthProvider
      supabaseClient={supabase}
      onSignedIn={(user) => {
        // eslint-disable-next-line no-console
        console.log("User signed in:", user.email);

        // 인증 페이지에서만 대시보드로 리다이렉트
        // 다른 페이지에서는 세션 복구 시 현재 페이지 유지
        if (pathname?.startsWith("/auth/")) {
          router.push("/dashboard");
        }
      }}
      onSignedOut={() => {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("User signed out");
        }
        router.push("/");
      }}
      onTokenRefreshed={() => {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("Token refreshed");
        }
      }}
      onUserUpdated={() => {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("User data updated");
        }
      }}
    >
      {children}
    </AuthProvider>
  );
}
