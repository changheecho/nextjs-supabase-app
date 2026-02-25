// announcements 테이블과 상호작용하는 Server 함수들
import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/types/database";

/**
 * 모임 공지 목록 조회
 * - is_pinned = true인 항목이 상단 (정렬: is_pinned DESC, created_at DESC)
 */
export async function getAnnouncements(
  eventId: string,
): Promise<Announcement[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("event_id", eventId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAnnouncements] Error:", error.message);
      return [];
    }

    return (data || []) as Announcement[];
  } catch (error) {
    console.error("[getAnnouncements] Unexpected error:", error);
    return [];
  }
}

/**
 * 공지 상세 조회
 */
export async function getAnnouncementById(
  id: string,
): Promise<Announcement | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[getAnnouncementById] Error:", error.message);
      return null;
    }

    return data as Announcement;
  } catch (error) {
    console.error("[getAnnouncementById] Unexpected error:", error);
    return null;
  }
}

/**
 * 공지 타입 - 작성/수정용
 */
export interface AnnouncementData {
  title: string;
  content: string;
  is_pinned?: boolean;
}

/**
 * 공지 작성 (주최자만)
 */
export async function createAnnouncement(
  eventId: string,
  authorId: string,
  data: AnnouncementData,
): Promise<Announcement | null> {
  try {
    const supabase = await createClient();
    const { data: announcement, error } = await supabase
      .from("announcements")
      .insert({
        event_id: eventId,
        author_id: authorId,
        title: data.title,
        content: data.content,
        is_pinned: data.is_pinned || false,
      })
      .select()
      .single();

    if (error) {
      console.error("[createAnnouncement] Error:", error.message);
      return null;
    }

    return announcement as Announcement;
  } catch (error) {
    console.error("[createAnnouncement] Unexpected error:", error);
    return null;
  }
}

/**
 * 공지 수정 (주최자만)
 * - is_pinned 토글 또는 내용 수정
 */
export async function updateAnnouncement(
  id: string,
  data: Partial<AnnouncementData>,
): Promise<Announcement | null> {
  try {
    const supabase = await createClient();
    const { data: announcement, error } = await supabase
      .from("announcements")
      .update({
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.is_pinned !== undefined && { is_pinned: data.is_pinned }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateAnnouncement] Error:", error.message);
      return null;
    }

    return announcement as Announcement;
  } catch (error) {
    console.error("[updateAnnouncement] Unexpected error:", error);
    return null;
  }
}

/**
 * 공지 삭제 (주최자만)
 */
export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deleteAnnouncement] Error:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[deleteAnnouncement] Unexpected error:", error);
    return false;
  }
}
