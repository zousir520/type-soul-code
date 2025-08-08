import { remark } from 'remark';
import type { Root, Heading } from 'mdast';
import { generateHeadingId } from '$lib/utils/generateHeadingId.js';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

/**
 * 从 Markdown 内容中提取 TOC
 */
export function extractToc(markdownContent: string): TocItem[] {
  const processor = remark();
  const tree = processor.parse(markdownContent) as Root;
  
  const headings: TocItem[] = [];
  
  // 遍历 AST 查找标题节点
  function visit(node: any) {
    if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
      const text = extractTextFromNode(node);
      const id = generateHeadingId(text);
      
      headings.push({
        id,
        text,
        level: node.depth,
      });
    }
    
    if (node.children) {
      node.children.forEach(visit);
    }
  }
  
  visit(tree);
  return buildTocTree(headings);
}

/**
 * 从节点中提取纯文本
 */
function extractTextFromNode(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }
  
  if (node.children) {
    return node.children.map(extractTextFromNode).join('');
  }
  
  return '';
}


/**
 * 构建层级 TOC 树
 */
function buildTocTree(flatItems: TocItem[]): TocItem[] {
  const result: TocItem[] = [];
  const stack: TocItem[] = [];
  
  for (const item of flatItems) {
    // 清理 stack，移除比当前级别深的项目
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // 顶级项目
      result.push(item);
    } else {
      // 子项目
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
    
    stack.push(item);
  }
  
  return result;
}

/**
 * 扁平化 TOC 树（用于某些场景）
 */
export function flattenToc(items: TocItem[]): TocItem[] {
  const flattened: TocItem[] = [];
  
  function traverse(items: TocItem[]) {
    for (const item of items) {
      flattened.push({
        id: item.id,
        text: item.text,
        level: item.level
      });
      
      if (item.children) {
        traverse(item.children);
      }
    }
  }
  
  traverse(items);
  return flattened;
}