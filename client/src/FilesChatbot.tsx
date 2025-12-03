import { useState } from 'react';
import { Send } from 'lucide-react';

import aparaviLogo from './assets/aparavi-logo.png';
import documentFilesBg from './assets/document-files-bg.png';

export default function FilesChatbot() {
	const [query, setQuery] = useState('');
	const [queriesLeft, setQueriesLeft] = useState(10);

	const suggestedQuestions = [
		"Was the CIA really responsible for Epstein's assassination?",
		"What is the relationship between Donald Trump and Epstein?",
		"Where the policeman really asleep during Epstein's suicide?"
	];

	const handleSubmit = (question: string) => {
		if (queriesLeft > 0) {
			setQueriesLeft(prev => prev - 1);
			setQuery('');
			// Handle query submission here
			console.log('Submitted:', question);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Header */}
			<header className="bg-gray-50 text-gray-800 px-6 py-4 flex items-center justify-between">
				<div className="text-sm font-medium tracking-wide">
					FILE INVESTIGATOR
				</div>
				<div className="flex items-center gap-3">
					<span className="text-xs text-gray-400">POWERED BY</span>
					<img
						src={aparaviLogo}
						alt="Aparavi"
						className="h-6 w-auto"
					/>
				</div>
				<button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
					Create your own chatbot
					<span className="text-lg">+</span>
				</button>
			</header>

			{/* Hero Banner */}
			<div className="w-full px-6">
				<div className="w-full h-40 relative overflow-hidden rounded-t-2xl">
					<img
						src={documentFilesBg}
						alt=""
						className="absolute inset-0 w-full h-full object-cover saturate-[0.3] brightness-75"
					/>
					<div className="absolute inset-0 bg-black/40"></div>
				</div>
			</div>

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 pt-2 pb-20">
				<div className="max-w-4xl w-full mx-auto">
					{/* Title Section */}
					<div className="text-center mb-12">
						<h1 className="text-5xl font-bold text-gray-900 mb-4">
							Chat with the Epstein Files
						</h1>
						<p className="text-gray-500 text-lg">
							Ask grounded questions against 100 thousand pages of the Epstein Files.
						</p>
					</div>

					{/* Suggested Questions */}
					<div className="grid grid-cols-3 gap-4 mb-8">
						{suggestedQuestions.map((question, index) => (
							<button
								key={index}
								onClick={() => handleSubmit(question)}
								className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gray-300 hover:shadow-md transition-all duration-200 flex items-start"
							>
								<p className="text-gray-800 text-sm leading-relaxed">
									<b>{question}</b>
								</p>
							</button>
						))}
					</div>

					{/* Input Box */}
					<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
						<div className="flex items-center p-4">
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSubmit(query)}
								placeholder="Ask anything..."
								className="flex-1 outline-none text-gray-800 placeholder-gray-400"
							/>
							<div className="flex items-center gap-3">
								<span className="text-sm text-gray-500">
									{queriesLeft}/10 queries
								</span>
								<button
									onClick={() => handleSubmit(query)}
									disabled={!query.trim() || queriesLeft === 0}
									className="bg-orange-100 text-orange-500 p-2 rounded-lg hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<Send className="w-5 h-5" />
								</button>
							</div>
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
