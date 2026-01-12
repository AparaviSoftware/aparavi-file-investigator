import dotenv from 'dotenv';
import { Config, PipelineConfig } from '@types';

dotenv.config();

/**
 * Loads pipeline configurations from environment variables.
 * Supports multiple pipelines with format: PIPELINE_{DATASET_ID}_{PROPERTY}
 *
 * @return {Record<string, PipelineConfig>} Pipeline configurations by dataset ID
 *
 * @example
 *     PIPELINE_EPSTEIN_BASE_URL=https://...
 *     PIPELINE_EPSTEIN_TOKEN=token123
 */
function loadPipelineConfigs(): Record<string, PipelineConfig> {
	const pipelines: Record<string, PipelineConfig> = {};
	const pipelinePattern = /^PIPELINE_([A-Z0-9_]+)_/;
	const timeout = 300000; // 5 minutes

	// Find all pipeline environment variables
	const pipelineVars = Object.keys(process.env).filter(key => pipelinePattern.test(key));

	// Group by dataset ID
	const datasetIds = new Set(
		pipelineVars.map(key => {
			const match = key.match(pipelinePattern);
			return match ? match[1].toLowerCase() : null;
		}).filter(Boolean) as string[]
	);

	// Build config for each dataset
	for (const datasetId of datasetIds) {
		const prefix = `PIPELINE_${datasetId.toUpperCase()}_`;
		pipelines[datasetId] = {
			baseUrl: process.env[`${prefix}BASE_URL`] || '',
			apiKey: process.env[`${prefix}API_KEY`] || '',
			authorizationKey: process.env[`${prefix}AUTHORIZATION_KEY`] || '',
			token: process.env[`${prefix}TOKEN`] || '',
			timeout
		};
	}

	return pipelines;
}

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

	pipelines: loadPipelineConfigs(),

	rateLimit: {
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
		maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
	},

	// Validate required configuration
	validate(): void {
		// Check if we have either the old webhook config or new pipeline configs
		const hasOldConfig = process.env.WEBHOOK_BASE_URL && process.env.WEBHOOK_AUTHORIZATION_KEY && process.env.WEBHOOK_TOKEN;
		const hasNewConfig = Object.keys(this.pipelines).length > 0;

		if (!hasOldConfig && !hasNewConfig) {
			throw new Error('No pipeline configurations found. Either set WEBHOOK_* variables or PIPELINE_* variables.');
		}

		// Validate new pipeline configs
		for (const [datasetId, pipeline] of Object.entries(this.pipelines)) {
			if (!pipeline.baseUrl || !pipeline.authorizationKey || !pipeline.token) {
				throw new Error(`Pipeline configuration for dataset '${datasetId}' is incomplete. Required: BASE_URL, AUTHORIZATION_KEY, TOKEN`);
			}
		}

		// Validate old webhook config if it exists
		if (hasOldConfig && (!this.webhook.baseUrl || !this.webhook.authorizationKey || !this.webhook.token)) {
			throw new Error('Webhook configuration is incomplete');
		}
	}
};

export default config;