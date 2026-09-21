import { experience, skillGroups } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { ExperienceCard } from "@/components/sections/experience-card";

export function ExperienceSection() {
  return (
    <Section id="experience" heading="Experience" eyebrow="03 — Where I've shipped">
      <ul className="space-y-5">
        {experience.map((item, index) => (
          <Reveal as="li" key={item.company} delay={index * 0.06}>
            <ExperienceCard item={item} />
          </Reveal>
        ))}
      </ul>

      <div className="mt-16">
        <Reveal>
          <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            The stack
          </h3>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal key={group.category} delay={index * 0.05}>
              <Card interactive className="h-full p-5">
                <p className="mb-3 text-sm font-semibold tracking-tight">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
