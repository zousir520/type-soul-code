<script lang="ts">
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';
	import { type SiteType } from '$lib/stores/site-config';

	// 动态导入首页组件
	import BlogHomePage from '$lib/components/site-blog/BlogHomePage.svelte';

	let { data }: { data: PageData } = $props();

	let currentLocale = $state('en');
	let currentSiteType: SiteType = $state('site-blog'); // 强制设置为 blog 模式
</script>

<SEO 
	title="Blog Mode Preview - tenniszero.org"
	description="Preview of Blog mode homepage"
	robots="noindex, nofollow"
/>

<!-- 预览模式提示条 -->
<div class="bg-green-600 theme-text-primary text-center py-2 px-4 text-sm font-medium">
	📝 预览模式：Blog 模式 - 此页面不会被搜索引擎索引
	<a href="/vibbyai/sitemode" class="ml-4 underline hover:no-underline">返回模式设置</a>
</div>

<div class="min-h-screen theme-bg-page" style="background-color: hsl(var(--background)) !important;">
	<!-- Navigation -->
	<Navbar siteName={data.generalSettings?.title} navigationData={data.navigationData} currentLang={currentLocale} />

	<!-- 强制显示 Blog 首页 -->
	<BlogHomePage {data} {currentLocale} />
</div>
