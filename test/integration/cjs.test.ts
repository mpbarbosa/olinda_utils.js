/**
 * CJS integration smoke test — imports from compiled dist/src/index.js
 * @module test/integration/cjs
 * @description Verifies that the CJS build is consumable via require() and
 * that representative functions from each utility domain behave correctly.
 * @since 0.4.0
 */

import { STRINGS, FLAT_OBJ, NUM_ARRAY_WITH_DUPES } from '../helpers/fixtures';

// Use require() to exercise the CJS entry point
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lib = require('../../dist/src/index.js') as typeof import('../../src/index');

describe('CJS build — public surface', () => {
	it('exports are accessible via require()', () => {
		expect(typeof lib).toBe('object');
		expect(lib).not.toBeNull();
	});

	describe('string utilities', () => {
		it('camelCase converts kebab → camel', () => {
			expect(lib.camelCase(STRINGS.kebab)).toBe('helloWorld');
		});
		it('kebabCase converts camel → kebab', () => {
			expect(lib.kebabCase(STRINGS.camel)).toBe('hello-world');
		});
		it('capitalize upcases first letter', () => {
			expect(lib.capitalize('hello')).toBe('Hello');
		});
	});

	describe('array utilities', () => {
		it('dedupe removes duplicates', () => {
			expect(lib.dedupe(NUM_ARRAY_WITH_DUPES)).toEqual([1, 2, 3, 4]);
		});
		it('chunk splits array', () => {
			expect(lib.chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
		});
		it('flatten flattens nested array', () => {
			expect(lib.flatten([1, [2, [3]]])).toEqual([1, 2, 3]);
		});
	});

	describe('object utilities', () => {
		it('deepClone produces independent copy', () => {
			const clone = lib.deepClone(FLAT_OBJ);
			expect(clone).toEqual(FLAT_OBJ);
			expect(clone).not.toBe(FLAT_OBJ);
		});
		it('pick selects keys', () => {
			expect(lib.pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
		});
		it('isEmpty detects empty values', () => {
			expect(lib.isEmpty(null)).toBe(true);
			expect(lib.isEmpty('hello')).toBe(false);
		});
	});

	describe('core utilities', () => {
		it('Logger is exported', () => {
			expect(typeof lib.Logger).toBe('function');
		});
		it('colors is exported', () => {
			expect(typeof lib.colors).toBe('object');
		});
	});
});
