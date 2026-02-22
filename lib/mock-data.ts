// Mock 데이터: 실제 데이터베이스 스키마와 동일한 구조
// Stage 3에서 Supabase로 연동되면 이 파일은 제거됨

import type { Profile } from "@/types/database";

/**
 * Event 타입 - 모임/이벤트 정보
 */
export interface Event {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  category: string;
  event_date: string;
  location: string;
  max_members: number;
  invite_code: string;
  bank_account: { bank?: string; account?: string; name?: string } | null;
  is_closed: boolean;
  created_at: string;
}

/**
 * EventMember 타입 - 모임 참여자
 */
export interface EventMember {
  id: string;
  event_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  memo?: string;
  created_at: string;
}

/**
 * Announcement 타입 - 공지사항
 */
export interface Announcement {
  id: string;
  event_id: string;
  author_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
}

// 현재 사용자 정보 (로그인한 사용자)
export const mockCurrentUser: Profile = {
  id: "user-001",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  full_name: "김철수",
  avatar_url: null,
  username: null,
  bio: null,
  website: null,
};

// 모든 사용자 프로필 정보
export const mockProfiles: Record<string, Profile> = {
  "user-001": {
    id: "user-001",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-02-20T14:30:00Z",
    full_name: "김철수",
    avatar_url: null,
    username: "kim_chulsu",
    bio: "소모임 주최자",
    website: null,
  },
  "user-002": {
    id: "user-002",
    created_at: "2026-01-20T09:15:00Z",
    updated_at: "2026-02-21T11:00:00Z",
    full_name: "이영희",
    avatar_url: null,
    username: "lee_younghee",
    bio: "활동적인 참여자",
    website: null,
  },
  "user-003": {
    id: "user-003",
    created_at: "2026-02-01T14:45:00Z",
    updated_at: "2026-02-22T16:20:00Z",
    full_name: "박민준",
    avatar_url: null,
    username: "park_minjun",
    bio: "새로운 멤버",
    website: null,
  },
  "user-004": {
    id: "user-004",
    created_at: "2026-02-05T10:30:00Z",
    updated_at: "2026-02-22T15:00:00Z",
    full_name: "최수정",
    avatar_url: null,
    username: "choi_sujeong",
    bio: "정기 모임 참여자",
    website: null,
  },
};

/**
 * Mock Events 데이터
 * - event-001: 주최자 (user-001)가 주최하는 정기 모임
 * - event-002: 다른 주최자의 모임 (user-002)
 * - event-003: 마감된 모임
 */
export const mockEvents: Event[] = [
  {
    id: "event-001",
    host_id: "user-001",
    title: "2월 정기 모임",
    description: "월별 정기 모임입니다. 다양한 주제로 의견을 나눕니다.",
    category: "모임",
    event_date: "2026-02-28T14:00:00Z",
    location: "강남역 카페",
    max_members: 8,
    invite_code: "ABCD1234",
    bank_account: {
      bank: "국민은행",
      account: "123-456-789012",
      name: "김철수",
    },
    is_closed: false,
    created_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "event-002",
    host_id: "user-002",
    title: "팀 회의 및 네트워킹",
    description: "주간 팀 회의 및 네트워킹 시간입니다.",
    category: "회의",
    event_date: "2026-02-24T09:00:00Z",
    location: "회의실 A",
    max_members: 10,
    invite_code: "EFGH5678",
    bank_account: {
      bank: "신한은행",
      account: "987-654-321098",
      name: "이영희",
    },
    is_closed: false,
    created_at: "2026-02-20T09:30:00Z",
  },
  {
    id: "event-003",
    host_id: "user-003",
    title: "3월 봄 축제",
    description: "함께하는 즐거운 봄 축제입니다. 모두 초대합니다!",
    category: "행사",
    event_date: "2026-03-15T10:00:00Z",
    location: "공원 광장",
    max_members: 20,
    invite_code: "IJKL9012",
    bank_account: null,
    is_closed: true,
    created_at: "2026-02-10T14:00:00Z",
  },
  {
    id: "event-004",
    host_id: "user-001",
    title: "독서 토론 모임",
    description: "이번 달의 책을 함께 읽고 토론합니다.",
    category: "모임",
    event_date: "2026-03-05T18:00:00Z",
    location: "도서관 회의실",
    max_members: 5,
    invite_code: "MNOP3456",
    bank_account: null,
    is_closed: false,
    created_at: "2026-02-18T11:00:00Z",
  },
];

