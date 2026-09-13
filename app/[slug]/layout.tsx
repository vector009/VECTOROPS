import { requireClientSlug } from "@/lib/auth";
import { clientNav } from "@/lib/navigation";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";
export default async function ClientLayout({ children, params }:{children:React.ReactNode; params:Promise<{slug:string}>}){ const {slug}=await params; const ctx=await requireClientSlug(slug); return <AppShell nav={clientNav(slug, ctx.portal.enabled_modules)} current={`/${slug}`} title={ctx.portal.portal_title} subtitle={ctx.client.company_name} identity="CLIENT" mobileNav>{children}</AppShell> }
