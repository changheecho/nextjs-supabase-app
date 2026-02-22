"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Pin, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Announcement } from "@/lib/mock-data";
import { getProfile } from "@/lib/mock-data";

interface AnnouncementCardProps {
  announcement: Announcement;
  isAuthor?: boolean;
  onDelete?: (announcementId: string) => void;
}

// 공지 카드: 공지 항목 표시
export function AnnouncementCard({
  announcement,
  isAuthor = false,
  onDelete,
}: AnnouncementCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const authorProfile = getProfile(announcement.author_id);

  const createdTime = formatDistanceToNow(new Date(announcement.created_at), {
    addSuffix: true,
    locale: ko,
  });

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      onDelete(announcement.id);
      console.log(`공지 ${announcement.id} 삭제`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={
        announcement.is_pinned
          ? "border-2 border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/20"
          : ""
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{announcement.title}</CardTitle>
              {announcement.is_pinned && (
                <Badge className="flex items-center gap-1 bg-blue-600">
                  <Pin className="h-3 w-3" />핀
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">
              {authorProfile?.full_name || "알 수 없는 작성자"} · {createdTime}
            </CardDescription>
          </div>
          {isAuthor && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              onClick={handleDelete}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="whitespace-pre-wrap text-sm text-foreground">
          {announcement.content}
        </p>
      </CardContent>
    </Card>
  );
}
