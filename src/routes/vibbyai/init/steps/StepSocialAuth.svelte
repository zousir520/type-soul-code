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
		GITHUB_CLIENT_ID: config.GITHUB_CLIENT_ID || '',
		GITHUB_CLIENT_SECRET: config.GITHUB_CLIENT_SECRET || '',
		GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID || '',
		GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET || ''
	});

	function updateConfig() {
		dispatch('update', formData);
	}

	function handleInputChange(key: keyof typeof formData, value: string) {
		formData[key] = value;
		updateConfig();
	}

	function isValidGitHubClientId(id: string): boolean {
		return /^Iv1\.[a-f0-9]{16}$/.test(id);
	}

	function isValidGoogleClientId(id: string): boolean {
		return /^[0-9]+-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(id);
	}

	function isValidGoogleClientSecret(secret: string): boolean {
		return /^GOCSPX-[a-zA-Z0-9_-]+$/.test(secret);
	}
</script>

<div class="space-y-6">
	<!-- Introduction -->
	<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">社交登录配置</h3>
				<p class="text-sm text-blue-700 dark:text-blue-300">
					配置 GitHub 和 Google 社交登录，让用户可以使用现有账户快速注册和登录。此步骤是可选的。
				</p>
			</div>
		</div>
	</div>

	<!-- GitHub OAuth -->
	<div class="theme-bg-card dark:theme-bg-muted rounded-lg border theme-border dark:border-gray-800 p-6">
		<div class="flex items-start space-x-3 mb-4">
			<div class="w-10 h-10 theme-bg-muted dark:theme-bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
				<svg class="w-6 h-6 theme-text-primary dark:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
			</div>
			<div>
				<h4 class="text-lg font-medium text-gray-900 dark:theme-text-primary">GitHub OAuth</h4>
				<p class="text-sm text-gray-500 dark:text-gray-400">让用户使用 GitHub 账户登录</p>
			</div>
		</div>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
					GitHub Client ID
				</label>
				<div class="relative">
					<input
						type="text"
						bind:value={formData.GITHUB_CLIENT_ID}
						oninput={(e) => handleInputChange('GITHUB_CLIENT_ID', (e.target as HTMLInputElement).value)}
						placeholder="Iv1.xxxxxxxxxxxxxxxx"
						class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary pr-10"
					/>
					{#if formData.GITHUB_CLIENT_ID && isValidGitHubClientId(formData.GITHUB_CLIENT_ID)}
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					{/if}
				</div>
				{#if formData.GITHUB_CLIENT_ID && !isValidGitHubClientId(formData.GITHUB_CLIENT_ID)}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 GitHub Client ID（格式：Iv1.xxxxxxxxxxxxxxxx）</p>
				{/if}
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
					GitHub Client Secret
				</label>
				<input
					type="password"
					bind:value={formData.GITHUB_CLIENT_SECRET}
					oninput={(e) => handleInputChange('GITHUB_CLIENT_SECRET', (e.target as HTMLInputElement).value)}
					placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
					class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary"
				/>
			</div>
		</div>

		<!-- GitHub Setup Guide -->
		<div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
			<h5 class="text-sm font-medium text-gray-900 dark:theme-text-primary mb-2">如何创建 GitHub OAuth 应用？</h5>
			<ol class="text-sm theme-text-muted dark:text-gray-400 space-y-1 list-decimal list-inside">
				<li>访问 <a href="https://github.com/settings/developers" target="_blank" class="text-blue-600 dark:text-blue-400 underline hover:no-underline">GitHub Developer Settings</a></li>
				<li>点击 "New OAuth App"</li>
				<li>填写应用信息：
					<ul class="ml-4 mt-1 space-y-1 list-disc list-inside">
						<li>Application name: tenniszero.org</li>
						<li>Homepage URL: {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}</li>
						<li>Authorization callback URL: {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/auth/callback/github</li>
					</ul>
				</li>
				<li>创建后复制 Client ID 和 Client Secret</li>
			</ol>
		</div>
	</div>

	<!-- Google OAuth -->
	<div class="theme-bg-card dark:theme-bg-muted rounded-lg border theme-border dark:border-gray-800 p-6">
		<div class="flex items-start space-x-3 mb-4">
			<div class="w-10 h-10 theme-bg-card rounded-lg flex items-center justify-center flex-shrink-0 border theme-border">
				<svg class="w-6 h-6" viewBox="0 0 24 24">
					<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
					<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
			</div>
			<div>
				<h4 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Google OAuth</h4>
				<p class="text-sm text-gray-500 dark:text-gray-400">让用户使用 Google 账户登录</p>
			</div>
		</div>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
					Google Client ID
				</label>
				<div class="relative">
					<input
						type="text"
						bind:value={formData.GOOGLE_CLIENT_ID}
						oninput={(e) => handleInputChange('GOOGLE_CLIENT_ID', (e.target as HTMLInputElement).value)}
						placeholder="xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
						class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary pr-10"
					/>
					{#if formData.GOOGLE_CLIENT_ID && isValidGoogleClientId(formData.GOOGLE_CLIENT_ID)}
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					{/if}
				</div>
				{#if formData.GOOGLE_CLIENT_ID && !isValidGoogleClientId(formData.GOOGLE_CLIENT_ID)}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Google Client ID</p>
				{/if}
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
					Google Client Secret
				</label>
				<div class="relative">
					<input
						type="password"
						bind:value={formData.GOOGLE_CLIENT_SECRET}
						oninput={(e) => handleInputChange('GOOGLE_CLIENT_SECRET', (e.target as HTMLInputElement).value)}
						placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
						class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary pr-10"
					/>
					{#if formData.GOOGLE_CLIENT_SECRET && isValidGoogleClientSecret(formData.GOOGLE_CLIENT_SECRET)}
						<div class="absolute right-3 top-1/2 transform -translate-y-1/2">
							<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					{/if}
				</div>
				{#if formData.GOOGLE_CLIENT_SECRET && !isValidGoogleClientSecret(formData.GOOGLE_CLIENT_SECRET)}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Google Client Secret（格式：GOCSPX-...）</p>
				{/if}
			</div>
		</div>

		<!-- Google Setup Guide -->
		<div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
			<h5 class="text-sm font-medium text-gray-900 dark:theme-text-primary mb-2">如何创建 Google OAuth 应用？</h5>
			<ol class="text-sm theme-text-muted dark:text-gray-400 space-y-1 list-decimal list-inside">
				<li>访问 <a href="https://console.cloud.google.com" target="_blank" class="text-blue-600 dark:text-blue-400 underline hover:no-underline">Google Cloud Console</a></li>
				<li>创建新项目或选择现有项目</li>
				<li>启用 Google+ API</li>
				<li>在"凭据"中创建 OAuth 2.0 客户端 ID</li>
				<li>配置授权重定向 URI: {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/auth/callback/google</li>
				<li>复制 Client ID 和 Client Secret</li>
			</ol>
		</div>
	</div>

	<!-- Benefits -->
	<div class="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
		<h4 class="text-sm font-medium text-green-800 dark:text-green-200 mb-3">社交登录的好处</h4>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
			<div>
				<h5 class="font-medium mb-2">用户体验</h5>
				<ul class="space-y-1 list-disc list-inside">
					<li>无需记住新密码</li>
					<li>快速注册和登录</li>
					<li>减少注册流程摩擦</li>
					<li>提高转化率</li>
				</ul>
			</div>
			<div>
				<h5 class="font-medium mb-2">安全性</h5>
				<ul class="space-y-1 list-disc list-inside">
					<li>OAuth 2.0 标准协议</li>
					<li>无需存储用户密码</li>
					<li>依赖可信的身份提供商</li>
					<li>减少安全风险</li>
				</ul>
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
					社交登录不是必需的，用户仍然可以使用邮箱和密码注册。您可以跳过此步骤并在需要时再配置社交登录。
				</p>
			</div>
		</div>
	</div>
</div>
