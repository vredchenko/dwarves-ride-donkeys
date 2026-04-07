# CLAUDE.md

## Project

Interactive historical map tracing the spread of horsemanship (React 19 + TypeScript + D3 + Vite).

## Package manager

Bun. Always use `bun` instead of `npm`/`yarn`/`pnpm`.

## Commands

- `bun install` — install dependencies
- `bun run dev` — start dev server
- `bun run build` — production build to `dist/`
- `bun run preview` — preview production build
- `bun run typecheck` — type-check with `tsc --noEmit`
- `bun run lint` — ESLint
- `bun run format` — format with Prettier
- `bun run format:check` — check formatting without writing

## CI/CD

GitHub Actions deploys to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`).
Lefthook runs typecheck, lint, and format checks on pre-commit.

## Project structure

- `src/HorseMap.tsx` — main visualization component (D3 + React)
- `src/data.ts` — historical events and divine associations data
- `src/types.ts` — TypeScript type definitions
- `src/main.tsx` — React entry point

## MCP

Chrome DevTools MCP is configured in `.mcp.json` for inspecting the running app (DOM, console, network, screenshots). Launch Chrome with `--remote-debugging-port=9222` to connect.

## Conventions

- Strict TypeScript (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- ES modules (`"type": "module"`)
- Each historical event in `src/data.ts` requires at least one peer-reviewed source
