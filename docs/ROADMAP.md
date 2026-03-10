# Roadmap — olinda_utils.js

This document outlines the planned evolution of `olinda_utils.js` from its current
state (v0.4.2) toward a stable v1.0 release.

Priorities may shift based on community feedback and real-world usage patterns.

---

## Current State — v0.4.2

| Area | Status |
|---|---|
| Core modules | `colors`, `logger` (stateful classes) |
| Utils modules | `utils/string` · `utils/array` · `utils/object` (26 pure functions) |
| Test coverage | 98.33% statements · 235 tests |
| Distribution | jsDelivr CDN from GitHub (no npm publish) |
| Builds | CJS (`dist/`) + ESM (`dist/esm/`) |
| TypeScript | Strict mode · declaration files generated · `exports` types map |
| CI | GitHub Actions — Node 18 / 20 / 22; pack dry-run; integration tests |
| Docs | `API.md`, `ARCHITECTURE.md`, `GETTING_STARTED.md`, `colors.md`, `logger.md`, `utils.md` |

---

## v0.4.x — Structural Consolidation ✅

> Goal: align the physical layout with the documented architecture and add
> missing utility categories before the surface grows larger.

### v0.4.0 — Module Split & Type Safety ✅

- Moved `src/core/utils.ts` functions into `src/utils/` sub-modules by domain:
    - `src/utils/string.ts` — `camelCase`, `kebabCase`, `snakeCase`, `pascalCase`,
    `capitalize`, `truncate`, `sanitize`, `cleanWhitespace`, `escapeRegex`
    - `src/utils/array.ts` — `dedupe`, `chunk`, `flatten`, `groupBy`, `sortBy`,
    `intersection`, `difference`, `partition`
    - `src/utils/object.ts` — `deepClone`, `deepMerge`, `pick`, `omit`,
    `getProperty`, `setProperty`, `hasProperty`, `deepEqual`, `isEmpty`
- `src/core/utils.ts` converted to a re-export barrel (backward-compatible)
- `src/core/` retained for stateful classes (`colors`, `logger`)
- Test files split: `test/utils/string.test.ts`, `test/utils/array.test.ts`,
  `test/utils/object.test.ts`; `test/core/utils.test.ts` replaced with a surface smoke test
- No API surface changes — re-exports everything from `src/index.ts`

### v0.4.1 — Test Infrastructure ✅

- `test/helpers/fixtures.ts` — typed shared constants reused across test suites
- `test/benchmarks/array.benchmark.ts` + `object.benchmark.ts` — baseline benchmarks
- `test/integration/cjs.test.ts` — `require()` smoke test against compiled `dist/src/index.js`
- `test/integration/esm.test.ts` — `node --input-type=module` smoke test against `dist/esm/`

### v0.4.2 — Developer Experience ✅

- TypeScript declaration files committed to CDN-served tree; `exports` types map in `package.json`
- `npm pack --dry-run` step added to CI (Node 22 only) to surface packaging issues early
- ESM build step added to CI (`npm run build:esm`)
- Integration tests wired into CI pipeline
- `CONTRIBUTING.md` expanded with pre-commit hooks section and full test command reference

---

## v0.5.x — New Utility Domains

> Goal: grow the utility surface into the most common everyday needs.

### v0.5.0 — Number Utilities (`src/utils/number.ts`)

- `clamp(value, min, max)` — bound a number within a range
- `lerp(a, b, t)` — linear interpolation
- `roundTo(value, decimals)` — round to N decimal places
- `formatNumber(value, locale?, options?)` — locale-aware formatting
- `isInteger(value)`, `isFiniteNumber(value)` — type guards
- `randomInt(min, max)` — cryptographically weak but fast integer random
- `sum(numbers)`, `average(numbers)`, `median(numbers)` — statistical helpers

### v0.5.1 — Date Utilities (`src/utils/date.ts`)

- `formatDate(date, pattern)` — lightweight strftime-style formatter
- `addDays(date, n)`, `addMonths(date, n)`, `addYears(date, n)` — date arithmetic
- `diffDays(a, b)`, `diffMonths(a, b)` — differences
- `startOfDay(date)`, `endOfDay(date)`, `startOfMonth(date)`, `endOfMonth(date)`
- `isBefore(a, b)`, `isAfter(a, b)`, `isSameDay(a, b)` — comparisons
- `parseDate(str, pattern?)` — string → Date with explicit pattern support
- No external dependencies; pure functions only

### v0.5.2 — Validation Utilities (`src/utils/validate.ts`)

- `isEmail(str)` — RFC 5322-compliant check
- `isURL(str, options?)` — URL validation with protocol allowlist
- `isUUID(str, version?)` — UUID v1/v4 format check
- `isCPF(str)`, `isCNPJ(str)` — Brazilian document validation
- `isPhoneNumber(str, countryCode?)` — basic international format check
- `isAlpha(str)`, `isAlphanumeric(str)`, `isNumeric(str)` — character-class guards
- Returns `boolean` — never throws

---

## v0.6.x — Browser & Environment Utilities

> Goal: make the library equally useful in browser and Node.js contexts.

### v0.6.0 — URL & Query String Utilities (`src/utils/url.ts`)

- `parseQuery(str)` — query string → `Record<string, string | string[]>`
- `stringifyQuery(params)` — object → query string
- `buildURL(base, path, params?)` — safe URL construction
- `getURLParam(url, key)` — extract a single query param
- `stripTrailingSlash(url)`, `ensureTrailingSlash(url)` — normalisation helpers

### v0.6.1 — Environment Detection (`src/utils/env.ts`)

