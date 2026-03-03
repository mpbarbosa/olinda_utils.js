import { jest } from '@jest/globals';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Logger, LogLevel, stripAnsi, logger } from '../../src/core/logger';

// ─── stripAnsi ───────────────────────────────────────────────────────────────

describe('stripAnsi', () => {
	it('removes ANSI color codes', () => {
		expect(stripAnsi('\x1B[32mhello\x1B[0m')).toBe('hello');
	});
	it('leaves plain strings unchanged', () => {
		expect(stripAnsi('hello world')).toBe('hello world');
	});
	it('strips multiple codes', () => {
		expect(stripAnsi('\x1B[1m\x1B[31mBold Red\x1B[0m')).toBe('Bold Red');
	});
});

// ─── LogLevel ─────────────────────────────────────────────────────────────────

describe('LogLevel', () => {
	it('has DEBUG', () => expect(LogLevel.DEBUG).toBe('debug'));
	it('has INFO', () => expect(LogLevel.INFO).toBe('info'));
	it('has SUCCESS', () => expect(LogLevel.SUCCESS).toBe('success'));
	it('has WARN', () => expect(LogLevel.WARN).toBe('warn'));
	it('has ERROR', () => expect(LogLevel.ERROR).toBe('error'));
});

// ─── Logger constructor ───────────────────────────────────────────────────────

describe('Logger constructor', () => {
	it('uses defaults when no options given', () => {
		const l = new Logger();
		expect(l.quiet).toBe(false);
		expect(l.verbose).toBe(false);
		expect(l.prefix).toBe('');
	});

	it('accepts quiet option', () => {
		const l = new Logger({ quiet: true });
		expect(l.quiet).toBe(true);
	});

	it('accepts verbose option', () => {
		const l = new Logger({ verbose: true });
		expect(l.verbose).toBe(true);
	});

	it('accepts prefix option', () => {
		const l = new Logger({ prefix: '[TEST]' });
		expect(l.prefix).toBe('[TEST]');
	});
});

// ─── Logger._format ──────────────────────────────────────────────────────────

describe('Logger._format', () => {
	const l = new Logger({ prefix: '[P]' });

	it('formats debug messages with [DEBUG]', () => {
		const result = stripAnsi(l._format('msg', 'debug'));
		expect(result).toContain('[DEBUG]');
		expect(result).toContain('msg');
	});

	it('formats info messages with prefix', () => {
		const result = stripAnsi(l._format('hello', 'info'));
		expect(result).toContain('[P]');
		expect(result).toContain('hello');
	});

	it('formats success messages with ✓', () => {
		const result = stripAnsi(l._format('ok', 'success'));
		expect(result).toContain('✓');
	});

	it('formats warn messages with ⚠', () => {
		const result = stripAnsi(l._format('careful', 'warn'));
		expect(result).toContain('⚠');
	});

	it('formats error messages with ✗', () => {
		const result = stripAnsi(l._format('fail', 'error'));
		expect(result).toContain('✗');
	});

	it('returns plain message for unknown level', () => {
		const result = l._format('raw', 'unknown');
		expect(result).toContain('raw');
	});
});

// ─── Logger console output ───────────────────────────────────────────────────

describe('Logger console output', () => {
	let logSpy: jest.SpiedFunction<typeof console.log>;
	let warnSpy: jest.SpiedFunction<typeof console.warn>;
	let errorSpy: jest.SpiedFunction<typeof console.error>;

	beforeEach(() => {
		logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
		warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
		errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('info() logs to console.log when not quiet', () => {
		const l = new Logger({ quiet: false });
		l.info('test info');
		expect(logSpy).toHaveBeenCalled();
	});

	it('info() does not log to console when quiet', () => {
		const l = new Logger({ quiet: true });
		l.info('silent info');
		expect(logSpy).not.toHaveBeenCalled();
	});

	it('success() logs to console.log when not quiet', () => {
		const l = new Logger({ quiet: false });
		l.success('done');
		expect(logSpy).toHaveBeenCalled();
	});

	it('warn() always logs to console.warn', () => {
		const l = new Logger({ quiet: true });
		l.warn('careful');
		expect(warnSpy).toHaveBeenCalled();
	});

	it('error() always logs to console.error', () => {
		const l = new Logger({ quiet: true });
		l.error('oops');
		expect(errorSpy).toHaveBeenCalled();
	});

	it('debug() logs only when verbose and not quiet', () => {
		const l = new Logger({ verbose: true, quiet: false });
		l.debug('verbose msg');
		expect(logSpy).toHaveBeenCalled();
	});

	it('debug() does not log when not verbose', () => {
		const l = new Logger({ verbose: false });
		l.debug('hidden');
		expect(logSpy).not.toHaveBeenCalled();
	});
});

// ─── Logger file logging ──────────────────────────────────────────────────────

describe('Logger file logging', () => {
	let tmpDir: string;
	let logFile: string;

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-test-'));
		logFile = path.join(tmpDir, 'test.log');
	});

	afterEach(async () => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it('setLogFile() creates the log file', async () => {
		const l = new Logger({ quiet: true });
		l.setLogFile(logFile);
		l.info('written to file');
		await l.closeLogFile();
		expect(fs.existsSync(logFile)).toBe(true);
	});

	it('writes stripped ANSI to log file', async () => {
		const l = new Logger({ quiet: true });
		l.setLogFile(logFile);
		l.info('file message');
		await l.closeLogFile();
		const content = fs.readFileSync(logFile, 'utf8');
		expect(content).toContain('file message');
		expect(content).not.toMatch(/\x1B\[/);
	});

	it('openStepLogFile() creates a step log file', async () => {
		const stepLog = path.join(tmpDir, 'step.log');
		const l = new Logger({ quiet: true });
		l.openStepLogFile(stepLog);
		l.info('step log message');
		await l.closeStepLogFile();
		await l.closeLogFile();
		expect(fs.existsSync(stepLog)).toBe(true);
	});

	it('reopenLogFiles() does not throw', async () => {
		const l = new Logger({ quiet: true });
		l.setLogFile(logFile);
		expect(() => l.reopenLogFiles()).not.toThrow();
		await l.closeLogFile();
	});
});

// ─── default logger export ───────────────────────────────────────────────────

describe('default logger export', () => {
	it('is a Logger instance', () => {
		expect(logger).toBeInstanceOf(Logger);
	});

	it('has quiet=false by default', () => {
		expect(logger.quiet).toBe(false);
	});
});
