"use server";

import { revalidatePath } from "next/cache";

import { mockEvents, mockEventMembers } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles a user joining an event via an invite code.
 */
export async function joinEventByInviteCode(inviteCode: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "액세스 권한이 없습니다. 먼저 로그인해주세요.",
    };
  }

  const event = mockEvents.find((e) => e.invite_code === inviteCode);
  if (!event) {
    return { success: false, error: "유효하지 않은 초대 코드입니다." };
  }

  if (event.is_closed) {
    return { success: false, error: "마감된 모임입니다." };
  }

  // Check if user is already a member
  const isAlreadyMember = mockEventMembers.some(
    (member) => member.event_id === event.id && member.user_id === user.id,
  );

  if (!isAlreadyMember) {
    mockEventMembers.push({
      id: `member-${Date.now()}`,
      event_id: event.id,
      user_id: user.id,
      status: "approved", // auto-approve for invite link
      memo: "초대 링크로 가입",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Validate cache paths
    revalidatePath(`/join/${inviteCode}`);
    revalidatePath(`/protected/events/${event.id}`);
  }

  return { success: true, eventId: event.id };
}
