/**
 * General Utility Functions Module (Pure Functions Only)
 * @module core/utils
 * @description Pure utility functions for strings, arrays, and objects.
 * All functions are referentially transparent — no side effects, deterministic output.
 * @since 0.3.0
 */

// ─── String Utilities ────────────────────────────────────────────────────────

/**
 * Convert string to camelCase.
 * @param str - String to convert.
 * @returns camelCase string, or `''` for non-string input.
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
 * @example escapeRegex('hello.world') // 'hello\\.world'
 */
export function escapeRegex(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Array Utilities ──────────────────────────────────────────────────────────

/**
 * Remove duplicate values from an array using strict equality.
 * @param arr - Array to deduplicate.
 * @returns New array without duplicates, or `[]` for non-array input.
 * @example dedupe([1, 2, 2, 3]) // [1, 2, 3]
 */
export function dedupe<T>(arr: unknown): T[] {
	if (!Array.isArray(arr)) return [];
	return [...new Set(arr)] as T[];
}

/**
 * Split an array into fixed-size chunks.
 * @param arr - Array to chunk.
 * @param size - Chunk size (must be ≥ 1).
 * @returns Array of chunks, or `[]` for invalid input.
 * @example chunk([1,2,3,4,5], 2) // [[1,2],[3,4],[5]]
 */
export function chunk<T>(arr: unknown, size: number): T[][] {
	if (!Array.isArray(arr) || size < 1) return [];
	const chunks: T[][] = [];
	for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size) as T[]);
	return chunks;
}

/**
 * Recursively flatten a nested array.
 * @param arr - Array to flatten.
 * @param depth - How many levels deep to flatten (default: `Infinity`).
 * @returns Flattened array, or `[]` for non-array input.
 * @example flatten([1, [2, [3, 4]]]) // [1, 2, 3, 4]
 * @example flatten([1, [2, [3, 4]]], 1) // [1, 2, [3, 4]]
 */
export function flatten<T>(arr: unknown, depth = Infinity): T[] {
	if (!Array.isArray(arr)) return [];
	if (depth === 0) return arr as T[];
	return arr.reduce((flat: T[], item: unknown) => {
		return flat.concat(Array.isArray(item) ? flatten<T>(item, depth - 1) : (item as T));
	}, []);
}

/**
 * Group array elements by a key property or a key-returning function.
 * @param arr - Array to group.
 * @param keyOrFn - Property name or function that returns the group key.
 * @returns Object mapping group keys to arrays of elements, or `{}` for invalid input.
 * @example groupBy([{t:'a'},{t:'b'},{t:'a'}], 'type') // { a:[...], b:[...] }
 */
export function groupBy<T>(arr: unknown, keyOrFn: string | ((item: T) => string)): Record<string, T[]> {
	if (!Array.isArray(arr)) return {};
	const fn = typeof keyOrFn === 'function' ? keyOrFn : (item: T) => (item as Record<string, string>)[keyOrFn];
	return arr.reduce((groups: Record<string, T[]>, item: T) => {
		const key = fn(item);
		if (!groups[key]) groups[key] = [];
		groups[key].push(item);
		return groups;
	}, {});
}

/**
 * Return a sorted copy of an array without mutating the original.
 * @param arr - Array to sort.
 * @param keyOrFn - Property name or function that returns the sort key.
 * @param order - `'asc'` (default) or `'desc'`.
 * @returns Sorted array, or `[]` for invalid input.
 * @example sortBy([{age:30},{age:20}], 'age') // [{age:20},{age:30}]
 */
export function sortBy<T>(arr: unknown, keyOrFn: string | ((item: T) => unknown), order: 'asc' | 'desc' = 'asc'): T[] {
	if (!Array.isArray(arr)) return [];
	const fn = typeof keyOrFn === 'function' ? keyOrFn : (item: T) => (item as Record<string, unknown>)[keyOrFn];
	return [...arr].sort((a: T, b: T) => {
		const va = fn(a) as string | number, vb = fn(b) as string | number;
		if (va < vb) return order === 'asc' ? -1 : 1;
		if (va > vb) return order === 'asc' ? 1 : -1;
		return 0;
	});
}

