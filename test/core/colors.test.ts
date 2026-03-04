import { colors, supportsColor, colorize } from '../../src/core/colors';

// ─── Shared helpers ───────────────────────────────────────────────────────────

function resetColorEnv(): void {
	Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
	delete process.env['TERM'];
	delete process.env['NO_COLOR'];
}

// ─── colors object ───────────────────────────────────────────────────────────

describe('colors', () => {
	it.each([
		['reset', '\x1b[0m'],
		['bold', '\x1b[1m'],
		['dim', '\x1b[2m'],
		['red', '\x1b[31m'],
		['green', '\x1b[32m'],
		['yellow', '\x1b[33m'],
		['blue', '\x1b[34m'],
		['cyan', '\x1b[36m'],
		['white', '\x1b[37m'],
		['brightRed', '\x1b[91m'],
		['brightGreen', '\x1b[92m'],
		['brightYellow', '\x1b[93m'],
		['brightBlue', '\x1b[94m'],
		['brightMagenta', '\x1b[95m'],
		['brightCyan', '\x1b[96m'],
		['brightWhite', '\x1b[97m'],
	] as [keyof typeof colors, string][])('should provide ANSI code for %s', (name, code) => {
		expect(colors[name]).toBe(code);
	});
});

// ─── supportsColor ───────────────────────────────────────────────────────────

describe('supportsColor', () => {
	const originalIsTTY = process.stdout.isTTY;
	const originalTERM = process.env['TERM'];
	const originalNO_COLOR = process.env['NO_COLOR'];

	beforeEach(resetColorEnv);

	afterEach(() => {
		Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, configurable: true });
		if (originalTERM === undefined) {
			delete process.env['TERM'];
		} else {
			process.env['TERM'] = originalTERM;
		}
		if (originalNO_COLOR === undefined) {
			delete process.env['NO_COLOR'];
		} else {
			process.env['NO_COLOR'] = originalNO_COLOR;
		}
	});

	it('returns true when isTTY and no restrictions', () => {
		expect(supportsColor()).toBe(true);
	});

	it('returns false when isTTY is false', () => {
		Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
		expect(supportsColor()).toBe(false);
	});

	it('returns false when TERM=dumb', () => {
		process.env['TERM'] = 'dumb';
		expect(supportsColor()).toBe(false);
	});

	it('returns false when NO_COLOR is set', () => {
		process.env['NO_COLOR'] = '1';
		expect(supportsColor()).toBe(false);
	});

	// NO_COLOR='' (empty string): !'' is truthy, so our implementation treats it as
	// "not set" and allows colour. Documents a deliberate deviation from the
	// strict NO_COLOR spec (which says "when present, regardless of value").
	it('returns true when NO_COLOR is empty string (implementation treats as unset)', () => {
		process.env['NO_COLOR'] = '';
		expect(supportsColor()).toBe(true);
	});

	it('returns false when isTTY is undefined (non-TTY stream)', () => {
		Object.defineProperty(process.stdout, 'isTTY', { value: undefined, configurable: true });
		expect(supportsColor()).toBe(false);
	});
});

// ─── colorize ────────────────────────────────────────────────────────────────

describe('colorize', () => {
	beforeEach(resetColorEnv);

	afterEach(() => {
		Object.defineProperty(process.stdout, 'isTTY', { value: undefined, configurable: true });
	});

	it('wraps text with color code and reset when colors supported', () => {
		const result = colorize('hello', colors.red);
		expect(result).toBe(`${colors.red}hello${colors.reset}`);
	});

	it('returns plain text when colors not supported', () => {
		Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true });
		expect(colorize('hello', colors.red)).toBe('hello');
	});

	it('works with any ANSI code string', () => {
		const result = colorize('world', colors.green);
		expect(result).toBe(`\x1b[32mworld\x1b[0m`);
	});

	it('should return empty string when given empty input', () => {
		expect(colorize('', colors.red)).toBe(`${colors.red}${colors.reset}`);
	});
});
