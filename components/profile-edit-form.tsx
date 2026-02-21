"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/database";

// 프로필 수정 폼 컴포넌트
interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    username: profile.username || "",
    full_name: profile.full_name || "",
    website: profile.website || "",
    bio: profile.bio || "",
  });

  // 입력 값 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();

      // profiles 테이블 업데이트
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: formData.username || null,
          full_name: formData.full_name || null,
          website: formData.website || null,
          bio: formData.bio || null,
        })
        .eq("id", profile.id);

      if (updateError) {
        // username 중복 에러 처리
        if (updateError.message.includes("unique")) {
          setError("이미 사용 중인 사용자명입니다.");
        } else {
          setError(updateError.message || "프로필 업데이트에 실패했습니다.");
        }
        return;
      }

      // 성공 메시지 표시
      setSuccessMessage("프로필이 성공적으로 업데이트되었습니다.");

      // 서버 컴포넌트 재조회
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "예상치 못한 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 수정</CardTitle>
        <CardDescription>사용자 정보를 편집하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 성공 메시지 */}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
              {successMessage}
            </div>
          )}

          {/* 사용자명 */}
          <div>
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="사용자명 (선택)"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* 이름 */}
          <div>
            <Label htmlFor="full_name">이름</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="이름 (선택)"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* 웹사이트 */}
          <div>
            <Label htmlFor="website">웹사이트</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* 자기소개 */}
          <div>
            <Label htmlFor="bio">자기소개</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="자신을 소개해주세요 (선택)"
              value={formData.bio}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* 제출 버튼 */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "저장 중..." : "저장"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
