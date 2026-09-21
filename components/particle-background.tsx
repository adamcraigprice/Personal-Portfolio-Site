"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Full-page directed-graph background.
 *
 * A plain canvas + rAF field of nodes joined by short directed edges. Three
 * things keep it from reading as a generic particle field: a minority of nodes
 * are drawn as circuit marks rather than dots, every edge carries an arrowhead
 * oriented low-index -> high-index, and packets travel the edges.
 *
 * The field draws across the whole page, behind text included. Cards and
 * panels are translucent (see `.card-surface` in globals.css) so it stays
 * faintly visible through them rather than being cut out around copy.
 */

type Shape = "dot" | "square" | "plus";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  /** Cursor-repulsion displacement; springs back to zero. */
  ox: number;
  oy: number;
  /** Rendered position for the current frame (drift + repulsion). */
  px: number;
  py: number;
  size: number;
  shape: Shape;
  /** Stable 0..1 threshold compared against the section density bias. */
  rank: number;
  alpha: number;
  hue: 0 | 1;
  /** Neighbour accumulators, reset each frame, used for cohesion steering. */
  sx: number;
  sy: number;
  sn: number;
};

type Packet = { a: number; b: number; t: number };
type SectionMark = { id: string; top: number };
type Palette = { accent: string; alt: string };

const AREA_PER_NODE = 7_000;
const MAX_NODES = 150;
const MAX_NODES_NARROW = 60;
const NARROW_WIDTH = 640;

/**
 * Deliberately shorter than the node spacing implies: with this many nodes a
 * longer radius fuses everything into one continuous mesh, where a shorter one
 * leaves many separate clusters.
 */
const LINK_DIST = 105;
const CURSOR_DIST = 160;
const REPEL_DIST = 60;
const LINE_ALPHA = 0.3;
const NODE_ALPHA = 0.75;
/** Distance below the viewport top at which a section counts as "current". */
const SECTION_LINE = 140;

const PACKET_MIN_GAP = 300;
const PACKET_GAP_JITTER = 700;
const MAX_PACKETS = 12;
const PACKET_RADIUS = 3.2;
const PACKET_DURATION = 1400;

/** Per-section density and clustering bias, keyed by section id. */
const SECTION_BIAS: Record<string, { density: number; cluster: number }> = {
  home: { density: 0.85, cluster: 0.2 },
  about: { density: 0.55, cluster: 0 },
  resume: { density: 0.65, cluster: 0.1 },
  experience: { density: 1, cluster: 1 },
  projects: { density: 0.85, cluster: 0.5 },
  contact: { density: 0.5, cluster: 0 },
};
const SECTION_IDS = Object.keys(SECTION_BIAS);
const DEFAULT_BIAS = SECTION_BIAS.home;

function hsla(triplet: string, alpha: number) {
  const parts = triplet.split(/\s+/);
  return `hsla(${parseFloat(parts[0])}, ${parts[1]}, ${parts[2]}, ${alpha})`;
}

