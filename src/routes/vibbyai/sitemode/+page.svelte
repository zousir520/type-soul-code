<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { SiteType } from '$lib/stores/site-config';

	let currentSiteType: SiteType = $state('site-tool');
	let configSource: string = $state('default');
	let loading = $state(false);
	let message = $state('');

	// 加载当前站点配置
	async function loadSiteConfig() {
		loading = true;
		try {
			const response = await fetch('/api/site-config');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			currentSiteType = data.type || 'site-tool';
			configSource = data.source || 'default';
		} catch (error) {
			console.error('Error loading site config:', error);
			message = '加载站点配置失败';
		} finally {
			loading = false;
		}
	}

	// 获取站点模式名称
	function getSiteModeName(type: SiteType): string {
		switch (type) {
			case 'site-tool': return 'Tool';
			case 'site-game': return 'Game';
			case 'site-blog': return 'Blog';
			default: return 'Unknown';
		}
	}

	// 获取站点模式描述
	function getSiteModeDescription(type: SiteType): string {
		switch (type) {
			case 'site-tool': return '工具型网站，专注于提供实用的在线工具和服务';
			case 'site-game': return '游戏型网站，展示和运行各种在线游戏';
			case 'site-blog': return '博客型网站，专注于内容发布和文章分享';
			default: return '';
		}
	}

	// 获取站点模式图标
	function getSiteModeIcon(type: SiteType): string {
		switch (type) {
			case 'site-tool': return '🛠️';
			case 'site-game': return '🎮';
			case 'site-blog': return '📝';
			default: return '❓';
		}
	}

	// 获取配置源描述
	function getConfigSourceDescription(source: string): string {
		switch (source) {
			case 'environment': return '环境变量';
			case 'file': return '配置文件';
			case 'default': return '默认配置';
			default: return '未知来源';
		}
	}

	// 获取配置源颜色
	function getConfigSourceColor(source: string): string {
		switch (source) {
			case 'environment': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
			case 'file': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
			case 'default': return 'theme-bg-muted text-gray-800 dark:theme-bg-muted/20 dark:theme-text-muted';
			default: return 'theme-bg-muted text-gray-800 dark:theme-bg-muted/20 dark:theme-text-muted';
		}
	}

	onMount(() => {
		loadSiteConfig();
	});
</script>

