<script lang="ts">
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';
	import { type SiteType } from '$lib/stores/site-config';

	// 动态导入首页组件
	import ToolHomePage from '$lib/components/site-tool/ToolHomePage.svelte';
	import GameHomePage from '$lib/components/site-game/GameHomePage.svelte';
	import BlogHomePage from '$lib/components/site-blog/BlogHomePage.svelte';

	let { data }: { data: PageData } = $props();

	let currentLocale = $state(data.lang || 'en');
	let currentSiteType: SiteType = $state(data.siteConfig.type); // 直接从 load 函数获取 type

	// 组件映射
	const componentMap = {
		'site-tool': ToolHomePage,
		'site-game': GameHomePage,
		'site-blog': BlogHomePage
	};

	// Reduce motion for users who prefer it (保留，因为是客户端行为)
	if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		document.documentElement.style.setProperty('--animation-duration', '0s');
	}
</script>

<SEO
	title={data.generalSettings?.title || 'tenniszero.org'}
	description={data.generalSettings?.description || 'AI SAAS boilerplate for Non-Programmers with authentication, payments, dashboard, and AI integrations'}
	siteTitle={data.generalSettings?.title}
	siteUrl={data.generalSettings?.url}
	generalSeo={data.generalSettings?.seo}
/>

<div class="min-h-screen theme-bg-page" style="background-color: hsl(var(--background)) !important;">
	<!-- Navigation -->
	<Navbar siteName={data.generalSettings?.title} navigationData={data.navigationData} currentLang={currentLocale} />

	<!-- 动态渲染首页组件 -->
	{#if currentSiteType === 'site-game'}
		<GameHomePage gameConfig={data.gameConfig} />
	{:else if currentSiteType === 'site-blog'}
		<BlogHomePage {data} {currentLocale} />
	{:else}
		<!-- 默认工具类型首页 -->
		<ToolHomePage {data} {currentLocale} />
	{/if}
</div>
