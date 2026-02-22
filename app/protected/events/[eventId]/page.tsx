import { ArrowLeft, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyInviteLinkButton } from "@/components/events/copy-invite-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getApprovedMemberCount,
  getEventAnnouncements,
  mockEvents,
} from "@/lib/mock-data";
import { CATEGORY_COLOR } from "@/lib/schemas";

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

/**
 * 모임 홈 페이지
 */
export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { eventId } = await params;

  // 모임 조회
  const event = mockEvents.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  const memberCount = getApprovedMemberCount(eventId);
  const announcements = getEventAnnouncements(eventId);
  const pinnedAnnouncement = announcements.find((a) => a.is_pinned);

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const categoryColor =
    CATEGORY_COLOR[event.category as keyof typeof CATEGORY_COLOR] ||
    CATEGORY_COLOR["기타"];

  const isClosed = event.is_closed;

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      {/* 뒤로가기 */}
      <Link href="/protected/events">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          모임 목록으로
        </Button>
      </Link>

      {/* 모임 기본 정보 헤더 */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold">{event.title}</h1>
              {isClosed && (
                <Badge variant="destructive" className="whitespace-nowrap">
                  마감됨
                </Badge>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">{event.description}</p>
          </div>
          <Badge className={categoryColor}>{event.category}</Badge>
        </div>

        {/* 모임 정보 카드 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">날짜 및 시간</p>
                  <p className="text-lg font-semibold">{formattedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">장소</p>
                  <p className="text-lg font-semibold">{event.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">참여자</p>
                  <p className="text-lg font-semibold">
                    {memberCount} / {event.max_members}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <CopyInviteLinkButton inviteCode={event.invite_code} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 핀 공지 영역 */}
      {pinnedAnnouncement && (
        <Card className="border-2 border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">📌 공지</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">{pinnedAnnouncement.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {pinnedAnnouncement.content}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 탭 네비게이션 */}
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="home">홈</TabsTrigger>
          <TabsTrigger value="announcements">공지</TabsTrigger>
          <TabsTrigger value="members">참여자</TabsTrigger>
          <TabsTrigger value="carpool">카풀</TabsTrigger>
          <TabsTrigger value="settlement">정산</TabsTrigger>
        </TabsList>

        {/* 홈 탭 */}
        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>모임 정보</CardTitle>
              <CardDescription>이 모임에 대한 기본 정보입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">설명</h4>
                <p className="mt-2 text-muted-foreground">
                  {event.description || "설명이 없습니다"}
                </p>
              </div>
              {event.bank_account && (
                <div>
                  <h4 className="font-semibold">정산 계좌</h4>
                  <p className="mt-2 text-muted-foreground">
                    {event.bank_account.bank} {event.bank_account.account}(
                    {event.bank_account.name})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 공지 탭 */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>공지사항</CardTitle>
              <CardDescription>모임의 공지사항 목록입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                공지 탭은 /protected/events/[eventId]/announcements 페이지에서
                구현됩니다
              </p>
              <Link href={`/protected/events/${eventId}/announcements`}>
                <Button className="mt-4">공지 보기</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 참여자 탭 */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>참여자</CardTitle>
              <CardDescription>모임의 참여자 목록입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                참여자 탭은 /protected/events/[eventId]/members 페이지에서
                구현됩니다
              </p>
              <Link href={`/protected/events/${eventId}/members`}>
                <Button className="mt-4">참여자 보기</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 카풀 탭 */}
        <TabsContent value="carpool">
          <Card>
            <CardHeader>
              <CardTitle>카풀</CardTitle>
              <CardDescription>
                모임의 카풀 정보입니다 (Phase 2 기능)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                카풀 기능은 Phase 2에서 구현될 예정입니다
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 정산 탭 */}
        <TabsContent value="settlement">
          <Card>
            <CardHeader>
              <CardTitle>정산</CardTitle>
              <CardDescription>
                모임의 정산 정보입니다 (Phase 2 기능)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                정산 기능은 Phase 2에서 구현될 예정입니다
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
