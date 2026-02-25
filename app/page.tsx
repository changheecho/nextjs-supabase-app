import { Calendar, Link2, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F7F9]">
      {/* 메인 콘텐츠 */}
      <div className="flex w-full max-w-[900px] flex-col items-center justify-center px-4">
        {/* 타이틀 섹션 */}
        <div className="mb-14 mt-[-5vh] text-center">
          <h1 className="mb-4 text-[3.5rem] font-bold tracking-tight text-[#3A3A3C]">
            Gather
          </h1>
          <p className="text-lg font-medium text-[#8E8E93]">
            초대 링크 하나로 모든 것을 해결하는 일회성 이벤트 관리 플랫폼
          </p>
        </div>

        {/* 특징 카드 */}
        <div className="mb-16 grid w-full grid-cols-3 gap-2 sm:gap-6 md:grid-cols-3">
          {/* 카드 1: 간편한 이벤트 생성 */}
          <div className="flex h-full min-h-[200px] flex-col items-center justify-start rounded-2xl border border-[#E5E5EA] bg-transparent p-3 text-center sm:p-8">
            <div className="mb-4 sm:mb-5">
              <Calendar className="h-7 w-7 stroke-[1.5] text-[#3A3A3C] sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-2 break-keep text-[13px] font-bold text-[#3A3A3C] sm:mb-3 sm:text-[15px]">
              간편한 이벤트 생성
            </h3>
            <p className="break-keep text-[11px] leading-relaxed text-[#8E8E93] sm:text-[13px]">
              제목, 날짜, 장소만 입력하면 즉시 이벤트 생성
            </p>
          </div>

          {/* 카드 2: 원클릭 초대 시스템 */}
          <div className="flex h-full min-h-[200px] flex-col items-center justify-start rounded-2xl border border-[#E5E5EA] bg-transparent p-3 text-center sm:p-8">
            <div className="mb-4 sm:mb-5">
              <Link2 className="h-7 w-7 stroke-[1.5] text-[#3A3A3C] sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-2 break-keep text-[13px] font-bold text-[#3A3A3C] sm:mb-3 sm:text-[15px]">
              원클릭 초대 시스템
            </h3>
            <p className="break-keep text-[11px] leading-relaxed text-[#8E8E93] sm:text-[13px]">
              자동 생성된 초대 링크를 카카오톡으로 간편 공유
            </p>
          </div>

          {/* 카드 3: 실시간 참여자 관리 */}
          <div className="flex h-full min-h-[200px] flex-col items-center justify-start rounded-2xl border border-[#E5E5EA] bg-transparent p-3 text-center sm:p-8">
            <div className="mb-4 sm:mb-5">
              <Users className="h-7 w-7 stroke-[1.5] text-[#3A3A3C] sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-2 break-keep text-[13px] font-bold text-[#3A3A3C] sm:mb-3 sm:text-[15px]">
              실시간 참여자 관리
            </h3>
            <p className="break-keep text-[11px] leading-relaxed text-[#8E8E93] sm:text-[13px]">
              참여자 목록 자동 업데이트로 현황 파악
            </p>
          </div>
        </div>

        {/* CTA 버튼 */}
        <Link href="/auth/login" className="mb-12">
          <Button className="h-12 w-[180px] rounded-lg bg-[#2C2C2E] text-[15px] font-medium text-white transition-colors hover:bg-[#3A3A3C]">
            Google로 시작하기
          </Button>
        </Link>

        {/* 하단 텍스트 */}
        <p className="text-center text-[13px] font-medium text-[#8E8E93]">
          5-30명 규모의 소규모 이벤트에 최적화된 플랫폼
        </p>
      </div>
    </main>
  );
}
