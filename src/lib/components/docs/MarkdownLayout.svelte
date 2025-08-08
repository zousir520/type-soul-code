<script lang="ts">
  // This component is used by mdsvex for standalone markdown files
  // It provides a simple layout for markdown content
</script>

<article class="prose prose-neutral dark:prose-invert max-w-none">
  <slot />
</article>

<style>
  /* Additional styles for standalone markdown */
  :global(.prose h1) {
    @apply scroll-mt-20;
  }
  
  :global(.prose h2) {
    @apply scroll-mt-20;
  }
  
  :global(.prose h3) {
    @apply scroll-mt-20;
  }
</style>