import { marked } from 'marked';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getSettings,
  getHomeContent,
  getPageContent,
  getContent
} from './generated/content';
import type {
  NavigationData,
  HeroData,
  FeaturesData,
  HomeFAQData,
  FooterData,
  PricingData,
  FAQData
} from './content-types';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  authorImage?: string;
  date: string;
  tags: string[];
  image?: string;
  content: string;
  body: string; // HTML content for display
  toc: TOCItem[]; // Table of contents
  readingTime: number; // Estimated reading time in minutes
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface Feature {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  content: string;
}

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface Page {
  slug: string;
  title: MultiLangText;
  description: MultiLangText;
  content: MultiLangText;
  seo?: SEOData;
}

export interface MultiLangText {
  en: string;
  zh: string;
}

// Helper function to get text in current language
export function getLocalizedText(text: MultiLangText | string, locale: string = 'en'): string {
  if (typeof text === 'string') {
    return text;
  }
  return text[locale as keyof MultiLangText] || text.en || '';
}



// Helper function to generate table of contents from markdown
function generateTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to convert markdown to HTML with TOC anchors
export function markdownToHTML(content: string): string {
  try {
    // Simple markdown to HTML conversion
    let html = marked.parse(content) as string;

    // Add IDs to headings for TOC navigation
    html = html.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match, level, text) => {
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      return `<h${level} id="${id}">${text}</h${level}>`;
    });

    return html;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return content;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = getAllBlogPosts();
    
    return posts.map(post => ({
      slug: post.slug,
      title: post.frontmatter.title || '',
      description: post.frontmatter.description || '',
      author: post.frontmatter.author || '',
      date: post.frontmatter.date || '',
      tags: post.frontmatter.tags || [],
      image: post.frontmatter.image || '',
      content: post.content,
      body: markdownToHTML(post.content),
      toc: generateTOC(post.content),
      readingTime: calculateReadingTime(post.content)
    }));
  } catch (error) {
    console.error('Error loading blog posts from generated content:', error);
    return [];
  }
}

export async function getBlogPost(slug: string, lang?: string): Promise<BlogPost | null> {
  try {
    // 尝试根据语言获取特定的slug
    let targetSlug = slug;
    if (lang && lang !== 'en') {
      targetSlug = `${slug}.${lang}`;
    }
    
    const post = getBlogPostBySlug(targetSlug, lang) || getBlogPostBySlug(slug, 'en');
    
    if (!post) {
      return null;
    }

    return {
      slug,
      title: post.frontmatter.title || '',
      description: post.frontmatter.description || '',
      author: post.frontmatter.author || '',
      date: post.frontmatter.date || '',
      tags: post.frontmatter.tags || [],
      image: post.frontmatter.image || '',
      content: post.content,
      body: markdownToHTML(post.content),
      toc: generateTOC(post.content),
      readingTime: calculateReadingTime(post.content)
    };
  } catch (error) {
    console.error('Error loading blog post from generated content:', error);
    return null;
  }
}

