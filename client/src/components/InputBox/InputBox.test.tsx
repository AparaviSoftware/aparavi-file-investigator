import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/testUtils';
import InputBox from './index';

describe('InputBox', () => {
	let mockOnQueryChange: ReturnType<typeof vi.fn>;
	let mockOnSubmit: ReturnType<typeof vi.fn>;
	let mockOnClear: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockOnQueryChange = vi.fn();
		mockOnSubmit = vi.fn();
		mockOnClear = vi.fn();
	});

	describe('when rendered', () => {
		it('should display the input field', () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});

		it('should display queries counter', () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={5}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			expect(screen.getByText('5/10')).toBeInTheDocument();
		});

		it('should display send button', () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const sendButton = screen.getByRole('button', { name: '' });
			expect(sendButton).toBeInTheDocument();
		});

		it('should not display clear button when query is empty', () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const buttons = screen.getAllByRole('button');
			expect(buttons).toHaveLength(1);
		});

		it('should display clear button when query has value', () => {
			renderWithProviders(
				<InputBox
					query="test query"
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const buttons = screen.getAllByRole('button');
			expect(buttons).toHaveLength(2);
		});
	});

	describe('when user types in input', () => {
		it('should call onQueryChange with input value', async () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: 'test query' } });

			expect(mockOnQueryChange).toHaveBeenCalled();
		});

		it('should display the query value', () => {
			const query = 'test query';
			renderWithProviders(
				<InputBox
					query={query}
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const input = screen.getByRole('textbox') as HTMLInputElement;
			expect(input.value).toBe(query);
		});
	});

	describe('when send button is clicked', () => {
		it('should call onSubmit with query value', async () => {
			const query = 'test query';
			renderWithProviders(
				<InputBox
					query={query}
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const sendButton = screen.getAllByRole('button')[1];
			fireEvent.click(sendButton);

			expect(mockOnSubmit).toHaveBeenCalledWith(query);
		});

		it('should not submit when query is empty', async () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const sendButton = screen.getByRole('button');
			expect(sendButton).toBeDisabled();
		});

		it('should not submit when query is only whitespace', () => {
			renderWithProviders(
				<InputBox
					query="   "
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const sendButton = screen.getAllByRole('button')[1];
			expect(sendButton).toBeDisabled();
		});

		it('should not submit when queries left is zero', () => {
			renderWithProviders(
				<InputBox
					query="test query"
					queriesLeft={0}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const sendButton = screen.getAllByRole('button')[1];
			expect(sendButton).toBeDisabled();
		});
	});

	describe('when Enter key is pressed', () => {
		it('should call onSubmit with query value', async () => {
			const query = 'test query';
			renderWithProviders(
				<InputBox
					query={query}
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const textarea = screen.getByRole('textbox');

			fireEvent.keyDown(textarea, {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				shiftKey: false
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(query);
		});

		it('should not submit when Shift+Enter is pressed', async () => {
			const query = 'test query';
			renderWithProviders(
				<InputBox
					query={query}
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const textarea = screen.getByRole('textbox');

			fireEvent.keyDown(textarea, {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				shiftKey: true
			});

			expect(mockOnSubmit).not.toHaveBeenCalled();
		});
	});

	describe('when clear button is clicked', () => {
		it('should call onClear', async () => {
			renderWithProviders(
				<InputBox
					query="test query"
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
				/>
			);

			const buttons = screen.getAllByRole('button');
			const clearButton = buttons[0];
			fireEvent.click(clearButton);

			expect(mockOnClear).toHaveBeenCalledTimes(1);
		});
	});

	describe('when disabled', () => {
		it('should disable the input field', () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
					disabled={true}
				/>
			);

			const input = screen.getByRole('textbox');
			expect(input).toBeDisabled();
		});

		it('should apply opacity styling', () => {
			const { container } = renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
					disabled={true}
				/>
			);

			const wrapper = container.querySelector('.opacity-50');
			expect(wrapper).toBeInTheDocument();
		});
	});

	describe('when chat is started', () => {
		it('should focus input field', () => {
			renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
					isChatStarted={true}
				/>
			);

			const input = screen.getByRole('textbox');
			expect(input).toHaveFocus();
		});
	});

	describe('when loading completes', () => {
		it('should focus input field when chat is started', () => {
			const { rerender } = renderWithProviders(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
					isChatStarted={true}
					isLoading={true}
				/>
			);

			rerender(
				<InputBox
					query=""
					queriesLeft={10}
					maxQueries={10}
					onQueryChange={mockOnQueryChange}
					onSubmit={mockOnSubmit}
					onClear={mockOnClear}
					isChatStarted={true}
					isLoading={false}
				/>
			);

			const input = screen.getByRole('textbox');
			expect(input).toHaveFocus();
		});
	});
});
