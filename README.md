# Indiana Sewer & Drain LLC

Service-focused marketing site with high-conversion service request form, photo uploads, and immediate owner notifications (SMS + email).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. **Demo mode:** with no Twilio, Resend, or Supabase env vars, the form still completes and shows the success screen (notifications are skipped). Safe to deploy to Vercel for a visual demo and wire variables later.

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (lead links in SMS) |
| `LEAD_VIEW_SECRET` | Token for `/leads/[id]?token=...` owner view |
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Persist leads + photo URLs (optional locally) |
| Twilio + Resend | Same pattern as the B&G Construction reference project |

Apply `supabase/migrations/001_isd_service_leads.sql` to your Supabase project when enabling lead storage.

## Lead flow

1. Visitor submits the service request form (optional photos, optional SMS consent).
2. Lead is stored in `isd_service_leads` when Supabase is configured.
3. Owner receives email (with photo attachments) and SMS.
4. Customer receives confirmation SMS only when SMS consent is checked.

## Deploy

Import into Vercel, set environment variables, run the Supabase migration, and deploy. Client sites default to `noindex` per workspace policy until the owner asks to enable SEO.
