#!/usr/bin/env node

/**
 * 自动替换硬编码颜色为CSS变量的脚本
 * 使用方法: node scripts/fix-theme-colors.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 颜色替换映射
const colorMappings = [
  // 背景颜色
  { from: /bg-black(?![a-zA-Z-])/g, to: 'theme-bg-page' },
  { from: /bg-white(?![a-zA-Z-])/g, to: 'theme-bg-card' },
  { from: /bg-gray-900/g, to: 'theme-bg-muted' },
  { from: /bg-gray-100/g, to: 'theme-bg-muted' },
  
  // 文本颜色
  { from: /text-white(?![a-zA-Z-])/g, to: 'theme-text-primary' },
  { from: /text-black(?![a-zA-Z-])/g, to: 'theme-text-primary' },
  { from: /text-gray-300/g, to: 'theme-text-muted' },
  { from: /text-gray-600/g, to: 'theme-text-muted' },
  
  // 边框颜色
  { from: /border-white\/\d+/g, to: 'theme-border' },
  { from: /border-gray-200/g, to: 'theme-border' },
  { from: /border-gray-700/g, to: 'theme-border' },
];

// 内联样式替换映射
const inlineStyleMappings = [
  { from: /background-color:\s*#000000/g, to: 'background-color: hsl(var(--background))' },
  { from: /background-color:\s*#ffffff/g, to: 'background-color: hsl(var(--card))' },
  { from: /color:\s*#ffffff/g, to: 'color: hsl(var(--foreground))' },
  { from: /color:\s*#000000/g, to: 'color: hsl(var(--foreground))' },
  { from: /background-color:\s*black/g, to: 'background-color: hsl(var(--background))' },
  { from: /background-color:\s*white/g, to: 'background-color: hsl(var(--card))' },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 应用类名替换
    colorMappings.forEach(mapping => {
      if (mapping.from.test(content)) {
        content = content.replace(mapping.from, mapping.to);
        modified = true;
      }
    });
    
    // 应用内联样式替换
    inlineStyleMappings.forEach(mapping => {
      if (mapping.from.test(content)) {
        content = content.replace(mapping.from, mapping.to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已更新: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDirectory(filePath, callback);
    } else if (file.endsWith('.svelte')) {
      callback(filePath);
    }
  });
}

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const componentsDir = path.join(projectRoot, 'src', 'lib', 'components');
  const routesDir = path.join(projectRoot, 'src', 'routes');
  
  console.log('🎨 开始自动修复主题颜色...\n');
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  // 处理 components 目录
  console.log('📁 处理 components 目录...');
  walkDirectory(componentsDir, (filePath) => {
    totalFiles++;
    if (processFile(filePath)) {
      modifiedFiles++;
    }
  });
  
  // 处理 routes 目录
  console.log('\n📁 处理 routes 目录...');
  walkDirectory(routesDir, (filePath) => {
    totalFiles++;
    if (processFile(filePath)) {
      modifiedFiles++;
    }
  });
  
  console.log(`\n🎉 完成！总共检查了 ${totalFiles} 个文件，修改了 ${modifiedFiles} 个文件。`);
  
  if (modifiedFiles > 0) {
    console.log('\n📝 建议事项:');
    console.log('1. 检查修改的文件确保样式正确');
    console.log('2. 运行项目测试修改效果');
    console.log('3. 可能需要手动调整某些复杂的样式');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}