export function ParticleBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const paletteRef = React.useRef<Palette>({
    accent: "255 70% 70%",
    alt: "215 80% 65%",
  });
  const redrawRef = React.useRef<(() => void) | null>(null);

  // Keep canvas colors in step with the theme toggle. The animation loop reads
  // this ref every frame, so updating it is enough while animating; the static
  // reduced-motion frame needs an explicit redraw.
  //
  // The read is deferred a frame on purpose: this component is a child of
  // ThemeProvider, so its effect runs *before* the provider's effect swaps the
  // `dark` class on <html>. Reading synchronously here would pick up the
  // outgoing theme's tokens and leave the canvas painted in the old accent.
  React.useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue("--accent").trim();
      const alt = cs.getPropertyValue("--accent-alt").trim();
      if (accent) paletteRef.current = { accent, alt: alt || accent };
      redrawRef.current?.();
    };
    const id = window.requestAnimationFrame(read);
    return () => window.cancelAnimationFrame(id);
  }, [resolvedTheme]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    let width = 0;
    let height = 0;
    const nodes: Node[] = [];
    let packets: Packet[] = [];
    let sections: SectionMark[] = [];

    let density = DEFAULT_BIAS.density;
    let cluster = DEFAULT_BIAS.cluster;
    let targetDensity = DEFAULT_BIAS.density;
    let targetCluster = DEFAULT_BIAS.cluster;

    const mouse = { x: 0, y: 0, active: false };
    let frameId = 0;
    let scrollFrame = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let last = 0;
    let nextPacketAt = 0;
    let reduced = reduceQuery.matches;

    const activeEdges: { a: number; b: number }[] = [];

    /* ---------------------------------------------------------------- setup */

    const makeNode = (): Node => {
      const roll = Math.random();
      // ~15% circuit marks so the field reads as a graph, not a particle spray.
      const shape: Shape =
        roll > 0.925 ? "plus" : roll > 0.85 ? "square" : "dot";
      const speed = 0.003 + Math.random() * 0.005;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        ox: 0,
        oy: 0,
        px: 0,
        py: 0,
        size: 2.6 + Math.random() * 1.6,
        shape,
        rank: Math.random(),
        alpha: 1,
        hue: Math.random() > 0.7 ? 1 : 0,
        sx: 0,
        sy: 0,
        sn: 0,
      };
    };

    const targetCount = () => {
      const cap = width < NARROW_WIDTH ? MAX_NODES_NARROW : MAX_NODES;
      return Math.max(
        24,
        Math.min(cap, Math.round((width * height) / AREA_PER_NODE)),
      );
    };

    /** Add or drop nodes to hit the target without regenerating the field. */
    const syncCount = () => {
      const want = targetCount();
      while (nodes.length < want) nodes.push(makeNode());
      if (nodes.length > want) nodes.length = want;
    };

    /** Section offsets in document coordinates; only scroll/resize move these. */
    const measureSections = () => {
      const sy = window.scrollY;
      sections = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return { id, top: el.getBoundingClientRect().top + sy };
      }).filter((s): s is SectionMark => s !== null);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncCount();
      measureSections();
      updateBias();
    };

    /** Pick the section under the nav line and aim the bias at it. */
    const updateBias = () => {
      let current = DEFAULT_BIAS;

      // The last section is too short to push its own top past the line before
      // the page runs out of scroll, so treat hitting the bottom as reaching
      // it — matching how the nav's scroll-spy resolves the same case.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom && sections.length > 0) {
        current = SECTION_BIAS[sections[sections.length - 1].id] ?? current;
      } else {
        const line = window.scrollY + SECTION_LINE;
        for (const s of sections) {
          if (s.top <= line) current = SECTION_BIAS[s.id] ?? current;
        }
      }
      targetDensity = current.density;
      targetCluster = current.cluster;
      if (reduced) {
        density = targetDensity;
        cluster = targetCluster;
      }
    };

    /* --------------------------------------------------------------- drawing */

    /** Chevron appended to the current path, pointing along `angle`. */
    const chevron = (x: number, y: number, angle: number, size: number) => {
      const a1 = angle + Math.PI * 0.8;
      const a2 = angle - Math.PI * 0.8;
      ctx.moveTo(x + Math.cos(a1) * size, y + Math.sin(a1) * size);
      ctx.lineTo(x, y);
      ctx.lineTo(x + Math.cos(a2) * size, y + Math.sin(a2) * size);
    };

    const drawNode = (n: Node, color: string) => {
      const r = n.size / 2;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      if (n.shape === "dot") {
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      if (n.shape === "square") {
        ctx.fillRect(n.px - r, n.py - r, r * 2, r * 2);
        return;
      }
      const arm = r + 1.4;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(n.px - arm, n.py);
      ctx.lineTo(n.px + arm, n.py);
      ctx.moveTo(n.px, n.py - arm);
      ctx.lineTo(n.px, n.py + arm);
      ctx.stroke();
      ctx.lineWidth = 1;
    };

    const render = () => {
      const { accent, alt } = paletteRef.current;
      ctx.clearRect(0, 0, width, height);
      activeEdges.length = 0;

      // Edges. Always oriented low index -> high index so the arrowheads read
      // as one consistent flow direction across the whole field.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.alpha < 0.04) continue;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (b.alpha < 0.04) continue;

          const dx = b.px - a.px;
          const dy = b.py - a.py;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST || dist < 0.001) continue;

          // Cohesion accumulators drive the per-section clustering.
          a.sx += b.px;
          a.sy += b.py;
          a.sn++;
          b.sx += a.px;
          b.sy += a.py;
          b.sn++;

          const fade = 1 - dist / LINK_DIST;
          const alpha = LINE_ALPHA * fade * Math.min(a.alpha, b.alpha);
          if (alpha < 0.008) continue;

          ctx.strokeStyle = hsla(accent, alpha);
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          chevron(a.px + dx * 0.55, a.py + dy * 0.55, Math.atan2(dy, dx), 3.6);
          ctx.stroke();

          activeEdges.push({ a: i, b: j });
        }
      }

      // Cursor acts as a virtual node: real nodes point into it.
      if (mouse.active && !reduced) {
        for (const n of nodes) {
          if (n.alpha < 0.04) continue;
          const dx = mouse.x - n.px;
          const dy = mouse.y - n.py;
          const dist = Math.hypot(dx, dy);
          if (dist > CURSOR_DIST || dist < 0.001) continue;

          const alpha = LINE_ALPHA * 1.4 * (1 - dist / CURSOR_DIST) * n.alpha;
          ctx.strokeStyle = hsla(accent, alpha);
          ctx.beginPath();
          ctx.moveTo(n.px, n.py);
          ctx.lineTo(mouse.x, mouse.y);
          chevron(n.px + dx * 0.62, n.py + dy * 0.62, Math.atan2(dy, dx), 3.6);
          ctx.stroke();
        }
      }

      // Nodes.
      for (const n of nodes) {
        if (n.alpha < 0.04) continue;
        const base = n.hue === 1 ? alt : accent;
        drawNode(n, hsla(base, NODE_ALPHA * n.alpha));
      }

      // Packets: a bright dot running an edge tail -> head.
      if (packets.length > 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = hsla(accent, 0.85);
        for (const p of packets) {
          const a = nodes[p.a];
          const b = nodes[p.b];
          if (!a || !b) continue;
          const x = a.px + (b.px - a.px) * p.t;
          const y = a.py + (b.py - a.py) * p.t;
          const alpha = p.t > 0.8 ? (1 - p.t) / 0.2 : 1;
          ctx.fillStyle = hsla(accent, 0.95 * alpha);
          ctx.beginPath();
          ctx.arc(x, y, PACKET_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    };

    /* ---------------------------------------------------------------- update */

    const step = (dt: number) => {
      density += (targetDensity - density) * 0.03;
      cluster += (targetCluster - cluster) * 0.03;

      const margin = LINK_DIST;
      for (const n of nodes) {
        // Cohesion steering: turn toward the local centroid, but renormalise so
        // the drift speed stays constant and the field can't collapse.
        if (cluster > 0.01 && n.sn > 0) {
          const cx = n.sx / n.sn - n.px;
          const cy = n.sy / n.sn - n.py;
          const d = Math.hypot(cx, cy);
          if (d > 0.001) {
            const turn = 0.015 * cluster;
            n.vx += ((cx / d) * n.speed - n.vx) * turn;
            n.vy += ((cy / d) * n.speed - n.vy) * turn;
            const sp = Math.hypot(n.vx, n.vy) || 1;
            n.vx = (n.vx / sp) * n.speed;
            n.vy = (n.vy / sp) * n.speed;
          }
        }
        n.sx = 0;
        n.sy = 0;
        n.sn = 0;

        n.x += n.vx * dt;
        n.y += n.vy * dt;

        if (n.x < -margin) n.x = width + margin;
        else if (n.x > width + margin) n.x = -margin;
        if (n.y < -margin) n.y = height + margin;
        else if (n.y > height + margin) n.y = -margin;

        // Soft repulsion stored as a decaying offset, so drift is never
        // corrupted and the node eases back once the cursor leaves.
        if (mouse.active && !reduced) {
          const dx = n.x + n.ox - mouse.x;
          const dy = n.y + n.oy - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < REPEL_DIST && d > 0.001) {
            const push = (1 - d / REPEL_DIST) * 1.6;
            n.ox += (dx / d) * push;
            n.oy += (dy / d) * push;
          }
        }
        n.ox *= 0.9;
        n.oy *= 0.9;

        n.px = n.x + n.ox;
        n.py = n.y + n.oy;

        const want = n.rank < density ? 1 : 0;
        n.alpha += (want - n.alpha) * 0.05;
      }

      if (packets.length > 0) {
        packets = packets.filter((p) => {
          p.t += dt / PACKET_DURATION;
          const a = nodes[p.a];
          const b = nodes[p.b];
          if (!a || !b) return false;
          if (Math.hypot(b.px - a.px, b.py - a.py) > LINK_DIST * 1.4) {
            return false;
          }
          return p.t < 1;
        });
      }
    };

    const maybeSpawnPacket = (now: number) => {
      if (reduced || packets.length >= MAX_PACKETS || activeEdges.length === 0) {
        return;
      }
      if (now < nextPacketAt) return;
      const edge = activeEdges[Math.floor(Math.random() * activeEdges.length)];
      packets.push({ a: edge.a, b: edge.b, t: 0 });
      nextPacketAt = now + PACKET_MIN_GAP + Math.random() * PACKET_GAP_JITTER;
    };

    const loop = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      step(dt);
      render();
      maybeSpawnPacket(now);
      frameId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (frameId !== 0 || reduced) return;
      last = performance.now();
      nextPacketAt = last + 300 + Math.random() * 500;
      frameId = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    /** One settled frame for reduced-motion and theme changes while paused. */
    const staticFrame = () => {
      density = targetDensity;
      cluster = targetCluster;
      for (const n of nodes) {
        n.px = n.x;
        n.py = n.y;
        n.alpha = n.rank < density ? 1 : 0;
      }
      render();
    };

    /* -------------------------------------------------------------- listeners */

    const onScroll = () => {
      if (scrollFrame !== 0) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        measureSections();
        updateBias();
        if (reduced) staticFrame();
      });
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced) staticFrame();
      }, 150);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onReduceChange = () => {
      reduced = reduceQuery.matches;
      if (reduced) {
        stop();
        mouse.active = false;
        staticFrame();
      } else {
        start();
      }
    };

    resize();

    // Reveal animations shift section offsets after first paint; re-measure so
    // the density bias lines up with the settled layout.
    const settleTimer = setTimeout(() => {
      measureSections();
      updateBias();
      if (reduced) staticFrame();
    }, 600);

    // Disclosures and reveals change section heights; keep offsets in step.
    const observer = new ResizeObserver(() => {
      measureSections();
      updateBias();
    });
    const main = document.getElementById("main");
    if (main) observer.observe(main);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (hoverQuery.matches) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave);
    }
    reduceQuery.addEventListener("change", onReduceChange);

    redrawRef.current = () => {
      if (reduced) staticFrame();
    };

    if (reduced) staticFrame();
    else start();

    return () => {
      stop();
      if (scrollFrame !== 0) window.cancelAnimationFrame(scrollFrame);
      clearTimeout(resizeTimer);
      clearTimeout(settleTimer);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      reduceQuery.removeEventListener("change", onReduceChange);
      redrawRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
