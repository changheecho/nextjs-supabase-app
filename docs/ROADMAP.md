# 개발 로드맵 (Development Roadmap)

**프로젝트:** 소모임 통합 관리 웹앱 MVP
**작성일:** 2026-02-22
**상태:** 진행 중

## 개요

소규모 소모임(5~20명) 주최자가 현재 카카오톡, 구글 스프레드시트, 개인 계좌 문자를 오가며 수행하던 공지 전달, 참여자 관리, 카풀 조율, 정산 계산을 하나의 웹앱으로 통합합니다.

**개발 철학:** 올바른 순서로 진행하여 각 단계가 다음 단계의 기초가 되도록 설계합니다.

- **목표 런칭**: Phase 1 MVP (2026-03-22), Phase 2 (2026-04-26)
- **현재 완료**: 이메일/비밀번호 + Google OAuth 인증, 프로필 CRUD, 라우트 보호(proxy.ts), Suspense + Skeleton 패턴

### 핵심 성공 지표

| 지표                          | 목표                        | 측정 시점           |
| ----------------------------- | --------------------------- | ------------------- |
| 생성된 모임 수                | 10개 이상                   | Phase 1 완료 후 4주 |
| 모임당 평균 참여자 수         | 8명 이상                    | Phase 1 완료 후 4주 |
| 초대 링크 통한 참여 신청 비율 | 80% 이상                    | Phase 1 완료 후 4주 |
| 주최자 재사용률               | 2회 이상 모임 생성 비율 60% | Phase 1 완료 후 4주 |

---

## 🎯 5단계 개발 구조 (UI/UX 우선 접근)

개발 철학: **UI/UX를 빠르게 검증한 후 DB를 연결하는 방식**으로 불필요한 재작업을 최소화합니다.

## 📅 전체 타임라인

| Stage       | 내용                           | 소요 시간 | 기간                    |
| ----------- | ------------------------------ | --------- | ----------------------- |
| **Stage 1** | UI/UX 프로토타입 구축          | 4~5일     | 2026-02-23 ~ 2026-03-01 |
| **Stage 2** | 디자인 검증 및 보완            | 3~4일     | 2026-03-02 ~ 2026-03-05 |
| **Stage 3** | 공통 모듈/컴포넌트 + DB 스키마 | 1주       | 2026-03-06 ~ 2026-03-12 |
| **Stage 4** | 핵심 기능 API 연동 (Phase 1)   | 2주       | 2026-03-13 ~ 2026-03-26 |
| **Stage 5** | 추가 기능 개발 (카풀/정산)     | 2.5주     | 2026-03-27 ~ 2026-04-16 |
| **Stage 6** | 최적화 및 배포                 | 1.5주     | 2026-04-17 ~ 2026-04-30 |
| **총합**    | **약 8주 (약 2개월)**          |           |                         |

---

## Stage 1: UI/UX 프로토타입 구축 (모킹 데이터)

**기간**: 2026-02-23 - 2026-03-01 (4~5일)
**목표**: 모킹 데이터로 전체 UI/UX 흐름을 빠르게 검증하고 개선점 파악

### 💡 왜 이 순서인가?

데이터베이스 설계 전에 UI/UX를 먼저 검증하면, 실제 필요한 필드와 상태를 명확히 파악할 수 있어 DB 스키마 설계가 더 정확해집니다. 또한 UX 문제를 조기에 발견하여 비용을 절감할 수 있습니다.

### ✅ 완료 기준

- [ ] 모든 페이지 UI가 모킹 데이터로 정상 렌더링
- [ ] 폼 유효성 검사 및 오류 메시지 표시 정상
- [ ] 모바일 뷰포트(375px, 768px) 반응형 렌더링 확인
- [ ] 모든 상태 변경(탭 전환, 필터 등) 정상 작동
- [ ] Suspense + Skeleton 패턴 적용 완료

### 📝 핵심 작업

#### 1.1 의존성 설치 및 기본 준비

```bash
npm install react-hook-form zod @hookform/resolvers date-fns
```

- [ ] 필수 패키지 설치 완료
- [ ] TypeScript strict 모드 확인
- [ ] 페이지 디렉토리 구조 생성 (app/protected/events/, app/join/)

#### 1.2 모킹 데이터 정의

- [ ] `lib/mock-data.ts` 파일 생성
- [ ] Event, EventMember, Announcement 모킹 데이터 정의
- [ ] 다양한 시나리오 데이터 작성 (주최자/참여자/승인/대기 상태 등)

#### 1.3 폼 검증 스키마 정의

- [ ] Zod로 EventCreateSchema 정의
- [ ] AnnouncementSchema 정의
- [ ] JoinEventSchema 정의
- [ ] 폼 유효성 검증 로직 구현

#### 1.4 UI 페이지 구현 (모킹 데이터 사용)

- [ ] 내 이벤트 페이지 (`/protected/events`) - 모바일 최적화
  - "내가 주최한 모임" / "참여 중인 모임" 탭
  - 모임 카드 목록 (날짜순 정렬)
  - Skeleton 로딩 상태 UI
  - 모바일 반응형 디자인 (375px 이상 최적화)
  - 터치 친화적 버튼 및 탭 네비게이션

- [ ] 모임 생성 페이지 (`/protected/events/new`)
  - 폼 필드: 제목, 카테고리, 날짜/시간, 장소, 최대 인원, 계좌 정보
  - 폼 제출 → 콘솔 로그 (아직 DB 저장 안 함)
  - 유효성 오류 메시지 표시

- [ ] 모임 홈 페이지 (`/protected/events/[eventId]`)
  - 기본 정보 표시
  - 초대 링크 복사 버튼 (UI만)
  - 핀 고정 공지 영역
  - 탭 네비게이션 (홈/공지/참여자/카풀/정산)

- [ ] 참여자 관리 페이지 (`/protected/events/[eventId]/members`)
  - 상태별 필터 탭 (전체/대기/승인/거절)
  - 각 참여자 정보 표시
  - 승인/거절/탈퇴 버튼 (클릭 → 콘솔 로그)

- [ ] 공지 목록 페이지 (`/protected/events/[eventId]/announcements`)
  - 핀 공지 상단 고정
  - 공지 카드 목록
  - 상대 시간 표시 (date-fns)

- [ ] 공지 작성 페이지 (`/protected/events/[eventId]/announcements/new`)
  - 폼: 제목, 내용, 핀 고정 여부
  - 폼 제출 → 콘솔 로그

- [ ] 초대 링크 처리 페이지 (`/app/join/[inviteCode]`)
  - 비인증 상태: 모임 정보 미리보기
  - "참여 신청하기" 버튼 → 로그인 페이지로 이동

#### 1.5 공유 UI 컴포넌트

- [ ] EventCard (모임 카드)
- [ ] MemberCard (참여자 카드)
- [ ] AnnouncementCard (공지 카드)
- [ ] StatusBadge, CategoryBadge (상태/카테고리 배지)
- [ ] LoadingSkeleton (로딩 상태)

#### 1.6 에러/로딩 상태 UI

- [ ] ErrorBoundary 컴포넌트
- [ ] 404/403 커스텀 페이지
- [ ] 로딩 중 Skeleton UI

### 🧪 Testing (모킹 데이터 기반)

- [ ] [Playwright MCP] 모임 생성 폼 UI 검증
  - 필수 필드 미입력 시 에러 메시지 표시 확인
  - 정상 입력 후 폼 제출 (콘솔 로그 확인)
  - 모바일 뷰포트 입력 UI 검토

- [ ] [Playwright MCP] 모임 목록 페이지 검증
  - 탭 전환 동작 확인
  - Skeleton 로딩 상태 표시

