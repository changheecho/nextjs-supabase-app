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
        </div>
      </main>
      <div className="shrink-0">
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </div>
    </div>
  );
}
