import { Plus } from 'lucide-react';
import aparaviLogo from '../assets/aparavi-logo.png';

export default function Header() {
	return (
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
			<a
				href="https://dtc.aparavi.com/projects/new?templateId=74ef36f1-19c3-4a22-9fa0-b79d9aa42834"
				target="_blank"
				rel="noopener noreferrer"
				className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
			>
				Create your own chatbot
				<Plus className="w-4 h-4" />
			</a>
		</header>
	);
}
