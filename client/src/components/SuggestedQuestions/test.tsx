import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import SuggestedQuestions from './index';

describe('SuggestedQuestions', () => {
	const mockQuestions = [
		'Question 1 about topic A?',
		'Question 2 about topic B?',
		'Question 3 about topic C?'
	];
	let mockOnQuestionClick: (question: string) => void;

	beforeEach(() => {
		mockOnQuestionClick = vi.fn();
	});

	describe('when rendered', () => {
		it('should display all questions', () => {
			renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			mockQuestions.forEach(question => {
				expect(screen.getByText(question)).toBeInTheDocument();
			});
		});

		it('should render questions as buttons', () => {
			renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			const buttons = screen.getAllByRole('button');
			expect(buttons).toHaveLength(mockQuestions.length);
		});

		it('should render questions in bold', () => {
			renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			mockQuestions.forEach(question => {
				const boldElement = screen.getByText(question);
				expect(boldElement.tagName).toBe('B');
			});
		});
	});

	describe('when question button is clicked', () => {
		it('should call onQuestionClick with the correct question', async () => {
			const user = userEvent.setup();
			renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			const firstButton = screen.getByText(mockQuestions[0]).closest('button');
			await user.click(firstButton!);

			expect(mockOnQuestionClick).toHaveBeenCalledWith(mockQuestions[0]);
		});

		it('should call onQuestionClick exactly once per click', async () => {
			const user = userEvent.setup();
			renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			const secondButton = screen.getByText(mockQuestions[1]).closest('button');
			await user.click(secondButton!);

			expect(mockOnQuestionClick).toHaveBeenCalledTimes(1);
		});

		it('should handle clicks on different questions', async () => {
			const user = userEvent.setup();
			renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			const firstButton = screen.getByText(mockQuestions[0]).closest('button');
			const thirdButton = screen.getByText(mockQuestions[2]).closest('button');

			await user.click(firstButton!);
			await user.click(thirdButton!);

			expect(mockOnQuestionClick).toHaveBeenCalledWith(mockQuestions[0]);
			expect(mockOnQuestionClick).toHaveBeenCalledWith(mockQuestions[2]);
			expect(mockOnQuestionClick).toHaveBeenCalledTimes(2);
		});
	});

	describe('when questions array is empty', () => {
		it('should render without errors', () => {
			const { container } = renderWithProviders(
				<SuggestedQuestions
					questions={[]}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			expect(container.querySelector('.grid')).toBeInTheDocument();
			expect(screen.queryAllByRole('button')).toHaveLength(0);
		});
	});

	describe('when questions array has one item', () => {
		it('should render a single button', () => {
			const singleQuestion = ['Single question?'];
			renderWithProviders(
				<SuggestedQuestions
					questions={singleQuestion}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			expect(screen.getAllByRole('button')).toHaveLength(1);
			expect(screen.getByText(singleQuestion[0])).toBeInTheDocument();
		});
	});

	describe('styling', () => {
		it('should have proper grid layout', () => {
			const { container } = renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			const grid = container.querySelector('.grid');
			expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
		});

		it('should have proper button styling', () => {
			renderWithProviders(
				<SuggestedQuestions
					questions={mockQuestions}
					onQuestionClick={mockOnQuestionClick}
				/>
			);

			const buttons = screen.getAllByRole('button');
			buttons.forEach(button => {
				expect(button).toHaveClass('bg-white', 'border', 'border-gray-200', 'rounded-lg');
			});
		});
	});
});
