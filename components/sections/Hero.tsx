"use client";

import { SocialIcon } from "@/components/ui/SocialIcon";
import type { ProfileContent } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroProps {
  profile: ProfileContent;
}

export function Hero({ profile }: HeroProps) {
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative box-border flex min-h-svh scroll-mt-0 items-center overflow-hidden bg-black pb-10 pt-20 md:pb-14 md:pt-24"
    >
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-6 md:grid-cols-[1fr_minmax(280px,42%)] md:gap-8 md:px-10 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 md:space-y-6"
        >
          <h1 className="text-[2.5rem] font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Hi, I&apos;m {profile.name}
            <span className={cursorOn ? "opacity-100" : "opacity-0"}>_</span>
          </h1>
          <p className="text-lg font-semibold text-brand sm:text-xl md:text-2xl">
            {profile.title}
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
            {profile.heroBio}
          </p>
          <a
            href={profile.cvPath}
            download
            className="inline-flex rounded-full border border-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand/10"
          >
            Download CV
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg md:max-w-none md:justify-self-end"
        >
          <div className="relative h-[min(52vh,420px)] w-full sm:h-[min(58vh,480px)] md:h-[min(72vh,620px)]">
            <Image
              src={profile.portraitSrc}
              alt={`${profile.fullName} portrait`}
              fill
              className="object-contain object-bottom"
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 md:right-6 md:flex lg:right-10">
        {profile.socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-sm transition hover:border-brand hover:text-brand"
            aria-label={s.label}
          >
            <SocialIcon slug={s.iconSlug} className="h-5 w-5" />
          </a>
        ))}
      </div>
    </section>
  );
}
