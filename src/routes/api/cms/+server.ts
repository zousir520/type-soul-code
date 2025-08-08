import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const CONTENT_DIR = 'src/content';

export const GET: RequestHandler = async ({ url }) => {
  // 检查是否在Cloudflare Workers环境中
  if (typeof process === 'undefined' || !process.cwd) {
    return json({
      error: 'CMS API is not available in Cloudflare Workers environment. Content is served from pre-compiled modules.'
    }, { status: 501 });
  }

  const path = url.searchParams.get('path');
  
  if (!path) {
    return json({ error: 'Path parameter required' }, { status: 400 });
  }

  try {
    // 动态导入文件系统模块
    const { readFile, readdir } = await import(/* @vite-ignore */ 'fs' + '/promises');
    const { join } = await import(/* @vite-ignore */ 'path');
    
    const fullPath = join(process.cwd(), CONTENT_DIR, path);
    
    // 如果是目录，返回文件列表
    if (path.endsWith('/') || !path.includes('.')) {
      const files = await readdir(fullPath);
      return json({ files });
    }
    
    // 如果是文件，返回文件内容
    const content = await readFile(fullPath, 'utf-8');
    return json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    return json({ error: 'File not found' }, { status: 404 });
  }
};

export const POST: RequestHandler = async ({ request, url }) => {
  // 检查是否在Cloudflare Workers环境中
  if (typeof process === 'undefined' || !process.cwd) {
    return json({
      error: 'CMS write operations are not available in Cloudflare Workers environment.'
    }, { status: 501 });
  }

  const path = url.searchParams.get('path');
  const { content } = await request.json();
  
  if (!path || !content) {
    return json({ error: 'Path and content required' }, { status: 400 });
  }

  try {
    // 动态导入文件系统模块
    const { writeFile } = await import(/* @vite-ignore */ 'fs' + '/promises');
    const { join } = await import(/* @vite-ignore */ 'path');
    
    const fullPath = join(process.cwd(), CONTENT_DIR, path);
    await writeFile(fullPath, content, 'utf-8');
    
    return json({
      success: true,
      message: 'Content saved successfully',
      data: {
        path,
        content,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error writing file:', error);
    return json({
      success: false,
      error: 'Failed to write file'
    }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, url }) => {
  return POST({ request, url } as Parameters<typeof POST>[0]);
};
