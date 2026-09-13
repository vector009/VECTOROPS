import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Bot, WalletCards, CalendarDays, ListTodo, LifeBuoy, ServerCog, Activity, FileClock, Settings2, BarChart3, UserRound } from "lucide-react";

export const adminNav: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/automations", label: "Automations", icon: Bot },
  { href: "/admin/money", label: "Money", icon: WalletCards },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/tasks", label: "Tasks", icon: ListTodo },
  { href: "/admin/support", label: "Support", icon: LifeBuoy },
  { href: "/admin/infrastructure", label: "Infrastructure", icon: ServerCog },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/audit", label: "Audit", icon: FileClock },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];

const CLIENT_MODULES = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "automations", label: "Automations", icon: Bot },
  { key: "results", label: "Results", icon: BarChart3 },
  { key: "billing", label: "Billing", icon: WalletCards },
  { key: "support", label: "Support", icon: LifeBuoy },
  { key: "profile", label: "Profile", icon: UserRound },
];

export const clientNav = (slug: string, enabledModules: string[] = CLIENT_MODULES.map((item) => item.key)) =>
  CLIENT_MODULES.filter((item) => item.key === "overview" || item.key === "profile" || enabledModules.includes(item.key)).map((item) => ({
    href: item.key === "overview" ? `/${slug}` : `/${slug}/${item.key}`,
    label: item.label,
    icon: item.icon,
  }));
