# Contributing to olinda_utils.js

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Development Setup

**Prerequisites:** Node.js ≥ 18, npm ≥ 9, Git.

```bash
git clone https://github.com/mpbarbosa/olinda_utils.js.git
cd olinda_utils.js
npm install
npm run build   # compile TypeScript → dist/
npm test        # run test suite
```

## Making Changes

1. Create a branch: `git checkout -b feat/my-feature`
2. Make your changes in `src/` (TypeScript only — never commit plain `.js` under `src/`)
3. Add tests in the corresponding `test/` subdirectory
4. Run the full test suite: `npm test`
5. Run the linter: `npm run lint`
6. Run the type-checker: `npm run validate`
7. Commit and open a pull request

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
- Tests live in `test/` mirroring the `src/` structure
- **Coverage thresholds** (enforced by CI):
    - Statements: ≥ 80%
    - Functions: ≥ 80%
    - Lines: ≥ 80%
    - Branches: ≥ 75%
- All new exported symbols must have corresponding tests
- Run the full suite before opening a PR:

```bash
npm test              # full suite + coverage report
npm run test:verbose  # with per-test output
npm run bench         # performance benchmarks (not included in coverage)
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
- [ ] Linter passes (`npm run lint`)
- [ ] Type-check passes (`npm run validate`)
- [ ] Coverage thresholds met (no regression)
- [ ] JSDoc added for all new exports
- [ ] `CHANGELOG.md` updated under `[Unreleased]`

## Reporting Issues

Open an issue at <https://github.com/mpbarbosa/olinda_utils.js/issues> with:
- Node.js version (`node --version`)
- Steps to reproduce
- Expected vs actual behaviour
