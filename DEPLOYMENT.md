# Deployment Guide

## Netlify Deployment

### 1. Connect GitHub Repository
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your `cafe-buzzer-app` repository

### 2. Build Settings
Netlify should auto-detect these settings from `netlify.toml`:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18

### 3. Environment Variables
In Netlify dashboard, go to Site settings → Environment variables and add:

```
VITE_SUPABASE_URL=https://qbczhoqekmpbfbakqgyj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Get Your Supabase Anon Key
1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Select your project: "Buzzer App Project"
3. Go to Settings → API
4. Copy the "anon" "public" key (not the service_role key!)

### 5. Deploy
Once configured, Netlify will automatically deploy when you push to GitHub.

## Local Development

1. Create `.env.local` file with your Supabase credentials:
```
VITE_SUPABASE_URL=https://qbczhoqekmpbfbakqgyj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Install dependencies and run:
```bash
npm install
npm run dev
```

## Features
- ✅ GitHub repository set up
- ✅ Netlify configuration ready
- ✅ SPA routing configured
- ✅ Security headers included
- ✅ Static asset caching optimized
