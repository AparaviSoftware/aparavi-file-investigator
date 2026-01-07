import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Plane } from 'lucide-react';
import Header from '../../components/Header';
import AboutProject from '../../components/AboutProject';
import { t } from '../../translations/en';

type DatasetCardData = {
	id: 'epstein' | 'jfk' | 'ufo';
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	route: string;
}

export default function Home() {
	const navigate = useNavigate();

	const datasets: DatasetCardData[] = [
		{
			id: 'epstein',
			name: t.home.datasetCards.epstein.name,
			description: t.home.datasetCards.epstein.description,
			icon: FileText,
			route: '/chat/epstein'
		},
		{
			id: 'jfk',
			name: t.home.datasetCards.jfk.name,
			description: t.home.datasetCards.jfk.description,
			icon: Shield,
			route: '/chat/jfk'
		},
		{
			id: 'ufo',
			name: t.home.datasetCards.ufo.name,
			description: t.home.datasetCards.ufo.description,
			icon: Plane,
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
									className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-left hover:border-gray-300 hover:shadow-md transition-all duration-200"
								>
									<div className="flex flex-col items-start gap-3">
										<div className="p-3 bg-orange-50 rounded-lg">
											<dataset.icon className="w-6 h-6 text-orange-500" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												{dataset.name}
											</h3>
											<p className="text-sm text-gray-600 leading-relaxed">
												{dataset.description}
											</p>
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					<AboutProject
						title={t.home.about.title}
						videoUrl={t.home.about.videoUrl}
						features={t.home.about.features}
					/>
				</div>
			</main>
		</div>
	);
}
