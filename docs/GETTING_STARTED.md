# Getting Started — olinda_utils.js

This guide walks you through using `olinda_utils.js` in your project.

## Prerequisites

- Node.js ≥ 18 (for local development or Node-based usage)
- A modern browser (for CDN usage)

## CDN Usage (no install required)

The easiest way to use `olinda_utils.js` in a browser is via jsDelivr:

```html
<!-- Load specific version (recommended for production) -->
<script src="https://cdn.jsdelivr.net/gh/mpbarbosa/olinda_utils.js@0.2.0/dist/src/index.js"></script>

<script>
  const { colors, colorize, Logger } = window.olindaUtils ?? {};
</script>
```

**ES Module import:**

```html
<script type="module">
  import { colors, colorize, Logger, logger } from
    'https://cdn.jsdelivr.net/gh/mpbarbosa/olinda_utils.js@0.2.0/dist/src/index.js';

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

## Core Modules

### Colors

```javascript
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

```javascript
import { Logger, logger } from 'olinda_utils.js';

// Use the default singleton instance
logger.info('Application started');
logger.success('Task completed');
logger.warn('Disk space low');
logger.error('Connection failed');

// Or create a named logger
const log = new Logger({ prefix: '[server]', quiet: false, verbose: true });
log.step('Step 1: Connecting to database');
log.info('Connecting...');
log.debug('Debug details (only shown when verbose=true)');

// Write logs to a file as well
log.setLogFile('/var/log/myapp/run.log');
log.info('This goes to console AND the log file');
await log.closeLogFile();
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

## Next Steps

- [API Reference](./API.md) — complete API documentation for all exported symbols
- [Architecture](./ARCHITECTURE.md) — how the library is structured and built
- [CONTRIBUTING.md](../CONTRIBUTING.md) — how to contribute
