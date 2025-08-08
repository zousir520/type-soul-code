import matter from 'gray-matter';
import { marked } from 'marked';
import { CONTENT_CONFIG, getGitHubHeaders } from '$lib/config/content.js';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
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
function markdownToHTML(content: string): string {
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

// Fetch file content from GitHub API
async function fetchGitHubFile(path: string): Promise<string | null> {
  try {
    const { github } = CONTENT_CONFIG;
    const url = `https://api.github.com/repos/${github.owner}/${github.repo}/contents/${path}?ref=${github.branch}`;
    const headers = getGitHubHeaders();
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.type !== 'file' || !data.content) {
      console.error(`Invalid file data for ${path}`);
      return null;
    }
    
    // Decode base64 content
    return atob(data.content);
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    return null;
  }
}

// Fetch directory listing from GitHub API
async function fetchGitHubDirectory(path: string): Promise<string[]> {
  try {
    const { github } = CONTENT_CONFIG;
    const url = `https://api.github.com/repos/${github.owner}/${github.repo}/contents/${path}?ref=${github.branch}`;
    const headers = getGitHubHeaders();
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error(`Failed to fetch directory ${path}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error(`Invalid directory data for ${path}`);
      return [];
    }
    
    // Filter for markdown files
    return data
      .filter(item => item.type === 'file' && item.name.endsWith('.md'))
      .map(item => item.name);
  } catch (error) {
    console.error(`Error fetching directory ${path}:`, error);
    return [];
  }
}

// Get all blog posts from GitHub
export async function getBlogPostsFromGitHub(): Promise<BlogPost[]> {
  // Check if GitHub content fetching is enabled
  if (!CONTENT_CONFIG.useGitHub || CONTENT_CONFIG.source === 'local-only') {
    console.log('GitHub content fetching is disabled');
    return [];
  }

  try {
    console.log('Fetching blog posts from GitHub...');

    // Get list of markdown files in the blog directory
    const files = await fetchGitHubDirectory(CONTENT_CONFIG.github.contentPath);
    
    if (files.length === 0) {
      console.log('No blog files found in GitHub repository');
      return [];
    }
    
    console.log(`Found ${files.length} blog files:`, files);
    
    // Fetch and parse each file
    const posts = await Promise.all(
      files.map(async (filename) => {
        const filePath = `${CONTENT_CONFIG.github.contentPath}/${filename}`;
        const fileContent = await fetchGitHubFile(filePath);
        
        if (!fileContent) {
          console.error(`Failed to fetch content for ${filename}`);
          return null;
        }
        
        try {
          const { data, content } = matter(fileContent);
          
          const toc = generateTOC(content);
          const readingTime = calculateReadingTime(content);
          const body = markdownToHTML(content);
          
          return {
            slug: filename.replace('.md', ''),
            title: data.title || '',
            description: data.description || '',
            author: data.author || '',
            date: data.date || '',
            tags: data.tags || [],
            image: data.image || '',
            content,
            body,
            toc,
            readingTime
          };
        } catch (error) {
          console.error(`Error parsing ${filename}:`, error);
          return null;
        }
      })
    );
    
    // Filter out failed posts and sort by date
    const validPosts = posts.filter(post => post !== null && typeof post === 'object') as BlogPost[];

    return validPosts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error loading blog posts from GitHub:', error);
    return [];
  }
}

// Get a single blog post from GitHub
export async function getBlogPostFromGitHub(slug: string): Promise<BlogPost | null> {
  // Check if GitHub content fetching is enabled
  if (!CONTENT_CONFIG.useGitHub || CONTENT_CONFIG.source === 'local-only') {
    console.log('GitHub content fetching is disabled');
    return null;
  }

  try {
    console.log(`Fetching blog post "${slug}" from GitHub...`);

    const filename = `${slug}.md`;
    const filePath = `${CONTENT_CONFIG.github.contentPath}/${filename}`;
    const fileContent = await fetchGitHubFile(filePath);
    
    if (!fileContent) {
      console.error(`Blog post "${slug}" not found in GitHub repository`);
      return null;
    }
    
    const { data, content } = matter(fileContent);
    
    const toc = generateTOC(content);
    const readingTime = calculateReadingTime(content);
    const body = markdownToHTML(content);
    
    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      author: data.author || '',
      date: data.date || '',
      tags: data.tags || [],
      image: data.image || '',
      content,
      body,
      toc,
      readingTime
    };
  } catch (error) {
    console.error(`Error loading blog post "${slug}" from GitHub:`, error);
    return null;
  }
}

// Get related blog posts based on tags
export async function getRelatedPostsFromGitHub(currentSlug: string, tags: string[], limit: number = 3): Promise<BlogPost[]> {
  // Check if GitHub content fetching is enabled
  if (!CONTENT_CONFIG.useGitHub || CONTENT_CONFIG.source === 'local-only') {
    console.log('GitHub content fetching is disabled');
    return [];
  }

  try {
    const allPosts = await getBlogPostsFromGitHub();
    
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
    console.error('Error loading related posts from GitHub:', error);
    return [];
  }
}

// Test GitHub connection with custom settings
export async function testGitHubConnection(config: {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
}): Promise<{ success: boolean; message: string; posts?: string[] }> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SvelteKit-Blog'
    };

    if (config.token) {
      headers['Authorization'] = `token ${config.token}`;
    }

    // Test repository access
    const repoUrl = `https://api.github.com/repos/${config.owner}/${config.repo}`;
    const repoResponse = await fetch(repoUrl, { headers });

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return {
          success: false,
          message: `Repository ${config.owner}/${config.repo} not found or not accessible`
        };
      }
      return {
        success: false,
        message: `Failed to access repository: ${repoResponse.status} ${repoResponse.statusText}`
      };
    }

    // Test content directory access
    const contentUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/src/content/blog?ref=${config.branch}`;
    const contentResponse = await fetch(contentUrl, { headers });

    if (!contentResponse.ok) {
      if (contentResponse.status === 404) {
        return {
          success: false,
          message: 'Blog content directory (src/content/blog) not found in repository'
        };
      }
      return {
        success: false,
        message: `Failed to access content directory: ${contentResponse.status} ${contentResponse.statusText}`
      };
    }

    const contentData = await contentResponse.json();

    if (!Array.isArray(contentData)) {
      return {
        success: false,
        message: 'Content directory exists but is not accessible'
      };
    }

    // Get list of markdown files
    const markdownFiles = contentData
      .filter(item => item.type === 'file' && item.name.endsWith('.md'))
      .map(item => item.name);

    return {
      success: true,
      message: `Successfully connected to ${config.owner}/${config.repo}`,
      posts: markdownFiles
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
