"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import type { ReactNode } from "react";

export function AdminGate({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setLoggedIn(Boolean(d.isLoggedIn)))
      .catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <LoginForm onSuccess={() => setLoggedIn(true)} />
      </div>
    );
  }

  return <>{children}</>;
}
