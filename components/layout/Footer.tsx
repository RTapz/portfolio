import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 md:flex-row md:px-10">
        <p>© {new Date().getFullYear()} {SITE_NAME} All rights reserved.</p>
        <p className="text-zinc-600">Built with Next.js</p>
      </div>
    </footer>
  );
}
