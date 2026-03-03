import {
	colors, supportsColor, colorize,
	Logger, logger, LogLevel, stripAnsi,
	camelCase, deepClone, isEmpty,
} from '../src/index';

describe('Public API surface', () => {
	it('should export a colors object', () => expect(typeof colors).toBe('object'));
	it('should export the supportsColor function', () => expect(typeof supportsColor).toBe('function'));
	it('should export the colorize function', () => expect(typeof colorize).toBe('function'));
	it('should export the Logger class', () => expect(typeof Logger).toBe('function'));
	it('should export a logger default instance of Logger', () => expect(logger).toBeInstanceOf(Logger));
	it('should export the LogLevel constants object', () => expect(typeof LogLevel).toBe('object'));
	it('should export the stripAnsi function', () => expect(typeof stripAnsi).toBe('function'));
	it('should export camelCase string utility', () => expect(typeof camelCase).toBe('function'));
	it('should export deepClone object utility', () => expect(typeof deepClone).toBe('function'));
	it('should export isEmpty object utility', () => expect(typeof isEmpty).toBe('function'));
});
