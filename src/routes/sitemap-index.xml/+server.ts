import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  // 优先使用环境变量，然后使用请求的 origin
  const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
  const lastmod = new Date().toISOString().split('T')[0];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/home-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/page-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/blog-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
};
