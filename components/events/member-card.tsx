"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Trash2 } from "lucide-react";
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
import type { EventMember } from "@/lib/mock-data";
import { getProfile } from "@/lib/mock-data";
import { MEMBER_STATUS_COLOR, MEMBER_STATUS_LABEL } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  member: EventMember;
  isOrganizerView?: boolean;
  onApprove?: (memberId: string) => void;
  onReject?: (memberId: string) => void;
  onRemove?: (memberId: string) => void;
}

// 참여자 카드: 모임 참여자 정보 표시
export function MemberCard({
  member,
  isOrganizerView = false,
  onApprove,
  onReject,
  onRemove,
}: MemberCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const profile = getProfile(member.user_id);

  const createdTime = formatDistanceToNow(new Date(member.created_at), {
    addSuffix: true,
    locale: ko,
  });

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsLoading(true);
    try {
      onApprove(member.id);
      console.log(`멤버 ${member.id} 승인`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    setIsLoading(true);
    try {
      onReject(member.id);
      console.log(`멤버 ${member.id} 거절`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    setIsLoading(true);
    try {
      onRemove(member.id);
      console.log(`멤버 ${member.id} 제거`);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor =
    MEMBER_STATUS_COLOR[member.status as keyof typeof MEMBER_STATUS_COLOR] ||
    MEMBER_STATUS_COLOR["pending"];
  const statusLabel =
    MEMBER_STATUS_LABEL[member.status as keyof typeof MEMBER_STATUS_LABEL] ||
    member.status;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">
              {profile?.full_name || "알 수 없는 사용자"}
            </CardTitle>
            <CardDescription className="text-xs">
              신청일: {createdTime}
            </CardDescription>
            {member.memo && (
              <p className="mt-1 text-sm text-muted-foreground">
                메모: {member.memo}
              </p>
            )}
          </div>
          <Badge className={cn(statusColor)}>{statusLabel}</Badge>
        </div>
      </CardHeader>

      {isOrganizerView && member.status === "pending" && (
        <CardContent className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            disabled={isLoading}
            onClick={handleApprove}
          >
            {isLoading ? "처리 중..." : "승인"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isLoading}
            onClick={handleReject}
          >
            {isLoading ? "처리 중..." : "거절"}
          </Button>
        </CardContent>
      )}

      {isOrganizerView && member.status === "approved" && (
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            disabled={isLoading}
            onClick={handleRemove}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            {isLoading ? "제거 중..." : "참여 취소"}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
