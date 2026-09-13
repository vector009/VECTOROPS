import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/types";

export async function getAuthContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };
  const { data: profile } = await supabase.from("profiles").select("user_id,role,client_id,full_name,phone").eq("user_id", user.id).maybeSingle();
  return { user, profile: (profile as Profile | null) };
}

export async function requireAdmin() {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/login/admin");
  if (ctx.profile?.role !== "admin") redirect("/unauthorized?kind=admin");
  return ctx as { user: NonNullable<typeof ctx.user>; profile: Profile };
}

export async function requireClientSlug(slug: string) {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect(`/login/client/${encodeURIComponent(slug)}`);
  if (ctx.profile?.role !== "client" || !ctx.profile.client_id) redirect("/unauthorized?kind=client");

  const admin = createAdminClient();
  const { data: portal } = await admin.from("client_portal_config").select("client_id,slug,portal_title,enabled_modules,primary_color,accent_color,logo_url,favicon_url,dashboard_config,kpi_config,terminology,client_settings_schema").eq("slug", slug).maybeSingle();
  if (!portal || portal.client_id !== ctx.profile.client_id) redirect("/unauthorized?kind=client");
  const { data: client } = await admin.from("clients").select("id,company_name,contact_name,email,phone,status,notes").eq("id", ctx.profile.client_id).maybeSingle();
  if (!client || !["active", "pending"].includes(client.status)) redirect("/unauthorized?kind=client");
  return { ...ctx, portal, client };
}
