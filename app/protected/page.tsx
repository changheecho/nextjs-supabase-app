import { Calendar, Link as LinkIcon, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-12 px-4 pb-20 pt-10 text-center">
      {/* 타이틀 영역 */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
          Gather
        </h1>
        <p className="text-[15px] font-medium text-zinc-500">
          초대 링크 하나로 모든 것을 해결하는 일회성 이벤트 관리 플랫폼
        </p>
      </div>

      {/* 특징 설명 카드 영역 */}
      <div className="flex w-full max-w-3xl flex-col items-stretch justify-center gap-4 md:flex-row">
        {/* 카드 1 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-6 shadow-sm">
          <Calendar className="h-8 w-8 text-zinc-700" strokeWidth={1.5} />
          <h3 className="text-[15px] font-bold text-zinc-800">
            간편한 이벤트 생성
          </h3>
          <p className="text-[13px] leading-relaxed text-zinc-500">
            제목, 날짜, 장소만 입력하면 즉시 이벤트 생성
          </p>
        </div>

        {/* 카드 2 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-6 shadow-sm">
          <LinkIcon className="h-8 w-8 text-zinc-700" strokeWidth={1.5} />
          <h3 className="text-[15px] font-bold text-zinc-800">
            원클릭 초대 시스템
          </h3>
          <p className="text-[13px] leading-relaxed text-zinc-500">
            자동 생성된 초대 링크를 카카오톡으로 간편 공유
          </p>
        </div>

        {/* 카드 3 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-6 shadow-sm">
          <Users className="h-8 w-8 text-zinc-700" strokeWidth={1.5} />
          <h3 className="text-[15px] font-bold text-zinc-800">
            실시간 참여자 관리
          </h3>
          <p className="text-[13px] leading-relaxed text-zinc-500">
            참여자 목록 자동 업데이트로 현황 파악
          </p>
        </div>
      </div>

      {/* 이벤트 시작 버튼 영역 */}
      <div className="mt-4 flex flex-col items-center gap-6">
        <Link href="/protected/events/new">
          <Button className="h-12 rounded-xl bg-zinc-900 px-8 text-[15px] font-medium text-white hover:bg-zinc-800">
            Google로 시작하기
          </Button>
        </Link>
        <p className="text-[12px] font-medium text-zinc-400">
          5-30명 규모의 소규모 이벤트에 최적화된 플랫폼
        </p>
      </div>
    </div>
  );
}
