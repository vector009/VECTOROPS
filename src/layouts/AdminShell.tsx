import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Workflow,
  Wallet,
  Calendar,
  ListTodo,
  LifeBuoy,
  Server,
  Activity,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { initials } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/automations", label: "Automations", icon: Workflow },
  { to: "/admin/money", label: "Money", icon: Wallet },
  { to: "/admin/calendar", label: "Calendar", icon: Calendar },
  { to: "/admin/tasks", label: "Tasks", icon: ListTodo },
  { to: "/admin/support", label: "Support", icon: LifeBuoy },
  { to: "/admin/infrastructure", label: "Infrastructure", icon: Server },
  { to: "/admin/activity", label: "Activity", icon: Activity },
  { to: "/admin/audit", label: "Audit", icon: ShieldCheck },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell() {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-paper-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-white md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-line px-5">
          <div className="h-2 w-2 rounded-full bg-signal-DEFAULT" />
          <span className="text-sm font-semibold tracking-tight">VectorOps</span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-ink-950 text-paper-50" : "text-ink-700 hover:bg-paper-100"
                }`
              }
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2 rounded-md px-2 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-xs font-medium text-paper-50">
              {initials(profile?.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink-950">{profile?.full_name ?? "Admin"}</p>
              <p className="text-[11px] text-ink-500">Administrator</p>
            </div>
            <button onClick={() => signOut()} className="text-ink-500 hover:text-ink-950" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line bg-white px-5">
          <p className="text-sm text-ink-500">Agency command center</p>
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <span className="font-mono">v1.0</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
