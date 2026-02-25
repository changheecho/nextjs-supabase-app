// events 테이블과 상호작용하는 Server 함수들
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types/database";

/**
 * 모임 상세 정보 조회 (인증 필수)
 * - 호스트 또는 승인된 참여자만 조회 가능
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("[getEventById] Error:", error.message);
      return null;
    }

    return data as Event;
  } catch (error) {
    console.error("[getEventById] Unexpected error:", error);
    return null;
  }
}

/**
 * 비인증 사용자용 공개 조회 - 초대 코드로 모임 정보 미리보기
 * - 기본 정보만 반환 (권한 검증 불필요)
 */
export async function getEventByInviteCode(
  inviteCode: string,
): Promise<Omit<Event, "bank_account" | "host_id" | "is_closed"> | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, title, event_date, location, max_members, category, created_at",
      )
      .eq("invite_code", inviteCode)
      .single();

    if (error) {
      console.error("[getEventByInviteCode] Error:", error.message);
      return null;
    }

    return data as Omit<Event, "bank_account" | "host_id" | "is_closed"> | null;
  } catch (error) {
    console.error("[getEventByInviteCode] Unexpected error:", error);
    return null;
  }
}

/**
 * 사용자가 주최하는 모임 목록
 */
export async function listMyHostedEvents(userId: string): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("host_id", userId)
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[listMyHostedEvents] Error:", error.message);
      return [];
    }

    return (data || []) as Event[];
  } catch (error) {
    console.error("[listMyHostedEvents] Unexpected error:", error);
    return [];
  }
}

/**
 * 사용자가 참여 중인 모임 목록
 * - 승인된 참여자만 조회
 */
export async function listMyParticipatingEvents(
  userId: string,
): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_members")
      .select("event_id")
      .eq("user_id", userId)
      .eq("status", "approved");

    if (error) {
      console.error(
        "[listMyParticipatingEvents] Error fetching members:",
        error.message,
      );
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const eventIds = data.map((member) => member.event_id);

    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds)
      .order("event_date", { ascending: false });

    if (eventsError) {
      console.error(
        "[listMyParticipatingEvents] Error fetching events:",
        eventsError.message,
      );
      return [];
    }

    return (events || []) as Event[];
  } catch (error) {
    console.error("[listMyParticipatingEvents] Unexpected error:", error);
    return [];
  }
}