/**
 * Return elements that appear in every provided array.
 * @param arrays - Two or more arrays to intersect.
 * @returns Intersection array, or `[]` when no arrays are provided.
 * @example intersection([1,2,3],[2,3,4],[3,4,5]) // [3]
 */
export function intersection<T>(...arrays: unknown[]): T[] {
	if (arrays.length === 0 || !arrays.every(Array.isArray)) return [];
	const [first, ...rest] = arrays as T[][];
	return first.filter((item) => rest.every((arr) => arr.includes(item)));
}

/**
 * Return elements from `arr1` that are not present in `arr2`.
 * @param arr1 - Source array.
 * @param arr2 - Array of values to exclude.
 * @returns Difference array, or `[]` for invalid input.
 * @example difference([1,2,3],[2,3,4]) // [1]
 */
export function difference<T>(arr1: unknown, arr2: unknown): T[] {
	if (!Array.isArray(arr1) || !Array.isArray(arr2)) return [];
	return (arr1 as T[]).filter((item) => !(arr2 as T[]).includes(item));
}

/**
 * Split an array into two groups based on a predicate.
 * @param arr - Array to partition.
 * @param predicate - Function that returns `true` for elements in the first group.
 * @returns `[truthy, falsy]` tuple, or `[[],[]]` for invalid input.
 * @example partition([1,2,3,4,5], n => n%2===0) // [[2,4],[1,3,5]]
 */
export function partition<T>(arr: unknown, predicate: (item: T) => boolean): [T[], T[]] {
	if (!Array.isArray(arr) || typeof predicate !== 'function') return [[], []];
	return arr.reduce(
		([truthy, falsy]: [T[], T[]], item: T) => {
			(predicate(item) ? truthy : falsy).push(item);
			return [truthy, falsy];
		},
		[[], []]
	);
}

// ─── Object Utilities ─────────────────────────────────────────────────────────

/**
 * Create a deep clone of any value.
 * Handles plain objects, arrays, and `Date` instances.
 * @param obj - Value to clone.
 * @returns Deep clone of `obj`.
 * @example deepClone({a:{b:1}}) // {a:{b:1}} — independent copy
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') return obj;
	if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
	if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as unknown as T;
	const cloned: Record<string, unknown> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
	}
	return cloned as T;
}

/**
 * Deep-merge one or more source objects into `target` without mutating it.
 * Arrays in sources overwrite (not merge) the target value.
 * @param target - Base object.
 * @param sources - Objects to merge into the clone of `target`.
 * @returns New merged object.
 * @example deepMerge({a:{b:1}},{a:{c:2}}) // {a:{b:1,c:2}}
 */
export function deepMerge(target: Record<string, unknown>, ...sources: Record<string, unknown>[]): Record<string, unknown> {
	if (!sources.length) return target;
	const result = deepClone(target);
	for (const source of sources) {
		if (source && typeof source === 'object' && !Array.isArray(source)) {
			for (const key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					const sv = source[key];
					const rv = result[key];
					if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
						result[key] = deepMerge((rv && typeof rv === 'object' ? rv : {}) as Record<string, unknown>, sv as Record<string, unknown>);
					} else {
						result[key] = deepClone(sv);
					}
				}
			}
		}
	}
	return result;
}

/**
 * Create a new object containing only the specified keys.
 * @param obj - Source object.
 * @param keys - Keys to include.
 * @returns Subset object, or `{}` for invalid input.
 * @example pick({a:1,b:2,c:3}, ['a','c']) // {a:1,c:3}
 */
export function pick<T extends object, K extends keyof T>(obj: T | null | undefined, keys: K[]): Pick<T, K> {
	if (!obj || typeof obj !== 'object' || !Array.isArray(keys)) return {} as Pick<T, K>;
	return keys.reduce((result, key) => {
		if (Object.prototype.hasOwnProperty.call(obj, key)) result[key] = obj[key];
		return result;
	}, {} as Pick<T, K>);
}

