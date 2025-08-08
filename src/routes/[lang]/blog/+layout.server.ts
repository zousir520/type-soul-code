import type { LayoutServerLoad } from './$types';
import { getNavigationData, getSettingsData } from '$lib/content';

export const load: LayoutServerLoad = async ({ params }) => {
	const lang = params.lang || 'en';

	try {
		const [generalSettings, navigationData] = await Promise.all([
			getSettingsData('general'),
			getNavigationData()
		]);

		return {
			lang,
			generalSettings,
			navigationData
		};
	} catch (error) {
		console.error('Error loading layout data:', error);
		return {
			lang,
			generalSettings: null,
			navigationData: null
		};
	}
};
