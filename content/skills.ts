/**
 * Skills from the SKILLS section of the CV at profile.cvPath
 * (currently uploads/cv/…RyanOfori-KoreeCV1page.pdf).
 * Levels: French from CV; others default to "Not set" in seed — set in admin.
 */
export const SKILL_LEVEL_UNSET = "Not set";

export interface Skill {
  id: string;
  label: string;
  key: string;
  color: string;
  level: string;
  description: string;
  iconSlug?: string;
  shortLabel?: string;
  grid: { row: number; col: number };
}

function gridAt(index: number): { row: number; col: number } {
  const col = index % 5;
  const row = Math.floor(index / 5);
  return { row, col };
}

const raw: Omit<Skill, "grid">[] = [
  {
    id: "python",
    label: "Python",
    key: "p",
    color: "#3776AB",
    level: SKILL_LEVEL_UNSET,
    description: "Programming — CV",
    iconSlug: "python",
  },
  {
    id: "java",
    label: "Java",
    key: "i",
    color: "#ED8B00",
    level: SKILL_LEVEL_UNSET,
    description: "Programming — CV",
    iconSlug: "openjdk",
  },
  {
    id: "sql",
    label: "SQL",
    key: "s",
    color: "#336791",
    level: SKILL_LEVEL_UNSET,
    description: "Programming — CV",
    shortLabel: "SQL",
  },
  {
    id: "javascript",
    label: "JavaScript",
    key: "j",
    color: "#F7DF1E",
    level: SKILL_LEVEL_UNSET,
    description: "Programming — CV",
    iconSlug: "javascript",
    shortLabel: "JS",
  },
  {
    id: "sqlite",
    label: "SQLite",
    key: "q",
    color: "#003B57",
    level: SKILL_LEVEL_UNSET,
    description: "Frameworks & data — CV",
    iconSlug: "sqlite",
  },
  {
    id: "laravel",
    label: "Laravel",
    key: "l",
    color: "#FF2D20",
    level: SKILL_LEVEL_UNSET,
    description: "Frameworks & data — CV",
    iconSlug: "laravel",
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    key: "g",
    color: "#4169E1",
    level: SKILL_LEVEL_UNSET,
    description: "Frameworks & data — CV",
    iconSlug: "postgresql",
  },
  {
    id: "git",
    label: "Git & GitHub",
    key: "t",
    color: "#F05032",
    level: SKILL_LEVEL_UNSET,
    description: "Tools — version control — CV",
    iconSlug: "git",
  },
  {
    id: "vscode",
    label: "VS Code",
    key: "v",
    color: "#007ACC",
    level: SKILL_LEVEL_UNSET,
    description: "Tools — CV",
    iconSlug: "visualstudiocode",
  },
  {
    id: "cursor",
    label: "Cursor",
    key: "u",
    color: "#1e40af",
    level: SKILL_LEVEL_UNSET,
    description: "Tools — CV",
    iconSlug: "cursor",
  },
  {
    id: "cli",
    label: "Command line",
    key: "c",
    color: "#27272a",
    level: SKILL_LEVEL_UNSET,
    description: "Tools — basic CLI — CV",
    iconSlug: "gnubash",
  },
  {
    id: "french",
    label: "French",
    key: "f",
    color: "#002395",
    level: "Intermediate",
    description: "Working proficiency in reading and writing — CV",
    shortLabel: "FR",
  },
];

export const SKILLS: Skill[] = raw.map((skill, index) => ({
  ...skill,
  grid: gridAt(index),
}));

export function getSkillByKey(key: string): Skill | undefined {
  return SKILLS.find((s) => s.key.toLowerCase() === key.toLowerCase());
}
