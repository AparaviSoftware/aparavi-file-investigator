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
	datasetId: string;
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

const STORAGE_KEY_PREFIX = 'aparavi_conversation';
const DEFAULT_QUERY_LIMIT = 25;

/**
 * Generates storage key for a specific dataset.
 *
 * @param {string} datasetId - The dataset identifier
 *
 * @return {string} Storage key for the dataset
 *
 * @example
 *     const key = getStorageKey('epstein');
 */
function getStorageKey(datasetId: string): string {
	return `${STORAGE_KEY_PREFIX}_${datasetId}`;
}

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
 * @param {string} datasetId - The dataset identifier
 *
 * @return {ConversationState} New conversation state
 *
 * @example
 *     const state = createNewConversation('epstein');
 */
function createNewConversation(datasetId: string): ConversationState {
	const fingerprint = getFingerprint();

	return {
		id: generateConversationId(),
		messages: [],
		metadata: {
			datasetId,
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
 * @param {string} datasetId - The dataset identifier
 *
 * @return {ConversationState} Loaded or new conversation state
 *
 * @example
 *     const state = loadConversation('epstein');
 */
export function loadConversation(datasetId: string): ConversationState {
	try {
		const stored = localStorage.getItem(getStorageKey(datasetId));

		if (!stored) {
			return createNewConversation(datasetId);
		}

		const state: ConversationState = JSON.parse(stored);
		const fingerprint = getFingerprint();

		// Verify fingerprint matches
		if (state.metadata.fingerprint !== fingerprint.fingerprint) {
			// Different user/device, create new conversation
			return createNewConversation(datasetId);
		}

		// Increment refresh count
		state.metadata.totalRefreshes += 1;
		state.metadata.lastActivityTime = new Date().toISOString();

		saveConversation(state, datasetId);

		return state;
	} catch (error) {
		console.error('Error loading conversation:', error);
		return createNewConversation(datasetId);
	}
}

/**
 * Saves conversation state to local storage.
 *
 * @param {ConversationState} state - Conversation state to save
 * @param {string} datasetId - The dataset identifier
 *
 * @return {void}
 *
 * @example
 *     saveConversation(conversationState, 'epstein');
 */
export function saveConversation(state: ConversationState, datasetId: string): void {
	try {
		localStorage.setItem(getStorageKey(datasetId), JSON.stringify(state));
	} catch (error) {
		console.error('Error saving conversation:', error);
	}
}

/**
 * Adds a user message to the conversation.
 *
 * @param {ConversationState} state - Current conversation state
 * @param {string} content - Message content
 * @param {string} datasetId - The dataset identifier
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = addUserMessage(state, 'Hello', 'epstein');
 */
export function addUserMessage(state: ConversationState, content: string, datasetId: string): ConversationState {
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

	saveConversation(newState, datasetId);
	return newState;
}

/**
 * Adds an assistant message to the conversation.
 *
 * @param {ConversationState} state - Current conversation state
 * @param {string} content - Message content
 * @param {string} datasetId - The dataset identifier
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = addAssistantMessage(state, 'Hi there!', 'epstein');
 */
export function addAssistantMessage(state: ConversationState, content: string, datasetId: string): ConversationState {
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

	saveConversation(newState, datasetId);
	return newState;
}

/**
 * Edits a message in the conversation and decrements query limit.
 *
 * @param {ConversationState} state - Current conversation state
 * @param {string} messageId - ID of message to edit
 * @param {string} newContent - New message content
 * @param {string} datasetId - The dataset identifier
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = editMessage(state, 'msg_123', 'Updated text', 'epstein');
 */
export function editMessage(state: ConversationState, messageId: string, newContent: string, datasetId: string): ConversationState {
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

	saveConversation(newState, datasetId);
	return newState;
}

/**
 * Tracks a regeneration in the conversation metadata and decrements query limit.
 *
 * @param {ConversationState} state - Current conversation state
 * @param {string} datasetId - The dataset identifier
 *
 * @return {ConversationState} Updated conversation state
 *
 * @example
 *     const newState = trackRegeneration(state, 'epstein');
 */
export function trackRegeneration(state: ConversationState, datasetId: string): ConversationState {
	const newState: ConversationState = {
		...state,
		metadata: {
			...state.metadata,
			totalRegenerations: state.metadata.totalRegenerations + 1,
			lastActivityTime: new Date().toISOString()
		},
		queriesRemaining: Math.max(0, state.queriesRemaining - 1)
	};

	saveConversation(newState, datasetId);
	return newState;
}

/**
 * Clears the conversation and creates a new one.
 *
 * @param {string} datasetId - The dataset identifier
 *
 * @return {ConversationState} New empty conversation state
 *
 * @example
 *     const newState = clearConversation('epstein');
 */
export function clearConversation(datasetId: string): ConversationState {
	const newState = createNewConversation(datasetId);
	saveConversation(newState, datasetId);
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
