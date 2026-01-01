# Repository Guidelines

## Project Overview
This repo is Mason Liu’s portfolio:
- Default mode: clean, recruiter-friendly site at `/`.
- Immersive mode: cinematic 3D room experience at `/immersive` with clickable hotspots for Projects, Skills, Experience, Resume, and Contact.

## Setup Commands
- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Run production: `npm run start`

## Build, Test, and Lint
- `npm run dev`: Next.js dev server with fast refresh.
- `npm run build`: production build output.
- `npm run start`: serve the production build.
- `npm run lint`: ESLint checks; must pass before PRs.

## Code Style Rules
- TypeScript + React (Next.js App Router).
- Use Tailwind utility classes; avoid heavy component libraries.
- Keep immersive scene lightweight (primitives first, GLTF later).
- Respect accessibility: focus states, keyboard access, `prefers-reduced-motion`.

## File Structure
- `src/app/page.tsx`: normal portfolio landing page.
- `src/app/immersive/page.tsx`: immersive route.
- `src/components/immersive/`: scene, hotspots, panels, data.
- `src/components/portfolio/`: standard page sections.
- `public/`: static assets such as `resume.pdf`.

## How To Add a New Hotspot
1) Add an entry to `src/components/immersive/data.ts` with `id`, `label`, `position`, `radius`, and `panelKey`.
2) Add panel content in `src/components/immersive/Panels.tsx` keyed by `panelKey`.
3) Hotspots are rendered from the data list in `src/components/immersive/Hotspots.tsx`.
4) Verify hover shows a pointer, click opens the correct panel, and Escape closes panels.

## Agent Workflow
- Keep commits small and reviewable.
- After each milestone: show changed files and run `npm run lint` when possible.
