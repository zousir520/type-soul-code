import { getPage, getSettingsData } from '$lib/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const [page, generalSettings] = await Promise.all([
    getPage('contact'),
    getSettingsData('general')
  ]);
  
  if (!page) {
    throw new Error('Contact page not found');
  }

  return {
    page,
    generalSettings,
    lang: params.lang,
    session: locals.session
  };
};
