<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEO
	title={data.pageContent?.title || 'Page'}
	description={data.pageContent?.description || 'Page content'}
/>

<div class="min-h-screen theme-bg-page theme-text-primary">
	<!-- Header spacing -->
	<div class="h-20"></div>
	
	<!-- Page content -->
	<div class="max-w-4xl mx-auto px-6 py-16">
		<article class="prose prose-invert prose-lg max-w-none">
			<header class="mb-12">
				<h1 class="text-4xl font-bold mb-4">{data.pageContent?.title}</h1>
				{#if data.pageContent?.description}
					<p class="text-xl theme-text-muted">{data.pageContent.description}</p>
				{/if}
				{#if data.pageContent?.lastUpdated}
					<p class="text-sm text-gray-500 mt-4">
						Last updated: {new Date(data.pageContent.lastUpdated).toLocaleDateString()}
					</p>
				{/if}
			</header>
			
			<div class="prose-content">
				{@html data.pageContent?.body || ''}
			</div>
		</article>
	</div>
</div>

<style>
	:global(.prose-content h1) {
		font-size: 1.875rem;
		font-weight: 700;
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		color: hsl(var(--foreground));
	}
	
	:global(.prose-content h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		color: hsl(var(--foreground));
	}
	
	:global(.prose-content h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: hsl(var(--foreground));
	}
	
	:global(.prose-content p) {
		margin-bottom: 1rem;
		color: hsl(var(--muted-foreground));
		line-height: 1.625;
	}
	
	:global(.prose-content ul, .prose-content ol) {
		margin-bottom: 1rem;
		color: hsl(var(--muted-foreground));
	}
	
	:global(.prose-content li) {
		margin-bottom: 0.5rem;
	}
	
	:global(.prose-content strong) {
		color: hsl(var(--foreground));
		font-weight: 600;
	}
	
	:global(.prose-content a) {
		color: #60a5fa;
		text-decoration: underline;
	}
	
	:global(.prose-content a:hover) {
		color: #93c5fd;
	}
	
	:global(.prose-content blockquote) {
		border-left: 4px solid #4b5563;
		padding-left: 1rem;
		font-style: italic;
		color: #9ca3af;
	}
	
	:global(.prose-content code) {
		background-color: hsl(var(--muted));
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: hsl(var(--muted-foreground));
	}
	
	:global(.prose-content pre) {
		background-color: hsl(var(--muted));
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
	}
	
	:global(.prose-content hr) {
		border-color: hsl(var(--border));
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
</style>
