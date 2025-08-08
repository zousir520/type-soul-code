<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Calendar, User, ArrowRight } from 'lucide-svelte';
	import DefaultBlogImage from '$lib/components/DefaultBlogImage.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import BlogSearch from '$lib/components/blog/BlogSearch.svelte'; // 导入 BlogSearch

	let { data, currentLocale } = $props();

	// Simple static translations to avoid runtime errors
	const staticTexts = {
		title: 'Blog',
		subtitle: 'Insights, tutorials, and updates about AI automation. Learn how to build smarter workflows and boost productivity.'
	};

	const posts = $derived(data.posts || []);
	const pagination = $derived(data.pagination);
	const searchQuery = $derived(data.searchQuery || '');

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{staticTexts.title} - tenniszero.org</title>
	<meta name="description" content="Read the latest articles about AI development, automation, and best practices." />
</svelte:head>

<!-- Reading Progress Bar for page scroll -->
<ScrollProgress />

<div class="theme-bg-card dark:theme-bg-muted py-16 sm:py-24">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:theme-text-primary sm:text-5xl">{staticTexts.title}</h1>
			<p class="mt-4 text-xl leading-8 theme-text-muted dark:theme-text-muted">
				{staticTexts.subtitle}
			</p>

			<!-- Search -->
			<div class="mt-8">
				<BlogSearch />
			</div>

			<!-- Search results info -->
			{#if searchQuery}
				<div class="mt-4">
					<p class="text-sm theme-text-muted dark:text-gray-400">
						{#if posts.length === 0}
							No articles found for "{searchQuery}"
						{:else if posts.length === 1}
							Found 1 article for "{searchQuery}"
						{:else}
							Found {pagination.totalPosts} articles for "{searchQuery}"
						{/if}
					</p>
				</div>
			{/if}
		</div>
		{#if posts.length === 0}
			<!-- No posts found -->
			<div class="mx-auto mt-16 max-w-2xl text-center">
				<div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-12">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<h3 class="mt-4 text-lg font-medium text-gray-900 dark:theme-text-primary">
						{#if searchQuery}
							No articles found
						{:else}
							No articles yet
						{/if}
					</h3>
					<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
						{#if searchQuery}
							Try adjusting your search terms or browse all articles.
						{:else}
							Check back soon for new content!
						{/if}
					</p>
					{#if searchQuery}
						<div class="mt-6">
							<a href="/blog" class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
								View all articles
							</a>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
				{#each posts as post}
				<article class="flex flex-col items-start justify-between">
					<div class="relative w-full">
						{#if post.image}
							<img
								src={post.image}
								alt={post.title}
								class="aspect-[16/9] w-full rounded-2xl theme-bg-muted object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
							/>
						{:else}
							<DefaultBlogImage
								title={post.title}
								class="aspect-[16/9] w-full rounded-2xl sm:aspect-[2/1] lg:aspect-[3/2]"
							/>
						{/if}
						<div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
					</div>
					<div class="max-w-xl">
						<div class="mt-8 flex items-center gap-x-4 text-xs">
							<time datetime={post.date} class="text-gray-500 dark:text-gray-400">
								{formatDate(post.date)}
							</time>
							{#if post.readingTime}
								<span class="text-gray-500 dark:text-gray-400">
									{post.readingTime} min read
								</span>
							{/if}
							{#each (post.tags || []).slice(0, 2) as tag}
								<span class="relative z-10 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 font-medium theme-text-muted dark:theme-text-muted hover:theme-bg-muted dark:hover:bg-gray-700">
									{tag}
								</span>
							{/each}
						</div>
						<div class="group relative">
							<h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:theme-text-primary group-hover:theme-text-muted dark:group-hover:theme-text-muted">
								<a href="/blog/{post.slug}">
									<span class="absolute inset-0"></span>
									{post.title}
								</a>
							</h3>
							<p class="mt-5 line-clamp-3 text-sm leading-6 theme-text-muted dark:theme-text-muted">
								{post.description}
							</p>
						</div>
						<div class="relative mt-8 flex items-center gap-x-4">
							<Avatar name={post.author || 'Anonymous'} size={40} className="flex-shrink-0" />
							<div class="text-sm leading-6">
								<p class="font-semibold text-gray-900 dark:theme-text-primary">
									<span class="absolute inset-0"></span>
									{post.author || 'Anonymous'}
								</p>
							</div>
						</div>
					</div>
				</article>
				{/each}
			</div>

			<!-- Pagination -->
			{#if pagination && pagination.totalPages > 1}
				<div class="mt-16 flex justify-center">
					<nav class="flex items-center space-x-2">
						{#if pagination.hasPrevPage}
							<a
								href="?page={pagination.currentPage - 1}"
								class="px-3 py-2 text-sm font-medium text-gray-500 theme-bg-card border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-muted dark:hover:bg-gray-700"
							>
								Previous
							</a>
						{/if}

						{#each Array.from({ length: pagination.totalPages }, (_, i) => i + 1) as pageNum}
							{#if pageNum === pagination.currentPage}
								<span class="px-3 py-2 text-sm font-medium theme-text-primary bg-blue-600 border border-blue-600 rounded-md">
									{pageNum}
								</span>
							{:else if Math.abs(pageNum - pagination.currentPage) <= 2 || pageNum === 1 || pageNum === pagination.totalPages}
								<a
									href="?page={pageNum}"
									class="px-3 py-2 text-sm font-medium text-gray-500 theme-bg-card border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-muted dark:hover:bg-gray-700"
								>
									{pageNum}
								</a>
							{:else if Math.abs(pageNum - pagination.currentPage) === 3}
								<span class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
							{/if}
						{/each}

						{#if pagination.hasNextPage}
							<a
								href="?page={pagination.currentPage + 1}"
								class="px-3 py-2 text-sm font-medium text-gray-500 theme-bg-card border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-muted dark:hover:bg-gray-700"
							>
								Next
							</a>
						{/if}
					</nav>
				</div>
			{/if}
		{/if}
	</div>
</div>