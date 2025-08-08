// 静态内容预加载 - 解决Vercel部署时文件系统访问问题
import type { BlogPost } from './content.js';

// 预编译的blog文章数据
export const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    slug: "2025-01-07-welcome-to-vibby",
    title: "Welcome to Vibby - Ship Any Idea git mode",
    description: "Discover how Vibby can help you transform your ideas into reality with our comprehensive development platform.",
    author: "Vibby Team",
    date: "2025-01-07T10:00:00.000Z",
    tags: ["announcement", "platform", "development"],
    image: "",
    content: `# Welcome to Vibby

We're excited to introduce Vibby, your comprehensive platform for shipping any idea quickly and efficiently.

## What is Vibby?

Vibby is designed to help developers, entrepreneurs, and creators transform their ideas into reality. Whether you're building a web application, mobile app, or any digital product, Vibby provides the tools and resources you need.

## Key Features

- **Rapid Development**: Get your ideas to market faster
- **Comprehensive Tools**: Everything you need in one platform
- **Scalable Solutions**: Grow with your business
- **Expert Support**: Get help when you need it

## Getting Started

Ready to ship your next big idea? Let's get started with Vibby today!`,
    body: `<h1>Welcome to Vibby</h1>
<p>We're excited to introduce Vibby, your comprehensive platform for shipping any idea quickly and efficiently.</p>
<h2>What is Vibby?</h2>
<p>Vibby is designed to help developers, entrepreneurs, and creators transform their ideas into reality. Whether you're building a web application, mobile app, or any digital product, Vibby provides the tools and resources you need.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Rapid Development</strong>: Get your ideas to market faster</li>
<li><strong>Comprehensive Tools</strong>: Everything you need in one platform</li>
<li><strong>Scalable Solutions</strong>: Grow with your business</li>
<li><strong>Expert Support</strong>: Get help when you need it</li>
</ul>
<h2>Getting Started</h2>
<p>Ready to ship your next big idea? Let's get started with Vibby today!</p>`,
    toc: [
      { id: "what-is-vibby", text: "What is Vibby?", level: 2 },
      { id: "key-features", text: "Key Features", level: 2 },
      { id: "getting-started", text: "Getting Started", level: 2 }
    ],
    readingTime: 2
  },
  {
    slug: "2025-01-06-building-modern-web-apps",
    title: "Building Modern Web Applications with SvelteKit",
    description: "Learn how to build fast, scalable web applications using SvelteKit and modern development practices.",
    author: "Tech Team",
    date: "2025-01-06T14:30:00.000Z",
    tags: ["svelte", "web-development", "tutorial"],
    image: "",
    content: `# Building Modern Web Applications with SvelteKit

SvelteKit is a powerful framework for building web applications that are fast, efficient, and developer-friendly.

## Why SvelteKit?

SvelteKit offers several advantages:

- **Performance**: Compiled components for optimal runtime performance
- **Developer Experience**: Hot reloading, TypeScript support, and excellent tooling
- **Flexibility**: Can be deployed anywhere, from static sites to serverless functions
- **SEO-Friendly**: Built-in SSR and prerendering capabilities

## Getting Started

To create a new SvelteKit project:

\`\`\`bash
npm create svelte@latest my-app
cd my-app
npm install
npm run dev
\`\`\`

## Key Concepts

### Routing
SvelteKit uses file-based routing. Create a \`+page.svelte\` file in the \`src/routes\` directory.

### Load Functions
Use \`+page.server.ts\` or \`+page.ts\` files to load data for your pages.

### Components
Build reusable UI components with Svelte's reactive syntax.

## Best Practices

1. **Use TypeScript** for better development experience
2. **Implement proper error handling** with error boundaries
3. **Optimize for performance** with lazy loading and code splitting
4. **Follow accessibility guidelines** for inclusive design

## Conclusion

SvelteKit provides an excellent foundation for modern web development. Start building your next project today!`,
    body: `<h1>Building Modern Web Applications with SvelteKit</h1>
<p>SvelteKit is a powerful framework for building web applications that are fast, efficient, and developer-friendly.</p>
<h2>Why SvelteKit?</h2>
<p>SvelteKit offers several advantages:</p>
<ul>
<li><strong>Performance</strong>: Compiled components for optimal runtime performance</li>
<li><strong>Developer Experience</strong>: Hot reloading, TypeScript support, and excellent tooling</li>
<li><strong>Flexibility</strong>: Can be deployed anywhere, from static sites to serverless functions</li>
<li><strong>SEO-Friendly</strong>: Built-in SSR and prerendering capabilities</li>
</ul>
<h2>Getting Started</h2>
<p>To create a new SvelteKit project:</p>
<pre><code class="language-bash">npm create svelte@latest my-app
cd my-app
npm install
npm run dev</code></pre>
<h2>Key Concepts</h2>
<h3>Routing</h3>
<p>SvelteKit uses file-based routing. Create a <code>+page.svelte</code> file in the <code>src/routes</code> directory.</p>
<h3>Load Functions</h3>
<p>Use <code>+page.server.ts</code> or <code>+page.ts</code> files to load data for your pages.</p>
<h3>Components</h3>
<p>Build reusable UI components with Svelte's reactive syntax.</p>
<h2>Best Practices</h2>
<ol>
<li><strong>Use TypeScript</strong> for better development experience</li>
<li><strong>Implement proper error handling</strong> with error boundaries</li>
<li><strong>Optimize for performance</strong> with lazy loading and code splitting</li>
<li><strong>Follow accessibility guidelines</strong> for inclusive design</li>
</ol>
<h2>Conclusion</h2>
<p>SvelteKit provides an excellent foundation for modern web development. Start building your next project today!</p>`,
    toc: [
      { id: "why-sveltekit", text: "Why SvelteKit?", level: 2 },
      { id: "getting-started", text: "Getting Started", level: 2 },
      { id: "key-concepts", text: "Key Concepts", level: 2 },
      { id: "routing", text: "Routing", level: 3 },
      { id: "load-functions", text: "Load Functions", level: 3 },
      { id: "components", text: "Components", level: 3 },
      { id: "best-practices", text: "Best Practices", level: 2 },
      { id: "conclusion", text: "Conclusion", level: 2 }
    ],
    readingTime: 4
  },
  {
    slug: "2025-01-05-javascript-best-practices",
    title: "JavaScript Best Practices for 2025",
    description: "Essential JavaScript best practices every developer should follow in 2025.",
    author: "Development Team",
    date: "2025-01-05T09:15:00.000Z",
    tags: ["javascript", "best-practices", "coding"],
    image: "",
    content: `# JavaScript Best Practices for 2025

As JavaScript continues to evolve, it's important to stay up-to-date with the latest best practices.

## Modern Syntax

### Use const and let
Avoid \`var\` and use \`const\` for immutable values and \`let\` for variables that need to be reassigned.

### Arrow Functions
Use arrow functions for cleaner syntax, especially for callbacks and short functions.

### Template Literals
Use template literals for string interpolation and multi-line strings.

## Async Programming

### Async/Await
Prefer async/await over promises for better readability.

### Error Handling
Always handle errors properly with try/catch blocks.

## Performance Tips

1. **Avoid unnecessary re-renders**
2. **Use efficient data structures**
3. **Implement proper caching**
4. **Optimize bundle size**

## Security

- Validate all user inputs
- Use HTTPS everywhere
- Implement proper authentication
- Keep dependencies updated

## Testing

Write comprehensive tests for your JavaScript code using modern testing frameworks.`,
    body: `<h1>JavaScript Best Practices for 2025</h1>
<p>As JavaScript continues to evolve, it's important to stay up-to-date with the latest best practices.</p>
<h2>Modern Syntax</h2>
<h3>Use const and let</h3>
<p>Avoid <code>var</code> and use <code>const</code> for immutable values and <code>let</code> for variables that need to be reassigned.</p>
<h3>Arrow Functions</h3>
<p>Use arrow functions for cleaner syntax, especially for callbacks and short functions.</p>
<h3>Template Literals</h3>
<p>Use template literals for string interpolation and multi-line strings.</p>
<h2>Async Programming</h2>
<h3>Async/Await</h3>
<p>Prefer async/await over promises for better readability.</p>
<h3>Error Handling</h3>
<p>Always handle errors properly with try/catch blocks.</p>
<h2>Performance Tips</h2>
<ol>
<li><strong>Avoid unnecessary re-renders</strong></li>
<li><strong>Use efficient data structures</strong></li>
<li><strong>Implement proper caching</strong></li>
<li><strong>Optimize bundle size</strong></li>
</ol>
<h2>Security</h2>
<ul>
<li>Validate all user inputs</li>
<li>Use HTTPS everywhere</li>
<li>Implement proper authentication</li>
<li>Keep dependencies updated</li>
</ul>
<h2>Testing</h2>
<p>Write comprehensive tests for your JavaScript code using modern testing frameworks.</p>`,
    toc: [
      { id: "modern-syntax", text: "Modern Syntax", level: 2 },
      { id: "async-programming", text: "Async Programming", level: 2 },
      { id: "performance-tips", text: "Performance Tips", level: 2 },
      { id: "security", text: "Security", level: 2 },
      { id: "testing", text: "Testing", level: 2 }
    ],
    readingTime: 3
  }
];

// 获取静态blog文章的函数
export function getStaticBlogPosts(): BlogPost[] {
  return STATIC_BLOG_POSTS.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// 根据slug获取单篇文章
export function getStaticBlogPost(slug: string): BlogPost | null {
  return STATIC_BLOG_POSTS.find(post => post.slug === slug) || null;
}

// 获取相关文章
export function getStaticRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): BlogPost[] {
  return STATIC_BLOG_POSTS
    .filter(post => post.slug !== currentSlug)
    .filter(post => post.tags.some(tag => tags.includes(tag)))
    .slice(0, limit);
}
