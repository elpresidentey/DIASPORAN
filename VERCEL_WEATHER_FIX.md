# Fix Weather API on Vercel - Quick Guide

## Problem
Weather page shows "Weather API key not configured" error on Vercel but works locally.

## Root Cause
Vercel doesn't automatically use `.env.local` file - environment variables must be added manually in Vercel dashboard.

## Solution Steps

### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Find your DIASPORAN project
3. Click on the project name

### Step 2: Add Weather API Key
1. Click "Settings" tab
2. Click "Environment Variables" in sidebar
3. Click "Add New" button

### Step 3: Configure the Variable
**Name:** `WEATHER_API_KEY`
**Value:** `2a3d17feb93d41b7a66140016252112`
**Environments:** Check all three boxes:
- ✅ Production
- ✅ Preview  
- ✅ Development

### Step 4: Save and Redeploy
1. Click "Save"
2. Go to "Deployments" tab
3. Click "..." on latest deployment
4. Click "Redeploy"
5. Wait for deployment to complete (2-3 minutes)

## Verification
After redeployment:
1. Visit your live site: `https://your-project.vercel.app/weather`
2. Weather page should now show live data instead of error
3. Try searching for different cities

## All Required Environment Variables
Make sure you have all four variables in Vercel:

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dxqdpipsnzitppwwcuso.supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Secret |
| `WEATHER_API_KEY` | `2a3d17feb93d41b7a66140016252112` | Secret |

## Quick Test
After fixing, test the API directly:
```
https://your-project.vercel.app/api/weather?city=lagos
```

Should return JSON with live weather data instead of error.

---

**This should fix the weather API on Vercel within 5 minutes!** 🌤️