# Portfolio — Alex Kovac

Personal frontend developer portfolio. Single-page SPA with cursor-reactive Three.js grid mesh, floating particles, glitch typography, and Framer Motion animations.

## Tech

- **Next.js 15** (App Router)
- **TypeScript**
- **Three.js** — cursor-reactive deforming grid + particle field via custom GLSL shaders
- **Framer Motion** — staggered entrance animations + hover states
- **Tailwind CSS**

## Get started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

All personal info is in `src/app/page.tsx`:

- **Name / title** — edit the `GlitchText` and outline text in the `<h1>` / `<p>` block
- **Bio line** — the paragraph below the title
- **Tech stack** — `TECH_STACK` array
- **Contacts** — `CONTACTS` array (label + href)
- **Status bar** — bottom line with location/timezone

Three.js scene config is in `src/components/Scene.tsx`:
- `SEG` — grid resolution (higher = smoother, heavier)
- `PARTICLE_COUNT` — number of floating dots
- Mouse repel/ripple strength is in the vertex shader uniforms

## Deploy

```bash
# Vercel (recommended)
npx vercel

# or build static
npm run build
npm start
```
