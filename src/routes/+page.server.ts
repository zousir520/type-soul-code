import {
  getPricingData,
  getFAQData,
  getNavigationData,
  getHeroData,
  getFeaturesData,
  getHomeFAQData,
  getFooterData,
  getSettingsData
} from '$lib/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const [
    generalSettings,
    pricingData,
    faqData,
    navigationData,
    heroData,
    featuresData,
    homeFAQData,
    footerData
  ] = await Promise.all([
    getSettingsData('general'),
    getPricingData(),
    getFAQData(),
    getNavigationData(),
    getHeroData(),
    getFeaturesData(),
    getHomeFAQData(),
    getFooterData()
  ]);

  // Get session from locals if available
  const session = locals?.session || null;

  return {
    session,
    generalSettings,
    pricingData,
    faqData,
    navigationData,
    heroData,
    featuresData,
    homeFAQData,
    footerData
  };
};
