import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { OnboardingWizard } from "@/components/OnboardingWizard";

export const dynamic = "force-dynamic";

export default async function NewClient(){await requireAdmin();const s=await createClient();const[{data:instances},{data:templates}]=await Promise.all([s.from("n8n_instances").select("id,instance_name,hosting_type,status").order("instance_name").limit(200),s.from("automation_templates").select("id,template_key,name,category,description,active").eq("active",true).order("name").limit(200)]);return <><PageHeader eyebrow="Clients" title="Add client" description="Nine-step guided onboarding using the live VectorOps backend." action={<Link href="/admin/clients" className="rounded-xl border border-white/8 px-4 py-2.5 text-sm text-slate-300">Back</Link>}/><OnboardingWizard instances={instances||[]} templates={templates||[]}/></>}
