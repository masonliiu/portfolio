# Portfolio

A two-mode portfolio experience built with Next.js:
- Clean, recruiter-friendly site at `/`
- Immersive 3D room experience at `/immersive`

## Run locally
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Start: `npm run start`

## Architecture overview
- `src/app/page.tsx`: standard portfolio sections.
- `src/app/immersive/page.tsx`: immersive mode entry point.
- `src/components/immersive/`: React Three Fiber scene, hotspots, and panels.
- `src/components/portfolio/`: standard mode sections.
- `public/resume.pdf`: downloadable resume asset.

## Notes
- Immersive mode uses primitives for performance and future GLTF upgrades.
- Mobile falls back to a lightweight preview with the same hotspot panels.
