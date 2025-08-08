import type { PageServerLoad } from './$types';
import { getDocsTree, getSupportedLanguages } from '$lib/generated/docs.js';

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

export const load: PageServerLoad = async () => {
  try {
    // 获取所有支持的语言
    const availableLanguages = getSupportedLanguages();
    const language = availableLanguages.includes('en') ? 'en' : availableLanguages[0] || 'en';
    
    const docsTree = getDocsTree(language);
    
    // 转换预构建的文档树为页面需要的格式
    const sections: DocSection[] = docsTree.map(item => {
      if (item.isDirectory) {
        return {
          title: item.title,
          path: item.path,
          description: item.frontmatter?.description,
          items: (item.items || [])
            .filter(subItem => !subItem.isDirectory)
            .map(subItem => ({
              title: subItem.title,
              path: subItem.path,
              description: subItem.frontmatter?.description
            }))
        };
      } else {
        // 单独的文件，创建为单项section
        return {
          title: item.title,
          path: item.path,
          description: item.frontmatter?.description,
          items: []
        };
      }
    });
    
    console.log('Built sections from pre-generated data:', sections.length);
    
    return {
      sections,
      language,
      availableLanguages,
      currentPath: '/docs'
    };
  } catch (error) {
    console.error('Failed to load docs overview:', error);
    return {
      sections: [
        {
          title: 'Getting Started',
          path: '/docs/01-getting-started',
          items: [
            { title: 'Installation', path: '/docs/01-getting-started/installation' },
            { title: 'Quick Start', path: '/docs/01-getting-started/quick-start' }
          ]
        }
      ],
      language: 'en',
      availableLanguages: ['en'],
      currentPath: '/docs'
    };
  }
};