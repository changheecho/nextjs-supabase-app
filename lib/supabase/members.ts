// event_members 테이블과 상호작용하는 Server 함수들
import { createClient } from "@/lib/supabase/server";
import type { EventMember, MemberStatus } from "@/types/database";

/**
 * 모임 참여자 목록 조회
 * - 상태별 필터링 가능
 */
export async function getEventMembers(
  eventId: string,
  status?: MemberStatus,
): Promise<EventMember[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("event_members")
      .select("*")
      .eq("event_id", eventId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("[getEventMembers] Error:", error.message);
      return [];
    }

    return (data || []) as EventMember[];
  } catch (error) {
    console.error("[getEventMembers] Unexpected error:", error);
    return [];
  }
}

/**
 * 개인의 참여 상태 조회
 */
export async function getMemberStatus(
  eventId: string,
  userId: string,
): Promise<EventMember | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_members")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 해당 신청 없음
        return null;
      }
      console.error("[getMemberStatus] Error:", error.message);
      return null;
    }

    return data as EventMember;
  } catch (error) {
    console.error("[getMemberStatus] Unexpected error:", error);
    return null;
  }
}

/**
 * 모임 참여 신청
 * - UNIQUE(event_id, user_id) 제약으로 중복 신청 방지
 */
export async function joinEvent(
  eventId: string,
  userId: string,
  memo?: string,
): Promise<EventMember | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_members")
      .insert({
        event_id: eventId,
        user_id: userId,
        status: "pending",
        memo: memo || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[joinEvent] Error:", error.message);
      return null;
    }

    return data as EventMember;
  } catch (error) {
    console.error("[joinEvent] Unexpected error:", error);
    return null;
  }
}

/**
 * 참여자 상태 변경 (주최자만)
 * - pending → approved, rejected, withdrawn
 */
export async function updateMemberStatus(
  eventId: string,
  userId: string,
  status: MemberStatus,
): Promise<EventMember | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_members")
      .update({ status })
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[updateMemberStatus] Error:", error.message);
      return null;
    }

    return data as EventMember;
  } catch (error) {
    console.error("[updateMemberStatus] Unexpected error:", error);
    return null;
  }
}

/**
 * 참여자 삭제 (호스트만)
 */
export async function deleteMember(
  eventId: string,
  userId: string,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("event_members")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);

    if (error) {
      console.error("[deleteMember] Error:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[deleteMember] Unexpected error:", error);
    return false;
  }
}