- [ ] [Playwright MCP] 참여자 관리 페이지 검증
  - 상태별 탭 필터 동작
  - 버튼 크기 및 가독성

- [ ] [Playwright MCP] 초대 링크 검증
  - 비인증 상태 모임 정보 표시
  - "참여 신청하기" 버튼 클릭 → 로그인 이동

---

## Stage 2: 디자인 검증 및 보완

**기간**: 2026-03-02 - 2026-03-05 (3~4일)
**목표**: Stage 1 UI/UX를 검증하고 개선점 반영

### 💡 왜 이 순서인가?

DB 설계 전에 UI/UX의 문제점을 발견하고 수정하면, 후속 DB 스키마 설계가 더 정확하고 효율적입니다.

### ✅ 완료 기준

- [x] 모바일 반응형 디자인 검증 완료 (375px)
- [ ] 태블릿/데스크톱 반응형 디자인 검증 (768px, 1024px)
- [ ] 색상 및 타이포그래피 일관성 검증 완료
- [ ] 접근성 검토 완료 (색상 대비, 터치 영역)
- [ ] 최종 개선사항 반영 및 UI/UX 승인

### 📝 핵심 작업

#### 2.1 UX 검증

- [ ] 사용자 흐름 재검토
  - 주최자 여정: 모임 생성 → 초대 링크 공유 → 참여자 승인
  - 참여자 여정: 초대 링크 → 로그인 → 참여 신청
- [ ] 폼 입력 순서 및 필드 검증
- [ ] 버튼/링크의 명확성 검증
- [ ] 에러 메시지의 사용자 친화성 검증

#### 2.2 디자인 검증

- [ ] 색상 선택의 일관성
- [ ] 타이포그래피 (글씨 크기, 줄 높이)
- [ ] 여백과 정렬 일관성
- [ ] 아이콘 사용의 일관성

#### 2.3 반응형 디자인 최종 검수

- [ ] 모바일 (375px): 터치 영역 최소 44x44px 확인
- [ ] 태블릿 (768px): 레이아웃 최적화
- [ ] 데스크톱 (1024px+): 여백 활용도

#### 2.4 접근성 검토 (기본)

- [ ] 색상 대비 (WCAG 최소 4.5:1)
- [ ] 버튼 크기 및 터치 영역
- [ ] alt 텍스트 (이미지)

#### 2.5 개선사항 반영

- [ ] 식별된 UX 문제 수정
- [ ] 레이아웃 개선사항 적용
- [ ] 컴포넌트 스타일링 최적화
- [ ] 최종 검수

### 🧪 Testing (검증 기반)

- [ ] [비개발자 포함] 사용자 평가
  - 모임 생성 흐름의 직관성
  - 정보 구조의 명확성
  - 버튼/링크의 명확성
  - 전체적인 사용 경험

- [ ] 모바일 기기 실제 테스트 (가능한 경우)
  - iOS Safari: 날짜/시간 입력 필드 동작
  - Android Chrome: 터치 반응성

---

## Stage 3: 공통 모듈/컴포넌트 + DB 스키마 설계

**기간**: 2026-03-06 - 2026-03-12 (1주)
**목표**: UI/UX 검증 완료 후 DB 스키마 설계 및 공통 컴포넌트 구현

### 💡 왜 이 순서인가?

UI/UX가 최종 확정된 후 DB 스키마를 설계하면, 실제 필요한 필드와 관계를 정확하게 파악할 수 있습니다.

### ✅ 완료 기준

- [ ] 모든 Zod 스키마 정의 완료
- [ ] 공통 컴포넌트 10개 이상 구현 완료
- [ ] Supabase 테이블 생성 완료 (events, event_members, announcements)
- [ ] RLS 정책 설정 완료
- [ ] types/database.ts 생성 완료

### 📝 핵심 작업

#### 3.1 DB 스키마 설계 및 생성

- [ ] `events` 테이블 생성
  - id, host_id, title, description, category, event_date, location, max_members
  - invite_code, bank_account, is_closed, created_at
- [ ] `event_members` 테이블 생성
  - id, event_id, user_id, status, memo, created_at
- [ ] `announcements` 테이블 생성
  - id, event_id, author_id, title, content, is_pinned, created_at
- [ ] 각 테이블 RLS 정책 설정
- [ ] 외래키 관계 및 제약조건 정의

#### 3.2 TypeScript 타입 생성

- [ ] `npx supabase gen types typescript > types/database.ts` 실행
- [ ] 편의 타입 정의 (하단)
  ```typescript
  export type Event = Tables<"events">;
  export type EventMember = Tables<"event_members">;
  export type Announcement = Tables<"announcements">;
  ```

#### 3.3 Server 유틸리티 작성

- [ ] `lib/supabase/events.ts`: 이벤트 조회 함수
  - getEventById, listMyHostedEvents, listMyParticipatingEvents
- [ ] `lib/supabase/members.ts`: 참여자 조회 함수
  - getEventMembers, getMemberStatus
- [ ] `lib/supabase/announcements.ts`: 공지 조회 함수

#### 3.4 상수 및 타입 파일 정리

- [ ] 모임 카테고리 상수
- [ ] 참여자 상태 상수
- [ ] 기타 설정값

#### 3.5 Mock 데이터 → 실제 데이터 준비

- [ ] mock-data.ts의 구조가 DB 스키마와 일치하는지 확인
- [ ] 필요 시 mock 데이터 구조 조정

### 🧪 Testing (DB 연결 전 검증)

- [ ] [Supabase MCP] RLS 정책 검증
  - 다른 사용자의 모임이 조회되지 않는지 확인
  - 비승인 참여자 접근 불가 확인
  - 주최자 권한만 수정 가능 확인

- [ ] [Supabase MCP] 초대 링크 공개 읽기 정책
  - 비인증 사용자가 초대코드로 모임 정보 조회 가능 확인

- [ ] 타입 생성 정상성
  - `npx tsc --noEmit` 오류 0건 확인

---

## Stage 4: 핵심 기능 API 연동 (Phase 1)

**기간**: 2026-03-13 - 2026-03-26 (2주)
**목표**: Stage 1 UI와 Stage 3 DB를 연결하여 실제 데이터 기반 동작 구현

### ✅ 완료 기준

- [ ] 주최자가 모임 생성 → 초대 링크 공유 → 참여자 승인 전체 흐름 정상 작동
- [ ] 공지 작성 및 핀 고정 정상 작동
- [ ] 초대 링크로 비인증 사용자 진입 후 로그인 → 자동 참여 신청 정상 작동
- [ ] 모바일 반응형 동작 확인
- [ ] E2E 테스트 모두 통과

### 📝 핵심 작업

#### 4.1 Server Action 구현

- [ ] `lib/actions/event.ts`: 모임 생성/수정/삭제
  - `createEvent`: 폼 데이터 → Supabase INSERT
  - `updateEvent`, `closeEvent`

- [ ] `lib/actions/member.ts`: 참여자 관리
  - `joinEvent`: 참여 신청
  - `updateMemberStatus`: 승인/거절

- [ ] `lib/actions/announcement.ts`: 공지 작성
  - `createAnnouncement`

#### 4.2 Server Component 구현

- [ ] 모임 목록 페이지
  - DB에서 실제 데이터 조회
  - 주최/참여 모임 분리 쿼리

- [ ] 모임 홈 페이지
  - 모임 정보 + 핀 공지 조회
  - 인증 체크 및 권한 검증

- [ ] 참여자 관리 페이지
  - 참여자 목록 조회
  - 상태별 필터링

