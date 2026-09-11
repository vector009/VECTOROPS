import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile, ClientPortalConfig } from "@/lib/domain";

type AuthStatus = "loading" | "signed_out" | "ready" | "profile_missing" | "error";

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  profile: Profile | null;
  portal: ClientPortalConfig | null;
  errorMessage: string | null;
  isAdmin: boolean;
  isClient: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// The Supabase session is the sole source of truth for identity. Role and
// client_id are always re-derived from `profiles`, never trusted from the
// URL, localStorage, or component state.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portal, setPortal] = useState<ClientPortalConfig | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProfileForSession(activeSession: Session | null) {
    if (!activeSession) {
      setSession(null);
      setProfile(null);
      setPortal(null);
      setStatus("signed_out");
      return;
    }

    setSession(activeSession);

    try {
      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", activeSession.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileRow) {
        setProfile(null);
        setPortal(null);
        setStatus("profile_missing");
        return;
      }

      setProfile(profileRow);

      if (profileRow.role === "client" && profileRow.client_id) {
        const { data: portalRow, error: portalError } = await supabase
          .from("client_portal_config")
          .select("*")
          .eq("client_id", profileRow.client_id)
          .maybeSingle();
        if (portalError) throw portalError;
        setPortal(portalRow ?? null);
      } else {
        setPortal(null);
      }

      setStatus("ready");
    } catch (err) {
      // Never surface raw DB errors to the UI.
      // eslint-disable-next-line no-console
      console.error("[VectorOps] Failed to load profile:", err);
      setErrorMessage("We couldn't load your account. Please try again.");
      setStatus("error");
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      loadProfileForSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      loadProfileForSession(newSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      profile,
      portal,
      errorMessage,
      isAdmin: profile?.role === "admin",
      isClient: profile?.role === "client",
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refreshProfile: async () => {
        const { data } = await supabase.auth.getSession();
        await loadProfileForSession(data.session);
      },
    }),
    [status, session, profile, portal, errorMessage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
