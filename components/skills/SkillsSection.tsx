"use client";

import type { SkillItem } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SkillsKeyboard } from "./SkillsKeyboard";

interface SkillsSectionProps {
  skills: SkillItem[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);

  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-10">
      <div className="text-center">
        <h2
          className="skills-title text-5xl font-black tracking-tight text-transparent md:text-6xl"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #f4f4f5 0%, #a1a1aa 45%, #52525b 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          SKILLS
        </h2>
        <p className="mt-1 text-sm text-zinc-500">(hint: hover a key)</p>
      </div>

      <div
        id="skills-keyboard"
        className="relative mt-6 scroll-mt-28 lg:mt-4 lg:grid lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center lg:gap-6"
      >
        <div className="mb-4 flex min-h-[100px] items-center lg:mb-0 lg:min-h-[200px]">
          <AnimatePresence mode="wait">
            {hoveredSkill ? (
              <motion.div
                key={hoveredSkill.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="w-full text-left"
              >
                <h3
                  className="text-3xl font-black leading-none tracking-tight text-white sm:text-4xl lg:text-5xl"
                  style={{
                    textShadow:
                      "2px 2px 0 #3f3f46, 4px 4px 0 #27272a, 6px 8px 20px rgba(0,0,0,0.85)",
                  }}
                >
                  {hoveredSkill.label}
                </h3>
                <p className="mt-3 text-lg font-semibold text-zinc-300 sm:text-xl">
                  {hoveredSkill.level === "Not set"
                    ? "Level not set yet"
                    : hoveredSkill.level}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-zinc-600"
              >
                Hover a key to see the skill name and your level.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <SkillsKeyboard
          skills={skills}
          hoveredSkill={hoveredSkill}
          onSkillHover={setHoveredSkill}
        />
      </div>
    </div>
  );
}
