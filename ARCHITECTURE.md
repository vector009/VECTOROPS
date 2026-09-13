# VectorOps architecture

## One application
One Next.js App Router codebase, one Supabase project, many client tenants. Client portals are configured with the existing `client_portal_config` model and resolved by slug plus authenticated profile ownership.

## Security boundaries
1. Browser uses only the Supabase publishable key.
2. Server components/actions use the cookie-bound Supabase SSR client for normal RLS-scoped operations.
3. Password-only identity resolution and Auth user provisioning use a server-only Supabase admin client.
4. Client access requires authenticated identity + `profiles.client_id` + requested portal slug + an allowed account state.
5. RLS remains the ultimate tenant security boundary.
6. n8n secrets never enter browser code; no missing control endpoint is invented.

## Three planes
- Business: clients, billing, support, tasks, calendar, portals, results, reporting, audit.
- Control: desired/actual state, automation controls, synchronization and n8n relationship metadata.
- Execution: n8n performs workflow execution; VectorOps presents verified business and control state.

## Data integrity
The frontend consumes the existing VectorOps tables/RPCs and does not create a parallel schema. Unknown or unsupported backend capabilities render explicit setup/empty states rather than simulated success or fabricated metrics.
