<script lang="ts">
	import type { PageData } from './$types';
	import Breadcrumb from '$lib/components/blog/Breadcrumb.svelte';
	import DefaultBlogImage from '$lib/components/DefaultBlogImage.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import ReadingProgress from '$lib/components/ReadingProgress.svelte';

	// Simple static translations to avoid runtime errors
	const staticTexts = {
		tableOfContents: 'Table of Contents',
		relatedArticles: 'Related Articles',
		continueReading: 'Continue reading with these related posts'
	};

	let { data }: { data: PageData } = $props();

	const post = $derived(data.post);
	const relatedPosts = $derived(data.relatedPosts || []);

	const breadcrumbItems = $derived([
		{ name: 'Blog', href: '/blog' },
		{ name: post.title }
	]);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// TOC 状态管理
	let activeHeading = $state('');
	let tocVisible = $state(true);

	// 滚动到标题
	function scrollToHeading(id: string) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// 更新活跃标题和TOC可见性
	function updateTocState() {
		if (!post.toc || post.toc.length === 0) return;

		// 更新活跃标题
		const headings = post.toc.map(item => document.getElementById(item.id)).filter(Boolean);
		let currentHeading = '';
		
		for (let i = headings.length - 1; i >= 0; i--) {
			const heading = headings[i];
			if (heading) {
				const rect = heading.getBoundingClientRect();
				if (rect.top <= 100) {
					currentHeading = heading.id;
					break;
				}
			}
		}
		
		// 如果活跃标题发生变化，滚动TOC到相应位置
		if (currentHeading !== activeHeading) {
			activeHeading = currentHeading;
			scrollTocToActiveItem();
		}

		// 检查是否到达 related articles
		const relatedSection = document.getElementById('related-articles');
		if (relatedSection) {
			const rect = relatedSection.getBoundingClientRect();
			tocVisible = rect.top > window.innerHeight * 0.8;
		}
	}

	// 滚动TOC到活跃项目
	function scrollTocToActiveItem() {
		if (!activeHeading) return;
		
		const activeButton = document.querySelector(`[data-toc-id="${activeHeading}"]`);
		
		if (activeButton) {
			// 使用 scrollIntoView 更简单可靠
			activeButton.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			});
		}
	}

	// 设置滚动监听
	$effect(() => {
		if (typeof window !== 'undefined') {
			updateTocState();
			
			const handleScroll = () => {
				requestAnimationFrame(updateTocState);
			};
			
			window.addEventListener('scroll', handleScroll, { passive: true });
			
			return () => {
				window.removeEventListener('scroll', handleScroll);
			};
		}
	});

</script>

<svelte:head>
	<title>{post.title} - tenniszero.org</title>
	<meta name="description" content={post.description} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description} />
	<meta property="og:image" content={post.image || '/blog-placeholder.jpg'} />
	<meta property="og:type" content="article" />
</svelte:head>

<!-- Reading Progress Bar -->
<ReadingProgress target="article" />

<!-- Sticky TOC -->
{#if post.toc && post.toc.length > 0}
	<aside class="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:block z-50 transition-all duration-500 ease-out {tocVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-4 pointer-events-none'}">
		<div class="w-72 max-h-[70vh] theme-bg-card/70 dark:bg-gray-950/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
			<div class="px-5 py-6 max-h-full overflow-y-auto toc-scroll-container" style="scrollbar-width: none; -ms-overflow-style: none;">
				<style>
					.toc-scroll-container::-webkit-scrollbar {
						display: none;
					}
				</style>
				<div class="mb-5">
					<h3 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
						{staticTexts.tableOfContents}
					</h3>
					<div class="w-8 h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
				</div>
				<nav class="space-y-0.5">
					{#each post.toc as item}
						<button
							data-toc-id={item.id}
							onclick={() => scrollToHeading(item.id)}
							class="group relative flex items-start text-left w-full py-2.5 px-3 rounded-xl text-sm transition-all duration-300 {
								activeHeading === item.id
									? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 shadow-sm'
									: 'text-gray-500 dark:text-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 hover:text-gray-700 dark:hover:theme-text-muted'
							}"
							style="margin-left: {(item.level - 1) * 1}rem"
						>
							<!-- Active indicator -->
							<div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full transition-all duration-300 {
								activeHeading === item.id ? 'bg-gradient-to-b from-blue-500 to-purple-500 opacity-100' : 'opacity-0'
							}"></div>
							
							<!-- Dot indicator -->
							<div class="relative flex items-center justify-center w-2 h-2 mt-2.5 mr-3 flex-shrink-0">
								<div class="w-1.5 h-1.5 rounded-full transition-all duration-300 {
									activeHeading === item.id 
										? 'bg-blue-500 shadow-sm shadow-blue-500/30' 
										: 'bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-500 dark:group-hover:bg-gray-500'
								}"></div>
								{#if activeHeading === item.id}
									<div class="absolute w-2 h-2 rounded-full bg-blue-500/20 animate-pulse"></div>
								{/if}
							</div>
							
							<span class="leading-relaxed transition-all duration-300 {
								activeHeading === item.id 
									? 'font-semibold text-blue-700 dark:text-blue-300' 
									: 'font-normal opacity-70 group-hover:opacity-100'
							}">{item.text}</span>
						</button>
					{/each}
				</nav>
			</div>
		</div>
	</aside>
{/if}

