/**
 * Benchmark suite for Array Utility Functions
 * @module test/benchmarks/array
 * @description Measures execution time of array utilities across large inputs.
 * These are not correctness tests — they record relative performance.
 * Run via: npm run bench
 * @since 0.4.0
 */

import {
	dedupe, chunk, flatten, groupBy, sortBy, intersection, difference, partition,
} from '../../src/index';

const ITERATIONS = 10_000;
const LARGE_ARRAY = Array.from({ length: 1_000 }, (_, i) => i % 200);
const LARGE_OBJ_ARRAY = Array.from({ length: 500 }, (_, i) => ({ id: i, type: i % 5 === 0 ? 'a' : 'b', value: Math.random() }));

function bench(label: string, fn: () => void): void {
	const start = performance.now();
	for (let i = 0; i < ITERATIONS; i++) fn();
	const elapsed = performance.now() - start;
	console.log(`  ${label}: ${elapsed.toFixed(2)}ms (${ITERATIONS.toLocaleString()} iterations)`);
}

describe('array benchmarks', () => {
	it('dedupe — 1k-element array with 200-value domain', () => {
		bench('dedupe', () => dedupe(LARGE_ARRAY));
		expect(dedupe(LARGE_ARRAY).length).toBe(200);
	});

	it('chunk — split 1k array into size-10 chunks', () => {
		bench('chunk', () => chunk(LARGE_ARRAY, 10));
		expect(chunk(LARGE_ARRAY, 10).length).toBe(100);
	});

	it('flatten — flatten singly-nested 500-item array', () => {
		const nested = LARGE_ARRAY.map((n) => [n, n + 1]);
		bench('flatten', () => flatten(nested, 1));
	});

	it('groupBy — group 500-item array by string key', () => {
		bench('groupBy', () => groupBy(LARGE_OBJ_ARRAY, 'type'));
	});

	it('sortBy — sort 500-item array ascending by value', () => {
		bench('sortBy', () => sortBy(LARGE_OBJ_ARRAY, 'value'));
	});

	it('intersection — intersect two 500-element arrays', () => {
		const a = LARGE_ARRAY.slice(0, 500);
		const b = LARGE_ARRAY.slice(250);
		bench('intersection', () => intersection(a, b));
	});

	it('difference — difference two 500-element arrays', () => {
		const a = LARGE_ARRAY.slice(0, 500);
		const b = LARGE_ARRAY.slice(250);
		bench('difference', () => difference(a, b));
	});

	it('partition — partition 1k array by even/odd', () => {
		bench('partition', () => partition(LARGE_ARRAY, (n: number) => n % 2 === 0));
	});
});
