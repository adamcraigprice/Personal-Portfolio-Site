import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

type SectionProps = {
  id: string;
  heading: string;
  /** Short mono label rendered above the heading. */
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};

/** Consistent vertical rhythm, landmark semantics, and heading treatment. */
export function Section({ id, heading, eyebrow, children, className }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("mx-auto w-full max-w-content px-6 py-20 md:py-28", className)}
    >
      <Reveal className="mb-10 md:mb-14">
        {eyebrow ? (
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={headingId}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        >
          {heading}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}
