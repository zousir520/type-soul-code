import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import { createHighlighter } from 'shiki';

const config = defineConfig({
  extensions: ['.svelte.md', '.md', '.svx'],
  
  smartypants: {
    dashes: 'oldschool'
  },

  remarkPlugins: [],
  
  rehypePlugins: [],

  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: ['javascript', 'typescript', 'svelte', 'bash', 'json', 'yaml', 'markdown', 'html', 'css']
      });
      
      const html = highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: 'github-light',
          dark: 'github-dark'
        },
        defaultColor: false,
        cssVariablePrefix: '--shiki-'
      });
      
      return `{@html \`${html}\`}`;
    }
  },

  layout: {
    _: './src/lib/components/docs/MarkdownLayout.svelte'
  }
});

export default config;