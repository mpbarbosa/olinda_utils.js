import {
	colors, supportsColor, colorize,
	Logger, logger, LogLevel, stripAnsi,
	camelCase, deepClone, isEmpty,
} from '../src/index';

describe('Public API surface', () => {
	it('should export a colors object with ANSI codes', () => {
		expect(colors).toHaveProperty('red', '\x1b[31m');
		expect(colors).toHaveProperty('green', '\x1b[32m');
		expect(colors).toHaveProperty('reset', '\x1b[0m');
	});
	it('should export the supportsColor function', () => expect(typeof supportsColor).toBe('function'));
	it('should export the colorize function that returns a string', () => expect(colorize('x', '')).toBe('x'));
	it('should export the Logger class', () => expect(Logger).toBeDefined());
	it('should export a logger default instance of Logger', () => expect(logger).toBeInstanceOf(Logger));
	it('should export the LogLevel constants object', () => {
		expect(LogLevel).toEqual({ DEBUG: 'debug', INFO: 'info', SUCCESS: 'success', WARN: 'warn', ERROR: 'error' });
	});
	it('should export the stripAnsi function that strips ANSI codes', () => expect(stripAnsi('\x1b[32mok\x1b[0m')).toBe('ok'));
	it('should export camelCase string utility', () => expect(camelCase('hello world')).toBe('helloWorld'));
	it('should export deepClone object utility', () => {
		const obj = { a: 1 };
		expect(deepClone(obj)).toEqual(obj);
		expect(deepClone(obj)).not.toBe(obj);
	});
	it('should export isEmpty object utility', () => expect(isEmpty({})).toBe(true));
});
