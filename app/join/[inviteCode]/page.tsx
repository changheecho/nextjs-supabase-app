import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEventByInviteCode, getApprovedMemberCount } from "@/lib/mock-data";
import { CATEGORY_COLOR } from "@/lib/schemas";

interface JoinPageProps {
  params: {
    inviteCode: string;
  };
}

export default function JoinPage({ params }: JoinPageProps) {
  const { inviteCode } = params;

  const event = getEventByInviteCode(inviteCode);

  if (!event) {
    notFound();
  }

  const memberCount = getApprovedMemberCount(event.id);
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
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                {isClosed && <Badge variant="destructive">마감됨</Badge>}
              </div>
              <CardDescription className="mt-2">
                모임에 초대되었습니다
              </CardDescription>
            </div>
            <Badge className={categoryColor}>{event.category}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 모임 정보 */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">설명</h3>
              <p className="mt-2 text-muted-foreground">{event.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">날짜 및 시간</p>
                <p className="mt-2 font-semibold">{formattedDate}</p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">장소</p>
                <p className="mt-2 font-semibold">{event.location}</p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">현재 참여자</p>
                <p className="mt-2 font-semibold">
                  {memberCount} / {event.max_members}명
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">상태</p>
                <p className="mt-2 font-semibold">
                  {isClosed ? "마감됨" : "모집 중"}
                </p>
              </div>
            </div>
          </div>

          {/* 참여 버튼 */}
          {isClosed ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
              <p className="text-sm text-red-700 dark:text-red-200">
                이 모임은 마감되었습니다
              </p>
            </div>
          ) : (
            <Link href={`/auth/login?redirect=/join/${inviteCode}`}>
              <Button size="lg" className="w-full">
                로그인하여 참여 신청
              </Button>
            </Link>
          )}

          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link
              href={`/auth/sign-up?redirect=/join/${inviteCode}`}
              className="underline"
            >
              가입하기
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
