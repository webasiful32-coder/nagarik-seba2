# সহজ ডিজিটাল সেবা - Supabase + Vercel Version

## ✅ এই version এ যা আছে
- Real Supabase Authentication (ইমেইল + পাসওয়ার্ড)
- Secure database (Row Level Security)
- User profile table
- Production-ready code

---

## ধাপ ১: Supabase Database Setup

1. Supabase dashboard → **SQL Editor** যান
2. `supabase-setup.sql` ফাইলের সম্পূর্ণ SQL copy করুন
3. SQL Editor এ paste করে **Run** বাটন চাপুন
4. "Success" দেখলে সম্পন্ন

---

## ধাপ ২: Local এ Test করুন

```bash
npm install
npm run dev
```
→ http://localhost:3000

---

## ধাপ ৩: Vercel এ Deploy করুন

### Option A - GitHub দিয়ে (সবচেয়ে সহজ)

1. GitHub এ repo তৈরি করুন
2. এই ফোল্ডারের সব ফাইল push করুন
3. [vercel.com](https://vercel.com) → "New Project" → GitHub repo select করুন
4. **Environment Variables** যোগ করুন:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://rngsftxfbpazehhylyzr.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = আপনার anon key
5. Deploy বাটন চাপুন → ৩ মিনিটে site live!

### Option B - Vercel CLI দিয়ে

```bash
npm install -g vercel
vercel
# প্রশ্নগুলোর উত্তর দিন
```

---

## ⚠️ গুরুত্বপূর্ণ - Email Confirmation বন্ধ করুন

Supabase default এ email confirmation চালু থাকে।
ব্যবহারকারী যেন সাথে সাথে লগইন করতে পারে তার জন্য:

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Email** সেকশনে যান
3. **"Confirm email"** toggle OFF করুন
4. Save করুন

---

## ফাইল স্ট্রাকচার

```
digital-sheba-v2/
├── app/
│   ├── page.tsx              ← হোমপেজ
│   ├── layout.tsx
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx    ← Supabase login
│   │   └── register/page.tsx ← Supabase register
│   ├── dashboard/page.tsx    ← Protected dashboard
│   ├── services/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts           ← Supabase client
│   └── services.ts           ← Services data
├── supabase-setup.sql        ← Database tables
├── .env.local                ← API keys (local only)
└── package.json
```
