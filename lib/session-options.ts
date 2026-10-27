import type { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ??
    "development-only-secret-min-32-characters-long",
  cookieName: "portfolio_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};
