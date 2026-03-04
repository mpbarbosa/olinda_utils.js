/**
 * Logger Module
 * @version 1.0.0
 * @description Colored output and logging utilities for workflow automation
 * @module core/logger
 * @since 0.1.2
 */

import { colorize, colors, supportsColor } from './colors.js';
import fs from 'fs';
import path from 'path';

/**
 * Strip ANSI escape codes from a string so log files are plain text.
 * @since 0.1.2
 * @param str - The string to strip.
 * @returns The string without ANSI codes.
 * @example
 * stripAnsi('\x1B[32mhello\x1B[0m'); // 'hello'
 */
export function stripAnsi(str: string): string {
	// eslint-disable-next-line no-control-regex
	return str.replace(/\x1B\[[0-9;]*m/g, '');
}

/**
 * Log levels with corresponding labels.
 * @since 0.1.2
 * @example
 * logger.log('msg', LogLevel.INFO);
 */
export const LogLevel = {
	DEBUG: 'debug',
	INFO: 'info',
	SUCCESS: 'success',
	WARN: 'warn',
	ERROR: 'error',
} as const;

export type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];

/**
 * Options accepted by the {@link Logger} constructor.
 * @since 0.1.2
 */
export interface LoggerOptions {
	/** Suppress all console output. Default: `false` */
	quiet?: boolean;
	/** Enable verbose/debug output. Default: `false` */
	verbose?: boolean;
	/** Prefix prepended to every message. Default: `''` */
	prefix?: string;
}

/**
 * Logger class for consistent output formatting.
 * @since 0.1.2
 * @example
 * const log = new Logger({ prefix: '[myapp]' });
 * log.info('Started');
 * log.success('Done');
 * log.warn('Watch out');
 * log.error('Failed');
 */
export class Logger {
	quiet: boolean;
	verbose: boolean;
	prefix: string;
	private _logStream: fs.WriteStream | null;
	private _stepLogStream: fs.WriteStream | null;
	private _logFilePath: string | null;
	private _stepLogFilePath: string | null;

	constructor(options: LoggerOptions = {}) {
		this.quiet = options.quiet ?? false;
		this.verbose = options.verbose ?? false;
		this.prefix = options.prefix ?? '';
		this._logStream = null;
		this._stepLogStream = null;
		this._logFilePath = null;
		this._stepLogFilePath = null;
	}

	/**
	 * Open a per-step secondary log file. All log lines are written to both
	 * the main workflow log and this step log until closeStepLogFile() is called.
	 * @param filePath - Absolute path to the step log file.
	 */
	openStepLogFile(filePath: string): void {
		try {
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
			if (this._stepLogStream) {
				this._stepLogStream.end();
			}
			this._stepLogFilePath = filePath;
			this._stepLogStream = fs.createWriteStream(filePath, { flags: 'a' });
			this._stepLogStream.on('error', () => { /* best-effort */ });
		} catch {
			// Best-effort; do not crash the workflow
		}
	}

	/** Close the per-step log file stream. */
	async closeStepLogFile(): Promise<void> {
		if (this._stepLogStream) {
			const stream = this._stepLogStream;
			this._stepLogStream = null;
			await new Promise<void>((resolve) => stream.end(resolve));
		}
	}

	/**
	 * Configure file logging. Creates the directory if needed and opens an
	 * append stream to the given file path. All subsequent log calls will
	 * be written there (without ANSI codes) in addition to the console.
	 * @param filePath - Absolute path to the log file.
	 */
	setLogFile(filePath: string): void {
		try {
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
			if (this._logStream) {
				this._logStream.end();
			}
			this._logFilePath = filePath;
			this._logStream = fs.createWriteStream(filePath, { flags: 'a' });
			this._logStream.on('error', () => { /* best-effort */ });
		} catch {
			// File logging is best-effort; do not crash the workflow
		}
	}

	/** Close the log file stream (call at end of workflow run). */
	async closeLogFile(): Promise<void> {
		if (this._logStream) {
			const stream = this._logStream;
			this._logStream = null;
			await new Promise<void>((resolve) => stream.end(resolve));
		}
	}

