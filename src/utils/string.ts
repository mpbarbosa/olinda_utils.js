/**
 * String Utility Functions
 * @module utils/string
 * @description Pure string transformation functions.
 * All functions are referentially transparent — no side effects, deterministic output.
 * @since 0.4.0
 */

/**
 * Convert string to camelCase.
 * @param str - String to convert.
 * @returns camelCase string, or `''` for non-string input.
 * @since 0.3.11
 * @example camelCase('hello-world') // 'helloWorld'
 */
export function camelCase(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str
		.replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
		.replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert string to kebab-case.
 * @param str - String to convert.
 * @returns kebab-case string, or `''` for non-string input.
 * @since 0.3.11
 * @example kebabCase('helloWorld') // 'hello-world'
 */
export function kebabCase(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-zA-Z0-9-]/g, '')
		.toLowerCase();
}

/**
 * Convert string to snake_case.
 * @param str - String to convert.
 * @returns snake_case string, or `''` for non-string input.
 * @since 0.3.11
 * @example snakeCase('helloWorld') // 'hello_world'
 */
export function snakeCase(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str
		.replace(/([a-z])([A-Z])/g, '$1_$2')
		.replace(/[\s-]+/g, '_')
		.replace(/[^a-zA-Z0-9_]/g, '')
		.toLowerCase();
}

/**
 * Convert string to PascalCase.
 * @param str - String to convert.
 * @returns PascalCase string, or `''` for non-string input.
 * @since 0.3.11
 * @example pascalCase('hello-world') // 'HelloWorld'
 */
export function pascalCase(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str
		.replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
		.replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * Capitalize the first letter of a string.
 * @param str - String to capitalize.
 * @returns Capitalized string, or `''` for non-string / empty input.
 * @since 0.3.11
 * @example capitalize('hello') // 'Hello'
 */
export function capitalize(str: unknown): string {
	if (typeof str !== 'string' || str.length === 0) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to the specified length, appending a suffix when cut.
 * @param str - String to truncate.
 * @param length - Maximum length of the result (including the suffix).
 * @param suffix - Appended when truncation occurs. Defaults to `'...'`.
 * @returns Truncated string, or the original string if it fits.
 * @since 0.3.11
 * @example truncate('hello world', 8) // 'hello...'
 */
export function truncate(str: string, length: number, suffix = '...'): string {
	if (typeof str !== 'string' || str.length <= length) return str;
	return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Sanitize a string, keeping only alphanumeric characters and an explicit allow-list.
 * @param str - String to sanitize.
 * @param allowed - Extra characters to allow (default `'-_'`).
 * @returns Sanitized string, or `''` for non-string input.
 * @since 0.3.11
 * @example sanitize('hello@world!') // 'helloworld'
 * @example sanitize('hello-world_test', '-_') // 'hello-world_test'
 */
export function sanitize(str: unknown, allowed = '-_'): string {
	if (typeof str !== 'string') return '';
	const escaped = allowed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const pattern = new RegExp(`[^a-zA-Z0-9${escaped}]`, 'g');
	return str.replace(pattern, '');
}

/**
 * Collapse consecutive whitespace characters and trim the string.
 * @param str - String to clean.
 * @returns Cleaned string, or `''` for non-string input.
 * @since 0.3.11
 * @example cleanWhitespace('hello    world') // 'hello world'
 */
export function cleanWhitespace(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str.replace(/\s+/g, ' ').trim();
}

/**
 * Escape all special regex metacharacters in a string.
 * @param str - String to escape.
 * @returns Escaped string, or `''` for non-string input.
 * @since 0.3.11
 * @example escapeRegex('hello.world') // 'hello\\.world'
 */
export function escapeRegex(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
