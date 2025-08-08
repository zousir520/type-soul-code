import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { PageServerLoad } from './$types';
import { buildSidebarTree } from '$lib/docs/buildSidebarTree.js';
import { extractToc } from '$lib/docs/parseToc.js';
import type { DocumentFrontmatter } from '$lib/docs/buildSidebarTree.js';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;
  const language = 'zh';
  
  // 处理根路径 /zh/docs/ 重定向到 README
  const filePath = slug.length === 0 ? 'README' : slug.join('/');
  const fullPath = join(process.cwd(), 'docs', language, filePath + '.md');
  
  try {
    // 读取文档文件
    const content = await readFile(fullPath, 'utf-8');
    
    let frontmatter: DocumentFrontmatter = {};
    let markdownContent = content;
    
    // 尝试解析 frontmatter
    try {
      const parsed = matter(content);
      frontmatter = parsed.data as DocumentFrontmatter;
      markdownContent = parsed.content;
    } catch {
      // 如果没有 frontmatter，使用原始内容
      markdownContent = content;
    }

    // 跳过草稿文件
    if (frontmatter.draft) {
      throw error(404, 'Document not found');
    }

    // 将 Markdown 转换为 HTML
    const htmlContent = marked(markdownContent);

    // 构建侧边栏
    const docsPath = join(process.cwd(), 'docs', language);
    const sidebarTree = await buildSidebarTree(docsPath, `/zh/docs`);

    // 提取 TOC
    const toc = await extractToc(markdownContent);

    // 构建面包屑导航
    const breadcrumbs = buildBreadcrumbs(slug, language);

    return {
      content: htmlContent,
      frontmatter,
      sidebarTree,
      toc,
      breadcrumbs,
      language,
      currentPath: `/zh/docs/${slug.join('/')}`
    };
  } catch (err) {
    console.error('Failed to load document:', err);
    throw error(404, `Document not found: ${filePath}`);
  }
};

function buildBreadcrumbs(slug: string[], language: string) {
  const breadcrumbs = [
    { title: '文档', path: '/zh/docs' }
  ];
  
  let currentPath = '/zh/docs';
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
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}