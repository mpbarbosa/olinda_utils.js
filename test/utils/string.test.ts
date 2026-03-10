/**
 * Tests for String Utility Functions
 * @module test/utils/string
 * @since 0.4.0
 */

import {
	camelCase, kebabCase, snakeCase, pascalCase,
	capitalize, truncate, sanitize, cleanWhitespace, escapeRegex,
} from '../../src/index';

describe('camelCase', () => {
	it.each([
		['hello-world', 'helloWorld'],
		['hello_world', 'helloWorld'],
		['hello world', 'helloWorld'],
		['HelloWorld', 'helloWorld'],
	] as [string, string][])('converts %s → %s', (input, expected) => {
		expect(camelCase(input)).toBe(expected);
	});
	it.each([null, 123] as const)('returns \'\' for non-string input %s', (input) => {
		expect(camelCase(input)).toBe('');
	});
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
	it.each([null, 123] as const)('returns \'\' for non-string input %s', (input) => {
		expect(kebabCase(input)).toBe('');
	});
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
	it.each([null, 123] as const)('returns \'\' for non-string input %s', (input) => {
		expect(snakeCase(input)).toBe('');
	});
});

describe('pascalCase', () => {
	it.each([
		['helloWorld', 'HelloWorld'],
		['hello-world', 'HelloWorld'],
		['hello_world', 'HelloWorld'],
	] as [string, string][])('converts %s → %s', (input, expected) => {
		expect(pascalCase(input)).toBe(expected);
	});
	it.each([null, 123] as const)('returns \'\' for non-string input %s', (input) => {
		expect(pascalCase(input)).toBe('');
	});
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
	it.each([null, 123] as const)('returns \'\' for non-string input %s', (input) => {
		expect(sanitize(input)).toBe('');
	});
});

describe('cleanWhitespace', () => {
	it('collapses extra spaces', () => expect(cleanWhitespace('hello    world')).toBe('hello world'));
	it('trims edges', () => expect(cleanWhitespace('  hello world  ')).toBe('hello world'));
	it('handles tabs and newlines', () => expect(cleanWhitespace('hello\t\nworld')).toBe('hello world'));
	it.each([null, 123] as const)('returns \'\' for non-string input %s', (input) => {
		expect(cleanWhitespace(input)).toBe('');
	});
});

describe('escapeRegex', () => {
	it('escapes dot', () => expect(escapeRegex('hello.world')).toBe('hello\\.world'));
	it('escapes multiple metacharacters', () => expect(escapeRegex('a*b+c?')).toBe('a\\*b\\+c\\?'));
	it('escapes parens and brackets', () => expect(escapeRegex('(test)[value]')).toBe('\\(test\\)\\[value\\]'));
	it.each([null, 123] as const)('returns \'\' for non-string input %s', (input) => {
		expect(escapeRegex(input)).toBe('');
	});
});
