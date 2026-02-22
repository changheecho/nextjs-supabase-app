"use client";

import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_COLOR,
  MEMBER_STATUS_COLOR,
  MEMBER_STATUS_LABEL,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface MemberStatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "withdrawn";
  className?: string;
}

// 참여 상태 배지: 모임 참여 상태 표시
export function MemberStatusBadge({
  status,
  className,
}: MemberStatusBadgeProps) {
  const variant = MEMBER_STATUS_COLOR[status] || MEMBER_STATUS_COLOR["pending"];
  const label = MEMBER_STATUS_LABEL[status] || status;

  return <Badge className={cn(variant, className)}>{label}</Badge>;
}

interface CategoryBadgeProps {
  category: "모임" | "회의" | "행사" | "기타";
  className?: string;
}

// 카테고리 배지: 모임 카테고리 표시
export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const variant = CATEGORY_COLOR[category] || CATEGORY_COLOR["기타"];

  return <Badge className={cn(variant, className)}>{category}</Badge>;
}
