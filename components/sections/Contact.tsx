"use client";

import type { ProfileContent } from "@/lib/types";
import { useState } from "react";

interface ContactProps {
  profile: ProfileContent;
  intro: string;
}

export function Contact({ profile, intro }: ContactProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setMessage("Thanks! Your message was received.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Contact</h2>
          <p className="mt-4 text-zinc-400">{intro}</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 block text-white hover:text-brand"
          >
            {profile.email}
          </a>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-brand"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-brand"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Message"
            className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
          {message && (
            <p
              className={`text-sm ${
                status === "error" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
