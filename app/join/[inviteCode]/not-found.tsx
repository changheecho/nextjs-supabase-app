import { CalendarX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 text-center font-sans">
      <CalendarX className="mb-6 h-20 w-20 stroke-[1.5] text-muted-foreground/60" />
      <h1 className="mb-3 text-xl font-bold tracking-tight text-foreground md:text-2xl">
        이벤트를 찾을 수 없습니다
      </h1>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:max-w-sm md:text-base">
        초대 코드가 유효하지 않거나 이벤트가 삭제되었습니다.
      </p>
    </div>
  );
}
