"use client";

import * as React from "react";

/**
 * Tracks which section is currently in view.
 *
 * Deliberately position-based rather than IntersectionObserver-based: with an
 * observer band, a section's bottom edge can touch the band's top edge and be
 * reported as a zero-area intersection, which makes the outgoing section win
 * and leaves the nav one tab behind. Comparing each section's top against the
 * line just under the sticky nav is unambiguous and behaves the same scrolling
 * up or down.
 *
 * @param ids      Section ids in document order.
 * @param offset   Height of the sticky nav; the line sections must cross.
 */
export function useScrollSpy(ids: readonly string[], offset = 96) {
  const [activeId, setActiveId] = React.useState<string>(ids[0] ?? "");

  React.useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) return;

      // Bottom of the page: the last section can be too short to reach the
      // line, so make it active once there's nothing left to scroll.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      // The last section whose top has passed under the nav is the one being
      // read; before any has, the first section stays active.
      const line = offset + 1;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return activeId;
}
