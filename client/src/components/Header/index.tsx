import { Plus, RotateCcw } from 'lucide-react';
import aparaviLogo from '../../assets/aparavi-logo.png';
import { t } from '../../translations/en';

interface HeaderProps {
	hasMessages?: boolean;
	onClearConversation?: () => void;
}

export default function Header({ hasMessages = false, onClearConversation }: HeaderProps) {
	return (
		<header className="bg-gray-50 text-gray-800 px-3 sm:px-6 py-3 sm:py-4">
			<div className="flex items-center justify-between">
				{/* Left section */}
				<div className="flex-1">
					<a href="/" className="text-xs sm:text-sm font-medium tracking-wide hover:text-gray-600 transition-colors whitespace-nowrap">
						{t.app.name}
					</a>
				</div>

				{/* Center section - Powered by Aparavi */}
				<div className="flex-1 flex justify-center">
					<a
						href="https://aparavi.com"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
					>
						<span className="text-xs text-gray-400 hidden sm:inline">{t.app.poweredBy}</span>
						<img
							src={aparaviLogo}
							alt="Aparavi"
							className="h-5 sm:h-6 w-auto"
						/>
					</a>
				</div>

				{/* Right section - Clear button + Create chatbot button */}
				<div className="flex-1 flex items-center justify-end gap-2">
					{/* Clear conversation button - only shows when there are messages */}
					{hasMessages && onClearConversation && (
						<button
							onClick={onClearConversation}
							className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
							title="Clear conversation"
						>
							<RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
							<span className="hidden sm:inline">Clear</span>
						</button>
					)}

					<a
						href={t.header.createChatbotUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="bg-orange-400 hover:bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
					>
						<span className="hidden sm:inline">{t.header.createChatbot}</span>
						<span className="sm:hidden">{t.header.createChatbotShort}</span>
						<Plus className="w-3 h-3 sm:w-4 sm:h-4" />
					</a>
				</div>
			</div>
		</header>
	);
}
