/**
 * Simple logger utility for application logging.
 * Provides consistent logging interface across the application.
 *
 * @example
 *     Logger.info('User logged in', { userId: 123 });
 *     Logger.error('Database connection failed', error);
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Formats and outputs log message with timestamp and level.
 *
 * @param {LogLevel} level - The log level (info, warn, error, debug)
 * @param {string} message - The log message
 * @param {any} meta - Optional metadata to log
 *
 * @return {void}
 *
 * @example
 *     log('info', 'Server started', { port: 3001 });
 */
function log(level: LogLevel, message: string, meta?: any): void {
	const timestamp = new Date().toISOString();
	const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

	if (meta) {
		console[level](logMessage, meta);
	} else {
		console[level](logMessage);
	}
}

export default class Logger {
	/**
	 * Logs informational messages.
	 *
	 * @param {string} message - The log message
	 * @param {any} meta - Optional metadata to log
	 *
	 * @return {void}
	 *
	 * @example
	 *     Logger.info('User logged in', { userId: 123 });
	 */
	static info(message: string, meta?: any): void {
		log('info', message, meta);
	}

	/**
	 * Logs warning messages.
	 *
	 * @param {string} message - The log message
	 * @param {any} meta - Optional metadata to log
	 *
	 * @return {void}
	 *
	 * @example
	 *     Logger.warn('Deprecated API used', { endpoint: '/old-api' });
	 */
	static warn(message: string, meta?: any): void {
		log('warn', message, meta);
	}

	/**
	 * Logs error messages.
	 *
	 * @param {string} message - The log message
	 * @param {any} meta - Optional metadata to log
	 *
	 * @return {void}
	 *
	 * @example
	 *     Logger.error('Database connection failed', error);
	 */
	static error(message: string, meta?: any): void {
		log('error', message, meta);
	}

	/**
	 * Logs debug messages.
	 *
	 * @param {string} message - The log message
	 * @param {any} meta - Optional metadata to log
	 *
	 * @return {void}
	 *
	 * @example
	 *     Logger.debug('Cache hit', { key: 'user:123' });
	 */
	static debug(message: string, meta?: any): void {
		log('debug', message, meta);
	}
}
