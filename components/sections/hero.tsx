import { ArrowDown, Mail } from "lucide-react";

import { siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";

/**
 * The hero animates with CSS rather than Framer's `whileInView`, which ships
 * `opacity: 0` in the server-rendered markup. Above the fold that would mean a
 * blank hero until hydration — and nothing at all if JS never runs. A CSS
 * keyframe paints on first frame and needs no JS; the global
 * prefers-reduced-motion rule collapses it to the final state.
 */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`animate-fade-up ${className ?? ""}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      <div className="mx-auto w-full max-w-content px-6 py-32">
        <FadeUp>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            {siteConfig.location}
          </p>
        </FadeUp>

        <FadeUp delay={80}>
          <h1
            id="home-heading"
            className="text-5xl font-semibold tracking-tighter sm:text-6xl md:text-7xl"
          >
            {siteConfig.name}
          </h1>
        </FadeUp>

        <FadeUp delay={160}>
          <p className="mt-4 text-xl font-medium text-accent sm:text-2xl">
            {siteConfig.tagline}
          </p>
        </FadeUp>

        <FadeUp delay={240}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {siteConfig.bio}
          </p>
        </FadeUp>

        <FadeUp delay={320}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#resume">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
                View Resume
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#contact">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Get in Touch
              </a>
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
