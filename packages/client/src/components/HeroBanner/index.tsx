import documentFilesBg from '../../assets/document-files-bg.png';
import jfkBanner from '../../assets/jfk-banner.png';
import ufoBanner from '../../assets/ufo-banner.png';
import epsteinBanner from '../../assets/epstein-banner.png';

type HeroBannerProps = {
	datasetId?: string;
}

const datasetBanners: Record<string, string> = {
	jfk: jfkBanner,
	ufo: ufoBanner,
	epstein: epsteinBanner
};

/**
 * HeroBanner component displays a banner image based on the dataset
 *
 * @param {string} datasetId - The ID of the dataset to display the banner for
 * @return {JSX.Element} The banner component
 *
 * @example
 *     <HeroBanner datasetId="jfk" />
 */
export default function HeroBanner({ datasetId }: HeroBannerProps) {
	const bannerImage = datasetId && datasetBanners[datasetId] ? datasetBanners[datasetId] : documentFilesBg;

	return (
		<div className="w-full px-4 sm:px-6">
			<div className="w-full h-32 sm:h-40 relative overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gray-800">
				<img
					src={bannerImage}
					alt=""
					className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
				/>
			</div>
		</div>
	);
}
