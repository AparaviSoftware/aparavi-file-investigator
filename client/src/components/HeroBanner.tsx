import documentFilesBg from '../assets/document-files-bg.png';

export default function HeroBanner() {
	return (
		<div className="w-full px-4 sm:px-6">
			<div className="w-full h-32 sm:h-40 relative overflow-hidden rounded-t-xl sm:rounded-t-2xl">
				<img
					src={documentFilesBg}
					alt=""
					className="absolute inset-0 w-full h-full object-cover saturate-[0.3] brightness-75"
				/>
				<div className="absolute inset-0 bg-black/40"></div>
			</div>
		</div>
	);
}
