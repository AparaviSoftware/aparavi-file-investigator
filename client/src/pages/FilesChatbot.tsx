import { useState } from 'react';
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

	const suggestedQuestions = [
		"Was the CIA really responsible for Epstein's assassination?",
		"What is the relationship between Donald Trump and Epstein?",
		"Where the policeman really asleep during Epstein's suicide?"
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
		<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
			<Header />

			{/* Main Content */}
			<main className="flex-1 flex flex-col overflow-hidden relative">
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
						isChatStarted ? 'justify-start pt-0' : 'items-center justify-center pb-20'
					}`}
				>
					<div className={`max-w-4xl w-full mx-auto flex flex-col px-6 ${isChatStarted ? 'h-full' : ''}`}>
						{/* Title Section - fades out slower when chat starts */}
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

						{/* Suggested Questions - fades out slower when chat starts */}
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

						{/* Chat Messages Area - fades in slower when chat starts */}
						{isChatStarted && (
							<div className="flex-1 overflow-y-auto py-6 space-y-4 animate-fade-in">
								{messages.map((message, index) => (
									<ChatMessage
										key={index}
										message={message.text}
										isUser={message.isUser}
									/>
								))}
								{isLoading && <LoadingDots />}
							</div>
						)}

						{/* Input Box */}
						<div className={`${isChatStarted ? 'pb-6' : ''}`}>
							<InputBox
								query={query}
								queriesLeft={queriesLeft}
								maxQueries={10}
								onQueryChange={setQuery}
								onSubmit={handleSubmit}
								onClear={handleClear}
							/>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="text-center py-6 text-sm text-gray-500">
				AI can make mistake. Just like every weirdo who visited the island.
			</footer>
		</div>
	);
}
