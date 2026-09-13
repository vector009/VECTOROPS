export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type Role = "admin" | "client";
export type AutomationState = "unknown" | "running" | "paused" | "disabled";
export type PageMode = "admin" | "client";

export type Profile = { user_id: string; role: Role; client_id: string | null; full_name: string | null; phone: string | null };
export type Client = { id: string; company_name: string; contact_name: string | null; email: string | null; phone: string | null; status: string; notes: string | null };
export type Portal = { client_id: string; slug: string; portal_title: string; logo_url: string | null; favicon_url: string | null; primary_color: string | null; accent_color: string | null; enabled_modules: string[]; dashboard_config: Json; kpi_config: Json; terminology: Json; client_settings_schema: Json };
export type Workflow = { id: string; client_id: string; connection_id: string; n8n_instance_id: string; n8n_workflow_id: string; workflow_name: string; business_name: string | null; business_job: string | null; description: string | null; status: string; client_visible: boolean; desired_state: AutomationState; actual_state: AutomationState; last_execution_at: string | null; last_success_at: string | null; last_failure_at: string | null; last_error: string | null };
