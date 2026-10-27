import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { Section } from "@/components/ui/Section";
import { getSiteContent } from "@/lib/contentStore";
import { getPublishedProjects } from "@/lib/projectStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, content] = await Promise.all([
    getPublishedProjects(),
    getSiteContent(),
  ]);

  return (
    <>
      <Navbar siteName={content.siteName} />
      <Hero profile={content.profile} />
      <Section id="portfolio" className="bg-black">
        <Projects projects={projects} />
      </Section>
      <Section id="about" className="bg-black">
        <About profile={content.profile} stats={content.aboutStats} />
      </Section>
      <Section id="service" className="bg-black">
        <Services intro={content.servicesIntro} services={content.services} />
      </Section>
      <Section id="skills" className="bg-black">
        <SkillsSection skills={content.skills} />
      </Section>
      <Section id="testimonials" className="bg-black">
        <Testimonials testimonials={content.testimonials} />
      </Section>
      <Section id="contact" className="bg-black">
        <Contact profile={content.profile} intro={content.contactIntro} />
      </Section>
      <Footer />
    </>
  );
}
