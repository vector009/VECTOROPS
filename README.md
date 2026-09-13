# VectorOps — Next.js

VectorOps is a multi-tenant AI automation agency operating system. This repository is a **fresh Next.js App Router application** and intentionally does not migrate the previous Vite frontend.

## Stack
- Next.js 16 / App Router
- React 19 / TypeScript
- Tailwind CSS v4
- Supabase + `@supabase/ssr`
- Lucide icons
- PWA manifest + service worker

## Environment
Use `.env.local` with `.env.example`. Browser-safe variables are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Trusted-only variables are `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_SERVICE_ROLE_KEY`, plus `ADMIN_AUTH_EMAIL`.

## Security model
The visible login form contains only a password. The trusted server resolves the internal Supabase Auth identity, performs real password verification, then validates the actual profile role and (for clients) tenant relationship. Client passwords are never stored in VectorOps tables, URLs, browser storage, logs, or source code.

The browser never calls privileged n8n APIs and never receives raw n8n secrets. Automation controls use the existing VectorOps control RPC and keep desired state separate from actual state.

## Routes
Admin: `/admin`, `/admin/overview`, `/admin/clients`, `/admin/clients/new`, `/admin/automations`, `/admin/money`, `/admin/calendar`, `/admin/tasks`, `/admin/support`, `/admin/infrastructure`, `/admin/activity`, `/admin/audit`, `/admin/settings`, plus tenant detail routes.

Client: `/<slug>`, `/<slug>/automations`, `/<slug>/results`, `/<slug>/billing`, `/<slug>/support`, `/<slug>/profile`.

## Development
```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```

Node.js 20.9+ is required by current Next.js guidance. The current environment used for this conversion could not complete npm package download, so dependency-backed build/lint execution must be run in a networked CI/development environment before release.
