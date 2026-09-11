import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthProvider";
import { RequireAuth, RequireAdmin, RequireClient } from "@/auth/guards";
import { AdminShell } from "@/layouts/AdminShell";
import { ClientShell } from "@/layouts/ClientShell";
import { FullScreenState } from "@/components/ui/FullScreenState";

const Login = lazy(() => import("@/pages/Login"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const RoleRedirect = lazy(() => import("@/pages/RoleRedirect"));

const AdminOverview = lazy(() => import("@/pages/admin/Overview"));
const AdminClients = lazy(() => import("@/pages/admin/Clients"));
const AdminClientDetail = lazy(() => import("@/pages/admin/ClientDetail"));
const AdminAutomations = lazy(() => import("@/pages/admin/Automations"));
const AdminWorkflowDetail = lazy(() => import("@/pages/admin/WorkflowDetail"));
const AdminMoney = lazy(() => import("@/pages/admin/Money"));
const AdminCalendar = lazy(() => import("@/pages/admin/Calendar"));
const AdminTasks = lazy(() => import("@/pages/admin/Tasks"));
const AdminSupport = lazy(() => import("@/pages/admin/Support"));
const AdminInfrastructure = lazy(() => import("@/pages/admin/Infrastructure"));
const AdminActivity = lazy(() => import("@/pages/admin/Activity"));
const AdminAudit = lazy(() => import("@/pages/admin/Audit"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));

const ClientOverview = lazy(() => import("@/pages/client/Overview"));
const ClientAutomations = lazy(() => import("@/pages/client/Automations"));
const ClientAutomationDetail = lazy(() => import("@/pages/client/AutomationDetail"));
const ClientResults = lazy(() => import("@/pages/client/Results"));
const ClientBilling = lazy(() => import("@/pages/client/Billing"));
const ClientSupport = lazy(() => import("@/pages/client/Support"));
const ClientProfile = lazy(() => import("@/pages/client/Profile"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<FullScreenState kind="loading" />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route element={<RequireAuth />}>
              <Route path="/" element={<RoleRedirect />} />

              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminShell />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="clients" element={<AdminClients />} />
                  <Route path="clients/:clientId" element={<AdminClientDetail />} />
                  <Route path="automations" element={<AdminAutomations />} />
                  <Route path="automations/:workflowId" element={<AdminWorkflowDetail />} />
                  <Route path="money" element={<AdminMoney />} />
                  <Route path="calendar" element={<AdminCalendar />} />
                  <Route path="tasks" element={<AdminTasks />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="infrastructure" element={<AdminInfrastructure />} />
                  <Route path="activity" element={<AdminActivity />} />
                  <Route path="audit" element={<AdminAudit />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              <Route element={<RequireClient />}>
                <Route path="/client/:slug" element={<ClientShell />}>
                  <Route index element={<ClientOverview />} />
                  <Route path="automations" element={<ClientAutomations />} />
                  <Route path="automations/:workflowId" element={<ClientAutomationDetail />} />
                  <Route path="results" element={<ClientResults />} />
                  <Route path="billing" element={<ClientBilling />} />
                  <Route path="support" element={<ClientSupport />} />
                  <Route path="profile" element={<ClientProfile />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
