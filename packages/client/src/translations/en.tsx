const CHATBOT_TEMPLATE_URL = 'https://aparavi.com/create-your-own-chatbot/';
const FEEDBACK_URL = 'https://aparavi.canny.io/file-explorer';
const HOME_VIDEO_URL = 'https://www.youtube.com/embed/_sggv0p5Li0';
const DATASET_VIDEO_URL = 'https://www.youtube.com/embed/c55Ea41PNTg';

export const t = {
	app: {
		name: 'FILE INVESTIGATOR',
		poweredBy: 'POWERED BY'
	},
	home: {
		title: 'Choose Your Investigation',
		subtitle: 'Select a dataset to explore declassified files and historical documents',
		datasetCards: {
			epstein: {
				name: 'Epstein Files',
				description: 'Explore 100,000 pages of the Epstein Files',
				documentCount: '80,000'
			},
			jfk: {
				name: 'JFK Files',
				description: 'Declassified documents on the JFK assasination',
				documentCount: '26,000'
			},
			ufo: {
				name: 'UFO Files',
				description: 'Unidentified Aerial Phenomena investigations',
				documentCount: '126,000'
			}
		},
		about: {
			title: 'About this project',
			videoUrl: HOME_VIDEO_URL,
			features: {
				skipManualSearching: {
					title: 'Skip manual searching',
					description: 'No more jumping between PDFs, tabs, and keyword searches. Ask once and get a clear, readable answer.'
				},
				structuredResearch: {
					title: 'Get structured research instantly',
					description: 'Generate summaries, timelines, key people/organizations, and "what changed between releases" in minutes.'
				},
				startWithContext: {
					title: 'Start with context, not scratch',
					description: 'No need to load the full story or search through the web. Everything is centered on the source files from the start.'
				},
				researchFlow: {
					title: 'Built for research flow, not casual browsing',
					description: 'Prompts and outputs help with research, including notes, summaries, timelines, and easy-to-share briefs.'
				}
			}
		}
	},
	header: {
		createChatbot: 'Create your own chatbot',
		createChatbotShort: 'Create',
		createChatbotUrl: CHATBOT_TEMPLATE_URL,
		shareFeedback: 'Share your feedback',
		shareFeedbackShort: 'Feedback',
		shareFeedbackUrl: FEEDBACK_URL
	},
	input: {
		placeholder: 'Ask anything...',
		placeholderDisabled: 'Query limit reached'
	},
	footer: {
		disclaimer: 'AI can make mistakes.'
	},
	datasets: {
		epstein: {
			hero: {
				title: 'Chat with the Epstein Files',
				subtitle: 'Ask grounded questions against 100 thousand pages of the Epstein Files.'
			},
			suggestedQuestions: [
				'Who were Epstein\'s primary associates, business partners, and other influential connections?',
				'What role did surveillance equipment, private security, or social media play in Epstein\'s operations?',
				'How did the media cover Epstein\'s story over time, and were there instances of information suppression?'
			],
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
			about: {
				title: 'About this project',
				videoUrl: DATASET_VIDEO_URL,
				features: {
					skipManualSearching: {
						title: 'Skip manual searching',
						description: 'No more jumping between PDFs, tabs, and keyword searches. Ask once and get a clear, readable answer.'
					},
					structuredResearch: {
						title: 'Get structured research instantly',
						description: 'Generate summaries, timelines, key people/organizations, and "what changed between releases" in minutes.'
					},
					startWithContext: {
						title: 'Start with context, not scratch',
						description: 'No need to load the full story or search through the web. Everything is centered on the Epstein files from the start.'
					},
					researchFlow: {
						title: 'Built for research flow, not casual browsing',
						description: 'Prompts and outputs help with research, including notes, summaries, timelines, and easy-to-share briefs.'
					}
				}
			}
		},
		jfk: {
			hero: {
				title: 'Chat with the JFK Files',
				subtitle: 'Explore declassified documents related to the assassination of President John F. Kennedy.'
			},
			suggestedQuestions: [
				'What were the key findings of the Warren Commission investigation?',
				'What evidence exists regarding Lee Harvey Oswald\'s connections and motivations?',
				'What do the declassified CIA and FBI documents reveal about the investigation?'
			],
			messages: {
				placeholderResponse: 'This is a placeholder response. The LLM will be connected later to provide actual answers based on the JFK Files.',
				regeneratedResponse: 'This is a regenerated response. The LLM will be connected later to provide actual answers based on the JFK Files.',
				editedResponse: 'This is a response to your edited message. The LLM will be connected later to provide actual answers based on the JFK Files.'
			},
			errors: {
				outOfQueries: (
					<span>
						You're out of queries. <a href={CHATBOT_TEMPLATE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">Create your own chatbot</a> to continue the conversation.
					</span>
				)
			},
			about: {
				title: 'About this project',
				videoUrl: DATASET_VIDEO_URL,
				features: {
					skipManualSearching: {
						title: 'Skip manual searching',
						description: 'No more jumping between PDFs, tabs, and keyword searches. Ask once and get a clear, readable answer.'
					},
					structuredResearch: {
						title: 'Get structured research instantly',
						description: 'Generate summaries, timelines, key people/organizations, and "what changed between releases" in minutes.'
					},
					startWithContext: {
						title: 'Start with context, not scratch',
						description: 'No need to load the full story or search through the web. Everything is centered on the JFK files from the start.'
					},
					researchFlow: {
						title: 'Built for research flow, not casual browsing',
						description: 'Prompts and outputs help with research, including notes, summaries, timelines, and easy-to-share briefs.'
					}
				}
			}
		},
		ufo: {
			hero: {
				title: 'Chat with the UFO Files',
				subtitle: 'Investigate declassified government documents on Unidentified Aerial Phenomena (UAP).'
			},
			suggestedQuestions: [
				'What are the most credible documented UFO/UAP sightings by military personnel?',
				'What investigations has the U.S. government conducted into UFO phenomena?',
				'What do declassified documents reveal about Project Blue Book and other official studies?'
			],
			messages: {
				placeholderResponse: 'This is a placeholder response. The LLM will be connected later to provide actual answers based on the UFO Files.',
				regeneratedResponse: 'This is a regenerated response. The LLM will be connected later to provide actual answers based on the UFO Files.',
				editedResponse: 'This is a response to your edited message. The LLM will be connected later to provide actual answers based on the UFO Files.'
			},
			errors: {
				outOfQueries: (
					<span>
						You're out of queries. <a href={CHATBOT_TEMPLATE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">Create your own chatbot</a> to continue the conversation.
					</span>
				)
			},
			about: {
				title: 'About this project',
				videoUrl: DATASET_VIDEO_URL,
				features: {
					skipManualSearching: {
						title: 'Skip manual searching',
						description: 'No more jumping between PDFs, tabs, and keyword searches. Ask once and get a clear, readable answer.'
					},
					structuredResearch: {
						title: 'Get structured research instantly',
						description: 'Generate summaries, timelines, key people/organizations, and "what changed between releases" in minutes.'
					},
					startWithContext: {
						title: 'Start with context, not scratch',
						description: 'No need to load the full story or search through the web. Everything is centered on the UFO files from the start.'
					},
					researchFlow: {
						title: 'Built for research flow, not casual browsing',
						description: 'Prompts and outputs help with research, including notes, summaries, timelines, and easy-to-share briefs.'
					}
				}
			}
		}
	}
};
