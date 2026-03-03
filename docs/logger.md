# logger

**Module:** `core/logger`  
**Version:** 1.0.0 (added in olinda_utils.js v0.1.2)  
**Architecture:** Class-based

## Overview

Colored logging system with multiple severity levels, optional file output, and terminal color support detection.

## Import

```ts
import { Logger, logger, LogLevel, stripAnsi } from 'olinda_utils.js';
```

## API

### `stripAnsi(str)`

Strip ANSI escape codes from a string (useful for writing plain-text log files).

```ts
stripAnsi('\x1B[32mhello\x1B[0m'); // → 'hello'
```

### `LogLevel`

Constant map of log level names.

```ts
LogLevel.DEBUG   // 'debug'
LogLevel.INFO    // 'info'
LogLevel.SUCCESS // 'success'
LogLevel.WARN    // 'warn'
LogLevel.ERROR   // 'error'
```

### `new Logger(options?)`

| Option    | Type    | Default | Description                      |
|-----------|---------|---------|----------------------------------|
| `quiet`   | boolean | `false` | Suppress all console output      |
| `verbose` | boolean | `false` | Enable debug messages            |
| `prefix`  | string  | `''`    | Prefix prepended to each message |

### Methods

| Method                       | Description                                       |
|------------------------------|---------------------------------------------------|
| `debug(message)`             | Debug output (only when `verbose=true`)           |
| `info(message)`              | Informational output (cyan)                       |
| `success(message)`           | Success output with ✓ (green)                     |
| `warn(message)`              | Warning output with ⚠ (yellow, always shown)      |
| `error(message)`             | Error output with ✗ (red, always shown)           |
| `step(title)`                | Prominent step-header banner                      |
| `setLogFile(filePath)`       | Enable writing stripped output to a file          |
| `closeLogFile()`             | Flush and close the log file (async)              |
| `openStepLogFile(filePath)`  | Open a secondary per-step log file                |
| `closeStepLogFile()`         | Close the per-step log file                       |
| `reopenLogFiles()`           | Reopen streams after git operations rename files  |

### `logger`

Default `Logger` instance exported for convenience.

```ts
import { logger } from 'olinda_utils.js';
logger.info('Application started');
```

## Examples

```ts
const log = new Logger({ verbose: true, prefix: '[App]' });
log.info('Starting');
log.debug('Detail');
log.success('Done');
log.warn('Check this');
log.error('Something failed');
```

```ts
// File logging
const log = new Logger({ quiet: true });
log.setLogFile('/tmp/run.log');
log.info('Written to file only');
await log.closeLogFile();
```

## See Also

- [colors](./colors.md)
- [API Reference](./API.md)
