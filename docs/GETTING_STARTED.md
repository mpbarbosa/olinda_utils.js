# Getting Started — olinda_utils.js

This guide walks you through using `olinda_utils.js` in your project.

## Prerequisites

- Node.js ≥ 18 (for local development or Node-based usage)
- A modern browser (for CDN usage)

## CDN Usage (no install required)

The easiest way to use `olinda_utils.js` in a browser is via jsDelivr:

**ES Module import (recommended for browser):**

```html
<script type="module">
  import { colors, colorize, Logger, logger } from
    'https://cdn.jsdelivr.net/gh/mpbarbosa/olinda_utils.js@0.3.11/dist/src/index.js';

  logger.info('olinda_utils.js loaded');
</script>
```

To get URLs for the latest version, run `npm run cdn` from the project root — it generates `cdn-urls.txt` with all URL variants.

## Local / Node.js Usage

```bash
git clone https://github.com/mpbarbosa/olinda_utils.js.git
cd olinda_utils.js
npm install
npm run build
```

Then import from the compiled output:

```javascript
import { colors, colorize, Logger } from './dist/src/index.js';
```

Alternatively, install directly from GitHub and import by package name:

```bash
npm install github:mpbarbosa/olinda_utils.js
```

```javascript
import { colors, colorize, Logger, logger, LogLevel, stripAnsi } from 'olinda_utils.js';
```

## Core Modules

> **Note:** `Logger` (file logging, `openStepLogFile`, etc.) and `supportsColor()` rely on
> Node.js built-ins (`fs`, `process`) and are **not available in browser contexts**.

### Colors

```javascript
// CDN (browser ES module)
import { colors, colorize } from
  'https://cdn.jsdelivr.net/gh/mpbarbosa/olinda_utils.js@0.3.11/dist/src/index.js';

// Node.js (after build or GitHub install)
import { colors, colorize, supportsColor } from 'olinda_utils.js';

// Use raw ANSI codes
console.log(`${colors.green}OK${colors.reset}`);

// Or use colorize (automatically falls back to plain text when terminal has no colour support)
console.log(colorize('Success!', colors.green));
console.log(colorize('Warning!', colors.yellow));

// Check terminal support
if (supportsColor()) {
  console.log('Terminal supports colour');
}
```

### Logger

> **Node.js only** — Logger uses `fs` for file output and is not browser-compatible.

```javascript
import { Logger, logger } from 'olinda_utils.js';

// Use the default singleton instance
logger.info('Application started');
logger.success('Task completed');
logger.warn('Disk space low');
logger.error('Connection failed');

// Or create a named logger
const log = new Logger({ prefix: '[server]', quiet: false, verbose: true });
log.step('Step 1: Connecting to database');   // prominent section header
log.info('Connecting...');
log.debug('Debug details (only shown when verbose=true)');

// Write logs to a file as well
log.setLogFile('/var/log/myapp/run.log');
log.info('This goes to console AND the log file');
await log.closeLogFile();

// Per-step secondary log file (e.g. in workflow automation)
log.openStepLogFile('/var/log/myapp/step1.log');
log.info('Logged to both main and step file');
await log.closeStepLogFile();

// Reopen log streams after git operations that may replace files on disk
log.reopenLogFiles();
```

### LogLevel constants

```javascript
import { LogLevel } from 'olinda_utils.js';

console.log(LogLevel.DEBUG);   // 'debug'
console.log(LogLevel.INFO);    // 'info'
console.log(LogLevel.SUCCESS); // 'success'
console.log(LogLevel.WARN);    // 'warn'
console.log(LogLevel.ERROR);   // 'error'
```

### stripAnsi

```javascript
import { stripAnsi } from 'olinda_utils.js';

const plain = stripAnsi('\x1B[32mhello\x1B[0m'); // → 'hello'
```

## Automation Scripts

Three shell scripts handle building, deployment, and CDN URL generation.

### `cdn-delivery.sh`

Generates jsDelivr CDN URLs for the current version and saves them to `cdn-urls.txt`.

```bash
bash cdn-delivery.sh
# or via npm (runs build first):
npm run cdn
```

**Prerequisites:** Node.js ≥ 18, `git`, `curl` (optional — CDN availability check).

### `scripts/deploy.sh`

Full release pipeline: build → commit artifacts → tag → push to GitHub → generate CDN URLs.

```bash
bash scripts/deploy.sh
```

**Prerequisites:** Node.js ≥ 18, `git` with push access to `origin`.

### `scripts/colors.sh`

Shared ANSI colour definitions sourced by `scripts/deploy.sh` and `cdn-delivery.sh`. **Source, do not execute directly.**

```bash
source scripts/colors.sh
echo -e "${GREEN}OK${NC}"
```

See [README.md](../README.md#scripts) and [docs/API.md](./API.md#automation-scripts) for full script documentation including steps, exit codes, and troubleshooting.

---

## Next Steps

- [API Reference](./API.md) — complete API documentation for all exported symbols
- [Architecture](./ARCHITECTURE.md) — how the library is structured and built
- [CONTRIBUTING.md](../CONTRIBUTING.md) — how to contribute