- [ ] 공지 목록 페이지
  - 핀 공지 상단 고정 쿼리

#### 4.3 초대 링크 처리

- [ ] proxy.ts 수정: `/join` 경로 예외 처리
- [ ] 비인증 사용자: 공개 조회 RLS로 모임 정보 표시
- [ ] 인증 사용자: 자동 참여 신청 처리 + 모임 홈으로 리다이렉트

#### 4.4 Client Component (상호작용 전용)

- [ ] 초대 링크 복사 (`components/copy-invite-link.tsx`)
- [ ] 폼 제출 로딩/에러 상태

### 🧪 Testing (DB 연결 후)

- [ ] [Playwright MCP] 주최자 여정 E2E 테스트
  - 로그인 → 모임 생성 → DB 저장 확인 → 초대 링크 복사

- [ ] [Playwright MCP] 참여자 여정 E2E 테스트
  - 비인증 초대 링크 → 로그인 → 참여 신청 → DB 저장

- [ ] [Playwright MCP] 참여자 관리 E2E 테스트
  - 신청자 목록 → 승인 버튼 → 상태 변경 반영

- [ ] [Supabase MCP] 권한 검증
  - 다른 사용자로 로그인 후 모임 접근 불가 확인

- [ ] [Playwright MCP] 모바일 테스트
  - 375px 뷰포트에서 전체 흐름 확인

---

## Stage 5: 추가 기능 개발 (카풀/정산)

**기간**: 2026-03-27 - 2026-04-16 (2.5주)
**목표**: Phase 2 기능 (카풀, 정산) 구현

### ✅ 완료 기준

- [ ] 공지 기능 완료 및 테스트 통과
- [ ] 카풀 기능 완료 및 E2E 테스트 통과
- [ ] 정산 기능 완료 및 계산 로직 검증
- [ ] 모든 기능 모바일 반응형 확인

### 📝 핵심 작업

#### 5.1 공지 기능 (F007, F008) - 4~5일

- [ ] 공지 작성 페이지 → Server Action 연동
- [ ] 공지 목록 페이지 → DB 조회 연동
- [ ] 핀 공지 상단 고정 구현
- [ ] 모임 홈에 핀 공지 요약 표시

#### 5.2 카풀 기능 (F011~F013) - 4~5일

- [ ] Supabase 테이블: carpool_offers, carpool_requests
- [ ] RLS 정책 설정
- [ ] types/database.ts 업데이트
- [ ] 카풀 페이지 구현
  - 드라이버: 카풀 제공 등록
  - 탑승자: 카풀 신청
  - 드라이버: 탑승 신청 수락/거절

#### 5.3 정산 기능 (F014~F016) - 4~5일

- [ ] Supabase 테이블: expense_items, expense_splits
- [ ] RLS 정책 설정
- [ ] types/database.ts 업데이트
- [ ] 정산 페이지 구현
  - 주최자: 항목 추가 (균등/수동)
  - 참여자: 부담액 및 계좌 정보 확인
  - 입금 확인 처리
- [ ] 정산 계산 로직 (균등/수동 분할)

### 🧪 Testing (Phase 2)

- [ ] [Playwright MCP] 공지 작성/조회 E2E 테스트
- [ ] [Playwright MCP] 카풀 등록/신청/수락 전체 흐름
- [ ] [Playwright MCP] 정산 계산 정확성 검증
- [ ] 엣지 케이스: 정원 초과, 마감된 모임 등

---

## Stage 6: 최적화 및 배포

**기간**: 2026-04-17 - 2026-04-30 (1.5주)
**목표**: 프로덕션 품질 확보 및 배포

### ✅ 완료 기준

- [ ] Lighthouse 성능 스코어 80 이상
- [ ] 모바일/데스크톱 모두 정상 작동
- [ ] 모든 엣지 케이스 처리 완료
- [ ] 프로덕션 배포 완료

### 📝 핵심 작업

#### 6.1 성능 최적화 - 3~4일

- [ ] 이미지 최적화 (Next.js Image)
- [ ] 번들 크기 분석 및 감소
- [ ] 동적 임포트 적용
- [ ] Supabase 쿼리 최적화
- [ ] 캐싱 전략 수립

#### 6.2 에러 처리 및 엣지 케이스 - 3~4일

- [ ] 마감된 모임 처리
- [ ] 정원 초과 처리
- [ ] 네트워크 오류 재시도 로직
- [ ] 커스텀 에러 페이지 (404, 403, 500)

#### 6.3 테스트 및 문서화 - 2~3일

- [ ] E2E 테스트 (Playwright)
- [ ] 모바일 뷰포트 테스트
- [ ] 최종 린트 + 타입 체크
- [ ] 문서 업데이트

#### 6.4 배포 준비

- [ ] 프로덕션 환경 변수 설정
- [ ] 빌드 테스트 (`npm run build`)
- [ ] Vercel 배포
- [ ] 도메인 연결

---

## Phase 1: 공지 + 참여자 관리 MVP

**기간**: 2026-02-23 - 2026-03-22 (4주)
**목표**: 카카오톡 + 구글 스프레드시트 대체 가능한 최소 기능 세트 완성

### 구현 기능

- **F001 모임 생성**: 제목, 카테고리, 날짜/시간, 장소, 최대 인원, 계좌 정보 입력. 8자리 초대코드 자동 생성
- **F002 내 이벤트 목록**: 내가 주최한 모임 / 참여 중인 모임 탭 구분 표시 (모바일 최적화)
- **F003 모임 홈**: 핀 공지 요약, 기본 정보, 인원 현황, 초대 링크 복사 버튼
- **F004 초대 링크 입장**: 비인증 사용자 모임 정보 미리보기 허용, 로그인 후 자동 참여 신청 처리
- **F005 참여 신청**: 참여자 모임 신청 및 메모 입력
- **F006 참여자 관리**: 주최자가 신청자 승인/거절/탈퇴 처리, 상태별 필터 조회
- **F007 공지 작성**: 제목, 내용, 핀 고정 여부 입력 (주최자 전용)
- **F008 공지 목록**: 전체 참여자 조회 가능, 핀 공지 상단 고정
- **F009 모임 마감**: 신규 참여 신청 마감. 마감 후 초대 링크로 신규 신청 불가

---

### Week 1: UI/UX 프로토타입 + 신규 의존성 + 컴포넌트 구축

**기간**: 2026-02-23 - 2026-03-01

**목표**: 모킹 데이터로 전체 UI/UX 흐름을 빠르게 검증하고, 보완할 점을 파악한 후 DB 연결 준비

#### Technical Tasks

- [Complexity: S] 신규 패키지 설치 (Owner: Frontend)
  - `npm install react-hook-form zod @hookform/resolvers date-fns` 실행

- [Complexity: M] 모킹 데이터 구조 정의 (Owner: Frontend)
  - `lib/mock-data.ts` 파일 생성
  - 샘플 Event, EventMember, Announcement 타입 정의
  - 주최자 계정, 승인 참여자, 대기 중인 참여자 시나리오별 테스트 데이터 생성

- [Complexity: M] 모임 생성 폼 컴포넌트 구현 (Owner: Frontend)
  - 파일: `app/protected/events/new/page.tsx`
  - `react-hook-form` + `zod`로 폼 유효성 검사 구현
  - 필드: 제목, 카테고리(select), 날짜/시간(date input), 장소, 최대 인원, 계좌 정보(은행명/계좌번호/예금주)
  - **아직 Supabase INSERT 없이 콘솔 로그로 폼 데이터만 출력**
  - 폼 제출 후 모킹 이벤트 ID로 `/protected/events/[eventId]`로 리디렉션

