# Next.js 16.1.6 개발 지침

이 문서는 Claude Code에서 Next.js 16.1.6 프로젝트를 개발할 때 따라야 할 핵심 규칙과 가이드라인을 제공합니다.

## 🚀 필수 규칙 (엄격 준수)

### App Router 아키텍처

```typescript
// ✅ 올바른 방법: App Router 사용
app/
├── layout.tsx          // 루트 레이아웃
├── page.tsx           // 메인 페이지
├── loading.tsx        // 로딩 UI
├── error.tsx          // 에러 UI
├── not-found.tsx      // 404 페이지
└── dashboard/
    ├── layout.tsx     // 대시보드 레이아웃
    └── page.tsx       // 대시보드 페이지

// ❌ 금지: Pages Router 사용
pages/
├── index.tsx
└── dashboard.tsx
```

### Server Components 우선 설계

```typescript
// 🚀 필수: 기본적으로 모든 컴포넌트는 Server Components
export default async function UserDashboard() {
  // 서버에서 데이터 가져오기
  const user = await getUser()

  return (
    <div>
      <h1>{user.name}님의 대시보드</h1>
      {/* 클라이언트 컴포넌트가 필요한 경우에만 분리 */}
      <InteractiveChart data={user.analytics} />
    </div>
  )
}

// ✅ 클라이언트 컴포넌트는 최소한으로 사용
'use client'

import { useState } from 'react'

export function InteractiveChart({ data }: { data: Analytics[] }) {
  const [selectedRange, setSelectedRange] = useState('week')
  // 상호작용 로직만 클라이언트에서 처리
  return <Chart data={data} range={selectedRange} />
}
```

### 🚀 async request APIs 처리 (필수)

```typescript
// ✅ Next.js 16.1.6 필수 방식
import { cookies, headers } from 'next/headers'

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 🚀 필수: async request APIs 올바른 처리
  const { id } = await params
  const query = await searchParams
  const cookieStore = await cookies()
  const headersList = await headers()

  const user = await getUser(id)

  return <UserProfile user={user} />
}

// ❌ 금지: 동기식 접근 (v16에서 런타임 에러 발생)
export default function Page({ params }: { params: { id: string } }) {
  const user = getUser(params.id) // 🔴 런타임 에러: 반드시 async/await 사용 필수
  return <UserProfile user={user} />
}
```

### Typed Routes 활용

```typescript
// 🚀 필수: Typed Routes로 타입 안전성 보장
import Link from 'next/link'

// next.config.ts에서 experimental.typedRoutes: true 설정 필요
export function Navigation() {
  return (
    <nav>
      {/* ✅ 타입 안전한 링크 */}
      <Link href="/dashboard/users/123">사용자 상세</Link>
      <Link href={{
        pathname: '/products/[id]',
        params: { id: 'abc' }
      }}>제품 상세</Link>

      {/* ❌ 컴파일 에러: 존재하지 않는 경로 */}
      <Link href="/nonexistent-route">잘못된 링크</Link>
    </nav>
  )
}
```

## ✅ 권장 사항 (성능 최적화)

### Streaming과 Suspense 활용

```typescript
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>대시보드</h1>

      {/* ✅ 빠른 컨텐츠는 즉시 렌더링 */}
      <QuickStats />

      {/* ✅ 느린 컨텐츠는 Suspense로 감싸기 */}
      <Suspense fallback={<SkeletonChart />}>
        <SlowChart />
      </Suspense>

      <Suspense fallback={<SkeletonTable />}>
        <SlowDataTable />
      </Suspense>
    </div>
  )
}

async function SlowChart() {
  // 무거운 데이터 처리
  await new Promise(resolve => setTimeout(resolve, 2000))
  const data = await getComplexAnalytics()

  return <Chart data={data} />
}
```

### 🔄 New: after() API 활용

```typescript
import { after } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // 즉시 응답 반환
  const result = await processUserData(body)

  // 🔄 비블로킹 작업은 after()로 처리
  after(async () => {
    await sendAnalytics(result)
    await updateCache(result.id)
    await sendNotification(result.userId)
  })

  return Response.json({ success: true, id: result.id })
}
```

### 새로운 캐싱 전략

```typescript
// ✅ 세밀한 캐시 제어
export async function getProductData(id: string) {
  const data = await fetch(`/api/products/${id}`, {
    // 🔄 Next.js 15.5.3 새로운 캐시 옵션
    next: {
      revalidate: 3600, // 1시간 캐시
      tags: [`product-${id}`, 'products'], // 태그 기반 무효화
    },
  })

  return data.json()
}

// 캐시 무효화
import { revalidateTag } from 'next/cache'

export async function updateProduct(id: string, data: ProductData) {
  await updateDatabase(id, data)

  // 관련 캐시 무효화
  revalidateTag(`product-${id}`)
  revalidateTag('products')
}
```

