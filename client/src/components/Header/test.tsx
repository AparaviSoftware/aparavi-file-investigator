import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/testUtils';
import Header from './index';

describe('Header', () => {
	describe('when rendered', () => {
		it('should display the app name', () => {
			renderWithProviders(<Header />);

			expect(screen.getByText('FILE INVESTIGATOR')).toBeInTheDocument();
		});

		it('should have a link to home page', () => {
			renderWithProviders(<Header />);

			const homeLink = screen.getByText('FILE INVESTIGATOR').closest('a');
			expect(homeLink).toHaveAttribute('href', '/');
		});

		it('should display Aparavi logo', () => {
			renderWithProviders(<Header />);

			const logo = screen.getByAltText('Aparavi');
			expect(logo).toBeInTheDocument();
			expect(logo).toHaveAttribute('src');
		});

		it('should have a link to Aparavi website', () => {
			renderWithProviders(<Header />);

			const aparaviLink = screen.getByAltText('Aparavi').closest('a');
			expect(aparaviLink).toHaveAttribute('href', 'https://aparavi.com');
			expect(aparaviLink).toHaveAttribute('target', '_blank');
			expect(aparaviLink).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('should display create chatbot button', () => {
			renderWithProviders(<Header />);

			const createButton = screen.getByText('Create your own chatbot');
			expect(createButton).toBeInTheDocument();
		});

		it('should have a link to create chatbot page', () => {
			renderWithProviders(<Header />);

			const createButton = screen.getByText('Create your own chatbot');
			const createLink = createButton.closest('a');
			expect(createLink).toHaveAttribute('href', 'https://dtc.aparavi.com/projects/new?templateId=74ef36f1-19c3-4a22-9fa0-b79d9aa42834');
			expect(createLink).toHaveAttribute('target', '_blank');
			expect(createLink).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	describe('when rendered on mobile', () => {
		it('should display short version of create button text', () => {
			renderWithProviders(<Header />);

			expect(screen.getByText('Create')).toBeInTheDocument();
		});
	});

	describe('styling', () => {
		it('should have proper header styling', () => {
			const { container } = renderWithProviders(<Header />);

			const header = container.querySelector('header');
			expect(header).toHaveClass('bg-gray-50', 'text-gray-800');
		});

		it('should have create button with orange background', () => {
			const { container } = renderWithProviders(<Header />);

			const createButton = screen.getByText('Create your own chatbot').closest('a');
			expect(createButton).toHaveClass('bg-orange-400');
		});
	});
});
