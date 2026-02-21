import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { ProfileCard } from "@/components/profile-card";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types/database";

// 사용자 프로필 정보를 조회하는 서버 컴포넌트
async function UserProfile() {
  const supabase = await createClient();

  // JWT claims에서 사용자 ID와 이메일 추출
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  const userId = claimsData.claims.sub as string;
  const userEmail = claimsData.claims.email as string;

  // profiles 테이블에서 사용자 프로필 조회
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single<Profile>();

  if (profileError) {
    console.error("프로필 조회 실패:", profileError);
    redirect("/auth/login");
  }

  return {
    profile,
    email: userEmail,
  };
}

export default async function ProtectedPage() {
  const { profile, email } = await UserProfile();

  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
          <InfoIcon size="16" strokeWidth={2} />
          인증된 사용자만 접근할 수 있는 보호된 페이지입니다.
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="mb-4 text-2xl font-bold">프로필 정보</h2>
          <ProfileCard profile={profile} email={email} />
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">프로필 수정</h2>
          <ProfileEditForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
