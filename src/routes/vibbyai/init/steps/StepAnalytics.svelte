<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { EnvConfig, ConfigStep } from '$lib/types/env-config';

	interface Props {
		config: EnvConfig;
		step: ConfigStep;
	}

	let { config, step }: Props = $props();

	const dispatch = createEventDispatcher();

	let formData = $state({
		GOOGLE_ANALYTICS_ID: config.GOOGLE_ANALYTICS_ID || '',
		MICROSOFT_CLARITY_ID: config.MICROSOFT_CLARITY_ID || ''
	});

	function updateConfig() {
		dispatch('update', formData);
	}

	function handleInputChange(key: keyof typeof formData, value: string) {
		formData[key] = value;
		updateConfig();
	}

	function isValidGAId(id: string): boolean {
		return /^G-[A-Z0-9]{10}$/.test(id);
	}

	function isValidClarityId(id: string): boolean {
		return /^[a-z0-9]{10}$/.test(id);
	}
</script>

<div class="space-y-6">
	<!-- Introduction -->
	<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">网站分析配置</h3>
				<p class="text-sm text-blue-700 dark:text-blue-300">
					配置网站分析工具来了解用户行为、流量来源和网站性能。此步骤是可选的。
				</p>
			</div>
		</div>
	</div>

	<!-- Form Fields -->
	<div class="space-y-6">
		{#each (step.fields || []) as field}
			<div class="theme-bg-card dark:theme-bg-muted rounded-lg border theme-border dark:border-gray-800 p-4">
				<div class="flex items-start space-x-3 mb-4">
					{#if (field as any).key === 'GOOGLE_ANALYTICS_ID'}
						<div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="currentColor">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
						</div>
						<div>
							<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary">Google Analytics</h4>
							<p class="text-sm text-gray-500 dark:text-gray-400">跟踪网站流量、用户行为和转化率</p>
						</div>
					{:else if (field as any).key === 'MICROSOFT_CLARITY_ID'}
						<div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
								<path d="M0 0h11v11H0zm13 0h11v11H13zM0 13h11v11H0zm13 0h11v11H13z"/>
							</svg>
						</div>
						<div>
							<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary">Microsoft Clarity</h4>
							<p class="text-sm text-gray-500 dark:text-gray-400">用户会话录制、热力图和行为分析</p>
						</div>
					{/if}
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						{(field as any).label}
					</label>

					<div class="relative">
						<input
							type={(field as any).type}
							bind:value={formData[(field as any).key as keyof typeof formData]}
							oninput={(e) => handleInputChange((field as any).key as keyof typeof formData, (e.target as HTMLInputElement).value)}
							placeholder={(field as any).placeholder}
							class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary pr-10"
						/>
						
						<!-- Validation Icon -->
						{#if formData[(field as any).key as keyof typeof formData]}
							{#if ((field as any).key === 'GOOGLE_ANALYTICS_ID' && isValidGAId(formData[(field as any).key as keyof typeof formData])) || ((field as any).key === 'MICROSOFT_CLARITY_ID' && isValidClarityId(formData[(field as any).key as keyof typeof formData]))}
								<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
									<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							{:else if formData[(field as any).key as keyof typeof formData].length > 5}
								<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
									<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
									</svg>
								</div>
							{/if}
						{/if}
					</div>

					{#if field.description}
						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
					{/if}

					<!-- Validation Messages -->
					{#if field.key === 'GOOGLE_ANALYTICS_ID' && formData[field.key] && !isValidGAId(formData[field.key])}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Google Analytics ID（格式：G-XXXXXXXXXX）</p>
					{:else if field.key === 'MICROSOFT_CLARITY_ID' && formData[field.key] && !isValidClarityId(formData[field.key])}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Microsoft Clarity ID（10位小写字母数字）</p>
					{/if}

					<!-- Setup Guide -->
					{#if field.key === 'GOOGLE_ANALYTICS_ID'}
						<div class="mt-3 p-3 bg-orange-50 dark:bg-orange-900/50 rounded-lg border border-orange-200 dark:border-orange-800">
							<h5 class="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">如何获取 Google Analytics ID？</h5>
							<ol class="text-sm text-orange-700 dark:text-orange-300 space-y-1 list-decimal list-inside">
								<li>访问 <a href="https://analytics.google.com" target="_blank" class="underline hover:no-underline">Google Analytics</a></li>
								<li>创建账户和属性</li>
								<li>选择"网站"平台</li>
								<li>在"数据流"中找到测量 ID（格式：G-XXXXXXXXXX）</li>
							</ol>
						</div>
					{:else if field.key === 'MICROSOFT_CLARITY_ID'}
						<div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
							<h5 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">如何获取 Microsoft Clarity ID？</h5>
							<ol class="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
								<li>访问 <a href="https://clarity.microsoft.com" target="_blank" class="underline hover:no-underline">Microsoft Clarity</a></li>
								<li>使用 Microsoft 账户登录</li>
								<li>创建新项目并添加您的网站</li>
								<li>在项目设置中找到项目 ID（10位字符）</li>
							</ol>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<!-- Benefits -->
	<div class="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
		<h4 class="text-sm font-medium text-green-800 dark:text-green-200 mb-3">分析工具的好处</h4>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
			<div>
				<h5 class="font-medium mb-2">Google Analytics</h5>
				<ul class="space-y-1 list-disc list-inside">
					<li>详细的流量统计</li>
					<li>用户行为分析</li>
					<li>转化跟踪</li>
					<li>实时数据监控</li>
				</ul>
			</div>
			<div>
				<h5 class="font-medium mb-2">Microsoft Clarity</h5>
				<ul class="space-y-1 list-disc list-inside">
					<li>用户会话录制</li>
					<li>点击热力图</li>
					<li>滚动行为分析</li>
					<li>完全免费使用</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Privacy Notice -->
	<div class="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">隐私提醒</h4>
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					启用分析工具会收集用户数据。请确保您的隐私政策中包含相关说明，并遵守当地的数据保护法规（如 GDPR、CCPA 等）。
				</p>
			</div>
		</div>
	</div>

	<!-- Skip Notice -->
	<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border theme-border dark:theme-border">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">可以稍后配置</h4>
				<p class="text-sm theme-text-muted dark:text-gray-400">
					分析工具不是必需的，您可以跳过此步骤并在网站运行后再配置。
					这些工具主要用于了解网站性能和用户行为。
				</p>
			</div>
		</div>
	</div>
</div>
