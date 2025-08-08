import {
  getPricingData,
  getFAQData,
  getNavigationData,
  getHeroData,
  getFeaturesData,
  getHomeFAQData,
  getFooterData,
  getSettingsData
} from '$lib/content';
import type { PageServerLoad } from './$types';

/**
 * 代理页面服务器加载函数
 * 用于从 CMS 加载所有主页内容数据
 */
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

  return {
    generalSettings,
    pricingData,
    faqData,
    navigationData,
    heroData,
    featuresData,
    homeFAQData,
    footerData,
    session: locals.session
  };
};
