import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    // 优先使用环境变量，然后使用请求的 origin
    const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
    const lastmod = new Date().toISOString().split('T')[0];
  
  // 主页相关页面
  const homePages = [
    {
      url: `${baseUrl}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '1.0',
      alternates: [
        { hreflang: 'en', href: `${baseUrl}/` },
        { hreflang: 'zh', href: `${baseUrl}/zh/` }
      ]
    },
    {
      url: `${baseUrl}/zh/`,
      lastmod,
      changefreq: 'weekly',
      priority: '1.0',
      alternates: [
        { hreflang: 'en', href: `${baseUrl}/` },
        { hreflang: 'zh', href: `${baseUrl}/zh/` }
      ]
    }
  ];

    // 使用简单的字符串模板，与 sitemap-index.xml 相同的方式
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/" />
  </url>
  <url>
    <loc>${baseUrl}/zh/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/" />
  </url>
</urlset>`;

    console.log('Home sitemap generated, length:', sitemap.length);
    console.log('First 200 chars:', sitemap.substring(0, 200));

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Error generating home sitemap:', error);

    // 返回基本的主页 sitemap 作为备用
    const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
    const lastmod = new Date().toISOString().split('T')[0];

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/" />
  </url>
  <url>
    <loc>${baseUrl}/zh/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/" />
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'max-age=3600'
      }
    });
  }
};
