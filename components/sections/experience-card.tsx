"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Experience } from "@/lib/data";
import { Card } from "@/components/ui/card";

export function ExperienceCard({ item }: { item: Experience }) {
  const [open, setOpen] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const panelId = `${item.company.toLowerCase().replace(/\s+/g, "-")}-details`;

  const bullets = (
    <ul className="space-y-2.5 border-t border-border/60 pt-4">
      {item.bullets.map((bullet) => (
        <li
          key={bullet.slice(0, 40)}
          className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {bullet}
        </li>
      ))}
    </ul>
  );

  return (
    <Card interactive className="p-6 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-semibold tracking-tight">{item.company}</h3>
        <p className="font-mono text-xs text-muted-foreground">{item.dates}</p>
      </div>

      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-accent">{item.role}</p>
        <p className="font-mono text-xs text-muted-foreground">{item.location}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {item.summary}
      </p>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md font-mono text-xs
                   text-muted-foreground transition-colors hover:text-accent
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                   focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? "Hide details" : "Details"}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {prefersReducedMotion ? (
        <div id={panelId} hidden={!open} className="mt-4">
          {bullets}
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={panelId}
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4">{bullets}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </Card>
  );
}
