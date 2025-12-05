import './LoadingDots.css';

export default function LoadingDots() {
	return (
		<div className="flex justify-start mb-4">
			<div className="flex items-center gap-1">
				<div className="loading-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
				<div className="loading-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
				<div className="loading-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
			</div>
		</div>
	);
}
