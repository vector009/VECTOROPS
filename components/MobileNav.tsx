"use client";
import Link from "next/link";
import type { Route } from "next";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export function MobileNav({items,current}:{items:Array<{href:string,label:string,icon:LucideIcon}>;current:string}){
  const [open,setOpen]=useState(false);
  return <>
    <button type="button" onClick={()=>setOpen(true)} className="grid size-9 place-items-center rounded-xl border border-white/8 bg-white/[.03] text-slate-300 lg:hidden" aria-label="Open navigation"><Menu size={18}/></button>
    {open && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation"><button className="absolute inset-0 bg-black/70" aria-label="Close navigation" onClick={()=>setOpen(false)}/><aside className="absolute left-0 top-0 h-full w-[min(86vw,340px)] border-r border-white/8 bg-[#0b0d10] p-4 shadow-2xl"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-lg bg-white text-xs font-black text-slate-950">V</div><span className="text-sm font-black tracking-[.18em]">VECTOROPS</span></div><button onClick={()=>setOpen(false)} className="grid size-9 place-items-center rounded-xl border border-white/8 text-slate-400" aria-label="Close navigation"><X size={17}/></button></div><nav className="mt-6 space-y-1">{items.map(item=>{const Icon=item.icon;const active=item.href===current;return <Link key={item.href} href={item.href as Route} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${active?"bg-white text-slate-950 font-semibold":"text-slate-300 hover:bg-white/[.04]"}`}><Icon size={16}/>{item.label}</Link>})}</nav></aside></div>}
  </>
}
