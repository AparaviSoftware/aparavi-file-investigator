import { Plus } from 'lucide-react';
import aparaviLogo from '../../assets/aparavi-logo.png';
import { t } from '../../translations/en';

export default function Header() {
	return (
		<header className="bg-gray-50 text-gray-800 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
			<a href="/" className="text-xs sm:text-sm font-medium tracking-wide hover:text-gray-600 transition-colors whitespace-nowrap">
				{t.app.name}
			</a>
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
			<a
				href="https://dtc.aparavi.com/projects/new?templateId=74ef36f1-19c3-4a22-9fa0-b79d9aa42834"
				target="_blank"
				rel="noopener noreferrer"
				className="bg-orange-400 hover:bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
			>
				<span className="hidden sm:inline">{t.header.createChatbot}</span>
				<span className="sm:hidden">{t.header.createChatbotShort}</span>
				<Plus className="w-3 h-3 sm:w-4 sm:h-4" />
			</a>
		</header>
	);
}
