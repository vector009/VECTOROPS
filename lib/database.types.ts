/**
 * Generated from the connected VectorOps Supabase project.
 * Keep this file in sync with `public` schema whenever the backend changes.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert = Row, Update = Partial<Row>> = { Row: Row; Insert: Insert; Update: Update; Relationships: never[] };

type Enums = {
  adjustment_type: "free_days" | "discount" | "credit" | "goodwill_extension" | "pause" | "renewal_date_change";
  app_role: "admin" | "client";
  automation_state: "unknown" | "running" | "paused" | "disabled";
  calendar_event_status: "scheduled" | "completed" | "cancelled";
  calendar_event_type: "meeting" | "call" | "onboarding" | "renewal" | "internal" | "other";
  client_status: "pending" | "active" | "paused" | "churned" | "archived";
  connection_status: "pending" | "connected" | "error" | "disabled";
  control_sync_status: "idle" | "pending" | "syncing" | "success" | "error";
  discovered_workflow_status: "unmapped" | "mapped" | "ignored";
  instance_hosting_type: "shared" | "dedicated";
  instance_status: "provisioning" | "active" | "maintenance" | "offline" | "retired";
  invoice_status: "draft" | "due" | "partially_paid" | "paid" | "void" | "overdue";
  invoice_type: "initial" | "renewal" | "adjustment";
  payment_status: "received" | "reversed" | "refunded";
  subscription_status: "pending" | "active" | "paused" | "cancelled" | "expired";
  sync_status: "idle" | "pending" | "syncing" | "success" | "error" | "stale";
  task_priority: "low" | "medium" | "high" | "urgent";
  task_status: "todo" | "in_progress" | "blocked" | "completed" | "cancelled";
  ticket_priority: "low" | "normal" | "high" | "urgent";
  ticket_status: "open" | "pending_client" | "pending_admin" | "resolved" | "closed";
  workflow_status: "draft" | "active" | "paused" | "disabled" | "error" | "archived";
};

export type Database = {
  public: {
    Tables: {
      audit_logs: Table<{id:string;actor_user_id:string|null;actor_role:string|null;client_id:string|null;action:string;table_name:string|null;record_id:string|null;old_data:Json|null;new_data:Json|null;metadata:Json;created_at:string}>;
      automation_logs: Table<{id:string;client_id:string;n8n_instance_id:string;workflow_id:string|null;source_execution_id:string;source_event_key:string;event_type:string;severity:string;occurred_at:string;success:boolean|null;duration_ms:number|null;error_code:string|null;error_message:string|null;client_visible:boolean;payload:Json;created_at:string}>;
      automation_templates: Table<{id:string;template_key:string;name:string;category:string|null;description:string|null;n8n_template_ref:string|null;default_client_visible:boolean;default_config:Json;active:boolean;created_at:string;updated_at:string}>;
      billing_adjustments: Table<{id:string;client_id:string;subscription_id:string|null;invoice_id:string|null;adjustment_type:Enums["adjustment_type"];amount_delta:number;days_delta:number;description:string|null;applied:boolean;applied_at:string|null;created_by_user_id:string|null;created_at:string;updated_at:string}>;
      business_events: Table<{id:string;client_id:string;n8n_instance_id:string;workflow_id:string|null;source_execution_id:string|null;source_event_key:string|null;event_type:string;event_value:number|null;currency:string|null;occurred_at:string;payload:Json;created_at:string}>;
      calendar_events: Table<{id:string;client_id:string|null;title:string;description:string|null;event_type:Enums["calendar_event_type"];status:Enums["calendar_event_status"];starts_at:string;ends_at:string|null;location:string|null;external_url:string|null;created_by_user_id:string|null;created_at:string;updated_at:string}>;
      client_automation_controls: Table<{id:string;workflow_id:string;client_id:string;n8n_instance_id:string;desired_state:Enums["automation_state"];actual_state:Enums["automation_state"];sync_status:Enums["control_sync_status"];requested_by_user_id:string|null;requested_at:string|null;last_sync_at:string|null;last_control_error:string|null;metadata:Json;created_at:string;updated_at:string}>;
      client_connections: Table<{id:string;client_id:string;n8n_instance_id:string;status:Enums["connection_status"];connected_at:string|null;disconnected_at:string|null;last_verified_at:string|null;last_error:string|null;metadata:Json;created_at:string;updated_at:string}>;
      client_onboarding: Table<{client_id:string;identity_complete:boolean;portal_complete:boolean;commercial_complete:boolean;infrastructure_complete:boolean;automations_complete:boolean;n8n_complete:boolean;account_complete:boolean;verification_complete:boolean;access_sent:boolean;notes:string|null;completed_at:string|null;created_at:string;updated_at:string}>;
      client_portal_config: Table<{id:string;client_id:string;slug:string;portal_title:string;logo_url:string|null;favicon_url:string|null;primary_color:string|null;accent_color:string|null;enabled_modules:string[];dashboard_config:Json;kpi_config:Json;terminology:Json;client_settings_schema:Json;created_at:string;updated_at:string}>;
      client_reports: Table<{id:string;client_id:string;report_type:string;period_start:string;period_end:string;title:string;summary:string|null;metrics:Json;insights:Json;visible_to_client:boolean;generated_at:string;created_at:string}>;
      clients: Table<{id:string;company_name:string;contact_name:string|null;email:string|null;phone:string|null;status:Enums["client_status"];notes:string|null;created_by_user_id:string|null;created_at:string;updated_at:string}>;
      credentials: Table<{id:string;client_id:string|null;provider_name:string;credential_name:string;vault_secret_ref:string|null;scope_description:string|null;expires_at:string|null;active:boolean;metadata:Json;created_at:string;updated_at:string}>;
      discovered_workflows: Table<{id:string;n8n_instance_id:string;n8n_workflow_id:string;discovered_name:string|null;n8n_active:boolean|null;status:Enums["discovered_workflow_status"];mapped_workflow_id:string|null;payload:Json;first_seen_at:string;last_seen_at:string;created_at:string;updated_at:string}>;
      infrastructure_servers: Table<{id:string;provider_name:string;server_name:string;hostname:string|null;ip_address:unknown;region:string|null;status:string;monthly_cost:number;renewal_date:string|null;notes:string|null;created_at:string;updated_at:string}>;
      invoices: Table<{id:string;client_id:string;subscription_id:string;invoice_number:string;invoice_type:Enums["invoice_type"];issue_date:string;due_date:string;period_start:string|null;period_end:string|null;total_amount:number;amount_paid:number;status:Enums["invoice_status"];description:string|null;metadata:Json;created_at:string;updated_at:string}>;
      n8n_instances: Table<{id:string;instance_name:string;base_url:string;hosting_type:Enums["instance_hosting_type"];status:Enums["instance_status"];server_id:string|null;n8n_api_secret_ref:string|null;last_verified_at:string|null;last_sync_at:string|null;last_sync_status:Enums["sync_status"];last_sync_error:string|null;metadata:Json;created_at:string;updated_at:string}>;
      payments: Table<{id:string;client_id:string;invoice_id:string;amount:number;payment_date:string;method:string|null;reference:string|null;status:Enums["payment_status"];notes:string|null;recorded_by_user_id:string|null;created_at:string;updated_at:string}>;
      profiles: Table<{user_id:string;role:Enums["app_role"];client_id:string|null;full_name:string|null;phone:string|null;created_at:string;updated_at:string}>;
      provider_balances: Table<{id:string;provider_name:string;account_name:string|null;currency:string;balance:number;threshold:number;checked_at:string;notes:string|null;created_at:string;updated_at:string}>;
      subscriptions: Table<{id:string;client_id:string;service_name:string;monthly_amount:number;currency:string;billing_day:number;auto_renew:boolean;status:Enums["subscription_status"];start_date:string|null;current_period_start:string|null;current_period_end:string|null;cancelled_at:string|null;metadata:Json;created_at:string;updated_at:string}>;
      support_ticket_messages: Table<{id:string;ticket_id:string;client_id:string;sender_user_id:string|null;message:string;internal:boolean;created_at:string}>;
      support_tickets: Table<{id:string;client_id:string;ticket_number:string;subject:string;status:Enums["ticket_status"];priority:Enums["ticket_priority"];category:string|null;created_by_user_id:string|null;assigned_to_user_id:string|null;resolved_at:string|null;created_at:string;updated_at:string}>;
      tasks: Table<{id:string;client_id:string|null;title:string;description:string|null;status:Enums["task_status"];priority:Enums["task_priority"];due_at:string|null;assigned_to_user_id:string|null;client_visible:boolean;completed_at:string|null;created_by_user_id:string|null;created_at:string;updated_at:string}>;
      workflow_runs: Table<{id:string;workflow_id:string;client_id:string;n8n_instance_id:string;source_execution_id:string;started_at:string|null;finished_at:string|null;status:string;duration_ms:number|null;error_message:string|null;client_visible:boolean;payload:Json;created_at:string}>;
      workflows: Table<{id:string;client_id:string;connection_id:string;n8n_instance_id:string;n8n_workflow_id:string;template_id:string|null;workflow_name:string;business_name:string|null;business_job:string|null;description:string|null;status:Enums["workflow_status"];client_visible:boolean;desired_state:Enums["automation_state"];actual_state:Enums["automation_state"];config:Json;last_execution_at:string|null;last_success_at:string|null;last_failure_at:string|null;last_error:string|null;created_at:string;updated_at:string}>;
    };
    Views: Record<string, never>;
    Functions: Record<string, {Args:Record<string, unknown>;Returns:unknown}>;
    Enums: Enums;
    CompositeTypes: Record<string, never>;
  };
};
