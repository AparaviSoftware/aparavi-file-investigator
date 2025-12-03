import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import TitleSection from '../components/TitleSection';
import SuggestedQuestions from '../components/SuggestedQuestions';
import InputBox from '../components/InputBox';
import ChatMessage from '../components/ChatMessage';
import LoadingDots from '../components/LoadingDots';

interface Message {
	text: string;
	isUser: boolean;
}

export default function FilesChatbot() {
	const [query, setQuery] = useState('');
	const [queriesLeft, setQueriesLeft] = useState(10);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isChatStarted, setIsChatStarted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const suggestedQuestions = [
		"Was the CIA really responsible for Epstein's assassination?",
		"What is the relationship between Donald Trump and Epstein?",
		"Were the guards really asleep during Epstein's suicide?"
	];

	const handleSubmit = (question: string) => {
		if (queriesLeft > 0 && question.trim()) {
			// Start chat mode
			setIsChatStarted(true);

			// Add user message
			const userMessage: Message = {
				text: question,
				isUser: true
			};
			setMessages(prev => [...prev, userMessage]);

			setQueriesLeft(prev => prev - 1);
			setQuery('');
			setIsLoading(true);

			// Simulate AI response after a short delay
			setTimeout(() => {
				const aiMessage: Message = {
					text: "This is a placeholder response. The LLM will be connected later to provide actual answers based on the Epstein Files.",
					isUser: false
				};
				setMessages(prev => [...prev, aiMessage]);
				setIsLoading(false);
			}, 1000);
		}
	};

	const handleClear = () => {
		setQuery('');
	};

	return (
		<>
			<style>{`
				.chat-scrollbar::-webkit-scrollbar {
					width: 12px;
				}
				.chat-scrollbar::-webkit-scrollbar-track {
					background: #f1f1f1;
				}
				.chat-scrollbar::-webkit-scrollbar-thumb {
					background: #888;
					border-radius: 6px;
				}
				.chat-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #555;
				}
				.chat-scrollbar::-webkit-scrollbar-button {
					display: none;
					height: 0;
					width: 0;
				}
				.chat-scrollbar {
					scrollbar-width: thin;
					scrollbar-color: #888 #f1f1f1;
				}
			`}</style>
			<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
				<Header />

			{/* Main Content */}
			<main className="flex-1 flex flex-col overflow-hidden relative min-h-0">
				{/* Hero Banner - gets pushed up and out when chat starts */}
				<div
					className={`transition-all duration-700 w-full ${
						isChatStarted ? '-translate-y-full opacity-0 absolute' : 'translate-y-0 opacity-100'
					}`}
				>
					<HeroBanner />
				</div>

				{/* Content wrapper */}
				<div
					className={`flex-1 flex flex-col transition-all duration-700 ${
						isChatStarted ? 'justify-start overflow-hidden min-h-0' : 'items-center justify-center pb-20'
					}`}
				>
					{!isChatStarted && (
						<div className="max-w-4xl w-full mx-auto flex flex-col px-6">
							{/* Title Section - fades out when chat starts */}
							<div
								className={`transition-all duration-1000 ${
									isChatStarted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
								}`}
							>
								<TitleSection
									title="Chat with the Epstein Files"
									subtitle="Ask grounded questions against 100 thousand pages of the Epstein Files."
								/>
							</div>

							{/* Suggested Questions - fades out when chat starts */}
							<div
								className={`transition-all duration-1000 ${
									isChatStarted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
								}`}
							>
								<SuggestedQuestions
									questions={suggestedQuestions}
									onQuestionClick={setQuery}
								/>
							</div>

							{/* Input Box */}
							<div>
								<InputBox
									query={query}
									queriesLeft={queriesLeft}
									maxQueries={10}
									onQueryChange={setQuery}
									onSubmit={handleSubmit}
									onClear={handleClear}
									isChatStarted={isChatStarted}
									disabled={queriesLeft === 0}
								/>
							</div>
						</div>
					)}

					{isChatStarted && (
						<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
							{/* Chat Messages Area - scrollable container spans full width */}
							<div className="chat-scrollbar flex-1 overflow-y-scroll animate-fade-in min-h-0 py-6" style={{ scrollbarGutter: 'stable' }}>
								<div className="max-w-4xl w-full mx-auto px-6 space-y-4">
									{messages.map((message, index) => (
										<ChatMessage
											key={index}
											message={message.text}
											isUser={message.isUser}
										/>
									))}
									{isLoading && <LoadingDots />}
									<div ref={messagesEndRef} />
								</div>
							</div>

							{/* Input Box - stays at bottom */}
							<div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
								<div className="max-w-4xl w-full mx-auto px-6 py-4">
									<InputBox
										query={query}
										queriesLeft={queriesLeft}
										maxQueries={10}
										onQueryChange={setQuery}
										onSubmit={handleSubmit}
										onClear={handleClear}
										isChatStarted={isChatStarted}
										disabled={queriesLeft === 0}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</main>

			{/* Footer */}
			<footer className="flex-shrink-0 text-center py-6 text-sm text-gray-500">
				AI can make mistake. Just like every weirdo who visited the island.
			</footer>
			</div>
		</>
	);
}