- [Complexity: M] 내 이벤트 페이지 UI 구현 - 모바일 최적화 (Owner: Frontend)
  - 파일: `app/protected/events/page.tsx`
  - 모킹 데이터로 "내가 주최한 모임" / "참여 중인 모임" 탭 표시
  - 각 모임 카드: 제목, 날짜, 장소, 현재 참여자 수 / 최대 인원 표시
  - Suspense + Skeleton 패턴 적용 (로딩 상태 미리 구성)
  - 모바일 반응형 디자인: 375px 이상에서 최적화된 레이아웃
  - 터치 친화적 버튼 및 탭 네비게이션 (최소 44x44px)

- [Complexity: M] 모임 홈 페이지 UI 구현 (Owner: Frontend)
  - 파일: `app/protected/events/[eventId]/page.tsx`
  - 기본 정보 표시: 제목, 날짜, 장소, 카테고리, 현재 참여자 수 / 최대 인원
  - 초대 링크 복사 버튼 UI (아직 클립보드 기능 없이 UI만)
  - 마감 여부 배지 표시
  - 탭 네비게이션 레이아웃 (공지 / 참여자 / 카풀 / 정산 탭)

- [Complexity: M] 참여자 관리 페이지 UI 구현 (Owner: Frontend)
  - 파일: `app/protected/events/[eventId]/members/page.tsx`
  - 모킹 데이터로 상태별 탭 필터: 대기(pending) / 승인(approved) / 거절(rejected)
  - 각 신청자 카드: 이름, 신청일시, 메모, 승인/거절 버튼 UI

- [Complexity: M] 공지 목록 페이지 UI 구현 (Owner: Frontend)
  - 파일: `app/protected/events/[eventId]/announcements/page.tsx`
  - 모킹 데이터로 공지 목록 표시 (핀 공지 상단 고정)
  - 핀 아이콘 배지, 상대 시간 표시 (date-fns 활용)

- [Complexity: M] 공지 작성 폼 컴포넌트 구현 (Owner: Frontend)
  - 파일: `app/protected/events/[eventId]/announcements/new/page.tsx`
  - `react-hook-form` + `zod`로 폼 유효성 검사
  - 필드: 제목(필수), 내용(필수, textarea), 핀 고정 여부(checkbox)

- [Complexity: M] 초대 링크 처리 페이지 UI 구현 (Owner: Frontend)
  - 파일: `app/join/[inviteCode]/page.tsx`
  - 비인증 사용자: 모임 정보(제목, 날짜, 장소) 미리보기 표시
  - "참여 신청하기" 버튼 클릭 시 `/auth/login?redirect=/join/[inviteCode]`로 이동

- [Complexity: S] 공유 컴포넌트 라이브러리 구성 (Owner: Frontend)
  - `components/events/event-card.tsx` - 모임 카드
  - `components/events/member-card.tsx` - 참여자 카드
  - `components/events/announcement-card.tsx` - 공지 카드

#### Week 1 Testing Tasks

- [ ] [Playwright MCP] 모임 생성 폼 UI/UX 테스트
  - 로그인 상태에서 `/protected/events/new` 접근
  - 필수 필드 미입력 시 유효성 오류 메시지 표시 확인
  - 정상 입력 후 폼 제출 (콘솔 데이터 로그 확인만)
  - 모바일 뷰포트(375px)에서 폼 입력 UI 검토

- [ ] [Playwright MCP] 내 이벤트 페이지 UI 검증 (모바일)
  - 로그인 후 `/protected/events` 접근
  - 탭 전환 애니메이션 확인
  - Skeleton 로딩 상태 표시 확인
  - 모바일 뷰포트(375px) 레이아웃 확인
  - 터치 버튼 크기 및 가독성 확인

- [ ] [Playwright MCP] 모임 홈 페이지 통합 테스트
  - 모임 정보 표시 정확성
  - 탭 네비게이션 클릭 시 UI 전환 확인

- [ ] [Playwright MCP] 참여자 관리 페이지 UI 검증
  - 상태별 탭 필터 동작 확인
  - 버튼 터치 영역 크기 및 가독성

- [ ] [Playwright MCP] 공지 목록/작성 UI 검증
  - 핀 공지가 상단에 고정되는지 확인
  - 공지 작성 폼 유효성 오류 표시

- [ ] [Playwright MCP] 초대 링크 UI 검증
  - 비인증 상태에서 초대 링크 접근 및 모임 정보 표시
  - "참여 신청하기" 버튼 클릭 시 로그인 페이지로 이동

- [ ] 디자인 검토 (비개발자 포함 선택사항)
  - 색상, 레이아웃, 버튼 크기, 타이포그래피 피드백 수집
  - 사용자 플로우 UX 개선점 파악
  - 보완할 부분 리스트업

#### Week 1 완료 기준

- [ ] 모든 페이지 UI가 모킹 데이터로 정상 렌더링
- [ ] 폼 유효성 검사 및 오류 메시지 표시 정상
- [ ] 모바일 뷰포트(375px, 768px, 1024px) 반응형 검증 완료
- [ ] 내 이벤트 페이지 모바일 UX 최적화 완료 (터치 친화적 UI)
- [ ] 주요 UX 개선점 식별 및 문서화
- [ ] 팀 검토 완료 및 피드백 반영

---

### Week 2: DB 스키마 생성 + RLS 정책 설정 + 타입 생성

**기간**: 2026-03-02 - 2026-03-08

**목표**: Week 1에서 검증된 UI/UX를 바탕으로 데이터베이스 기반 구축

#### Technical Tasks

- [Complexity: S] Supabase `events` 테이블 생성 (Owner: Backend)

  ```sql
  CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    max_members INTEGER NOT NULL DEFAULT 20,
    invite_code TEXT UNIQUE NOT NULL,
    bank_account JSONB,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```

- [Complexity: S] Supabase `event_members` 테이블 생성 (Owner: Backend)

  ```sql
  CREATE TABLE event_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
    memo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(event_id, user_id)
  );
  ```

- [Complexity: S] Supabase `announcements` 테이블 생성 (Owner: Backend)

  ```sql
  CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```

- [Complexity: M] `events` 테이블 RLS 정책 설정 (Owner: Backend)

  ```sql
  ALTER TABLE events ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "events_select" ON events FOR SELECT
    USING (
      host_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM event_members
        WHERE event_members.event_id = events.id
          AND event_members.user_id = auth.uid()
          AND event_members.status = 'approved'
      )
    );

  CREATE POLICY "events_insert" ON events FOR INSERT
    WITH CHECK (host_id = auth.uid());

  CREATE POLICY "events_update" ON events FOR UPDATE
    USING (host_id = auth.uid());

  CREATE POLICY "events_delete" ON events FOR DELETE
    USING (host_id = auth.uid());

  CREATE POLICY "events_public_by_invite" ON events FOR SELECT
    USING (true);
  ```

- [Complexity: M] `event_members` 테이블 RLS 정책 설정 (Owner: Backend)

  ```sql
  ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "event_members_select" ON event_members FOR SELECT
    USING (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_members.event_id
          AND events.host_id = auth.uid()
      )
    );

  CREATE POLICY "event_members_insert" ON event_members FOR INSERT
    WITH CHECK (user_id = auth.uid());

  CREATE POLICY "event_members_update" ON event_members FOR UPDATE
    USING (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM events
        WHERE events.id = event_members.event_id
          AND events.host_id = auth.uid()
      )
    );
  ```

