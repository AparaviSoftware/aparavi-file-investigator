import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from '@config';
import { errorHandler, notFoundHandler } from '@middleware/error';
import { fingerprintMiddleware } from '@middleware/fingerprint';
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

		// In production, allow localhost on any port (for local preview builds)
		// but only if the configured frontend URL is also localhost
		const frontendIsLocalhost = config.frontend.url.includes('localhost') ||
			config.frontend.url.includes('127.0.0.1');
		if (config.nodeEnv === 'production' &&
			frontendIsLocalhost &&
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

// Fingerprint extraction and logging
app.use(fingerprintMiddleware);

// Rate limiting - uses fingerprint if available, falls back to IP
const limiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.maxRequests,
	message: {
		error: true,
		message: 'Too many requests, please try again later.'
	},
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req: Request): string => {
		// Use fingerprint ID if available (set by fingerprint middleware)
		if (req.fingerprintId) {
			return `fingerprint:${req.fingerprintId}`;
		}
		// Fall back to IP address
		return req.ip || req.socket.remoteAddress || 'unknown';
	}
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

/** Expose our app */
export default app;
