import type { SkillItem } from "@/lib/types";

/** Column count for the skills keyboard from total key count. */
export function keyboardColumns(skillCount: number): number {
  if (skillCount <= 0) return 5;
  if (skillCount <= 5) return skillCount;
  if (skillCount <= 6) return 3;
  if (skillCount <= 8) return 4;
  if (skillCount <= 10) return 5;
  if (skillCount <= 12) return 6;
  if (skillCount <= 14) return 7;
  return 5;
}

export function applySkillGrid(skills: SkillItem[]): SkillItem[] {
  const cols = keyboardColumns(skills.length);
  return skills.map((skill, index) => ({
    ...skill,
    grid: { row: Math.floor(index / cols), col: index % cols },
  }));
}

export function keycapSizeClass(cols: number): string {
  if (cols <= 5) {
    return "h-12 w-12 sm:h-14 sm:w-14 md:h-[3.5rem] md:w-[3.5rem] md:rounded-lg";
  }
  if (cols <= 6) {
    return "h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 md:rounded-lg";
  }
  return "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 md:rounded-md";
}