- [Complexity: M] `announcements` 테이블 RLS 정책 설정 (Owner: Backend)

  ```sql
  ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "announcements_select" ON announcements FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM events
        WHERE events.id = announcements.event_id
          AND events.host_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM event_members
        WHERE event_members.event_id = announcements.event_id
          AND event_members.user_id = auth.uid()
          AND event_members.status = 'approved'
      )
    );

  CREATE POLICY "announcements_insert" ON announcements FOR INSERT
    WITH CHECK (
      author_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM events
        WHERE events.id = announcements.event_id
          AND events.host_id = auth.uid()
      )
    );

  CREATE POLICY "announcements_update" ON announcements FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM events
        WHERE events.id = announcements.event_id
          AND events.host_id = auth.uid()
      )
    );

  CREATE POLICY "announcements_delete" ON announcements FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM events
        WHERE events.id = announcements.event_id
          AND events.host_id = auth.uid()
      )
    );
  ```

- [Complexity: S] `types/database.ts` 재생성 및 편의 타입 추가 (Owner: Backend)
  - `npx supabase gen types typescript --project-id [PROJECT_ID] > types/database.ts` 실행
  - 파일 하단에 편의 타입 추가:
  ```typescript
  export type Event = Database["public"]["Tables"]["events"]["Row"];
  export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
  export type EventMember =
    Database["public"]["Tables"]["event_members"]["Row"];
  export type Announcement =
    Database["public"]["Tables"]["announcements"]["Row"];
  export type MemberStatus = "pending" | "approved" | "rejected" | "withdrawn";
  ```

#### Week 2 Testing Tasks

- [ ] [Supabase MCP] RLS 정책 검증
  - 다른 사용자의 모임이 조회되지 않는지 확인
  - 비승인 참여자(pending)가 모임 데이터 접근 불가 확인
  - 주최자만 모임 수정/삭제 가능 확인

- [ ] [Supabase MCP] 초대 링크 공개 읽기 정책 검증
  - 비인증 사용자가 invitation code로 모임 정보 조회 가능 확인

- [ ] 타입 생성 정상성 확인
  - `types/database.ts` 파일이 정상 생성되었는지 확인
  - TypeScript 타입 컴파일 오류 없음 확인

#### Week 2 의존성

- `events`, `event_members`, `announcements` 테이블 생성 완료 필수
- RLS 정책 설정 완료 필수
- types/database.ts 재생성 완료 필수

---

### Week 3: API 연동 + Server Action 구현 + 실제 데이터 연결

**기간**: 2026-03-09 - 2026-03-15

**목표**: Week 1 UI와 Week 2 DB를 연결하여 실제 데이터 기반 동작 구현

#### Technical Tasks

- [Complexity: L] `proxy.ts` 수정 - `/join` 경로 예외 처리 (Owner: Backend)

  ```typescript
  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/join")  // 초대 링크 예외 추가
  )
  ```

- [Complexity: M] 모임 생성 Server Action 구현 (Owner: Backend)
  - `lib/actions/event.ts` 파일 생성
  - `createEvent` Server Action: 폼 데이터 → Supabase events INSERT
  - `invite_code` 서버사이드 자동 생성

- [Complexity: M] 내 이벤트 페이지 조회 Server Component 구현 (Owner: Frontend)
  - `components/events/event-list-server.tsx` 서버 컴포넌트 생성
  - 주최한 모임과 참여 중인 모임 별도 쿼리
  - 모바일 최적화 레이아웃 (반응형 그리드/리스트)

- [Complexity: M] 모임 홈 조회 Server Component 구현 (Owner: Frontend)
  - `components/events/event-detail-server.tsx` 서버 컴포넌트 생성
  - 모임 정보 + 핀 공지 조회

- [Complexity: L] 초대 링크 처리 페이지 구현 (Owner: Frontend)
  - 파일: `app/join/[inviteCode]/page.tsx`
  - 비인증 사용자: 공개 읽기 RLS로 모임 정보 조회
  - 인증 사용자: 참여 신청 처리

- [Complexity: M] 참여자 관리 페이지 구현 (Owner: Frontend)
  - `components/events/member-list-server.tsx` 서버 컴포넌트 생성
  - Server Action: `updateMemberStatus`, `closeEvent`

- [Complexity: M] 공지 조회 Server Component 구현 (Owner: Frontend)
  - `components/events/announcement-list-server.tsx` 서버 컴포넌트 생성

- [Complexity: M] 공지 작성 Server Action 구현 (Owner: Backend)
  - `lib/actions/announcement.ts` 파일 생성
  - `createAnnouncement` Server Action

- [Complexity: M] 초대 링크 복사 기능 구현 (Owner: Frontend)
  - `components/copy-invite-link.tsx` 클라이언트 컴포넌트

#### Week 3 Testing Tasks

- [ ] [Playwright MCP] 모임 생성 E2E 테스트 (DB 연결 후)
  - 폼 작성 → 제출 → DB 저장 확인
  - `browser_network_requests`로 Supabase INSERT 요청 성공 확인

- [ ] [Playwright MCP] 초대 링크 전체 흐름 검증 (핵심)
  - 비인증 → 초대 링크 → 로그인 → 자동 복귀 → 참여 신청 전체 흐름
  - Supabase event_members 테이블에 실제 레코드 생성 확인

- [ ] [Playwright MCP] 참여자 관리 & 승인 E2E 테스트
  - 신청자 목록 표시 → 승인 버튼 클릭 → 상태 변경 반영 확인

- [ ] [Playwright MCP] 공지 작성 & 조회 E2E 테스트
  - 공지 작성 폼 제출 → 목록 즉시 반영 확인

- [ ] [Supabase MCP] RLS 정책 실제 검증
  - 다른 사용자로 로그인하여 해당 모임 접근 불가 확인

- [ ] API 오류 처리 테스트
  - 존재하지 않는 inviteCode 접근 시 Not Found 페이지 표시

#### Week 3 의존성

- Week 2 DB 셋업 + RLS 정책 완료 필수
- 모든 Server Component와 Server Action 구현 완료 필수

---

### Week 4: 마무리 + 에러 핸들링 + 최종 QA

**기간**: 2026-03-16 - 2026-03-22

**목표**: 에러 핸들링, 엣지 케이스 처리, 최종 QA 및 성능 최적화

#### Technical Tasks

- [Complexity: M] 에러 핸들링 + 사용자 친화적 메시지 (Owner: Frontend + Backend)
  - 모임 목록 빈 상태: "아직 모임이 없습니다. 새 모임을 만들어보세요!" 안내
  - 공지 목록 빈 상태: "아직 공지가 없습니다" 안내
  - Next.js `error.tsx` 컴포넌트 추가
  - `not-found.tsx` 추가 (잘못된 eventId, inviteCode)

- [Complexity: M] 엣지 케이스 처리 (Owner: Backend)
  - 정원 초과 시 참여 신청 차단
  - 마감된 모임(is_closed=true) 초대 링크 신청 불가
  - 이미 신청한 사용자 재신청 방지
  - 주최자 자신의 모임 참여 신청 불가

- [Complexity: M] 모바일 반응형 UI 최종 검수 (Owner: Frontend)
  - 내 이벤트 페이지 모바일 레이아웃 최적화 (375px 이상)
  - 날짜/시간 입력 필드 모바일 UX 조정
  - 버튼 터치 영역 최소 44x44px 확보
  - iPad 태블릿 뷰포트(768px) 추가 검수
  - 모바일 탭 네비게이션 접근성 확인

- [Complexity: S] Skeleton + Loading 상태 일관성 (Owner: Frontend)
  - 각 라우트의 `loading.tsx` 구현 확인
  - Suspense 폴백 디자인

