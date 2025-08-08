import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { SidebarItem, DocumentFrontmatter } from './buildSidebarTree.js';
import { flattenSidebarTree } from './buildSidebarTree.js';

export interface SearchIndexItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  path: string;
  tags?: string[];
  section?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  path: string;
}

/**
 * 构建搜索索引
 */
export async function buildSearchIndex(
  docsPath: string,
  sidebarItems: SidebarItem[],
  language: string = 'en'
): Promise<SearchIndexItem[]> {
  const flatItems = flattenSidebarTree(sidebarItems);
  const searchItems: SearchIndexItem[] = [];

  for (const item of flatItems) {
    try {
      const filePath = getFilePathFromSidebarItem(docsPath, item, language);
      const content = await readFile(filePath, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content) as {
        data: DocumentFrontmatter;
        content: string;
      };

      // 跳过草稿
      if (frontmatter.draft) continue;

      // 提取纯文本内容（移除 Markdown 语法）
      const plainContent = extractPlainText(markdownContent);

      searchItems.push({
        id: generateSearchId(item.path),
        title: frontmatter.title || item.title,
        description: frontmatter.description,
        content: plainContent,
        path: item.path,
        tags: frontmatter.tags,
        section: extractSection(item.path)
      });
    } catch (error) {
      console.warn(`Failed to index ${item.path}:`, error);
    }
  }

  return searchItems;
}

/**
 * 根据侧边栏项获取文件路径
 */
function getFilePathFromSidebarItem(
  docsPath: string, 
  item: SidebarItem, 
  language: string
): string {
  // 从路径中移除基础路径前缀，获取相对路径
  const relativePath = item.path
    .replace(`/docs/${language}`, '')
    .replace(`/zh/docs`, '')
    .replace(`/docs`, '')
    .replace(/^\//, '');
  
  return join(docsPath, language, relativePath + '.md');
}

/**
 * 提取纯文本内容
 */
function extractPlainText(markdownContent: string): string {
  return markdownContent
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // 移除链接，保留文本
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除图片
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除粗体和斜体标记
    .replace(/\*{1,2}([^*]*)\*{1,2}/g, '$1')
    .replace(/_{1,2}([^_]*)_{1,2}/g, '$1')
    // 移除其他 Markdown 语法
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    // 清理多余的空白
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * 生成搜索项 ID
 */
function generateSearchId(path: string): string {
  return path.replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * 从路径中提取章节名称
 */
function extractSection(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 3) {
    return parts[2]; // 假设路径格式为 /docs/section/ 或 /zh/docs/section/
  }
  return 'General';
}

/**
 * 保存搜索索引到静态文件
 */
export async function saveSearchIndex(
  searchItems: SearchIndexItem[],
  outputPath: string
): Promise<void> {
  const { writeFile } = await import('fs/promises');
  await writeFile(outputPath, JSON.stringify(searchItems, null, 2), 'utf-8');
}

/**
 * 构建并保存所有语言的搜索索引
 */
export async function buildAllSearchIndexes(
  docsPath: string,
  staticPath: string,
  languages: string[] = ['en', 'zh']
): Promise<void> {
  const { buildSidebarTree } = await import('./buildSidebarTree.js');

  for (const lang of languages) {
    try {
      const langDocsPath = join(docsPath, lang);
      const basePath = lang === 'en' ? '/docs' : `/zh/docs`;
      const sidebarItems = await buildSidebarTree(langDocsPath, basePath);
      const searchItems = await buildSearchIndex(docsPath, sidebarItems, lang);
      
      const outputPath = join(staticPath, `search-index-${lang}.json`);
      await saveSearchIndex(searchItems, outputPath);
      
      console.log(`✅ Built search index for ${lang}: ${searchItems.length} items`);
    } catch (error) {
      console.error(`❌ Failed to build search index for ${lang}:`, error);
    }
  }
}