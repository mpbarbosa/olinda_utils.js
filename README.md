# olinda_utils.js

Public JavaScript utility library — TypeScript-authored, delivered via **jsDelivr CDN from GitHub**.

## Installation

**CDN (recommended):**

```html
<script src="https://cdn.jsdelivr.net/gh/mpbarbosa/olinda_utils.js@0.3.8/dist/src/index.js"></script>
```

**ES Module:**

```html
<script type="module">
  import { colors, colorize, Logger } from
    'https://cdn.jsdelivr.net/gh/mpbarbosa/olinda_utils.js@0.3.8/dist/src/index.js';
</script>
```

**npm (local development):**

```bash
npm install
npm run build
```

## Usage

```javascript
import { colors, colorize, Logger, logger } from 'olinda_utils.js';

// Colors
console.log(colorize('Hello!', colors.green));

// Logger
const log = new Logger({ prefix: '[myapp]' });
log.info('Started');
log.success('Done');
log.warn('Watch out');
log.error('Failed');
log.step('Step 1: Initialisation');
```

## API

See [docs/API.md](./docs/API.md) for the full reference.

| Module | Description |
|---|---|
| `colors` | ANSI color codes and terminal support detection |
| `Logger` | Colored logging with optional file output |

## Scripts

### `cdn-delivery.sh`

Generates jsDelivr CDN URLs for the current version and saves them to `cdn-urls.txt`.

```bash
bash cdn-delivery.sh
# or via npm:
npm run cdn   # runs build first, then cdn-delivery.sh
```

**Prerequisites:** Node.js ≥ 18, `git`, `curl` (optional — for CDN availability check).
**Output:** Prints versioned CDN URLs to stdout and saves to `cdn-urls.txt`.

---

### `scripts/deploy.sh`

Full deployment pipeline: build → commit artifacts → tag → push to GitHub → generate CDN URLs.

```bash
bash scripts/deploy.sh
```

**Prerequisites:** Node.js ≥ 18, `git` with push access to origin.
**Steps:**
1. `npm run build` — compile TypeScript to `dist/`
2. `git add dist/ cdn-delivery.sh` — stage build artifacts (skipped if nothing changed)
3. `git commit` — commit artifacts
4. `git pull --rebase origin {branch}` — sync with remote before tagging
5. `git tag v{version}` — create version tag (skipped if tag already exists)
6. `git push origin {branch} --tags` — push branch and tags to GitHub (jsDelivr picks up the tag)
7. `npm run cdn` — generate `cdn-urls.txt`

---

### `scripts/colors.sh`

Shared ANSI colour definitions used by other shell scripts. **Source, do not execute directly.**

```bash
source scripts/colors.sh
echo -e "${GREEN}OK${NC}"
```

**Variables exported:** `RED`, `GREEN`, `YELLOW`, `BLUE`, `NC` (reset).

---

### Script relationships

`scripts/deploy.sh` calls `cdn-delivery.sh` (via `npm run cdn`); both source `scripts/colors.sh`
for terminal output.

### Executable permissions

If running scripts directly (without `bash`), ensure they are executable:

```bash
chmod +x scripts/deploy.sh cdn-delivery.sh
```

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `package.json not found` | Script run from wrong directory | Run from project root |
| `Could not determine current git branch` | Detached HEAD state | `git checkout main` first |
| `Tag vX.Y.Z already exists` | Re-deploying same version | Bump version in `package.json` |
| CDN not serving new version | Tag not yet pushed | `git push origin --tags` |
| CDN serving stale content | jsDelivr cache | Wait up to 12 h, or use a commit-pinned URL |

## Development

```bash
npm test          # run test suite with coverage
npm run lint      # ESLint
npm run validate  # TypeScript type-check only (no emit)
npm run build     # compile TypeScript → dist/
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines and [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md) to get up and running quickly.

## Project Structure

```
olinda_utils.js/
├── src/           # TypeScript source
├── test/          # Jest test suite
├── docs/          # API reference and guides
├── dist/          # Compiled output (committed for CDN)
├── scripts/       # Shell automation scripts
├── .github/       # CI workflow and Copilot instructions
└── cdn-delivery.sh
```

### `.github/`

Contains GitHub-specific resources:
- `workflows/ci.yml` — CI pipeline (type-check, lint, test on Node 18/20/22)
- `dependabot.yml` — automated npm and GitHub Actions dependency updates (weekly)
- `copilot-instructions.md` — Copilot coding guidelines for this project

## License

MIT — see [LICENSE](./LICENSE).
