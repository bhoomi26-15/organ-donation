# Google OAuth Setup Guide

## What You're Seeing

You have **two different environments**:
1. **Production** (`https://organ-donation-rosy.vercel.app`) - Deployed on Vercel
2. **Local Development** (`http://localhost:3000`) - Running on your machine

Both need to be separately configured for Google OAuth to work properly.

---

## Step 1: Get Your Google OAuth Credentials

### Create a Google Cloud Project (if not already done)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called "LifeLink"
3. Enable the **Google+ API**
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Choose **Web application**
6. Add Authorized Redirect URIs:
   - `http://localhost:3000` (local development)
   - `https://organ-donation-rosy.vercel.app` (production)
   - `http://localhost:3000/role-selection` (local - OAuth callback)
   - `https://organ-donation-rosy.vercel.app/role-selection` (production - OAuth callback)

7. Copy your **Client ID** (you'll need it for Supabase)

---

## Step 2: Configure Supabase for Google OAuth

### In Your Supabase Project:

1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Paste your **Google Client ID** (from Step 1)
4. Set Authorized Redirect URLs in Supabase:
   ```
   http://localhost:3000/role-selection
   https://organ-donation-rosy.vercel.app/role-selection
   ```

5. Add these URLs in **Google Cloud Console** → **Credentials** → Your OAuth app:
   - `https://ucslkuqshvoshwanjvfm.supabase.co/auth/v1/callback`

---

## Step 3: Verify Environment Variables

### `.env.local` (Local Development)
```
VITE_SUPABASE_URL=https://ucslkuqshvoshwanjvfm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=http://localhost:3000
```

### `.env.production.local` (Production on Vercel)
```
VITE_SUPABASE_URL=https://ucslkuqshvoshwanjvfm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=https://organ-donation-rosy.vercel.app
```

---

## Step 4: Test OAuth Locally

1. **Stop** your dev server: `Ctrl+C`
2. **Restart** dev server: `npm run dev`
3. Click **"Sign up with Google"** button
4. Verify you're redirected to `/role-selection` after signing in

### Expected Flow:
```
Click Google Button → Google Login Page → 
Redirects to http://localhost:3000/role-selection → 
Role Selection Page (Donor/Recipient/Hospital)
```

---

## Step 5: Deploy to Production

When you push to production (Vercel):

1. **Vercel automatically uses** `.env.production.local` values
2. Google OAuth redirects to: `https://organ-donation-rosy.vercel.app/role-selection`
3. User lands on the role selection page ✅

---

## Troubleshooting

### Issue: OAuth redirects to blank page
- ❌ Redirect URL not registered in Google Console or Supabase
- ✅ Add the URL to **both** Google Cloud Console AND Supabase

### Issue: Getting "redirect_uri_mismatch" error
- ❌ The URL in the browser doesn't match what you registered
- ✅ Check for `http://` vs `https://` and trailing slashes

### Issue: Local login works, but production doesn't
- ❌ `.env.production.local` not configured correctly
- ✅ Verify `VITE_APP_URL` is set to your production domain

### Issue: Hash routing (#) appears in URL
- ℹ️ This is normal with Vite. Your app uses BrowserRouter which handles it correctly

---

## Quick Reference

| Environment | URL | Redirect URL | Config File |
|---|---|---|---|
| Local Dev | `http://localhost:3000` | `http://localhost:3000/role-selection` | `.env.local` |
| Production | `https://org-donation-rosy.vercel.app` | `https://org-donation-rosy.vercel.app/role-selection` | `.env.production.local` |

---

## Need Help?

✅ Both environments now use **environment-aware OAuth URLs**
✅ App automatically uses the correct redirect URL based on where it's running
✅ No more "website inside website" issues!
