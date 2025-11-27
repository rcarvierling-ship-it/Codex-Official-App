# Testing Guide

This guide helps you test the key features and functionality of The Official App.

## 🧪 Testing Checklist

### 1. Authentication & Onboarding Flow

#### Sign Up
- [ ] Navigate to `/signup`
- [ ] Fill in name, email, and password (min 6 characters)
- [ ] Submit form
- [ ] Verify user is created with default role `fan`
- [ ] Verify redirect to `/onboarding`

#### Onboarding
- [ ] Select an existing school or create a new one
- [ ] Select a role (fan, coach, official, athletic_director, school_admin, league_admin)
- [ ] Submit onboarding form
- [ ] Verify redirect to correct role-specific dashboard:
  - `fan` → `/dashboard/fan`
  - `coach` → `/dashboard/coach`
  - `official` → `/dashboard/official`
  - `athletic_director` → `/dashboard/school`
  - `school_admin` → `/dashboard/school`
  - `league_admin` → `/dashboard/league`

#### Login
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Verify successful login
- [ ] Verify redirect to appropriate dashboard based on role

### 2. Role-Based Access Control

#### Dashboard Access
- [ ] As `fan`: Verify access to `/dashboard/fan` only
- [ ] As `coach`: Verify access to `/dashboard/coach` only
- [ ] As `official`: Verify access to `/dashboard/official` only
- [ ] As `athletic_director`: Verify access to `/dashboard/school` only
- [ ] As `school_admin`: Verify access to `/dashboard/school` only
- [ ] As `league_admin`: Verify access to `/dashboard/league` only

#### Unauthorized Access
- [ ] As `fan`, try to access `/dashboard/league` → Should redirect to `/dashboard`
- [ ] As `coach`, try to access `/dashboard/league` → Should redirect to `/dashboard`
- [ ] As non-admin, try to access `/admin` → Should redirect or show error

#### Navigation
- [ ] Verify sidebar shows only role-appropriate navigation items
- [ ] Verify each role sees correct dashboard link in navigation
- [ ] Verify navigation items match `ROLE_NAV_PATHS` in `src/lib/nav.ts`

### 3. Role Update API

#### Update Role
- [ ] Authenticate as any user
- [ ] Call `POST /api/user/update-role` with:
  ```json
  { "role": "coach" }
  ```
- [ ] Verify role is normalized (e.g., "COACH" → "coach")
- [ ] Verify role is saved to database
- [ ] Verify response includes normalized role
- [ ] Test with legacy role names (should normalize correctly)

#### Invalid Role
- [ ] Try to update to invalid role → Should return 400 error
- [ ] Try to update without authentication → Should return 401 error

### 4. Event Detail Page

#### Role Checks
- [ ] As `coach`: Verify "Game Change Requests" section is visible
- [ ] As `official`: Verify "Score Submission" form is visible
- [ ] As `league_admin` or `school_admin`: Verify "Lock Score" functionality
- [ ] As `fan`: Verify no admin/coach/official features are visible

#### Role Normalization
- [ ] Verify role checks use `normalizeRole()` function
- [ ] Test with legacy role names in session (should work correctly)

### 5. Registration API

#### New User Registration
- [ ] Call `POST /api/register` with valid data
- [ ] Verify user is created with role `fan` (not `USER`)
- [ ] Verify default role in database is `fan`
- [ ] Test with Drizzle ORM path
- [ ] Test with raw SQL fallback path

### 6. Type Safety

#### SessionUser Type
- [ ] Verify migrated files use `SessionUser` type
- [ ] Verify TypeScript autocomplete works for session user properties
- [ ] Verify no `session.user as any` in migrated files

### 7. Error Handling

#### Authentication Errors
- [ ] Test with missing `NEXTAUTH_SECRET` → Should log warning, not crash
- [ ] Test with invalid session → Should redirect to login
- [ ] Test with expired session → Should redirect to login

#### Role Retrieval
- [ ] Test `getAuthRole()` with various scenarios:
  - Active context exists → Should use context role
  - No context, database role exists → Should use database role
  - No database role, session role exists → Should use session role
  - No role anywhere → Should default to `fan`

### 8. Build & Deployment

#### Build Verification
- [ ] Run `npm run build` → Should succeed with no errors
- [ ] Verify TypeScript compilation passes
- [ ] Verify no linting errors
- [ ] Verify all routes compile correctly

#### Production Deployment
- [ ] Deploy to Vercel
- [ ] Verify environment variables are set correctly
- [ ] Test authentication in production
- [ ] Test role-based routing in production
- [ ] Monitor logs for any role-related errors

## 🐛 Common Issues to Test

### Issue 1: Redirect Loop
- **Test**: Complete onboarding and verify redirect works
- **Expected**: User should be redirected to correct dashboard, not stuck in loop

### Issue 2: Role Not Updating
- **Test**: Update role via API, then check session
- **Expected**: Role should be updated in database and reflected in session

### Issue 3: Legacy Role Names
- **Test**: Use legacy role names (USER, ADMIN, etc.) in various places
- **Expected**: Should normalize to canonical names automatically

### Issue 4: Type Errors
- **Test**: Access session user properties
- **Expected**: TypeScript should provide autocomplete and type checking

## 📊 Test Scenarios

### Scenario 1: New User Journey
1. Sign up → Default role `fan`
2. Complete onboarding → Select `coach` role
3. Verify redirect to `/dashboard/coach`
4. Verify navigation shows coach-appropriate items
5. Verify can access coach features

### Scenario 2: Role Change
1. Login as `fan`
2. Update role to `official` via API
3. Refresh page
4. Verify redirect to `/dashboard/official`
5. Verify navigation updates

### Scenario 3: Multi-School User
1. Login as `league_admin`
2. Verify can see all schools
3. Switch context to specific school
4. Verify filtered view

## 🔍 Manual Testing Commands

```bash
# Test build
npm run build

# Test type checking
npm run typecheck

# Test linting
npm run lint

# Start dev server
npm run dev
```

## 📝 Test Data

For testing, you may want to create test users with different roles:

```sql
-- Create test users (adjust as needed)
INSERT INTO users (name, email, password, role) VALUES
  ('Test Fan', 'fan@test.com', 'hashed_password', 'fan'),
  ('Test Coach', 'coach@test.com', 'hashed_password', 'coach'),
  ('Test Official', 'official@test.com', 'hashed_password', 'official'),
  ('Test AD', 'ad@test.com', 'hashed_password', 'athletic_director'),
  ('Test Admin', 'admin@test.com', 'hashed_password', 'school_admin'),
  ('Test League Admin', 'league@test.com', 'hashed_password', 'league_admin');
```

## ✅ Success Criteria

All tests should pass:
- ✅ No redirect loops
- ✅ Correct role-based routing
- ✅ Proper access control
- ✅ Type safety maintained
- ✅ Error handling works
- ✅ Build succeeds
- ✅ Production deployment works

---

**Note**: This is a manual testing guide. For automated testing, consider adding Jest/Vitest tests in the future.

