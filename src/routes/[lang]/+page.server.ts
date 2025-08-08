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

export const load: PageServerLoad = async ({ params, locals }) => {
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

  // Create homepageContent from existing data
  const homepageContent = {
    hero: heroData ? {
      badge: heroData.badge,
      title: heroData.title,
      subtitle: heroData.subtitle,
      description: heroData.description,
      primaryButton: {
        text: heroData.primaryButton.text,
        url: heroData.primaryButton.href
      },
      secondaryButton: {
        text: heroData.secondaryButton.text,
        url: heroData.secondaryButton.href
      },
      stats: heroData.stats || []
    } : {
      badge: { en: '', zh: '' },
      title: { en: '', zh: '' },
      subtitle: { en: '', zh: '' },
      description: { en: '', zh: '' },
      primaryButton: { text: { en: '', zh: '' }, url: '' },
      secondaryButton: { text: { en: '', zh: '' }, url: '' },
      stats: []
    },
    features: featuresData ? {
      badge: featuresData.badge || { en: '', zh: '' },
      title: featuresData.sectionTitle,
      description: featuresData.sectionSubtitle
    } : {
      badge: { en: '', zh: '' },
      title: { en: '', zh: '' },
      description: { en: '', zh: '' }
    }
  };

  return {
    session,
    generalSettings,
    pricingData,
    faqData,
    navigationData,
    heroData,
    featuresData,
    homeFAQData,
    footerData,
    homepageContent,
    lang: params.lang
  };
};