/**
 * Mock EventMembers 데이터
 * 다양한 상태의 참여자 시나리오 포함:
 * - approved: 승인된 참여자
 * - pending: 참여 신청 대기 중
 * - rejected: 거절된 신청
 * - withdrawn: 참여 취소
 */
export const mockEventMembers: EventMember[] = [
  // event-001 (김철수의 정기 모임)
  {
    id: "member-001",
    event_id: "event-001",
    user_id: "user-001",
    status: "approved",
    memo: "주최자",
    created_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "member-002",
    event_id: "event-001",
    user_id: "user-002",
    status: "approved",
    memo: "정기 참가자",
    created_at: "2026-02-20T10:05:00Z",
  },
  {
    id: "member-003",
    event_id: "event-001",
    user_id: "user-003",
    status: "pending",
    memo: "이번이 첫 참가입니다",
    created_at: "2026-02-21T14:20:00Z",
  },
  {
    id: "member-004",
    event_id: "event-001",
    user_id: "user-004",
    status: "approved",
    memo: "지난달에 참가했었습니다",
    created_at: "2026-02-20T11:30:00Z",
  },
  {
    id: "member-005",
    event_id: "event-001",
    user_id: "user-003",
    status: "rejected",
    memo: "일정이 맞지 않아 거절합니다",
    created_at: "2026-02-22T09:00:00Z",
  },

  // event-002 (이영희의 팀 회의)
  {
    id: "member-006",
    event_id: "event-002",
    user_id: "user-002",
    status: "approved",
    memo: "주최자",
    created_at: "2026-02-20T09:30:00Z",
  },
  {
    id: "member-007",
    event_id: "event-002",
    user_id: "user-001",
    status: "approved",
    memo: "팀 멤버",
    created_at: "2026-02-20T10:15:00Z",
  },
  {
    id: "member-008",
    event_id: "event-002",
    user_id: "user-004",
    status: "approved",
    memo: "신입 사원",
    created_at: "2026-02-20T14:00:00Z",
  },
  {
    id: "member-009",
    event_id: "event-002",
    user_id: "user-003",
    status: "withdrawn",
    memo: "건강상 이유로 취소합니다",
    created_at: "2026-02-21T10:00:00Z",
  },

  // event-003 (박민준의 봄 축제 - 마감됨)
  {
    id: "member-010",
    event_id: "event-003",
    user_id: "user-003",
    status: "approved",
    memo: "주최자",
    created_at: "2026-02-10T14:00:00Z",
  },
  {
    id: "member-011",
    event_id: "event-003",
    user_id: "user-001",
    status: "approved",
    memo: "",
    created_at: "2026-02-15T11:00:00Z",
  },
  {
    id: "member-012",
    event_id: "event-003",
    user_id: "user-002",
    status: "approved",
    memo: "가족과 함께 참가합니다",
    created_at: "2026-02-16T16:30:00Z",
  },

  // event-004 (김철수의 독서 토론)
  {
    id: "member-013",
    event_id: "event-004",
    user_id: "user-001",
    status: "approved",
    memo: "주최자",
    created_at: "2026-02-18T11:00:00Z",
  },
  {
    id: "member-014",
    event_id: "event-004",
    user_id: "user-002",
    status: "approved",
    memo: "책을 미리 구매했습니다",
    created_at: "2026-02-18T12:00:00Z",
  },
  {
    id: "member-015",
    event_id: "event-004",
    user_id: "user-004",
    status: "pending",
    memo: "참가 신청합니다",
    created_at: "2026-02-22T15:30:00Z",
  },
];

/**
 * Mock Announcements 데이터
 * - 일부는 핀 공지(is_pinned: true)
 * - 생성 순서대로 정렬
 */
