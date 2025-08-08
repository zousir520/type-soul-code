import {
  getPricingData,
  getFAQData,
  getNavigationData,
  getHeroData,
  getFeaturesData,
  getHomeFAQData,
  getFooterData,
  getSettingsData,
  getGameConfigData
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
    footerData,
    gameConfig
  ] = await Promise.all([
    getSettingsData('general'),
    getPricingData(),
    getFAQData(),
    getNavigationData(),
    getHeroData(),
    getFeaturesData(),
    getHomeFAQData(),
    getFooterData(),
    getGameConfigData()
  ]);

  // 强制设置为 site-blog 模式
  const siteConfig = {
    type: 'site-blog',
    title: 'tenniszero.org',
    description: 'AI SAAS boilerplate for Non-Programmers'
  };

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
    footerData,
    siteConfig,
    gameConfig,
    previewMode: 'site-blog'
  };
};
