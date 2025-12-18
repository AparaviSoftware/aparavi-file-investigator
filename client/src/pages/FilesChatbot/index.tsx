import { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../../components/Header';
import HeroBanner from '../../components/HeroBanner';
import TitleSection from '../../components/TitleSection';
import SuggestedQuestions from '../../components/SuggestedQuestions';
import InputBox from '../../components/InputBox';
import ChatMessage from '../../components/ChatMessage';
import LoadingDots from '../../components/LoadingDots';
import AboutProject from '../../components/AboutProject';
import { sendChatMessage } from '../../services/api';
import {
	loadConversation,
	addUserMessage,
	addAssistantMessage,
	editMessage,
	trackRegeneration,
	hasReachedQueryLimit,
	getConversationStats,
	clearConversation,
	type ConversationState
} from '../../services/conversationStorage';
import { t } from '../../translations/en';
import './styles.css';

export default function FilesChatbot() {
	const [query, setQuery] = useState('');
	const [conversationState, setConversationState] = useState<ConversationState | null>(null);
	const [isChatStarted, setIsChatStarted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [chatInputTransform, setChatInputTransform] = useState(0);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const mainInputRef = useRef<HTMLDivElement>(null);

	// Load conversation on mount
	useEffect(() => {
		const state = loadConversation();
		setConversationState(state);

		// If conversation has messages, start in chat mode
		if (state.messages.length > 0) {
			setIsChatStarted(true);
		}
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [conversationState?.messages, isLoading]);

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

	const handleSubmit = async (question: string) => {
		if (!question.trim() || !conversationState) return;

		if (hasReachedQueryLimit(conversationState)) {
			showOutOfQueriesToast();
			return;
		}

		// Measure main input position before chat starts
		if (mainInputRef.current && !isChatStarted) {
			const rect = mainInputRef.current.getBoundingClientRect();
			const distanceFromBottom = window.innerHeight - rect.bottom - 80;
			setChatInputTransform(distanceFromBottom);
		}

		// Start chat mode
		setIsChatStarted(true);

		// Add user message
		const newState = addUserMessage(conversationState, question);
		setConversationState(newState);
		setQuery('');
		setIsLoading(true);

		try {
			const response = await sendChatMessage(question);
			const finalState = addAssistantMessage(newState, response.message);
			setConversationState(finalState);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An error occurred';
			toast.error(errorMessage);
			const finalState = addAssistantMessage(newState, `Error: ${errorMessage}`);
			setConversationState(finalState);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClear = () => {
		setQuery('');
	};

	const handleRegenerate = async (index: number) => {
		if (!conversationState) return;

		if (hasReachedQueryLimit(conversationState)) {
			showOutOfQueriesToast();
			return;
		}

		// Find the user message that prompted this response
		const userMessageIndex = index - 1;
		const userMessage = conversationState.messages[userMessageIndex];

		if (userMessageIndex >= 0 && userMessage?.role === 'user') {
			const userQuestion = userMessage.content;

			// Remove the AI response and all messages after it
			const truncatedState = {
				...conversationState,
				messages: conversationState.messages.slice(0, index)
			};

			// Track the regeneration (without creating a new query)
			const newState = trackRegeneration(truncatedState);
			setConversationState(newState);
			setIsLoading(true);

			try {
				const response = await sendChatMessage(userQuestion);
				const finalState = addAssistantMessage(newState, response.message);
				setConversationState(finalState);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'An error occurred';
				toast.error(errorMessage);
				const finalState = addAssistantMessage(newState, `Error: ${errorMessage}`);
				setConversationState(finalState);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleEdit = async (index: number, newMessage: string) => {
		if (!conversationState) return;

		if (hasReachedQueryLimit(conversationState)) {
			showOutOfQueriesToast();
			return;
		}

		const messageToEdit = conversationState.messages[index];
		if (!messageToEdit) return;

		// Edit the message and remove all messages after it
		const editedState = editMessage(conversationState, messageToEdit.id, newMessage);
		const truncatedState = {
			...editedState,
			messages: editedState.messages.slice(0, index + 1)
		};

		setConversationState(truncatedState);
		setIsLoading(true);

		try {
			const response = await sendChatMessage(newMessage);
			const finalState = addAssistantMessage(truncatedState, response.message);
			setConversationState(finalState);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An error occurred';
			toast.error(errorMessage);
			const finalState = addAssistantMessage(truncatedState, `Error: ${errorMessage}`);
			setConversationState(finalState);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClearConversation = () => {
		const newState = clearConversation();
		setConversationState(newState);
		setIsChatStarted(false);
		setQuery('');
	};

	if (!conversationState) {
		return null; // Loading state
	}

	const stats = getConversationStats(conversationState);

	return (
		<>
			<Toaster position="top-center" />
			<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
				<Header
					hasMessages={conversationState.messages.length > 0}
					onClearConversation={handleClearConversation}
				/>

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
										queriesLeft={stats.queriesRemaining}
										maxQueries={stats.queryLimit}
										onQueryChange={setQuery}
										onSubmit={handleSubmit}
										onClear={handleClear}
										isChatStarted={isChatStarted}
										disabled={hasReachedQueryLimit(conversationState) || isLoading}
										isLoading={isLoading}
									/>
								</div>

								{/* About Project Section */}
								<div
									className={`transition-all duration-700 mt-8 ${isChatStarted ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
								>
									<AboutProject
										title={t.about.title}
										features={t.about.features}
									/>
								</div>
							</div>
						)}

						{isChatStarted && (
							<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
								{/* Chat Messages Area - scrollable container spans full width */}
								<div className="chat-scrollbar flex-1 overflow-y-scroll animate-fade-in min-h-0 py-4 sm:py-6">
									<div className="max-w-4xl w-full mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4">
										{conversationState.messages.map((message, index) => (
											<ChatMessage
												key={message.id}
												message={message.content}
												isUser={message.role === 'user'}
												onRegenerate={message.role === 'assistant' ? () => handleRegenerate(index) : undefined}
												onEdit={message.role === 'user' ? newMessage => handleEdit(index, newMessage) : undefined}
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
											queriesLeft={stats.queriesRemaining}
											maxQueries={stats.queryLimit}
											onQueryChange={setQuery}
											onSubmit={handleSubmit}
											onClear={handleClear}
											isChatStarted={isChatStarted}
											disabled={hasReachedQueryLimit(conversationState) || isLoading}
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
