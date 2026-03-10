/**
 * Benchmark suite for Object Utility Functions
 * @module test/benchmarks/object
 * @description Measures execution time of object utilities across realistic inputs.
 * These are not correctness tests — they record relative performance.
 * Run via: npm run bench
 * @since 0.4.0
 */

import {
	deepClone, deepMerge, deepEqual, getProperty, setProperty, pick, omit,
} from '../../src/index';

const ITERATIONS = 5_000;

const DEEP_OBJ = {
	level1: {
		level2: {
			level3: {
				value: 42,
				items: [1, 2, 3, 4, 5],
				meta: { created: new Date('2026-01-01'), tags: ['a', 'b', 'c'] },
			},
		},
	},
	other: { x: 1, y: 2, z: 3 },
};

const FLAT_OBJ = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };

function bench(label: string, fn: () => void): void {
	const start = performance.now();
	for (let i = 0; i < ITERATIONS; i++) fn();
	const elapsed = performance.now() - start;
	console.log(`  ${label}: ${elapsed.toFixed(2)}ms (${ITERATIONS.toLocaleString()} iterations)`);
}

describe('object benchmarks', () => {
	it('deepClone — 3-level nested object with Date and array', () => {
		bench('deepClone', () => deepClone(DEEP_OBJ));
		const clone = deepClone(DEEP_OBJ);
		expect(clone).toEqual(DEEP_OBJ);
		expect(clone).not.toBe(DEEP_OBJ);
	});

	it('deepMerge — merge two 3-level objects', () => {
		const patch = { level1: { level2: { extra: true } }, newKey: 'value' };
		bench('deepMerge', () => deepMerge(DEEP_OBJ as Record<string, unknown>, patch));
	});

	it('deepEqual — compare two equal 3-level objects', () => {
		const copy = deepClone(DEEP_OBJ);
		bench('deepEqual (equal)', () => deepEqual(DEEP_OBJ, copy));
		expect(deepEqual(DEEP_OBJ, copy)).toBe(true);
	});

	it('deepEqual — compare two unequal objects (fast exit)', () => {
		const other = { ...DEEP_OBJ, other: { x: 99, y: 2, z: 3 } };
		bench('deepEqual (unequal)', () => deepEqual(DEEP_OBJ, other));
		expect(deepEqual(DEEP_OBJ, other)).toBe(false);
	});

	it('getProperty — read 3-level nested path', () => {
		bench('getProperty', () => getProperty(DEEP_OBJ, 'level1.level2.level3.value'));
		expect(getProperty(DEEP_OBJ, 'level1.level2.level3.value')).toBe(42);
	});

	it('setProperty — write 3-level nested path (non-mutating)', () => {
		bench('setProperty', () => setProperty(DEEP_OBJ, 'level1.level2.level3.value', 99));
	});

	it('pick — select 4 keys from 8-key flat object', () => {
		bench('pick', () => pick(FLAT_OBJ, ['a', 'c', 'e', 'g']));
		expect(pick(FLAT_OBJ, ['a', 'c', 'e', 'g'])).toEqual({ a: 1, c: 3, e: 5, g: 7 });
	});

	it('omit — remove 4 keys from 8-key flat object', () => {
		bench('omit', () => omit(FLAT_OBJ, ['b', 'd', 'f', 'h']));
		expect(omit(FLAT_OBJ, ['b', 'd', 'f', 'h'])).toEqual({ a: 1, c: 3, e: 5, g: 7 });
	});
});
