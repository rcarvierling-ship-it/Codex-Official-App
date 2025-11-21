# Vercel Environment Variables Setup

To fix the "server configuration" error, you need to set these environment variables in Vercel:

## Required Environment Variables

1. **NEXTAUTH_SECRET** (or **AUTH_SECRET**)
   - Generate a random secret: `openssl rand -base64 32`
   - Or use: `npx auth secret`
   - Add this in Vercel → Settings → Environment Variables

2. **POSTGRES_URL** (optional but recommended)
   - Your Vercel Postgres connection string
   - Found in Vercel → Storage → Postgres → .env.local
   - Or use **POSTGRES_URL_NON_POOLING** if you prefer

## How to Set in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: (your generated secret)
   - **Environment**: Production, Preview, Development (check all)
4. Click **Save**
5. **Redeploy** your application

## Quick Fix

Run this to generate a secret:
```bash
openssl rand -base64 32
```

Then copy the output and paste it as the value for `NEXTAUTH_SECRET` in Vercel.

## After Setting Variables

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Wait for the deployment to complete

The 500 errors should be resolved once `NEXTAUTH_SECRET` is set.

