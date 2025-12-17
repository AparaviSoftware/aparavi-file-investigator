import { getFingerprint } from './fingerprint';

export interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: string;
	edited?: boolean;
	editCount?: number;
}

export interface ConversationMetadata {
	totalQueries: number;
	totalEdits: number;
	totalRefreshes: number;
	totalRegenerations: number;
	sessionStartTime: string;
	lastActivityTime: string;
	fingerprint: string;
}

export interface ConversationState {
	id: string;
	messages: Message[];
	metadata: ConversationMetadata;
	queryLimit: number;
	queriesRemaining: number;
}

const STORAGE_KEY = 'aparavi_conversation';
const DEFAULT_QUERY_LIMIT = 25;

/**
 * Generates a unique message ID.
 *
 * @return {string} Unique message identifier
 *
 * @example
 *     const id = generateMessageId();
 */
function generateMessageId(): string {
	return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generates a unique conversation ID.
 *
 * @return {string} Unique conversation identifier
 *
 * @example
 *     const id = generateConversationId();
 */
function generateConversationId(): string {
	return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a new empty conversation state.
 *
 * @return {ConversationState} New conversation state
 *
 * @example
 *     const state = createNewConversation();
 */
function createNewConversation(): ConversationState {
	const fingerprint = getFingerprint();

	return {
		id: generateConversationId(),
		messages: [],
		metadata: {
			totalQueries: 0,
			totalEdits: 0,
			totalRefreshes: 0,
			totalRegenerations: 0,
			sessionStartTime: new Date().toISOString(),
			lastActivityTime: new Date().toISOString(),
			fingerprint: fingerprint.fingerprint
		},
		queryLimit: DEFAULT_QUERY_LIMIT,
		queriesRemaining: DEFAULT_QUERY_LIMIT
	};
}

/**
 * Loads conversation state from local storage.
 *
 * @return {ConversationState} Loaded or new conversation state
 *
 * @example
 *     const state = loadConversation();
 */
export function loadConversation(): ConversationState {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);

		if (!stored) {
			return createNewConversation();
		}

		const state: ConversationState = JSON.parse(stored);
		const fingerprint = getFingerprint();

		// Verify fingerprint matches
		if (state.metadata.fingerprint !== fingerprint.fingerprint) {
			// Different user/device, create new conversation
			return createNewConversation();
		}

		// Increment refresh count
		state.metadata.totalRefreshes += 1;
		state.metadata.lastActivityTime = new Date().toISOString();

		saveConversation(state);

		return state;
	} catch (error) {
		console.error('Error loading conversation:', error);
		return createNewConversation();
	}
}

/**
 * Saves conversation state to local storage.
 *
 * @param {ConversationState} state - Conversation state to save
 *
 * @return {void}
 *
 * @example
 *     saveConversation(conversationState);
 */
export function saveConversation(state: ConversationState): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (error) {
		console.error('Error saving conversation:', error);
	}
}

/**
 * Adds a user message to the conversation.
 *
 * @param {ConversationState} state - Current conversation state
 * @param {string} content - Message content
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = addUserMessage(state, 'Hello');
 */
export function addUserMessage(state: ConversationState, content: string): ConversationState {
	const message: Message = {
		id: generateMessageId(),
		role: 'user',
		content,
		timestamp: new Date().toISOString()
	};

	const newState: ConversationState = {
		...state,
		messages: [...state.messages, message],
		metadata: {
			...state.metadata,
			totalQueries: state.metadata.totalQueries + 1,
			lastActivityTime: new Date().toISOString()
		},
		queriesRemaining: Math.max(0, state.queriesRemaining - 1)
	};

	saveConversation(newState);
	return newState;
}

/**
 * Adds an assistant message to the conversation.
 *
 * @param {ConversationState} state - Current conversation state
 * @param {string} content - Message content
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = addAssistantMessage(state, 'Hi there!');
 */