- `isBrowser()`, `isNode()`, `isDeno()` — runtime detection
- `isMobile()`, `isIOS()`, `isAndroid()` — UA-based mobile detection (browser only)
- `isDarkMode()` — `prefers-color-scheme: dark` check
- `getEnv(key, fallback?)` — `process.env` with a typed fallback (Node only)
- All functions return `boolean` or typed values, never throw

### v0.6.2 — Async Utilities (`src/utils/async.ts`)

- `sleep(ms)` — `Promise<void>` timer
- `retry(fn, options)` — retry with exponential back-off
- `timeout(promise, ms)` — race against a deadline
- `debounce(fn, ms)` — leading/trailing debounce
- `throttle(fn, ms)` — throttle with configurable strategy
- `memoize(fn, keyFn?)` — pure-function result cache
- `once(fn)` — call at most once, subsequent calls return first result

---

## v0.7.x — Performance & Observability

> Goal: give consumers insight into what the library does at runtime.

### v0.7.0 — Benchmark Suite Publication

- Publish benchmark results to `docs/benchmarks/` on every release
- Track performance regressions in CI using relative thresholds
- Document complexity class (O-notation) in JSDoc for all array/object utilities

### v0.7.1 — Logger Enhancements

- Structured logging output (JSON mode) via `LoggerOptions.format: 'json'`
- Log rotation support for file output (`maxSize`, `maxFiles` options)
- Child logger with inherited context: `logger.child({ service: 'api' })`
- Pluggable transport: `LoggerOptions.transport?: (entry: LogEntry) => void`

### v0.7.2 — Tree-Shaking Validation

- Add CI job that imports a single function and verifies the bundle size does
  not include unrelated modules
- Document per-module bundle size in `docs/ARCHITECTURE.md`
- Enforce side-effect-free declaration in `package.json` (`"sideEffects": false`)

---

## v0.8.x — Ecosystem & Distribution

> Goal: expand distribution channels and lower the integration barrier.

### v0.8.0 — npm Publication

- Publish to npm under the `olinda_utils.js` package name (or scoped
  `@mpbarbosa/olinda_utils`)
- Keep jsDelivr/GitHub as the canonical CDN source
- Add `"provenance": true` to `npm publish` for supply-chain transparency
- Automate npm publish from CI on version tag

### v0.8.1 — Framework Integration Examples

- Add `examples/` directory with ready-to-run examples:
    - `examples/browser/` — HTML page using the CDN script tag
    - `examples/node-cjs/` — `require()` usage
    - `examples/node-esm/` — `import` usage
    - `examples/vite/` — Vite project with tree-shaking
    - `examples/deno/` — Deno-compatible import

### v0.8.2 — Documentation Site

- Publish a static docs site (GitHub Pages) auto-generated from JSDoc + Markdown
- Candidates: TypeDoc, VitePress, or Docusaurus
- Include a live REPL (CodeSandbox or StackBlitz embed) for each utility
- Add search powered by Algolia DocSearch (free for open-source)

---

## v0.9.x — Stabilisation

> Goal: lock the API before committing to semver stability guarantees.

### v0.9.0 — Deprecation Pass

- Review all v0.3 → v0.8 exports; deprecate inconsistencies with `@deprecated`
  JSDoc tags
- Add migration guide in `docs/MIGRATION.md` for any breaking changes

### v0.9.1 — Accessibility & i18n

- `pluralize(count, singular, plural?)` — English pluralisation helper
- `formatCurrency(amount, currency, locale?)` — locale-aware currency
- `formatBytes(bytes, decimals?)` — human-readable file sizes
- `formatDuration(ms, style?)` — human-readable elapsed time

### v0.9.2 — Security Hardening

- `escapeHTML(str)` — safe HTML entity encoding
- `escapeCSS(str)` — CSS value sanitisation
- `sanitizeFilename(str)` — cross-platform safe file names
- All functions reviewed against OWASP XSS cheatsheet

### v0.9.3 — Release Candidate

- Freeze public API surface
- Full audit of JSDoc (every `@param`, `@returns`, `@since`, `@example`)
- 100% branch coverage requirement (raise from 75%)
- Final performance baseline recorded in docs

---

## v1.0.0 — Stable Release

> Milestone: semver-stable, production-ready, long-term-supported.

### Commitments at v1.0

- **No breaking changes** within the v1.x line without a major version bump
- Public API fully documented with JSDoc and a published docs site
- CI gates: lint ✅ · type-check ✅ · tests ✅ · coverage ≥ 95% ✅
- Automated release pipeline (tag → build → npm publish → CDN → GitHub Release)
- Security policy (`SECURITY.md`) and a coordinated-disclosure process
- Community: issue templates, discussion categories, a `good first issue` label

---

## Ongoing (Every Release)

| Practice | Target |
|---|---|
| Test coverage | ≥ 80% (current gate); ≥ 95% from v0.9 |
| Cyclomatic complexity | ≤ 10 per function (ESLint enforced) |
| Zero `any` in source | Enforced by `noImplicitAny` + `strict: true` |
| Dependency count | Zero runtime dependencies (devDependencies only) |
| Markdown lint | `markdownlint` clean on every PR |
| Security audit | `npm audit` with zero high/critical alerts |
| Changelog | Every release entry in `CHANGELOG.md` |

---

## Not Planned

The following are explicitly **out of scope** for this library:

- DOM manipulation utilities (use a DOM library)
- HTTP client wrappers (use `fetch` or `axios` directly)
- React/Vue/Angular-specific hooks or components
- State management
- Build tooling (webpack plugins, Vite plugins, etc.)

---

*Last updated: v0.4.2 (2026-03-10)*
