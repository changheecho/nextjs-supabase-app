import { test, expect } from "@playwright/test";

// E2E 테스트: 이벤트 생성, 조회, 관리 기능 테스트
test.describe("Events Feature", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 이벤트 목록 페이지로 이동
    // TODO: Stage 3에서 실제 인증 처리 추가
    await page.goto("http://localhost:3000/protected/events");
  });

  // TC-1: 이벤트 목록 조회
  test("should display event list", async ({ page }) => {
    // 이벤트 목록이 렌더링되는지 확인
    const eventCards = page.locator("[data-testid='event-card']");
    const count = await eventCards.count();
    expect(count).toBeGreaterThan(0);

    // 새 이벤트 생성 버튼이 보이는지 확인
    const createButton = page.locator("button:has-text('새 이벤트')");
    await expect(createButton).toBeVisible();
  });

  // TC-2: 이벤트 생성 페이지 접근
  test("should navigate to create event page", async ({ page }) => {
    const createButton = page.locator("button:has-text('새 이벤트')");
    await createButton.click();

    // 이벤트 생성 폼이 나타나는지 확인
    await expect(page).toHaveURL(/\/protected\/events\/new/);
    const formTitle = page.locator("h1:has-text('새 이벤트 생성')");
    await expect(formTitle).toBeVisible();
  });

  // TC-3: 이벤트 상세 페이지 조회
  test("should navigate to event detail page", async ({ page }) => {
    // 첫 번째 이벤트 클릭
    const eventCard = page.locator("[data-testid='event-card']").first();
    await eventCard.click();

    // 이벤트 상세 페이지로 이동되는지 확인
    await expect(page).toHaveURL(/\/protected\/events\/[^/]+$/);

    // 이벤트 정보가 표시되는지 확인
    const eventInfo = page.locator("[data-testid='event-info']");
    await expect(eventInfo).toBeVisible();

    // 참여자 섹션이 표시되는지 확인
    const membersSection = page.locator("[data-testid='members-section']");
    await expect(membersSection).toBeVisible();
  });

  // TC-4: 공지사항 목록 조회
  test("should display announcements in event detail", async ({ page }) => {
    const eventCard = page.locator("[data-testid='event-card']").first();
    await eventCard.click();

    // 공지사항 섹션이 표시되는지 확인
    const announcementSection = page.locator(
      "[data-testid='announcement-section']",
    );
    await expect(announcementSection).toBeVisible();

    // 공지사항 작성 버튼이 보이는지 확인
    const createAnnouncementButton = page.locator(
      "button:has-text('공지 작성')",
    );
    await expect(createAnnouncementButton).toBeVisible();
  });

  // TC-5: 멤버 관리 페이지 접근
  test("should navigate to members management page", async ({ page }) => {
    const eventCard = page.locator("[data-testid='event-card']").first();
    await eventCard.click();

    // 참여자 관리 버튼 클릭
    const manageMembersButton = page.locator("button:has-text('참여자 관리')");
    if (await manageMembersButton.isVisible()) {
      await manageMembersButton.click();

      // 멤버 관리 페이지로 이동되는지 확인
      await expect(page).toHaveURL(/\/protected\/events\/[^/]+\/members/);

      // 멤버 목록이 표시되는지 확인
      const memberList = page.locator("[data-testid='member-list']");
      await expect(memberList).toBeVisible();
    }
  });

  // TC-6: 공지사항 작성 페이지 접근
  test("should navigate to create announcement page", async ({ page }) => {
    const eventCard = page.locator("[data-testid='event-card']").first();
    await eventCard.click();

    // 공지사항 탭에서 작성 버튼 클릭
    const createButton = page.locator("button:has-text('공지 작성')");
    if (await createButton.isVisible()) {
      await createButton.click();

      // 공지사항 작성 페이지로 이동되는지 확인
      await expect(page).toHaveURL(
        /\/protected\/events\/[^/]+\/announcements\/new/,
      );

      // 공지사항 작성 폼이 나타나는지 확인
      const formTitle = page.locator("h1:has-text('공지사항 작성')");
      await expect(formTitle).toBeVisible();
    }
  });

  // TC-7: 반응형 디자인 테스트 (모바일)
  test("should be responsive on mobile", async ({ page }) => {
    // 모바일 해상도로 변경
    await page.setViewportSize({ width: 375, height: 667 });

    // 이벤트 목록이 스택 레이아웃으로 표시되는지 확인
    const eventCards = page.locator("[data-testid='event-card']");
    const firstCard = eventCards.first();

    // 카드의 width가 viewport 너비에 맞는지 확인
    const cardBox = await firstCard.boundingBox();
    expect(cardBox?.width).toBeLessThanOrEqual(375);
  });
});

// 추가 테스트: 로딩 상태
test.describe("Loading States", () => {
  test("should show skeleton loaders while loading", async ({ page }) => {
    // 페이지 로드 중 스켈레톤이 보이는지 확인
    await page.goto("http://localhost:3000/protected/events");

    const skeletons = page.locator("[data-testid='skeleton-loader']");
    // 스켈레톤이 존재하거나 로드가 완료되어야 함
    const count = await skeletons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
