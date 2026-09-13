import { createClient } from "@/lib/supabase/server";
import { buildAttentionItems } from "@/lib/attention";

const safe = (value: any[] | null | undefined) => value ?? [];

export async function adminOverview() {
  const s = await createClient();
  const [clients, subs, invoices, payments, tickets, workflows, infra, onboarding, credentials, balances] = await Promise.all([
    s.from("clients").select("id,status,company_name,created_at,updated_at").order("created_at", {ascending:false}).limit(200),
    s.from("subscriptions").select("id,status,monthly_amount,currency,client_id,current_period_end,service_name,auto_renew,start_date,current_period_start").limit(500),
    s.from("invoices").select("id,total_amount,amount_paid,status,due_date,client_id,invoice_number,issue_date,invoice_type,period_start,period_end").limit(1000),
    s.from("payments").select("id,client_id,invoice_id,amount,payment_date,status,method,reference").eq("status","received").order("payment_date",{ascending:false}).limit(2000),
    s.from("support_tickets").select("id,status,priority,client_id,subject,created_at,updated_at").neq("status","closed").limit(300),
    s.from("workflows").select("id,status,actual_state,desired_state,client_id,workflow_name,business_name,last_failure_at,last_error,updated_at,last_success_at").limit(1000),
    s.from("n8n_instances").select("id,instance_name,status,last_sync_status,last_sync_at,last_sync_error,last_verified_at,hosting_type").limit(200),
    s.from("client_onboarding").select("client_id,identity_complete,portal_complete,commercial_complete,infrastructure_complete,automations_complete,n8n_complete,account_complete,verification_complete").limit(300),
    s.from("credentials").select("id,client_id,provider_name,credential_name,expires_at,active").limit(500),
    s.from("provider_balances").select("id,provider_name,account_name,currency,balance,threshold,checked_at").limit(300),
  ]);
  const cs=safe(clients.data), ss=safe(subs.data), is=safe(invoices.data), ps=safe(payments.data), ts=safe(tickets.data), ws=safe(workflows.data), ns=safe(infra.data);
  const activeSubs=ss.filter(x=>x.status==="active");
  const outstanding=is.reduce((sum,x)=>sum+Math.max(Number(x.total_amount||0)-Number(x.amount_paid||0),0),0);
  const overdue=is.filter(x=>x.status==="overdue").reduce((sum,x)=>sum+Math.max(Number(x.total_amount||0)-Number(x.amount_paid||0),0),0);
  const collected=ps.reduce((sum,x)=>sum+Number(x.amount||0),0);
  const attention=buildAttentionItems({invoices:is,workflows:ws,infrastructure:ns,tickets:ts,onboarding:safe(onboarding.data),credentials:safe(credentials.data),balances:safe(balances.data)});
  return {payments:ps,activeClients:cs.filter(x=>x.status==="active").length,mrr:activeSubs.reduce((sum,x)=>sum+Number(x.monthly_amount||0),0),collected,outstanding,overdue,openTickets:ts.length,workflowFailures:ws.filter(x=>x.status==="error"||x.actual_state!==x.desired_state).length,infraIssues:ns.filter(x=>["offline","maintenance"].includes(x.status)||["error","stale"].includes(x.last_sync_status)).length,clients:cs,subscriptions:ss,invoices:is,tickets:ts,workflows:ws,infrastructure:ns,attention};
}

