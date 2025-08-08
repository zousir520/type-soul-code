import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // 检查是否在Cloudflare Workers环境中
    if (typeof process === 'undefined' || !process.cwd) {
      return json({
        success: false,
        message: 'This API is not available in Cloudflare Workers environment. Please use environment variables instead.'
      }, { status: 501 });
    }

    const { source, github } = await request.json();
    
    if (!source) {
      return json({
        success: false,
        message: 'Content source is required'
      }, { status: 400 });
    }

    // 动态导入文件系统模块
    const { writeFile } = await import(/* @vite-ignore */ 'fs' + '/promises');
    const { join } = await import(/* @vite-ignore */ 'path');
    
    // Create environment variables content
    const envContent = [
      '# Content Source Configuration',
      `CONTENT_SOURCE=${source}`,
      `USE_GITHUB_CONTENT=${source !== 'local-only'}`,
      '',
      '# GitHub repository settings',
      `GITHUB_OWNER=${github.owner || 'gstarwd'}`,
      `GITHUB_REPO=${github.repo || 'sveltia_cms_git'}`,
      `GITHUB_BRANCH=${github.branch || 'main'}`,
      'GITHUB_CONTENT_PATH=src/content/blog',
      '',
      '# GitHub Personal Access Token (optional, for private repos)',
      github.token ? `GITHUB_TOKEN=${github.token}` : '# GITHUB_TOKEN=your_github_token_here',
      '',
      '# Content caching settings',
      'CONTENT_CACHE_DURATION=300000',
      'CONTENT_CACHE_ENABLED=true'
    ].join('\n');
    
    // Write to .env file
    const envPath = join(process.cwd(), '.env');
    await writeFile(envPath, envContent, 'utf8');
    
    // Also update Sveltia CMS config if using GitHub
    if (source !== 'local-only' && github.owner && github.repo) {
      const cmsConfigPath = join(process.cwd(), 'static', 'admin', 'config.yml');
      const cmsConfig = [
        'backend:',
        '  name: github',
        `  repo: ${github.owner}/${github.repo}`,
        `  branch: ${github.branch || 'main'}`,
        '',
        '# 本地开发模式 - 在本地开发时启用，生产环境时注释掉',
        '# local_backend: true',
        '',
        'media_folder: static/uploads',
        'public_folder: /uploads',
        '',
        'collections:',
        '  - name: "blog"',
        '    label: "Blog Posts"',
        '    folder: "src/content/blog"',
        '    create: true',
        '    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"',
        '    fields:',
        '      - { label: "Title", name: "title", widget: "string" }',
        '      - { label: "Description", name: "description", widget: "text" }',
        '      - { label: "Author", name: "author", widget: "string" }',
        '      - { label: "Date", name: "date", widget: "datetime" }',
        '      - { label: "Tags", name: "tags", widget: "list", default: [] }',
        '      - { label: "Featured Image", name: "image", widget: "image", required: false }',
        '      - { label: "Body", name: "body", widget: "markdown" }'
      ].join('\n');
      
      await writeFile(cmsConfigPath, cmsConfig, 'utf8');
    }
    
    return json({
      success: true,
      message: 'Configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating content source:', error);
    return json({
      success: false,
      message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
};
