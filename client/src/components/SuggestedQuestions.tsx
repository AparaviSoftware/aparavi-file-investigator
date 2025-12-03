interface SuggestedQuestionsProps {
	questions: string[];
	onQuestionClick: (question: string) => void;
}

export default function SuggestedQuestions({ questions, onQuestionClick }: SuggestedQuestionsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
			{questions.map((question, index) => (
				<button
					key={index}
					onClick={() => onQuestionClick(question)}
					className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-left hover:border-gray-300 hover:shadow-md transition-all duration-200 flex items-start"
				>
					<p className="text-gray-800 text-sm sm:text-sm leading-relaxed">
						<b>{question}</b>
					</p>
				</button>
			))}
		</div>
	);
}
