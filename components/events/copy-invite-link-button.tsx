"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface CopyInviteLinkButtonProps {
  inviteCode: string;
}

// 초대 링크 복사 버튼 (클라이언트 컴포넌트)
export function CopyInviteLinkButton({
  inviteCode,
}: CopyInviteLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const inviteLink = `${window.location.origin}/join/${inviteCode}`;
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("초대 링크 복사 실패:", error);
      alert(`초대 코드: ${inviteCode}`);
    }
  };

  return (
    <Button variant="outline" size="sm" className="w-full" onClick={handleCopy}>
      <Copy className="mr-2 h-4 w-4" />
      {copied ? "복사됨!" : "초대 링크 복사"}
    </Button>
  );
}
