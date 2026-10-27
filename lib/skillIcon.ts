import * as simpleIcons from "simple-icons";

type IconEntry = { slug: string; svg: string };

const bySlug = new Map<string, string>();

for (const value of Object.values(simpleIcons)) {
  if (
    value &&
    typeof value === "object" &&
    "slug" in value &&
    "svg" in value
  ) {
    const icon = value as IconEntry;
    bySlug.set(icon.slug, icon.svg);
  }
}

export function getSkillIconSvg(slug: string): string | null {
  return bySlug.get(slug) ?? null;
}
