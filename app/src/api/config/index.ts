import dotenv from 'dotenv';
import { Config } from '@types';

dotenv.config();

const config: Config = {
	port: parseInt(process.env.PORT || '3001', 10),
	nodeEnv: process.env.NODE_ENV || 'development',

	frontend: {
		url: process.env.FRONTEND_URL || 'http://localhost:3000'
	},

	webhook: {
		baseUrl: process.env.WEBHOOK_BASE_URL || '',
		apiKey: process.env.WEBHOOK_API_KEY || '',
		authorizationKey: process.env.WEBHOOK_AUTHORIZATION_KEY || '',
		token: process.env.WEBHOOK_TOKEN || '',
		timeout: 300000 // 5 minutes
	},

	rateLimit: {
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
		maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
	},

	// Validate required configuration
	validate(): void {
		const required: (keyof NodeJS.ProcessEnv)[] = ['WEBHOOK_BASE_URL', 'WEBHOOK_AUTHORIZATION_KEY', 'WEBHOOK_TOKEN'];
		const missing = required.filter(key => !process.env[key]);

		if (missing.length > 0) {
			throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
		}

		if (!this.webhook.baseUrl || !this.webhook.authorizationKey || !this.webhook.token) {
			throw new Error('Webhook configuration is incomplete');
		}
	}
};

export default config;