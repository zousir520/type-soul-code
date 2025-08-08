import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import matter from 'gray-matter';

export interface SidebarItem {
  title: string;
  path: string;
  order: number;
  children?: SidebarItem[];
  isDirectory: boolean;
}

export interface DocumentFrontmatter {
  title?: string;
  description?: string;
  sidebar_order?: number;
  tags?: string[];
  draft?: boolean;
}

/**
 * 递归构建侧边栏树结构
 * @param docsPath 文档根目录路径
 * @param basePath 基础路径前缀 (如 '/documentation/en')
 * @param relativePath 当前相对路径
 */
export async function buildSidebarTree(
  docsPath: string,
  basePath: string = '',
  relativePath: string = ''
): Promise<SidebarItem[]> {
  const currentPath = join(docsPath, relativePath);
  
  try {
    const entries = await readdir(currentPath);
    const items: SidebarItem[] = [];

    for (const entry of entries) {
      const entryPath = join(currentPath, entry);
      const stats = await stat(entryPath);
      const entryRelativePath = relativePath ? join(relativePath, entry) : entry;

      if (stats.isDirectory()) {
        // 处理目录
        const children = await buildSidebarTree(docsPath, basePath, entryRelativePath);
        
        if (children.length > 0) {
          items.push({
            title: formatTitle(entry),
            path: `${basePath}/${entryRelativePath}`,
            order: 999, // 目录默认排序靠后
            children,
            isDirectory: true
          });
        }
      } else if (extname(entry) === '.md') {
        // 处理 Markdown 文件
        try {
          const content = await readFile(entryPath, 'utf-8');
          let frontmatter: DocumentFrontmatter = {};
          
          // 尝试解析 frontmatter，如果没有则使用默认值
          try {
            const parsed = matter(content);
            frontmatter = parsed.data as DocumentFrontmatter;
          } catch {
            // 如果没有 frontmatter，从文件名推断
            frontmatter = {};
          }

          // 跳过草稿文件
          if (frontmatter.draft) continue;

          const fileName = basename(entry, '.md');
          const title = frontmatter.title || formatTitle(fileName);
          const order = frontmatter.sidebar_order || getDefaultOrder(fileName);

          items.push({
            title,
            path: `${basePath}/${entryRelativePath.replace('.md', '')}`,
            order,
            isDirectory: false
          });
        } catch (error) {
          console.warn(`Failed to parse frontmatter for ${entryPath}:`, error);
          
          // 即使解析失败也添加基本信息
          const fileName = basename(entry, '.md');
          items.push({
            title: formatTitle(fileName),
            path: `${basePath}/${entryRelativePath.replace('.md', '')}`,
            order: 999,
            isDirectory: false
          });
        }
      }
    }

    // 排序：按 order 升序，然后按标题排序
    return items.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });

  } catch (error) {
    console.error(`Failed to build sidebar tree for ${currentPath}:`, error);
    return [];
  }
}

/**
 * 格式化文件/目录名为标题
 */
function formatTitle(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

/**
 * 根据文件名获取默认排序
 */
function getDefaultOrder(fileName: string): number {
  // README 文件排在最前面
  if (fileName.toLowerCase() === 'readme') return 1;
  
  // 根据目录前缀排序
  const match = fileName.match(/^(\d+)-/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // 其他文件按字母顺序排在后面
  return 999;
}

/**
 * 扁平化侧边栏树，用于搜索
 */
export function flattenSidebarTree(items: SidebarItem[]): SidebarItem[] {
  const flattened: SidebarItem[] = [];

  function traverse(items: SidebarItem[]) {
    for (const item of items) {
      if (!item.isDirectory) {
        flattened.push(item);
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  }

  traverse(items);
  return flattened;
}

/**
 * 根据路径查找侧边栏项
 */
export function findSidebarItem(items: SidebarItem[], path: string): SidebarItem | null {
  for (const item of items) {
    if (item.path === path) {
      return item;
    }
    if (item.children) {
      const found = findSidebarItem(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 获取前一个和后一个文档
 */
export function getAdjacentDocs(
  items: SidebarItem[], 
  currentPath: string
): { prev: SidebarItem | null; next: SidebarItem | null } {
  const flattened = flattenSidebarTree(items);
  const currentIndex = flattened.findIndex(item => item.path === currentPath);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? flattened[currentIndex - 1] : null,
    next: currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null
  };
}