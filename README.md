# Personal Portfolio Site

Adam Price's personal portfolio — a single-page, scroll-driven site with dark/light theming, scroll-spy navigation, and scroll-reveal animation.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · next-themes

---

## Getting started

Requires Node 18.17 or newer.

```bash
npm install
npm run dev       # http://localhost:3000
```

Other scripts:

```bash
npm run build     # production build
npm run start     # serve the production build
npm run lint      # ESLint
```

---

## Editing content

**All copy lives in [`lib/data.ts`](lib/data.ts)** — name, tagline, bio, experience, projects, skills, and social links. Edit there; no component changes needed.

| What to change | Where |
| --- | --- |
| Name, tagline, email, GitHub/LinkedIn URLs | `siteConfig` |
| Nav tabs (also drives scroll-spy) | `navItems` |
| About narrative + education card | `about` |
| Experience cards (summary + expandable bullets) | `experience` |
| Technology chips by category | `skillGroups` |
| Project cards, tags, and links | `projects` |
| Resume download buttons | `resumes` |

Adding a nav tab requires a matching section `id` on the page — `navItems[].id` must equal the `id` passed to `<Section>` in `components/sections/`.

---

## Resume PDFs

Two resumes ship, surfaced side by side in the Resume section:

| File | Shown as |
| --- | --- |
| `public/resume.pdf` | **Forward Deployed** (primary) |
| `public/resume-swe.pdf` | **Software Engineering** |

**To update either resume, overwrite the file in `/public` with the same filename** — no code change needed. To change the labels or descriptions on the buttons, edit `resumes` in `lib/data.ts`.

---

## Theming

Colors are CSS custom properties in [`app/globals.css`](app/globals.css) — `:root` for light, `.dark` for dark. Tailwind reads them via `tailwind.config.ts`, so changing the accent in one place updates buttons, badges, links, focus rings, and the hero glow together.

Dark is the default (`defaultTheme="dark"` in `app/layout.tsx`). Set `enableSystem` to `true` there to follow the OS preference instead.

---

## Deploying to Vercel

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new) — the Next.js preset is detected automatically; no build config needed.
3. Add an environment variable so canonical URLs and OG tags point at the live domain:

   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

4. Deploy. Add a custom domain under **Project → Settings → Domains** if you have one.

The social preview image is generated at build time by [`app/opengraph-image.tsx`](app/opengraph-image.tsx) — there's no image file to maintain. Preview it locally at `http://localhost:3000/opengraph-image`.

---

## Project structure

```
app/
  layout.tsx            fonts, metadata, ThemeProvider
  page.tsx              composes the six sections
  globals.css           design tokens + shared card recipe
  opengraph-image.tsx   generated social preview
components/
  particle-background.tsx  full-page directed-graph canvas background
  nav.tsx               sticky nav, scroll-spy, mobile menu
  section.tsx           section wrapper (landmark + heading)
  reveal.tsx            shared Framer Motion scroll-reveal
  icons.tsx             inline GitHub / LinkedIn marks
  theme-provider.tsx    next-themes wrapper
  theme-toggle.tsx      dark/light toggle
  sections/             hero, about, resume, experience, projects, contact
  ui/                   shadcn primitives (button, card, badge)
hooks/
  use-scroll-spy.ts     IntersectionObserver-based active section
lib/
  data.ts               all site content
  utils.ts              cn() class helper
public/                 resume PDFs
```

## Background

[`components/particle-background.tsx`](components/particle-background.tsx) draws the full-page directed-graph field on a plain `<canvas>` with `requestAnimationFrame` — no particle library. It mounts once in the root layout as a fixed `z-0` layer; all page content sits in a `relative z-10` wrapper above it.

Tuning constants live at the top of the file:

| Constant | Effect |
| --- | --- |
| `AREA_PER_NODE`, `MAX_NODES`, `MAX_NODES_NARROW` | How many nodes, by viewport area (fewer on phones) |
| `LINK_DIST` | Edge connect radius — **lower it for more separate clusters**, raise it to fuse the field into one mesh |
| `LINE_ALPHA`, `NODE_ALPHA` | How visible the edges and nodes are |
| `PACKET_MIN_GAP`, `PACKET_GAP_JITTER`, `MAX_PACKETS`, `PACKET_RADIUS` | Packet frequency, concurrency, and size |
| `CURSOR_DIST`, `REPEL_DIST` | Cursor link radius and soft-repulsion radius |
| `SECTION_BIAS` | Per-section density and clustering (Experience densest, About/Contact sparsest) |

Colors are read from the `--accent` / `--accent-alt` CSS variables, so the background follows the palette in `globals.css` and recolors on theme toggle — there are no hard-coded colors in the component.

It backs off when it should: the loop pauses when the tab is hidden, `prefers-reduced-motion` renders a single static frame with no drift, packets, or cursor interaction, cursor logic is skipped entirely on touch devices, and device pixel ratio is capped at 2x.

The field draws across the whole page, behind text included — it is not cut out around copy. Cards stay readable instead via the `.card-surface` recipe in [`app/globals.css`](app/globals.css), which is deliberately translucent (`bg-card/45`) with only a light blur so the network shows through faintly. Lower that opacity to see more of the background through cards, raise it for more contrast on card text.

## Accessibility

Semantic landmarks, a single `h1`, a skip-to-content link, `aria-current` on the active nav tab, `aria-expanded`/`aria-controls` on the experience disclosures and mobile menu, visible focus rings throughout, and a `prefers-reduced-motion` guard that disables the background drift and scroll reveals.
