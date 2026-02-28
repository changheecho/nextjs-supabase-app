import { ArrowLeft, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";

import { AnnouncementCard } from "@/components/events/announcement-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEventAnnouncements } from "@/lib/mock-data";

interface AnnouncementsPageProps {
  params: Promise<{
    eventId: string;
  }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}

export default async function AnnouncementsPage({
  params,
  searchParams,
}: AnnouncementsPageProps) {
  const { eventId } = await params;
  const { sort = "latest" } = await searchParams;
  const announcements = getEventAnnouncements(eventId);

  // 핀 공지 상단에 고정, 정렬 처리
  const pinned = announcements.filter((a) => a.is_pinned);
  const unpinned = announcements.filter((a) => !a.is_pinned);

  // 정렬: latest(최신순) / oldest(오래된순)
  const sortedUnpinned =
    sort === "oldest"
      ? unpinned.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
      : unpinned.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

  const sorted = [...pinned, ...sortedUnpinned];

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <Link href={`/protected/events/${eventId}`}>
        <Button variant="ghost" size="sm" className="dark:hover:bg-zinc-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          모임으로 돌아가기
        </Button>
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              공지사항
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              모임의 공지사항 목록입니다
            </p>
          </div>
          <Link href={`/protected/events/${eventId}/announcements/new`}>
            <Button className="shrink-0 gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">공지 작성</span>
            </Button>
          </Link>
        </div>

        {/* 정렬 옵션 */}
        {announcements.length > 0 && (
          <div className="flex gap-2">
            <Link
              href={`?sort=latest`}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                sort === "latest" || sort === ""
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
              }`}
            >
              최신순
            </Link>
            <Link
              href={`?sort=oldest`}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                sort === "oldest"
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
              }`}
            >
              오래된순
            </Link>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              아직 공지가 없습니다
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sorted.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isAuthor={true}
              onDelete={(id) => console.log(`공지 삭제: ${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
