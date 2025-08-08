import { getPage, getSettingsData } from '$lib/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const [page, generalSettings] = await Promise.all([
    getPage('about'),
    getSettingsData('general')
  ]);
  
  if (!page) {
    throw new Error('About page not found');
  }

  // Get session from locals if available
  const session = locals?.session || null;

  return {
    session,
    page,
    generalSettings,
    lang: params.lang
  };
};
