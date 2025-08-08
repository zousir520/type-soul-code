import type { RequestHandler } from './$types';
import { getBlogPages } from '$lib/sitemap';

export const GET: RequestHandler = async ({ url }) => {
  try {
    console.log('Generating blog sitemap...');

    // 获取baseUrl
    const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
    
    // 获取所有博客页面
    const blogPages = await getBlogPages(baseUrl);
    console.log('Blog pages found:', blogPages.length);
    
    // 添加博客首页
    const lastmod = new Date().toISOString().split('T')[0];
    
    const blogIndexPages = [
      {
        url: `${baseUrl}/blog`,
        lastmod,
        changefreq: 'daily',
        priority: 0.9,
        alternates: [
          { hreflang: 'en', href: `${baseUrl}/blog` },
          { hreflang: 'zh', href: `${baseUrl}/zh/blog` }
        ]
      },
      {
        url: `${baseUrl}/zh/blog`,
        lastmod,
        changefreq: 'daily',
        priority: 0.9,
        alternates: [
          { hreflang: 'en', href: `${baseUrl}/blog` },
          { hreflang: 'zh', href: `${baseUrl}/zh/blog` }
        ]
      }
    ];
    
    const allBlogPages = [...blogIndexPages, ...blogPages];

    // 构建完整的博客 sitemap，包含所有博客文章
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // 添加所有博客页面
    allBlogPages.forEach(page => {
      sitemapContent += `
  <url>
    <loc>${page.url}</loc>`;

      if (page.lastmod) {
        sitemapContent += `
    <lastmod>${page.lastmod}</lastmod>`;
      }

      if (page.changefreq) {
        sitemapContent += `
    <changefreq>${page.changefreq}</changefreq>`;
      }

      if (page.priority) {
        sitemapContent += `
    <priority>${page.priority}</priority>`;
      }

      // 添加多语言替代链接
      if (page.alternates && page.alternates.length > 0) {
        page.alternates.forEach(alt => {
          sitemapContent += `
    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`;
        });
      }

      sitemapContent += `
  </url>`;
    });

    sitemapContent += `
</urlset>`;

    const sitemap = sitemapContent;

    console.log('Blog sitemap generated, length:', sitemap.length);
    console.log('First 200 chars:', sitemap.substring(0, 200));

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    
    // 返回基本的博客 sitemap 作为备用
    const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
    const lastmod = new Date().toISOString().split('T')[0];
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blog" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/blog" />
  </url>
  <url>
    <loc>${baseUrl}/zh/blog</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blog" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/blog" />
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
