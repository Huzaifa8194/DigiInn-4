# DigiInn360 website

Astro static website, adapted from the supplied ONYX template using the juliobsz/skills awwwards workflow.

From `site/`:
- `npm install` (dependencies are already installed)
- `npm run dev` for live development
- `npm run build` for production output in `dist/`
- `node serve.mjs` to preview the production build at http://127.0.0.1:4322/

Main pages: `src/pages/index.astro`, `about.astro`, `services.astro`, `404.astro`.
Design: `src/styles/digi.css`. 3D illustration: `src/motion/security-core.ts`.
Original page routes and design record are preserved in `template-archive/`.

Contact links open email/telephone applications. No backend or live deployment is configured.
The wordmark is a proposed typographic treatment. Content and team names come from digiinn360.com.
Production build can be deployed to a static host; SVG social preview should be converted to PNG before public launch for broad social crawler compatibility.

Browser QA: `node qa.mjs` (uses locally installed Chrome). Results and screenshots: `.shots/`.
