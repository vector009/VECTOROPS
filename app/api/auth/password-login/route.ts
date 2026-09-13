import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

const genericFailure = "We couldn't verify your access right now. Please try again.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { password?: string; mode?: "admin" | "client"; slug?: string };
    if (!body.password || !body.mode) return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
    const admin = createAdminClient();
    let email: string | null = null;
    let targetUserId: string | null = null;

    if (body.mode === "admin") {
      email = process.env.ADMIN_AUTH_EMAIL || null;
      if (!email) return NextResponse.json({ error: genericFailure }, { status: 503 });
      const { data: identity } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const target = identity.users.find((u) => u.email?.toLowerCase() === email!.toLowerCase());
      const { data: profile } = target ? await admin.from("profiles").select("user_id,role").eq("user_id", target.id).maybeSingle() : { data: null };
      if (!target || !profile || profile.role !== "admin") return NextResponse.json({ error: "This account does not have administrator access." }, { status: 403 });
      targetUserId = target.id;
      email = target.email || email;
    } else {
      if (!body.slug || !/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(body.slug)) return NextResponse.json({ error: "You don't have access to this portal." }, { status: 403 });
      const { data: portal } = await admin.from("client_portal_config").select("client_id,slug").eq("slug", body.slug).maybeSingle();
      if (!portal) return NextResponse.json({ error: "You don't have access to this portal." }, { status: 403 });
      const { data: client } = await admin.from("clients").select("id,email,status").eq("id", portal.client_id).maybeSingle();
      const { data: profile } = await admin.from("profiles").select("user_id,role,client_id").eq("client_id", portal.client_id).eq("role", "client").maybeSingle();
      if (!client?.email || !profile || !["active", "pending"].includes(client.status)) return NextResponse.json({ error: "This account is currently unavailable." }, { status: 403 });
      email = client.email; targetUserId = profile.user_id;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key || !email) return NextResponse.json({ error: genericFailure }, { status: 503 });
    const response = NextResponse.json({ ok: true }, { status: 200 });
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: items => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    });
    const { error } = await supabase.auth.signInWithPassword({ email, password: body.password });
    if (error) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !targetUserId || user.id !== targetUserId) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: genericFailure }, { status: 403 });
    }
    return response;
  } catch {
    return NextResponse.json({ error: genericFailure }, { status: 500 });
  }
}
