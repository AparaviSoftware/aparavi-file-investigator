import { Search, List, BookOpen, TrendingUp } from 'lucide-react';

interface FeatureItem {
	icon: React.ReactNode;
	title: string;
	description: string;
}

interface AboutProjectProps {
	title: string;
	features: {
		skipManualSearching: {
			title: string;
			description: string;
		};
		structuredResearch: {
			title: string;
			description: string;
		};
		startWithContext: {
			title: string;
			description: string;
		};
		researchFlow: {
			title: string;
			description: string;
		};
	};
}

/**
 * AboutProject component displays key features of the application
 *
 * @param {AboutProjectProps} { title, features } - The section title, and object containing feature details
 *
 * @return {JSX.Element} The AboutProject component
 *
 * @example
 *     <AboutProject title="About this project" features={t.about.features} />
 */
export default function AboutProject({ title, features }: AboutProjectProps) {
	const featureItems: FeatureItem[] = [
		{
			icon: <Search className="w-6 h-6" />,
			title: features.skipManualSearching.title,
			description: features.skipManualSearching.description
		},
		{
			icon: <BookOpen className="w-6 h-6" />,
			title: features.startWithContext.title,
			description: features.startWithContext.description
		},
		{
			icon: <List className="w-6 h-6" />,
			title: features.structuredResearch.title,
			description: features.structuredResearch.description
		},
		{
			icon: <TrendingUp className="w-6 h-6" />,
			title: features.researchFlow.title,
			description: features.researchFlow.description
		}
	];

	return (
		<div className="w-full py-12 sm:py-16 bg-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6">
				<h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
					{title}
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
					{featureItems.map((feature, index) => (
						<div
							key={index}
							className="flex gap-4 p-6 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="flex-shrink-0 text-orange-500">
								{feature.icon}
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
