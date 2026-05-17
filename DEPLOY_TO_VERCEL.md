# 🚀 Deploy Cerka to Vercel

## Prerequisites
- GitHub account with this repo pushed ✅
- Vercel account (free at vercel.com)

---

## Step 1: Connect to Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **"Add New Project"**
3. Find and select **`marketplace-cerka`** from your repos
4. Click **"Import"**

---

## Step 2: Configure Environment Variables

In the Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://kiwtbssgteuszyckttyq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your anon key) |
| `VITE_APP_NAME` | `Cerka` |
| `VITE_APP_URL` | `https://your-app.vercel.app` (update after first deploy) |

> ⚠️ **Never add `SUPABASE_SERVICE_ROLE_KEY` to Vercel** — that's only for local admin scripts.

---

## Step 3: Deploy Settings

Vercel should auto-detect these from `vercel.json`, but verify:

| Setting | Value |
|---------|-------|
| Framework Preset | **Vite** |
| Build Command | `vite build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Step 4: Deploy

Click **"Deploy"** — Vercel will:
1. Install dependencies
2. Run `vite build`
3. Deploy to a URL like `cerka-xyz.vercel.app`

Build takes ~30 seconds.

---

## Step 5: Update Supabase Auth Settings

After getting your Vercel URL, update Supabase to allow it:

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://cerka-xyz.vercel.app`
3. Add to **Redirect URLs**: `https://cerka-xyz.vercel.app/**`

---

## Step 6: Custom Domain (Optional)

To use `cerka.rw` or similar:

1. In Vercel project → **Settings → Domains**
2. Add your domain
3. Update DNS records as instructed by Vercel
4. Update `VITE_APP_URL` env var to your custom domain
5. Update Supabase Site URL to your custom domain

---

## Auto-Deploy on Push

Once connected, every `git push origin main` will automatically redeploy. No manual steps needed.

---

## Troubleshooting

### Build fails
- Check that all env vars are set in Vercel
- Run `npm run build` locally first to catch errors

### Blank page after deploy
- Check browser console for errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly

### Auth not working
- Make sure Supabase Site URL matches your Vercel URL exactly
- Check Redirect URLs include `/**` wildcard

### Images not loading
- Images use Supabase Storage CDN — should work everywhere
- Local images in `public/` folder are included in the build

---

## Current Build Stats

| Metric | Value |
|--------|-------|
| Build time | ~30 seconds |
| Main bundle | 372 KB (gzipped: 88 KB) |
| Total assets | ~1.2 MB |
| Pages | 40+ (lazy loaded) |
| Performance | Fast initial load, pages load on demand |
