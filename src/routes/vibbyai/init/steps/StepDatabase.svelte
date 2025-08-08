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
		PUBLIC_SUPABASE_URL: config.PUBLIC_SUPABASE_URL || '',
		PUBLIC_SUPABASE_ANON_KEY: config.PUBLIC_SUPABASE_ANON_KEY || '',
		SUPABASE_SERVICE_ROLE_KEY: config.SUPABASE_SERVICE_ROLE_KEY || ''
	});

	let testingConnection = $state(false);
	let connectionResult = $state<{ success: boolean; message: string } | null>(null);

	function updateConfig() {
		dispatch('update', formData);
	}

	function handleInputChange(key: keyof typeof formData, value: string) {
		formData[key] = value;
		updateConfig();
		// 清除之前的测试结果
		connectionResult = null;
	}

	async function testConnection() {
		if (!formData.PUBLIC_SUPABASE_URL || !formData.PUBLIC_SUPABASE_ANON_KEY) {
			connectionResult = {
				success: false,
				message: '请先填写 Supabase URL 和匿名密钥'
			};
			return;
		}

		testingConnection = true;
		connectionResult = null;

		try {
			const response = await fetch('/api/test-supabase', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					url: formData.PUBLIC_SUPABASE_URL,
					anonKey: formData.PUBLIC_SUPABASE_ANON_KEY,
					serviceKey: formData.SUPABASE_SERVICE_ROLE_KEY
				})
			});

			const result = await response.json();
			connectionResult = result;
		} catch (error) {
			connectionResult = {
				success: false,
				message: '连接测试失败：' + (error instanceof Error ? error.message : '未知错误')
			};
		} finally {
			testingConnection = false;
		}
	}

	function openSupabaseGuide() {
		window.open('https://supabase.com/docs/guides/getting-started', '_blank');
	}

	function isValidSupabaseUrl(url: string): boolean {
		return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url);
	}

	function isValidSupabaseKey(key: string): boolean {
		return /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key);
	}
</script>

<div class="space-y-6">
	<!-- Introduction -->
	<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Supabase 数据库配置</h3>
				<p class="text-sm text-blue-700 dark:text-blue-300">
					Supabase 是我们的主要数据库服务，用于存储用户数据、API 密钥和应用配置。
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

				<div class="relative">
					<input
						type={field.type}
						bind:value={formData[field.key as keyof typeof formData]}
						oninput={(e) => handleInputChange(field.key as keyof typeof formData, (e.target as HTMLInputElement).value)}
						placeholder={field.placeholder}
						class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary pr-10"
					/>
					
					<!-- Validation Icon -->
					{#if formData[field.key as keyof typeof formData]}
						{#if field.key === 'PUBLIC_SUPABASE_URL' && isValidSupabaseUrl(formData[field.key as keyof typeof formData])}
							<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
								<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						{:else if (field.key === 'PUBLIC_SUPABASE_ANON_KEY' || field.key === 'SUPABASE_SERVICE_ROLE_KEY') && isValidSupabaseKey(formData[field.key])}
							<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
								<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						{:else if formData[(field as any).key as keyof typeof formData].length > 10}
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
				{#if (field as any).required && !formData[(field as any).key as keyof typeof formData]}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">此字段是必需的</p>
				{:else if (field as any).key === 'PUBLIC_SUPABASE_URL' && formData[(field as any).key as keyof typeof formData] && !isValidSupabaseUrl(formData[(field as any).key as keyof typeof formData])}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Supabase URL（格式：https://xxx.supabase.co）</p>
				{:else if (field.key === 'PUBLIC_SUPABASE_ANON_KEY' || field.key === 'SUPABASE_SERVICE_ROLE_KEY') && formData[field.key] && !isValidSupabaseKey(formData[field.key])}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 JWT 格式密钥</p>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Test Connection -->
	<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
		<div class="flex items-center justify-between mb-3">
			<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary">连接测试</h4>
			<button
				onclick={testConnection}
				disabled={testingConnection || !formData.PUBLIC_SUPABASE_URL || !formData.PUBLIC_SUPABASE_ANON_KEY}
				class="px-4 py-2 bg-blue-600 theme-text-primary rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
			>
				{testingConnection ? '测试中...' : '测试连接'}
			</button>
		</div>

		{#if connectionResult}
			<div class="p-3 rounded-lg {connectionResult.success ? 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800'}">
				<div class="flex items-start space-x-2">
					<div class="flex-shrink-0 mt-0.5">
						{#if connectionResult.success}
							<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						{:else}
							<svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
							</svg>
						{/if}
					</div>
					<p class="text-sm {connectionResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}">
						{connectionResult.message}
					</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Setup Guide -->
	<div class="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">如何获取 Supabase 配置？</h4>
				<ol class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
					<li>访问 <a href="https://supabase.com" target="_blank" class="underline hover:no-underline">supabase.com</a> 并创建账户</li>
					<li>创建新项目或选择现有项目</li>
					<li>在项目设置 → API 中找到：
						<ul class="ml-4 mt-1 space-y-1 list-disc list-inside">
							<li><strong>URL</strong>：项目 URL</li>
							<li><strong>anon public</strong>：匿名密钥</li>
							<li><strong>service_role</strong>：服务角色密钥</li>
						</ul>
					</li>
				</ol>
				<button
					onclick={openSupabaseGuide}
					class="mt-3 text-sm text-yellow-800 dark:text-yellow-200 underline hover:no-underline"
				>
					查看详细指南 →
				</button>
			</div>
		</div>
	</div>

	<!-- Security Notice -->
	<div class="bg-red-50 dark:bg-red-900/50 rounded-lg p-4 border border-red-200 dark:border-red-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-1">安全提醒</h4>
				<p class="text-sm text-red-700 dark:text-red-300">
					服务角色密钥具有管理员权限，请妥善保管。不要在客户端代码中使用服务角色密钥。
				</p>
			</div>
		</div>
	</div>
</div>
