"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

/**
 * ConfirmDialog 컴포넌트 Props
 * - open: 다이얼로그 열림/닫힘 상태
 * - onOpenChange: 상태 변경 핸들러
 * - title: 다이얼로그 제목
 * - description: 다이얼로그 설명 (선택)
 * - onConfirm: 확인 버튼 클릭 핸들러 (Promise 지원)
 * - variant: 확인 버튼 스타일 (default | destructive)
 * - confirmLabel: 확인 버튼 텍스트 (기본값: "확인")
 * - cancelLabel: 취소 버튼 텍스트 (기본값: "취소")
 * - isLoading: 외부 로딩 상태
 */
export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

/**
 * 범용 확인 다이얼로그 컴포넌트
 * 모달 오버레이 방식으로 확인/취소 액션 처리
 * variant="destructive": 삭제 등 위험 액션 시 빨간 확인 버튼 표시
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  variant = "default",
  confirmLabel = "확인",
  cancelLabel = "취소",
  isLoading = false,
}: ConfirmDialogProps) {
  const [isPending, setIsPending] = React.useState(false);

  // 확인 버튼 클릭: 비동기 처리 지원
  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
    }
  };

  // 오버레이 클릭 시 닫기 (로딩 중에는 닫기 방지)
  const handleOverlayClick = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  // 로딩 상태 통합 (외부 isLoading + 내부 isPending)
  const loading = isLoading || isPending;

  if (!open) return null;

  return (
    // 반투명 오버레이 배경
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
    >
      {/* 다이얼로그 패널 */}
      <div
        className="w-full max-w-[340px] rounded-xl border border-zinc-200/60 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 제목 */}
        <h2
          id="confirm-dialog-title"
          className="text-[17px] font-bold text-zinc-900 dark:text-zinc-100"
        >
          {title}
        </h2>

        {/* 설명 (선택) */}
        {description && (
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}

        {/* 액션 버튼 영역 */}
        <div className="mt-5 flex gap-2.5">
          {/* 취소 버튼 */}
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 border-zinc-200 text-[14px] font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>

          {/* 확인 버튼: variant에 따른 스타일 분기 */}
          <Button
            type="button"
            className={
              variant === "destructive"
                ? "h-11 flex-1 bg-red-600 text-[14px] font-medium text-white hover:bg-red-700 focus-visible:ring-red-500"
                : "h-11 flex-1 bg-zinc-900 text-[14px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            }
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? "처리 중..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
