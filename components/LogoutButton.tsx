"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/"); router.refresh(); }
  return <button onClick={logout} aria-label="Sign out" className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.03] px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[.06]"><LogOut size={15}/> Sign out</button>;
}
