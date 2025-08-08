import { getPage, getNavigationData, getSettingsData } from '$lib/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const [page, generalSettings, navigationData] = await Promise.all([
    getPage('contact'),
    getSettingsData('general'),
    getNavigationData()
  ]);

  if (!page) {
    throw new Error('Contact page not found');
  }

  return {
    page,
    generalSettings,
    navigationData,
    session: locals.session
  };
};
