import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { vi } from 'vitest';

/**
 * Custom render function that wraps components with common providers
 *
 * @param {ReactElement} ui - Component to render
 * @param {RenderOptions} options - Additional render options
 *
 * @return {object} Render result from React Testing Library
 *
 * @example
 *     const { getByText } = renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
	return render(ui, { ...options });
}

/**
 * Creates a mock function that can be used in tests
 *
 * @return {Function} Mock function
 *
 * @example
 *     const mockFn = createMockFn();
 */
export function createMockFn() {
	return vi.fn();
}

/**
 * Waits for a specified amount of time
 *
 * @param {number} ms - Milliseconds to wait
 *
 * @return {Promise<void>} Promise that resolves after the specified time
 *
 * @example
 *     await wait(1000);
 */
export function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}
