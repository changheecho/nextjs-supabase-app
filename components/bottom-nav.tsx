"use client";

import { CalendarHeart, LogOut, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "이벤트",
      href: "/protected/events",
      icon: CalendarHeart,
    },
    {
      name: "새 이벤트",
      href: "/protected/events/new",
      icon: PlusCircle,
    },
    {
      name: "프로필",
      href: "/protected",
      icon: User,
    },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="pb-safe w-full border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 w-full items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? "scale-110 transition-transform" : ""}
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-muted-foreground transition-colors hover:text-destructive"
        >
          <LogOut size={22} strokeWidth={2} />
          <span className="text-[10px] font-medium">로그아웃</span>
        </button>
      </nav>
    </div>
  );
}
