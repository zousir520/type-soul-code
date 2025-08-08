import { getBlogPosts, getPages } from './content';

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: Array<{
    href: string;
    hreflang: string;
  }>;
}

// 支持的语言
const languages = ['en', 'zh'];
const defaultLanguage = 'en';

// 基础URL - 从环境变量获取，如果没有则需要在运行时动态获取
const getBaseUrl = () => {
  return process.env.PUBLIC_SITE_URL || 'http://localhost:5173';
};

// 生成多语言URL的辅助函数
function generateMultilingualUrls(path: string, baseUrl: string, lastmod?: string, changefreq?: SitemapEntry['changefreq'], priority?: number): SitemapEntry[] {
  return languages.map(lang => {
    const url = lang === defaultLanguage ? `${baseUrl}${path}` : `${baseUrl}/${lang}${path}`;
    
    // 生成 hreflang 替代链接
    const alternates = languages.map(altLang => ({
      href: altLang === defaultLanguage ? `${baseUrl}${path}` : `${baseUrl}/${altLang}${path}`,
      hreflang: altLang
    }));

    return {
      url,
      lastmod,
      changefreq,
      priority,
      alternates
    };
  });
}

// 获取所有静态页面
export function getStaticPages(baseUrl?: string): SitemapEntry[] {
  const currentBaseUrl = baseUrl || getBaseUrl();
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/blog', priority: 0.9, changefreq: 'daily' as const },
    { path: '/privacy', priority: 0.6, changefreq: 'yearly' as const },
    { path: '/terms', priority: 0.6, changefreq: 'yearly' as const },
    { path: '/cookies', priority: 0.6, changefreq: 'yearly' as const },
  ];

  const entries: SitemapEntry[] = [];

  staticPages.forEach(page => {
    const multilingualUrls = generateMultilingualUrls(
      page.path,
      currentBaseUrl,
      new Date().toISOString().split('T')[0], // 只保留日期部分
      page.changefreq,
      page.priority
    );
    entries.push(...multilingualUrls);
  });

  return entries;
}

// 获取所有博客文章页面
export async function getBlogPages(baseUrl?: string): Promise<SitemapEntry[]> {
  try {
    const currentBaseUrl = baseUrl || getBaseUrl();
    const posts = await getBlogPosts();
    const entries: SitemapEntry[] = [];

    posts.forEach(post => {
      // 格式化日期为 YYYY-MM-DD 格式
      const formattedDate = new Date(post.date).toISOString().split('T')[0];

      const multilingualUrls = generateMultilingualUrls(
        `/blog/${post.slug}`,
        currentBaseUrl,
        formattedDate,
        'monthly',
        0.7
      );
      entries.push(...multilingualUrls);
    });

    return entries;
  } catch (error) {
    console.error('Error loading blog pages for sitemap:', error);
    return [];
  }
}

// 获取所有CMS页面
export async function getCMSPages(baseUrl?: string): Promise<SitemapEntry[]> {
  try {
    const currentBaseUrl = baseUrl || getBaseUrl();
    const entries: SitemapEntry[] = [];

    // 获取所有动态页面
    try {
      const pages = await getPages();

      for (const page of pages) {
        const multilingualUrls = generateMultilingualUrls(
          `/${page.slug}`,
          currentBaseUrl,
          new Date().toISOString().split('T')[0],
          'monthly',
          0.6
        );
        entries.push(...multilingualUrls);
      }
    } catch (error) {
      console.log('Pages not found, skipping dynamic pages');
    }

    return entries;
  } catch (error) {
    console.error('Error loading CMS pages for sitemap:', error);
    return [];
  }
}

// 生成完整的sitemap条目
export async function generateSitemapEntries(baseUrl?: string): Promise<SitemapEntry[]> {
  const [staticPages, blogPages, cmsPages] = await Promise.all([
    getStaticPages(baseUrl),
    getBlogPages(baseUrl),
    getCMSPages(baseUrl)
  ]);

  return [
    ...staticPages,
    ...blogPages,
    ...cmsPages
  ];
}
