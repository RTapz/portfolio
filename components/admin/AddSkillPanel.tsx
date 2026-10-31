"use client";

import { SKILL_LEVEL_UNSET } from "@/content/skills";
import { AdminField } from "@/components/admin/AdminField";
import { SkillIconField } from "@/components/admin/SkillIconField";
import { slugify } from "@/lib/slugify";
import {
  guessSkillIconSlug,
  nextSkillKey,
  skillIconHexColor,
} from "@/lib/skillIcon";
import type { SkillItem } from "@/lib/types";
import { useState } from "react";

const LEVELS = [
  SKILL_LEVEL_UNSET,
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

interface AddSkillPanelProps {
  usedKeys: Set<string>;
  onAdd: (skill: SkillItem) => void;
}

export function AddSkillPanel({ usedKeys, onAdd }: AddSkillPanelProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [level, setLevel] = useState<string>("Beginner");
  const [iconSlug, setIconSlug] = useState("");
  const [color, setColor] = useState("#1e40af");
  const [shortLabel, setShortLabel] = useState("");
  const [description, setDescription] = useState("");

  function reset() {
    setLabel("");
    setLevel("Beginner");
    setIconSlug("");
    setColor("#1e40af");
    setShortLabel("");
    setDescription("");
  }

  function applyLabel(next: string) {
    setLabel(next);
    const guessed = guessSkillIconSlug(next);
    if (guessed) {
      setIconSlug(guessed);
      const hex = skillIconHexColor(guessed);
      if (hex) setColor(hex);
    }
  }

  function submit() {
    const trimmed = label.trim();
    if (!trimmed) return;
    const id = slugify(trimmed) || `skill-${Date.now()}`;
    const key = nextSkillKey(trimmed, usedKeys);
    const skill: SkillItem = {
      id,
      label: trimmed,
      key,
      color,
      level,
      description: description.trim(),
      iconSlug: iconSlug.trim() || undefined,
      shortLabel: shortLabel.trim() || undefined,
      grid: { row: 0, col: 0 },
    };
    onAdd(skill);
    reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/20"
      >
        + Add skill
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-brand/30 bg-brand/5 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">New skill</h3>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-sm text-zinc-500 hover:text-white"
        >
          Cancel
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField label="Name" hint="Shown when visitors hover the key.">
          <input
            className="field"
            value={label}
            onChange={(e) => applyLabel(e.target.value)}
            placeholder="Supabase"
            autoFocus
          />
        </AdminField>
        <AdminField label="Level">
          <select
            className="field"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </AdminField>
        <div className="sm:col-span-2">
          <SkillIconField
            iconSlug={iconSlug}
            color={color}
            onChange={(patch) => {
              if (patch.iconSlug !== undefined) setIconSlug(patch.iconSlug);
              if (patch.color) setColor(patch.color);
            }}
          />
        </div>
        <AdminField label="Short label" hint="Optional letters on the key if no icon.">
          <input
            className="field max-w-[120px]"
            maxLength={4}
            value={shortLabel}
            onChange={(e) => setShortLabel(e.target.value)}
            placeholder="SB"
          />
        </AdminField>
        <AdminField label="Key color">
          <div className="flex gap-2">
            <input
              type="color"
              className="h-10 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
              value={color.startsWith("#") ? color : "#1e40af"}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              className="field flex-1"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </AdminField>
        <div className="sm:col-span-2">
          <AdminField label="Description" hint="Optional note for yourself.">
            <input
              className="field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Backend & auth"
            />
          </AdminField>
        </div>
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={!label.trim()}
        className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black disabled:opacity-40"
      >
        Add to keyboard
      </button>
    </div>
  );
}