	/**
	 * Reopen both log streams at the same paths (append mode).
	 *
	 * Git stash and git pull --rebase can atomically replace log files on disk
	 * (via temp-file + rename), orphaning the existing file descriptors so that
	 * subsequent writes go to invisible inodes. Calling this method after those
	 * git operations replaces the orphaned streams with fresh ones that point to
	 * the current, filesystem-visible files.
	 */
	reopenLogFiles(): void {
		try {
			if (this._logFilePath && this._logStream) {
				this._logStream.end();
				this._logStream = fs.createWriteStream(this._logFilePath, { flags: 'a' });
				this._logStream.on('error', () => { /* best-effort */ });
			}
			if (this._stepLogFilePath && this._stepLogStream) {
				this._stepLogStream.end();
				this._stepLogStream = fs.createWriteStream(this._stepLogFilePath, { flags: 'a' });
				this._stepLogStream.on('error', () => { /* best-effort */ });
			}
		} catch {
			// Best-effort; do not crash the workflow
		}
	}

	/**
	 * Log a step header — a visually prominent banner marking the start of a workflow step.
	 * Always written to file; respects the quiet flag for console output.
	 * @param title - Step title (e.g. 'Step 1: AI-Powered Documentation Updates').
	 */
	step(title: string): void {
		const separator = '═'.repeat(60);
		const headerText = `🔷  ${title}`;
		if (!this.quiet) {
			if (supportsColor()) {
				const sep = `${colors.bold}${colors.brightMagenta}${separator}${colors.reset}`;
				const hdr = `${colors.bold}${colors.brightMagenta}${headerText}${colors.reset}`;
				console.log(sep);
				console.log(hdr);
				console.log(sep);
			} else {
				console.log(separator);
				console.log(headerText);
				console.log(separator);
			}
		}
		this._writeFile(separator);
		this._writeFile(headerText);
		this._writeFile(separator);
	}

	/** Log a debug message (only in verbose mode).
	 * @param message - Message to log.
	 * @since 0.1.2
	 */
	debug(message: string): void {
		if (this.verbose && !this.quiet) {
			const formatted = this._format(message, 'debug');
			console.log(formatted);
			this._writeFile(formatted);
		}
	}

	/** Log an informational message.
	 * @param message - Message to log.
	 * @since 0.1.2
	 */
	info(message: string): void {
		if (!this.quiet) {
			const formatted = this._format(message, 'info');
			console.log(formatted);
		}
		this._writeFile(this._format(message, 'info'));
	}

	/** Log a success message.
	 * @param message - Message to log.
	 * @since 0.1.2
	 */
	success(message: string): void {
		if (!this.quiet) {
			const formatted = this._format(message, 'success');
			console.log(formatted);
		}
		this._writeFile(this._format(message, 'success'));
	}

	/** Log a warning message.
	 * @param message - Message to log.
	 * @since 0.1.2
	 */
	warn(message: string): void {
		const formatted = this._format(message, 'warn');
		console.warn(formatted);
		this._writeFile(formatted);
	}

	/** Log an error message.
	 * @param message - Message to log.
	 * @since 0.1.2
	 */
	error(message: string): void {
		const formatted = this._format(message, 'error');
		console.error(formatted);
		this._writeFile(formatted);
	}

	/**
	 * Format a message with color and optional prefix.
	 * @param message - The message text.
	 * @param level - Log level key (`'debug'`, `'info'`, `'success'`, `'warn'`, `'error'`).
	 * @returns Formatted (possibly ANSI-colored) string.
	 * @internal
	 */
	_format(message: string, level: string): string {
		const prefix = this.prefix ? `${this.prefix} ` : '';

		switch (level) {
			case 'debug':
				return colorize(`[DEBUG] ${prefix}${message}`, colors.dim);
			case 'info':
				return colorize(`${prefix}${message}`, colors.cyan);
			case 'success':
				return colorize(`✓ ${prefix}${message}`, colors.green);
			case 'warn':
				return colorize(`⚠ ${prefix}${message}`, colors.yellow);
			case 'error':
				return colorize(`✗ ${prefix}${message}`, colors.red);
			default:
				return `${prefix}${message}`;
		}
	}

	/**
	 * Write a plain-text line to the log file (best-effort, no throw).
	 * @param formatted - Already-formatted (possibly ANSI) string.
	 * @internal
	 */
	_writeFile(formatted: string): void {
		const timestamp = new Date().toISOString();
		const line = `[${timestamp}] ${stripAnsi(formatted)}\n`;
		if (this._logStream) {
			try {
				this._logStream.write(line);
			} catch {
				/* ignore */
			}
		}
		if (this._stepLogStream) {
			try {
				this._stepLogStream.write(line);
			} catch {
				/* ignore */
			}
		}
	}
}

/**
 * Default logger instance with no prefix and quiet/verbose both off.
 * @since 0.1.2
 * @example
 * import { logger } from 'olinda_utils.js';
 * logger.info('Ready');
 */
export const logger = new Logger();

export default logger;