export const mockAnnouncements: Announcement[] = [
  // event-001 공지
  {
    id: "announce-001",
    event_id: "event-001",
    author_id: "user-001",
    title: "장소 변경 안내",
    content:
      "안녕하세요! 이번 모임 장소가 변경되었습니다. 강남역 카페에서 삼성역 카페로 변경되었으니 참고 바랍니다. 더 조용한 환경에서 모임을 가질 수 있을 것 같습니다.",
    is_pinned: true,
    created_at: "2026-02-21T09:00:00Z",
  },
  {
    id: "announce-002",
    event_id: "event-001",
    author_id: "user-001",
    title: "모임 일정 최종 확정",
    content:
      "모임이 2월 28일 오후 2시에 최종 확정되었습니다. 많은 참여 부탁드립니다. 늦지 않게 와주시고, 혹시 올 수 없으시면 미리 말씀해주세요.",
    is_pinned: true,
    created_at: "2026-02-20T14:00:00Z",
  },
  {
    id: "announce-003",
    event_id: "event-001",
    author_id: "user-002",
    title: "음료 준비 안내",
    content:
      "모임에서 간단한 음료와 간식을 준비하겠습니다. 특별히 싫어하는 것이 있으면 댓글로 알려주세요.",
    is_pinned: false,
    created_at: "2026-02-22T10:30:00Z",
  },

  // event-002 공지
  {
    id: "announce-004",
    event_id: "event-002",
    author_id: "user-002",
    title: "회의 안건",
    content:
      "이번 주 회의에서는 Q1 목표 달성도를 점검하고, Q2 계획을 논의합니다. 팀 멤버들은 미리 자신의 진행 상황을 정리해와 주세요.",
    is_pinned: true,
    created_at: "2026-02-22T16:00:00Z",
  },
  {
    id: "announce-005",
    event_id: "event-002",
    author_id: "user-002",
    title: "회의실 변경",
    content: "다음 회의는 B 회의실에서 진행됩니다. 참고 부탁드립니다.",
    is_pinned: false,
    created_at: "2026-02-22T17:00:00Z",
  },

  // event-004 공지
  {
    id: "announce-006",
    event_id: "event-004",
    author_id: "user-001",
    title: "3월 책 선정 완료",
    content:
      "다음 독서 토론의 책이 '한글의 소리'로 결정되었습니다. 3월 초까지 1부를 읽고 오세요. 책은 인터넷 서점에서 구할 수 있습니다.",
    is_pinned: true,
    created_at: "2026-02-22T11:00:00Z",
  },
];

/**
 * Helper 함수: 특정 이벤트의 멤버 조회
 */
export function getEventMembers(eventId: string): EventMember[] {
  return mockEventMembers.filter((member) => member.event_id === eventId);
}

/**
 * Helper 함수: 특정 이벤트의 공지사항 조회
 */
export function getEventAnnouncements(eventId: string): Announcement[] {
  return mockAnnouncements.filter(
    (announcement) => announcement.event_id === eventId,
  );
}

/**
 * Helper 함수: 사용자가 주최한 이벤트 목록 조회
 */
export function getHostedEvents(userId: string): Event[] {
  return mockEvents.filter((event) => event.host_id === userId);
}

/**
 * Helper 함수: 사용자가 참여하는 이벤트 목록 조회 (승인된 것만)
 */
export function getApprovedEvents(userId: string): Event[] {
  const approvedEventIds = mockEventMembers
    .filter(
      (member) => member.user_id === userId && member.status === "approved",
    )
    .map((member) => member.event_id);

  return mockEvents.filter((event) => approvedEventIds.includes(event.id));
}

/**
 * Helper 함수: 프로필 정보 조회
 */
export function getProfile(userId: string): Profile | undefined {
  return mockProfiles[userId];
}

/**
 * Helper 함수: 초대 코드로 이벤트 조회
 */
export function getEventByInviteCode(inviteCode: string): Event | undefined {
  return mockEvents.find((event) => event.invite_code === inviteCode);
}

/**
 * Helper 함수: 이벤트의 승인된 참여자 수 조회
 */
export function getApprovedMemberCount(eventId: string): number {
  return mockEventMembers.filter(
    (member) => member.event_id === eventId && member.status === "approved",
  ).length;
}
