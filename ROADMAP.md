# Roadmap — olinda_utils.js

A high-level view of where `olinda_utils.js` is headed.
For detailed per-version feature lists see [`docs/ROADMAP.md`](docs/ROADMAP.md).

Priorities may shift based on community feedback and real-world usage.

---

## Current State — v0.4.2

| Area | Status |
|---|---|
| Core modules | `colors`, `logger` (stateful classes) |
| Utils modules | `utils/string` · `utils/array` · `utils/object` (26 pure functions) |
| Distribution | jsDelivr CDN from GitHub (no npm publish yet) |
| Builds | CJS (`dist/`) + ESM (`dist/esm/`) + TypeScript declarations |
| Test coverage | 98.33% statements · 235 tests |
| CI | GitHub Actions — Node 18 / 20 / 22; ESM build; integration tests; pack dry-run |
| Docs | `API.md`, `ARCHITECTURE.md`, `GETTING_STARTED.md`, `colors.md`, `logger.md`, `utils.md` |

---

## v0.4.x — Structural Consolidation ✅

> **Goal:** align the physical layout with the documented architecture before the surface grows larger.

- Split `src/core/utils.ts` into domain modules under `src/utils/`:
  `string.ts` · `array.ts` · `object.ts` (re-export barrel preserved for backward compat)
- Added baseline benchmarks (`test/benchmarks/`), shared fixtures (`test/helpers/`),
  and integration smoke tests (CJS and ESM) against the compiled `dist/`
- ESM build, integration tests, and `npm pack` dry-run added to CI pipeline
- `CONTRIBUTING.md` expanded with pre-commit hooks section and full test command reference

---

## v0.5.x — New Utility Domains

> **Goal:** expand into the most common everyday needs.

- **Number utilities** — `clamp`, `lerp`, `roundTo`, `formatNumber`, `randomInt`, `sum`, `average`, `median`
- **Date utilities** — `formatDate`, `addDays`, `diffDays`, `startOfDay`, `isBefore`, `parseDate`
- **Validation utilities** — `isEmail`, `isURL`, `isUUID`, `isCPF`, `isCNPJ`, `isPhoneNumber`

---

## v0.6.x — Browser & Environment Utilities

> **Goal:** make the library equally useful in browser and Node.js contexts.

- **URL utilities** — `parseQuery`, `stringifyQuery`, `buildURL`, `getURLParam`
- **Environment detection** — `isBrowser`, `isNode`, `isDeno`, `isMobile`, `isDarkMode`
- **Async utilities** — `sleep`, `retry`, `timeout`, `debounce`, `throttle`, `memoize`, `once`

---

## v0.7.x — Performance & Observability

> **Goal:** give consumers insight into what the library does at runtime.

- Publish benchmark results to `docs/benchmarks/` on every release; track regressions in CI
- **Logger enhancements** — JSON output mode, log rotation, child loggers, pluggable transports
- Tree-shaking validation: CI job verifying that importing a single function doesn't pull unrelated code

---

## v0.8.x — Ecosystem & Distribution

> **Goal:** expand distribution channels and lower the integration barrier.

- **npm publish** — `olinda_utils.js` (or scoped `@mpbarbosa/olinda_utils`); automated from CI on tag
- **Framework examples** — `examples/browser`, `examples/node-cjs`, `examples/node-esm`, `examples/vite`, `examples/deno`
- **Documentation site** (GitHub Pages) with JSDoc API reference, Markdown guides, and live REPL embeds

---

## v0.9.x — Stabilisation

> **Goal:** lock the API before committing to semver stability guarantees.

- Deprecation pass with `@deprecated` JSDoc tags and a `docs/MIGRATION.md` guide
- **i18n / formatting** — `pluralize`, `formatCurrency`, `formatBytes`, `formatDuration`
- **Security hardening** — `escapeHTML`, `escapeCSS`, `sanitizeFilename` (OWASP-reviewed)
- Release candidate: API freeze, full JSDoc audit, branch coverage raised to 100%, final performance baseline

---

## v1.0.0 — Stable Release

> **Milestone:** semver-stable, production-ready, long-term-supported.

- No breaking changes within the v1.x line without a major version bump
- CI gates: lint ✅ · type-check ✅ · tests ✅ · coverage ≥ 95% ✅
- Automated release pipeline: tag → build → npm publish → CDN → GitHub Release notes
- `SECURITY.md` with a coordinated-disclosure process
- Community: issue templates, discussion categories, `good first issue` label

---

## Ongoing (Every Release)

| Practice | Target |
|---|---|
| Test coverage | ≥ 80% (current); ≥ 95% from v0.9 |
| Cyclomatic complexity | ≤ 10 per function (ESLint-enforced) |
| Zero `any` in source | `noImplicitAny` + `strict: true` |
| Runtime dependencies | Zero |
| Markdown lint | `markdownlint` clean on every PR |
| Security audit | `npm audit` — zero high/critical alerts |
| Changelog | Every release entry in `CHANGELOG.md` |

---

## Out of Scope

The following are explicitly **not planned** for this library:

- DOM manipulation (use a DOM library)
- HTTP client wrappers (use `fetch` or `axios` directly)
- Framework-specific hooks or components (React / Vue / Angular)
- State management
- Build tooling (webpack plugins, Vite plugins, etc.)

---

*Last updated: v0.4.2 — 2026-03-10*
