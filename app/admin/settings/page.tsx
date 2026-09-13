import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";

export default async function AdminSettingsPage() {
  const { user, profile } = await requireAdmin();
  return <>
    <PageHeader eyebrow="Admin Command Center" title="Settings" description="Operational configuration and security posture. Secrets are never displayed here." />
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="vx-surface rounded-2xl p-5"><div className="vx-kicker">Authenticated identity</div><div className="mt-4 space-y-3 text-sm"><Row label="Profile role" value={profile.role}/><Row label="User id" value={user.id}/><Row label="Name" value={profile.full_name || "—"}/></div></section>
      <section className="vx-surface rounded-2xl p-5"><div className="vx-kicker">Supabase connection</div><div className="mt-4 space-y-3 text-sm"><Row label="Project" value="wweofjskhgkjpbnputlg"/><Row label="Public URL" value={process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"}/><Row label="Publishable key" value={process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "Configured" : "Missing"}/><Row label="Trusted server credential" value={process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY ? "Configured" : "Missing"}/></div><p className="mt-4 text-xs leading-5 text-slate-500">The trusted credential is server-only. It is never sent to the browser.</p></section>
      <section className="vx-surface rounded-2xl p-5 lg:col-span-2"><div className="vx-kicker">Control plane state</div><p className="mt-3 text-sm leading-6 text-slate-400">Automation controls write desired state through the existing Supabase RPC and wait for the stored actual state to change. There is no direct browser-to-n8n privileged connection.</p></section>
    </div>
  </>;
}
function Row({label,value}:{label:string;value:string}){return <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 last:border-0"><span className="text-slate-500">{label}</span><span className="max-w-[65%] break-all text-right font-medium text-slate-200">{value}</span></div>}
