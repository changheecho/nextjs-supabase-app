import { Calendar, Users } from "lucide-react";

import { getHostedEvents, getApprovedEvents } from "@/lib/mock-data";
import { Profile } from "@/types/database";

// 프로필 카드 컴포넌트 - 사용자 프로필 정보 표시
interface ProfileCardProps {
  profile: Profile;
  email: string;
}

export function ProfileCard({ profile, email }: ProfileCardProps) {
  const hostedEventsCount = getHostedEvents(profile.id).length || 0;
  const approvedEventsCount = getApprovedEvents(profile.id).length || 0;

  // 랜덤 이모지 아바타 생성
  const emojiAvatar =
    ["🧑‍💻", "🕶️", "👱‍♂️", "👩", "👨‍🦱", "🥷"][
      (profile.id.charCodeAt(profile.id.length - 1) || 0) % 6
    ] || "🧑‍🦱";

  // 가입일 포맷팅
  const createdAt = profile.created_at
    ? new Date(profile.created_at)
    : new Date();
  const formattedDate = `${createdAt.getFullYear()}. ${createdAt.getMonth() + 1}. ${createdAt.getDate()}.`;

  return (
    <div className="flex flex-col gap-4">
      {/* 프로필 헤더 카드 */}
      <div className="flex items-center gap-5 rounded-2xl border border-zinc-200/60 bg-zinc-50/30 p-5 px-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-200/50 text-4xl">
          {emojiAvatar}
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold text-zinc-800">
            {profile.full_name || "프로필 없음"}
          </h2>
          <p className="text-[14px] text-zinc-500">{email}</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200/60 bg-zinc-50/30 py-8">
          <Calendar className="mb-1 h-7 w-7 text-zinc-600" strokeWidth={1.5} />
          <span className="text-3xl font-extrabold text-zinc-800">
            {hostedEventsCount}
          </span>
          <span className="text-[13px] font-medium text-zinc-500">
            만든 이벤트
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200/60 bg-zinc-50/30 py-8">
          <Users className="mb-1 h-7 w-7 text-zinc-600" strokeWidth={1.5} />
          <span className="text-3xl font-extrabold text-zinc-800">
            {approvedEventsCount}
          </span>
          <span className="text-[13px] font-medium text-zinc-500">
            참여한 이벤트
          </span>
        </div>
      </div>

      {/* 계정 정보 카드 */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/60 bg-zinc-50/30 p-6">
        <h3 className="mb-2 text-[15px] font-bold text-zinc-800">계정 정보</h3>

        <div className="flex items-center justify-between">
          <span className="text-[14px] text-zinc-500">역할</span>
          <span className="text-[14px] font-medium text-zinc-800">사용자</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] text-zinc-500">가입일</span>
          <span className="text-[14px] font-medium text-zinc-800">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
