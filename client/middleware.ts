import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // If not logged in → redirect to login
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  // If not admin → redirect to dashboard
  if (!profile?.is_admin) return NextResponse.redirect(new URL("/dashboard", req.url));

  return NextResponse.next();
}

// Apply middleware only for /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