// Get related blog posts based on tags
export async function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3, lang?: string): Promise<BlogPost[]> {
  try {
    const allPosts = await getBlogPosts();

    // Filter out current post and calculate relevance score
    const relatedPosts = allPosts
      .filter(post => post.slug !== currentSlug)
      .map(post => {
        const commonTags = post.tags.filter(tag => tags.includes(tag));
        return {
          ...post,
          relevanceScore: commonTags.length
        };
      })
      .filter(post => post.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return relatedPosts;
  } catch (error) {
    console.error('Error loading related posts:', error);

    // Fallback to static content
    try {
      const { getStaticRelatedPosts } = await import('./content-static.js');
      return getStaticRelatedPosts(currentSlug, tags, limit);
    } catch (staticError) {
      console.error('Error loading static related posts:', staticError);
      return [];
    }
  }
}





export async function getPage(slug: string): Promise<Page | null> {
  try {
    const pageData = getPageContent(slug);
    
    if (!pageData) {
      return null;
    }

    // Handle both old format (string) and new format (object with languages)
    const title = typeof pageData.frontmatter.title === 'string'
      ? { en: pageData.frontmatter.title, zh: pageData.frontmatter.title }
      : pageData.frontmatter.title || { en: '', zh: '' };

    const description = typeof pageData.frontmatter.description === 'string'
      ? { en: pageData.frontmatter.description, zh: pageData.frontmatter.description }
      : pageData.frontmatter.description || { en: '', zh: '' };

    // Handle body content - check if it's in the new multilang format
    let processedContent: MultiLangText;
    if (pageData.frontmatter.body && typeof pageData.frontmatter.body === 'object') {
      processedContent = {
        en: markdownToHTML(pageData.frontmatter.body.en || ''),
        zh: markdownToHTML(pageData.frontmatter.body.zh || '')
      };
    } else {
      // Fallback to old format
      const htmlContent = markdownToHTML(pageData.content);
      processedContent = { en: htmlContent, zh: htmlContent };
    }

    return {
      slug,
      title,
      description,
      content: processedContent,
      seo: pageData.frontmatter.seo || {}
    };
  } catch (error) {
    console.error('Error loading page:', error);
    return null;
  }
}

export async function getPages(): Promise<Page[]> {
  try {
    // 从预编译内容中获取所有页面
    const pageKeys = Object.keys(getContent('') || {}).filter(key => key.startsWith('pages/') && key.endsWith('.md'));
    
    const pages = pageKeys.map(key => {
      const slug = key.replace('pages/', '').replace('.md', '');
      const pageData = getPageContent(slug);
      
      if (!pageData) return null;

      // Handle both old format (string) and new format (object with languages)
      const title = typeof pageData.frontmatter.title === 'string'
        ? { en: pageData.frontmatter.title, zh: pageData.frontmatter.title }
        : pageData.frontmatter.title || { en: '', zh: '' };

      const description = typeof pageData.frontmatter.description === 'string'
        ? { en: pageData.frontmatter.description, zh: pageData.frontmatter.description }
        : pageData.frontmatter.description || { en: '', zh: '' };

      // Handle content - convert to MultiLangText format
      const processedContent: MultiLangText = typeof pageData.content === 'string'
        ? { en: pageData.content, zh: pageData.content }
        : pageData.content || { en: '', zh: '' };

      return {
        slug,
        title,
        description,
        content: processedContent,
        seo: pageData.frontmatter.seo || {}
      };
    }).filter(Boolean) as Page[];

    return pages;
  } catch (error) {
    console.error('Error loading pages:', error);
    return [];
  }
}

export async function getSettingsData(type: string): Promise<Record<string, unknown> | null> {
  try {
    return getSettings(type);
  } catch (error) {
    console.error(`Error loading ${type} settings:`, error);
    return {};
  }
}

export async function getPricingData(): Promise<PricingData | null> {
  try {
    return getContent('pricing/plans.json') as PricingData;
  } catch (error) {
    console.error('Error loading pricing data:', error);
    return null;
  }
}

export async function getFAQData(): Promise<FAQData | null> {
  try {
    return getContent('faq/general.json') as FAQData;
  } catch (error) {
    console.error('Error loading FAQ data:', error);
    return null;
  }
}

// Home page content loaders
export async function getNavigationData(): Promise<NavigationData | null> {
  try {
    return getHomeContent('navigation') as NavigationData;
  } catch (error) {
    console.error('Error loading navigation data:', error);
    return null;
  }
}

export async function getHeroData(): Promise<HeroData | null> {
  try {
    return getHomeContent('hero') as HeroData;
  } catch (error) {
    console.error('Error loading hero data:', error);
    return null;
  }
}

export async function getFeaturesData(): Promise<FeaturesData | null> {
  try {
    return getHomeContent('features') as FeaturesData;
  } catch (error) {
    console.error('Error loading features data:', error);
    return null;
  }
}

export async function getHomeFAQData(): Promise<HomeFAQData | null> {
  try {
    return getHomeContent('faq') as HomeFAQData;
  } catch (error) {
    console.error('Error loading home FAQ data:', error);
    return null;
  }
}

export async function getFooterData(): Promise<FooterData | null> {
  try {
    return getHomeContent('footer') as FooterData;
  } catch (error) {
    console.error('Error loading footer data:', error);
    return null;
  }
}

export async function getUITextData(): Promise<Record<string, unknown> | null> {
  try {
    return getContent('ui-text.json') as Record<string, unknown>;
  } catch (error) {
    console.error('Error loading UI text data:', error);
    return null;
  }
}

export async function getGameConfigData(): Promise<Record<string, unknown> | null> {
  try {
    return getContent('game/config.json') as Record<string, unknown>;
  } catch (error) {
    console.error('Error loading game config data:', error);
    return null;
  }
}
