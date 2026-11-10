# Project Kratos — Website

The website of **Project Kratos**, the Mars rover team of BITS Pilani, K. K. Birla Goa Campus.

- **Live site:** https://kratos-the-rover.github.io
- **Preview of `development-branch`:** https://kratos-the-rover.github.io/preview-site/

## Stack

- [Vite](https://vite.dev) — dev server and production build
- [GSAP](https://gsap.com) + ScrollTrigger — scroll-driven animation
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling
- [three.js](https://threejs.org) — the ARIES 3D sequence (loaded on demand)

No framework: the page is rendered from template functions and plain DOM APIs.

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Project structure

```
index.html
public/                 static files served as-is (photos, team portraits, ARIES renders, 3D model)
src/
  main.js               renders the page and initialises every section, in page order
  core/                 smooth scrolling, cursor, text scramble, DOM helpers, stale-build reload
  effects/              stars, smoke, nebulae, the cursor-web canvas and the triangle scrollbar
  sections/             one module per section: its markup and its behaviour
  three/                the ARIES camera sequence (three.js)
  data/                 site copy, team and gallery content
  styles/               one stylesheet per area, imported in order by index.css
```

Sections are initialised in page order on purpose: pinned sections add scroll distance, and
ScrollTrigger measures every trigger after the pins above it.

## Editing content

Text, stats, competitions, videos and contact details live in `src/data/site.js`.
Team members are in `src/data/team.json` and gallery photos in `src/data/gallery.json`;
their image paths are relative to `public/`.

## Deployment

Pushes to `development-branch` are built and published to the preview site by a workflow in
[`Kratos-The-Rover/preview-site`](https://github.com/Kratos-The-Rover/preview-site). It checks for new
commits every 15 minutes; run the **Build preview** workflow there to publish immediately.
