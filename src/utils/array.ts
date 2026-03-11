/**
 * Array Utility Functions
 * @module utils/array
 * @description Pure array transformation and query functions.
 * All functions are referentially transparent — no side effects, deterministic output.
 * @since 0.4.0
 */

/**
 * Remove duplicate values from an array using strict equality.
 * @param arr - Array to deduplicate.
 * @returns New array without duplicates, or `[]` for non-array input.
 * @since 0.3.15
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
 * @since 0.3.15
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
 * @since 0.3.15
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
 * @since 0.3.15
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
 * @since 0.3.15
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
 * @since 0.3.15
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
 * @since 0.3.15
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
 * @since 0.3.15
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
