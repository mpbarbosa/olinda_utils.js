/**
 * olinda_utils.js — public API
 * @module index
 */

export { colors, supportsColor, colorize } from './core/colors.js';
export type { ColorName } from './core/colors.js';

export { Logger, logger, LogLevel, stripAnsi } from './core/logger.js';
export type { LoggerOptions, LogLevelValue } from './core/logger.js';

export {
	camelCase,
	kebabCase,
	snakeCase,
	pascalCase,
	capitalize,
	truncate,
	sanitize,
	cleanWhitespace,
	escapeRegex,
} from './utils/string.js';

export {
	dedupe,
	chunk,
	flatten,
	groupBy,
	sortBy,
	intersection,
	difference,
	partition,
} from './utils/array.js';

export {
	deepClone,
	deepMerge,
	pick,
	omit,
	getProperty,
	setProperty,
	hasProperty,
	deepEqual,
	isEmpty,
} from './utils/object.js';
