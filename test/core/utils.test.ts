/**
 * Tests for General Utility Functions Module
 * @module test/core/utils
 * @since 0.3.3
 */

import {
	camelCase, kebabCase, snakeCase, pascalCase,
	capitalize, truncate, sanitize, cleanWhitespace, escapeRegex,
	dedupe, chunk, flatten, groupBy, sortBy, intersection, difference, partition,
	deepClone, deepMerge, pick, omit,
	getProperty, setProperty, hasProperty, deepEqual, isEmpty,
} from '../../src/index';

// ─── String Utilities ────────────────────────────────────────────────────────

describe('camelCase', () => {
	it.each([
		['hello-world', 'helloWorld'],
		['hello_world', 'helloWorld'],
		['hello world', 'helloWorld'],
		['HelloWorld', 'helloWorld'],
	] as [string, string][])('converts %s → %s', (input, expected) => {
		expect(camelCase(input)).toBe(expected);
	});
	it('returns \'\' for non-string', () => { expect(camelCase(null)).toBe(''); expect(camelCase(123)).toBe(''); });
});

describe('kebabCase', () => {
	it.each([
		['helloWorld', 'hello-world'],
		['hello_world', 'hello-world'],
		['hello world', 'hello-world'],
	] as [string, string][])('converts %s → %s', (input, expected) => {
		expect(kebabCase(input)).toBe(expected);
	});
	it('strips special characters', () => expect(kebabCase('hello@world!')).toBe('helloworld'));
	it('returns \'\' for non-string', () => expect(kebabCase(null)).toBe(''));
});

describe('snakeCase', () => {
	it.each([
		['helloWorld', 'hello_world'],
		['hello-world', 'hello_world'],
		['hello world', 'hello_world'],
	] as [string, string][])('converts %s → %s', (input, expected) => {
		expect(snakeCase(input)).toBe(expected);
	});
	it('strips special characters', () => expect(snakeCase('hello@world!')).toBe('helloworld'));
	it('returns \'\' for non-string', () => expect(snakeCase(null)).toBe(''));
});

describe('pascalCase', () => {
	it.each([
		['helloWorld', 'HelloWorld'],
		['hello-world', 'HelloWorld'],
		['hello_world', 'HelloWorld'],
	] as [string, string][])('converts %s → %s', (input, expected) => {
		expect(pascalCase(input)).toBe(expected);
	});
	it('returns \'\' for non-string', () => expect(pascalCase(null)).toBe(''));
});

describe('capitalize', () => {
	it.each([
		['hello', 'Hello'],
		['Hello', 'Hello'],
		['', ''],
		[null, ''],
	] as [string | null, string][])('capitalizes %s → %s', (input, expected) => {
		expect(capitalize(input)).toBe(expected);
	});
});

describe('truncate', () => {
	it('truncates long strings', () => expect(truncate('hello world', 8)).toBe('hello...'));
	it('leaves short strings unchanged', () => expect(truncate('hello', 10)).toBe('hello'));
	it('uses custom suffix', () => expect(truncate('hello world', 8, '…')).toBe('hello w…'));
	it('handles exact length', () => expect(truncate('hello', 5)).toBe('hello'));
});

describe('sanitize', () => {
	it('removes special characters', () => expect(sanitize('hello@world!')).toBe('helloworld'));
	it('allows specified characters', () => expect(sanitize('hello-world_test', '-_')).toBe('hello-world_test'));
	it('handles alphanumeric only', () => expect(sanitize('abc123XYZ', '')).toBe('abc123XYZ'));
	it('returns \'\' for non-string', () => expect(sanitize(null)).toBe(''));
});

describe('cleanWhitespace', () => {
	it('collapses extra spaces', () => expect(cleanWhitespace('hello    world')).toBe('hello world'));
	it('trims edges', () => expect(cleanWhitespace('  hello world  ')).toBe('hello world'));
	it('handles tabs and newlines', () => expect(cleanWhitespace('hello\t\nworld')).toBe('hello world'));
	it('returns \'\' for non-string', () => expect(cleanWhitespace(null)).toBe(''));
});

describe('escapeRegex', () => {
	it('escapes dot', () => expect(escapeRegex('hello.world')).toBe('hello\\.world'));
	it('escapes multiple metacharacters', () => expect(escapeRegex('a*b+c?')).toBe('a\\*b\\+c\\?'));
	it('escapes parens and brackets', () => expect(escapeRegex('(test)[value]')).toBe('\\(test\\)\\[value\\]'));
	it('returns \'\' for non-string', () => expect(escapeRegex(null)).toBe(''));
});

// ─── Array Utilities ──────────────────────────────────────────────────────────

