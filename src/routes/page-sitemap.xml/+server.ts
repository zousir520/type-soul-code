import type { RequestHandler } from './$types';
import { getStaticPages, getCMSPages } from '$lib/sitemap';

export const GET: RequestHandler = async ({ url }) => {
  try {
    console.log('Generating page sitemap...');

    // 获取baseUrl - 优先使用环境变量，否则使用请求的origin
    const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;

    // 获取静态页面和CMS页面（排除首页）
    const [staticPages, cmsPages] = await Promise.all([
      getStaticPages(baseUrl),
      getCMSPages(baseUrl)
    ]);
    
    // 过滤掉首页，只保留其他页面
    const filteredStaticPages = staticPages.filter(page =>
      !page.url.endsWith('/') && !page.url.endsWith('/zh/')
    );

    console.log('Filtered static pages:', filteredStaticPages.length);
    console.log('CMS pages:', cmsPages.length);

    const allPages = [...filteredStaticPages, ...cmsPages];
    console.log('Total pages for sitemap:', allPages.length);

    // 构建完整的页面 sitemap，包含动态和静态页面
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // 如果有动态页面，使用它们；否则使用备用的静态页面
    const pagesToUse = allPages.length > 0 ? allPages : [
      // 备用静态页面
      {
        url: `${baseUrl}/about`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { hreflang: 'en', href: `${baseUrl}/about` },
          { hreflang: 'zh', href: `${baseUrl}/zh/about` }
        ]
      },
      {
        url: `${baseUrl}/zh/about`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { hreflang: 'en', href: `${baseUrl}/about` },
          { hreflang: 'zh', href: `${baseUrl}/zh/about` }
        ]
      },
      {
        url: `${baseUrl}/contact`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { hreflang: 'en', href: `${baseUrl}/contact` },
          { hreflang: 'zh', href: `${baseUrl}/zh/contact` }
        ]
      },
      {
        url: `${baseUrl}/zh/contact`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { hreflang: 'en', href: `${baseUrl}/contact` },
          { hreflang: 'zh', href: `${baseUrl}/zh/contact` }
        ]
      }
    ];

    console.log('Using pages for sitemap:', pagesToUse.length);

    // 添加所有页面
    pagesToUse.forEach(page => {
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

    console.log('Page sitemap generated, length:', sitemap.length);
    console.log('First 200 chars:', sitemap.substring(0, 200));

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Error generating page sitemap:', error);
    
    // 返回基本的页面 sitemap 作为备用
    const baseUrl = process.env.PUBLIC_SITE_URL || url.origin;
    const lastmod = new Date().toISOString().split('T')[0];
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/about" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/about" />
  </url>
  <url>
    <loc>${baseUrl}/zh/about</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/about" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/about" />
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/contact" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/contact" />
  </url>
  <url>
    <loc>${baseUrl}/zh/contact</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/contact" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/contact" />
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/privacy" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/privacy" />
  </url>
  <url>
    <loc>${baseUrl}/zh/privacy</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/privacy" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/privacy" />
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/terms" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/terms" />
  </url>
  <url>
    <loc>${baseUrl}/zh/terms</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/terms" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/terms" />
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
