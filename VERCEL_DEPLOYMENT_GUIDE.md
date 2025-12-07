# Vercel Deployment Guide for Diasporan

## Overview
This guide will walk you through deploying your Diasporan application to Vercel in simple steps.

---

## Prerequisites

✅ You have:
- A GitHub account
- A Vercel account (free at vercel.com)
- Your code pushed to GitHub
- Supabase project with credentials

---

## Step 1: Prepare Your Repository

### 1.1 Add Vercel Config Files (Already Done ✓)
The following files have been created:
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `.env.example` - Environment variables template

### 1.2 Push to GitHub
```powershell
# Navigate to your project directory
cd "c:\Users\hp\detty connect"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Prepare for Vercel deployment"

# Add remote origin (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/DIASPORAN.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Create Vercel Project

### 2.1 Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click "New Project"
3. Select "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 2.2 Import Your Repository
1. Search for "DIASPORAN" repository
2. Click "Import"
3. Vercel will automatically detect it's a Next.js project

---

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables to Vercel
In the Vercel deployment settings:

1. Under "Environment Variables", add:

**Variable Name:** `NEXT_PUBLIC_SUPABASE_URL`
**Value:** Your Supabase URL (from `.env.local`)
```
https://gdbdtpsfuftmcpvczyra.supabase.co
```

**Variable Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Value:** Your Supabase anon key (from `.env.local`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkYmR0cHNmdWZ0bWNwdmN6eXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzUxMzUsImV4cCI6MjA3OTgxMTEzNX0.jSopu5M3IOEwd7y2Ux6cZyCob8tOr6d-P4iG-rMjNpw
```

**Variable Name:** `SUPABASE_SERVICE_ROLE_KEY`
**Value:** Your Supabase service role key (from `.env.local`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkYmR0cHNmdWZ0bWNwdmN6eXJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDIzNTEzNSwiZXhwIjoyMDc5ODExMTM1fQ.2nEhSqYZh_BcaLpgbLs9t94bkEqlfwtTm52DO0e2dhw
```

### 3.2 Set Environment for Production
- Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is available in the browser (it's public)
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is only available server-side (marked as sensitive)

In Vercel:
1. Click the variable
2. Choose which environments: Production, Preview, Development
3. Save

---

## Step 4: Deploy

### 4.1 Trigger Deployment
1. Click "Deploy"
2. Wait for the build to complete (usually 2-5 minutes)
3. Vercel will automatically:
   - Install dependencies
   - Run `npm run build`
   - Deploy to a live URL

### 4.2 Monitor Build
Watch the build logs for any issues. Common issues:

**TypeScript Errors:**
```
Failed to compile
```
Solution: Check that all `.ts` and `.tsx` files are valid

**Missing Dependencies:**
```
Cannot find module
```
Solution: Make sure `package.json` has all required packages

**Environment Variables:**
```
ReferenceError: process.env.VARIABLE is undefined
```
Solution: Add the variable in Vercel settings

---

## Step 5: Post-Deployment Checks

After deployment succeeds:

1. **Visit Your Live Site**
   - Vercel gives you a URL like: `https://diasporan.vercel.app`
   - Click the "Visit" button

2. **Test Core Features**
   - [ ] Homepage loads with no errors
   - [ ] Navigation works
   - [ ] Can access all pages (flights, stays, dining, etc.)
   - [ ] Authentication works (signup/login)
   - [ ] Can make bookings
   - [ ] Dark/light theme toggle works
   - [ ] Responsive design works on mobile

3. **Check Console for Errors**
   - Press `F12` in browser
   - Go to "Console" tab
   - Look for red error messages
   - Fix any issues found

---

## Step 6: Custom Domain (Optional)

To use your own domain:

1. In Vercel project settings → Domains
2. Add your domain
3. Follow DNS configuration steps
4. Point your domain registrar to Vercel

---

## Troubleshooting

### Build Fails with "Command failed"

**Check:**
- All TypeScript types are correct
- All imports resolve correctly
- No missing environment variables

**Fix:**
```bash
# Run build locally to reproduce
npm run build

# Check for errors
npm run lint
```

### Site Works Locally but Not on Vercel

**Common Causes:**
1. Missing environment variables
   - Go to Vercel Settings → Environment Variables
   - Verify all three variables are set

2. Environment-specific code
   - Make sure `NEXT_PUBLIC_*` variables are actually public
   - Use `typeof window` for browser-only code

3. API route issues
   - Check that API routes use correct paths
   - Verify Supabase connection in production

### Can't Connect to Supabase

**Check:**
1. Supabase URL is correct
2. Anon key is correct (allow list in Supabase)
3. CORS is configured in Supabase
4. Network requests in browser console

---

## Using Vercel CLI (Alternative Method)

If you prefer command-line deployment:

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd "c:\Users\hp\detty connect"
vercel

# For production deployment
vercel --prod
```

---

## Environment Setup in Vercel

Your three environment variables should be configured as:

| Variable | Type | Environment | Source |
|----------|------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Production, Preview, Development | Your Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Production, Preview, Development | Your Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Production, Preview, Development | Your Supabase project (keep private) |

---

## After Deployment

1. **Monitor Your Site**
   - Vercel dashboard shows analytics
   - Check serverless function duration
   - Monitor error rates

2. **CI/CD Pipeline**
   - Every push to `main` branch deploys automatically
   - Preview deployments for pull requests
   - Rollback previous versions if needed

3. **Update Supabase Settings (If Needed)**
   - Add Vercel production URL to allowed origins
   - In Supabase: Authentication → URL Configuration
   - Add: `https://your-site.vercel.app`

---

## Useful Vercel Commands

```powershell
# See deployment logs
vercel logs

# See build logs
vercel logs --follow

# Redeploy specific version
vercel deploy --prebuilt

# View project settings
vercel env list
```

---

## Common Success Indicators

✅ Green checkmark on Vercel dashboard
✅ "Ready" status under Deployments
✅ No errors in browser console
✅ All pages load correctly
✅ API calls work (check Network tab)
✅ Real-time features work (Supabase subscriptions)
✅ Theme toggle works
✅ Authentication endpoints respond

---

## Need More Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Integration: https://vercel.com/docs/integrations/supabase
- GitHub Issues: Report problems in your repository

---

**Your app is ready to deploy! Follow these steps and you'll be live on the internet within minutes.** 🚀
