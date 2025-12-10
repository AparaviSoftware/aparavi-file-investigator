const CHATBOT_TEMPLATE_URL = 'https://dtc.aparavi.com/projects/new?templateId=74ef36f1-19c3-4a22-9fa0-b79d9aa42834';

export const t = {
	app: {
		name: 'FILE INVESTIGATOR',
		poweredBy: 'POWERED BY'
	},
	header: {
		createChatbot: 'Create your own chatbot',
		createChatbotShort: 'Create',
		createChatbotUrl: CHATBOT_TEMPLATE_URL
	},
	hero: {
		title: 'Chat with the Epstein Files',
		subtitle: 'Ask grounded questions against 100 thousand pages of the Epstein Files.'
	},
	suggestedQuestions: [
		'Was the CIA really responsible for Epstein\'s assassination?',
		'What is the relationship between Donald Trump and Epstein?',
		'Were the guards really asleep during Epstein\'s suicide?'
	],
	input: {
		placeholder: 'Ask anything...',
		placeholderDisabled: 'Query limit reached'
	},
	messages: {
		placeholderResponse: 'This is a placeholder response. The LLM will be connected later to provide actual answers based on the Epstein Files.',
		regeneratedResponse: 'This is a regenerated response. The LLM will be connected later to provide actual answers based on the Epstein Files.',
		editedResponse: 'This is a response to your edited message. The LLM will be connected later to provide actual answers based on the Epstein Files.'
	},
	errors: {
		outOfQueries: (
			<span>
				You're out of queries. <a href={CHATBOT_TEMPLATE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">Create your own chatbot</a> to continue the conversation.
			</span>
		)
	},
	footer: {
		disclaimer: 'AI can make mistake. Just like every weirdo who visited the island.'
	}
};
