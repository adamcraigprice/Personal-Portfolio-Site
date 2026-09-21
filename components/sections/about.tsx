import { GraduationCap } from "lucide-react";

import { about } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

export function About() {
  return (
    <Section id="about" heading={about.heading} eyebrow="01 — Who I am">
      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:gap-12">
        <Reveal className="space-y-5">
          {about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-base leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <Card interactive className="p-6">
            <GraduationCap
              className="mb-4 h-6 w-6 text-accent"
              aria-hidden="true"
            />
            <p className="font-mono text-xs text-muted-foreground">
              {about.education.dates}
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">
              {about.education.school}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {about.education.degree}
            </p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              {about.education.location}
            </p>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
