# Database Diagnostic Setup Guide

## 1. Set Vercel Environment Variables

In **Vercel → Project → Settings → Environment Variables** (for both **Production** and **Preview**), set all three variables to your Neon connection string:

```
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_kiUKanQ9Z0Sl@ep-morning-math-a4hcdloe.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL=postgresql://neondb_owner:npg_kiUKanQ9Z0Sl@ep-morning-math-a4hcdloe.us-east-1.aws.neon.tech/neondb?sslmode=require

DATABASE_URL=postgresql://neondb_owner:npg_kiUKanQ9Z0Sl@ep-morning-math-a4hcdloe.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Important:** Make sure all three point to the same Neon host (`ep-morning-math-a4hcdloe`).

After setting the variables, **redeploy** your project.

## 2. Diagnostic Endpoint Created

✅ Created `app/api/_db-diag/route.ts`

This endpoint will:
- Show which environment variable is being used (with credentials masked)
- Display database connection info (database name, user, host IP, schema)
- List all tables in the `public` schema
- Return errors if the database connection fails

## 3. Test the Diagnostic Endpoint

After redeploying, visit:
```
https://the-official-app.com/api/_db-diag
```

**Expected response:**
```json
{
  "envUsed": "postgresql://***:***@ep-morning-math-a4hcdloe.us-east-1.aws.neon.tech/neondb?sslmode=require",
  "dbInfo": {
    "db": "neondb",
    "usr": "neondb_owner",
    "host_ip": "...",
    "schema": "public"
  },
  "searchPath": { "search_path": "..." },
  "tables": [
    { "table_schema": "public", "table_name": "waitlist" },
    ...
  ]
}
```

**Check:**
- ✅ `envUsed` should contain `ep-morning-math-a4hcdloe.../neondb`
- ✅ `tables` array should include `public.waitlist` (after step 4)

## 4. Create Waitlist Table in Neon

Open **Neon → the project/branch** whose host matches `ep-morning-math-a4hcdloe`.

In the **SQL Editor**, run:

```sql
create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  email        text unique not null,
  organization text,
  org          text,
  role         text,
  ip_hash      text,
  iphash       text,
  user_agent   text,
  useragent    text,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_waitlist_submitted_at
  on public.waitlist (submitted_at desc);
```

## 5. Verify Everything Works

1. **Visit the diagnostic endpoint again:**
   ```
   https://the-official-app.com/api/_db-diag
   ```
   - Should now show `public.waitlist` in the `tables` array

2. **Test the waitlist API:**
   ```
   https://the-official-app.com/api/waitlist
   ```
   - Should return `[]` (empty array) if no entries yet

3. **Submit the waitlist form** on the landing page
   - Should successfully save to the database
   - Check the diagnostic endpoint again to verify the entry was created

## Troubleshooting

### If `envUsed` shows "unset":
- Check that environment variables are set in Vercel
- Make sure you redeployed after setting the variables
- Verify the variables are set for the correct environment (Production/Preview)

### If tables array is empty:
- The database connection is working, but no tables exist yet
- Run the SQL script from step 4 to create the waitlist table

### If you get an error:
- Check the error message in the diagnostic endpoint response
- Verify the connection string is correct
- Ensure the Neon database is accessible from Vercel's IP ranges

