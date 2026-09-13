import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatDateTime } from "@/lib/utils";
import { addAdminTicketMessage, updateSupportTicket } from "@/lib/actions";

export default async function AdminTicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; await requireAdmin(); const s = await createClient();
  const [{data:ticket},{data:messages}] = await Promise.all([
    s.from("support_tickets").select("id,ticket_number,client_id,subject,status,priority,category,assigned_to_user_id,created_at,updated_at,resolved_at").eq("id",id).maybeSingle(),
    s.from("support_ticket_messages").select("id,sender_user_id,message,internal,created_at").eq("ticket_id",id).order("created_at",{ascending:true}).limit(200),
  ]); if (!ticket) notFound();
  async function reply(formData: FormData) { "use server"; await addAdminTicketMessage(id, String(formData.get("message")||""), false); }
  async function note(formData: FormData) { "use server"; await addAdminTicketMessage(id, String(formData.get("message")||""), true); }
  async function pendingClient() { "use server"; await updateSupportTicket({ticketId:id,status:"pending_client"}); }
  async function pendingAdmin() { "use server"; await updateSupportTicket({ticketId:id,status:"pending_admin"}); }
  async function resolve() { "use server"; await updateSupportTicket({ticketId:id,status:"resolved"}); }
  return <>
    <PageHeader eyebrow="Support ticket" title={ticket.subject} description={`${ticket.ticket_number} · client ${ticket.client_id}`} action={<Link href="/admin/support" className="rounded-xl border border-white/8 px-4 py-2.5 text-sm text-slate-300">Back to support</Link>} />
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="vx-surface rounded-2xl p-5"><div className="mb-4 flex flex-wrap items-center gap-2"><StatusBadge value={ticket.priority}/><StatusBadge value={ticket.status}/><span className="text-xs text-slate-500">{ticket.category||"uncategorized"} · {formatDateTime(ticket.created_at)}</span></div>{messages?.length?<div className="divide-y divide-white/6">{messages.map((m:any)=><div key={m.id} className={`py-4 ${m.internal?"bg-amber-400/[.025] px-3":""}`}><div className="flex items-center justify-between gap-3 text-xs text-slate-500"><span>{m.internal?"Internal note":"Client-visible message"}</span><span>{formatDateTime(m.created_at)}</span></div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{m.message}</p></div>)}</div>:<EmptyState title="No messages" description="This ticket has no recorded messages."/>}</section>
      <aside className="space-y-3"><section className="vx-surface rounded-2xl p-4"><div className="vx-kicker">Respond</div><form action={reply} className="mt-3 space-y-2"><textarea name="message" required rows={5} className="w-full rounded-xl border border-white/8 bg-black/20 p-3 text-sm" placeholder="Reply to the client"/><button className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950">Send reply</button></form></section><section className="vx-surface rounded-2xl p-4"><div className="vx-kicker">Internal note</div><form action={note} className="mt-3 space-y-2"><textarea name="message" required rows={4} className="w-full rounded-xl border border-white/8 bg-black/20 p-3 text-sm" placeholder="Only agency staff can see this"/><button className="w-full rounded-xl border border-amber-400/15 px-4 py-3 text-sm font-semibold text-amber-100">Add note</button></form></section><section className="vx-surface rounded-2xl p-4"><div className="vx-kicker">Status</div><div className="mt-3 grid gap-2"><form action={pendingClient}><button className="w-full rounded-xl border border-white/8 px-3 py-2 text-xs">Waiting on client</button></form><form action={pendingAdmin}><button className="w-full rounded-xl border border-white/8 px-3 py-2 text-xs">Waiting on admin</button></form><form action={resolve}><button className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-950">Resolve ticket</button></form></div></section></aside>
    </div>
  </>;
}