- [Complexity: M] 성능 최적화 (Owner: Frontend)
  - 이미지 최적화 (Next.js Image 컴포넌트)
  - 불필요한 재렌더링 제거
  - 번들 크기 확인: `npm run build`
  - Core Web Vitals 최적화

#### Week 4 Testing Tasks

- [ ] [Playwright MCP] 주최자 전체 여정 E2E 테스트 (Happy Path)
  1. 로그인 → 모임 생성 → 초대 링크 복사
  2. 공지 작성 (핀 고정 포함)
  3. 참여자 승인 처리
  4. 모임 마감
  - 전체 흐름이 오류 없이 완료되는지 확인

- [ ] [Playwright MCP] 참여자 전체 여정 E2E 테스트 (Happy Path)
  1. 비인증 상태에서 초대 링크 접근 → 모임 미리보기 확인
  2. 로그인 후 자동 참여 신청 처리 확인
  3. 주최자가 승인 후 공지 목록 조회 확인

- [ ] 엣지 케이스 E2E 테스트
  - 정원 초과된 모임 참여 신청 시 오류 메시지 표시 확인
  - 존재하지 않는 inviteCode 접근 시 Not Found 페이지 표시 확인

- [ ] 모바일 뷰포트 테스트 (Playwright MCP)
  - `browser_resize`로 375x812 (iPhone SE) 뷰포트 설정 후 스크린샷 확인
  - 버튼 터치 영역, 텍스트 가독성, 폼 입력 UI 검토

- [ ] 최종 린트 + 타입 체크
  - `npm run lint` 오류 0건 확인
  - `npx tsc --noEmit` 타입 오류 0건 확인

#### Week 4 완료 기준 (Definition of Done)

- [ ] 주최자가 모임 생성 → 초대 링크 공유 → 참여자 승인 전체 흐름 오류 없이 동작
- [ ] 공지 작성, 핀 고정, 목록 조회 정상 동작
- [ ] 비인증 사용자가 초대 링크 → 로그인 → 자동 참여 신청 흐름 정상 동작
- [ ] 내 이벤트 페이지 모바일 최적화 완료 (375px 이상)
- [ ] 모든 페이지 모바일 뷰포트(375px)에서 정상 렌더링
- [ ] 모바일 터치 버튼 접근성 확보 (최소 44x44px)
- [ ] `npm run lint` 오류 0건
- [ ] Playwright MCP E2E 주요 시나리오 모두 통과

---

## MVP 범위 (Phase 1 = MVP)

Phase 1이 곧 MVP입니다. 아래 기능이 모두 정상 동작할 때 MVP 런칭 기준을 충족합니다.

| 기능 ID   | 기능명         | MVP 포함 여부      |
| --------- | -------------- | ------------------ |
| F001      | 모임 생성      | 포함               |
| F002      | 모임 목록      | 포함               |
| F003      | 모임 홈        | 포함               |
| F004      | 초대 링크 입장 | 포함 (핵심)        |
| F005      | 참여 신청      | 포함 (핵심)        |
| F006      | 참여자 관리    | 포함               |
| F007      | 공지 작성      | 포함               |
| F008      | 공지 목록      | 포함               |
| F009      | 모임 마감      | 포함               |
| F010      | 기본 인증      | 포함 (기구현)      |
| F011~F016 | 카풀 + 정산    | MVP 이후 (Phase 2) |

**MVP 목표 런칭일**: 2026-03-22

---

## Phase 2: 카풀 + 정산

**기간**: 2026-03-23 - 2026-04-26 (4주 + 버퍼)
**목표**: 모임 당일 카풀 조율과 사후 정산 계산을 앱 내에서 처리
**사전 조건**: Phase 1 완료 + 실제 사용자 피드백 수집 후 시작

### 구현 기능

- **F011 카풀 제공 등록**: 드라이버가 출발지, 출발 시각, 탑승 가능 인원 등록
- **F012 카풀 신청**: 참여자가 원하는 카풀을 선택해 탑승 신청
- **F013 카풀 신청 관리**: 드라이버가 탑승 신청자 수락/거절 처리
- **F014 정산 항목 등록**: 주최자가 항목명, 총 금액, 분할 방식(1/n 균등 / 수동 입력) 등록
- **F015 개인별 정산 확인**: 참여자가 자신의 부담 금액과 입금 계좌 확인
- **F016 입금 확인 처리**: 주최자가 각 참여자 입금 완료 여부 수동 체크

### Phase 2 DB 테이블

**carpool_offers, carpool_requests, expense_items, expense_splits** 테이블 생성 및 RLS 정책 설정

### Phase 2 페이지

- `app/protected/events/[eventId]/carpool/page.tsx`
- `app/protected/events/[eventId]/expense/page.tsx`

---

## 미래 고려사항

Phase 2 이후 검토할 기능 및 개선사항:

- **실시간 알림**: Supabase Realtime을 활용한 참여 신청 알림, 공지 푸시 알림
- **모임 템플릿**: 자주 하는 모임 유형을 저장해 재사용 (정기 모임 지원)
- **반복 모임**: 매주/매월 정기 모임 자동 생성 기능
- **참여자 통계**: 주최자 대시보드 - 모임별 참여율, 정산 완료율 시각화
- **카카오페이/토스페이 연동**: 정산 자동화 강화 (현재는 계좌이체 안내만)
- **모임 검색**: 공개 모임 디렉토리 및 카테고리 필터 검색
- **커스텀 초대 코드**: 8자리 랜덤 코드 대신 주최자 지정 슬러그
- **파일 첨부**: 공지에 이미지/파일 첨부 (Supabase Storage 활용)
- **다국어 지원**: 영어 인터페이스 추가

---

## 알려진 리스크 및 완화 전략

| 리스크                         | 설명                                                                           | 심각도 | 완화 전략                                                 |
| ------------------------------ | ------------------------------------------------------------------------------ | ------ | --------------------------------------------------------- |
| **UI/UX 검증 후 DB 설계**      | Week 1 UI가 실제 데이터 연결 시 재설계될 수 있음                               | 중간   | 모킹 데이터로 충분히 검증 후 DB 테이블 설계 진행          |
| **RLS 정책 복잡성**            | 복잡한 JOIN 기반 RLS 정책이 성능 저하 또는 데이터 노출을 일으킬 수 있음        | 높음   | 각 테이블 RLS 설정 직후 즉시 단위 테스트 수행             |
| **초대 링크 URL 상태 보존**    | 비인증 사용자가 로그인 후 초대 링크로 복귀하는 흐름에서 redirect 파라미터 유실 | 높음   | Week 3에서 proxy.ts 수정 직후 Playwright MCP로 E2E 테스트 |
| **정산 금액 계산 엣지 케이스** | 균등 분할 시 나머지 금액 처리에서 계산 오류 발생 가능                          | 중간   | Phase 2에서 계산 로직을 순수 함수로 분리하여 TDD          |
| **invite_code 충돌**           | 8자리 랜덤 코드 생성 시 중복 발생 가능성                                       | 낮음   | `invite_code` 컬럼에 UNIQUE 제약 적용 + 재시도 로직       |
| **모바일 날짜/시간 입력 UX**   | 브라우저별 `datetime-local` input 렌더링 차이 (특히 iOS Safari)                | 중간   | Week 4에서 shadcn/ui Calendar 컴포넌트로 대체 검토        |

---

## 성공 지표 측정 방법

### Phase 1 (MVP) 성공 지표

