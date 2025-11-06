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
- Requires SUPER_ADMIN or ADMIN role (checked via `getServerRole()`)
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

## Authentication (Future)

Currently, most real app pages don't require authentication. In production, you'll likely want to:

1. Add NextAuth.js or similar
2. Protect routes like `/admin`, `/events`, `/profile`
3. Redirect unauthenticated users to `/signup` or `/login`
4. Use `getServerRole()` to check permissions

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

## Next Steps for Production

1. **Add Authentication:**
   - Implement NextAuth.js
   - Add login/signup pages
   - Protect routes based on user role

2. **Build Real App Pages:**
   - Create role-specific dashboards (similar to `/demo` but with real data)
   - Add event detail pages
   - Build user profile management

3. **Replace Demo with Real:**
   - Once real pages are built, you can keep `/demo` as a public preview
   - Or redirect authenticated users to real app pages

4. **Add Navigation:**
   - Create a main app layout with sidebar (like DemoShell)
   - Use role-based navigation
   - Add breadcrumbs and proper routing

