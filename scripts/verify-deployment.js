#!/usr/bin/env node

/**
 * 部署验证脚本
 * 验证内容预编译和博客功能是否正常工作
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 开始验证部署配置...\n');

// 1. 检查内容预编译文件是否存在
const contentFile = join(projectRoot, 'src/lib/generated/content.ts');
if (existsSync(contentFile)) {
    console.log('✅ 内容预编译文件存在:', contentFile);
    
    try {
        const content = readFileSync(contentFile, 'utf-8');
        const lines = content.split('\n').length;
        console.log(`   - 文件大小: ${Math.round(content.length / 1024)}KB`);
        console.log(`   - 行数: ${lines}`);
        
        // 检查是否包含博客内容
        if (content.includes('getAllBlogPosts') && content.includes('getBlogPostBySlug')) {
            console.log('✅ 博客内容函数已导出');
        } else {
            console.log('❌ 博客内容函数未找到');
        }
        
        if (content.includes('building-modern-web-apps')) {
            console.log('✅ 示例博客文章已预编译');
        } else {
            console.log('❌ 示例博客文章未找到');
        }
    } catch (error) {
        console.log('❌ 读取内容文件时出错:', error.message);
    }
} else {
    console.log('❌ 内容预编译文件不存在:', contentFile);
}

// 2. 检查 Vercel 配置
const vercelConfig = join(projectRoot, 'vercel.json');
if (existsSync(vercelConfig)) {
    console.log('\n✅ Vercel 配置文件存在');
    try {
        const config = JSON.parse(readFileSync(vercelConfig, 'utf-8'));
        if (config.buildCommand && config.buildCommand.includes('build:content')) {
            console.log('✅ Vercel 构建命令包含内容预编译');
        } else {
            console.log('❌ Vercel 构建命令未包含内容预编译');
        }
    } catch (error) {
        console.log('❌ 读取 Vercel 配置时出错:', error.message);
    }
} else {
    console.log('\n❌ Vercel 配置文件不存在');
}

// 3. 检查 SvelteKit 配置
const svelteConfig = join(projectRoot, 'svelte.config.js');
if (existsSync(svelteConfig)) {
    console.log('\n✅ SvelteKit 配置文件存在');
    try {
        const config = readFileSync(svelteConfig, 'utf-8');
        if (config.includes('includeFiles') && config.includes('src/lib/generated')) {
            console.log('✅ SvelteKit 配置包含生成文件');
        } else {
            console.log('❌ SvelteKit 配置未包含生成文件');
        }
    } catch (error) {
        console.log('❌ 读取 SvelteKit 配置时出错:', error.message);
    }
} else {
    console.log('\n❌ SvelteKit 配置文件不存在');
}

// 4. 检查构建输出
const buildOutput = join(projectRoot, '.svelte-kit/output');
if (existsSync(buildOutput)) {
    console.log('\n✅ 构建输出目录存在');
    
    const serverOutput = join(buildOutput, 'server/index.js');
    if (existsSync(serverOutput)) {
        console.log('✅ 服务器端构建完成');
    } else {
        console.log('❌ 服务器端构建未完成');
    }
    
    const clientOutput = join(buildOutput, 'client');
    if (existsSync(clientOutput)) {
        console.log('✅ 客户端构建完成');
    } else {
        console.log('❌ 客户端构建未完成');
    }
} else {
    console.log('\n❌ 构建输出目录不存在 - 请先运行 npm run build');
}

// 5. 检查 Supabase 配置
const supabaseClient = join(projectRoot, 'src/lib/supabase.ts');
const supabaseServer = join(projectRoot, 'src/lib/supabase.server.ts');

if (existsSync(supabaseClient)) {
    console.log('\n✅ Supabase 客户端配置存在');
} else {
    console.log('\n❌ Supabase 客户端配置不存在');
}

if (existsSync(supabaseServer)) {
    console.log('✅ Supabase 服务器端配置存在');
} else {
    console.log('❌ Supabase 服务器端配置不存在');
}

console.log('\n🎯 验证完成！');
console.log('\n📝 建议的测试步骤:');
console.log('1. 访问 http://localhost:4173/blog');
console.log('2. 点击任意博客文章链接');
console.log('3. 确认文章内容正常显示');
console.log('4. 检查浏览器控制台是否有错误');
