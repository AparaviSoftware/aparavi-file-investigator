import { useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';

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
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Focus the input when chat starts
		if (isChatStarted) {
			inputRef.current?.focus();
		}
	}, [isChatStarted]);

	useEffect(() => {
		// Focus the input when loading completes
		if (!isLoading && isChatStarted) {
			inputRef.current?.focus();
		}
	}, [isLoading, isChatStarted]);

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onSubmit(query);
		}
	};

	return (
		<div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${disabled ? 'opacity-50' : ''}`}>
			<div className="flex items-center p-3 sm:p-4">
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder={disabled ? "Query limit reached" : "Ask anything..."}
					className="flex-1 outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400"
					disabled={disabled}
				/>
				<div className="flex items-center gap-2 sm:gap-3">
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
