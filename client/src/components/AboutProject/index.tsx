import { Search, List, BookOpen, TrendingUp } from 'lucide-react';

interface FeatureItem {
	icon: React.ReactNode;
	title: string;
	description: string;
}

interface AboutProjectProps {
	title: string;
	videoUrl: string;
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
 * @param {AboutProjectProps} { title, videoUrl, features } - The section title, video URL, and object containing feature details
 *
 * @return {JSX.Element} The AboutProject component
 *
 * @example
 *     <AboutProject title="About this project" videoUrl={t.about.videoUrl} features={t.about.features} />
 */
export default function AboutProject({ title, videoUrl, features }: AboutProjectProps) {
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
			<div className="max-w-[70rem] mx-auto px-4 sm:px-6">
				<h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
					{title}
				</h2>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Video Column */}
					<div className="flex items-start justify-center">
						<div className="w-full">
							<div className="relative rounded-lg overflow-hidden shadow-lg aspect-video bg-gray-900">
								<iframe
									src={videoUrl}
									title="About this project video"
									className="absolute inset-0 w-full h-full"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						</div>
					</div>

					{/* Features Grid - 2 columns on mobile, 2 separate columns on desktop */}
					<div className="lg:col-span-2 grid grid-cols-2 gap-6">
						{featureItems.map((feature, index) => (
							<div
								key={index}
								className="flex gap-3"
							>
								<div className="flex-shrink-0 text-orange-500">
									{feature.icon}
								</div>
								<div className="flex-1">
									<h3 className="text-[16px] font-semibold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600 text-[12px] leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
