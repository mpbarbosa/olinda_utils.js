/**
 * Object Utility Functions
 * @module utils/object
 * @description Pure object manipulation and query functions.
 * All functions are referentially transparent — no side effects, deterministic output.
 * @since 0.4.0
 */

/** Returns true when `val` is a non-null, non-array plain object. */
function isPlainObj(val: unknown): val is Record<string, unknown> {
	return val !== null && typeof val === 'object' && !Array.isArray(val);
}

/** Internal recursive helper for {@link deepClone} with cycle detection. */
function _deepCloneHelper<T>(obj: T, seen: WeakSet<object>): T {
	if (obj === null || typeof obj !== 'object') return obj;
	if (seen.has(obj as object)) return obj; // circular ref — return original reference
	seen.add(obj as object);
	if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
	if (Array.isArray(obj)) return obj.map((item) => _deepCloneHelper(item, seen)) as unknown as T;
	const cloned: Record<string, unknown> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) cloned[key] = _deepCloneHelper((obj as Record<string, unknown>)[key], seen);
	}
	return cloned as T;
}

/**
 * Create a deep clone of any value.
 * Handles plain objects, arrays, and `Date` instances.
 * Circular references are detected and kept as-is (the original object reference is preserved
 * rather than cloned again) to avoid infinite recursion.
 * @param obj - Value to clone.
 * @returns Deep clone of `obj`.
 * @since 0.3.14
 * @example deepClone({a:{b:1}}) // {a:{b:1}} — independent copy
 */
export function deepClone<T>(obj: T): T {
	return _deepCloneHelper(obj, new WeakSet());
}

/** Merge a single `source` object into the mutable `result` in place. */
function mergeSource(result: Record<string, unknown>, source: Record<string, unknown>): void {
	for (const key in source) {
		if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
		const sv = source[key];
		const rv = result[key];
		result[key] = isPlainObj(sv)
			? deepMerge(isPlainObj(rv) ? rv : {}, sv)
			: deepClone(sv);
	}
}

/**
 * Deep-merge one or more source objects into `target` without mutating it.
 * Arrays in sources overwrite (not merge) the target value.
 * @param target - Base object.
 * @param sources - Objects to merge into the clone of `target`.
 * @returns New merged object.
 * @since 0.3.14
 * @example deepMerge({a:{b:1}},{a:{c:2}}) // {a:{b:1,c:2}}
 */
export function deepMerge(target: Record<string, unknown>, ...sources: Record<string, unknown>[]): Record<string, unknown> {
	if (!sources.length) return target;
	const result = deepClone(target);
	for (const source of sources) {
		if (isPlainObj(source)) mergeSource(result, source);
	}
	return result;
}

/**
 * Create a new object containing only the specified keys.
 * @param obj - Source object.
 * @param keys - Keys to include.
 * @returns Subset object, or `{}` for invalid input.
 * @since 0.3.14
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
 * @since 0.3.14
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
 * @since 0.3.14
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
 * @since 0.3.14
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
 * @since 0.3.14
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

function areBothObjects(a: unknown, b: unknown): boolean {
	return a !== null && b !== null && typeof a === 'object' && typeof b === 'object';
}

function equalArrays(a: unknown[], b: unknown[]): boolean {
	return a.length === b.length && a.every((item, i) => deepEqual(item, b[i]));
}

function equalObjects(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
	const ka = Object.keys(a), kb = Object.keys(b);
	return ka.length === kb.length && ka.every((k) => kb.includes(k) && deepEqual(a[k], b[k]));
}

/**
 * Perform a deep equality comparison between two values.
 * Handles primitives, `Date`, plain objects, and arrays.
 * @param a - First value.
 * @param b - Second value.
 * @returns `true` when the values are structurally equal.
 * @since 0.3.14
 * @example deepEqual({a:{b:1}},{a:{b:1}}) // true
 */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (!areBothObjects(a, b)) return false;
	if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
	if (Array.isArray(a)) return Array.isArray(b) && equalArrays(a, b);
	if (Array.isArray(b)) return false;
	return equalObjects(a as Record<string, unknown>, b as Record<string, unknown>);
}

/**
 * Check whether a value is "empty": `null`, `undefined`, blank string, empty array, or empty object.
 * Note: `0` and `false` are **not** considered empty.
 * @param value - Value to check.
 * @returns `true` when the value is empty.
 * @since 0.3.14
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
