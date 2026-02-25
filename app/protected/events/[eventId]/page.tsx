import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, Edit, MapPin, Share2, Trash2, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getApprovedMemberCount,
  getEventMembers,
  getProfile,
  mockEvents,
} from "@/lib/mock-data";

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

/**
 * 이벤트 상세 내역 렌더링을 담당하는 서버 컴포넌트
 */
async function EventDetailContent({ params }: EventDetailPageProps) {
  const { eventId } = await params;

  // 모임 조회
  const event = mockEvents.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  const memberCount = getApprovedMemberCount(eventId);
  const eventMembers = getEventMembers(eventId).filter(
    (member) => member.status === "approved",
  );

  const eventDate = new Date(event.event_date);
  const now = new Date();

  // 날짜 형식: 2025년 10월 21일 오후 02:59
  const formattedDate = format(eventDate, "yyyy년 MM월 dd일 a hh:mm", {
    locale: ko,
  });

  const isClosed = event.is_closed;
  let statusBadge = "예정";

  if (isClosed) {
    statusBadge = "종료";
  } else if (eventDate < now) {
    statusBadge = "진행 중";
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6 pb-12">
      {/* 썸네일 이미지 영역 */}
      <div className="-mx-5 -mt-10 mb-2 h-48 overflow-hidden bg-muted md:h-64">
        <img
          src={`https://picsum.photos/seed/${event.id}/800/400`}
          alt={event.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 모임 기본 정보 헤더 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl lg:text-3xl">
            {event.title}
          </h1>
          <Badge
            variant={statusBadge === "종료" ? "outline" : "secondary"}
            className={`whitespace-nowrap px-2 py-0.5 text-xs font-medium ${
              statusBadge === "예정"
                ? "bg-zinc-800 text-white hover:bg-zinc-700"
                : ""
            }`}
          >
            {statusBadge}
          </Badge>
        </div>
        <p className="text-[15px] leading-relaxed text-zinc-500">
          {event.description || "등록된 설명이 없습니다."}
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-2">
        <Button
          variant="outline"
          className="h-12 bg-zinc-50/50 text-zinc-600 md:h-10"
        >
          <Edit className="mr-2 h-4 w-4" /> 수정
        </Button>
        <Button
          variant="outline"
          className="h-12 bg-zinc-50/50 text-zinc-600 md:h-10"
        >
          <Share2 className="mr-2 h-4 w-4" /> 공유
        </Button>
        <Button
          variant="outline"
          className="h-12 bg-zinc-50/50 text-zinc-600 md:h-10"
        >
          <Trash2 className="mr-2 h-4 w-4" /> 삭제
        </Button>
      </div>

      {/* 상세 정보 카드 */}
      <div className="mt-2 flex flex-col gap-4 rounded-xl border border-zinc-200/60 bg-zinc-50/30 p-5 md:gap-5">
        <div className="flex items-start gap-4">
          <Calendar className="mt-0.5 h-5 w-5 text-zinc-400" />
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-zinc-500">날짜 및 시간</span>
            <span className="text-[15px] font-medium text-zinc-800">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="mt-0.5 h-5 w-5 text-zinc-400" />
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-zinc-500">장소</span>
            <span className="text-[15px] font-medium text-zinc-800">
              {event.location}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Users className="mt-0.5 h-5 w-5 text-zinc-400" />
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-zinc-500">참여자</span>
            <span className="text-[15px] font-medium text-zinc-800">
              {memberCount}명 참여
            </span>
          </div>
        </div>
      </div>

      {/* 초대 코드 카드 */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200/60 bg-zinc-50/30 p-5 md:gap-5">
        <span className="text-[13px] text-zinc-500">초대 코드</span>
        <div className="rounded-md bg-zinc-200/50 px-3 py-2.5">
          <span className="text-[15px] font-medium tracking-widest text-zinc-800">
            {event.invite_code}
          </span>
        </div>
        <span className="text-[12px] text-zinc-500">
          이 코드로 다른 사람을 초대할 수 있어요
        </span>
      </div>

      {/* 참여자 목록 */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200/60 bg-zinc-50/30 p-5 md:gap-5">
        <h3 className="mb-1 text-[15px] font-bold text-zinc-800">
          참여자 목록
        </h3>
        <div className="flex flex-col gap-4 md:gap-5">
          {eventMembers.map((member) => {
            const profile = getProfile(member.user_id);
            const isHost = member.user_id === event.host_id;
            // 랜덤 이모지 생성 (1~6번 프로필)
            const emojiAvatar = ["🧑‍💻", "🕶️", "👱‍♂️", "👩", "👨‍🦱", "🥷"][
              member.user_id.charCodeAt(member.user_id.length - 1) % 6
            ];

            return (
              <div
                key={member.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200/50 text-xl">
                    {emojiAvatar}
                  </div>
                  <span className="text-[16px] font-medium text-zinc-800">
                    {profile?.full_name || "알 수 없음"}
                  </span>
                </div>
                {isHost && (
                  <span className="rounded bg-zinc-200/50 px-2 py-1 text-[11px] font-medium text-zinc-600">
                    호스트
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <Suspense
      fallback={<div className="p-8 text-center text-zinc-500">로딩 중...</div>}
    >
      <EventDetailContent params={params} />
    </Suspense>
  );
}
