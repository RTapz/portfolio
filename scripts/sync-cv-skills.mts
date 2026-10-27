import { SKILLS, SKILL_LEVEL_UNSET } from "../content/skills.ts";
import fs from "fs";
import path from "path";

const contentPath = path.join(process.cwd(), "data", "site-content.json");
const existing = JSON.parse(fs.readFileSync(contentPath, "utf-8")) as {
  skills: { id: string; level: string }[];
};

const levelById = new Map(
  existing.skills.map((s) => [s.id, s.level] as const),
);

const skills = SKILLS.map((seed) => {
  const kept = levelById.get(seed.id);
  const level =
    seed.id === "french"
      ? "Intermediate"
      : kept && kept !== SKILL_LEVEL_UNSET
        ? kept
        : seed.level;
  return { ...seed, level, grid: { ...seed.grid } };
});

existing.skills = skills;
fs.writeFileSync(contentPath, JSON.stringify(existing, null, 2));
console.log(`Synced ${skills.length} CV skills to site-content.json`);
