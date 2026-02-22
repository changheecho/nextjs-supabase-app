# 프로젝트 개발 규칙 (AI Agent용)

## 프로젝트 개요

**프로젝트명:** Next.js + Supabase 풀스택 애플리케이션
**기술 스택:** Next.js 16+, React 19, TypeScript 5, Supabase (PostgreSQL), Tailwind CSS, shadcn/ui
**주요 기능:** 사용자 인증, 프로필 관리, 실시간 데이터 동기화

---

## 1. 코드 표준

### 1.1 파일 명명 규칙

| 항목        | 규칙             | 예시                             |
| ----------- | ---------------- | -------------------------------- |
| 파일/폴더명 | kebab-case       | `user-profile.tsx`, `auth-form/` |
| 컴포넌트명  | PascalCase       | `export function UserProfile()`  |
| 상수명      | UPPER_SNAKE_CASE | `const MAX_RETRIES = 3;`         |
| 변수/함수명 | camelCase        | `const isLoggedIn = true;`       |

### 1.2 Import 경로 규칙

**반드시 절대 경로(@/) 사용 - 상대 경로 금지**

```typescript
// ✅ 옳음
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ❌ 금지
import { Button } from "../../../components/ui/button";
import Button from "./Button";
```

**Import 순서:**

1. 외부 라이브러리 (react, next, etc.)
2. 절대 경로 (@/)
3. CSS/스타일

### 1.3 코드 포맷팅

- **들여쓰기:** 2칸 (탭 사용 금지)
- **줄 길이:** 80자 기준 (Prettier 설정 참고)
- **세미콜론:** 필수
- **따옴표:** 큰따옴표 (") 사용

### 1.4 언어 규칙

| 항목        | 규칙                          |
| ----------- | ----------------------------- |
| 코드 주석   | 한국어                        |
| 변수/함수명 | 영어                          |
| 커밋 메시지 | 한국어 (Conventional Commits) |
| 문서화      | 한국어                        |

### 1.5 TypeScript 규칙

**반드시 다음 원칙 준수:**

- 모든 함수 매개변수에 타입 지정
- 모든 컴포넌트 props에 인터페이스 정의
- `any` 타입 사용 금지 (unknown 대체)
- 함수 반환 타입 명시
- Supabase 자동 생성 타입 사용 필수 (types/database.ts)

```typescript
// ✅ 올바른 예
interface UserProfileProps {
  userId: string;
  isLoading?: boolean;
}

export function UserProfile({ userId, isLoading = false }: UserProfileProps) {
  // ...
}

// ❌ 금지
export function UserProfile(props) {
  // ...
}
```

---

## 2. 프로젝트 구조 및 파일 조직

### 2.1 디렉토리 구조

```
app/                          # Next.js App Router (메인 소스)
├── layout.tsx               # 루트 레이아웃 (ThemeProvider)
├── page.tsx                 # 랜딩 페이지 (/)
├── (auth)/                  # 인증 관련 경로 그룹
│   ├── login/
│   ├── sign-up/
│   ├── forgot-password/
│   └── update-password/
├── protected/               # 인증 필수 페이지
│   └── page.tsx
└── api/                     # API 라우트

components/                   # 재사용 가능 컴포넌트
├── ui/                      # shadcn/ui 기본 컴포넌트
├── layout/                  # 레이아웃 컴포넌트
├── navigation/              # 네비게이션 컴포넌트
└── [feature].tsx            # 기능별 컴포넌트

lib/                         # 유틸리티 및 설정
├── supabase/
│   ├── client.ts           # 브라우저 클라이언트
│   └── server.ts           # 서버 클라이언트
├── utils.ts                # cn() 등 헬퍼 함수
└── [category]/

types/
├── database.ts             # 자동 생성 Supabase 타입
└── [custom-types].ts       # 커스텀 타입

docs/
├── guides/                 # 개발 가이드
└── [documentation].md

public/                     # 정적 자산
```

### 2.2 파일 배치 규칙

| 파일 타입 | 위치                                  | 규칙                             |
| --------- | ------------------------------------- | -------------------------------- |
| 페이지    | `app/`                                | 라우트 구조에 따라 배치          |
| 컴포넌트  | `components/`                         | 기능별 분류 (ui/, layout/, etc.) |
| 서버 함수 | `lib/` 또는 `app/[route]`             | 관련 라우트에 배치               |
| 타입      | `types/`                              | 중앙화 관리                      |
| 유틸리티  | `lib/utils.ts` 또는 `lib/[category]/` | 기능별 분류                      |

---

## 3. React 컴포넌트 패턴

### 3.1 기본 원칙

- **기본값:** Server Components (async 가능, 데이터 fetching 가능)
- **예외:** 상호작용 필요 시에만 `'use client'` 사용
- **크기:** 300줄 이상 → 파일 분할 필수

### 3.2 Server Components (권장)

```typescript
// ✅ 서버 컴포넌트: 데이터 fetching 가능
import { createClient } from "@/lib/supabase/server";

export default async function UserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <div>{user?.email}</div>;
}
```

### 3.3 Client Components (필요 시만)

```typescript
// ✅ 클라이언트 컴포넌트: 이벤트 핸들러, 상태 관리 등
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function UpdateForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    // ...
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3.4 Props 규칙

```typescript
// ✅ 올바른 패턴
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export function Card({ title, description, onClick }: CardProps) {
  return <div onClick={onClick}>{title}</div>;
}

// ❌ 금지: 직렬화 불가능한 데이터 (함수 제외)
// Date, Map, Set 등을 직접 props로 전달 금지
```

### 3.5 컴포넌트 크기 제한

- **300줄 이상:** 파일 분할 필수
- **분할 방법:** 기능별로 별도 컴포넌트로 추출

```typescript
// ❌ 금지: 300줄 이상 단일 파일
export default function LargeComponent() {
  // 400줄의 코드...
}

// ✅ 올바름: 기능별 분할
export function ComponentHeader() { /* ... */ }
export function ComponentContent() { /* ... */ }
export default function LargeComponent() {
  return <>
    <ComponentHeader />
    <ComponentContent />
  </>;
}
```

### 3.6 Suspense와 Streaming 패턴

**목적:** 페이지 로딩 중 스켈레톤 UI 표시, 사용자 경험 향상

```typescript
// ✅ 올바름: Suspense와 별도 서버 컴포넌트
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

// 데이터를 가져오는 서버 컴포넌트
async function UserProfile() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").single();
  return <div>{data?.name}</div>;
}

