import type { LayoutServerLoad } from './$types';
import { getNavigationData, getSettingsData } from '$lib/content';

export const load: LayoutServerLoad = async () => {
	try {
		const [generalSettings, navigationData] = await Promise.all([
			getSettingsData('general'),
			getNavigationData()
		]);

		return {
			lang: 'en',
			generalSettings,
			navigationData
		};
	} catch (error) {
		console.error('Error loading layout data:', error);
		return {
			lang: 'en',
			generalSettings: null,
			navigationData: null
		};
	}
};