export async function clientOverview(clientId:string) {
  const s=await createClient();
  const [workflows,events,reports,subscriptions,invoices,payments,tickets,controls]=await Promise.all([
    s.from("workflows").select("id,workflow_name,business_name,business_job,status,desired_state,actual_state,last_execution_at,last_success_at,last_failure_at,last_error,client_visible,config").eq("client_id",clientId).eq("client_visible",true).limit(200),
    s.from("business_events").select("id,event_type,event_value,currency,occurred_at,workflow_id,payload").eq("client_id",clientId).order("occurred_at",{ascending:false}).limit(500),
    s.from("client_reports").select("id,report_type,period_start,period_end,title,summary,metrics,insights,generated_at").eq("client_id",clientId).eq("visible_to_client",true).order("period_end",{ascending:false}).limit(50),
    s.from("subscriptions").select("id,service_name,monthly_amount,currency,billing_day,auto_renew,status,current_period_start,current_period_end,start_date,metadata").eq("client_id",clientId).order("created_at",{ascending:false}).limit(10),
    s.from("invoices").select("id,invoice_number,total_amount,amount_paid,status,due_date,issue_date,period_start,period_end,description,invoice_type").eq("client_id",clientId).order("issue_date",{ascending:false}).limit(100),
    s.from("payments").select("id,invoice_id,amount,payment_date,method,reference,status,notes,created_at").eq("client_id",clientId).order("payment_date",{ascending:false}).limit(100),
    s.from("support_tickets").select("id,ticket_number,subject,status,priority,category,created_at,updated_at,resolved_at").eq("client_id",clientId).order("updated_at",{ascending:false}).limit(50),
    s.from("client_automation_controls").select("id,workflow_id,desired_state,actual_state,sync_status,requested_at,last_sync_at,last_control_error").eq("client_id",clientId).limit(200),
  ]);
  const ev=safe(events.data), wf=safe(workflows.data); const trackedCounts=ev.reduce((acc:Record<string,number>,e:any)=>{acc[e.event_type]=(acc[e.event_type]||0)+1;return acc;},{});
  const now=Date.now(), last30=ev.filter(e=>now-new Date(e.occurred_at).getTime()<=30*86400000), prev30=ev.filter(e=>now-new Date(e.occurred_at).getTime()>30*86400000&&now-new Date(e.occurred_at).getTime()<=60*86400000); const lastCount=last30.length, prevCount=prev30.length;
  const trend=prevCount===0?(lastCount>0?null:0):Math.round(((lastCount-prevCount)/prevCount)*100);
  const opportunities:Array<{label:string;detail:string;kind:string}>=[];
  if((trackedCounts.lead_captured||0)>0&&!trackedCounts.appointment_booked) opportunities.push({label:"Lead follow-up opportunity",detail:"Lead activity is recorded but no appointment-booked events are recorded yet.",kind:"Derived"});
  if(trend!==null&&trend<0) opportunities.push({label:"Business-event volume declined",detail:`Tracked business events are ${Math.abs(trend)}% lower than the previous 30-day window.`,kind:"Derived"});
  const failing=wf.filter(w=>w.status==="error"||w.actual_state!==w.desired_state).length; if(failing>0) opportunities.push({label:"Automation attention",detail:`${failing} client-visible automation record${failing===1?"":"s"} need review.`,kind:"Derived"});
  return {workflows:wf,events:ev,reports:safe(reports.data),subscriptions:safe(subscriptions.data),invoices:safe(invoices.data),payments:safe(payments.data),tickets:safe(tickets.data),controls:safe(controls.data),trackedCounts,trend,opportunities};
}

export async function discoveredWorkflowQueue(){
 const s=await createClient(); const [discovered,clients,connections,templates,instances]=await Promise.all([
  s.from("discovered_workflows").select("id,n8n_instance_id,n8n_workflow_id,discovered_name,n8n_active,status,mapped_workflow_id,first_seen_at,last_seen_at,payload").eq("status","unmapped").order("last_seen_at",{ascending:false}).limit(200),
  s.from("clients").select("id,company_name,status").in("status",["pending","active"]).order("company_name").limit(300),
  s.from("client_connections").select("id,client_id,n8n_instance_id,status").order("created_at",{ascending:false}).limit(500),
  s.from("automation_templates").select("id,template_key,name,category,description,default_client_visible,default_config,active").eq("active",true).order("name").limit(200),
  s.from("n8n_instances").select("id,instance_name,hosting_type,status").order("instance_name").limit(200),
 ]); return {discovered:safe(discovered.data),clients:safe(clients.data),connections:safe(connections.data),templates:safe(templates.data),instances:safe(instances.data)};
}