<svelte:head>
	<title>Site Mode - tenniszero.org Dashboard</title>
	<meta name="description" content="查看当前网站模式配置：Tool、Game、Blog" />
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">Site Mode</h1>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				查看当前网站模式配置（仅通过环境变量控制，无法在后台更改）
			</p>
		</div>
		<div class="flex items-center space-x-3">
			{#if loading}
				<div class="text-sm text-gray-500">加载中...</div>
			{:else}
				<Badge variant="outline" class="text-sm">
					当前模式: {getSiteModeName(currentSiteType)}
				</Badge>
				<Badge class={getConfigSourceColor(configSource)}>
					{getConfigSourceDescription(configSource)}
				</Badge>
			{/if}
		</div>
	</div>

	<!-- 重要提示横幅 -->
	<div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
		<div class="flex items-start gap-3">
			<svg class="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
			</svg>
			<div>
				<h3 class="font-medium text-amber-800 dark:text-amber-200">重要说明：Site Mode 配置为只读模式</h3>
				<div class="mt-2 text-sm text-amber-700 dark:text-amber-300">
					<ul class="list-disc list-inside space-y-1">
						<li><strong>不能在后台更改</strong>：Site Mode 只能通过环境变量 PUBLIC_SITE_TYPE 控制</li>
						<li><strong>需要重新部署</strong>：修改环境变量后必须重新部署应用才能生效</li>
						<li><strong>安全考虑</strong>：防止运行时意外修改站点类型影响用户体验</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	{#if message}
		<div class="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
			<p class="text-red-800 dark:text-red-200">{message}</p>
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p class="text-gray-500 dark:text-gray-400">加载配置中...</p>
		</div>
	{:else}
		<!-- 当前模式展示 -->
		<Card class="theme-bg-card dark:bg-gray-600 border theme-border dark:border-gray-500">
			<CardHeader>
				<CardTitle class="flex items-center gap-3">
					<span class="text-4xl">{getSiteModeIcon(currentSiteType)}</span>
					当前网站模式：{getSiteModeName(currentSiteType)}
				</CardTitle>
				<CardDescription>
					{getSiteModeDescription(currentSiteType)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-2">模式类型</h4>
							<p class="text-sm theme-text-muted dark:text-gray-400">{currentSiteType}</p>
						</div>
						<div>
							<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-2">配置来源</h4>
							<Badge class={getConfigSourceColor(configSource)}>
								{getConfigSourceDescription(configSource)}
							</Badge>
						</div>
						<div class="flex items-center">
							<a
								href="/noindex/mode-{currentSiteType}"
								target="_blank"
								class="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
							>
								<svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								预览当前模式
							</a>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- 环境变量配置说明 -->
		<Card class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
			<CardHeader>
				<CardTitle class="flex items-center gap-2 text-blue-800 dark:text-blue-200">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					如何修改站点模式
				</CardTitle>
				<CardDescription class="text-blue-600 dark:text-blue-300">
					站点模式现在通过环境变量控制，确保配置的安全性和一致性
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-6">
					<!-- 本地开发 -->
					<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
						<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-3 flex items-center gap-2">
							💻 本地开发环境
						</h4>
						<div class="space-y-3">
							<p class="text-sm theme-text-muted dark:text-gray-400">
								在项目根目录创建或编辑 <code class="theme-bg-muted dark:bg-gray-700 px-2 py-1 rounded">.env.local</code> 文件：
							</p>
							<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
								<code class="text-sm font-mono text-gray-800 dark:text-gray-200">
									PUBLIC_SITE_TYPE=site-game
								</code>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								修改后需要重启开发服务器：<code class="theme-bg-muted dark:bg-gray-700 px-1 rounded">npm run dev</code>
							</p>
						</div>
					</div>

					<!-- 生产环境 -->
					<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
						<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-3 flex items-center gap-2">
							🚀 生产环境（Vercel）
						</h4>
						<div class="space-y-3">
							<ol class="text-sm theme-text-muted dark:text-gray-400 space-y-2">
								<li class="flex items-start gap-2">
									<span class="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs flex items-center justify-center font-semibold">1</span>
									登录 Vercel Dashboard
								</li>
								<li class="flex items-start gap-2">
									<span class="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs flex items-center justify-center font-semibold">2</span>
									进入项目设置 → Environment Variables
								</li>
								<li class="flex items-start gap-2">
									<span class="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs flex items-center justify-center font-semibold">3</span>
									添加变量：<code class="theme-bg-muted dark:bg-gray-700 px-2 py-1 rounded">PUBLIC_SITE_TYPE</code>
								</li>
								<li class="flex items-start gap-2">
									<span class="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs flex items-center justify-center font-semibold">4</span>
									重新部署应用
								</li>
							</ol>
						</div>
					</div>

					<!-- 支持的值 -->
					<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
						<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-3">📋 支持的配置值</h4>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div class="text-2xl mb-2">🛠️</div>
								<code class="text-sm theme-bg-muted dark:bg-gray-600 px-2 py-1 rounded">site-tool</code>
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">工具型网站</p>
							</div>
							<div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div class="text-2xl mb-2">🎮</div>
								<code class="text-sm theme-bg-muted dark:bg-gray-600 px-2 py-1 rounded">site-game</code>
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">游戏型网站</p>
							</div>
							<div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div class="text-2xl mb-2">📝</div>
								<code class="text-sm theme-bg-muted dark:bg-gray-600 px-2 py-1 rounded">site-blog</code>
								<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">博客型网站</p>
							</div>
						</div>
					</div>

					<!-- 配置方式说明 -->
					<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
						<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-3">⚡ 唯一配置方式</h4>
						<div class="flex items-center gap-3 text-sm">
							<Badge class="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">唯一</Badge>
							<span class="theme-text-muted dark:text-gray-400">环境变量</span>
							<code class="theme-bg-muted dark:bg-gray-700 px-2 py-1 rounded text-xs">PUBLIC_SITE_TYPE</code>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
							📝 配置文件和数据库配置已移除，仅通过环境变量控制确保安全性
						</p>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- 模式详情说明 -->
		<Card class="theme-bg-card dark:bg-gray-600 border theme-border dark:border-gray-500">
			<CardHeader>
				<CardTitle>模式详情说明</CardTitle>
				<CardDescription>了解不同网站模式的特点和适用场景</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="space-y-6">
					<!-- Tool Mode Info -->
					<div class="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg {currentSiteType === 'site-tool' ? 'border-2 border-blue-500' : ''}">
						<div class="text-2xl">{getSiteModeIcon('site-tool')}</div>
						<div class="flex-1">
							<h4 class="font-semibold text-gray-900 dark:theme-text-primary mb-2">Tool 模式</h4>
							<p class="text-sm theme-text-muted dark:text-gray-400 mb-3">
								适合提供在线工具、SaaS 服务、API 接口等功能性网站。专注于实用性和用户体验。
							</p>
							<div class="flex flex-wrap gap-2">
								<Badge variant="secondary">在线工具</Badge>
								<Badge variant="secondary">SaaS 服务</Badge>
								<Badge variant="secondary">API 文档</Badge>
								<Badge variant="secondary">功能展示</Badge>
							</div>
						</div>
					</div>

					<!-- Game Mode Info -->
					<div class="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg {currentSiteType === 'site-game' ? 'border-2 border-blue-500' : ''}">
						<div class="text-2xl">{getSiteModeIcon('site-game')}</div>
						<div class="flex-1">
							<h4 class="font-semibold text-gray-900 dark:theme-text-primary mb-2">Game 模式</h4>
							<p class="text-sm theme-text-muted dark:text-gray-400 mb-3">
								专为游戏展示和运行设计，支持嵌入式游戏、下载链接、视频预览等多种展示方式。
							</p>
							<div class="flex flex-wrap gap-2">
								<Badge variant="secondary">在线游戏</Badge>
								<Badge variant="secondary">游戏下载</Badge>
								<Badge variant="secondary">视频预览</Badge>
								<Badge variant="secondary">游戏社区</Badge>
							</div>
						</div>
					</div>

					<!-- Blog Mode Info -->
					<div class="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg {currentSiteType === 'site-blog' ? 'border-2 border-blue-500' : ''}">
						<div class="text-2xl">{getSiteModeIcon('site-blog')}</div>
						<div class="flex-1">
							<h4 class="font-semibold text-gray-900 dark:theme-text-primary mb-2">Blog 模式</h4>
							<p class="text-sm theme-text-muted dark:text-gray-400 mb-3">
								专注于内容发布和文章分享，支持多语言博客、分类管理、标签系统等功能。
							</p>
							<div class="flex flex-wrap gap-2">
								<Badge variant="secondary">文章发布</Badge>
								<Badge variant="secondary">分类管理</Badge>
								<Badge variant="secondary">标签系统</Badge>
								<Badge variant="secondary">多语言</Badge>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
