import { useState } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import TitleSection from '../components/TitleSection';
import SuggestedQuestions from '../components/SuggestedQuestions';
import InputBox from '../components/InputBox';

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

	const handleClear = () => {
		setQuery('');
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />

			<HeroBanner />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
				<div className="max-w-4xl w-full mx-auto">
					<TitleSection
						title="Chat with the Epstein Files"
						subtitle="Ask grounded questions against 100 thousand pages of the Epstein Files."
					/>

					<SuggestedQuestions
						questions={suggestedQuestions}
						onQuestionClick={setQuery}
					/>

					<InputBox
						query={query}
						queriesLeft={queriesLeft}
						maxQueries={10}
						onQueryChange={setQuery}
						onSubmit={handleSubmit}
						onClear={handleClear}
					/>
				</div>
			</main>

			{/* Footer */}
			<footer className="text-center py-6 text-sm text-gray-500">
				AI can make mistake. Just like every weirdo who visited the island.
			</footer>
		</div>
	);
}
