/**
 * Smoke tests — utils public surface
 * @module test/core/utils
 * @description Verifies all 26 utility functions are exported and callable from the public API.
 * Full behavioural tests live in test/utils/{string,array,object}.test.ts.
 * @since 0.4.0
 */

import {
	camelCase, kebabCase, snakeCase, pascalCase,
	capitalize, truncate, sanitize, cleanWhitespace, escapeRegex,
	dedupe, chunk, flatten, groupBy, sortBy, intersection, difference, partition,
	deepClone, deepMerge, pick, omit,
	getProperty, setProperty, hasProperty, deepEqual, isEmpty,
} from '../../src/index';

const utilFunctions = {
	camelCase, kebabCase, snakeCase, pascalCase,
	capitalize, truncate, sanitize, cleanWhitespace, escapeRegex,
	dedupe, chunk, flatten, groupBy, sortBy, intersection, difference, partition,
	deepClone, deepMerge, pick, omit,
	getProperty, setProperty, hasProperty, deepEqual, isEmpty,
};

describe('utils public surface', () => {
	it.each(Object.entries(utilFunctions))('%s is exported as a function', (_, fn) => {
		expect(typeof fn).toBe('function');
	});
});