### React Compiler 활용 (필수)

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ React Compiler 안정화 (v16에서 experimental 제거)
  reactCompiler: true,
}

export default nextConfig
```

React Compiler는 컴포넌트의 렌더링 성능을 자동으로 최적화합니다:
- 불필요한 리렌더링 자동 방지
- 수동 메모이제이션 (`React.memo`, `useMemo`) 대체
- 런타임 성능 향상

### Turbopack 최적화 설정

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ v16 Turbopack 최적화 설정 (최상위 레벨)
  turbopack: {
    rules: {
      // CSS 모듈 최적화
      '*.module.css': {
        loaders: ['css-loader'],
        as: 'css',
      },
    },
  },

  // ✅ Turbopack 파일시스템 캐싱 (Beta) - 빌드 속도 향상
  experimental: {
    turbopackFileSystemCacheForDev: true,
    // 🔄 패키지 import 최적화
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'lodash-es',
    ],
  },
}

export default nextConfig
```

**v15 → v16 마이그레이션 변경사항:**
- `experimental.turbo` → `turbopack` (최상위 레벨)
- Turbopack 파일시스템 캐싱 추가로 개발 빌드 속도 향상

## ⚠️ Breaking Changes 대응

### React 19 호환성

```typescript
// ⚠️ React 19에서 변경된 사항들

// ✅ 새로운 방식: useFormStatus 훅
'use client'

import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? '제출 중...' : '제출'}
    </button>
  )
}

// ✅ Server Actions와 form 통합
export async function createUser(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const email = formData.get('email') as string

  await saveUser({ name, email })
  redirect('/users')
}

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <SubmitButton />
    </form>
  )
}
```

### Proxy 설정 (v16에서 Middleware 개명)

```typescript
// proxy.ts (v15의 middleware.ts에서 변경됨)
import { NextRequest, NextResponse } from 'next/server'

// ✅ v16에서 proxy로 함수명 및 파일명 변경
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

// ✅ 함수명: middleware() → proxy()
export function proxy(request: NextRequest) {
  // Node.js Runtime 전용 - Edge Runtime 미지원
  const crypto = require('crypto')
  const hash = crypto.createHash('sha256')

  // 인증 로직
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

**⚠️ v16 주요 변경사항:**
- **파일명:** `middleware.ts` → `proxy.ts`
- **함수명:** `export function middleware()` → `export function proxy()`
- **설정:** `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`
- **런타임:** Node.js 전용 (Edge Runtime 미지원)

**Edge Runtime이 필요한 경우:**
기존 `middleware.ts` 파일을 그대로 유지할 수 있으며, `proxy.ts`와 함께 사용 가능합니다.

**next.config.ts 설정:**
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ skipProxyUrlNormalize (v15의 skipMiddlewareUrlNormalize에서 변경)
  skipProxyUrlNormalize: true,
}

export default nextConfig
```

### ESLint 통합 변경 (v16)

```typescript
// ⚠️ v16에서 변경된 ESLint 처리

// next.config.ts - 'eslint' 옵션 제거됨
const nextConfig: NextConfig = {
  // ❌ v15 방식 (제거됨)
  // eslint: {
  //   dirs: ['pages', 'utils', 'components'],
  // },

  // v16에서는 ESLint CLI를 직접 사용해야 함
}

export default nextConfig
```

**v16 ESLint 변경사항:**
- `next lint` 명령어 제거
- `next build` 시 자동 린팅 제거
- ESLint 또는 Biome CLI를 직접 사용해야 함

**권장되는 ESLint 사용 방법:**
```bash
# ESLint CLI 직접 사용
npx eslint .

# 또는 Biome 사용
npx biome check .

# package.json에 스크립트 추가
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### 🔄 New: unauthorized/forbidden API

```typescript
// app/api/admin/route.ts
import { unauthorized, forbidden } from 'next/server'

