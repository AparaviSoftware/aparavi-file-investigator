// Extend Express types
declare namespace Express {
	export interface Request {
		startTime?: number;
		fingerprint?: import('./index').FingerprintData;
		fingerprintId?: string;
	}
}