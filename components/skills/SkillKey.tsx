"use client";

import type { SkillItem } from "@/lib/types";
import { getSkillIconSvg } from "@/lib/skillIcon";

interface SkillKeyProps {
  skill: SkillItem;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function lightFace(color: string) {
  return color === "#F7DF1E" || color === "#FCC624" || color === "#FF9900";
}

function edgeColor(color: string) {
  return `color-mix(in srgb, ${color} 45%, black)`;
}

export function SkillKey({ skill, active, onEnter, onLeave }: SkillKeyProps) {
  const svg = skill.iconSlug ? getSkillIconSvg(skill.iconSlug) : null;
  const iconColor = lightFace(skill.color) ? "#111" : "#fff";
  const label = skill.shortLabel ?? skill.label.slice(0, 2).toUpperCase();
  const edge = edgeColor(skill.color);

  return (
    <button
      type="button"
      className={`skill-key relative h-12 w-12 shrink-0 rounded-md border border-white/20 border-b-0 transition-[transform,box-shadow] duration-100 ease-out sm:h-14 sm:w-14 md:h-[3.5rem] md:w-[3.5rem] md:rounded-lg ${
        active ? "translate-y-[3px]" : ""
      }`}
      style={{
        backgroundColor: skill.color,
        boxShadow: active
          ? `0 1px 0 ${edge}, 0 2px 6px rgba(0,0,0,0.35)`
          : `0 4px 0 ${edge}, 0 6px 14px rgba(0,0,0,0.4)`,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label={`${skill.label}, ${skill.level}`}
    >
      <span
        className="pointer-events-none flex h-full w-full items-center justify-center"
        style={{ color: iconColor }}
      >
        {svg ? (
          <span
            className="h-7 w-7 sm:h-8 sm:w-8 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <span className="text-xs font-bold sm:text-sm">{label}</span>
        )}
      </span>
    </button>
  );
}
