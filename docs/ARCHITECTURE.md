# Architecture — olinda_utils.js

## Overview

`olinda_utils.js` is a TypeScript-authored, CDN-delivered JavaScript utility library.
It is distributed via **jsDelivr from GitHub** — no npm publish required.

---

## Directory Structure

```
olinda_utils.js/
├── src/
│   ├── core/             # Core utility classes
│   ├── utils/            # Pure utility functions
│   └── index.ts          # Public barrel export
├── test/
│   ├── core/             # Unit tests for src/core/
│   ├── utils/            # Unit tests for src/utils/
│   ├── integration/      # Integration tests
│   ├── benchmarks/       # Performance benchmarks (excluded from coverage)
│   ├── helpers/          # Shared fixtures and constants
│   └── index.test.ts     # Smoke tests for the public export surface
├── docs/
│   ├── API.md            # Public API reference
│   ├── ARCHITECTURE.md   # This file
│   ├── GETTING_STARTED.md
│   ├── colors.md         # colors module reference
│   └── logger.md         # logger module reference
├── dist/
│   ├── src/              # CJS compiled output (tracked for CDN)
│   └── types/            # TypeScript declaration files
├── scripts/
│   ├── colors.sh         # ANSI colour helpers
│   └── deploy.sh         # Build → tag → push → CDN URL generation
├── cdn-delivery.sh       # Generates cdn-urls.txt
├── cdn-urls.txt          # Generated — do not hand-edit
├── package.json
├── tsconfig.json         # CJS build
└── tsconfig.esm.json     # ESM build
```

---

## Module Responsibilities

### `src/index.ts`

Barrel re-export. Consumers import exclusively from here:

```typescript
import { ... } from 'olinda_utils.js';
```

---

## Build System

| Command | Output | Purpose |
|---|---|---|
| `npm run build` | `dist/` (CJS) | CDN delivery, Jest/Node |
| `npm run build:esm` | `dist/esm/` | Tree-shaking bundlers |
| `npm run validate` | — | Type-check only (no emit) |

`dist/` is committed to git so jsDelivr can serve it directly from GitHub.

---

## Testing

- **Framework**: Jest + ts-jest (TypeScript natively, no pre-compilation)
- **Coverage threshold**: 80% lines, statements, functions; 75% branches
- **Pattern**: `test/(core|integration|utils|index)/**/*.test.ts`

```bash
npm test            # full suite + coverage
npm run test:core   # core + index only
npm run bench       # performance benchmarks (excluded from coverage)
```

---

## CDN Delivery

Library entry point served from `dist/src/index.js` via jsDelivr:

```
https://cdn.jsdelivr.net/gh/mpbarbosa/olinda_utils.js@{version}/dist/src/index.js
```

Deployment flow (automated by `scripts/deploy.sh`):

1. `npm run build` — compile TypeScript
2. `git add dist/ cdn-delivery.sh` — stage compiled output (skipped if nothing changed)
3. `git commit` — commit artifacts
4. `git pull --rebase origin {branch}` — sync with remote before tagging
5. `git tag v{version}` — version tag (skipped if tag already exists)
6. `git push origin {branch} --tags` — push to GitHub (jsDelivr picks up the tag)
7. `npm run cdn` — generate `cdn-urls.txt`

---

## Code Conventions

- **1-tab indent**, single quotes, trailing commas in multi-line structures
- **JSDoc required** on all exported symbols (`@param`, `@returns`, `@since`, `@example`)
- **Pure functions** preferred: same inputs → same output, no side effects
- **Cyclomatic complexity** ≤ 10 (ESLint gate)
- **Error message format**: `"ClassName: human-readable description"`
