import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDocByPath, getDocsTree } from '$lib/generated/docs.ts';
import { marked } from 'marked';
import { extractToc } from '$lib/docs/parseToc.ts';
import { generateHeadingId } from '$lib/utils/generateHeadingId.ts';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;
  const language = 'en'; // 默认英文
  
  // 确保 slug 是数组格式
  const slugArray = Array.isArray(slug) ? slug : slug.split('/').filter(Boolean);
  
  // 处理根路径 /docs/ 重定向到 README
  let filePath = slugArray.length === 0 ? 'README' : slugArray.join('/');
  
  // 检查路径是否已经包含 .md 扩展名，如果有则移除
  if (filePath.endsWith('.md')) {
    filePath = filePath.slice(0, -3);
  }
  
  const docPath = `/docs/${filePath}`;
  
  try {
    // 从预构建的数据中获取文档
    const doc = getDocByPath(docPath, language);
    
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
        const path = item.path;
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
    
    // 使用简单的方法：先渲染HTML，然后添加ID
    marked.setOptions({
      gfm: true,
      breaks: false
    });
    
    // 将 Markdown 转换为 HTML
    let htmlContent = marked(content);
    
    // 后处理：为标题添加ID（处理包含HTML标签的标题）
    htmlContent = htmlContent.replace(
      /<h([2-3])>(.*?)<\/h([2-3])>/g, 
      (match, level, htmlContent, closeLevel) => {
        // 移除HTML标签以生成纯文本ID
        const text = htmlContent.replace(/<[^>]*>/g, '');
        const id = generateHeadingId(text);
        
        return `<h${level} id="${id}">${htmlContent}</h${closeLevel}>`;
      }
    );
    
    // 获取侧边栏树
    const sidebarTree = getDocsTree(language);
    
    // 生成目录
    const toc = extractToc(content);
    
    // 调试特定页面
    if (docPath.includes('installation')) {
      console.log('🐛 Debug installation page:');
      console.log('📄 Content preview:', content.substring(0, 500));
      console.log('📋 Generated TOC:', toc);
      console.log('🏷️ HTML headings:', htmlContent.match(/<h[2-3][^>]*>/g)?.slice(0, 5));
    }
    
    
    
    // 构建面包屑导航
    const breadcrumbs = buildBreadcrumbs(slugArray);
    
    return {
      content: htmlContent,
      frontmatter,
      sidebarTree,
      toc,
      breadcrumbs,
      language,
      currentPath: docPath
    };
  } catch (err) {
    console.error('Failed to load document:', err);
    throw error(404, `Document not found: ${filePath}`);
  }
};

function buildBreadcrumbs(slug: string[]) {
  const breadcrumbs = [
    { title: 'Documentation', path: '/docs' }
  ];
  
  let currentPath = '/docs';
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
    .replace(/^\d+-/, '') // 移除数字前缀
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}