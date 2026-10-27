import type { ServiceIconId } from "./serviceIcons";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  liveUrl?: string;
  repoUrl?: string;
  published: boolean;
  order: number;
}

export interface SessionData {
  isLoggedIn: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  iconSlug: string;
}

export interface ProfileContent {
  name: string;
  fullName: string;
  title: string;
  email: string;
  heroBio: string;
  aboutBio: string;
  cvPath: string;
  portraitSrc: string;
  socials: SocialLink[];
}

export interface StatItem {
  label: string;
  value: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: ServiceIconId;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

export interface SkillItem {
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

export interface SiteContent {
  siteName: string;
  profile: ProfileContent;
  aboutStats: StatItem[];
  servicesIntro: string;
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  skills: SkillItem[];
  contactIntro: string;
}
