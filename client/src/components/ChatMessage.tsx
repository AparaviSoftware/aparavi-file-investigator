import { Copy, RefreshCw, Edit2, Check, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface ChatMessageProps {
	message: string;
	isUser: boolean;
	onRegenerate?: () => void;
	onEdit?: (newMessage: string) => void;
}

export default function ChatMessage({ message, isUser, onRegenerate, onEdit }: ChatMessageProps) {
	const [copied, setCopied] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedMessage, setEditedMessage] = useState(message);
	const [bubbleWidth, setBubbleWidth] = useState<number | null>(null);
	const bubbleRef = useRef<HTMLDivElement>(null);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(message);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleEditClick = () => {
		if (bubbleRef.current) {
			const width = bubbleRef.current.getBoundingClientRect().width;
			setBubbleWidth(width);
		}
		setIsEditing(true);
		setEditedMessage(message);
	};

	const handleEditSubmit = () => {
		if (editedMessage.trim() && editedMessage !== message) {
			onEdit?.(editedMessage.trim());
		}
		setIsEditing(false);
		setBubbleWidth(null);
	};

	const handleEditCancel = () => {
		setIsEditing(false);
		setEditedMessage(message);
		setBubbleWidth(null);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleEditSubmit();
		} else if (e.key === 'Escape') {
			handleEditCancel();
		}
	};

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] md:max-w-[70%]`}>
				<div
					ref={bubbleRef}
					style={isEditing && bubbleWidth ? { width: `${bubbleWidth}px`, minWidth: `${bubbleWidth}px` } : undefined}
					className={`rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 ${
						isUser
							? 'bg-gray-200 text-gray-800'
							: 'text-gray-800'
					}`}
				>
					{isEditing ? (
						<>
							<input
								type="text"
								value={editedMessage}
								onChange={(e) => setEditedMessage(e.target.value)}
								onKeyDown={handleKeyPress}
								className="w-full bg-transparent outline-none text-sm border-b border-gray-400 focus:border-gray-600"
								autoFocus
							/>
						</>
					) : (
						<>
							<p className="text-sm leading-relaxed break-words">{message}</p>
							{!isUser && (
								<div className="flex justify-start gap-2 mt-2">
									<button
										onClick={handleCopy}
										className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
										title="Copy to clipboard"
									>
										<Copy className="w-4 h-4" />
									</button>
									{copied && <span className="text-xs text-gray-500">Copied!</span>}
									{onRegenerate && (
										<button
											onClick={onRegenerate}
											className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
											title="Regenerate response"
										>
											<RefreshCw className="w-4 h-4" />
										</button>
									)}
								</div>
							)}
						</>
					)}
				</div>
				{isUser && onEdit && (
					<div className="flex gap-2 mt-1">
						{isEditing ? (
							<>
								<button
									onClick={handleEditCancel}
									className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
									title="Cancel edit"
								>
									<X className="w-4 h-4" />
								</button>
								<button
									onClick={handleEditSubmit}
									className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
									title="Submit edit"
								>
									<Check className="w-4 h-4" />
								</button>
							</>
						) : (
							<button
								onClick={handleEditClick}
								className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
								title="Edit message"
							>
								<Edit2 className="w-4 h-4" />
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
