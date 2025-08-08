import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const supportedLanguages = ['zh']; // 只支持中文，英文使用根路由
const defaultLanguage = 'en';

export const load: LayoutServerLoad = async ({ params, url }) => {
  const { lang } = params;

  // 如果访问 /en，重定向到根路由
  if (lang === 'en') {
    const newPath = url.pathname.replace(`/${lang}`, '') || '/';
    const searchParams = url.search;
    throw redirect(302, newPath + searchParams);
  }

  // 检查语言是否支持（现在只支持 zh）
  if (!supportedLanguages.includes(lang)) {
    throw redirect(302, url.pathname.replace(`/${lang}`, ''));
  }

  return {
    lang
  };
};
