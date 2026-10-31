import * as simpleIcons from "simple-icons";
import { slugify } from "@/lib/slugify";

type IconEntry = { slug: string; svg: string; title: string; hex: string };

const bySlug = new Map<string, string>();
const metaBySlug = new Map<string, { title: string; hex: string }>();
const searchIndex: { slug: string; title: string; hex: string }[] = [];

for (const value of Object.values(simpleIcons)) {
  if (
    value &&
    typeof value === "object" &&
    "slug" in value &&
    "svg" in value &&
    "title" in value &&
    "hex" in value
  ) {
    const icon = value as IconEntry;
    bySlug.set(icon.slug, icon.svg);
    metaBySlug.set(icon.slug, { title: icon.title, hex: icon.hex });
    searchIndex.push({ slug: icon.slug, title: icon.title, hex: icon.hex });
  }
}

searchIndex.sort((a, b) => a.title.localeCompare(b.title));

export function getSkillIconSvg(slug: string): string | null {
  return bySlug.get(slug) ?? null;
}

export function getSkillIconMeta(
  slug: string,
): { slug: string; title: string; hex: string } | null {
  const meta = metaBySlug.get(slug);
  if (!meta) return null;
  return { slug, title: meta.title, hex: meta.hex };
}

export function skillIconHexColor(slug: string): string | null {
  const meta = getSkillIconMeta(slug);
  return meta ? `#${meta.hex}` : null;
}

export function searchSkillIcons(
  query: string,
  limit = 24,
): { slug: string; title: string; hex: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: { slug: string; title: string; hex: string }[] = [];
  for (const item of searchIndex) {
    if (
      item.slug.includes(q) ||
      item.title.toLowerCase().includes(q)
    ) {
      out.push(item);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export function guessSkillIconSlug(label: string): string | null {
  const compact = label.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (compact && bySlug.has(compact)) return compact;

  const fromSlugify = slugify(label).replace(/-/g, "");
  if (fromSlugify && bySlug.has(fromSlugify)) return fromSlugify;

  const alias: Record<string, string> = {
    java: "openjdk",
    js: "javascript",
    ts: "typescript",
    vscode: "visualstudiocode",
    bash: "gnubash",
    cli: "gnubash",
    postgres: "postgresql",
    github: "github",
  };
  if (compact && alias[compact] && bySlug.has(alias[compact])) {
    return alias[compact];
  }

  return null;
}

export function nextSkillKey(
  label: string,
  usedKeys: Set<string>,
): string {
  const candidates = [
    label.trim().charAt(0).toLowerCase(),
    ...label.replace(/[^a-zA-Z]/g, "").slice(0, 3).toLowerCase(),
    "x",
    "z",
  ].filter(Boolean);

  for (const c of candidates) {
    if (!usedKeys.has(c)) return c;
  }
  return "x";
}
