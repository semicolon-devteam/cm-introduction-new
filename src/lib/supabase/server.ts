import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./database.types";

/**
 * 서버 환경에서 사용할 Supabase 클라이언트 생성
 * 서버 컴포넌트, Route Handlers, Server Actions에서 사용
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // 서버 컴포넌트에서는 쿠키를 설정할 수 없음
            // Route Handlers나 Server Actions에서만 가능
          }
        },
      },
    },
  );
}

/**
 * Service Role 권한을 가진 Supabase 클라이언트 생성
 * 관리자 작업이나 RLS를 우회해야 하는 경우에만 사용
 * 절대 클라이언트에 노출되지 않도록 주의!
 */
export async function createServiceRoleClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // 서버 컴포넌트에서는 쿠키를 설정할 수 없음
          }
        },
      },
    },
  );
}
