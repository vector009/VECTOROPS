import { createClient } from "@/lib/supabase/server";

export async function adminOverview() {
  const supabase = await createClient();
  const [clients, subs, invoices, tickets, workflows, infra] = await Promise.all([
    supabase.from("clients").select("id,status,company_name,created_at").order("created_at", { ascending:false }).limit(100),
    supabase.from("subscriptions").select("id,status,monthly_amount,currency,client_id,current_period_end,service_name,auto_renew").limit(500),
    supabase.from("invoices").select("id,total_amount,amount_paid,status,due_date,client_id,invoice_number,issue_date").limit(500),
    supabase.from("support_tickets").select("id,status,priority,client_id,subject,created_at").neq("status","closed").limit(200),
    supabase.from("workflows").select("id,status,actual_state,desired_state,client_id,workflow_name,business_name,last_failure_at,last_error").limit(500),
    supabase.from("n8n_instances").select("id,instance_name,status,last_sync_status,last_sync_at,last_sync_error").limit(100),
  ]);
  const rows = (x:any) => x.data ?? [];
  const activeClients = rows(clients).filter((x:any)=>x.status==="active").length;
  const activeSubs = rows(subs).filter((x:any)=>x.status==="active");
  const mrr = activeSubs.reduce((s:number,x:any)=>s+Number(x.monthly_amount||0),0);
  const outstanding = rows(invoices).reduce((s:number,x:any)=>s+Math.max(Number(x.total_amount||0)-Number(x.amount_paid||0),0),0);
  const overdue = rows(invoices).filter((x:any)=>x.status==="overdue").reduce((s:number,x:any)=>s+Math.max(Number(x.total_amount||0)-Number(x.amount_paid||0),0),0);
  const failures = rows(workflows).filter((x:any)=>x.status==="error" || x.actual_state!==x.desired_state).length;
  const infraIssues = rows(infra).filter((x:any)=>["offline","maintenance","retired"].includes(x.status) || ["error","stale"].includes(x.last_sync_status)).length;
  return { activeClients, mrr, outstanding, overdue, openTickets: rows(tickets).length, workflowFailures: failures, infraIssues, clients:rows(clients), subscriptions:rows(subs), invoices:rows(invoices), tickets:rows(tickets), workflows:rows(workflows), infrastructure:rows(infra) };
}

export async function clientOverview(clientId:string) {
  const supabase = await createClient();
  const [workflows, events, reports, subscription, invoices, tickets] = await Promise.all([
    supabase.from("workflows").select("id,workflow_name,business_name,status,desired_state,actual_state,last_execution_at,last_success_at,last_failure_at,last_error,client_visible").eq("client_id",clientId).eq("client_visible",true).limit(100),
    supabase.from("business_events").select("id,event_type,event_value,currency,occurred_at,workflow_id,payload").eq("client_id",clientId).order("occurred_at",{ascending:false}).limit(200),
    supabase.from("client_reports").select("id,report_type,period_start,period_end,title,summary,metrics,insights,generated_at").eq("client_id",clientId).eq("visible_to_client",true).order("period_end",{ascending:false}).limit(20),
    supabase.from("subscriptions").select("id,service_name,monthly_amount,currency,billing_day,auto_renew,status,current_period_start,current_period_end,start_date").eq("client_id",clientId).order("created_at",{ascending:false}).limit(5),
    supabase.from("invoices").select("id,invoice_number,total_amount,amount_paid,status,due_date,issue_date,period_start,period_end,description").eq("client_id",clientId).order("issue_date",{ascending:false}).limit(50),
    supabase.from("support_tickets").select("id,ticket_number,subject,status,priority,category,created_at,updated_at").eq("client_id",clientId).order("updated_at",{ascending:false}).limit(20),
  ]);
  return { workflows:workflows.data||[], events:events.data||[], reports:reports.data||[], subscriptions:subscription.data||[], invoices:invoices.data||[], tickets:tickets.data||[] };
}
