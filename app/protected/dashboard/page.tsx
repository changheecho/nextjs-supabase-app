import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Bell, CalendarCheck, ChevronRight, Plus, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { EventCard } from "@/components/events/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getApprovedMemberCount,
  getEventAnnouncements,
  getHostedEvents,
  mockCurrentUser,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * 대시보드 요약 통계 카드 Props
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

/**
 * 요약 통계 카드: 대시보드 상단 요약 지표 표시
 */
function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-2 border-zinc-200/60 bg-white p-4 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-zinc-500">{label}</span>
        <div className="text-zinc-400">{icon}</div>
      </div>
      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </Card>
  );
}

/**
 * 빈 상태 안내 컴포넌트: 주최한 모임이 없을 때 표시
 */
function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <CalendarCheck className="h-7 w-7 text-zinc-400" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[16px] font-bold text-zinc-800 dark:text-zinc-200">
          아직 만든 모임이 없어요
        </h3>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
          새 모임을 만들고 사람들을 초대해보세요
        </p>
      </div>
      <Link href="/protected/events/new">
        <Button className="h-11 bg-zinc-900 px-6 text-[14px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
          <Plus className="mr-2 h-4 w-4" />첫 모임 만들기
        </Button>
      </Link>
    </div>
  );
}

/**
 * 대시보드 주요 콘텐츠를 렌더링하는 서버 컴포넌트
 * Suspense로 감싸서 스트리밍 로딩 지원
 */
async function DashboardContent() {
  // 현재 사용자가 주최한 이벤트 조회 (Stage 4에서 실제 인증 사용자로 교체)
  const currentUserId = mockCurrentUser.id;
  const hostedEvents = getHostedEvents(currentUserId);

  // 통계 계산
  const totalEvents = hostedEvents.length;
  const activeEvents = hostedEvents.filter((e) => !e.is_closed).length;
  const totalMembers = hostedEvents.reduce(
    (acc, event) => acc + getApprovedMemberCount(event.id),
    0,
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-8 pb-10">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            대시보드
          </h1>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
            {mockCurrentUser.full_name}님이 주최하는 모임을 관리하세요
          </p>
        </div>

        {/* 새 모임 만들기 버튼 (CTA) */}
        <Link href="/protected/events/new" className="shrink-0">
          <Button
            size="sm"
            className="h-9 bg-zinc-900 px-4 text-[13px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />새 모임
          </Button>
        </Link>
      </div>

      {/* 요약 통계 카드 영역 - 반응형: 모바일 1열, 태블릿 2열, 데스크톱 3열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="전체 모임"
          value={totalEvents}
          icon={<CalendarCheck className="h-4 w-4" />}
        />
        <StatCard
          label="진행 중"
          value={activeEvents}
          icon={<CalendarCheck className="h-4 w-4 text-green-500" />}
        />
        <StatCard
          label="총 참여자"
          value={totalMembers}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* 주최한 모임 목록 섹션 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-200">
            내가 주최한 모임
          </h2>
          {hostedEvents.length > 0 && (
            <Link
              href="/protected/events"
              className="flex items-center gap-0.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            >
              전체보기
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* 빈 상태: 주최한 모임 없음 */}
        {hostedEvents.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <div className="flex flex-col gap-3">
            {hostedEvents.map((event) => {
              const memberCount = getApprovedMemberCount(event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  memberCount={memberCount}
                  isHostView={true}
                  onDelete={async (eventId) => {
                    // Stage 4에서 실제 삭제 API 호출로 교체
                    console.warn("모임 삭제 요청 (개발 모드):", eventId);
                  }}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 최근 공지사항 섹션 */}
      {hostedEvents.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-200">
            최근 공지사항
          </h2>
          <RecentAnnouncements hostedEvents={hostedEvents} />
        </section>
      )}
    </div>
  );
}

/**
 * 최근 공지사항 목록 컴포넌트
 * 주최한 모임들의 최신 공지 3개를 표시
 */
function RecentAnnouncements({
  hostedEvents,
}: {
  hostedEvents: ReturnType<typeof getHostedEvents>;
}) {
  // 모든 주최 모임의 공지사항 수집 후 최신순 정렬
  const allAnnouncements = hostedEvents
    .flatMap((event) =>
      getEventAnnouncements(event.id).map((a) => ({
        ...a,
        eventTitle: event.title,
        eventId: event.id,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3); // 최신 3개만 표시

  if (allAnnouncements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
          발송한 공지사항이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {allAnnouncements.map((announcement) => {
        // 날짜 형식: MM월 dd일
        const formattedDate = format(
          new Date(announcement.created_at),
          "MM월 dd일",
          { locale: ko },
        );

        return (
          <Link
            key={announcement.id}
            href={`/protected/events/${announcement.eventId}/announcements`}
          >
            <Card className="border-zinc-200/60 bg-white p-4 transition-all hover:shadow-md dark:bg-zinc-900">
              <CardHeader className="p-0 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">
                    {announcement.title}
                  </CardTitle>
                  {announcement.is_pinned && (
                    <Badge className="h-4 shrink-0 bg-blue-100 px-1.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      핀
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="mb-2 line-clamp-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                  {announcement.content}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <Bell className="h-3 w-3" />
                  <span>{announcement.eventTitle}</span>
                  <span>·</span>
                  <span>{formattedDate}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * 대시보드 Skeleton 로딩 UI
 */
function DashboardSkeleton() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8 pb-10">
      {/* 헤더 Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>

      {/* 통계 카드 Skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-lg bg-muted" />
        ))}
      </div>

      {/* 모임 목록 Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}

/**
 * 주최자 대시보드 페이지
 * 주최한 모임 목록, 통계, 최근 공지사항 표시
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
