"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_CATEGORIES, eventCreateSchema } from "@/lib/schemas";

/**
 * 모임 생성 폼 페이지
 * react-hook-form + zod로 폼 유효성 검사 처리
 */
export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      title: "",
      category: "모임",
      event_date: "",
      location: "",
      max_members: 8,
      bank_account: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Stage 1: 콘솔 로그만 출력
      // Stage 4: Server Action으로 DB 저장
      console.log("모임 생성 폼 데이터:", data);
      alert("모임이 생성되었습니다! (콘솔을 확인하세요)");
      form.reset();
    } catch (error) {
      console.error("모임 생성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">새 모임 만들기</h1>
        <p className="mt-2 text-muted-foreground">
          새로운 모임을 만들고 함께할 사람들을 초대하세요
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>모임 제목 *</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 2월 정기 모임" {...field} />
                  </FormControl>
                  <FormDescription>모임의 이름을 입력해주세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 카테고리 */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>카테고리 *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>모임의 종류를 선택해주세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 날짜/시간 */}
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>날짜 및 시간 *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    모임을 할 날짜와 시간을 선택해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 장소 */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>장소 *</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 강남역 카페" {...field} />
                  </FormControl>
                  <FormDescription>
                    모임을 할 장소를 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 최대 인원 */}
            <FormField
              control={form.control}
              name="max_members"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>최대 인원 *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="2"
                      max="100"
                      placeholder="8"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    모임에 참여할 수 있는 최대 인원을 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 제출 버튼 */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "만들기 중..." : "모임 만들기"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => form.reset()}
              >
                초기화
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
