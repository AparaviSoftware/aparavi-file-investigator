import { useNavigate } from 'react-router-dom';
import { Landmark, Shield, Rocket, FileIcon } from 'lucide-react';
import Header from '../../components/Header';
import AboutProject from '../../components/AboutProject';
import { t } from '../../translations/en';
import documentBg from '../../assets/document-files-bg.png';
import jfkBanner from '../../assets/jfk-banner.jpg';
import ufoBanner from '../../assets/ufo-banner.jpg';
import epsteinBanner from '../../assets/epstein-banner.jpg';

type DatasetCardData = {
	id: 'epstein' | 'jfk' | 'ufo';
	name: string;
	description: string;
	documentCount: string;
	icon: React.ComponentType<{ className?: string }>;
	route: string;
}

const datasetBanners: Record<string, string> = {
	jfk: jfkBanner,
	ufo: ufoBanner,
	epstein: epsteinBanner
};

export default function Home() {
	const navigate = useNavigate();

	const datasets: DatasetCardData[] = [
		{
			id: 'epstein',
			name: t.home.datasetCards.epstein.name,
			description: t.home.datasetCards.epstein.description,
			documentCount: t.home.datasetCards.epstein.documentCount,
			icon: Landmark,
			route: '/chat/epstein'
		},
		{
			id: 'jfk',
			name: t.home.datasetCards.jfk.name,
			description: t.home.datasetCards.jfk.description,
			documentCount: t.home.datasetCards.jfk.documentCount,
			icon: Shield,
			route: '/chat/jfk'
		},
		{
			id: 'ufo',
			name: t.home.datasetCards.ufo.name,
			description: t.home.datasetCards.ufo.description,
			documentCount: t.home.datasetCards.ufo.documentCount,
			icon: Rocket,
			route: '/chat/ufo'
		}
	];

	const handleDatasetClick = (route: string) => {
		navigate(route);
	};

	return (
		<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
			<Header hasMessages={false} />

			<main className="flex-1 overflow-y-auto">
				<div className="flex flex-col items-center px-4 sm:px-6 py-8">
					<div className="max-w-[70rem] w-full mx-auto">
						<div className="text-center mb-8 sm:mb-12">
							<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
								{t.home.title}
							</h1>
							<p className="text-gray-500 text-base sm:text-lg px-4">
								{t.home.subtitle}
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12">
							{datasets.map((dataset) => (
								<button
									key={dataset.id}
									onClick={() => handleDatasetClick(dataset.route)}
									className="bg-white border border-gray-200 rounded-lg overflow-hidden text-left hover:border-gray-300 hover:shadow-md transition-all duration-200"
								>
									{/* Image header with icon overlay */}
									<div className="relative bg-gray-800" style={{ aspectRatio: '1044/258' }}>
										<img
											src={datasetBanners[dataset.id] || documentBg}
											alt=""
											width={1044}
											height={258}
											fetchPriority="high"
											className="w-full h-full object-contain grayscale opacity-50"
										/>
										<div className="absolute bottom-0 left-0 p-4">
											<div className="p-2.5 bg-orange-500 rounded-lg">
												<dataset.icon className="w-5 h-5 text-white" />
											</div>
										</div>
									</div>

									{/* Card content */}
									<div className="p-4 sm:p-5">
										<h3 className="text-lg font-semibold text-gray-900 mb-1">
											{dataset.name}
										</h3>
										<p className="text-sm text-gray-600 leading-relaxed mb-4">
											{dataset.description}
										</p>

										{/* Document count */}
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<FileIcon className="w-4 h-4" />
											<span>{dataset.documentCount}</span>
										</div>
									</div>
								</button>
							))}
						</div>

						<AboutProject
							title={t.home.about.title}
							videoUrl={t.home.about.videoUrl}
							features={t.home.about.features}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
