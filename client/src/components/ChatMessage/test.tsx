import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/testUtils';
import ChatMessage from './index';

describe('ChatMessage', () => {
	const mockMessage = 'Hello, this is a test message';
	let mockOnRegenerate: ReturnType<typeof vi.fn>;
	let mockOnEdit: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockOnRegenerate = vi.fn();
		mockOnEdit = vi.fn();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('when rendered as user message', () => {
		it('should display the message text', () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} />);

			expect(screen.getByText(mockMessage)).toBeInTheDocument();
		});

		it('should align message to the right', () => {
			const { container } = renderWithProviders(<ChatMessage message={mockMessage} isUser={true} />);

			const messageContainer = container.querySelector('.justify-end');
			expect(messageContainer).toBeInTheDocument();
		});

		it('should have user message styling', () => {
			const { container } = renderWithProviders(<ChatMessage message={mockMessage} isUser={true} />);

			const messageBubble = container.querySelector('.bg-gray-200.text-gray-800');
			expect(messageBubble).toBeInTheDocument();
		});

		it('should not display copy and regenerate buttons', () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} />);

			expect(screen.queryByTitle('Copy to clipboard')).not.toBeInTheDocument();
			expect(screen.queryByTitle('Regenerate response')).not.toBeInTheDocument();
		});

		it('should display edit button when onEdit callback is provided', () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			expect(screen.getByTitle('Edit message')).toBeInTheDocument();
		});
	});

	describe('when rendered as assistant message', () => {
		it('should display the message text', () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} />);

			expect(screen.getByText(mockMessage)).toBeInTheDocument();
		});

		it('should align message to the left', () => {
			const { container } = renderWithProviders(<ChatMessage message={mockMessage} isUser={false} />);

			const messageContainer = container.querySelector('.justify-start');
			expect(messageContainer).toBeInTheDocument();
		});

		it('should display copy button', () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} />);

			expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
		});

		it('should display regenerate button when onRegenerate callback is provided', () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} onRegenerate={mockOnRegenerate} />);

			expect(screen.getByTitle('Regenerate response')).toBeInTheDocument();
		});

		it('should not display edit button', () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} onEdit={mockOnEdit} />);

			expect(screen.queryByTitle('Edit message')).not.toBeInTheDocument();
		});
	});

	describe('when copy button is clicked', () => {
		it('should copy message to clipboard', async () => {
			vi.useRealTimers();
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} />);

			const copyButton = screen.getByTitle('Copy to clipboard');
			fireEvent.click(copyButton);

			await waitFor(() => {
				expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockMessage);
			});
			vi.useFakeTimers();
		});

		it('should display "Copied!" text after copying', async () => {
			vi.useRealTimers();
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} />);

			const copyButton = screen.getByTitle('Copy to clipboard');
			fireEvent.click(copyButton);

			await waitFor(() => {
				expect(screen.getByText('Copied!')).toBeInTheDocument();
			});
			vi.useFakeTimers();
		});

		it('should hide "Copied!" text after 2 seconds', async () => {
			vi.useRealTimers();
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} />);

			const copyButton = screen.getByTitle('Copy to clipboard');
			fireEvent.click(copyButton);

			await waitFor(() => {
				expect(screen.getByText('Copied!')).toBeInTheDocument();
			});

			await waitFor(() => {
				expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
			}, { timeout: 3000 });
		});
	});

	describe('when regenerate button is clicked', () => {
		it('should call onRegenerate callback', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={false} onRegenerate={mockOnRegenerate} />);

			const regenerateButton = screen.getByTitle('Regenerate response');
			fireEvent.click(regenerateButton);

			expect(mockOnRegenerate).toHaveBeenCalledTimes(1);
		});
	});

	describe('when edit button is clicked', () => {
		it('should enter edit mode', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});

		it('should populate input with current message', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			const input = screen.getByRole('textbox') as HTMLInputElement;
			expect(input.value).toBe(mockMessage);
		});

		it('should display submit and cancel buttons in edit mode', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			expect(screen.getByTitle('Submit edit')).toBeInTheDocument();
			expect(screen.getByTitle('Cancel edit')).toBeInTheDocument();
		});
	});

	describe('when editing message', () => {
		it('should call onEdit with new message when submitted', async () => {
			const newMessage = 'Updated message';
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: newMessage } });

			const submitButton = screen.getByTitle('Submit edit');
			fireEvent.click(submitButton);

			expect(mockOnEdit).toHaveBeenCalledWith(newMessage);
		});

		it('should not call onEdit when message is unchanged', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			const submitButton = screen.getByTitle('Submit edit');
			fireEvent.click(submitButton);

			expect(mockOnEdit).not.toHaveBeenCalled();
		});

		it('should not call onEdit when message is empty', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: '' } });

			const submitButton = screen.getByTitle('Submit edit');
			fireEvent.click(submitButton);

			expect(mockOnEdit).not.toHaveBeenCalled();
		});

		it('should exit edit mode when cancelled', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			const cancelButton = screen.getByTitle('Cancel edit');
			fireEvent.click(cancelButton);

			expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
			expect(screen.getByText(mockMessage)).toBeInTheDocument();
		});

		it('should submit edit when Enter key is pressed', async () => {
			const newMessage = 'Updated message';
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: newMessage } });
			fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

			expect(mockOnEdit).toHaveBeenCalledWith(newMessage);
		});

		it('should cancel edit when Escape key is pressed', async () => {
			renderWithProviders(<ChatMessage message={mockMessage} isUser={true} onEdit={mockOnEdit} />);

			const editButton = screen.getByTitle('Edit message');
			fireEvent.click(editButton);

			const input = screen.getByRole('textbox');
			fireEvent.change(input, { target: { value: mockMessage + ' extra text' } });
			fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

			expect(mockOnEdit).not.toHaveBeenCalled();
			expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
			expect(screen.getByText(mockMessage)).toBeInTheDocument();
		});
	});
});
