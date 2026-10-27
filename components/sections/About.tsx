import type { ProfileContent, StatItem } from "@/lib/types";

interface AboutProps {
  profile: ProfileContent;
  stats: StatItem[];
}

export function About({ profile, stats }: AboutProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">About</h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            {profile.aboutBio}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-zinc-950 p-6 text-center"
            >
              <p className="text-3xl font-bold text-brand">{stat.value}</p>
              <p className="mt-2 text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
