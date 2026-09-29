# Weddings by Beso

Luxury monochrome wedding photography platform.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Prisma + PostgreSQL · UltraMsg / Meta WhatsApp API

## Setup
1. `npm install`
2. `cp .env.example .env.local` and fill values
3. `npm run db:push && npm run db:seed`
4. `npm run dev` → http://localhost:3000

## Admin
Phone `201001234567` (from seed). Login at `/login`.

## WhatsApp
- OTP → UltraMsg (primary) / Meta Cloud API (fallback)
- Contact form → `wa.me/<WHATSAPP_ADMIN_NUMBER>` deep link + server log

## Deploy
Vercel + Supabase Postgres.
