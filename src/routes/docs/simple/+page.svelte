<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
  title="Documentation System Demo"
  description="tenniszero.org Documentation System Demo"
/>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-4 py-8">
    <article class="prose prose-neutral dark:prose-invert max-w-none">
      <h1>tenniszero.org Documentation System</h1>
      
      <p>This is a demonstration of the documentation system built with:</p>
      
      <ul>
        <li>SvelteKit + Svelte 5</li>
        <li>mdsvex for Markdown processing</li>
        <li>Shiki for code highlighting</li>
        <li>shadcn/ui for components</li>
        <li>Flexsearch for search functionality</li>
      </ul>
      
      <h2>Features</h2>
      
      <ul>
        <li>📖 Multi-language support (English/Chinese)</li>
        <li>🌳 Auto-generated sidebar navigation</li>
        <li>🔍 Full-text search</li>
        <li>📑 Table of contents</li>
        <li>🎨 Dark/light theme support</li>
        <li>📱 Responsive design</li>
      </ul>
      
      <h2>Your Documentation Structure</h2>
      
      <p>We're using your existing <code>docs/</code> directory structure:</p>
      
      <pre><code>docs/
├── en/           # English documentation
├── zh/           # Chinese documentation
└── README.md     # Main documentation index</code></pre>
      
      <h2>Next Steps</h2>
      
      <ol>
        <li>Test the sidebar generation with your existing content</li>
        <li>Add search functionality</li>
        <li>Implement table of contents</li>
        <li>Add language switching</li>
        <li>Style improvements</li>
      </ol>
      
      <p><strong>Status:</strong> ✅ Basic routing and rendering working!</p>
    </article>
  </div>
</div>