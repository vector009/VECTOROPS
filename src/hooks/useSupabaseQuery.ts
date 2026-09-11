import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as clients from "@/services/clients";
import * as workflows from "@/services/workflows";
import * as billing from "@/services/billing";
import * as support from "@/services/support";
import * as tasks from "@/services/tasks";
import * as calendar from "@/services/calendar";
import * as reports from "@/services/reports";
import * as activity from "@/services/activity";
import * as infra from "@/services/infrastructure";
import type { AutomationState } from "@/lib/database.types";

// ---- Clients ----
export const useClients = () => useQuery({ queryKey: ["clients"], queryFn: clients.getClients });
export const useClient = (id?: string) =>
  useQuery({ queryKey: ["clients", id], queryFn: () => clients.getClient(id as string), enabled: !!id });
export const useClientPortalConfig = (clientId?: string) =>
  useQuery({
    queryKey: ["client_portal_config", clientId],
    queryFn: () => clients.getClientPortalConfig(clientId as string),
    enabled: !!clientId,
  });

// ---- Workflows / Automations ----
export const useWorkflows = (clientId?: string) =>
  useQuery({ queryKey: ["workflows", clientId ?? "all"], queryFn: () => workflows.getWorkflows(clientId) });
export const useWorkflow = (id?: string) =>
  useQuery({ queryKey: ["workflows", "detail", id], queryFn: () => workflows.getWorkflow(id as string), enabled: !!id });
export const useWorkflowRuns = (workflowId?: string, clientVisibleOnly = false) =>
  useQuery({
    queryKey: ["workflow_runs", workflowId, clientVisibleOnly],
    queryFn: () => workflows.getWorkflowRuns(workflowId as string, clientVisibleOnly),
    enabled: !!workflowId,
  });
export const useAutomationLogs = (clientId?: string, clientVisibleOnly = false) =>
  useQuery({
    queryKey: ["automation_logs", clientId, clientVisibleOnly],
    queryFn: () => workflows.getAutomationLogs(clientId as string, clientVisibleOnly),
    enabled: !!clientId,
  });
export const useDiscoveredWorkflows = () =>
  useQuery({ queryKey: ["discovered_workflows"], queryFn: workflows.getDiscoveredWorkflows });

export function useRequestAutomationControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { workflowId: string; desiredState: AutomationState; reason?: string }) =>
      workflows.requestAutomationControl(input.workflowId, input.desiredState, input.reason),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["workflows"] });
      qc.invalidateQueries({ queryKey: ["workflows", "detail", vars.workflowId] });
    },
  });
}

// ---- Billing ----
export const useSubscriptions = (clientId?: string) =>
  useQuery({ queryKey: ["subscriptions", clientId ?? "all"], queryFn: () => billing.getSubscriptions(clientId) });
export const useInvoices = (clientId?: string) =>
  useQuery({ queryKey: ["invoices", clientId ?? "all"], queryFn: () => billing.getInvoices(clientId) });
export const usePayments = (clientId?: string) =>
  useQuery({ queryKey: ["payments", clientId ?? "all"], queryFn: () => billing.getPayments(clientId) });
export const useBillingAdjustments = (clientId?: string) =>
  useQuery({ queryKey: ["billing_adjustments", clientId ?? "all"], queryFn: () => billing.getBillingAdjustments(clientId) });

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: billing.recordPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

// ---- Support ----
export const useTickets = (clientId?: string) =>
  useQuery({ queryKey: ["tickets", clientId ?? "all"], queryFn: () => support.getTickets(clientId) });
export const useTicketMessages = (ticketId?: string) =>
  useQuery({
    queryKey: ["ticket_messages", ticketId],
    queryFn: () => support.getTicketMessages(ticketId as string),
    enabled: !!ticketId,
  });

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { clientId: string; subject: string; category?: string }) =>
      support.createTicket(input.clientId, input.subject, input.category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}

export function useAddTicketMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { ticketId: string; message: string }) => support.addTicketMessage(input.ticketId, input.message),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["ticket_messages", vars.ticketId] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

// ---- Tasks ----
export const useTasks = (clientId?: string) =>
  useQuery({ queryKey: ["tasks", clientId ?? "all"], queryFn: () => tasks.getTasks(clientId) });

export function useCompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tasks.completeTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

// ---- Calendar ----
export const useCalendarEvents = (clientId?: string) =>
  useQuery({ queryKey: ["calendar_events", clientId ?? "all"], queryFn: () => calendar.getCalendarEvents(clientId) });

// ---- Reports / business outcomes ----
export const useClientReports = (clientId?: string) =>
  useQuery({ queryKey: ["client_reports", clientId], queryFn: () => reports.getClientReports(clientId as string), enabled: !!clientId });
export const useBusinessEvents = (clientId?: string) =>
  useQuery({ queryKey: ["business_events", clientId], queryFn: () => reports.getBusinessEvents(clientId as string), enabled: !!clientId });

// ---- Activity / audit (admin only) ----
export const useAuditLogs = () => useQuery({ queryKey: ["audit_logs"], queryFn: activity.getAuditLogs });

// ---- Infrastructure ----
export const useServers = () => useQuery({ queryKey: ["servers"], queryFn: infra.getServers });
export const useN8nInstances = () => useQuery({ queryKey: ["n8n_instances"], queryFn: infra.getN8nInstances });
export const useClientConnections = (clientId?: string) =>
  useQuery({ queryKey: ["client_connections", clientId ?? "all"], queryFn: () => infra.getClientConnections(clientId) });
