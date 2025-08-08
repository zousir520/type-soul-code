import type { PageServerLoad } from './$types';
import { getDocsTree, getSupportedLanguages } from '$lib/generated/docs.js';
import { error } from '@sveltejs/kit';

interface DocSection {
  title: string;
  path: string;
  description?: string;
  items: DocItem[];
}

interface DocItem {
  title: string;
  path: string;
  description?: string;
}

export const load: PageServerLoad = async ({ params }) => {
  try {
    const { lang } = params;
    
    const docsTree = getDocsTree(lang);
    
    // 转换预构建的文档树为页面需要的格式
    const sections: DocSection[] = docsTree.map(item => {
      if (item.isDirectory) {
        return {
          title: item.title,
          path: item.path.replace('/docs/', `/docs/${lang}/`),
          description: item.frontmatter?.description,
          items: (item.items || [])
            .filter(subItem => !subItem.isDirectory)
            .map(subItem => ({
              title: subItem.title,
              path: subItem.path.replace('/docs/', `/docs/${lang}/`),
              description: subItem.frontmatter?.description
            }))
        };
      } else {
        // 单独的文件，创建为单项section
        return {
          title: item.title,
          path: item.path.replace('/docs/', `/docs/${lang}/`),
          description: item.frontmatter?.description,
          items: []
        };
      }
    });
    
    console.log(`Built sections for ${lang} from pre-generated data:`, sections.length);
    
    // 获取所有支持的语言
    const availableLanguages = getSupportedLanguages();
    
    return {
      sections,
      language: lang,
      availableLanguages,
      currentPath: `/docs/${lang}`
    };
  } catch (err) {
    console.error('Failed to load docs overview:', err);
    throw error(500, 'Failed to load documentation');
  }
};