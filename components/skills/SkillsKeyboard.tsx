"use client";

import type { SkillItem } from "@/lib/types";
import { SkillKey } from "./SkillKey";

const COLS = 5;

function chunkRows(skills: SkillItem[]) {
  const rows: SkillItem[][] = [];
  for (let i = 0; i < skills.length; i += COLS) {
    rows.push(skills.slice(i, i + COLS));
  }
  return rows;
}

interface SkillsKeyboardProps {
  skills: SkillItem[];
  hoveredSkill: SkillItem | null;
  onSkillHover: (skill: SkillItem | null) => void;
}

export function SkillsKeyboard({
  skills,
  hoveredSkill,
  onSkillHover,
}: SkillsKeyboardProps) {
  const rows = chunkRows(skills);

  return (
    <div className="keyboard-board py-2 sm:py-4">
      <div className="flex flex-col gap-2 sm:gap-2.5">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-2 sm:gap-2.5"
          >
            {row.map((skill) => (
              <SkillKey
                key={skill.id}
                skill={skill}
                active={hoveredSkill?.id === skill.id}
                onEnter={() => onSkillHover(skill)}
                onLeave={() => onSkillHover(null)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
