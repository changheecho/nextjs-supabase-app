import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

import { AnnouncementCard } from "@/components/events/announcement-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEventAnnouncements } from "@/lib/mock-data";

interface AnnouncementsPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function AnnouncementsPage({
  params,
}: AnnouncementsPageProps) {
  const { eventId } = await params;
  const announcements = getEventAnnouncements(eventId);

  // 핀 공지 상단에 고정
  const pinned = announcements.filter((a) => a.is_pinned);
  const unpinned = announcements.filter((a) => !a.is_pinned);
  const sorted = [...pinned, ...unpinned];

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <Link href={`/protected/events/${eventId}`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          모임으로 돌아가기
        </Button>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공지사항</h1>
          <p className="mt-2 text-muted-foreground">
            모임의 공지사항 목록입니다
          </p>
        </div>
        <Link href={`/protected/events/${eventId}/announcements/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            공지 작성
          </Button>
        </Link>
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
