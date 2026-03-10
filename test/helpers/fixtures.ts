/**
 * Shared test fixtures and typed constants.
 * @module test/helpers/fixtures
 * @description Provides reusable test data for unit and integration tests,
 * reducing duplication and keeping individual test files focused on assertions.
 * @since 0.4.0
 */

// ─── String fixtures ──────────────────────────────────────────────────────────

/** Representative strings in various casing styles. */
export const STRINGS = {
	kebab: 'hello-world',
	snake: 'hello_world',
	camel: 'helloWorld',
	pascal: 'HelloWorld',
	spaced: 'hello world',
	mixed: 'Hello World Test',
	withSpecial: 'hello@world!',
	withWhitespace: '  hello    world  ',
	withTabs: 'hello\t\nworld',
	withRegexChars: 'a.b*c+d?',
	long: 'the quick brown fox jumped over the lazy dog',
} as const;

// ─── Array fixtures ───────────────────────────────────────────────────────────

/** A flat array of numbers with duplicates. */
export const NUM_ARRAY_WITH_DUPES: number[] = [1, 2, 2, 3, 3, 3, 4];

/** A clean flat number array (no duplicates). */
export const NUM_ARRAY: number[] = [1, 2, 3, 4, 5, 6];

/** A nested array for flatten tests. */
export const NESTED_ARRAY: unknown[] = [1, [2, [3, [4]]]];

/** Typed items used for groupBy / sortBy tests. */
export interface Item {
	id: number;
	type: string;
	value: number;
}

export const ITEMS: Item[] = [
	{ id: 1, type: 'a', value: 30 },
	{ id: 2, type: 'b', value: 10 },
	{ id: 3, type: 'a', value: 20 },
	{ id: 4, type: 'c', value: 40 },
];

// ─── Object fixtures ──────────────────────────────────────────────────────────

/** A flat object used for pick / omit / deepEqual tests. */
export const FLAT_OBJ = { a: 1, b: 2, c: 3 } as const;

/** A nested object used for deep operation tests. */
export const NESTED_OBJ = {
	user: {
		profile: { name: 'Alice', age: 30 },
		tags: ['admin', 'user'],
	},
	meta: { created: new Date('2026-01-01') },
} as const;

/** Path string pointing into NESTED_OBJ. */
export const NESTED_PATH = 'user.profile.name';
