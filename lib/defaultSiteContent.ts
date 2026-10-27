import { SKILLS } from "@/content/skills";
import { PROFILE } from "@/lib/profile";
import type { SiteContent } from "@/lib/types";

export const defaultSiteContent: SiteContent = {
  siteName: "Ryan.",
  profile: {
    name: PROFILE.name,
    fullName: PROFILE.fullName,
    title: PROFILE.title,
    email: PROFILE.email,
    heroBio: PROFILE.heroBio,
    aboutBio: PROFILE.aboutBio,
    cvPath: PROFILE.cvPath,
    portraitSrc: PROFILE.portraitSrc,
    socials: PROFILE.socials.map((s) => ({ ...s })),
  },
  aboutStats: [
    { label: "GPA (Ashesi)", value: "3.71" },
    { label: "Projects shipped", value: "5+" },
    { label: "Hackathon wins", value: "2" },
  ],
  servicesIntro:
    "What I can help you build, based on recent internships and project work.",
  services: [
    {
      title: "Full-Stack Web Apps",
      icon: "fullstack",
      description:
        "Marketplaces, booking flows, and dashboards with Laravel, JavaScript, and PostgreSQL.",
    },
    {
      title: "Fintech & Escrow Systems",
      icon: "fintech",
      description:
        "Payment lifecycles, mobile money integration, trust scoring, and secure transaction design.",
    },
    {
      title: "AI & Automation",
      icon: "ai",
      description:
        "RAG pipelines, proposal tooling, and voice-driven workflows that save teams time.",
    },
    {
      title: "Product Documentation",
      icon: "documentation",
      description:
        "Requirements, phased architecture, and implementation plans for multi-tenant platforms.",
    },
  ],
  testimonials: [
    {
      quote: "One of the best people I have ever worked with.",
      name: "C. Yeboah",
      role: "Internship supervisor",
    },
  ],
  skills: SKILLS.map((s) => ({ ...s, grid: { ...s.grid } })),
  contactIntro:
    "Have a project in mind or want to say hi? Send a message and I will get back to you.",
};
