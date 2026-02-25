"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Event } from "@/lib/mock-data";
import { getProfile } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  memberCount?: number;
  className?: string;
}

// 모임 카드: 모임 목록에서 개별 모임 정보 표시
export function EventCard({
  event,
  memberCount = 0,
  className,
}: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const now = new Date();

  // 날짜 형식: 2025년 10월 21일 오후 02:59
  const dateString = format(eventDate, "yyyy년 MM월 dd일 a hh:mm", {
    locale: ko,
  });

  const isClosed = event.is_closed;
  let statusBadge = "예정";

  if (isClosed) {
    statusBadge = "종료";
  } else if (eventDate < now) {
    statusBadge = "진행 중";
  }

  // 주최자 정보
  const hostProfile = getProfile(event.host_id);
  const hostName = hostProfile?.full_name || "알 수 없음";

  return (
    <Link href={`/protected/events/${event.id}`}>
      <Card
        className={cn(
          "dark:hover:shadow-lg/50 flex cursor-pointer flex-row items-center gap-4 border-zinc-200/60 bg-white p-3 transition-all hover:shadow-lg",
          className,
        )}
      >
        {/* 왼쪽 섹션 (이미지) */}
        <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            src={`https://picsum.photos/seed/${event.id}/200`}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* 오른쪽 섹션 (정보) */}
        <div className="flex flex-1 flex-col justify-between py-0.5">
          {/* 상단: 제목 & 상태 배지 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-[15px] font-bold text-zinc-900">
              {event.title}
            </h3>
            <Badge
              variant={statusBadge === "종료" ? "outline" : "secondary"}
              className={cn(
                "h-5 whitespace-nowrap px-1.5 py-0 text-[10px] font-medium",
                statusBadge === "예정"
                  ? "bg-zinc-800 text-white hover:bg-zinc-700"
                  : "",
              )}
            >
              {statusBadge}
            </Badge>
          </div>

          {/* 중간: 날짜 */}
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
            <Calendar className="h-3 w-3" />
            <span>{dateString}</span>
          </div>

          {/* 하단: 주최자 & 멤버수 */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
              <span className="text-[13px]">🧑‍🦱</span>
              <span className="text-xs">{hostName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Users className="h-3.5 w-3.5" />
              <span>{memberCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
