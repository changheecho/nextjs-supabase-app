import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/types/database";

// 브라우저 클라이언트 생성 함수
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
