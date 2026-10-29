"use client";

import { SKILL_LEVEL_UNSET } from "@/content/skills";
import { AdminField } from "@/components/admin/AdminField";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import {
  SERVICE_ICON_IDS,
  SERVICE_ICON_LABELS,
  isServiceIconId,
} from "@/lib/serviceIcons";
import { slugify } from "@/lib/slugify";
import type { SiteContent, SkillItem } from "@/lib/types";
import { readApiError } from "@/lib/adminApiError";
import { useEffect, useMemo, useState } from "react";
import { FileUploadField } from "./FileUploadField";

interface SiteContentEditorProps {
  initial: SiteContent;
  onSaved: () => void;
  onToast: (message: string, tone: "success" | "error" | "info") => void;
}

const TAB_HELP: Record<string, string> = {
  profile: "Name, photo, CV, and social links for the hero area.",
  about: "Longer bio and stat numbers under About.",
  services: "What you offer — title and blurb for each card.",
  skills:
    "Skills from your CV keyboard. Set each level below. Only add skills you have put on your CV or agreed with your developer.",
  testimonials: "Quotes from clients or colleagues.",
  contact: "Intro text above the contact form.",
};

const SKILL_LEVELS = [
  SKILL_LEVEL_UNSET,
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export function SiteContentEditor({
  initial,
  onSaved,
  onToast,
}: SiteContentEditorProps) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<
    "profile" | "about" | "services" | "skills" | "testimonials" | "contact"
  >("profile");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContent(initial);
  }, [initial]);

  const isDirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(initial),
    [content, initial],
  );

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        throw new Error(await readApiError(res));
      }
      onToast("Site content saved. Open Preview site to check.", "success");
      onSaved();
    } catch (err) {
      onToast(
        err instanceof Error ? err.message : "Could not save. Try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: "profile" as const, label: "Profile & hero" },
    { id: "about" as const, label: "About" },
    { id: "services" as const, label: "Services" },
    { id: "skills" as const, label: "Skills" },
    { id: "testimonials" as const, label: "Testimonials" },
    { id: "contact" as const, label: "Contact" },
  ];

  function updateSkill(index: number, patch: Partial<SkillItem>) {
    setContent((c) => ({
      ...c,
      skills: c.skills.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  function moveSkill(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= content.skills.length) return;
    setContent((c) => {
      const skills = [...c.skills];
      const [item] = skills.splice(index, 1);
      skills.splice(next, 0, item);
      return { ...c, skills };
    });
  }

  function addSkill() {
    const label = window.prompt(
      "Skill name (only add if it is on your CV or you have approved it):",
    );
    if (!label?.trim()) return;
    const trimmed = label.trim();
    const id = slugify(trimmed) || `skill-${Date.now()}`;
    const usedKeys = new Set(content.skills.map((s) => s.key.toLowerCase()));
    let key = trimmed.charAt(0).toLowerCase();
    if (usedKeys.has(key)) {
      key = trimmed.slice(0, 2).toLowerCase();
    }
    const skill: SkillItem = {
      id,
      label: trimmed,
      key,
      color: "#1e40af",
      level: SKILL_LEVEL_UNSET,
      description: "",
      grid: { row: 0, col: 0 },
    };
    setContent((c) => ({ ...c, skills: [...c.skills, skill] }));
    onToast(`Added “${trimmed}”. Choose a level and save.`, "info");
  }

  function removeSkill(index: number) {
    const skill = content.skills[index];
    if (!confirm(`Remove “${skill.label}” from the skills keyboard?`)) return;
    setContent((c) => ({
      ...c,
      skills: c.skills.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="relative space-y-6 pb-24">
      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3 py-1.5 text-sm sm:px-4 ${
                tab === t.id
                  ? "bg-brand text-white"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-zinc-500">{TAB_HELP[tab]}</p>

        {tab === "profile" && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FileUploadField
                label="Hero portrait"
                kind="portrait"
                value={content.profile.portraitSrc}
                onChange={(url) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, portraitSrc: url },
                  })
                }
                hint="Your photo on the right side of the hero."
              />
            </div>
            <AdminField label="Site name" hint="Shown in the top navigation.">
              <input
                className="field"
                value={content.siteName}
                onChange={(e) =>
                  setContent({ ...content, siteName: e.target.value })
                }
              />
            </AdminField>
            <AdminField
              label="First name (typewriter line)"
              hint={`Appears as "Hi, I'm …"`}
            >
              <input
                className="field"
                value={content.profile.name}
                onChange={(e) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, name: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Full name" hint="Used where your full name is needed.">
              <input
                className="field"
                value={content.profile.fullName}
                onChange={(e) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, fullName: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField
              label="Role / title"
              hint="Line under your name, e.g. Full Stack Developer."
            >
              <input
                className="field"
                value={content.profile.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, title: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Email" hint="Contact section and mailto link.">
              <input
                className="field"
                type="email"
                value={content.profile.email}
                onChange={(e) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, email: e.target.value },
                  })
                }
              />
            </AdminField>
            <div className="sm:col-span-2">
              <FileUploadField
                label="CV (PDF)"
                kind="cv"
                value={content.profile.cvPath}
                onChange={(url) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, cvPath: url },
                  })
                }
                hint='Powers the "Download CV" button.'
              />
            </div>
            <div className="sm:col-span-2">
              <AdminField label="Hero intro" hint="Short paragraph in the hero.">
                <textarea
                  className="field min-h-[100px]"
                  value={content.profile.heroBio}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      profile: { ...content.profile, heroBio: e.target.value },
                    })
                  }
                />
              </AdminField>
            </div>
            <div className="sm:col-span-2 space-y-3">
              <p className="text-sm font-medium text-zinc-200">Social links</p>
              {content.profile.socials.map((social, i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-xl border border-white/5 p-3 sm:grid-cols-3"
                >
                  <AdminField label="Network">
                    <input
                      className="field"
                      placeholder="LinkedIn"
                      value={social.label}
                      onChange={(e) => {
                        const socials = [...content.profile.socials];
                        socials[i] = { ...socials[i], label: e.target.value };
                        setContent({
                          ...content,
                          profile: { ...content.profile, socials },
                        });
                      }}
                    />
                  </AdminField>
                  <div className="sm:col-span-2">
                    <AdminField label="Profile URL">
                      <input
                        className="field"
                        type="url"
                        placeholder="https://"
                        value={social.href}
                        onChange={(e) => {
                          const socials = [...content.profile.socials];
                          socials[i] = { ...socials[i], href: e.target.value };
                          setContent({
                            ...content,
                            profile: { ...content.profile, socials },
                          });
                        }}
                      />
                    </AdminField>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className="mt-6 space-y-5">
            <AdminField label="About paragraph">
              <textarea
                className="field min-h-[120px]"
                value={content.profile.aboutBio}
                onChange={(e) =>
                  setContent({
                    ...content,
                    profile: { ...content.profile, aboutBio: e.target.value },
                  })
                }
              />
            </AdminField>
            <p className="text-sm font-medium text-zinc-200">Stats</p>
            {content.aboutStats.map((stat, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-xl border border-white/5 p-3 sm:grid-cols-2"
              >
                <AdminField label="Label">
                  <input
                    className="field"
                    placeholder="Years experience"
                    value={stat.label}
                    onChange={(e) => {
                      const aboutStats = [...content.aboutStats];
                      aboutStats[i] = { ...aboutStats[i], label: e.target.value };
                      setContent({ ...content, aboutStats });
                    }}
                  />
                </AdminField>
                <AdminField label="Value">
                  <input
                    className="field"
                    placeholder="5+"
                    value={stat.value}
                    onChange={(e) => {
                      const aboutStats = [...content.aboutStats];
                      aboutStats[i] = { ...aboutStats[i], value: e.target.value };
                      setContent({ ...content, aboutStats });
                    }}
                  />
                </AdminField>
              </div>
            ))}
          </div>
        )}

        {tab === "services" && (
          <div className="mt-6 space-y-5">
            <AdminField label="Section intro">
              <textarea
                className="field min-h-[80px]"
                value={content.servicesIntro}
                onChange={(e) =>
                  setContent({ ...content, servicesIntro: e.target.value })
                }
              />
            </AdminField>
            {content.services.map((service, i) => (
              <div
                key={i}
                className="space-y-3 rounded-xl border border-white/5 p-4"
              >
                <p className="text-xs font-medium text-zinc-500">
                  Service {i + 1}
                </p>
                <AdminField label="Icon">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-brand">
                      <ServiceIcon
                        icon={
                          isServiceIconId(service.icon)
                            ? service.icon
                            : "fullstack"
                        }
                      />
                    </div>
                    <select
                      className="field max-w-xs"
                      value={
                        isServiceIconId(service.icon)
                          ? service.icon
                          : "fullstack"
                      }
                      onChange={(e) => {
                        const services = [...content.services];
                        services[i] = {
                          ...services[i],
                          icon: e.target.value as typeof service.icon,
                        };
                        setContent({ ...content, services });
                      }}
                    >
                      {SERVICE_ICON_IDS.map((id) => (
                        <option key={id} value={id}>
                          {SERVICE_ICON_LABELS[id]}
                        </option>
                      ))}
                    </select>
                  </div>
                </AdminField>
                <AdminField label="Title">
                  <input
                    className="field"
                    value={service.title}
                    onChange={(e) => {
                      const services = [...content.services];
                      services[i] = { ...services[i], title: e.target.value };
                      setContent({ ...content, services });
                    }}
                  />
                </AdminField>
                <AdminField label="Description">
                  <textarea
                    className="field min-h-[72px]"
                    value={service.description}
                    onChange={(e) => {
                      const services = [...content.services];
                      services[i] = {
                        ...services[i],
                        description: e.target.value,
                      };
                      setContent({ ...content, services });
                    }}
                  />
                </AdminField>
              </div>
            ))}
          </div>
        )}

        {tab === "skills" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-zinc-300">
              List matches your CV skills section. Pick{" "}
              <strong className="font-medium text-white">Level</strong> for each
              key, then save. French is already Intermediate per your CV.
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addSkill}
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-zinc-300 hover:border-white/30"
              >
                + Add skill
              </button>
            </div>
            <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
            {content.skills.map((skill, i) => (
              <details
                key={skill.id}
                className="rounded-xl border border-white/5 bg-black/20"
                open={i < 3}
              >
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-white">
                  {skill.label || `Skill ${i + 1}`}
                  <span className="ml-2 font-normal text-zinc-500">
                    ({skill.level})
                  </span>
                </summary>
                <div className="grid gap-3 border-t border-white/5 p-4 sm:grid-cols-2">
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveSkill(i, -1)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-sm disabled:opacity-30"
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      disabled={i === content.skills.length - 1}
                      onClick={() => moveSkill(i, 1)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-sm disabled:opacity-30"
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSkill(i)}
                      className="rounded-lg px-3 py-1 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                  <AdminField label="Name">
                    <input
                      className="field"
                      value={skill.label}
                      onChange={(e) => updateSkill(i, { label: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Level">
                    <select
                      className="field"
                      value={skill.level}
                      onChange={(e) => updateSkill(i, { level: e.target.value })}
                    >
                      {SKILL_LEVELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                      {!SKILL_LEVELS.includes(skill.level as typeof SKILL_LEVELS[number]) && (
                        <option value={skill.level}>{skill.level}</option>
                      )}
                    </select>
                  </AdminField>
                  <AdminField label="Key letter" hint="Single character on the keycap.">
                    <input
                      className="field max-w-[80px]"
                      maxLength={2}
                      value={skill.key}
                      onChange={(e) => updateSkill(i, { key: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Key color" hint="Hex color, e.g. #1e40af">
                    <div className="flex gap-2">
                      <input
                        type="color"
                        className="h-10 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
                        value={
                          skill.color.startsWith("#") ? skill.color : "#1e40af"
                        }
                        onChange={(e) =>
                          updateSkill(i, { color: e.target.value })
                        }
                      />
                      <input
                        className="field flex-1"
                        value={skill.color}
                        onChange={(e) =>
                          updateSkill(i, { color: e.target.value })
                        }
                      />
                    </div>
                  </AdminField>
                  <div className="sm:col-span-2">
                    <AdminField label="Tooltip description">
                      <input
                        className="field"
                        value={skill.description}
                        onChange={(e) =>
                          updateSkill(i, { description: e.target.value })
                        }
                      />
                    </AdminField>
                  </div>
                </div>
              </details>
            ))}
            </div>
          </div>
        )}

        {tab === "testimonials" && (
          <div className="mt-6 space-y-4">
            {content.testimonials.map((t, i) => (
              <div
                key={i}
                className="space-y-3 rounded-xl border border-white/5 p-4"
              >
                <p className="text-xs font-medium text-zinc-500">
                  Testimonial {i + 1}
                </p>
                <AdminField label="Quote">
                  <textarea
                    className="field min-h-[80px]"
                    value={t.quote}
                    onChange={(e) => {
                      const testimonials = [...content.testimonials];
                      testimonials[i] = {
                        ...testimonials[i],
                        quote: e.target.value,
                      };
                      setContent({ ...content, testimonials });
                    }}
                  />
                </AdminField>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AdminField label="Name">
                    <input
                      className="field"
                      value={t.name}
                      onChange={(e) => {
                        const testimonials = [...content.testimonials];
                        testimonials[i] = {
                          ...testimonials[i],
                          name: e.target.value,
                        };
                        setContent({ ...content, testimonials });
                      }}
                    />
                  </AdminField>
                  <AdminField label="Role / company">
                    <input
                      className="field"
                      value={t.role}
                      onChange={(e) => {
                        const testimonials = [...content.testimonials];
                        testimonials[i] = {
                          ...testimonials[i],
                          role: e.target.value,
                        };
                        setContent({ ...content, testimonials });
                      }}
                    />
                  </AdminField>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "contact" && (
          <div className="mt-6">
            <AdminField label="Contact intro">
              <textarea
                className="field min-h-[100px]"
                value={content.contactIntro}
                onChange={(e) =>
                  setContent({ ...content, contactIntro: e.target.value })
                }
              />
            </AdminField>
          </div>
        )}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur sm:px-6"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-500">
            {isDirty
              ? "You have unsaved changes on this tab."
              : "All changes saved."}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={saving || !isDirty}
            className="rounded-full bg-brand px-8 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save site content"}
          </button>
        </div>
      </div>
    </div>
  );
}
