# Repository Guidelines

## Project Overview
This repo is Mason Liu’s portfolio:
- Default mode: clean, recruiter-friendly and professional site
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

## Code Style Rules (subject to change if needed)
- TypeScript + React (Next.js App Router).
- Use Tailwind utility classes; avoid heavy component libraries.
- Keep immersive scene lightweight (primitives first, GLTF later).
- Respect accessibility: focus states, keyboard access, `prefers-reduced-motion`.

## File Structure (easily subject to change)
- `src/components/immersive/`: scene, hotspots, panels, data, etc
- `src/components/portfolio/`: standard page sections, etc
- `public/`: static assets such as `resume.pdf`.

## Agent Workflow
- Keep commits small and reviewable.
- After each small milestone: show changed files and run `npm run lint` when possible.
