export interface FingerprintData {
	fingerprint: string;
	browser: string;
	browserVersion: string;
	os: string;
	osVersion: string;
	device: string;
	deviceType: string;
	deviceVendor: string;
	cpu: string;
	screenResolution: string;
	colorDepth: number;
	timezone: string;
	language: string;
	userAgent: string;
}

/**
 * Extracts browser name and version from user agent.
 *
 * @param {string} userAgent - The browser user agent string
 *
 * @return {object} Object containing browser name and version
 *
 * @example
 *     const { browser, version } = parseBrowserInfo(navigator.userAgent);
 */
function parseBrowserInfo(userAgent: string): { browser: string; version: string } {
	let browser = 'Unknown';
	let version = 'Unknown';

	if (userAgent.includes('Chrome')) {
		browser = 'Chrome';
		const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
		if (match) version = match[1];
	} else if (userAgent.includes('Firefox')) {
		browser = 'Firefox';
		const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
		if (match) version = match[1];
	} else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
		browser = 'Safari';
		const match = userAgent.match(/Version\/(\d+\.\d+)/);
		if (match) version = match[1];
	} else if (userAgent.includes('Edge')) {
		browser = 'Edge';
		const match = userAgent.match(/Edge\/(\d+\.\d+)/);
		if (match) version = match[1];
	} else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
		browser = 'Internet Explorer';
		const match = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/);
		if (match) version = match[1];
	}

	return { browser, version };
}

/**
 * Extracts OS name and version from user agent.
 *
 * @param {string} userAgent - The browser user agent string
 *
 * @return {object} Object containing OS name and version
 *
 * @example
 *     const { os, version } = parseOSInfo(navigator.userAgent);
 */
function parseOSInfo(userAgent: string): { os: string; version: string } {
	let os = 'Unknown';
	let version = 'Unknown';

	if (userAgent.includes('Windows NT')) {
		os = 'Windows';
		const match = userAgent.match(/Windows NT (\d+\.\d+)/);
		if (match) {
			const ntVersion = match[1];
			const versionMap: Record<string, string> = {
				'10.0': '10',
				'6.3': '8.1',
				'6.2': '8',
				'6.1': '7',
				'6.0': 'Vista',
				'5.1': 'XP'
			};
			version = versionMap[ntVersion] || ntVersion;
		}
	} else if (userAgent.includes('Mac OS X')) {
		os = 'macOS';
		const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
		if (match) version = match[1].replace(/_/g, '.');
	} else if (userAgent.includes('Linux')) {
		os = 'Linux';
	} else if (userAgent.includes('Android')) {
		os = 'Android';
		const match = userAgent.match(/Android (\d+\.\d+)/);
		if (match) version = match[1];
	} else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
		os = 'iOS';
		const match = userAgent.match(/OS (\d+[._]\d+)/);
		if (match) version = match[1].replace(/_/g, '.');
	}

	return { os, version };
}

/**
 * Generates a unique fingerprint for the current user based on device characteristics.
 *
 * @return {FingerprintData} Object containing fingerprint and device information
 *
 * @example
 *     const fingerprintData = generateFingerprint();
 */
export function generateFingerprint(): FingerprintData {
	const nav = window.navigator;
	const screen = window.screen;

	// Collect various browser and device characteristics
	const components = [
		nav.userAgent,
		nav.language,
		screen.colorDepth,
		screen.width,
		screen.height,
		new Date().getTimezoneOffset(),
		!!window.sessionStorage,
		!!window.localStorage,
		!!window.indexedDB,
		typeof((document.body as any).addBehavior),
		typeof((window as any).openDatabase),
		(nav as any).cpuClass,
		nav.platform,
		nav.hardwareConcurrency
	];

	// Generate hash from components
	const componentString = components.join('###');
	let hash = 0;
	for (let i = 0; i < componentString.length; i++) {
		const char = componentString.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}

	const fingerprint = Math.abs(hash).toString(16);

	// Parse browser and OS info
	const browserInfo = parseBrowserInfo(nav.userAgent);
	const osInfo = parseOSInfo(nav.userAgent);

	// Determine device type
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(nav.userAgent);
	const isTablet = /iPad|Android/i.test(nav.userAgent) && !/Mobile/i.test(nav.userAgent);

	return {
		fingerprint,
		browser: browserInfo.browser,
		browserVersion: browserInfo.version,
		os: osInfo.os,
		osVersion: osInfo.version,
		device: isMobile ? (isTablet ? 'Tablet' : 'Mobile') : 'Desktop',
		deviceType: isMobile ? 'Mobile' : 'Desktop',
		deviceVendor: 'Unknown',
		cpu: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} cores` : 'Unknown',
		screenResolution: `${screen.width}x${screen.height}`,
		colorDepth: screen.colorDepth,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		language: nav.language,
		userAgent: nav.userAgent
	};
}

/**
 * Retrieves or generates a fingerprint, caching it in memory for the session.
 *
 * @return {FingerprintData} Cached or newly generated fingerprint data
 *
 * @example
 *     const fingerprintData = getFingerprint();
 */
let cachedFingerprint: FingerprintData | null = null;

export function getFingerprint(): FingerprintData {
	if (!cachedFingerprint) {
		cachedFingerprint = generateFingerprint();
	}
	return cachedFingerprint;
}
