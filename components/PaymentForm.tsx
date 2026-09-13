"use client";
import { useState } from "react";
import { recordPayment } from "@/lib/actions";

export function PaymentForm({ invoiceId, remaining }: { invoiceId: string; remaining: number }) {
  const [amount, setAmount] = useState(remaining > 0 ? String(remaining) : "");
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(null); try { await recordPayment({ invoiceId, amount: Number(amount), method, reference }); window.location.reload(); } catch (err) { setError(err instanceof Error ? err.message : "Payment could not be recorded."); } finally { setBusy(false); } }
  if (remaining <= 0) return <span className="text-xs text-emerald-300">Paid</span>;
  return <form onSubmit={submit} className="mt-2 grid gap-2 rounded-xl border border-white/6 bg-black/15 p-3 sm:grid-cols-4">
    <input required min="0.01" max={remaining.toFixed(2)} step="0.01" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-xs" aria-label="Payment amount" />
    <select value={method} onChange={e=>setMethod(e.target.value)} className="rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-xs"><option value="bank_transfer">Bank transfer</option><option value="upi">UPI</option><option value="cash">Cash</option><option value="card">Card</option><option value="other">Other</option></select>
    <input value={reference} onChange={e=>setReference(e.target.value)} placeholder="Reference" className="rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-xs" aria-label="Payment reference" />
    <button disabled={busy} className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-950">{busy?"Saving…":"Record payment"}</button>
    {error && <div role="alert" className="sm:col-span-4 text-xs text-red-300">{error}</div>}
  </form>;
}
