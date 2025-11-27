# Migration Guide: Using SessionUser Type

This guide helps you migrate from `session.user as any` to the type-safe `SessionUser` interface.

## Why Migrate?

- **Type Safety**: Get autocomplete and type checking for session user properties
- **Better DX**: Catch errors at compile time instead of runtime
- **Documentation**: The `SessionUser` interface documents all available properties
- **Maintainability**: Easier to refactor and understand code

## Quick Start

### Before (Unsafe)
```typescript
const user = session.user as any;
const userId = user?.id;
const email = user?.email;
const role = user?.role;
```

### After (Type-Safe)
```typescript
import type { SessionUser } from "@/lib/types/auth";

const user = session.user as SessionUser;
const userId = user?.id;        // ✅ TypeScript knows this is string
const email = user?.email;      // ✅ TypeScript knows this is string
const role = user?.role;        // ✅ TypeScript knows this is Role
```

## Step-by-Step Migration

### 1. Import the Type
Add this import at the top of your file:
```typescript
import type { SessionUser } from "@/lib/types/auth";
```

### 2. Replace `as any` with `as SessionUser`
```typescript
// Before
const user = session.user as any;

// After
const user = session.user as SessionUser;
```

### 3. Use Type-Safe Properties
All properties are now typed:
```typescript
const user = session.user as SessionUser;

// Core properties (always present)
user.id          // string
user.email       // string
user.name        // string
user.role        // Role

// Optional properties (may be undefined)
user.schoolId              // string | null | undefined
user.school                // School object | null | undefined
user.leagueId              // string | null | undefined
user.league                // League object | null | undefined
user.accessibleSchools     // string[] | undefined
user.accessibleLeagues    // string[] | undefined
user.canSeeAll            // boolean | undefined
user.activeContextId      // string | undefined
```

## Common Patterns

### Pattern 1: Basic User Info
```typescript
import type { SessionUser } from "@/lib/types/auth";

const user = session.user as SessionUser;
const userId = user.id;
const email = user.email;
const role = user.role;
```

### Pattern 2: School Context
```typescript
import type { SessionUser } from "@/lib/types/auth";

const user = session.user as SessionUser;
const activeSchoolId = user.schoolId ?? null;
const schoolName = user.school?.name;
```

### Pattern 3: Access Control
```typescript
import type { SessionUser } from "@/lib/types/auth";

const user = session.user as SessionUser;
const canSeeAll = user.canSeeAll ?? false;
const accessibleSchools = user.accessibleSchools ?? [];
const accessibleLeagues = user.accessibleLeagues ?? [];
```

### Pattern 4: Conditional Logic
```typescript
import type { SessionUser } from "@/lib/types/auth";

const user = session.user as SessionUser;

if (user.schoolId) {
  // User has an active school context
  const school = user.school;
  // ...
}

if (user.canSeeAll) {
  // User is league_admin and can see all schools
  // ...
}
```

## Files That Need Migration

There are currently **65 instances** across **45 files** that can be migrated. Priority files:

### High Priority (API Routes)
- `app/api/game-change-requests/route.ts`
- `app/api/requests/route.ts`
- `app/api/schools/create/route.ts`
- `app/api/schools/assign/route.ts`
- `app/api/payments/route.ts`
- `app/api/user/contexts/route.ts`

### Medium Priority (Page Components)
- `app/(app)/dashboard/league/page.tsx`
- `app/(app)/dashboard/coach/page.tsx`
- `app/(app)/dashboard/school/page.tsx`
- `app/(app)/dashboard/official/page.tsx`
- `app/(app)/events/page.tsx`
- `app/(app)/teams/page.tsx`
- `app/(app)/requests/page.tsx`

### Low Priority (Other Pages)
- `app/(app)/analytics/page.tsx`
- `app/(app)/approvals/page.tsx`
- `app/(app)/assignments/page.tsx`
- `app/(app)/officials/page.tsx`
- `app/(app)/venues/page.tsx`
- `app/(app)/announcements/page.tsx`

## Migration Checklist

For each file:
- [ ] Add `import type { SessionUser } from "@/lib/types/auth";`
- [ ] Replace `session.user as any` with `session.user as SessionUser`
- [ ] Remove any unnecessary optional chaining (TypeScript will warn if needed)
- [ ] Verify no TypeScript errors
- [ ] Test the page/route to ensure it still works

## Example: Complete Migration

### Before
```typescript
export default async function MyPage() {
  const session = await requireAuth();
  const user = session.user as any;
  const userId = user?.id;
  const email = user?.email;
  const role = user?.role;
  const schoolId = user?.schoolId ?? null;
  
  // ... rest of code
}
```

### After
```typescript
import type { SessionUser } from "@/lib/types/auth";

export default async function MyPage() {
  const session = await requireAuth();
  const user = session.user as SessionUser;
  const userId = user.id;           // No optional chaining needed - always present
  const email = user.email;         // No optional chaining needed - always present
  const role = user.role;           // No optional chaining needed - always present
  const schoolId = user.schoolId ?? null;  // Optional chaining only for optional props
  
  // ... rest of code
}
```

## Benefits After Migration

1. **Autocomplete**: IDE will suggest available properties
2. **Type Checking**: TypeScript will catch typos and wrong property access
3. **Refactoring Safety**: Renaming properties will update all usages
4. **Documentation**: Hover over properties to see their types
5. **Better Errors**: Clear error messages when accessing non-existent properties

## Questions?

If you encounter issues during migration:
1. Check `lib/types/auth.ts` for the complete `SessionUser` interface
2. Verify the property exists in the interface
3. Use optional chaining (`?.`) for optional properties
4. Use nullish coalescing (`??`) for default values

