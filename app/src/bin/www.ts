#!/usr/bin/env node

/** Packages */
import http from 'http';
import os from 'os';
import { version as tsVersion } from 'typescript';
import moment from 'moment';
import d from 'debug';
import app from '../app';
import config from '@config';

/** Error Interface */
interface IErrNoException extends Error {
	errno?: number;
	code?: string;
	path?: string;
	syscall?: string;
	stack?: string;
}

const debug = d('file-investigator:server');

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string} val - port value
 * @return {string | number | false} normalized port
 *
 * @example
 *     normalizePort('3000')
 */
function normalizePort(val: string): string | number | false {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val; // named pipe
	}

	if (port >= 0) {
		return port; // port number
	}

	return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(config.port.toString());
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {IErrNoException} error - error object
 * @return {void}
 *
 * @example
 *     onError(error)
 */
function onError(error: IErrNoException): void {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/** IIFE starting the server */
(async function () {
	const backendType = process.env.BACKEND_TYPE || 'express';

	if (backendType === 'lambda') {
		console.log(`
****************************************
*
*   Aparavi - File Investigator Backend (TypeScript)
*   Copyright (c) ${moment().year()} Aparavi
*
*       Environment:   ${config.nodeEnv}
*       Backend Type:  Lambda
*
*       Express server is NOT started.
*       The application is configured to use AWS Lambda.
*
*       Time:          ${moment().format('YY/MM/DD, hh:mm:ss A')}
*       Node.js:       ${process.version}
*       TypeScript:    ${tsVersion}
*
****************************************

The Express backend is disabled.
Frontend should be configured to invoke Lambda directly.
Press Ctrl+C to exit.
`);

		// Keep the process running
		process.on('SIGTERM', () => {
			console.log('\nExiting...');
			process.exit(0);
		});
		process.on('SIGINT', () => {
			console.log('\nExiting...');
			process.exit(0);
		});

		return;
	}

	/**
	 * Create HTTP server.
	 */
	const httpServer = http.createServer(app);
	httpServer.listen(port);
	httpServer.on('error', onError);
	httpServer.on('listening', function () {
		const addr = httpServer.address();
		const bind =
			typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
		debug('Listening on ' + bind);
		console.log(`
****************************************
*
*   Aparavi - File Investigator Backend (TypeScript)
*   Copyright (c) ${moment().year()} Aparavi
*
*       Environment:   ${config.nodeEnv}
*       Backend Type:  Express
*       PORT:          ${config.port}
*       URL:           http://localhost:${config.port}
*       Webhook:       ${config.webhook.baseUrl}
*       Frontend:      ${config.frontend.url}
*
*       Time:          ${moment().format('YY/MM/DD, hh:mm:ss A')}
*       Node.js:       ${process.version}
*       TypeScript:    ${tsVersion}
*       Memory:        ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
*       CPU Usage:     ${os.loadavg()[0].toFixed(2)}%
*       Uptime:        ${process.uptime().toFixed(2)} seconds
*       OS:            ${os.type()} ${os.release()}
*       CPUs:          ${os.cpus().length}
*
****************************************

Available Endpoints:
	POST /api/chat        - Text/JSON chat

Press Ctrl+C to stop`);
	});

	// Graceful shutdown
	const shutdown = (): void => {
		console.log('\nShutting down gracefully...');
		httpServer.close(() => {
			console.log('Server closed');
			process.exit(0);
		});

		// Force shutdown after 10 seconds
		setTimeout(() => {
			console.error('Forced shutdown');
			process.exit(1);
		}, 10000);
	};

	process.on('SIGTERM', shutdown);
	process.on('SIGINT', shutdown);
})();
