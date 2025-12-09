import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from '@config';
import { errorHandler, notFoundHandler } from '@middleware/error';
// Components
import routes from '@router/router';
// Validate configuration on startup
try {
	config.validate();
} catch (error) {
	console.error('❌ Configuration error:', (error as Error).message);
	process.exit(1);
}

const app: Application = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps, curl, Postman)
		if (!origin) return callback(null, true);

		// Allow configured frontend URL
		if (origin === config.frontend.url) {
			return callback(null, true);
		}

		// In development, allow localhost on any port
		if (config.nodeEnv === 'development' &&
			(origin.includes('localhost') || origin.includes('127.0.0.1'))) {
			return callback(null, true);
		}

		callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	exposedHeaders: ['X-Response-Time'],
	preflightContinue: false,
	optionsSuccessStatus: 204
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.maxRequests,
	message: {
		error: true,
		message: 'Too many requests, please try again later.'
	},
	standardHeaders: true,
	legacyHeaders: false
});

app.use('/api/', limiter);

// Request logging (development only)
if (config.nodeEnv === 'development') {
	app.use((req: Request, _res: Response, next: NextFunction) => {
		console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
		next();
	});
}

// ============================================================================
// ROUTES
// ============================================================================

// Healthcheck route at root
app.get('/', (_req: Request, res: Response) => {
	res.status(200).send(`
		<html>
			<head>
				<title>Healthcheck</title>
			</head>
			<body>
				<p>OK</p>
			</body>
		</html>
	`);
});

// Mount component routes
app.use('/api/', routes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(config.port, () => {
	const moment = require('moment');
	const os = require('os');
	const tsVersion = require('typescript').version;
	console.log(`
  ****************************************
  *
  *   Aparavi Pipeline Chat Backend (TypeScript)
  *   Copyright (c) ${moment().year()} Aparavi
  *
  *       Environment:   ${config.nodeEnv}
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
	server.close(() => {
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

export default app;
