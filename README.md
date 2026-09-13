# VectorOps — Next.js

VectorOps is a multi-tenant AI automation agency operating system. This repository is a **fresh Next.js App Router application** and intentionally does not migrate the previous Vite frontend.

## Stack

- Next.js 16 (App Router)
- React 19 / TypeScript
- Tailwind CSS v4
- Supabase + `@supabase/ssr`
- Lucide icons
- PWA manifest + service worker

## Supabase connection

The application is wired to the existing VectorOps Supabase project. It uses the public project URL and publishable key in the browser/server SSR client, while privileged Auth Admin operations use a server-only secret.

Create `.env.local` from `.env.example` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_AUTH_EMAIL`

Never commit `.env*`, service-role/secret keys, n8n credentials, client passwords, or private tokens.

## Password-only access

The visible login form contains only a password. The trusted server resolves the internal Supabase Auth identity, performs the real password verification, and then verifies the actual `profiles.role`. Client access also verifies the profile's `client_id` against the requested portal slug and allowed client status.

Client onboarding can provision a real Supabase Auth account through the trusted server. Passwords are never stored in VectorOps application tables, URLs, browser storage, logs, or source control.

## Data and security rules

The existing Supabase database is the source of truth. No local mock database is used. RLS remains the final tenant boundary. Server actions use existing tables/RPCs only; privileged n8n APIs are never called from the browser, and no browser-visible n8n secret is used.

Automation controls preserve desired state versus actual state and display synchronization/error states until backend confirmation exists. Missing telemetry/control services are represented as setup or unavailable states rather than fake success.

## Operational areas

Admin: overview, attention, clients, onboarding, portal configuration, automations, workflow detail, money, partial payments, billing adjustments, calendar, tasks, support, infrastructure, activity, audit, settings.

Client: business-specific overview, automations, results/reports, billing/payment history, support, profile, configured modules.

## Development and release checks

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```

Node.js 20.9+ is required. The current execution environment could not complete npm package download, so dependency-backed typecheck/lint/build must be run in a networked CI/development environment before production release. The codebase is structured for those checks and the repository intentionally does not claim them as passed without execution.
