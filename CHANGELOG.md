# Changelog

All notable changes to `olinda_utils.js` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [0.3.9] — 2026-03-03

### Added

- `src/core/utils.ts` — general utility functions module (pure functions only)
    - **String:** `camelCase`, `kebabCase`, `snakeCase`, `pascalCase`, `capitalize`, `truncate`, `sanitize`, `cleanWhitespace`, `escapeRegex`
    - **Array:** `dedupe`, `chunk`, `flatten`, `groupBy`, `sortBy`, `intersection`, `difference`, `partition`
    - **Object:** `deepClone`, `deepMerge`, `pick`, `omit`, `getProperty`, `setProperty`, `hasProperty`, `deepEqual`, `isEmpty`
- `src/index.ts` — re-exports all 26 utils functions
- `test/core/utils.test.ts` — comprehensive tests for all utils functions
- `docs/utils.md` — API reference for the utils module

---

## [0.2.1] — 2026-03-03

### Added

- `src/index.ts` — public barrel export
- `package.json` — v0.2.1, build/test/lint/cdn scripts, `engines: node>=18, npm>=9`
- `tsconfig.json` — CJS build → `dist/`
- `tsconfig.esm.json` — ESM build → `dist/esm/`
- `jest.config.js` — ts-jest, 80% coverage thresholds
- `eslint.config.js` — `@typescript-eslint` rules, complexity gate ≤ 10
- `cdn-delivery.sh` — generates jsDelivr CDN URLs → `cdn-urls.txt`
- `scripts/deploy.sh` — build → commit artifacts → tag → push → CDN URLs
- `scripts/colors.sh` — ANSI colour helpers for shell scripts
- `.npmrc` — `engine-strict=true`
- `docs/API.md` — public API reference
- `docs/ARCHITECTURE.md` — project structure and conventions
