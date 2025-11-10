# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains Formily bindings per Element Plus widget (e.g., `src/select/`, `src/upload/`). Shared utilities live in `src/__builtins__/shared/`, and every export is surfaced through `src/index.ts`.
- Tests reside beside utilities in `src/__builtins__/shared/__test__/` using `*.test.ts` naming; mirror this co-location if you add new helpers.
- `docs/` hosts the VitePress documentation theme, while `build/` stores automation such as `build/create-style`.
- Published bundles emit to `esm/`; never edit files there directly.

## Build, Test, and Development Commands
- `pnpm build` runs `vite build` to emit the library plus type declarations (see `vite.config.ts` + `vite-plugin-dts`).
- `pnpm docs:dev` boots the VitePress site for live component demos; use `pnpm docs:build` and `pnpm docs:preview` before publishing docs.
- `pnpm lint` / `pnpm lint:fix` apply the shared ESLint config, and `pnpm create:style` regenerates component styles when adding tokens.
- `pnpm release` hands off to `release-it` once CI is green.

## Coding Style & Naming Conventions
- TypeScript + Vue SFCs use 2-space indentation, single quotes, and trailing commas per `eslint.config.js` (extends `@antfu/eslint-config` and `eslint-plugin-vue`).
- Export components through kebab-case directories but PascalCase symbols (e.g., `src/tree-select` → `TreeSelect`).
- Prefer composition utilities from `src/__builtins__`; avoid duplicating helpers and add comments only for non-obvious logic.

## Testing Guidelines
- Vitest is configured in `vitest.config.ts`; interactive work uses `pnpm test` (Vitest UI), while `pnpm coverage` runs headless with Istanbul.
- Follow the current pattern (`__test__/foo.test.ts`) and assert both form logic and Element Plus rendering.
- Aim for meaningful assertions instead of snapshot dumps, and watch coverage reports for regressions before opening a PR.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits enforced by Commitlint (`docs(docs): ...`, `feat(component): ...`). Use `pnpm commit` to launch `czg` and keep messages compliant.
- Keep commits focused: implementation, tests, docs. Husky + lint-staged will run ESLint on staged files; fix issues before retrying.
- PRs should link to tracking issues, summarize user-facing changes, mention test coverage, and attach screenshots or GIFs when UI behavior changes.
