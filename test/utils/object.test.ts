/**
 * Tests for Object Utility Functions
 * @module test/utils/object
 * @since 0.4.0
 */

import {
	deepClone, deepMerge, pick, omit,
	getProperty, setProperty, hasProperty, deepEqual, isEmpty,
} from '../../src/index';

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
	it('handles circular references without throwing', () => {
		type Circular = { self?: Circular; value: number };
		const obj: Circular = { value: 1 };
		obj.self = obj; // circular reference
		expect(() => deepClone(obj)).not.toThrow();
		const clone = deepClone(obj);
		expect(clone.value).toBe(1);
		// circular ref node is kept as original reference, not cloned
		expect(clone.self).toBe(obj);
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
