# 🌿 Fragrance-Free Home Finder — Deployment Guide

## What you need before starting
- A Google account (Gmail works)
- Your two Google API credentials:
  - **GOOGLE_API_KEY** (looks like: AIzaSy...)
  - **GOOGLE_SEARCH_ENGINE_ID** (looks like: a1b2c3d4...)

---

## Step 1 — Upload to Vercel

1. Go to **vercel.com** and sign in with your Google account
2. Click **"Add New Project"**
3. Click **"Upload"** (you don't need GitHub)
4. Drag this entire `fragrance-free-homes` folder onto the upload area
5. Click **Deploy** — Vercel will build it automatically

---

## Step 2 — Add your secret API keys

This is what keeps your keys hidden from users:

1. In Vercel, go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add the first variable:
   - Name: `GOOGLE_API_KEY`
   - Value: (paste your API key)
   - Click **Save**
4. Add the second variable:
   - Name: `GOOGLE_SEARCH_ENGINE_ID`
   - Value: (paste your Search Engine ID)
   - Click **Save**
5. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy**

---

## Step 3 — Your app is live! 🎉

Vercel gives you a free URL like:
`https://fragrance-free-home-finder.vercel.app`

You can share this with anyone. Users just visit the link and search —
no sign-up, no API keys, nothing technical required on their end.

---

## Optional — Custom domain name

Want a URL like `fragrancefreehomes.com`?
1. Buy a domain at **namecheap.com** (~$10–15/year)
2. In Vercel → Settings → Domains → add your domain
3. Follow the simple DNS instructions Vercel shows you

---

## Search limits

- Google Custom Search API: **100 free searches per day**
- After 100/day: $5 per 1,000 searches (very cheap)
- Monitor usage at: console.cloud.google.com

---

## Need help?

If anything goes wrong, the most common fix is:
- Make sure both environment variables are spelled exactly as shown
- Redeploy after adding environment variables

