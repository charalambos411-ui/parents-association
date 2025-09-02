# Parents Association — Next.js Starter

## Quick start
1) Duplicate `.env.local` (already filled) and create `.env.server` with `SUPABASE_SERVICE_ROLE_KEY` (server-only). **Do not commit.**
2) `npm install`
3) `npm run dev` → http://localhost:3000

## Deploy (Vercel)
- Environment Variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (Server-side ONLY)

## First admin setup
- Run SQL in `sql/01_profile_trigger.sql` on Supabase (auto-create profiles).
- Create one tenant and copy its `id`.
- Sign in via Login (magic link).
- In `profiles`, set your row to `role='school_admin'` and the correct `tenant_id`.