// 로딩 중 보여줄 스켈레톤
function ProfileSkeleton() {
  return <div className="h-32 animate-pulse rounded-lg bg-muted" />;
}

// 페이지에서 Suspense로 감싸기
export default function Page() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile />
    </Suspense>
  );
}
```

**규칙:**

- 오래 걸리는 데이터 페칭은 Suspense로 감싸기
- 스켈레톤은 실제 콘텐츠와 유사한 높이/너비 사용
- `animate-pulse` 클래스로 로딩 상태 표시
- 데이터 페칭과 렌더링을 별도 컴포넌트로 분리

---

## 4. Supabase 통합 규칙

### 4.1 Supabase 클라이언트 패턴

**절대 금지:** 전역 Supabase 인스턴스 생성

```typescript
// ❌ 금지
const supabase = createClient();
export { supabase };

// ✅ 서버 컴포넌트: 매번 새로 생성
async function ServerComponent() {
  const supabase = await createClient();
  // ...
}

// ✅ 클라이언트 컴포넌트: createClient() 호출
("use client");
function ClientComponent() {
  const supabase = createClient();
  // ...
}
```

### 4.2 데이터 타입 규칙

**모든 데이터베이스 쿼리는 타입 안전성 필수:**

```typescript
// ✅ 올바름: 타입 안전 쿼리
import type { Tables } from "@/types/database";

export async function getProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // profile은 Tables<'profiles'> | null
  return profile;
}

// ❌ 금지: 타입 없는 쿼리
const { data } = await supabase.from("profiles").select("*");
// data는 any 타입
```

### 4.3 types/database.ts 관리

**규칙:**

1. Supabase 대시보드에서 스키마 변경 후 실행:

   ```bash
   npx supabase gen types typescript > types/database.ts
   ```

2. 편의 타입 정의 (파일 하단):

   ```typescript
   // 자동 생성 타입
   export type Profile = Tables<"profiles">;
   export type Post = Tables<"posts">;
   ```

3. 수정 후 모든 관련 컴포넌트 확인:
   - 쿼리 타입 재확인
   - 컴포넌트 props 타입 업데이트

### 4.4 Server Actions (뮤테이션)

```typescript
// ✅ 서버 액션: 데이터 변경
"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function updateProfile(
  userId: string,
  updates: Partial<Tables<"profiles">>,
) {
  const supabase = await createClient();

  return await supabase.from("profiles").update(updates).eq("id", userId);
}
```

### 4.5 OAuth/소셜 로그인

**지원하는 제공자:** Google (확장 가능)

```typescript
// ✅ OAuth 버튼 컴포넌트 (클라이언트)
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SocialProvider = "google";

