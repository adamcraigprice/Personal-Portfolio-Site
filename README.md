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
  nav.tsx               sticky nav, scroll-spy, mobile menu
  section.tsx           section wrapper (landmark + heading)
  reveal.tsx            shared Framer Motion scroll-reveal
  gradient-mesh.tsx     hero background glow
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

## Accessibility

Semantic landmarks, a single `h1`, a skip-to-content link, `aria-current` on the active nav tab, `aria-expanded`/`aria-controls` on the experience disclosures and mobile menu, visible focus rings throughout, and a `prefers-reduced-motion` guard that disables the background drift and scroll reveals.