export function addAssistantMessage(state: ConversationState, content: string): ConversationState {
	const message: Message = {
		id: generateMessageId(),
		role: 'assistant',
		content,
		timestamp: new Date().toISOString()
	};

	const newState: ConversationState = {
		...state,
		messages: [...state.messages, message],
		metadata: {
			...state.metadata,
			lastActivityTime: new Date().toISOString()
		}
	};

	saveConversation(newState);
	return newState;
}

/**
 * Edits a message in the conversation and decrements query limit.
 *
 * @param {ConversationState} state - Current conversation state
 * @param {string} messageId - ID of message to edit
 * @param {string} newContent - New message content
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = editMessage(state, 'msg_123', 'Updated text');
 */
export function editMessage(state: ConversationState, messageId: string, newContent: string): ConversationState {
	const messageIndex = state.messages.findIndex(msg => msg.id === messageId);

	if (messageIndex === -1) {
		return state;
	}

	const updatedMessages = [...state.messages];
	const message = updatedMessages[messageIndex];

	updatedMessages[messageIndex] = {
		...message,
		content: newContent,
		edited: true,
		editCount: (message.editCount || 0) + 1
	};

	const newState: ConversationState = {
		...state,
		messages: updatedMessages,
		metadata: {
			...state.metadata,
			totalEdits: state.metadata.totalEdits + 1,
			lastActivityTime: new Date().toISOString()
		},
		queriesRemaining: Math.max(0, state.queriesRemaining - 1)
	};

	saveConversation(newState);
	return newState;
}

/**
 * Tracks a regeneration in the conversation metadata and decrements query limit.
 *
 * @param {ConversationState} state - Current conversation state
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = trackRegeneration(state);
 */
export function trackRegeneration(state: ConversationState): ConversationState {
	const newState: ConversationState = {
		...state,
		metadata: {
			...state.metadata,
			totalRegenerations: state.metadata.totalRegenerations + 1,
			lastActivityTime: new Date().toISOString()
		},
		queriesRemaining: Math.max(0, state.queriesRemaining - 1)
	};

	saveConversation(newState);
	return newState;
}

/**
 * Clears the conversation and creates a new one.
 *
 * @return {ConversationState} New empty conversation state
 *
 * @example
 *     const newState = clearConversation();
 */
export function clearConversation(): ConversationState {
	const newState = createNewConversation();
	saveConversation(newState);
	return newState;
}

/**
 * Gets conversation statistics.
 *
 * @param {ConversationState} state - Current conversation state
 *
 * @return {object} Conversation statistics
 *
 * @example
 *     const stats = getConversationStats(state);
 */
export function getConversationStats(state: ConversationState): {
	messageCount: number;
	userMessageCount: number;
	assistantMessageCount: number;
	totalQueries: number;
	totalEdits: number;
	totalRefreshes: number;
	totalRegenerations: number;
	queriesRemaining: number;
	queryLimit: number;
} {
	const userMessages = state.messages.filter(msg => msg.role === 'user');
	const assistantMessages = state.messages.filter(msg => msg.role === 'assistant');

	return {
		messageCount: state.messages.length,
		userMessageCount: userMessages.length,
		assistantMessageCount: assistantMessages.length,
		totalQueries: state.metadata.totalQueries,
		totalEdits: state.metadata.totalEdits,
		totalRefreshes: state.metadata.totalRefreshes,
		totalRegenerations: state.metadata.totalRegenerations,
		queriesRemaining: state.queriesRemaining,
		queryLimit: state.queryLimit
	};
}

/**
 * Checks if user has reached query limit.
 *
 * @param {ConversationState} state - Current conversation state
 *
 * @return {boolean} True if limit reached
 *
 * @example
 *     const limitReached = hasReachedQueryLimit(state);
 */
export function hasReachedQueryLimit(state: ConversationState): boolean {
	return state.queriesRemaining <= 0;
}
