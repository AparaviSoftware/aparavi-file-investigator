import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/testUtils';
import LoadingDots from './index';

describe('LoadingDots', () => {
	describe('when rendered', () => {
		it('should display three animated dots', () => {
			renderWithProviders(<LoadingDots />);

			const dots = screen.getAllByRole('generic').filter(
				el => el.className.includes('animate-bounce') && el.className.includes('rounded-full')
			);

			expect(dots).toHaveLength(3);
		});

		it('should have staggered animation delays', () => {
			const { container } = renderWithProviders(<LoadingDots />);

			const dots = container.querySelectorAll('.animate-bounce.rounded-full');

			expect(dots[0]).toHaveStyle({ animationDelay: '0ms' });
			expect(dots[1]).toHaveStyle({ animationDelay: '150ms' });
			expect(dots[2]).toHaveStyle({ animationDelay: '300ms' });
		});

		it('should render with correct styling classes', () => {
			const { container } = renderWithProviders(<LoadingDots />);

			const dotsContainer = container.querySelector('.flex.items-center.gap-1');
			expect(dotsContainer).toBeInTheDocument();

			const dots = container.querySelectorAll('.w-2.h-2.bg-gray-400.rounded-full.animate-bounce');
			expect(dots).toHaveLength(3);
		});
	});
});
