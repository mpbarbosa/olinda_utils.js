import { colors, supportsColor, colorize } from '../src/index';

describe('Public API surface', () => {
	it('exports colors', () => expect(typeof colors).toBe('object'));
	it('exports supportsColor', () => expect(typeof supportsColor).toBe('function'));
	it('exports colorize', () => expect(typeof colorize).toBe('function'));
});
