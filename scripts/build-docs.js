#!/usr/bin/env node

import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const DOCS_DIR = join(ROOT_DIR, 'src/content/docs');
const OUTPUT_DIR = join(ROOT_DIR, 'src/lib/generated');

/**
 * 递归读取目录中的所有文件和目录信息
 */
async function getAllDocsItems(dir, basePath = '') {
	const items = [];
	const dirFiles = await readdir(dir, { withFileTypes: true });
	
	for (const file of dirFiles) {
		const fullPath = join(dir, file.name);
		const relativePath = basePath ? `${basePath}/${file.name}` : file.name;
		
		if (file.isDirectory()) {
			// 递归处理子目录
			const subItems = await getAllDocsItems(fullPath, relativePath);
			items.push({
				type: 'directory',
				name: file.name,
				path: relativePath,
				items: subItems
			});
		} else if (file.name.endsWith('.md')) {
			// 处理 Markdown 文件
			const content = await readFile(fullPath, 'utf-8');
			const { data, content: markdownContent } = matter(content);
			
			items.push({
				type: 'file',
				name: file.name,
				path: relativePath,
				slug: basename(file.name, '.md'),
				frontmatter: data,
				content: markdownContent
			});
		}
	}
	
	return items;
}

/**
 * 构建文档树结构
 */
function buildDocsTree(items) {
	return items.map(item => {
		if (item.type === 'directory') {
			return {
				title: formatTitle(item.name),
				path: `/docs/${item.path}`,
				isDirectory: true,
				items: buildDocsTree(item.items)
			};
		} else {
			return {
				title: item.frontmatter.title || formatTitle(item.slug),
				path: `/docs/${item.path.replace('.md', '')}`,
				isDirectory: false,
				frontmatter: item.frontmatter,
				content: item.content
			};
		}
	});
}

/**
 * 格式化标题
 */
function formatTitle(name) {
	return name
		.replace(/^\d+-/, '') // 移除数字前缀
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * 扁平化文档树为路径映射
 */
function flattenDocsTree(tree, pathMap = {}) {
	for (const item of tree) {
		if (item.isDirectory) {
			// 为目录创建一个索引页
			pathMap[item.path] = {
				title: item.title,
				path: item.path,
				isDirectory: true,
				items: item.items.filter(subItem => !subItem.isDirectory)
			};
			
			// 递归处理子项
			flattenDocsTree(item.items, pathMap);
		} else {
			// 文件项
			pathMap[item.path] = {
				title: item.title,
				path: item.path,
				isDirectory: false,
				frontmatter: item.frontmatter,
				content: item.content
			};
		}
	}
	
	return pathMap;
}

/**
 * 获取所有存在的语言目录
 */
async function getAvailableLanguages() {
	try {
		const dirFiles = await readdir(DOCS_DIR, { withFileTypes: true });
		const languages = [];
		
		for (const file of dirFiles) {
			if (file.isDirectory()) {
				const langDir = join(DOCS_DIR, file.name);
				try {
					// 检查目录是否包含文档文件
					const langFiles = await readdir(langDir);
					if (langFiles.length > 0) {
						languages.push(file.name);
					}
				} catch (error) {
					// 忽略无法访问的目录
				}
			}
		}
		
		return languages;
	} catch (error) {
		console.log('⚠️  文档目录不存在，返回空语言列表');
		return [];
	}
}

/**
 * 主构建函数
 */
async function buildDocs() {
	console.log('🔄 开始构建文档...');
	
	// 确保输出目录存在
	await mkdir(OUTPUT_DIR, { recursive: true });
	
	// 动态检测可用的语言
	const languages = await getAvailableLanguages();
	console.log(`🌍 检测到可用语言: ${languages.join(', ')}`);
	
	const allDocs = {};
	
	for (const lang of languages) {
		const langDir = join(DOCS_DIR, lang);
		
		try {
			console.log(`📚 处理 ${lang} 语言文档...`);
			
			const items = await getAllDocsItems(langDir);
			const tree = buildDocsTree(items);
			const pathMap = flattenDocsTree(tree);
			
			allDocs[lang] = {
				tree,
				pathMap
			};
			
			console.log(`✅ ${lang} 语言文档处理完成，共 ${Object.keys(pathMap).length} 个页面`);
		} catch (error) {
			console.log(`⚠️  ${lang} 语言文档处理失败: ${error.message}`);
		}
	}
	
	// 生成类型定义
	const typeDefinitions = `
export interface DocItem {
	title: string;
	path: string;
	isDirectory: boolean;
	frontmatter?: {
		title?: string;
		description?: string;
		[key: string]: any;
	};
	content?: string;
	items?: DocItem[];
}

export interface DocsData {
	[language: string]: {
		tree: DocItem[];
		pathMap: { [path: string]: DocItem };
	};
}
`;

	// 生成文档数据导出
	const docsDataExport = `export const DOCS_DATA: DocsData = ${JSON.stringify(allDocs, null, 2)};`;
	
	// 生成辅助函数
	const helperFunctions = `
/**
 * 获取指定语言的文档树
 */
export function getDocsTree(language = 'en'): DocItem[] {
	return DOCS_DATA[language]?.tree || [];
}

/**
 * 根据路径获取文档内容
 */
export function getDocByPath(path: string, language = 'en'): DocItem | null {
	return DOCS_DATA[language]?.pathMap[path] || null;
}

/**
 * 获取所有支持的语言
 */
export function getSupportedLanguages(): string[] {
	return Object.keys(DOCS_DATA);
}

/**
 * 搜索文档
 */
export function searchDocs(query: string, language = 'en'): DocItem[] {
	const pathMap = DOCS_DATA[language]?.pathMap || {};
	const results: DocItem[] = [];
	
	for (const doc of Object.values(pathMap)) {
		if (doc.isDirectory) continue;
		
		const title = doc.title.toLowerCase();
		const content = doc.content?.toLowerCase() || '';
		const searchQuery = query.toLowerCase();
		
		if (title.includes(searchQuery) || content.includes(searchQuery)) {
			results.push(doc);
		}
	}
	
	return results;
}
`;

	// 生成完整的输出文件
	const output = [
		'// 自动生成的文件，请勿手动编辑',
		'// Generated by scripts/build-docs.js',
		'',
		typeDefinitions,
		docsDataExport,
		'',
		helperFunctions
	].join('\n');
	
	// 写入文件
	const outputPath = join(OUTPUT_DIR, 'docs.ts');
	await writeFile(outputPath, output, 'utf-8');
	
	console.log(`✅ 文档构建完成！`);
	console.log(`📁 输出文件: ${outputPath}`);
	console.log(`🌍 支持语言: ${Object.keys(allDocs).join(', ')}`);
}

// 运行构建
buildDocs().catch(console.error);