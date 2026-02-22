"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowRight, MapPin, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/lib/mock-data";
import { CATEGORY_COLOR } from "@/lib/schemas";
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
  const relativeTime = formatDistanceToNow(eventDate, {
    addSuffix: true,
    locale: ko,
  });

  const categoryColor =
    CATEGORY_COLOR[event.category as keyof typeof CATEGORY_COLOR] ||
    CATEGORY_COLOR["기타"];

  const isClosed = event.is_closed;

  return (
    <Link href={`/protected/events/${event.id}`}>
      <Card
        className={cn(
          "dark:hover:shadow-lg/50 cursor-pointer transition-all hover:shadow-lg",
          className,
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="line-clamp-2 text-lg">
                  {event.title}
                </CardTitle>
                {isClosed && (
                  <Badge variant="destructive" className="whitespace-nowrap">
                    마감됨
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1">{relativeTime}</CardDescription>
            </div>
            <Badge className={categoryColor}>{event.category}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {event.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {memberCount} / {event.max_members}명
              </span>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span>상세 보기</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
