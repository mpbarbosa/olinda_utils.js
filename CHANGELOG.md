# Changelog

All notable changes to `olinda_utils.js` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [0.2.0] — 2026-03-03

### Added

- `src/index.ts` — public barrel export
- `package.json` — v0.2.0, build/test/lint/cdn scripts, `engines: node>=18, npm>=9`
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
