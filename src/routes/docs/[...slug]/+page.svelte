<script lang="ts">
  import type { PageData } from './$types';
  import DocumentationLayout from '$lib/components/docs/DocumentationLayout.svelte';
  
  let { data }: { data: PageData } = $props();
</script>

<DocumentationLayout
  title={data.frontmatter.title || 'Documentation'}
  description={data.frontmatter.description || 'tenniszero.org Documentation'}
  content={data.content}
  sidebarTree={data.sidebarTree}
  toc={data.toc}
  breadcrumbs={data.breadcrumbs}
  currentPath={data.currentPath}
  language={data.language}
/>