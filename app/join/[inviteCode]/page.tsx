import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  getEventByInviteCode,
  getApprovedMemberCount,
  getProfile,
} from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

import { JoinButton } from "./join-button";

interface JoinPageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

// 데이터 페칭을 처리하는 async 컴포넌트
async function JoinPageContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ inviteCode: string }>;
}) {
  const { inviteCode } = await paramsPromise;
  const event = getEventByInviteCode(inviteCode);

  if (!event) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hostProfile = getProfile(event.host_id);
  const hostName = hostProfile?.full_name || "주최자";
  const memberCount = getApprovedMemberCount(event.id);
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isClosed = event.is_closed;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 font-sans md:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          이벤트 초대
        </h1>
        <p className="mt-2 text-muted-foreground">
          {hostName}님이 초대했습니다
        </p>
      </div>

      <Card className="w-full max-w-[420px] overflow-hidden border-border/50 shadow-md">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
            alt="Event thumbnail"
            fill
            className="object-cover"
          />
        </div>

        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            {event.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>

          <div className="mt-8 space-y-4 text-sm font-medium">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 opacity-70" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 opacity-70" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Users className="h-5 w-5 opacity-70" />
              <span>참여자 {memberCount}명</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-border/50 pt-6">
            <Avatar className="h-10 w-10 border bg-muted">
              <AvatarImage src={hostProfile?.avatar_url || ""} />
              <AvatarFallback className="text-muted-foreground">
                {hostName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{hostName}</span>
              <span className="text-xs text-muted-foreground">호스트</span>
            </div>
          </div>

          <div className="mt-8">
            {isClosed ? (
              <Button size="lg" className="w-full font-semibold" disabled>
                마감된 모임입니다
              </Button>
            ) : user ? (
              <JoinButton inviteCode={inviteCode} />
            ) : (
              <Link
                href={`/auth/login?redirect=/join/${inviteCode}`}
                className="block w-full"
              >
                <Button size="lg" className="w-full font-semibold">
                  로그인하고 참여하기
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {!isClosed && !user && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            href={`/auth/sign-up?redirect=/join/${inviteCode}`}
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            가입하기
          </Link>
        </p>
      )}
    </div>
  );
}

// Loading fallback 컴포넌트
function JoinPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded-md bg-muted" />
            <div className="h-4 w-1/3 rounded-md bg-muted" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg bg-muted p-4">
                  <div className="h-3 w-20 rounded bg-muted-foreground/20" />
                  <div className="h-4 rounded bg-muted-foreground/20" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinPage({ params }: JoinPageProps) {
  return (
    <Suspense fallback={<JoinPageSkeleton />}>
      <JoinPageContent paramsPromise={params} />
    </Suspense>
  );
}
