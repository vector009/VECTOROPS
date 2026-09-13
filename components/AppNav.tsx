import Link from "next/link";
import { ChevronRight, Circle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppNav({ items, current, mobile=false }: { items: Array<{href:string,label:string,icon:LucideIcon}>; current?:string; mobile?:boolean }) {
  return <nav className={cn(mobile ? "grid grid-cols-3 gap-1.5" : "space-y-1")}>{items.map(item => { const Icon=item.icon; const active=current===item.href || (!mobile && current?.startsWith(item.href+"/")); return <Link key={item.href} href={item.href} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition", active ? "bg-white/[.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.04)]" : "text-slate-400 hover:bg-white/[.04] hover:text-slate-200", mobile && "justify-center flex-col gap-1 text-[10px] px-2 py-2")}>{active ? <Circle size={7} fill="currentColor" className="text-white"/> : <Icon size={16}/>}<span>{item.label}</span>{!mobile && active && <ChevronRight size={14} className="ml-auto text-slate-500"/>}</Link>})}</nav>;
}
