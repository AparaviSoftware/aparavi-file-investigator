import { Config } from '../types';

const config: Config = {
	webhook: {
		baseUrl: process.env.WEBHOOK_BASE_URL || '',
		apiKey: process.env.WEBHOOK_API_KEY || '',
		authorizationKey: process.env.WEBHOOK_AUTHORIZATION_KEY || '',
		token: process.env.WEBHOOK_TOKEN || '',
		timeout: 300000 // 5 minutes
	},

	// Validate required configuration
	validate(): void {
		const required = ['WEBHOOK_BASE_URL', 'WEBHOOK_AUTHORIZATION_KEY', 'WEBHOOK_TOKEN'];
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
