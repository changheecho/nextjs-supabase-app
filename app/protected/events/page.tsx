import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { EventCard } from "@/components/events/event-card";
import {
  EventCardSkeletonList,
  PageHeaderSkeleton,
} from "@/components/events/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  getApprovedEvents,
  getApprovedMemberCount,
  getHostedEvents,
  mockCurrentUser,
} from "@/lib/mock-data";

/**
 * 내 이벤트 목록을 조회하는 서버 컴포넌트
 * 주최한 모임과 참여 중인 모임을 구분하여 표시
 */
async function EventListServer() {
  // 현재 사용자 ID (Stage 1에서는 mock 사용, Stage 4에서 실제 인증 정보로 변경)
  const currentUserId = mockCurrentUser.id;

  // 주최한 모임과 참여 중인 모임 조회
  const hostedEvents = getHostedEvents(currentUserId);
  const approvedEvents = getApprovedEvents(currentUserId);

  // 탭 상태에 따른 필터링 (클라이언트에서 처리하므로 여기서는 모든 데이터 전달)
  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* 주최한 모임 섹션 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">내가 주최한 모임</h2>
        {hostedEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
            <h3 className="font-semibold">주최한 모임이 없습니다</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              새로운 모임을 만들어보세요.
            </p>
            <Link href="/protected/events/new" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" />새 모임 만들기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hostedEvents.map((event) => {
              const memberCount = getApprovedMemberCount(event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  memberCount={memberCount}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 참여 중인 모임 섹션 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">참여 중인 모임</h2>
        {approvedEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
            <h3 className="font-semibold">참여 중인 모임이 없습니다</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              초대 링크를 통해 모임에 참여해보세요.
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedEvents.map((event) => {
              const memberCount = getApprovedMemberCount(event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  memberCount={memberCount}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * 로딩 중 표시할 Skeleton UI
 */
function EventsPageSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 h-7 w-40 animate-pulse rounded bg-muted" />
        <EventCardSkeletonList count={3} />
      </section>
      <section>
        <div className="mb-4 h-7 w-40 animate-pulse rounded bg-muted" />
        <EventCardSkeletonList count={3} />
      </section>
    </div>
  );
}

/**
 * 내 이벤트 목록 페이지
 */
export default function EventsPage() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      {/* 모임 목록 */}
      <Suspense fallback={<EventsPageSkeleton />}>
        <EventListServer />
      </Suspense>
    </div>
  );
}
