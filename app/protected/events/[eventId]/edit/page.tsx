"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockEvents } from "@/lib/mock-data";
import { eventUpdateSchema, EVENT_CATEGORIES } from "@/lib/schemas";

/**
 * 토스트 알림 타입
 */
type ToastType = "success" | "error" | null;

/**
 * 인라인 토스트 알림 컴포넌트
 * 폼 제출 결과를 상단에 표시
 */
function ToastNotification({
  type,
  message,
}: {
  type: ToastType;
  message: string;
}) {
  if (!type) return null;

  return (
    <div
      className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-[14px] font-medium ${
        type === "success"
          ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
          : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
      }`}
      role="alert"
    >
      {type === "success" ? (
        <CheckCircle className="h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" />
      )}
      {message}
    </div>
  );
}

/**
 * 모임 수정 폼 페이지 (클라이언트 컴포넌트)
 * - URL params에서 eventId 추출
 * - mock 데이터에서 기존 모임 정보 불러와 폼 초기화
 * - react-hook-form + zod 유효성 검사
 * - 성공/실패 토스트 알림 인라인 표시
 */
export default function EventEditPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  // 토스트 알림 상태
  const [toast, setToast] = useState<{ type: ToastType; message: string }>({
    type: null,
    message: "",
  });

  // 이벤트 데이터 조회 (Stage 4에서 서버 액션으로 교체)
  const event = mockEvents.find((e) => e.id === eventId);

  // 날짜 형식 변환: ISO 문자열 → datetime-local 입력 형식
  const toDatetimeLocal = (isoString: string): string => {
    const date = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const form = useForm({
    resolver: zodResolver(eventUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      event_date: "",
      category: "모임",
      max_members: 8,
    },
  });

  // 이벤트 데이터 로드 후 폼 초기화
  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description ?? "",
        location: event.location,
        event_date: toDatetimeLocal(event.event_date),
        category: event.category,
        max_members: event.max_members,
      });
    }
  }, [event, form]);

  // 토스트 자동 숨기기 (3초 후)
  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => {
        setToast({ type: null, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 이벤트를 찾지 못한 경우 에러 UI 표시
  if (!event) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 py-16">
        <p className="text-[15px] text-zinc-500">모임을 찾을 수 없습니다.</p>
        <Link href="/protected/events">
          <Button variant="outline">이벤트 목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Stage 1: 콘솔 출력 (Stage 4에서 실제 서버 액션으로 교체)
      console.warn("모임 수정 데이터 (개발 모드):", data);

      // 성공 토스트 표시 후 상세 페이지로 이동
      setToast({ type: "success", message: "모임 정보가 저장되었습니다." });
      setTimeout(() => {
        router.push(`/protected/events/${eventId}`);
      }, 1200);
    } catch (error) {
      console.error("모임 수정 실패:", error);
      setToast({
        type: "error",
        message: "저장에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col pb-12">
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-1 pb-6 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={`/protected/events/${eventId}`}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            모임 수정
          </h1>
        </div>
        <p className="ml-8 text-[14px] text-zinc-500 dark:text-zinc-400">
          모임 정보를 수정하고 저장하세요
        </p>
      </div>

      {/* 토스트 알림 */}
      <ToastNotification type={toast.type} message={toast.message} />

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 이벤트 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    이벤트 제목 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                      placeholder="예: 개발자 모임"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 설명 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    설명
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px] resize-none border-zinc-200/60 bg-zinc-50 p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                      placeholder="이벤트에 대한 설명을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 장소 */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    장소 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                      placeholder="예: 강남역 스타벅스"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 날짜/시간 */}
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    날짜 및 시간 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 카테고리 */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    카테고리 *
                  </FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => field.onChange(cat)}
                        className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
                          field.value === cat
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-500"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 최대 인원 */}
            <FormField
              control={form.control}
              name="max_members"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    최대 인원 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={2}
                      max={100}
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 모임 마감 여부 */}
            <FormField
              control={form.control}
              name="is_closed"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/30">
                    <FormControl>
                      <Checkbox
                        id="is_closed"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5"
                      />
                    </FormControl>
                    <div className="flex flex-col gap-0.5">
                      <Label
                        htmlFor="is_closed"
                        className="cursor-pointer text-[14px] font-bold text-zinc-800 dark:text-zinc-200"
                      >
                        모임 마감
                      </Label>
                      <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                        마감하면 새로운 참여 신청을 받지 않습니다
                      </p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 제출 버튼 영역 */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 border-zinc-200 bg-transparent text-[15px] font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 flex-[1.5] bg-zinc-900 text-[15px] font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isSubmitting ? "저장 중..." : "변경사항 저장"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
