"use client";

import type { SkillItem } from "@/lib/types";
import { keyboardColumns, keycapSizeClass } from "@/lib/skillsLayout";
import { SkillKey } from "./SkillKey";

function chunkRows(skills: SkillItem[], cols: number) {
  const rows: SkillItem[][] = [];
  for (let i = 0; i < skills.length; i += cols) {
    rows.push(skills.slice(i, i + cols));
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
  const cols = keyboardColumns(skills.length);
  const rows = chunkRows(skills, cols);
  const sizeClass = keycapSizeClass(cols);

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
                sizeClass={sizeClass}
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