<article class="theme-bg-card dark:theme-bg-muted px-6 py-16 sm:py-24 lg:px-8 min-h-screen">
	<div class="mx-auto max-w-7xl">
		<!-- Main Content Container -->
		<div class="mx-auto max-w-4xl">
			<div class="text-base leading-7 text-gray-700 dark:theme-text-muted">
				<!-- Breadcrumb -->
				<div class="mb-8">
					<Breadcrumb items={breadcrumbItems} />
				</div>
				
				<!-- Article header -->
				<div class="mb-8">
					<div class="flex items-center gap-x-4 text-xs mb-4">
						<time datetime={post.date} class="text-gray-500 dark:text-gray-400">
							{formatDate(post.date)}
						</time>
						<span class="text-gray-500 dark:text-gray-400">{post.readingTime} min read</span>
						{#each (post.tags || []) as tag}
							<span class="relative z-10 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 font-medium theme-text-muted dark:theme-text-muted">
								{tag}
							</span>
						{/each}
					</div>
					<h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:theme-text-primary sm:text-4xl">
						{post.title}
					</h1>
					<p class="mt-6 text-xl leading-8 theme-text-muted dark:theme-text-muted">
						{post.description}
					</p>
				</div>
				
				<!-- Cover image -->
				<div class="mb-8">
					{#if post.image}
						<img
							src={post.image}
							alt={post.title}
							class="aspect-[16/9] w-full rounded-2xl theme-bg-muted object-cover"
						/>
					{:else}
						<DefaultBlogImage
							title={post.title}
							class="aspect-[16/9] w-full rounded-2xl"
						/>
					{/if}
				</div>

				<!-- Author info -->
				<div class="flex items-center gap-x-4 mb-8 pb-8 border-b theme-border dark:theme-border">
					<Avatar name={post.author || 'Anonymous'} size={48} className="flex-shrink-0" />
					<div>
						<div class="font-semibold text-gray-900 dark:theme-text-primary">{post.author || 'Anonymous'}</div>
						<div class="text-sm theme-text-muted dark:text-gray-400">Author</div>
					</div>
				</div>


				<!-- Article content -->
				<div class="prose prose-lg dark:prose-invert max-w-none">
					{@html post.body}
				</div>
			</div>
		</div>
	</div>
</article>

<!-- Related Posts -->
{#if relatedPosts && relatedPosts.length > 0}
	<section id="related-articles" class="bg-gray-50 dark:bg-gray-800 py-16">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:theme-text-primary sm:text-4xl">{staticTexts.relatedArticles}</h2>
				<p class="mt-2 text-lg leading-8 theme-text-muted dark:theme-text-muted">
					{staticTexts.continueReading}
				</p>
			</div>
			<div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
				{#each relatedPosts as relatedPost}
					<article class="flex flex-col items-start justify-between">
						<div class="relative w-full">
							{#if relatedPost.image}
								<img
									src={relatedPost.image}
									alt={relatedPost.title}
									class="aspect-[16/9] w-full rounded-2xl theme-bg-muted object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
								/>
							{:else}
								<DefaultBlogImage
									title={relatedPost.title}
									class="aspect-[16/9] w-full rounded-2xl sm:aspect-[2/1] lg:aspect-[3/2]"
								/>
							{/if}
							<div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
						</div>
						<div class="max-w-xl">
							<div class="mt-8 flex items-center gap-x-4 text-xs">
								<time datetime={relatedPost.date} class="text-gray-500 dark:text-gray-400">
									{formatDate(relatedPost.date)}
								</time>
								{#each (relatedPost.tags || []) as tag}
									<span class="relative z-10 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 font-medium theme-text-muted dark:theme-text-muted">
										{tag}
									</span>
								{/each}
							</div>
							<div class="group relative">
								<h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:theme-text-primary group-hover:theme-text-muted dark:group-hover:theme-text-muted">
									<a href="/blog/{relatedPost.slug}">
										<span class="absolute inset-0"></span>
										{relatedPost.title}
									</a>
								</h3>
								<p class="mt-5 line-clamp-3 text-sm leading-6 theme-text-muted dark:theme-text-muted">
									{relatedPost.description}
								</p>
							</div>
							<div class="relative mt-8 flex items-center gap-x-4">
								<Avatar name={relatedPost.author || 'Anonymous'} size={40} className="flex-shrink-0" />
								<div class="text-sm leading-6">
									<p class="font-semibold text-gray-900 dark:theme-text-primary">
										<span class="absolute inset-0"></span>
										{relatedPost.author || 'Anonymous'}
									</p>
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}
