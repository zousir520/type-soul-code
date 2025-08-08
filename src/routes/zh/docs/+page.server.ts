import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { PageServerLoad } from './$types';

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
    const docsPath = join(process.cwd(), 'docs', 'zh');
    const sections = await buildDocsOverview(docsPath);
    
    return {
      sections,
      language: 'zh',
      currentPath: '/zh/docs'
    };
  } catch (error) {
    console.error('Failed to load docs overview:', error);
    return {
      sections: [],
      language: 'zh',
      currentPath: '/zh/docs'
    };
  }
};

async function buildDocsOverview(docsPath: string): Promise<DocSection[]> {
  const sections: DocSection[] = [];
  
  try {
    const entries = await readdir(docsPath);
    
    for (const entry of entries) {
      const entryPath = join(docsPath, entry);
      const entryStat = await stat(entryPath);
      
      // 只处理目录，跳过单独的文件
      if (entryStat.isDirectory()) {
        const section = await buildSection(entry, entryPath);
        if (section) {
          sections.push(section);
        }
      }
    }
    
    // 按文件夹名称排序
    sections.sort((a, b) => a.path.localeCompare(b.path));
    
    return sections;
  } catch (error) {
    console.error('Error building docs overview:', error);
    return [];
  }
}

async function buildSection(dirName: string, dirPath: string): Promise<DocSection | null> {
  try {
    const items: DocItem[] = [];
    const entries = await readdir(dirPath);
    
    // 处理目录下的文件
    for (const entry of entries) {
      const filePath = join(dirPath, entry);
      const fileStat = await stat(filePath);
      
      if (fileStat.isFile() && entry.endsWith('.md')) {
        const item = await buildDocItem(entry, filePath);
        if (item) {
          items.push(item);
        }
      } else if (fileStat.isDirectory()) {
        // 处理二级目录
        const subItems = await buildSubSection(entry, filePath);
        items.push(...subItems);
      }
    }
    
    // 按文件名排序
    items.sort((a, b) => a.path.localeCompare(b.path));
    
    return {
      title: formatSectionTitle(dirName),
      path: `/zh/docs/${dirName}`,
      items
    };
  } catch (error) {
    console.error(`Error building section ${dirName}:`, error);
    return null;
  }
}

async function buildSubSection(dirName: string, dirPath: string): Promise<DocItem[]> {
  const items: DocItem[] = [];
  
  try {
    const entries = await readdir(dirPath);
    
    for (const entry of entries) {
      const filePath = join(dirPath, entry);
      const fileStat = await stat(filePath);
      
      if (fileStat.isFile() && entry.endsWith('.md')) {
        const item = await buildDocItem(entry, filePath, dirName);
        if (item) {
          items.push(item);
        }
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error building sub-section ${dirName}:`, error);
    return [];
  }
}

async function buildDocItem(fileName: string, filePath: string, parentDir?: string): Promise<DocItem | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    let frontmatter: any = {};
    
    try {
      const parsed = matter(content);
      frontmatter = parsed.data;
    } catch {
      // 如果没有 frontmatter，继续处理
    }
    
    const fileNameWithoutExt = fileName.replace('.md', '');
    const title = frontmatter.title || formatTitle(fileNameWithoutExt);
    const description = frontmatter.description;
    
    // 构建路径
    let path = `/zh/docs/`;
    if (parentDir) {
      path += `${parentDir}/${fileNameWithoutExt}`;
    } else {
      path += fileNameWithoutExt;
    }
    
    return {
      title,
      path,
      description
    };
  } catch (error) {
    console.error(`Error building doc item ${fileName}:`, error);
    return null;
  }
}

function formatSectionTitle(dirName: string): string {
  return dirName
    .replace(/^\d+-/, '') // 移除前缀数字
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatTitle(fileName: string): string {
  return fileName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}