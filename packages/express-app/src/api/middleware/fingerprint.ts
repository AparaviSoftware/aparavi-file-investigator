import { Request, Response, NextFunction } from 'express';
import { FingerprintData } from '@types';
import { Logger } from '@utils';

/**
 * Middleware that extracts and logs fingerprint data from request body.
 * Attaches fingerprint to request object for use by other middleware and controllers.
 *
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object (unused)
 * @param {NextFunction} next - Express next function
 *
 * @return {void}
 *
 * @example
 *     app.use(fingerprintMiddleware);
 */
export function fingerprintMiddleware(req: Request, _res: Response, next: NextFunction): void {
	const fingerprint = req.body?.fingerprint as FingerprintData | undefined;

	if (fingerprint) {
		// Attach fingerprint to request for other middleware/controllers
		req.fingerprint = fingerprint;
		req.fingerprintId = fingerprint.fingerprint;

		// Log comprehensive fingerprint data
		Logger.info('User fingerprint data received', {
			fingerprint: fingerprint.fingerprint,
			browser: fingerprint.browser,
			browserVersion: fingerprint.browserVersion,
			os: fingerprint.os,
			osVersion: fingerprint.osVersion,
			device: fingerprint.device,
			deviceType: fingerprint.deviceType,
			deviceVendor: fingerprint.deviceVendor,
			cpu: fingerprint.cpu,
			screenResolution: fingerprint.screenResolution,
			colorDepth: fingerprint.colorDepth,
			timezone: fingerprint.timezone,
			language: fingerprint.language,
			userAgent: fingerprint.userAgent
		});
	}

	next();
}
