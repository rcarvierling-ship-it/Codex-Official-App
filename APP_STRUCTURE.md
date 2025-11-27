# Application Structure Guide

## Overview

This app has two main modes:
1. **Demo Mode** (`/demo/*`) - Uses mock data stored in browser sessionStorage
2. **Real App Mode** - Uses real database data from Vercel Postgres

---

## What Visitors See When They Visit (Production)

### Landing Page (`/`)
When people visit the website, they see:
- **Marketing/landing page** with:
  - Hero section explaining "The Official App"
  - Feature cards (Real-time Event Management, Role-Based Access, etc.)
  - "How it works" section
  - **Waitlist signup form** (submits to `/api/waitlist`)
  - FAQ section
  - Footer with links

**Key Actions:**
- Click "View Live Demo" → Goes to `/demo`
- Click "Join Waitlist" → Scrolls to waitlist form
- Submit waitlist form → Data saved to database, visible in `/admin`

### Other Public Routes
- `/signup` - Signup page (placeholder)
- `/profile` - Profile page (placeholder, says "coming soon")
- `/events` - Events list (uses real database, but may require auth in production)

---

## How to View Non-Demo Version (Real Data)

### Option 1: Test Hub (`/test`)
**Best for development/testing**
- Shows real data from database (events, requests, users, assignments)
- Includes CRUD forms to create/update data
- No authentication required (for now)
- Uses column-tolerant repositories that work with various schema names

**Features:**
- View all events, requests, users, assignments
- Create new users, events, assignments
- Update request/assignment statuses
- All data is live from Vercel Postgres

### Option 2: Role-Specific Test Pages (`/test/roles/*`)
- `/test/roles/ad` - Athletic Director view
- `/test/roles/admin` - Admin view
- `/test/roles/coach` - Coach view
- `/test/roles/official` - Official view

These pages show role-specific dashboards with real database data.

### Option 3: Admin Dashboard (`/admin`)
- Requires `league_admin` role (checked via `requireRole()`)
- Shows waitlist entries from database
- Displays metrics (events count, users count, etc.)
- Uses real database queries

### Option 4: Events Page (`/events`)
- Lists all events from database
- Uses Drizzle ORM to query `events`, `teams`, `venues` tables
- Shows empty state if no events exist

---

## Data Sources

### Demo Mode (`/demo/*`)
- **Source:** `app/demo/_state/demoStore.ts` (Zustand store)
- **Storage:** Browser sessionStorage
- **Data:** Mock data from `app/demo/_data/mockData.ts`
- **Features:** 
  - Persona switching
  - Interactive demos
  - No database required

### Real App Mode
- **Source:** Vercel Postgres database
- **Access:** Via `@/lib/repos/*` (column-tolerant repositories)
- **ORM:** Drizzle ORM for typed queries
- **Tables:** `events`, `users`, `requests`, `assignments`, `waitlist`, etc.

---

## Database Setup

To use real data, you need:

1. **Environment Variables** (`.env.local`):
   ```
   POSTGRES_URL=your_vercel_postgres_url
   POSTGRES_URL_NON_POOLING=your_non_pooling_url
   ```

2. **Database Schema:**
   - The app uses column-tolerant repositories that adapt to different column names
   - See `lib/repos/events.ts`, `lib/repos/requests.ts`, etc.
   - They try multiple column name variations (e.g., `name` vs `title`, `event_id` vs `eventId`)

3. **Seed Data:**
   ```bash
   pnpm db:seed
   ```

---

## Authentication & Role-Based Access

The app uses NextAuth.js for authentication with role-based access control:

### User Roles (Canonical Names)
- `league_admin` - League Administrator (highest level, can see all schools/leagues)
- `school_admin` - School Administrator
- `athletic_director` - Athletic Director
- `coach` - Coach
- `official` - Official/Referee
- `fan` - Fan/Parent (default role for new signups)

### Role-Based Dashboards
Each role has a dedicated dashboard:
- `/dashboard/league` - League Admin Dashboard
- `/dashboard/school` - School Admin & Athletic Director Dashboard
- `/dashboard/coach` - Coach Dashboard
- `/dashboard/official` - Official Dashboard
- `/dashboard/fan` - Fan Dashboard

### Authentication Flow
1. New users sign up → Default role: `fan`
2. Users complete onboarding → Select school and role
3. Users are redirected to their role-specific dashboard
4. Middleware protects routes based on authentication
5. Pages use `requireAuth()`, `requireRole()`, or `getAuthRole()` for access control

### Legacy Role Support
The app includes `normalizeRole()` function that maps legacy role names to canonical ones:
- `SUPER_ADMIN`, `ADMIN` → `league_admin`
- `AD`, `athletic_director` → `athletic_director`
- `USER`, `PARENT`, `STAFF` → `fan`
- `COACH` → `coach`
- `OFFICIAL` → `official`

---

## Key Differences

| Feature | Demo (`/demo`) | Real App (`/test`, `/admin`, `/events`) |
|---------|----------------|------------------------------------------|
| Data Source | Mock data (sessionStorage) | Database (Vercel Postgres) |
| Persistence | Browser session only | Permanent database |
| Persona Switching | ✅ Yes | ❌ No (uses actual user role) |
| CRUD Operations | ✅ Yes (mock) | ✅ Yes (real) |
| Authentication | ❌ No | ⚠️ Partial (role checks) |

---

## Recommended Development Workflow

1. **For UI/UX Development:** Use `/demo` pages
   - Fast iteration
   - No database needed
   - Easy to share with stakeholders

2. **For Backend/Data Testing:** Use `/test` pages
   - Test real database operations
   - Verify schema compatibility
   - Test CRUD operations

3. **For Production Preview:** Use `/admin` and `/events`
   - See what authenticated users will see
   - Test role-based access
   - Verify data flow

---

## Role-Based Navigation

The app includes a `Sidebar` component that displays navigation items based on the user's role. Navigation paths are defined in `src/lib/nav.ts`:

- Each role has a `ROLE_NAV_PATHS` entry defining accessible routes
- Navigation automatically filters based on `getAuthRole()`
- Role-specific dashboards are included in each role's navigation

## Type Safety

The app uses TypeScript with a `SessionUser` interface (`lib/types/auth.ts`) for type-safe session access:
- Import `SessionUser` type: `import type { SessionUser } from "@/lib/types/auth"`
- Use instead of `session.user as any`: `const user = session.user as SessionUser`
- Provides autocomplete and type checking for all session user properties

## Next Steps for Production

1. ✅ **Authentication:** NextAuth.js implemented with role-based access
2. ✅ **Role-Specific Dashboards:** All role dashboards created
3. ✅ **Onboarding Flow:** Users select school and role during onboarding
4. **Future Enhancements:**
   - Add more role-specific features
   - Enhance error boundaries
   - Add comprehensive testing
   - Improve type safety across all pages (migrate remaining `session.user as any` to `SessionUser`)