| KPI                      | 목표             | 측정 방법                                                |
| ------------------------ | ---------------- | -------------------------------------------------------- |
| 생성된 모임 수           | 4주 후 10개 이상 | Supabase 대시보드 `events` 테이블 COUNT                  |
| 모임당 평균 참여자 수    | 8명 이상         | `event_members` 테이블에서 status = 'approved' 기준 평균 |
| 초대 링크 참여 신청 비율 | 80% 이상         | `/join/[inviteCode]`를 통한 event_members INSERT 비율    |
| 주최자 재사용률          | 60% 이상         | 동일 host_id로 2개 이상 모임 생성한 사용자 비율          |

---

## 개발 환경 참고

```bash
# 개발 서버 실행
npm run dev
# http://localhost:3000

# 린트 실행 (커밋 전 필수)
npm run lint

# 타입 체크
npx tsc --noEmit

# DB 타입 재생성 (DB 스키마 변경 후 실행)
npx supabase gen types typescript --project-id [PROJECT_ID] > types/database.ts

# 커밋 (한국어 conventional commit)
npm run commit
```

---

---

## 📊 진행 상황 추적

### Stage 1: UI/UX 프로토타입 구축

- [x] 의존성 설치 및 페이지 구조
- [x] 모킹 데이터 정의 (`lib/mock-data.ts`)
- [x] 폼 검증 스키마 정의 (`lib/schemas.ts`)
- [x] 모든 UI 페이지 구현 (모킹 데이터)
  - [x] 내 이벤트 페이지 (`app/protected/events/page.tsx`)
  - [x] 모임 생성 페이지 (`app/protected/events/new/page.tsx`)
  - [x] 모임 홈 페이지 (`app/protected/events/[eventId]/page.tsx`)
  - [x] 참여자 관리 페이지 (`app/protected/events/[eventId]/members/page.tsx`)
  - [x] 공지 목록 페이지 (`app/protected/events/[eventId]/announcements/page.tsx`)
  - [x] 공지 작성 페이지 (`app/protected/events/[eventId]/announcements/new/page.tsx`)
  - [x] 초대 링크 처리 페이지 (`app/join/[inviteCode]/page.tsx`)
- [x] 공유 컴포넌트 구현
  - [x] EventCard (`components/events/event-card.tsx`)
  - [x] MemberCard (`components/events/member-card.tsx`)
  - [x] AnnouncementCard (`components/events/announcement-card.tsx`)
  - [x] StatusBadge (`components/events/status-badge.tsx`)
  - [x] CopyInviteLinkButton (`components/events/copy-invite-link-button.tsx`)
  - [x] LoadingSkeleton (`components/events/loading-skeleton.tsx`)
- [x] E2E 테스트 계획 및 검증 (모킹 기반)
  - [x] 코드 검증: npm run lint (경고만 있고 오류 없음 ✅)
  - [x] 타입 검증: npx tsc --noEmit (타입 오류 없음 ✅)
  - [x] 모임 생성 폼: react-hook-form + zod 유효성 검사 구현 ✅
  - [x] 내 이벤트 페이지: 주최/참여 탭 구분 + mock 데이터 ✅
  - [x] 모임 홈: 기본 정보 표시 + 탭 네비게이션 UI ✅
  - [x] 참여자 관리: 상태별 탭 필터 구현 ✅
  - [x] 공지 기능: 핀 공지 상단 고정 + 폼 구현 ✅
  - [x] 초대 링크: 비인증 상태 미리보기 ✅
  - 📝 Playwright MCP E2E 테스트는 개발 서버 실행 후 별도 진행 권장

**상태**: ✅ **완료** | **기간**: 2026-02-23 ~ 2026-02-22 (조기 완료) | **완료율**: 100%

### Stage 2: 디자인 검증 및 보완

- [x] UX 흐름 분석 완료
- [x] 모바일 반응형 검증 완료 (375px)
- [x] 모바일 개선사항 적용 완료
- [ ] 태블릿/데스크톱 반응형 검증
- [ ] 디자인 일관성 검증
- [ ] 접근성 검토 완료
- [ ] 최종 개선사항 반영

**상태**: 🟡 **진행 중** (Task 2 준비 중) | **기간**: 2026-03-02 ~ 2026-03-05
**계획 문서**: `docs/STAGE2_PLAN.md` (8개 Task로 분해)
**Task 1 (모바일 반응형 375px)**: ✅ 100% 완료 (2026-02-22)

- ✅ 검증 리포트 작성 (`docs/STAGE2_TASK1_VALIDATION.md`)
- ✅ P1 개선사항 적용: EventCard 버튼 크기 (sm → lg)
- ✅ P2 개선사항 적용 완료 (3건):
  - page component: space-y-4 md:space-y-6 lg:space-y-8 (반응형 여백)
  - ui/input.tsx: h-10 py-2 (모바일), md:h-9 md:py-1 (데스크톱)
  - member-card.tsx: 3개 버튼 크기 증대 (sm → lg)
- ✅ 코드 검증: npm run lint (0 errors, 29 warnings - pre-existing)
  **Task 2 (태블릿/데스크톱 검증)**: ⏳ 준비 중 (768px, 1024px)

### Stage 3: 공통 모듈/컴포넌트 + DB 스키마

- [ ] DB 스키마 설계 및 생성
- [ ] RLS 정책 설정
- [ ] TypeScript 타입 생성
- [ ] Server 유틸리티 작성
- [ ] 상수 및 타입 파일 정리

**상태**: ⬜ **미시작** | **기간**: 2026-03-06 ~ 2026-03-12

### Stage 4: 핵심 기능 API 연동 (Phase 1 - MVP)

- [ ] Server Action 구현
- [ ] Server Component 구현
- [ ] 초대 링크 처리
- [ ] Client Component (상호작용)
- [ ] E2E 테스트 (DB 연결 후)

**상태**: ⬜ **미시작** | **기간**: 2026-03-13 ~ 2026-03-26 | **목표**: 🎯 MVP 런칭

### Stage 5: 추가 기능 개발 (카풀/정산)

- [ ] 공지 기능 완료
- [ ] 카풀 기능 완료
- [ ] 정산 기능 완료
- [ ] 모든 기능 테스트

**상태**: ⬜ 미시작 | **기간**: 2026-03-27 ~ 2026-04-16 | **목표**: Phase 2 완료

### Stage 6: 최적화 및 배포

- [ ] 성능 최적화
- [ ] 에러 처리 및 엣지 케이스
- [ ] 테스트 및 문서화
- [ ] 배포 준비

**상태**: ⬜ 미시작 | **기간**: 2026-04-17 ~ 2026-04-30

---

## ⚠️ 주의사항

### 단계별 의존성 (반드시 순서대로!)

```
Stage 1 (UI/UX) → Stage 2 (검증) → Stage 3 (DB) → Stage 4 (API) → Stage 5 (추가기능) → Stage 6 (배포)
   ↓                                    ↓
필수 완료                            필수 완료
```

- **Stage 1과 2는 필수**: UI/UX 없이 DB를 설계하면 재작업 발생
- **Stage 3은 필수**: Stage 1,2 완료 후 DB 설계해야 정확함
- **Stage 4가 MVP**: 여기까지만 해도 최소 기능 완성
- **Stage 5는 선택적**: 시간 부족 시 베타 런칭 후 진행 가능
- **Stage 6은 필수**: 프로덕션 배포 전 필수

### 주요 리스크 및 완화 방안

