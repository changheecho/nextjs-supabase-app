// Zod 스키마: 폼 유효성 검사 및 타입 안정성

import { z } from "zod";

/**
 * 모임 생성 폼 스키마
 * 필드: 제목, 카테고리, 날짜/시간, 장소, 최대 인원, 계좌 정보(선택)
 */
export const eventCreateSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 필수입니다")
    .min(2, "제목은 최소 2자 이상이어야 합니다")
    .max(100, "제목은 최대 100자입니다"),

  category: z
    .string()
    .min(1, "카테고리는 필수입니다")
    .refine(
      (val) => ["모임", "회의", "행사", "기타"].includes(val),
      "올바른 카테고리를 선택해주세요",
    ),

  event_date: z
    .string()
    .min(1, "날짜와 시간은 필수입니다")
    .refine((date) => {
      const eventDate = new Date(date);
      const now = new Date();
      return eventDate > now;
    }, "날짜는 현재 시간 이후여야 합니다"),

  location: z
    .string()
    .min(1, "장소는 필수입니다")
    .min(2, "장소는 최소 2자 이상이어야 합니다")
    .max(200, "장소는 최대 200자입니다"),

  max_members: z.coerce
    .number()
    .min(2, "최대 인원은 최소 2명 이상이어야 합니다")
    .max(100, "최대 인원은 100명 이하여야 합니다"),

  bank_account: z
    .object({
      bank: z.string().optional(),
      account: z.string().optional(),
      name: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export const eventUpdateSchema = eventCreateSchema.partial();

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;

/**
 * 공지 작성 폼 스키마
 * 필드: 제목, 내용, 핀 고정 여부
 */
export const announcementSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 필수입니다")
    .min(2, "제목은 최소 2자 이상이어야 합니다")
    .max(100, "제목은 최대 100자입니다"),

  content: z
    .string()
    .min(1, "내용은 필수입니다")
    .min(5, "내용은 최소 5자 이상이어야 합니다")
    .max(2000, "내용은 최대 2000자입니다"),

  is_pinned: z.boolean().optional().default(false),
});

export const announcementUpdateSchema = announcementSchema.partial();

export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;

/**
 * 모임 참여 신청 폼 스키마
 * 필드: 메모 (선택)
 */
export const joinEventSchema = z.object({
  memo: z.string().max(500, "메모는 최대 500자입니다").optional(),
});

export type JoinEventInput = z.infer<typeof joinEventSchema>;

/**
 * 카테고리 상수
 */
export const EVENT_CATEGORIES = ["모임", "회의", "행사", "기타"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/**
 * 참여 상태 상수
 */
export const MEMBER_STATUS = [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
] as const;
export type MemberStatus = (typeof MEMBER_STATUS)[number];

/**
 * 상태별 한글 라벨
 */
export const MEMBER_STATUS_LABEL: Record<MemberStatus, string> = {
  pending: "대기 중",
  approved: "참여 중",
  rejected: "거절",
  withdrawn: "취소",
};

/**
 * 상태별 색상 (Tailwind CSS)
 */
export const MEMBER_STATUS_COLOR: Record<MemberStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

/**
 * 카테고리별 색상 (Tailwind CSS)
 */
export const CATEGORY_COLOR: Record<EventCategory, string> = {
  모임: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  회의: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  행사: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  기타: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};
