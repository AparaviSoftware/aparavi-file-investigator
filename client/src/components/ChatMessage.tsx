interface ChatMessageProps {
	message: string;
	isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
			<div
				className={`max-w-[70%] rounded-lg px-4 py-3 ${
					isUser
						? 'bg-orange-400 text-white'
						: 'bg-white border border-gray-200 text-gray-800'
				}`}
			>
				<p className="text-sm leading-relaxed">{message}</p>
			</div>
		</div>
	);
}