| 리스크                  | 심각도 | 발생 시점 | 완화 방안                                     |
| ----------------------- | ------ | --------- | --------------------------------------------- |
| Stage 2 건너뛰기        | 높음   | Stage 4   | UI/UX 문제 발견 시 DB 재설계 필요 → 시간 낭비 |
| UI/UX 검증 부족         | 높음   | Stage 3   | Stage 1,2를 충분히 수행하여 조기 발견         |
| RLS 정책 버그           | 높음   | Stage 4   | Stage 3 완료 후 즉시 RLS 검증 (Supabase MCP)  |
| 초대 링크 URL 상태 보존 | 높음   | Stage 4   | proxy.ts 수정 후 E2E 테스트 (Playwright) 필수 |
| 정산 금액 계산 오류     | 중간   | Stage 5   | 계산 로직 순수 함수로 분리 + TDD              |
| 모바일 날짜/시간 입력   | 중간   | Stage 1   | 브라우저별 테스트 (iOS, Android)              |
| 성능 저하               | 낮음   | Stage 6   | 조기에 성능 모니터링 시작                     |

### 일정 조정 기준

- 각 stage별 **여유 시간 20% 추가** (버퍼)
- 실제 일정 = 계획 일정 × 1.2
- **주간 검토 필수**: 매주 금요일 진행 상황 검토

### MVP vs Phase 2

| 구분          | 포함 기능                   | 런칭 목표                |
| ------------- | --------------------------- | ------------------------ |
| **MVP**       | 모임 생성, 초대, 참여, 공지 | **2026-03-26** (Stage 4) |
| **Phase 2**   | MVP + 카풀 + 정산           | **2026-04-16** (Stage 5) |
| **본격 런칭** | Phase 2 + 성능/최적화       | **2026-04-30** (Stage 6) |

---

## 📌 체크포인트

**Stage 1 완료 검사 (2026-02-22) - ✅ UI/UX 프로토타입 완성 (조기 완료)**

- [x] 모든 페이지가 모킹 데이터로 정상 렌더링됨 ✅
- [x] 폼 유효성 검증 및 에러 메시지 정상 작동 ✅
- [x] 모바일 반응형 (375px, 768px) 반영 완료 ✅
- [x] 내 이벤트 페이지 모바일 UX 최적화 완료 (탭 전환, 카드 레이아웃) ✅
- [x] 모바일 터치 친화적 버튼 크기 확인 (최소 44x44px) ✅
- [x] E2E 테스트 코드 검증 완료 (lint, tsc, 구현 확인) ✅
- [x] `npm run lint` 경고만 있고 오류 0건 ✅
- **Stage 1 완료 일자**: 2026-02-22 (계획일 2026-03-01 대비 7일 조기 완료)

**Stage 2 완료 검사 (2026-03-05) - UX 검증 및 보완 완료**

- [ ] 모든 페이지의 레이아웃과 가독성 최종 확인
- [ ] UX 개선점 반영 완료
- [ ] 팀 검토 및 승인 완료
- [ ] 접근성 검토 완료 (색상 대비, 터치 영역)
- [ ] 최종 UI/UX 확정

**Stage 3 완료 검사 (2026-03-12) - DB 스키마 완성**

- [ ] Supabase 테이블 생성 완료 (events, event_members, announcements)
- [ ] RLS 정책 설정 및 검증 완료
- [ ] `npx tsc --noEmit` 오류 0건
- [ ] types/database.ts 자동 생성 확인
- [ ] Server 유틸리티 함수 구현 완료

**Stage 4 완료 검사 (2026-03-26) - MVP 런칭 ✨**

- [ ] 주최자 전체 여정 E2E 테스트 통과
  - 모임 생성 → 초대 링크 → 참여자 승인
- [ ] 참여자 전체 여정 E2E 테스트 통과
  - 초대 링크 → 로그인 → 참여 신청 → 자동 승인
- [ ] 모바일 테스트 완료 (375px 뷰포트)
  - 내 이벤트 페이지 모바일 레이아웃 검증 완료
  - 모바일 기기(iOS, Android)에서 실제 테스트 완료
- [ ] 성능 테스트: Lighthouse 70 이상
- [ ] 실제 사용자 피드백 수집 가능
- **MVP 배포 완료 (베타 테스트 시작)**

**Stage 5 완료 검사 (2026-04-16) - Phase 2 완료**

- [ ] 공지 기능 E2E 테스트 통과
- [ ] 카풀 기능 E2E 테스트 통과
- [ ] 정산 기능 계산 로직 검증 완료
  - 균등 분할 정확성 확인
  - 수동 분할 합계 검증
- [ ] 모든 기능 모바일 반응형 확인

**Stage 6 완료 검사 (2026-04-30) - 본격 런칭 🚀**

- [ ] Lighthouse 스코어 80 이상
- [ ] 성능 최적화 완료
  - 번들 크기: 150KB 이하 (gzipped)
  - 페이지 로드: 2초 이내
- [ ] 모든 엣지 케이스 처리 완료
  - 마감된 모임 참여 불가
  - 정원 초과 시 자동 거절
  - 존재하지 않는 초대코드 처리
- [ ] 프로덕션 배포 완료
- [ ] 에러 로깅 (Sentry) 설정 완료
- [ ] 모니터링 대시보드 설정 완료

---

---

## 📚 참고 자료

### 주요 문서

- **PRD**: `docs/PRD.md` - 제품 요구사항 명세
- **프로젝트 규칙**: `shrimp-rules.md` - AI Agent 개발 가이드
- **CLAUDE.md**: 프로젝트 개발 가이드

### 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 린트 검사
npm run lint

# 타입 체크
npx tsc --noEmit

# DB 타입 재생성
npx supabase gen types typescript > types/database.ts

# 커밋 (한국어 conventional)
npm run commit
```

### 관련 기술 스택

- **Frontend**: Next.js 16+, React 19, TypeScript 5, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL), Server Actions
- **Testing**: Playwright MCP (E2E), Supabase MCP (DB 검증)
- **Deployment**: Vercel

---

_문서 작성일: 2026-02-22_
_마지막 업데이트: 2026-02-22 (✅ Stage 2 계획 수립 완료)_
_구조: 6단계 개발 프로세스 (UI/UX 우선)_
_핵심 원칙: 모킹 데이터로 UI/UX 검증 → 디자인 확정 → DB 설계 → API 연동_

**🎯 현재 진행 상황**

- ✅ **Stage 1**: 완료 (2026-02-22) - 모킹 데이터 기반 UI/UX 프로토타입 ✨
  - 7개 페이지 + 6개 컴포넌트 구현 완료
  - E2E 테스트 검증 완료 (lint: 0 errors, tsc: type-safe)

- 🟡 **Stage 2**: 진행 중 (2026-03-02 ~ 2026-03-05) - 디자인 검증 및 보완 🚀
  - 상세 계획: `docs/STAGE2_PLAN.md` (8개 Task, 완료 기준 정의)
  - **Task 1 (모바일 375px)**: ✅ 100% 완료 - 검증 리포트, P1+P2 개선사항 적용
  - **Task 2~8**: 태블릿/데스크톱, 색상, 타이포그래피, 아이콘, 다크모드, 최종 개선 예정
  - 산출물: `docs/STAGE2_TASK1_VALIDATION.md`, 코드 개선 반영

- ⬜ **Stage 3**: 준비 중 (2026-03-06 ~ 2026-03-12) - DB 스키마 설계
  - 필수 조건: Stage 2 완료 후 시작
- ⬜ **Stage 4**: 예정 (2026-03-13 ~ 2026-03-26) - API 연동 및 MVP 런칭 🎯

_다음 액션: Stage 2 Task 2 - 태블릿/데스크톱 반응형 검증 (768px, 1024px)_
_소유자: 개발팀_
_최종 업데이트: 2026-02-22 (Stage 2 Task 1 완료)_
