interface TitleSectionProps {
	title: string;
	subtitle: string;
}

export default function TitleSection({ title, subtitle }: TitleSectionProps) {
	return (
		<div className="text-center mb-12">
			<h1 className="text-5xl font-bold text-gray-900 mb-4">
				{title}
			</h1>
			<p className="text-gray-500 text-lg">
				{subtitle}
			</p>
		</div>
	);
}
