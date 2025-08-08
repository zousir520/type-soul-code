import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  // 优先使用环境变量，然后使用请求的 origin
  const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
  
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_app/
Disallow: /auth/

# Allow common crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=86400' // 缓存24小时
    }
  });
};
