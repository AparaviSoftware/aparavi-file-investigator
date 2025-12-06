import { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import TitleSection from '../components/TitleSection';
import SuggestedQuestions from '../components/SuggestedQuestions';
import InputBox from '../components/InputBox';
import ChatMessage from '../components/ChatMessage';
import LoadingDots from '../components/LoadingDots';
import { t } from '../translations/en';
import './FilesChatbot.css';

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
	const [chatInputTransform, setChatInputTransform] = useState(0);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const mainInputRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	useEffect(() => {
		if (isChatStarted && chatInputTransform !== 0) {
			// Start animation immediately
			requestAnimationFrame(() => {
				setChatInputTransform(0);
			});
		}
	}, [isChatStarted, chatInputTransform]);

	const showOutOfQueriesToast = () => {
		toast.error(t.errors.outOfQueries);
	};

	const handleSubmit = (question: string) => {
		if (!question.trim()) return;

		if (queriesLeft === 0) {
			showOutOfQueriesToast();
			return;
		}

		if (queriesLeft > 0) {
			// Measure main input position before chat starts
			if (mainInputRef.current) {
				const rect = mainInputRef.current.getBoundingClientRect();
				// Calculate distance from main input bottom to viewport bottom
				// This positions the chat input to start at the main input's location
				const distanceFromBottom = window.innerHeight - rect.bottom - 80;
				setChatInputTransform(distanceFromBottom);
			}

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
					text: t.messages.placeholderResponse,
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

	const handleRegenerate = (index: number) => {
		if (queriesLeft === 0) {
			showOutOfQueriesToast();
			return;
		}

		// Find the user message that prompted this response
		const userMessageIndex = index - 1;
		if (userMessageIndex >= 0 && messages[userMessageIndex].isUser) {
			// Remove the AI response
			setMessages(prev => prev.slice(0, index));
			setQueriesLeft(prev => prev - 1);
			setIsLoading(true);

			// Simulate regenerating the response
			setTimeout(() => {
				const aiMessage: Message = {
					text: t.messages.regeneratedResponse,
					isUser: false
				};
				setMessages(prev => [...prev, aiMessage]);
				setIsLoading(false);
			}, 1000);
		}
	};

	const handleEdit = (index: number, newMessage: string) => {
		if (queriesLeft === 0) {
			showOutOfQueriesToast();
			return;
		}

		// Update the user message and remove all messages after it
		setMessages(prev => {
			const updated = [...prev];
			updated[index] = { text: newMessage, isUser: true };
			return updated.slice(0, index + 1);
		});

		setQueriesLeft(prev => prev - 1);
		setIsLoading(true);

		// Simulate generating a new response for the edited message
		setTimeout(() => {
			const aiMessage: Message = {
				text: t.messages.editedResponse,
				isUser: false
			};
			setMessages(prev => [...prev, aiMessage]);
			setIsLoading(false);
		}, 1000);
	};

	return (
		<>
			<Toaster position="top-center" />
			<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
				<Header />

				{/* Main Content */}
				<main className={`flex-1 flex flex-col relative min-h-0 ${isChatStarted ? 'overflow-hidden' : 'overflow-y-auto'}`}>
					{/* Hero Banner - gets pushed up and out when chat starts */}
					<div
						className={`transition-all duration-700 w-full ${isChatStarted ? '-translate-y-full opacity-0 absolute' : 'translate-y-0 opacity-100'}`}
					>
						<HeroBanner />
					</div>

					{/* Content wrapper */}
					<div
						className={`flex-1 flex flex-col transition-all duration-700 ${isChatStarted ? 'justify-start overflow-hidden min-h-0' : 'items-center justify-start pt-6'}`}
					>
						{!isChatStarted && (
							<div className="max-w-4xl w-full mx-auto flex flex-col px-4 sm:px-6">
								{/* Title Section - fades out when chat starts */}
								<div
									className={`transition-all duration-700 ${isChatStarted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
								>
									<TitleSection
										title={t.hero.title}
										subtitle={t.hero.subtitle}
									/>
								</div>

								{/* Suggested Questions - fades out when chat starts */}
								<div
									className={`transition-all duration-700 ${isChatStarted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
								>
									<SuggestedQuestions
										questions={t.suggestedQuestions}
										onQuestionClick={setQuery}
									/>
								</div>

								{/* Input Box */}
								<div ref={mainInputRef} className="transition-all duration-700">
									<InputBox
										query={query}
										queriesLeft={queriesLeft}
										maxQueries={10}
										onQueryChange={setQuery}
										onSubmit={handleSubmit}
										onClear={handleClear}
										isChatStarted={isChatStarted}
										disabled={queriesLeft === 0 || isLoading}
										isLoading={isLoading}
									/>
								</div>
							</div>
						)}

						{isChatStarted && (
							<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
								{/* Chat Messages Area - scrollable container spans full width */}
								<div className="chat-scrollbar flex-1 overflow-y-scroll animate-fade-in min-h-0 py-4 sm:py-6">
									<div className="max-w-4xl w-full mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4">
										{messages.map((message, index) => (
											<ChatMessage
												key={index}
												message={message.text}
												isUser={message.isUser}
												onRegenerate={!message.isUser ? () => handleRegenerate(index) : undefined}
												onEdit={message.isUser ? (newMessage) => handleEdit(index, newMessage) : undefined}
											/>
										))}
										{isLoading && <LoadingDots />}
										<div ref={messagesEndRef} />
									</div>
								</div>

								{/* Input Box - stays at bottom */}
								<div
									className="flex-shrink-0 border-t border-gray-200 bg-gray-50"
									style={{
										transform: `translateY(-${chatInputTransform}px)`,
										transition: 'transform 700ms ease-out'
									}}
								>
									<div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
										<InputBox
											query={query}
											queriesLeft={queriesLeft}
											maxQueries={10}
											onQueryChange={setQuery}
											onSubmit={handleSubmit}
											onClear={handleClear}
											isChatStarted={isChatStarted}
											disabled={queriesLeft === 0 || isLoading}
											isLoading={isLoading}
										/>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Footer */}
					<footer className="text-center py-4 sm:py-6 text-xs sm:text-sm text-gray-500 px-4">
						{t.footer.disclaimer}
					</footer>
				</main>
			</div>
		</>
	);
}
