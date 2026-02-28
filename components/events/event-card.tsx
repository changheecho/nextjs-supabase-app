"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Bell,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Event } from "@/lib/mock-data";
import { getProfile } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  memberCount?: number;
  className?: string;
  /** 호스트(주최자) 뷰 여부: true이면 액션 메뉴(수정/공지/삭제) 표시 */
  isHostView?: boolean;
  /** 삭제 액션 핸들러 */
  onDelete?: (eventId: string) => void | Promise<void>;
}

/**
 * 모임 카드 컴포넌트
 * - 모임 목록에서 개별 모임 정보를 표시
 * - isHostView=true 일 때 우측 상단에 드롭다운 액션 메뉴 표시 (수정, 공지 발송, 삭제)
 */
export function EventCard({
  event,
  memberCount = 0,
  className,
  isHostView = false,
  onDelete,
}: EventCardProps) {
  const router = useRouter();
  // 삭제 확인 다이얼로그 열림 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // 드롭다운 내 액션 버튼 클릭 시 카드 링크 이동 방지를 위한 stopPropagation 처리
  const handleMenuAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  // 수정 페이지 이동
  const handleEdit = () => {
    router.push(`/protected/events/${event.id}/edit`);
  };

  // 공지 발송 페이지 이동
  const handleAnnouncement = () => {
    router.push(`/protected/events/${event.id}/announcements`);
  };

  // 삭제 확인 다이얼로그 열기
  const handleDeleteRequest = () => {
    setIsDeleteDialogOpen(true);
  };

  // 삭제 확인 처리
  const handleDeleteConfirm = async () => {
    if (onDelete) {
      await onDelete(event.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Link href={`/protected/events/${event.id}`}>
        <Card
          className={cn(
            "dark:hover:shadow-lg/50 flex cursor-pointer flex-row items-center gap-4 border-zinc-200/60 bg-white p-3 transition-all hover:shadow-lg dark:bg-zinc-900",
            className,
          )}
        >
          {/* 왼쪽 섹션: 썸네일 이미지 */}
          <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              src={`https://picsum.photos/seed/${event.id}/200`}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* 오른쪽 섹션: 모임 정보 */}
          <div className="flex flex-1 flex-col justify-between py-0.5">
            {/* 상단: 제목, 상태 배지, 액션 메뉴 */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                {event.title}
              </h3>

              <div className="flex shrink-0 items-center gap-1.5">
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

                {/* 호스트 뷰일 때만 액션 메뉴 표시 */}
                {isHostView && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <button
                        className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                        aria-label="모임 액션 메뉴"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {/* 수정 액션 */}
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-[13px]"
                        onClick={(e) => handleMenuAction(e, handleEdit)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-zinc-500" />
                        모임 수정
                      </DropdownMenuItem>

                      {/* 공지 발송 액션 */}
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-[13px]"
                        onClick={(e) => handleMenuAction(e, handleAnnouncement)}
                      >
                        <Bell className="h-3.5 w-3.5 text-zinc-500" />
                        공지 발송
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* 삭제 액션 (위험 액션) */}
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-[13px] text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
                        onClick={(e) =>
                          handleMenuAction(e, handleDeleteRequest)
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        모임 삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* 중간: 날짜 */}
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
              <Calendar className="h-3 w-3" />
              <span>{dateString}</span>
            </div>

            {/* 하단: 주최자 & 멤버 수 */}
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
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

      {/* 삭제 확인 다이얼로그 (카드 외부 렌더링) */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="모임을 삭제하시겠어요?"
        description={`"${event.title}" 모임을 삭제하면 모든 참여자 정보와 공지사항이 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`}
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        confirmLabel="삭제"
      />
    </>
  );
}
