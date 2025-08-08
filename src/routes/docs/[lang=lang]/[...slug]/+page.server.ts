import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDocByPath, getDocsTree } from '$lib/generated/docs.js';
import { marked } from 'marked';
import { extractToc } from '$lib/docs/parseToc.js';

export const load: PageServerLoad = async ({ params }) => {
  const { slug, lang } = params;
  
  // 确保 slug 是数组格式
  const slugArray = Array.isArray(slug) ? slug : slug.split('/').filter(Boolean);
  
  // 处理根路径 /docs/[lang]/ 重定向到 README
  let filePath = slugArray.length === 0 ? 'README' : slugArray.join('/');
  
  // 检查路径是否已经包含 .md 扩展名，如果有则移除
  if (filePath.endsWith('.md')) {
    filePath = filePath.slice(0, -3);
  }
  
  const docPath = `/docs/${filePath}`;
  
  try {
    // 从预构建的数据中获取文档
    const doc = getDocByPath(docPath, lang);
    
    if (!doc) {
      throw error(404, `Document not found: ${filePath}`);
    }
    
    let content: string;
    let frontmatter: any = {};
    
    if (doc.isDirectory) {
      // 生成目录列表页面
      const items = doc.items || [];
      const directoryTitle = formatBreadcrumbTitle(filePath.split('/').pop() || 'Documentation');
      
      const filesList = items.map(item => {
        const title = item.title;
        const path = item.path.replace('/docs/', `/docs/${lang}/`);
        return `- [${title}](${path})`;
      }).join('\n');
      
      content = `# ${directoryTitle}

This directory contains the following documentation:

${filesList}

Navigate through the links above to access specific documentation sections.`;
      
      frontmatter = {
        title: directoryTitle,
        description: `${directoryTitle} documentation section`
      };
    } else {
      // 常规文档页面
      content = doc.content || '';
      frontmatter = doc.frontmatter || {};
      
      // 跳过草稿文件
      if (frontmatter.draft) {
        throw error(404, 'Document not found');
      }
    }
    
    // 简化的 marked 配置
    marked.setOptions({
      gfm: true,
      breaks: false
    });
    
    // 将 Markdown 转换为 HTML（先不加ID，让TOC解析原始markdown）
    const htmlContent = marked(content);
    
    // 获取侧边栏树并添加语言前缀
    const sidebarTree = addLanguagePrefixToTree(getDocsTree(lang), lang);
    
    // 生成目录
    const toc = extractToc(content);
    
    // 构建面包屑导航
    const breadcrumbs = buildBreadcrumbs(slugArray, lang);
    
    return {
      content: htmlContent,
      frontmatter,
      sidebarTree,
      toc,
      breadcrumbs,
      language: lang,
      currentPath: `/docs/${lang}/${filePath}`
    };
  } catch (err) {
    console.error('Failed to load document:', err);
    throw error(404, `Document not found: ${filePath}`);
  }
};

function buildBreadcrumbs(slug: string[], lang: string) {
  const breadcrumbs = [
    { title: 'Documentation', path: `/docs/${lang}` }
  ];
  
  let currentPath = `/docs/${lang}`;
  for (let i = 0; i < slug.length; i++) {
    currentPath += '/' + slug[i];
    breadcrumbs.push({
      title: formatBreadcrumbTitle(slug[i]),
      path: currentPath
    });
  }
  
  return breadcrumbs;
}

function formatBreadcrumbTitle(segment: string): string {
  return segment
    .replace(/^\\d+-/, '') // 移除数字前缀
    .replace(/[-_]/g, ' ')
    .replace(/\\b\\w/g, (char) => char.toUpperCase());
}

function addLanguagePrefixToTree(items: any[], lang: string): any[] {
  return items.map(item => ({
    ...item,
    path: item.path.replace('/docs/', `/docs/${lang}/`),
    children: item.children ? addLanguagePrefixToTree(item.children, lang) : undefined
  }));
}