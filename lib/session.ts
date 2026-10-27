import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "./types";
import { sessionOptions } from "./session-options";

export { sessionOptions };

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }
  return session;
}
