import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  // 重定向到新的 sitemap 索引
  throw redirect(301, '/sitemap-index.xml');
};