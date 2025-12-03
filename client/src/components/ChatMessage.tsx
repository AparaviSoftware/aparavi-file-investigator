interface ChatMessageProps {
	message: string;
	isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 ${
					isUser
						? 'bg-orange-400 text-white'
						: 'bg-white border border-gray-200 text-gray-800'
				}`}
			>
				<p className="text-sm leading-relaxed break-words">{message}</p>
			</div>
		</div>
	);
}
