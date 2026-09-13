import { requireAdmin } from "@/lib/auth";
import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
import { TodayActions } from "@/components/admin/TodayActions";

export const dynamic = "force-dynamic";

export default async function AdminSection({params,searchParams}:{params:Promise<{section:string}>;searchParams?:Promise<{q?:string;page?:string}>}){
  const {section}=await params;
  const sp=await searchParams;
  await requireAdmin();
  return <>{section==="overview"&&<div className="mb-5"><TodayActions/></div>}<AdminWorkspace section={section} q={String(sp?.q||"").trim().toLowerCase()} page={Math.max(Number(sp?.page||1),1)}/></>;
}
