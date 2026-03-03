import { colors, supportsColor, colorize, Logger, logger, LogLevel, stripAnsi } from '../src/index';

describe('Public API surface', () => {
	it('exports colors', () => expect(typeof colors).toBe('object'));
	it('exports supportsColor', () => expect(typeof supportsColor).toBe('function'));
	it('exports colorize', () => expect(typeof colorize).toBe('function'));
	it('exports Logger class', () => expect(typeof Logger).toBe('function'));
	it('exports logger default instance', () => expect(logger).toBeInstanceOf(Logger));
	it('exports LogLevel', () => expect(typeof LogLevel).toBe('object'));
	it('exports stripAnsi', () => expect(typeof stripAnsi).toBe('function'));
});