export function SocialLoginButton({
  provider,
  label,
}: {
  provider: SocialProvider;
  label: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // /auth/callback으로 리다이렉트되어 exchangeCodeForSession 처리
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다"
      );
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <button onClick={handleSocialLogin} disabled={isLoading}>
        {label}
      </button>
    </div>
  );
}
```

**규칙:**

- OAuth 콜백은 항상 `/auth/callback` 라우트로 설정
- 클라이언트 컴포넌트에서만 `signInWithOAuth` 사용
- 로딩 상태와 에러 상태 필수
- 상태 업데이트 후 리다이렉트는 자동으로 처리

---

## 5. 파일 간 상호작용 규칙

### 5.1 타입 파일 수정 시

**순서:**

1. Supabase 대시보드에서 테이블/컬럼 변경
2. `npx supabase gen types typescript > types/database.ts` 실행
3. types/database.ts 파일 하단의 편의 타입 확인/추가
4. 관련 쿼리 파일 검토
5. 관련 컴포넌트 props 타입 업데이트

**영향받는 파일:**

- 해당 테이블을 사용하는 모든 쿼리 함수
- 해당 데이터를 props로 받는 모든 컴포넌트
- 해당 데이터를 상태로 관리하는 모든 컴포넌트

### 5.2 인증 관련 파일

**파일 그룹:** `app/(auth)/` route group

**포함 페이지:**

- `login/` - 로그인
- `sign-up/` - 회원가입
- `forgot-password/` - 비밀번호 재설정
- `update-password/` - 비밀번호 변경

**규칙:**

- 모든 인증 관련 페이지는 `(auth)` 그룹에 배치
- 인증 폼은 `components/auth-form.tsx` 등으로 분리
- 에러 메시지는 일관된 스타일 사용

### 5.3 보호된 페이지 관리

**파일:** `app/protected/page.tsx`

**규칙:**

- 인증이 필요한 페이지는 `protected/` 디렉토리에 배치
- 페이지에 접근 제어 로직 구현
- 미인증 사용자 시 로그인 페이지로 리다이렉트

```typescript
// ✅ 접근 제어 구현
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <div>보호된 콘텐츠</div>;
}
```

### 5.4 환경 변수 관리

**필수 환경 변수 (.env.local):**

```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

**규칙:**

- `NEXT_PUBLIC_` 접두사: 브라우저에 노출됨 (publishable key 안전)
- 시크릿 키는 환경 변수에 절대 저장 금지
- 서버 사이드에서만 필요한 정보는 비공개 변수 사용

---

## 6. 스타일링 규칙

### 6.1 Tailwind CSS 사용

**원칙:**

- 모든 스타일링은 Tailwind CSS 사용
- 커스텀 CSS는 필요할 때만 (일관성 위해 최소화)
- shadcn/ui 컴포넌트 활용

```typescript
// ✅ 올바름
<div className="flex items-center gap-4 p-4">
  <Button variant="outline">클릭</Button>
</div>

// ❌ 금지
<div style={{ display: 'flex', gap: '16px' }}>
  <button>클릭</button>
</div>
```

### 6.2 cn() 유틸리티 사용

조건부 클래스 병합:

```typescript
import { cn } from "@/lib/utils";

interface ButtonProps {
  isActive?: boolean;
}

export function Button({ isActive }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded",
        isActive && "bg-blue-500 text-white"
      )}
    >
      버튼
    </button>
  );
}
```

### 6.3 테마 지원

**테마 시스템:** next-themes 사용

```typescript
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout() {
  return (
    <ThemeProvider attribute="class">
      {/* 앱 콘텐츠 */}
    </ThemeProvider>
  );
}
```

---

## 7. 금지된 행동 (DO NOT)

### 7.1 Import 관련

| 금지 행동                    | 이유              | 올바른 방법       |
| ---------------------------- | ----------------- | ----------------- |
| 상대 경로 import             | 파일 이동 시 깨짐 | @/ 절대 경로 사용 |
| `index.tsx` → `index` import | 명시성 부족       | 전체 파일명 작성  |

```typescript
// ❌ 금지
import { Button } from "../../../components/ui";
import Button from "./Button";

// ✅ 올바름
import { Button } from "@/components/ui/button";
```

### 7.2 Supabase 관련

| 금지 행동                             | 이유                  |
| ------------------------------------- | --------------------- |
| 전역 클라이언트 생성                  | 세션 상태 관리 어려움 |
| 클라이언트 컴포넌트에서 직접 fetching | 보안 위험             |
| 타입 없는 쿼리                        | 런타임 오류 위험      |
| `any` 타입 사용                       | 타입 안전성 상실      |

