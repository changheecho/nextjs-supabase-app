"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { eventCreateSchema } from "@/lib/schemas";

/**
 * 모임 생성 폼 페이지
 * react-hook-form + zod로 폼 유효성 검사 처리
 */
export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      event_date: "",
      cover_image_url: "",
      category: "모임", // 기본값 (기존 스키마 유지용)
      max_members: 8, // 기본값 (기존 스키마 유지용)
      bank_account: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Stage 1: 콘솔 로그만 출력
      console.log("모임 생성 폼 데이터:", data);
      alert("이벤트가 생성되었습니다! (콘솔을 확인하세요)");
      router.push("/protected/events");
    } catch (error) {
      console.error("모임 생성 실패:", error);
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
            href="/protected/events"
            className="text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            새 이벤트 만들기
          </h1>
        </div>
        <p className="ml-8 text-[14px] text-zinc-500">
          새로운 이벤트를 만들고 사람들을 초대하세요
        </p>
      </div>

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 이벤트 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800">
                    이벤트 제목 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm"
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
                  <FormLabel className="text-[14px] font-bold text-zinc-800">
                    설명
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px] resize-none border-zinc-200/60 bg-zinc-50 p-3 shadow-sm"
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
                  <FormLabel className="text-[14px] font-bold text-zinc-800">
                    장소 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm"
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
                  <FormLabel className="text-[14px] font-bold text-zinc-800">
                    날짜 및 시간 *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 커버 이미지 URL */}
            <FormField
              control={form.control}
              name="cover_image_url"
              render={({ field }: any) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[14px] font-bold text-zinc-800">
                    커버 이미지 URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 border-zinc-200/60 bg-zinc-50 shadow-sm"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 제출 버튼 */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 border-zinc-200 bg-transparent text-[15px] font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 flex-[1.5] bg-zinc-900 text-[15px] font-medium text-white hover:bg-zinc-800"
              >
                {isSubmitting ? "만들기 중..." : "이벤트 만들기"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
