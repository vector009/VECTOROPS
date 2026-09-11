import { NavLink, Outlet, useParams } from "react-router-dom";
import { LayoutDashboard, Workflow, LineChart, Wallet, LifeBuoy, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";

const MODULE_NAV: Record<string, { label: string; icon: typeof LayoutDashboard; path: string }> = {
  overview: { label: "Overview", icon: LayoutDashboard, path: "" },
  automations: { label: "Automations", icon: Workflow, path: "/automations" },
  results: { label: "Results", icon: LineChart, path: "/results" },
  billing: { label: "Billing", icon: Wallet, path: "/billing" },
  support: { label: "Support", icon: LifeBuoy, path: "/support" },
  profile: { label: "Profile", icon: UserCircle, path: "/profile" },
};

export function ClientShell() {
  const { portal, signOut } = useAuth();
  const { slug } = useParams();

  const enabledModules = portal?.enabled_modules ?? ["overview", "automations", "results", "billing", "support", "profile"];
  const title = portal?.portal_title ?? "Client Portal";
  const accent = portal?.accent_color ?? "#2F5FED";

  return (
    <div className="flex min-h-screen bg-paper-50">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-white md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-line px-5">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
          <span className="truncate text-sm font-semibold tracking-tight">{title}</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {enabledModules.map((mod) => {
            const item = MODULE_NAV[mod];
            if (!item) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={mod}
                to={`/client/${slug}${item.path}`}
                end={item.path === ""}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-ink-950 text-paper-50" : "text-ink-700 hover:bg-paper-100"
                  }`
                }
              >
                <Icon size={16} strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-ink-500 hover:bg-paper-100"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