describe('dedupe', () => {
	it('removes duplicates from numbers', () => expect(dedupe([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]));
	it('removes duplicates from strings', () => expect(dedupe(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']));
	it('handles empty array', () => expect(dedupe([])).toEqual([]));
	it('returns [] for non-array', () => expect(dedupe(null)).toEqual([]));
});

describe('chunk', () => {
	it('splits into chunks', () => expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]));
	it('handles exact division', () => expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]));
	it('handles chunk size > array length', () => expect(chunk([1, 2], 5)).toEqual([[1, 2]]));
	it('returns [] for non-array', () => expect(chunk(null, 2)).toEqual([]));
	it('returns [] for size 0', () => expect(chunk([1, 2], 0)).toEqual([]));
});

describe('flatten', () => {
	it('flattens deeply nested', () => expect(flatten([1, [2, [3, 4]]])).toEqual([1, 2, 3, 4]));
	it('flattens to given depth', () => expect(flatten([1, [2, [3, 4]]], 1)).toEqual([1, 2, [3, 4]]));
	it('handles already flat array', () => expect(flatten([1, 2, 3])).toEqual([1, 2, 3]));
	it('returns [] for non-array', () => expect(flatten(null)).toEqual([]));
});

describe('groupBy', () => {
	const items = [{ type: 'a', value: 1 }, { type: 'b', value: 2 }, { type: 'a', value: 3 }];
	it('groups by key', () => expect(groupBy(items, 'type')).toEqual({
		a: [{ type: 'a', value: 1 }, { type: 'a', value: 3 }],
		b: [{ type: 'b', value: 2 }],
	}));
	it('groups by function', () => expect(groupBy([1, 2, 3, 4, 5, 6], (n: number) => n % 2 === 0 ? 'even' : 'odd')).toEqual({
		odd: [1, 3, 5], even: [2, 4, 6],
	}));
	it('returns {} for non-array', () => expect(groupBy(null, 'key')).toEqual({}));
});

describe('sortBy', () => {
	it('sorts ascending by key', () => expect(sortBy([{ age: 30 }, { age: 20 }, { age: 25 }], 'age')).toEqual([{ age: 20 }, { age: 25 }, { age: 30 }]));
	it('sorts descending by key', () => expect(sortBy([{ age: 20 }, { age: 30 }, { age: 25 }], 'age', 'desc')).toEqual([{ age: 30 }, { age: 25 }, { age: 20 }]));
	it('sorts by function', () => expect(sortBy(['aaa', 'bb', 'c'], (s: string) => s.length)).toEqual(['c', 'bb', 'aaa']));
	it('does not mutate original', () => {
		const items = [3, 1, 2];
		const sorted = sortBy(items, (n: number) => n);
		expect(items).toEqual([3, 1, 2]);
		expect(sorted).toEqual([1, 2, 3]);
	});
	it('returns [] for non-array', () => expect(sortBy(null, 'key')).toEqual([]));
});

describe('intersection', () => {
	it('finds common elements across three arrays', () => expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]));
	it('finds common elements across two arrays', () => expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]));
	it('returns [] for no overlap', () => expect(intersection([1, 2], [3, 4])).toEqual([]));
	it('returns [] for no arguments', () => expect(intersection()).toEqual([]));
});

describe('difference', () => {
	it('returns elements in first not in second', () => expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]));
	it('returns [] when first is subset of second', () => expect(difference([1, 2], [1, 2, 3])).toEqual([]));
	it('returns first when fully different', () => expect(difference([1, 2], [3, 4])).toEqual([1, 2]));
	it('returns [] for non-array', () => expect(difference(null, [1, 2])).toEqual([]));
});

describe('partition', () => {
	it('partitions evens and odds', () => {
		const [evens, odds] = partition([1, 2, 3, 4, 5], (n: number) => n % 2 === 0);
		expect(evens).toEqual([2, 4]);
		expect(odds).toEqual([1, 3, 5]);
	});
	it('all truthy', () => {
		const [t, f] = partition([2, 4, 6], (n: number) => n % 2 === 0);
		expect(t).toEqual([2, 4, 6]); expect(f).toEqual([]);
	});
	it('all falsy', () => {
		const [t, f] = partition([1, 3, 5], (n: number) => n % 2 === 0);
		expect(t).toEqual([]); expect(f).toEqual([1, 3, 5]);
	});
	it('returns [[],[]] for non-array', () => expect(partition(null, () => true)).toEqual([[], []]));
});

// ─── Object Utilities ─────────────────────────────────────────────────────────

describe('deepClone', () => {
	it('clones simple object (independent copy)', () => {
		const obj = { a: 1, b: 2 };
		const clone = deepClone(obj);
		expect(clone).toEqual(obj); expect(clone).not.toBe(obj);
	});
	it('clones nested object', () => {
		const obj = { a: { b: { c: 1 } } };
		const clone = deepClone(obj);
		expect(clone).toEqual(obj); expect(clone.a).not.toBe(obj.a);
	});
	it('clones arrays', () => {
		const arr = [1, [2, [3]]];
		const clone = deepClone(arr);
		expect(clone).toEqual(arr); expect(clone).not.toBe(arr);
	});
	it('clones dates', () => {
		const date = new Date('2026-01-30');
		const clone = deepClone(date);
		expect(clone).toEqual(date); expect(clone).not.toBe(date);
	});
	it('handles null and primitives', () => {
		expect(deepClone(null)).toBe(null);
		expect(deepClone(42)).toBe(42);
		expect(deepClone('test')).toBe('test');
	});
});

