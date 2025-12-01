import { createContext, useContext, useEffect, useMemo, useState, ReactNode, ReactElement } from 'react';
import { Message } from '../types';
import { postMessage } from '../services/api';

export interface ApiContextType {
	messages: Message[];
	setMessages: (messages: Message[]) => void;
	sendMessage: (content: string) => Promise<void>;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
}

const ApiContext = createContext<ApiContextType>({});

interface IProps {
	children: ReactNode;
}

export const ApiProvider = ({ children }: IProps): ReactElement => {
	const [isLoading, setIsLoading] = useState(false)
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			content: 'Chat with Jeff\'s emails.',
			timestamp: new Date()
		},
	])

	const sendMessage = async (content: string) => {
		if (!content.trim() || isLoading) return

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content,
			timestamp: new Date()
		}
		setMessages(prev => [...prev, userMessage])
		setIsLoading(true)

		try {
			// Call API
			const response = await postMessage(content)

			// Add assistant response with animate flag
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: response.result,
				timestamp: new Date(),
				animate: true  // Enable typewriter effect for new messages
			}
			setMessages(prev => [...prev, assistantMessage])

			// Remove animate flag after animation completes
			const words = response.result.split(/(\s+)/)
			const animationDuration = words.length * 50 + 100 // Match typing speed + buffer

			setTimeout(() => {
				setMessages(prev =>
					prev.map(msg =>
						msg.id === assistantMessage.id
							? { ...msg, animate: false }
							: msg
					)
				)
			}, animationDuration)
		} catch (error) {
			// Add error message
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
				timestamp: new Date(),
				isError: true
			}
			setMessages(prev => [...prev, errorMessage])
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<ApiContext.Provider
			value={{
				messages,
				isLoading,
				setIsLoading,
				setMessages,
				sendMessage
			}}
		>
			{children}
		</ApiContext.Provider>
	);
};

export const useApi = (): ApiContextType => {
	const context = useContext(ApiContext);
	if (context === undefined) {
		throw new Error('useApi must be used within an ApiProvider');
	}
	return context;
};
