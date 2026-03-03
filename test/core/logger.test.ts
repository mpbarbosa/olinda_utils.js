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
	it.each([
		['DEBUG', 'debug'],
		['INFO', 'info'],
		['SUCCESS', 'success'],
		['WARN', 'warn'],
		['ERROR', 'error'],
	] as [keyof typeof LogLevel, string][])('should define %s as %s', (key, value) => {
		expect(LogLevel[key]).toBe(value);
	});
});

// ─── Logger constructor ───────────────────────────────────────────────────────

describe('Logger constructor', () => {
	it('uses defaults when no options given', () => {
		const l = new Logger();
		expect(l.quiet).toBe(false);
		expect(l.verbose).toBe(false);
		expect(l.prefix).toBe('');
	});

	it.each([
		[{ quiet: true }, 'quiet', true],
		[{ verbose: true }, 'verbose', true],
		[{ prefix: '[TEST]' }, 'prefix', '[TEST]'],
	] as [ConstructorParameters<typeof Logger>[0], keyof Logger, unknown][])('should accept %s option', (opts, prop, expected) => {
		const l = new Logger(opts);
		expect(l[prop]).toBe(expected);
	});
});

// ─── Logger._format ──────────────────────────────────────────────────────────

describe('Logger._format', () => {
	const l = new Logger({ prefix: '[P]' });

	it.each([
		['debug', 'msg', '[DEBUG]'],
		['success', 'ok', '✓'],
		['warn', 'careful', '⚠'],
		['error', 'fail', '✗'],
	] as [string, string, string][])('formats %s messages with marker %s', (level, msg, marker) => {
		const result = stripAnsi(l._format(msg, level));
		expect(result).toContain(marker);
	});

	it('formats info messages with prefix and message', () => {
		const result = stripAnsi(l._format('hello', 'info'));
		expect(result).toContain('[P]');
		expect(result).toContain('hello');
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

	it('setLogFile() can be called twice (closes previous stream)', async () => {
		const logFile2 = path.join(tmpDir, 'test2.log');
		const l = new Logger({ quiet: true });
		l.setLogFile(logFile);
		l.setLogFile(logFile2); // covers line 106: this._logStream.end()
		l.info('written to second log');
		await l.closeLogFile();
		expect(fs.existsSync(logFile2)).toBe(true);
	});

	it('openStepLogFile() can be called twice (closes previous stream)', async () => {
		const stepLog1 = path.join(tmpDir, 'step1.log');
		const stepLog2 = path.join(tmpDir, 'step2.log');
		const l = new Logger({ quiet: true });
		l.openStepLogFile(stepLog1);
		l.openStepLogFile(stepLog2); // covers line 77: this._stepLogStream.end()
		l.info('step log message');
		await l.closeStepLogFile();
		expect(fs.existsSync(stepLog2)).toBe(true);
	});

	it('reopenLogFiles() works with both log and step log streams open', async () => {
		const stepLog = path.join(tmpDir, 'step.log');
		const l = new Logger({ quiet: true });
		l.setLogFile(logFile);
		l.openStepLogFile(stepLog);
		expect(() => l.reopenLogFiles()).not.toThrow(); // covers lines 142-145
		l.info('after reopen');
		await l.closeStepLogFile();
		await l.closeLogFile();
		expect(fs.existsSync(stepLog)).toBe(true);
	});
});

// ─── Logger.step() ───────────────────────────────────────────────────────────

describe('Logger.step()', () => {
	let logSpy: jest.SpiedFunction<typeof console.log>;

	beforeEach(() => {
		logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should log a step header to console when not quiet', () => {
		const l = new Logger({ quiet: false });
		l.step('Test Step');
		expect(logSpy).toHaveBeenCalled();
	});

	it('should not log to console when quiet', () => {
		const l = new Logger({ quiet: true });
		l.step('Silent Step');
		expect(logSpy).not.toHaveBeenCalled();
	});

	it('should write step header to file even when quiet', async () => {
		const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'step-test-'));
		const logFile = path.join(tmpDir, 'step.log');
		const l = new Logger({ quiet: true });
		l.setLogFile(logFile);
		l.step('File Step');
		await l.closeLogFile();
		const content = fs.readFileSync(logFile, 'utf8');
		expect(content).toContain('File Step');
		fs.rmSync(tmpDir, { recursive: true, force: true });
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
