import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { FullScreenState } from "@/components/ui/FullScreenState";

// These guards decide *whether to render a route*. They never decide *what
// data that route can see* — RLS in Supabase is the actual security boundary.
// This is defense-in-depth for UX, not a substitute for RLS.

export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <FullScreenState kind="loading" message="Checking your session…" />;

  if (status === "signed_out") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (status === "profile_missing") {
    return (
      <FullScreenState
        kind="error"
        title="No account found"
        message="Your login worked, but no VectorOps profile is linked to it yet. Contact your administrator to get access."
      />
    );
  }

  if (status === "error") {
    return (
      <FullScreenState
        kind="error"
        title="Something went wrong"
        message="We couldn't load your account. Please refresh, or try again shortly."
      />
    );
  }

  return <Outlet />;
}

export function RequireAdmin() {
  const { isAdmin, status } = useAuth();
  if (status !== "ready") return <FullScreenState kind="loading" message="Loading…" />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}

export function RequireClient() {
  const { isClient, status, portal } = useAuth();
  if (status !== "ready") return <FullScreenState kind="loading" message="Loading…" />;
  if (!isClient) return <Navigate to="/unauthorized" replace />;
  if (!portal) {
    return (
      <FullScreenState
        kind="error"
        title="Portal not configured"
        message="Your account isn't linked to an active client portal yet. Contact your account manager."
      />
    );
  }
  return <Outlet />;
}
