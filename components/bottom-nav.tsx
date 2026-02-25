"use client";

import { Home, Calendar, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "홈",
      href: "/protected", // 메인으로 /protected를 사용하거나, 별도 홈이 있다면 수정 필요
      icon: Home,
    },
    {
      name: "이벤트",
      href: "/protected/events",
      icon: Calendar,
    },
    {
      name: "새 이벤트",
      href: "/protected/events/new",
      icon: PlusCircle,
    },
    {
      name: "프로필",
      href: "/protected/profile", // 프로필 페이지 경로 (현재 /protected 이지만, 위 홈과 분리 필요 시 조정)
      icon: User,
    },
  ];

  return (
    <div className="pb-safe w-full border-t border-zinc-200/60 bg-white">
      <nav className="flex h-16 w-full items-center justify-around px-2">
        {navItems.map((item) => {
          // 현재 /protected 와 /protected/profile 등 경로 중복 처리를 위해 단순 startsWith 사용하지 않고 정확한 매칭
          // 다만 데모 상 홈과 프로필 경로가 불분명하므로, 임시로 처리
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1.5 py-1 ${
                isActive
                  ? "font-bold text-zinc-900"
                  : "font-medium text-zinc-400"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
