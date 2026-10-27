import { NextRequest, NextResponse } from "next/server";
import { getIronSession, nextProxyCookies } from "iron-session";
import { sessionOptions } from "@/lib/session-options";
import type { SessionData } from "@/lib/types";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isProtectedMutation(pathname: string, method: string): boolean {
  if (!MUTATING.has(method)) return false;
  return (
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/content") ||
    pathname.startsWith("/api/upload")
  );
}

export async function middleware(request: NextRequest) {
  if (!isProtectedMutation(request.nextUrl.pathname, request.method)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(
    nextProxyCookies(request, response),
    sessionOptions,
  );

  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: ["/api/projects/:path*", "/api/content", "/api/upload"],
};
