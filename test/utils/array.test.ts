/**
 * Tests for Array Utility Functions
 * @module test/utils/array
 * @since 0.4.0
 */

import {
	dedupe, chunk, flatten, groupBy, sortBy, intersection, difference, partition,
} from '../../src/index';

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
	it('keeps stable order for equal keys', () => expect(sortBy([{ age: 25 }, { age: 20 }, { age: 25 }], 'age')).toEqual([{ age: 20 }, { age: 25 }, { age: 25 }]));
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
