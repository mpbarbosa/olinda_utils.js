# Contributing to olinda_utils.js

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Development Setup

**Prerequisites:** Node.js ≥ 18, npm ≥ 9, Git, Python ≥ 3.8 (for pre-commit).

```bash
git clone https://github.com/mpbarbosa/olinda_utils.js.git
cd olinda_utils.js
npm install
npm run build        # compile TypeScript → dist/ (CJS)
npm run build:esm    # compile TypeScript → dist/esm/ (ESM)
npm test             # run unit + integration test suite
```

## Pre-commit Hooks

This project uses [pre-commit](https://pre-commit.com/) to enforce EditorConfig, secret detection,
and Markdown lint on every commit.

```bash
pip install pre-commit      # install the pre-commit tool (once)
pre-commit install          # register hooks in your local clone
pre-commit run --all-files  # run all hooks manually (optional sanity check)
```

Once installed, hooks run automatically on `git commit`. To bypass in emergencies:

```bash
git commit --no-verify -m "chore: emergency fix"
```

## Making Changes

1. Create a branch: `git checkout -b feat/my-feature`
2. Make your changes in `src/` (TypeScript only — never commit plain `.js` under `src/`)
3. Add tests in the corresponding `test/` subdirectory
4. Run the full test suite: `npm test`
5. Run the integration tests: `npm run test:integration`
6. Run the linter: `npm run lint`
7. Run the type-checker: `npm run validate`
8. Commit and open a pull request

## Code Style

- **Language:** TypeScript — all source files live under `src/`
- **Indentation:** 1 tab
- **Quotes:** single quotes
- **JSDoc:** required on all exported symbols (`@param`, `@returns`, `@since`, `@example`)
- **Pure functions preferred:** same inputs → same output, no observable side effects
- **Cyclomatic complexity:** ≤ 10 (ESLint enforced)

Formatting is enforced via ESLint:

```bash
npm run lint        # check
npm run lint:fix    # auto-fix
```

## Testing Requirements

- Test framework: **Jest + ts-jest** (TypeScript compiled natively — no pre-build needed)
- Tests live in `test/` mirroring the `src/` structure:
    - `test/utils/` — unit tests for `src/utils/` domain modules
    - `test/core/` — unit tests for `src/core/` classes + public surface smoke tests
    - `test/integration/` — CJS and ESM smoke tests against compiled `dist/`
    - `test/benchmarks/` — performance benchmarks (excluded from coverage)
    - `test/helpers/` — shared fixtures and typed constants
- **Coverage thresholds** (enforced by CI):
    - Statements: ≥ 80%
    - Functions: ≥ 80%
    - Lines: ≥ 80%
    - Branches: ≥ 75%
- All new exported symbols must have corresponding tests
- Run the full suite before opening a PR:

```bash
npm test                  # unit + integration suite + coverage
npm run test:verbose      # with per-test output
npm run test:integration  # CJS and ESM build smoke tests (requires npm run build)
npm run bench             # performance benchmarks (not included in coverage)
npm run validate          # type-check only (no emit)
```

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `perf`

Examples:

```
feat: add stripAnsi utility function
fix: correct colorize fallback when NO_COLOR is set
docs: add usage examples to README
test: add negative test cases for colorize
```

## Pull Request Checklist

- [ ] Tests pass (`npm test`)
- [ ] Integration tests pass (`npm run test:integration` — requires build)
- [ ] Linter passes (`npm run lint`)
- [ ] Type-check passes (`npm run validate`)
- [ ] Coverage thresholds met (no regression)
- [ ] JSDoc added for all new exports
- [ ] `CHANGELOG.md` updated under `[Unreleased]`

## Releasing / Deployment

Releases are automated by `scripts/deploy.sh`. Maintainers with push access run:

```bash
# 1. Bump version in package.json
npm version patch   # or minor / major

# 2. Run the full release pipeline
bash scripts/deploy.sh
```

`scripts/deploy.sh` builds TypeScript, commits `dist/`, tags the release, pushes to GitHub,
and generates `cdn-urls.txt` via `cdn-delivery.sh`. jsDelivr picks up the version tag
automatically and serves the library from the CDN.

`scripts/colors.sh` provides shared ANSI colour output for both scripts — source it, do not execute it directly.

See [docs/API.md — Automation Scripts](./docs/API.md#automation-scripts) for full usage and troubleshooting.

## Reporting Issues

Open an issue at <https://github.com/mpbarbosa/olinda_utils.js/issues> with:
- Node.js version (`node --version`)
- Steps to reproduce
- Expected vs actual behaviour
