import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { t } from '../../translations/en';

interface InputBoxProps {
	query: string;
	queriesLeft: number;
	maxQueries: number;
	onQueryChange: (query: string) => void;
	onSubmit: (query: string) => void;
	onClear: () => void;
	isChatStarted?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
}

export default function InputBox({ query, queriesLeft, maxQueries, onQueryChange, onSubmit, onClear, isChatStarted, disabled, isLoading }: InputBoxProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [hasOverflow, setHasOverflow] = useState(false);

	useEffect(() => {
		// Focus the textarea when chat starts
		if (isChatStarted) {
			textareaRef.current?.focus();
		}
	}, [isChatStarted]);

	useEffect(() => {
		// Focus the textarea when loading completes
		if (!isLoading && isChatStarted) {
			textareaRef.current?.focus();
		}
	}, [isLoading, isChatStarted]);

	useEffect(() => {
		// Auto-resize textarea based on content
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			const newHeight = textareaRef.current.scrollHeight;
			textareaRef.current.style.height = `${newHeight}px`;

			// One-way switch: trigger vertical layout at 40px, only reset when input is cleared
			if (!hasOverflow && newHeight >= 40) {
				setHasOverflow(true);
			}
		}

		// Reset to horizontal layout only when input is completely empty
		if (hasOverflow && query === '') {
			setHasOverflow(false);
		}
	}, [query, hasOverflow]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSubmit(query);
		}
	};

	return (
		<div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${disabled ? 'opacity-50' : ''}`}>
			<div className={`flex p-3 sm:p-4 gap-2 sm:gap-3 ${hasOverflow ? 'flex-col' : 'items-start'}`}>
				<textarea
					ref={textareaRef}
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={disabled ? t.input.placeholderDisabled : t.input.placeholder}
					className={`input-scrollbar outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400 resize-none overflow-y-auto min-h-[24px] max-h-[200px] ${hasOverflow ? 'w-full' : 'flex-1'}`}
					disabled={disabled}
					rows={1}
				/>
				<div className={`flex items-center gap-2 sm:gap-3 ${hasOverflow ? 'justify-end' : ''}`}>
					{query && (
						<button
							onClick={onClear}
							className="text-gray-400 hover:text-gray-600 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<X className="w-4 h-4 sm:w-5 sm:h-5" />
						</button>
					)}
					<span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
						{queriesLeft}/{maxQueries}
					</span>
					<button
						onClick={() => onSubmit(query)}
						disabled={!query.trim() || queriesLeft === 0}
						className="bg-orange-100 text-orange-500 p-1.5 sm:p-2 rounded-lg hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<Send className="w-4 h-4 sm:w-5 sm:h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}
