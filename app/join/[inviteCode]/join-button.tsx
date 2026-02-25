"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { joinEventByInviteCode } from "./actions";

interface JoinButtonProps {
  inviteCode: string;
}

export function JoinButton({ inviteCode }: JoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const result = await joinEventByInviteCode(inviteCode);
      if (result.success && result.eventId) {
        // Successfully joined, redirect to event detail page
        router.push(`/protected/events/${result.eventId}`);
      } else {
        alert(result.error || "이벤트 참여에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to join event:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full font-semibold"
      onClick={handleJoin}
      disabled={isLoading}
    >
      {isLoading ? "참여 처리 중..." : "참여하기"}
    </Button>
  );
}
