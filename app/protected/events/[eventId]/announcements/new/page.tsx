"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { announcementSchema } from "@/lib/schemas";
import type { AnnouncementInput } from "@/lib/schemas";

export default function CreateAnnouncementPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      is_pinned: false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("공지 작성 폼 데이터:", data);
      alert("공지가 작성되었습니다! (콘솔을 확인하세요)");
      form.reset();
    } catch (error) {
      console.error("공지 작성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <Link href={`/protected/events/${eventId}/announcements`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          공지 목록으로
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold">공지 작성</h1>
        <p className="mt-2 text-muted-foreground">
          모임의 새로운 공지를 작성합니다
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>제목 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="공지의 제목을 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>내용 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="공지의 내용을 입력해주세요"
                      className="min-h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    최대 2000자까지 입력 가능합니다
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_pinned"
              render={({ field }: any) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>핀 공지로 고정</FormLabel>
                    <FormDescription>
                      이 공지를 상단에 고정합니다
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "작성 중..." : "공지 작성"}
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
