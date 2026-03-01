# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js (App Router) frontend in TypeScript.
- `app/`: main application code (`layout.tsx`, `page.tsx`, global styles).
- `public/`: static assets (SVGs, icons) served directly.
- Root config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`.
- No dedicated `tests/` directory exists yet.

## Build, Test, and Development Commands
- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run build`: create production build (catches type/build issues).
- `npm run start`: run the production build locally.
- `npm run lint`: run ESLint with Next.js + TypeScript rules.
- `cd "/home/israel/Documentos/Escuela 8vo Semestre/NoSql/Proyecto_Unidad1/backend" && uvicorn main:app --reload --port 8000`: run the FastAPI backend used by this UI.

Run `npm run lint && npm run build` before opening a PR.

## Coding Style & Naming Conventions
- Language: TypeScript (`.ts`/`.tsx`) with strict mode enabled.
- Indentation: 2 spaces; keep lines readable and avoid deeply nested JSX.
- Components/types: `PascalCase` (`DashboardSection`, `VehiculoDetalle`).
- Variables/functions: `camelCase`; constants: `UPPER_SNAKE_CASE` (`API_BASE`).
- Prefer typed interfaces for API payloads and explicit union types for UI state.
- Styling uses Tailwind CSS v4 in `app/globals.css`; keep utility classes grouped logically.

## Testing Guidelines
No testing framework is configured yet. Until one is added:
- Treat `npm run lint` and `npm run build` as required quality gates.
- Manually verify main flows: dashboard metrics, vehicle list/filter, edit/delete, CSV export.
- Verify backend endpoints consumed by UI: `/vehiculos`, `/vehiculos/estatus`, `/tipos`, `/vehiculos/export`.

When adding tests, use `*.test.ts(x)` naming and colocate with components or group under `tests/`.

## Commit & Pull Request Guidelines
Current history is minimal (`init`, scaffold commit), so use clear imperative commits.
- Example: `feat: add vehicle maintenance type table`
- Keep commits focused and scoped to one change.

PRs should include:
- Short summary of what changed and why.
- Screenshots/GIFs for UI updates.
- API/environment notes (for example `NEXT_PUBLIC_API_URL`).

## Security & Configuration Tips
- Configure backend URL via `NEXT_PUBLIC_API_URL` (default fallback is localhost).
- Backend lives at `/home/israel/Documentos/Escuela 8vo Semestre/NoSql/Proyecto_Unidad1/backend` and uses PostgreSQL env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- Ensure CORS allows `http://localhost:3000` when developing locally.
- Do not commit secrets or environment-specific credentials.
