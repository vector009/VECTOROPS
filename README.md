# VectorOps Frontend

Production frontend for VectorOps, connected directly to the existing
Supabase project (`wweofjskhgkjpbnputlg`). Built with React + Vite +
TypeScript + Tailwind, deployable to Cloudflare Pages.

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS (hand-rolled design system, no external UI kit dependency)
- React Router v6
- TanStack Query for server-state caching
- `@supabase/supabase-js` with types generated from the live schema

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the two values below
npm run dev
```

Required environment variables (`.env.local`, never committed):

```
VITE_SUPABASE_URL=https://wweofjskhgkjpbnputlg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your anon/publishable key>
```

Get the anon/publishable key from Supabase Dashboard → Project Settings →
API. **Never** put the `service_role` key here — this app only ever uses
the public anon key, and all access control is enforced by Postgres Row
Level Security (RLS) plus `SECURITY DEFINER` RPC functions on the backend.

```bash
npm run build      # type-checks and builds to dist/
npm run preview    # serve the production build locally
```

No local Supabase instance is required — this app talks to your real,
remote Supabase project.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Pages, create a project from that GitHub repo.
3. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Environment variables (Cloudflare Pages → Settings → Environment variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Deploy. `public/_redirects` already contains the SPA fallback
   (`/* /index.html 200`) so client-side routes like `/admin` or
   `/client/acme/billing` won't 404 on direct navigation or refresh.

## Architecture notes

- **Auth**: `src/auth/AuthProvider.tsx` treats the Supabase session as the
  only source of truth. Role and `client_id` are always re-fetched from
  `public.profiles` after login — never trusted from the URL, local
  storage, or React state.
- **Route guards** (`src/auth/guards.tsx`) control *what renders*, not
  *what data is visible*. The actual security boundary is Postgres RLS —
  guards are UX, not the defense.
- **Types** (`src/lib/database.types.ts`) are generated from the live
  schema of project `wweofjskhgkjpbnputlg`, including every enum and RPC
  function signature. Regenerate any time the schema changes:
  ```bash
  supabase gen types typescript --project-id wweofjskhgkjpbnputlg > src/lib/database.types.ts
  ```
- **Data access** lives entirely in `src/services/*.ts`, wrapped by
  TanStack Query hooks in `src/hooks/useSupabaseQuery.ts`. Components never
  call `supabase.from(...)` directly.
- **Automation control** never calls n8n from the browser. The client
  portal calls `request_automation_control` (a `SECURITY DEFINER` RPC),
  which only sets a desired state; a trusted backend process reconciles it
  and calls `apply_automation_control_result`. The UI shows "Syncing…"
  until `actual_state` changes — it never claims success optimistically.
- **Admin-only RPCs** (`link_client_profile`, `churn_client`,
  `mark_payment_received`, `apply_billing_adjustment`, etc.) are only
  wired into admin pages, which sit behind `RequireAdmin`.
- **Multi-tenant isolation**: every client-side query that filters by
  `client_id` uses `profile.client_id` from the authenticated session,
  never a value read from the URL slug or component props.

## What's scaffolded vs. fully built

This ships as a real, working app: authentication, role-aware routing, the
full data layer against your actual schema, and working pages for every
top-level section in both the admin and client portals (Overview, Clients,
Automations, Money, Calendar, Tasks, Support, Infrastructure, Activity,
Audit for admin; Overview, Automations, Results, Billing, Support, Profile
for clients).

Deeper admin workflows referenced in the original brief — the full client
onboarding wizard, discovered-workflow mapping UI, billing adjustment
forms, command palette, and portal branding/theme editor — are intentionally
left as extension points on top of this foundation rather than stubbed
with fake data, so the next build pass can add them against the same
services/hooks layer without touching auth or data access.

## Security checklist (frontend)

- No `service_role`, n8n API keys, or Vault secret refs anywhere in this
  repo or its environment variables.
- No direct browser → n8n calls.
- No tenant ID trusted from URL/localStorage — always session → profile →
  `client_id`.
- No raw database errors surfaced to the UI.
