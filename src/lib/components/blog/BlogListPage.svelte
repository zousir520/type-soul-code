<script lang="ts">
	import BlogSearch from '$lib/components/blog/BlogSearch.svelte';
	import DefaultBlogImage from '$lib/components/DefaultBlogImage.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';


	interface BlogPost {
		slug: string;
		title: string;
		description: string;
		author: string;
		date: string;
		tags: string[];
		image?: string;
		readingTime?: number;
	}

	interface Pagination {
		page?: number;
		limit?: number;
		total?: number;
		totalPages: number;
		currentPage?: number;
		totalPosts?: number;
		hasNextPage?: boolean;
		hasPrevPage?: boolean;
	}

	interface Props {
		posts: BlogPost[];
		pagination?: Pagination;
		searchQuery?: string;
		lang?: string;
	}

	let { posts, pagination, searchQuery = '', lang = 'en' }: Props = $props();

	function formatDate(dateString: string) {
		const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
		return new Date(dateString).toLocaleDateString(locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getReadingTimeText(minutes: number) {
		if (lang === 'zh') {
			return `${minutes} 分钟阅读`;
		}
		return `${minutes} min read`;
	}

	function getBlogUrl(slug: string) {
		if (lang === 'zh') {
			return `/zh/blog/${slug}`;
		}
		return `/blog/${slug}`;
	}
</script>

<ScrollProgress />

<div class="min-h-screen theme-bg-card dark:theme-bg-muted">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:theme-text-primary mb-4">
				{lang === 'zh' ? '博客' : 'Blog'}
			</h1>
			<p class="text-xl theme-text-muted dark:theme-text-muted max-w-3xl mx-auto">
				{lang === 'zh' 
					? '关于 AI 自动化的见解、教程和更新。学习如何构建更智能的工作流程并提高生产力。'
					: 'Insights, tutorials, and updates about AI automation. Learn how to build smarter workflows and boost productivity.'
				}
			</p>
		</div>

		<!-- Search -->
		<div class="mb-12">
			<BlogSearch />
		</div>

		<!-- Blog Posts Grid -->
		<div class="grid gap-8 md:grid-cols-2 lg:gap-12">
			{#each posts as post}
				<article class="group theme-bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:theme-border">
					<!-- Featured Image -->
					<div class="relative overflow-hidden">
						{#if post.image}
							<img
								src={post.image}
								alt={post.title}
								class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div class="w-full h-48 rounded-t-2xl overflow-hidden">
								<DefaultBlogImage title={post.title} />
							</div>
						{/if}
					</div>

					<!-- Content -->
					<div class="p-6 space-y-4">
						<!-- Title -->
						<h3 class="text-xl font-bold text-gray-900 dark:theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
							<a href={getBlogUrl(post.slug)} class="hover:underline">
								{post.title}
							</a>
						</h3>

						<!-- Description -->
						<p class="theme-text-muted dark:theme-text-muted text-sm leading-relaxed line-clamp-3">
							{post.description}
						</p>

						<!-- Meta -->
						<div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
							<time datetime={post.date}>
								{formatDate(post.date)}
							</time>
							{#if post.readingTime}
								<span>•</span>
								<span>{getReadingTimeText(post.readingTime)}</span>
							{/if}
						</div>

						<!-- Tags -->
						{#if post.tags && post.tags.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each post.tags.slice(0, 3) as tag}
									<span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
										{tag}
									</span>
								{/each}
							</div>
						{/if}

						<!-- Author -->
						<div class="flex items-center gap-3 pt-2 border-t border-gray-100 dark:theme-border">
							<Avatar name={post.author} size={32} />
							<div>
								<p class="font-medium text-gray-900 dark:theme-text-primary text-sm">
									{post.author}
								</p>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- Empty State -->
		{#if posts.length === 0}
			<div class="text-center py-16">
				<div class="text-6xl mb-4">📝</div>
				<h3 class="text-xl font-semibold text-gray-900 dark:theme-text-primary mb-2">
					{lang === 'zh' ? '暂无文章' : 'No posts found'}
				</h3>
				<p class="theme-text-muted dark:text-gray-400">
					{lang === 'zh' 
						? searchQuery ? '尝试调整搜索条件' : '敬请期待更多精彩内容'
						: searchQuery ? 'Try adjusting your search terms' : 'Check back soon for new content'
					}
				</p>
			</div>
		{/if}

		<!-- Pagination -->
		{#if pagination && pagination.totalPages > 1}
			{@const currentPage = pagination.page || pagination.currentPage || 1}
			<div class="flex justify-center items-center gap-2 mt-16">
				{#if currentPage > 1}
					<a
						href="?page={currentPage - 1}{searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}"
						class="px-4 py-2 text-sm font-medium text-gray-700 dark:theme-text-muted theme-bg-card dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						{lang === 'zh' ? '上一页' : 'Previous'}
					</a>
				{/if}

				{#each Array.from({ length: pagination.totalPages }, (_, i) => i + 1) as pageNum}
					{#if pageNum === currentPage}
						<span class="px-4 py-2 text-sm font-medium theme-text-primary bg-blue-600 rounded-lg">
							{pageNum}
						</span>
					{:else if Math.abs(pageNum - currentPage) <= 2 || pageNum === 1 || pageNum === pagination.totalPages}
						<a
							href="?page={pageNum}{searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}"
							class="px-4 py-2 text-sm font-medium text-gray-700 dark:theme-text-muted theme-bg-card dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						>
							{pageNum}
						</a>
					{:else if Math.abs(pageNum - currentPage) === 3}
						<span class="px-2 py-2 text-gray-500">...</span>
					{/if}
				{/each}

				{#if currentPage < pagination.totalPages}
					<a
						href="?page={currentPage + 1}{searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}"
						class="px-4 py-2 text-sm font-medium text-gray-700 dark:theme-text-muted theme-bg-card dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						{lang === 'zh' ? '下一页' : 'Next'}
					</a>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