describe('deepMerge', () => {
	it('merges simple objects', () => expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 }));
	it('merges nested objects', () => expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } }));
	it('overwrites primitive values', () => expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 }));
	it('does not mutate target', () => {
		const obj1 = { a: 1 };
		const result = deepMerge(obj1, { b: 2 });
		expect(obj1).toEqual({ a: 1 }); expect(result).toEqual({ a: 1, b: 2 });
	});
	it('merges multiple sources', () => expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 }));
});

describe('pick', () => {
	it('picks specified keys', () => expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 }));
	it('ignores non-existent keys', () => expect(pick({ a: 1, b: 2 }, ['a', 'z' as 'a'])).toEqual({ a: 1 }));
	it('handles empty keys', () => expect(pick({ a: 1 }, [])).toEqual({}));
	it('returns {} for null input', () => expect(pick(null, ['a' as never])).toEqual({}));
});

describe('omit', () => {
	it('omits specified keys', () => expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 }));
	it('ignores non-existent keys', () => expect(omit({ a: 1, b: 2 }, ['z' as 'a'])).toEqual({ a: 1, b: 2 }));
	it('handles empty keys', () => expect(omit({ a: 1, b: 2 }, [])).toEqual({ a: 1, b: 2 }));
	it('returns {} for null input', () => expect(omit(null, ['a' as never])).toEqual({}));
});

describe('getProperty', () => {
	const obj = { user: { profile: { name: 'John' } } };
	it('reads nested property', () => expect(getProperty(obj, 'user.profile.name')).toBe('John'));
	it('returns default for missing path', () => expect(getProperty(obj, 'user.missing', 'default')).toBe('default'));
	it('reads shallow property', () => expect(getProperty(obj, 'user')).toEqual({ profile: { name: 'John' } }));
	it('returns default for null input', () => expect(getProperty(null, 'path', 'default')).toBe('default'));
});

describe('setProperty', () => {
	it('sets nested property', () => {
		expect(setProperty({ user: { name: 'John' } }, 'user.age', 30)).toEqual({ user: { name: 'John', age: 30 } });
	});
	it('creates missing intermediate objects', () => {
		expect(setProperty({}, 'a.b.c', 'value')).toEqual({ a: { b: { c: 'value' } } });
	});
	it('does not mutate original', () => {
		const obj = { a: 1 };
		const result = setProperty(obj, 'b', 2);
		expect(obj).toEqual({ a: 1 }); expect(result).toEqual({ a: 1, b: 2 });
	});
	it('returns original for null input', () => expect(setProperty(null, 'path', 'value')).toBe(null));
});

describe('hasProperty', () => {
	const obj = { user: { profile: { name: 'John' } } };
	it('returns true for existing path', () => expect(hasProperty(obj, 'user.profile.name')).toBe(true));
	it('returns false for missing path', () => expect(hasProperty(obj, 'user.missing')).toBe(false));
	it('handles shallow property', () => expect(hasProperty(obj, 'user')).toBe(true));
	it('returns false for null input', () => expect(hasProperty(null, 'path')).toBe(false));
});

describe('deepEqual', () => {
	it('compares primitive values', () => {
		expect(deepEqual(1, 1)).toBe(true);
		expect(deepEqual(1, 2)).toBe(false);
		expect(deepEqual('test', 'test')).toBe(true);
	});
	it('compares plain objects', () => {
		expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
		expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
	});
	it('compares nested objects', () => {
		expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
		expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
	});
	it('compares arrays', () => {
		expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
		expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
	});
	it('compares dates', () => {
		const d1 = new Date('2026-01-30'), d2 = new Date('2026-01-30'), d3 = new Date('2026-01-31');
		expect(deepEqual(d1, d2)).toBe(true);
		expect(deepEqual(d1, d3)).toBe(false);
	});
	it('handles null / undefined', () => {
		expect(deepEqual(null, null)).toBe(true);
		expect(deepEqual(null, undefined)).toBe(false);
	});
});

describe('isEmpty', () => {
	it('detects empty values', () => {
		expect(isEmpty(null)).toBe(true);
		expect(isEmpty(undefined)).toBe(true);
		expect(isEmpty('')).toBe(true);
		expect(isEmpty('   ')).toBe(true);
		expect(isEmpty([])).toBe(true);
		expect(isEmpty({})).toBe(true);
	});
	it('does not flag non-empty values', () => {
		expect(isEmpty('test')).toBe(false);
		expect(isEmpty([1])).toBe(false);
		expect(isEmpty({ a: 1 })).toBe(false);
		expect(isEmpty(0)).toBe(false);
		expect(isEmpty(false)).toBe(false);
	});
});
