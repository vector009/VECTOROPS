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

export const clientNav = (slug: string) => [
  { href: `/${slug}`, label: "Overview", icon: LayoutDashboard },
  { href: `/${slug}/automations`, label: "Automations", icon: Bot },
  { href: `/${slug}/results`, label: "Results", icon: BarChart3 },
  { href: `/${slug}/billing`, label: "Billing", icon: WalletCards },
  { href: `/${slug}/support`, label: "Support", icon: LifeBuoy },
  { href: `/${slug}/profile`, label: "Profile", icon: UserRound },
];
