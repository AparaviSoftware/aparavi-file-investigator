interface TitleSectionProps {
	title: string;
	subtitle: string;
}

export default function TitleSection({ title, subtitle }: TitleSectionProps) {
	return (
		<div className="text-center mb-8 sm:mb-12">
			<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
				{title}
			</h1>
			<p className="text-gray-500 text-base sm:text-lg px-4">
				{subtitle}
			</p>
		</div>
	);
}
