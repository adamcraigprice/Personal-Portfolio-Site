import { Mail } from "lucide-react";

import { siteConfig } from "@/lib/data";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

const socials = [
  { label: "LinkedIn", href: siteConfig.linkedin, Icon: LinkedinIcon },
  { label: "GitHub", href: siteConfig.github, Icon: GithubIcon },
];

export function Contact() {
  return (
    <>
      <Section id="contact" heading="Get in touch" eyebrow="05 — Say hello">
        <Reveal className="max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground">
            I&apos;m always happy to talk about forward deployed engineering, AI
            platforms, or an interesting problem you&apos;re stuck on.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={`mailto:${siteConfig.email}`}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </Button>

            {socials.map(({ label, href, Icon }) => (
              <Button key={label} asChild size="lg" variant="outline">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            ))}
          </div>
        </Reveal>
      </Section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>Built with Next.js, Tailwind CSS, and Framer Motion.</p>
        </div>
      </footer>
    </>
  );
}
