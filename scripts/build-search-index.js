#!/usr/bin/env node

import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const DOCS_DIR = join(ROOT_DIR, 'src/content/docs');
const STATIC_DIR = join(ROOT_DIR, 'static');

// 简化的搜索索引构建器
async function buildSearchIndex(language) {
  const langDir = join(DOCS_DIR, language);
  const searchItems = [];
  
  async function processDirectory(dir, basePath = '') {
    try {
      const entries = await readdir(dir);
      
      for (const entry of entries) {
        const entryPath = join(dir, entry);
        const stats = await stat(entryPath);
        
        if (stats.isDirectory()) {
          await processDirectory(entryPath, basePath ? `${basePath}/${entry}` : entry);
        } else if (extname(entry) === '.md') {
          try {
            const content = await readFile(entryPath, 'utf-8');
            const { data: frontmatter, content: markdownContent } = matter(content);
            
            // 跳过草稿
            if (frontmatter.draft) continue;
            
            const fileName = basename(entry, '.md');
            const relativePath = basePath ? `${basePath}/${fileName}` : fileName;
            const urlPath = language === 'en' ? `/docs/${relativePath}` : `/docs/${language}/${relativePath}`;
            
            // 提取纯文本
            const plainContent = markdownContent
              .replace(/```[\s\S]*?```/g, '')
              .replace(/`[^`]*`/g, '')
              .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
              .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
              .replace(/^#{1,6}\s+/gm, '')
              .replace(/\*{1,2}([^*]*)\*{1,2}/g, '$1')
              .replace(/_{1,2}([^_]*)_{1,2}/g, '$1')
              .replace(/^[-*+]\s+/gm, '')
              .replace(/^\d+\.\s+/gm, '')
              .replace(/^>\s+/gm, '')
              .replace(/\n{3,}/g, '\n\n')
              .trim();
            
            searchItems.push({
              id: relativePath.replace(/[^a-zA-Z0-9]/g, '_'),
              title: frontmatter.title || formatTitle(fileName),
              description: frontmatter.description,
              content: plainContent,
              path: urlPath,
              tags: frontmatter.tags || [],
              section: basePath.split('/')[0] || 'General'
            });
          } catch (error) {
            console.warn(`Failed to process ${entryPath}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to read directory ${dir}:`, error.message);
    }
  }
  
  await processDirectory(langDir);
  return searchItems;
}

function formatTitle(name) {
  return name
    .replace(/^\d+-/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

async function main() {
  console.log('🔍 Building search indexes...');
  
  const languages = ['en', 'zh'];
  
  for (const lang of languages) {
    try {
      console.log(`📚 Processing ${lang} language...`);
      const searchItems = await buildSearchIndex(lang);
      
      const outputPath = join(STATIC_DIR, `search-index-${lang}.json`);
      await writeFile(outputPath, JSON.stringify(searchItems, null, 2), 'utf-8');
      
      console.log(`✅ Built search index for ${lang}: ${searchItems.length} items`);
    } catch (error) {
      console.error(`❌ Failed to build search index for ${lang}:`, error);
    }
  }
  
  console.log('🎉 Search index build completed!');
}

main().catch(console.error);