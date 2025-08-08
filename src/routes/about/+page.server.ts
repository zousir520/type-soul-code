import { getPage, getNavigationData, getSettingsData } from '$lib/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const [page, generalSettings, navigationData] = await Promise.all([
    getPage('about'),
    getSettingsData('general'),
    getNavigationData()
  ]);

  if (!page) {
    throw new Error('About page not found');
  }

  return {
    page,
    generalSettings,
    navigationData,
    session: locals.session
  };
};
