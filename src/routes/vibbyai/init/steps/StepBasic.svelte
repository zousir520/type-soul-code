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
		NODE_ENV: config.NODE_ENV || 'development',
		PUBLIC_SITE_URL: config.PUBLIC_SITE_URL || ''
	});

	function updateConfig() {
		dispatch('update', formData);
	}

	function handleInputChange(key: keyof typeof formData, value: string) {
		formData[key] = value;
		updateConfig();
	}

	function detectSiteUrl() {
		if (typeof window !== 'undefined') {
			const url = window.location.origin;
			formData.PUBLIC_SITE_URL = url;
			updateConfig();
		}
	}
</script>

<div class="space-y-6">
	<!-- Welcome Message -->
	<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">欢迎使用 tenniszero.org</h3>
				<p class="text-sm text-blue-700 dark:text-blue-300">
					让我们从基础配置开始。这些设置将决定您的应用如何运行和访问。
				</p>
			</div>
		</div>
	</div>

	<!-- Form Fields -->
	<div class="space-y-4">
		{#each (step.fields || []) as field}
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
					{field.label}
					{#if field.required}
						<span class="text-red-500">*</span>
					{/if}
				</label>

				{#if field.type === 'select' && field.options}
					<select
						bind:value={formData[field.key as keyof typeof formData]}
						onchange={(e) => handleInputChange(field.key as keyof typeof formData, (e.target as HTMLSelectElement).value)}
						class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary"
					>
						<option value="">请选择...</option>
						{#each field.options as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				{:else}
					<div class="relative">
						<input
							type={field.type}
							bind:value={formData[field.key as keyof typeof formData]}
							oninput={(e) => {
								const target = e.target as HTMLInputElement;
								if (target) {
									handleInputChange(field.key as keyof typeof formData, target.value);
								}
							}}
							placeholder={field.placeholder}
							class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary"
						/>
						
						{#if field.key === 'PUBLIC_SITE_URL'}
							<button
								type="button"
								onclick={detectSiteUrl}
								class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
							>
								自动检测
							</button>
						{/if}
					</div>
				{/if}

				{#if field.description}
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
				{/if}

				<!-- Validation Messages -->
				{#if (field as any).required && !formData[(field as any).key as keyof typeof formData]}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">此字段是必需的</p>
				{:else if (field as any).key === 'PUBLIC_SITE_URL' && formData[(field as any).key as keyof typeof formData] && !/^https?:\/\/.+/.test(formData[(field as any).key as keyof typeof formData])}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 URL（包含 http:// 或 https://）</p>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Environment Info -->
	<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
		<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary mb-3">环境说明</h4>
		<div class="space-y-2 text-sm theme-text-muted dark:text-gray-400">
			<div class="flex items-start space-x-2">
				<span class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
				<div>
					<strong>开发环境 (development):</strong> 用于本地开发，启用调试功能和详细日志
				</div>
			</div>
			<div class="flex items-start space-x-2">
				<span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
				<div>
					<strong>测试环境 (staging):</strong> 用于测试部署，模拟生产环境但允许实验性功能
				</div>
			</div>
			<div class="flex items-start space-x-2">
				<span class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
				<div>
					<strong>生产环境 (production):</strong> 用于正式部署，优化性能和安全性
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Setup Tips -->
	<div class="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">快速设置提示</h4>
				<ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
					<li>• 如果您在本地开发，选择"开发环境"</li>
					<li>• 网站 URL 应该是用户访问您网站的完整地址</li>
					<li>• 点击"自动检测"可以快速填入当前访问的 URL</li>
				</ul>
			</div>
		</div>
	</div>
</div>
