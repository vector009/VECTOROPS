import { requireAdmin } from "@/lib/auth";
import { adminNav } from "@/lib/navigation";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children:React.ReactNode }) { const ctx=await requireAdmin(); return <AppShell nav={adminNav} current="/admin" title="Agency Command Center" subtitle={ctx.profile.full_name || "Administrator"} identity="ADMIN" mobileNav>{children}</AppShell> }
