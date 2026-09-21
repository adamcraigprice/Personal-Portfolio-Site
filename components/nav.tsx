"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems, siteConfig } from "@/lib/data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const sectionIds = navItems.map((item) => item.id);

export function Nav() {
  const activeId = useScrollSpy(sectionIds);
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on Escape so keyboard users aren't trapped.
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ease-out",
        scrolled
          ? "border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-md",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-content items-center justify-between px-6 transition-all duration-300 ease-out",
          scrolled ? "h-14" : "h-20",
        )}
      >
        <a
          href="#home"
          className="font-mono text-sm font-medium tracking-tight transition-colors hover:text-accent"
        >
          {siteConfig.name.toLowerCase().replace(" ", ".")}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left",
                    "after:scale-x-0 after:bg-accent after:transition-transform after:duration-200",
                    "hover:text-accent hover:after:scale-x-100",
                    isActive
                      ? "text-accent [text-shadow:0_0_18px_hsl(var(--accent)/0.5)] after:scale-x-100"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto flex max-w-content flex-col px-6 py-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                aria-current={activeId === item.id ? "location" : undefined}
                className={cn(
                  "block rounded-md px-3 py-3 text-sm transition-colors",
                  activeId === item.id
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
