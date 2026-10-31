"use client";

import { AdminField } from "@/components/admin/AdminField";
import { CURATED_SKILL_ICON_SLUGS } from "@/lib/skillIconMeta";
import {
  getSkillIconMeta,
  getSkillIconSvg,
  searchSkillIcons,
} from "@/lib/skillIcon";
import { useMemo, useState } from "react";

interface SkillIconFieldProps {
  iconSlug: string;
  color: string;
  onChange: (patch: { iconSlug?: string; color?: string }) => void;
}

function IconPreview({ slug, color }: { slug: string; color: string }) {
  const svg = slug ? getSkillIconSvg(slug) : null;
  const face =
    color === "#F7DF1E" || color === "#FCC624" || color === "#FF9900"
      ? "#111"
      : "#fff";
  const bg = color.startsWith("#") ? color : "#27272a";

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15"
      style={{ backgroundColor: bg, color: face }}
    >
      {svg ? (
        <span
          className="h-7 w-7 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <span className="text-[10px] text-zinc-400">?</span>
      )}
    </div>
  );
}

export function SkillIconField({ iconSlug, color, onChange }: SkillIconFieldProps) {
  const [query, setQuery] = useState("");
  const curatedOptions = useMemo(
    () =>
      CURATED_SKILL_ICON_SLUGS.map((slug) => {
        const m = getSkillIconMeta(slug);
        return { slug, title: m?.title ?? slug };
      }),
    [],
  );
  const searchHits = useMemo(
    () => (query.trim().length >= 2 ? searchSkillIcons(query, 8) : []),
    [query],
  );
  const meta = iconSlug ? getSkillIconMeta(iconSlug) : null;

  function pickSlug(slug: string) {
    const hex = getSkillIconMeta(slug)?.hex;
    onChange({
      iconSlug: slug || undefined,
      ...(hex ? { color: `#${hex}` } : {}),
    });
    setQuery("");
  }

  return (
    <AdminField
      label="Icon"
      hint="Choose from popular icons or search. Key color updates from the brand when you pick an icon."
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <IconPreview slug={iconSlug} color={color} />
          <select
            className="field max-w-xs"
            value={
              iconSlug &&
              (CURATED_SKILL_ICON_SLUGS as readonly string[]).includes(iconSlug)
                ? iconSlug
                : ""
            }
            onChange={(e) => {
              if (e.target.value) pickSlug(e.target.value);
            }}
          >
            <option value="">Popular icons…</option>
            {curatedOptions.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.title}
              </option>
            ))}
          </select>
          {meta && (
            <span className="text-xs text-zinc-500">{meta.title}</span>
          )}
        </div>
        <input
          className="field"
          value={query}
          placeholder="Search all icons (type 2+ letters)…"
          onChange={(e) => setQuery(e.target.value)}
        />
        {searchHits.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {searchHits.map((hit) => (
              <li key={hit.slug}>
                <button
                  type="button"
                  onClick={() => pickSlug(hit.slug)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 hover:border-brand/40 hover:text-white"
                >
                  {hit.title}
                </button>
              </li>
            ))}
          </ul>
        )}
        <AdminField label="Icon slug" hint="simple-icons slug, e.g. supabase">
          <input
            className="field font-mono text-sm"
            value={iconSlug}
            onChange={(e) => pickSlug(e.target.value.trim())}
            placeholder="supabase"
          />
        </AdminField>
      </div>
    </AdminField>
  );
}
