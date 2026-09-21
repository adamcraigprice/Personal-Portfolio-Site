import { Download } from "lucide-react";

import { resumes, siteConfig } from "@/lib/data";
import { LinkedinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";

export function ResumeSection() {
  return (
    <Section id="resume" heading="Resume" eyebrow="02 — The one-pager">
      <Reveal>
        <Card className="mx-auto max-w-2xl p-8 text-center md:p-10">
          <p className="text-base leading-relaxed text-muted-foreground">
            Two versions of the same story — pick whichever fits the role.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {resumes.map((resume) => (
              <div
                key={resume.file}
                className="flex flex-col items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-5"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-accent">
                  {resume.label}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {resume.description}
                </p>
                <Button asChild variant="contrast" className="mt-auto w-full">
                  <a href={resume.file} download>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download
                    <span className="sr-only"> {resume.label} resume (PDF)</span>
                  </a>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button asChild variant="link">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon className="h-4 w-4" aria-hidden="true" />
                View on LinkedIn
              </a>
            </Button>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
