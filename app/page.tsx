import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { ResumeSection } from "@/components/sections/resume";
import { ExperienceSection } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]
                   focus:rounded-md focus:bg-accent focus:px-4 focus:py-2
                   focus:text-sm focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <About />
        <ResumeSection />
        <ExperienceSection />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
