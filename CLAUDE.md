# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# App available at http://localhost:3000

# Build for production
npm build

# Run linter
npm run lint

# Check for security issues
npm run security

# Update project roadmap
npm run update-roadmap

# Create git commits with conventional messages
npm run commit
```

## Project Overview

**Tech Stack:**

- **Framework:** Next.js 16+ with App Router
- **Runtime:** React 19 with TypeScript 5
- **Backend:** Supabase (PostgreSQL, Auth, Real-time)
- **Styling:** Tailwind CSS v3 + shadcn/ui components
- **Icons:** lucide-react
- **Theme:** next-themes (light/dark mode support)

**Core Features:**

- Authentication via Supabase (email/password with cookie-based session)
- Type-safe database queries using auto-generated Supabase types
- Server Components by default (streaming and async operations)
- Client Components for interactive features
- Protected routes and middleware via proxy pattern (v16 style)

## Architecture

### High-Level Structure

```
app/                  # Next.js App Router pages (main source)
├── layout.tsx        # Root layout (ThemeProvider setup)
├── page.tsx          # Landing page (/)
├── (auth)/           # Auth route group
│   ├── login/
│   ├── sign-up/
│   ├── forgot-password/
│   └── update-password/
├── protected/        # Authenticated pages
│   └── page.tsx
└── api/              # API routes (future)

components/           # React components (reusable)
├── ui/              # shadcn/ui base components
├── layout/          # Page layout components
├── navigation/      # Nav components
└── *.tsx            # Feature components

lib/                 # Utilities and config
├── supabase/
│   ├── client.ts    # Browser client
│   └── server.ts    # Server client (async)
├── utils.ts         # cn() and helpers
└── ...

types/
├── database.ts      # Auto-generated Supabase types
└── (custom types)

docs/guides/         # Development documentation
```

### Key Design Patterns

**1. Supabase Client Pattern**

- Browser client: `lib/supabase/client.ts` - for client components
- Server client: `lib/supabase/server.ts` - for server components and actions
- Use `createClient()` function in each server component (never global)
- Cookie-based session handling via @supabase/ssr

**2. Server vs Client Components**

- Default: Server Components (async, data fetching, security)
- Use `'use client'` sparingly for interactive features
- Clear boundary: pass serializable data to client components
- Wrap client components in server components for data fetching

**3. Type Safety**

- Database types auto-generated in `types/database.ts`
- Use `Tables<'profiles'>` and `Profile` types throughout app
- Component props always fully typed
- TypeScript strict mode enabled

**4. Styling**

- Tailwind CSS with CSS variables for theming
- shadcn/ui for base components
- Use `cn()` utility for conditional classes
- Custom components in `components/ui/`

**5. API Patterns**

- Route handlers in `app/api/` (if needed)
- Prefer Server Actions for mutations
- Proxy pattern in `proxy.ts` for middleware-like behavior

## Development Workflow

### Adding a New Page

1. Create folder structure in `app/`
2. Add `page.tsx` and optional `layout.tsx`
3. Use async/await for data fetching (server component by default)
4. Wrap interactive elements in separate client components

```tsx
// app/products/page.tsx
import { ProductList } from "@/components/product-list";
import { Suspense } from "react";

export default async function ProductsPage() {
  const products = await getProducts(); // Server-side data fetch

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList products={products} />
    </Suspense>
  );
}
```

### Adding a Component

Follow the component organization in `docs/guides/component-patterns.md`:

- **ui/**: Base UI components (from shadcn/ui)
- **layout/**: Page structure components
- **navigation/**: Navigation components
- Single responsibility principle
- Compose larger components from smaller ones

### Database Changes

1. Modify schema in Supabase dashboard
2. Update `types/database.ts` via: `npx supabase gen types typescript > types/database.ts`
3. Update convenience types at bottom of file
4. Use types in queries for full type safety

### Authentication Flow

- Session cookie-based (no token in localStorage)
- `lib/supabase/server.ts` handles session in server components
- Auth pages in `app/(auth)/` route group
- Protected pages redirect via middleware-like behavior
- User accessible via `createClient().auth.getUser()`

## Code Standards

### Naming Conventions

- **Files:** kebab-case for files and folders
- **Components:** PascalCase for function names
- **Props:** Use TypeScript interfaces with clear types
- **Constants:** UPPER_SNAKE_CASE

### Import Order

1. External libraries (react, next, etc.)
2. Internal absolute imports (@/ paths)
3. Relative imports (rare, prefer absolute)
4. CSS/styles

### Path Aliases (from components.json)

```
@/components → components/
@/lib → lib/
@/hooks → hooks/ (future)
@/ui → components/ui/
@/utils → lib/utils
```

Always use path aliases, never relative imports.

### File Size Guidelines

- Keep components under 300 lines
- Split larger features into multiple files
- Use separate client/server components when needed

### Comments

- Add comments for non-obvious logic
- Document complex component props
- Comments in Korean per CLAUDE.md preference

## Common Tasks

### Using Supabase

**Server Component (Data Fetching):**

```tsx
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types/database";

export default async function UserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return <div>{profile?.full_name}</div>;
}
```

**Client Component (Mutations):**

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export function UpdateProfile() {
  const supabase = createClient();

  const handleUpdate = async (formData: FormData) => {
    await supabase
      .from("profiles")
      .update({ full_name: formData.get("name") })
      .eq("id", userId);
  };

  return <form action={handleUpdate}>...</form>;
}
```

### Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
```

Components automatically added to `components/ui/` with correct imports.

### Environment Variables

Required variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

Note: `NEXT_PUBLIC_` prefix means they're exposed to browser (safe for publishable key only).

## Testing & Quality

Run linter frequently during development:

```bash
npm run lint
```

Check security issues:

```bash
npm run security
```

## Documentation

Refer to the guides in `docs/guides/`:

- `project-structure.md` - Detailed file organization
- `component-patterns.md` - React patterns and best practices
- `styling-guide.md` - Tailwind and theme setup
- `forms-react-hook-form.md` - Form patterns
- `nextjs-16.md` - Next.js 16 specific features

## MCP Servers Available

The project is configured with several MCP servers for enhanced development:

- **Supabase MCP:** Direct database and function access
- **Playwright MCP:** Browser automation for testing
- **Context7 MCP:** Documentation search and code examples
- **Sequential Thinking MCP:** Complex reasoning tasks
- **shadcn MCP:** Component installation and discovery
- **Shrimp Task Manager MCP:** Project task tracking

## Debugging Tips

1. **Type Errors:** Check `types/database.ts` for schema mismatches
2. **Supabase Errors:** Review RLS policies and table permissions
3. **Hydration Errors:** Ensure server/client component boundaries are clear
4. **Session Issues:** Verify cookies are being set (check Network tab)
5. **Build Errors:** Run `npm run lint` to catch issues early

## Git Workflow

Use the commit command for conventional commits:

```bash
npm run commit
```

Or manually follow conventional commit format:

```
feat: add new user profile page
fix: resolve authentication cookie issue
docs: update component patterns guide
```

Commits use emoji prefixes and Korean messages per project conventions.

## Next Steps for New Features

1. Read relevant guide in `docs/guides/`
2. Create feature branch if working on significant feature
3. Follow established patterns in existing code
4. Test locally with `npm run dev`
5. Run linter before committing
6. Create PR with clear description of changes

---

**Last Updated:** 2026-02-21
**Framework Versions:** Next.js 16+, React 19, TypeScript 5, Supabase latest
