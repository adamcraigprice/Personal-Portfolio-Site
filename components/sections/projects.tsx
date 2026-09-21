import { ArrowUpRight, Trophy } from "lucide-react";

import { projects } from "@/lib/data";
import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

const linkIcons = {
  GitHub: GithubIcon,
  DevPost: Trophy,
} as const;

export function Projects() {
  return (
    <Section id="projects" heading="Projects" eyebrow="04 — Things I built">
      <ul className="grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal as="li" key={project.name} delay={index * 0.08}>
            <Card interactive className="flex h-full flex-col p-6 md:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">
                  {project.name}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {project.blurb}
                </p>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="accent">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 pt-1">
                {project.links.map((link) => {
                  const Icon = linkIcons[link.label];
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 rounded-md font-mono text-xs
                                 text-muted-foreground transition-colors hover:text-accent
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                                 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {link.label}
                      <ArrowUpRight
                        className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">
                        {" "}
                        — {project.name} on {link.label} (opens in a new tab)
                      </span>
                    </a>
                  );
                })}
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
