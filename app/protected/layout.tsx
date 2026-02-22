import { Suspense } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <main className="w-full flex-1 overflow-y-auto">
        <div className="flex min-h-full w-full flex-1 flex-col gap-12 p-5 pt-10">
          {children}
          <div className="mt-auto">
            <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-12 text-center text-xs">
              <p>
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </div>
        </div>
      </main>
      <div className="shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}
