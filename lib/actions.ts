"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function requestAutomationControl(workflowId:string, desiredState:"running"|"paused"|"disabled") {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("request_automation_control", { p_workflow_id: workflowId, p_desired_state: desiredState, p_reason: "Requested from VectorOps" });
  if (error) throw new Error("Automation control could not be requested.");
  revalidatePath("/admin/automations");
  return data;
}

export async function applyBillingAdjustment(args:{clientId:string; adjustmentType:"free_days"|"discount"|"credit"|"goodwill_extension"|"pause"|"renewal_date_change"; amountDelta:number; daysDelta:number; subscriptionId?:string|null; invoiceId?:string|null; description?:string}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("apply_billing_adjustment", { p_client_id:args.clientId,p_adjustment_type:args.adjustmentType,p_amount_delta:args.amountDelta,p_days_delta:args.daysDelta,p_subscription_id:args.subscriptionId||null,p_invoice_id:args.invoiceId||null,p_description:args.description||null });
  if(error) throw new Error("Billing adjustment could not be applied.");
  revalidatePath("/admin/money");
  return data;
}

export async function addClientTicketMessage(ticketId:string, message:string) {
  const supabase = await createClient();
  const { data,error } = await supabase.rpc("add_client_ticket_message", { p_ticket_id:ticketId, p_message:message });
  if(error) throw new Error("Message could not be sent.");
  revalidatePath("/admin/support");
  return data;
}

export async function createClientOnboarding(formData: FormData) {
  const { profile } = await (await import("@/lib/auth")).requireAdmin();
  const supabase = await createClient();
  const companyName = String(formData.get("company_name") || "").trim();
  const contactName = String(formData.get("contact_name") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const portalTitle = String(formData.get("portal_title") || "Client Portal").trim();
  const primaryColor = String(formData.get("primary_color") || "#111827").trim();
  const accentColor = String(formData.get("accent_color") || "#2563eb").trim();
  const serviceName = String(formData.get("service_name") || "").trim();
  const monthlyAmount = Number(formData.get("monthly_amount") || 0);
  const currency = String(formData.get("currency") || "INR").trim().toUpperCase();
  const billingDay = Number(formData.get("billing_day") || 1);
  const instanceId = String(formData.get("n8n_instance_id") || "").trim() || null;
  const clientPassword = String(formData.get("client_password") || "");

  if (!companyName || !/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug)) throw new Error("Enter a valid company and portal slug.");
  if (monthlyAmount < 0 || billingDay < 1 || billingDay > 28) throw new Error("Commercial details are invalid.");

  const { data: client, error: clientError } = await supabase.from("clients").insert({ company_name:companyName, contact_name:contactName, email, phone, notes, status:"pending", created_by_user_id:profile.user_id }).select("id").single();
  if (clientError || !client) throw new Error("Client could not be created.");
  const clientId = client.id;

  const { error: portalError } = await supabase.from("client_portal_config").insert({ client_id:clientId, slug, portal_title:portalTitle, primary_color:primaryColor, accent_color:accentColor });
  if (portalError) throw new Error("Portal configuration could not be created.");
  await supabase.from("client_onboarding").insert({ client_id:clientId, identity_complete:true, portal_complete:true, commercial_complete:Boolean(serviceName), infrastructure_complete:Boolean(instanceId), automations_complete:false, n8n_complete:false, account_complete:false, verification_complete:false });

  if (serviceName) await supabase.from("subscriptions").insert({ client_id:clientId, service_name:serviceName, monthly_amount:monthlyAmount, currency, billing_day:billingDay, auto_renew:true, status:"pending" });
  if (instanceId) await supabase.from("client_connections").insert({ client_id:clientId, n8n_instance_id:instanceId, status:"pending", metadata:{ provisioning_source:"vectorops_admin" } });

  if (email && clientPassword) {
    const admin = (await import("@/lib/supabase/admin")).createAdminClient();
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({ email, password:clientPassword, email_confirm:true });
    if (authError || !authUser.user) throw new Error("Client account could not be provisioned.");
    const { error: linkError } = await admin.rpc("link_client_profile", { p_user_id:authUser.user.id, p_client_id:clientId });
    if (linkError) throw new Error("Client account was created but could not be linked.");
    await supabase.from("client_onboarding").update({ account_complete:true }).eq("client_id",clientId);
  }
  revalidatePath("/admin/clients");
  return { clientId, slug };
}