/**
 * Create a new object with the specified keys removed.
 * @param obj - Source object.
 * @param keys - Keys to exclude.
 * @returns New object without the omitted keys, or `{}` for invalid input.
 * @example omit({a:1,b:2,c:3}, ['b']) // {a:1,c:3}
 */
export function omit<T extends object, K extends keyof T>(obj: T | null | undefined, keys: K[]): Omit<T, K> {
	if (!obj || typeof obj !== 'object' || !Array.isArray(keys)) return {} as Omit<T, K>;
	const result = {} as Omit<T, K>;
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key) && !keys.includes(key as unknown as K)) {
			(result as Record<string, unknown>)[key] = obj[key];
		}
	}
	return result;
}

/**
 * Read a nested property using dot-notation path.
 * @param obj - Source object.
 * @param path - Dot-separated key path (e.g. `'user.address.city'`).
 * @param defaultValue - Returned when the path does not exist.
 * @returns Value at path, or `defaultValue`.
 * @example getProperty({user:{name:'John'}}, 'user.name') // 'John'
 */
export function getProperty<T = unknown>(obj: unknown, path: string, defaultValue?: T): T | undefined {
	if (!obj || typeof obj !== 'object' || typeof path !== 'string') return defaultValue;
	const keys = path.split('.');
	let result: unknown = obj;
	for (const key of keys) {
		if (result && typeof result === 'object' && key in (result as object)) {
			result = (result as Record<string, unknown>)[key];
		} else {
			return defaultValue;
		}
	}
	return result as T;
}

/**
 * Set a nested property using dot-notation path, returning a new object.
 * Intermediate objects are created as needed.
 * @param obj - Source object.
 * @param path - Dot-separated key path.
 * @param value - Value to assign.
 * @returns New object with the property set, or the original value for invalid input.
 * @example setProperty({}, 'a.b.c', 42) // {a:{b:{c:42}}}
 */
export function setProperty<T>(obj: T, path: string, value: unknown): T {
	if (!obj || typeof obj !== 'object' || typeof path !== 'string') return obj;
	const result = deepClone(obj) as Record<string, unknown>;
	const keys = path.split('.');
	let current = result;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current) || typeof current[key] !== 'object') current[key] = {};
		current = current[key] as Record<string, unknown>;
	}
	current[keys[keys.length - 1]] = value;
	return result as T;
}

/**
 * Check whether a nested property exists using dot-notation path.
 * @param obj - Source object.
 * @param path - Dot-separated key path.
 * @returns `true` if the full path exists, `false` otherwise.
 * @example hasProperty({user:{name:'John'}}, 'user.name') // true
 */
export function hasProperty(obj: unknown, path: string): boolean {
	if (!obj || typeof obj !== 'object' || typeof path !== 'string') return false;
	const keys = path.split('.');
	let current: unknown = obj;
	for (const key of keys) {
		if (!current || typeof current !== 'object' || !(key in (current as object))) return false;
		current = (current as Record<string, unknown>)[key];
	}
	return true;
}

/**
 * Perform a deep equality comparison between two values.
 * Handles primitives, `Date`, plain objects, and arrays.
 * @param a - First value.
 * @param b - Second value.
 * @returns `true` when the values are structurally equal.
 * @example deepEqual({a:{b:1}},{a:{b:1}}) // true
 */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
	if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((item, i) => deepEqual(item, b[i]));
	}
	if (Array.isArray(a) || Array.isArray(b)) return false;
	const ka = Object.keys(a as object), kb = Object.keys(b as object);
	if (ka.length !== kb.length) return false;
	return ka.every((k) => kb.includes(k) && deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

/**
 * Check whether a value is "empty": `null`, `undefined`, blank string, empty array, or empty object.
 * Note: `0` and `false` are **not** considered empty.
 * @param value - Value to check.
 * @returns `true` when the value is empty.
 * @example isEmpty([]) // true
 * @example isEmpty(0) // false
 */
export function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string') return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === 'object') return Object.keys(value as object).length === 0;
	return false;
}
