import {
	colors, supportsColor, colorize,
	Logger, logger, LogLevel, stripAnsi,
	camelCase, deepClone, isEmpty,
} from '../src/index';

describe('Public API surface', () => {
	it('should export a colors object', () => expect(colors).toBeDefined());
	it('should export the supportsColor function', () => expect(supportsColor).toBeDefined());
	it('should export the colorize function', () => expect(colorize).toBeDefined());
	it('should export the Logger class', () => expect(Logger).toBeDefined());
	it('should export a logger default instance of Logger', () => expect(logger).toBeInstanceOf(Logger));
	it('should export the LogLevel constants object', () => expect(LogLevel).toBeDefined());
	it('should export the stripAnsi function', () => expect(stripAnsi).toBeDefined());
	it('should export camelCase string utility', () => expect(camelCase).toBeDefined());
	it('should export deepClone object utility', () => expect(deepClone).toBeDefined());
	it('should export isEmpty object utility', () => expect(isEmpty).toBeDefined());
});