```typescript
// ❌ 금지
// lib/supabase.ts
export const supabase = createClient();

// ❌ 금지
("use client");
export function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    supabase.from("profiles").select("*").then(setData);
  }, []);
}
```

### 7.3 컴포넌트 관련

| 금지 행동                | 이유                      |
| ------------------------ | ------------------------- |
| 300줄 이상 단일 파일     | 유지보수 어려움           |
| 직렬화 불가능한 props    | Server → Client 전달 불가 |
| 과도한 `use client` 사용 | 번들 크기 증가            |

```typescript
// ❌ 금지: 직렬화 불가능한 데이터 props
<MyComponent date={new Date()} map={new Map()} />

// ✅ 올바름: 직렬화 가능한 데이터
<MyComponent date={date.toISOString()} items={Array.from(map)} />
```

### 7.4 파일 관리

| 금지 행동             | 이유               |
| --------------------- | ------------------ |
| 상대 경로로 파일 이동 | 깨진 import 발생   |
| 필요 없는 파일 생성   | 코드 복잡도 증가   |
| 주석으로 코드 "제거"  | 불필요한 코드 존재 |

```typescript
// ❌ 금지
// export const oldFunction = () => {};

// ✅ 올바름: 정말 필요 없으면 삭제
// 코드 삭제 (Git 히스토리 보존)
```

---

## 8. 의사 결정 기준

### 8.1 Server vs Client Component 선택

```
시작: 모든 컴포넌트를 Server Component로 생각

→ 상호작용 필요? (이벤트, 상태) → YES → 'use client'
↓ NO
→ 데이터 fetching? → YES → Server Component 유지
↓ NO
→ 브라우저 API 필요? (localStorage, geolocation) → YES → 'use client'
↓ NO
→ Server Component 유지
```

### 8.2 파일 분할 결정

```
컴포넌트 크기 확인

→ 300줄 이상? → YES → 기능별로 분할
↓ NO
→ 여러 기능? → YES → 기능별로 분할
↓ NO
→ 단일 파일 유지
```

### 8.3 타입 관리

```
데이터 사용 패턴 확인

→ Supabase 테이블? → YES → types/database.ts 타입 사용
↓ NO
→ API 응답? → YES → types/[domain].ts에서 정의
↓ NO
→ 컴포넌트 props? → YES → interface Props 정의
```

---

## 9. 개발 워크플로우

### 9.1 새 페이지 추가

1. `app/[route]/page.tsx` 파일 생성
2. Server Component로 작성 (데이터 fetching)
3. 필요 시 Client Components를 별도 파일로 분리
4. 타입 정의 (props, 반환값)

### 9.2 새 컴포넌트 추가

1. `components/[feature]/[component-name].tsx` 생성
2. 인터페이스 Props 정의
3. 기본은 Server Component로 작성
4. 상호작용 필요 시에만 `'use client'` 추가

### 9.3 스키마 변경 프로세스

1. Supabase 대시보드에서 테이블/컬럼 변경
2. CLI 실행: `npx supabase gen types typescript > types/database.ts`
3. types/database.ts 편의 타입 추가
4. 관련 쿼리/컴포넌트 업데이트
5. 테스트 및 배포

### 9.4 커밋 컨벤션

```bash
# 형식: [type]: [한국어 설명]

feat: 새 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
docs: 문서 수정
style: 코드 스타일 수정 (기능 변화 없음)
test: 테스트 추가/수정
```

**명령어:**

```bash
npm run commit  # 대화형 커밋 생성
```

---

## 10. 미들웨어와 인증 흐름

### 10.1 Proxy 패턴 (proxy.ts)

**파일:** `lib/supabase/proxy.ts` - 인증 상태를 전역에서 관리

```typescript
// ✅ proxy.ts의 updateSession 함수 역할
// - 모든 요청에서 사용자 세션 확인
// - 미인증 사용자 자동으로 /auth/login으로 리다이렉트
// - 쿠키 갱신 및 세션 유지

export async function updateSession(request: NextRequest) {
  // 1. Supabase 서버 클라이언트 생성
  // 2. supabase.auth.getClaims() 호출로 세션 확인
  // 3. 미인증 사용자 필터링
  // 4. 응답에 업데이트된 쿠키 설정
}
```

**적용 방식:**

1. `middleware.ts` 또는 `proxy.ts` 파일에서 정의
2. 모든 API 라우트와 페이지에 적용
3. 보호된 경로 자동 리다이렉트

### 10.2 인증 흐름

```
사용자 요청
    ↓
proxy.ts (updateSession)
    ↓
getClaims() → 세션 확인
    ↓
인증됨? YES → 계속진행
         NO → /auth/login으로 리다이렉트
```