export async function GET(request: Request) {
  const session = await getSession(request)

  // 🔄 새로운 unauthorized 함수
  if (!session) {
    return unauthorized()
  }

  // 🔄 새로운 forbidden 함수
  if (!session.user.isAdmin) {
    return forbidden()
  }

  const data = await getAdminData()
  return Response.json(data)
}
```

## 🔄 Next.js 15 → 16 마이그레이션

v15에서 v16으로 업그레이드할 때는 공식 Codemod를 사용하여 자동으로 대부분의 변경사항을 처리할 수 있습니다.

```bash
# 🚀 자동 마이그레이션 실행
npx @next/codemod@latest upgrade .
```

**Codemod가 자동으로 처리하는 항목:**
- `next.config.js`의 `experimental.turbo` → `turbopack` 이전
- `middleware.ts` → `proxy.ts` 파일명/함수명 변경
- `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize` 설정 업데이트
- ESLint 설정 마이그레이션
- `experimental_ppr` Route Segment Config 제거

**마이그레이션 후 확인 사항:**
1. `proxy.ts` 파일이 올바르게 생성되었는지 확인
2. `next.config.ts`에서 새로운 설정이 적용되었는지 확인
3. `npm run typecheck` 실행하여 타입 에러 확인
4. `npm run build` 실행하여 빌드 성공 확인

## 🔄 New Features 활용

### Route Groups 고급 패턴

```typescript
// ✅ Route Groups로 레이아웃 분리
app/
├── (marketing)/
│   ├── layout.tsx     // 마케팅 레이아웃
│   ├── page.tsx       // 홈페이지
│   └── about/
│       └── page.tsx   // 소개 페이지
├── (dashboard)/
│   ├── layout.tsx     // 대시보드 레이아웃
│   └── analytics/
│       └── page.tsx   // 분석 페이지
└── (auth)/
    ├── login/
    │   └── page.tsx
    └── register/
        └── page.tsx

// (marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="marketing-layout">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  )
}
```

### Parallel Routes 활용

```typescript
// ✅ Parallel Routes로 동시 렌더링
app/
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── @analytics/
│   │   └── page.tsx
│   └── @notifications/
│       └── page.tsx

// dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div className="dashboard-grid">
      <main>{children}</main>
      <aside className="analytics-panel">
        <Suspense fallback={<AnalyticsSkeleton />}>
          {analytics}
        </Suspense>
      </aside>
      <div className="notifications-panel">
        <Suspense fallback={<NotificationsSkeleton />}>
          {notifications}
        </Suspense>
      </div>
    </div>
  )
}
```

### Intercepting Routes

```typescript
// ✅ Intercepting Routes로 모달 구현
app/
├── gallery/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx    // 전체 페이지 보기
└── @modal/
    └── (.)gallery/
        └── [id]/
            └── page.tsx // 모달 보기

// @modal/(.)gallery/[id]/page.tsx
import { Modal } from '@/components/modal'

export default async function PhotoModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <Modal>
      <img src={photo.url} alt={photo.title} />
    </Modal>
  )
}
```

## ❌ 금지 사항

### Pages Router 사용 금지

```typescript
// ❌ 절대 금지: Pages Router 패턴
pages/
├── _app.tsx
├── _document.tsx
├── index.tsx
└── api/
    └── users.ts

// ❌ 금지: getServerSideProps, getStaticProps 사용
export async function getServerSideProps() {
  // 이 방식은 사용하지 마세요
}
```

### 안티패턴 방지

```typescript
// ❌ 금지: 불필요한 'use client' 사용
'use client'

export default function SimpleComponent({ title }: { title: string }) {
  // 상태나 이벤트 핸들러가 없는데 'use client' 사용
  return <h1>{title}</h1>
}

// ✅ 올바른 방법: Server Component로 유지
export default function SimpleComponent({ title }: { title: string }) {
  return <h1>{title}</h1>
}

// ❌ 금지: 클라이언트에서 서버 함수 직접 호출
'use client'

import { getUser } from '@/lib/database' // 서버 전용 함수

export function UserProfile() {
  const user = getUser() // 에러 발생
  return <div>{user.name}</div>
}

// ✅ 올바른 방법: 서버에서 데이터 전달
export default async function UserPage() {
  const user = await getUser()
  return <UserProfile user={user} />
}

function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

## 코드 품질 체크리스트

개발 완료 후 다음 명령어들을 반드시 실행하세요:

```bash
# 🚀 필수: 타입 체크
npm run typecheck

# 🚀 필수: ESLint 검사 (v16에서 ESLint CLI 직접 사용)
npx eslint .

# ✅ 권장: 포맷 검사
npm run format:check

# 🚀 필수: 통합 검사
npm run check-all

# 🚀 필수: 빌드 테스트
npm run build
```

**v16 변경사항:**
- `npm run lint` (next lint) 제거 → ESLint CLI 직접 사용
- `next build` 시 자동 린팅 제거 → 명시적으로 ESLint 실행

이 지침을 따라 Next.js 16.1.6의 모든 기능을 최대한 활용하여 현대적이고 성능 최적화된 애플리케이션을 개발하세요.
