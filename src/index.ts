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
	dedupe,
	chunk,
	flatten,
	groupBy,
	sortBy,
	intersection,
	difference,
	partition,
	deepClone,
	deepMerge,
	pick,
	omit,
	getProperty,
	setProperty,
	hasProperty,
	deepEqual,
	isEmpty,
} from './core/utils.js';