**로그인 흐름:**

1. 사용자가 로그인/회원가입 제출
2. Supabase 인증 성공
3. 쿠키에 세션 저장
4. proxy.ts에서 자동 감지
5. 다음 요청부터 인증된 상태 유지

**로그아웃 흐름:**

1. `supabase.auth.signOut()` 호출
2. 세션 쿠키 삭제
3. 다음 요청에서 미인증 상태 감지
4. /auth/login으로 리다이렉트

### 10.3 JWT Claims 활용

```typescript
// ✅ 서버 컴포넌트에서 사용자 정보 추출
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub; // 사용자 ID
  const email = claimsData?.claims?.email; // 사용자 이메일
}
```

---

## 11. Linting 및 코드 품질

### 11.1 ESLint와 Prettier

**자동 실행:**

- Git hook (pre-commit)으로 자동 포맷팅
- Husky와 lint-staged 설정

**수동 실행:**

```bash
npm run lint          # 코드 문제 확인
npm run lint:fix      # 자동 수정
npm run format        # Prettier 포맷팅
npm run format:check  # 포맷팅 확인 (수정 안 함)
```

### 11.2 코드 포맷팅 규칙

| 항목          | 설정         |
| ------------- | ------------ |
| 들여쓰기      | 2칸          |
| 줄 길이       | 80자 기준    |
| 세미콜론      | 필수         |
| 따옴표        | 큰따옴표 (") |
| 트레일링 콤마 | es5          |

**Prettier 설정:** `.prettierrc` 파일 참고

### 11.3 TypeScript 검사

```bash
npm run type-check    # TypeScript 컴파일 오류 확인
```

**규칙:**

- 모든 함수에 타입 지정 필수
- `any` 타입 금지 (ESLint에서 감지)
- strict mode 활성화

### 11.4 보안 검사

```bash
npm run security      # 보안 취약점 확인
```

**확인 항목:**

- 의존성 취약점
- 환경 변수 노출
- 잠재적 보안 문제

---

## 12. 주요 파일 요약

| 파일                       | 용도                 | 수정 시 영향 범위          |
| -------------------------- | -------------------- | -------------------------- |
| `types/database.ts`        | Supabase 타입        | 모든 쿼리, 컴포넌트        |
| `lib/supabase/client.ts`   | 클라이언트 생성 함수 | 모든 클라이언트 컴포넌트   |
| `lib/supabase/server.ts`   | 서버 생성 함수       | 모든 서버 컴포넌트         |
| `lib/supabase/proxy.ts`    | 인증 상태 관리       | 전역 인증 흐름             |
| `app/layout.tsx`           | 루트 레이아웃        | 전체 앱 (테마, 메타데이터) |
| `app/(auth)/`              | 인증 페이지          | 로그인/회원가입 플로우     |
| `app/protected/`           | 보호된 페이지        | 인증 필수 콘텐츠           |
| `components/ui/*`          | UI 기본 컴포넌트     | 모든 컴포넌트              |
| `components/[feature].tsx` | 기능별 컴포넌트      | 해당 기능 영역             |

---

## 13. 파일 수정 체크리스트

### Supabase 스키마 변경

- [ ] Supabase 대시보드에서 테이블/컬럼 수정
- [ ] `npx supabase gen types typescript > types/database.ts` 실행
- [ ] types/database.ts 편의 타입 추가/수정
- [ ] 해당 테이블 사용하는 모든 쿼리 함수 검토
- [ ] 해당 데이터 받는 모든 컴포넌트 props 타입 업데이트

### 새 인증 제공자 추가

- [ ] components/social-login-button.tsx에서 provider 타입 추가
- [ ] OAuth 콜백 URL 설정 확인 (`/auth/callback`)
- [ ] app/auth/callback/route.ts에서 토큰 교환 로직 확인
- [ ] 환경 변수 설정

### 보호된 페이지 추가

- [ ] `app/protected/[page-name]/page.tsx` 생성
- [ ] createClient()로 세션 확인
- [ ] 미인증 사용자 리다이렉트 로직
- [ ] Suspense 패턴 (선택사항)

### UI 컴포넌트 추가

- [ ] `npx shadcn-ui@latest add [component-name]`
- [ ] `components/ui/[component-name].tsx` 자동 생성
- [ ] 필요시 shadcn 컴포넌트 커스터마이징

---

**마지막 업데이트:** 2026-02-22
**최종 수정:** 2026-02-22 (OAuth, Suspense, Middleware 패턴 추가)
**작성자:** AI Agent Rule Generator
