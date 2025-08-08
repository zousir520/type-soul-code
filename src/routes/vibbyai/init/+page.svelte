<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let currentStep = 0;
	let loading = false;
	let message = '';
	let saveStatus = '';

	// 配置数据
	let config = {
		// 基本配置
		NODE_ENV: 'development',
		PUBLIC_SITE_URL: '',

		// Supabase 配置
		PUBLIC_SUPABASE_URL: '',
		PUBLIC_SUPABASE_ANON_KEY: '',
		SUPABASE_SERVICE_ROLE_KEY: '',

		// 安全配置
		ENCRYPTION_SECRET: '',

		// 邮件配置
		SMTP_HOST: '',
		SMTP_PORT: '',
		SMTP_USER: '',
		SMTP_PASS: '',
		SMTP_FROM: '',

		// 分析工具
		GOOGLE_ANALYTICS_ID: '',
		MICROSOFT_CLARITY_ID: '',

		// OAuth 配置
		GITHUB_CLIENT_ID: '',
		GITHUB_CLIENT_SECRET: '',
		GOOGLE_CLIENT_ID: '',
		GOOGLE_CLIENT_SECRET: ''
	};

	const steps = [
		{
			id: 'basic',
			title: '基本配置',
			description: '基本配置',
			icon: '🏠'
		},
		{
			id: 'database',
			title: '数据库配置',
			description: '数据库配置',
			icon: '💾'
		},
		{
			id: 'analytics',
			title: '分析工具',
			description: '分析工具',
			icon: '📊'
		},
		{
			id: 'oauth',
			title: 'OAuth 配置',
			description: 'OAuth 配置',
			icon: '🔑'
		},
		{
			id: 'complete',
			title: '完成',
			description: '完成',
			icon: '✅'
		}
	];

	// 加载当前配置
	async function loadConfig() {
		try {
			loading = true;
			const response = await fetch('/api/env-config');
			const result = await response.json();

			if (result.success) {
				// 只更新空字段，保留用户已输入的内容
				const loadedConfig = result.data;

				// 手动更新每个字段，只有当前值为空时才使用加载的值
				if (!config.PUBLIC_SITE_URL && loadedConfig.PUBLIC_SITE_URL) {
					config.PUBLIC_SITE_URL = loadedConfig.PUBLIC_SITE_URL;
				}
				if (!config.PUBLIC_SUPABASE_URL && loadedConfig.PUBLIC_SUPABASE_URL) {
					config.PUBLIC_SUPABASE_URL = loadedConfig.PUBLIC_SUPABASE_URL;
				}
				if (!config.PUBLIC_SUPABASE_ANON_KEY && loadedConfig.PUBLIC_SUPABASE_ANON_KEY) {
					config.PUBLIC_SUPABASE_ANON_KEY = loadedConfig.PUBLIC_SUPABASE_ANON_KEY;
				}
				if (!config.SUPABASE_SERVICE_ROLE_KEY && loadedConfig.SUPABASE_SERVICE_ROLE_KEY) {
					config.SUPABASE_SERVICE_ROLE_KEY = loadedConfig.SUPABASE_SERVICE_ROLE_KEY;
				}
				if (!config.ENCRYPTION_SECRET && loadedConfig.ENCRYPTION_SECRET && !loadedConfig.ENCRYPTION_SECRET.includes('***已设置***')) {
					config.ENCRYPTION_SECRET = loadedConfig.ENCRYPTION_SECRET;
				}
				if (!config.SMTP_HOST && loadedConfig.SMTP_HOST) {
					config.SMTP_HOST = loadedConfig.SMTP_HOST;
				}
				if (!config.SMTP_PORT && loadedConfig.SMTP_PORT) {
					config.SMTP_PORT = loadedConfig.SMTP_PORT;
				}
				if (!config.SMTP_USER && loadedConfig.SMTP_USER) {
					config.SMTP_USER = loadedConfig.SMTP_USER;
				}
				if (!config.SMTP_FROM && loadedConfig.SMTP_FROM) {
					config.SMTP_FROM = loadedConfig.SMTP_FROM;
				}
				if (!config.GOOGLE_ANALYTICS_ID && loadedConfig.GOOGLE_ANALYTICS_ID) {
					config.GOOGLE_ANALYTICS_ID = loadedConfig.GOOGLE_ANALYTICS_ID;
				}
				if (!config.MICROSOFT_CLARITY_ID && loadedConfig.MICROSOFT_CLARITY_ID) {
					config.MICROSOFT_CLARITY_ID = loadedConfig.MICROSOFT_CLARITY_ID;
				}
				if (!config.GITHUB_CLIENT_ID && loadedConfig.GITHUB_CLIENT_ID) {
					config.GITHUB_CLIENT_ID = loadedConfig.GITHUB_CLIENT_ID;
				}
				if (!config.GOOGLE_CLIENT_ID && loadedConfig.GOOGLE_CLIENT_ID) {
					config.GOOGLE_CLIENT_ID = loadedConfig.GOOGLE_CLIENT_ID;
				}

				message = '';
			} else {
				message = 'Failed to load current configuration';
			}
		} catch (error) {
			console.error('Error loading config:', error);
			message = 'Error loading configuration';
		} finally {
			loading = false;
		}
	}

	// 保存配置
	async function saveConfig() {
		try {
			loading = true;
			saveStatus = 'saving';

			const response = await fetch('/api/env-config', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(config)
			});

			const result = await response.json();

			if (result.success) {
				saveStatus = 'success';
				message = 'Configuration saved successfully!';
				setTimeout(() => {
					saveStatus = '';
				}, 3000);
			} else {
				saveStatus = 'error';
				// 显示详细的验证错误
				if (result.details && result.details.length > 0) {
					message = result.error + ':\n' + result.details.join('\n');
				} else {
					message = result.error || 'Failed to save configuration';
				}
			}
		} catch (error) {
			console.error('Error saving config:', error);
			saveStatus = 'error';
			message = 'Error saving configuration';
		} finally {
			loading = false;
		}
	}



	// 验证当前步骤
	function validateCurrentStep(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (currentStep === 0) {
			// 基础配置验证
			if (!config.NODE_ENV) errors.push('运行环境是必需的');
			if (!config.PUBLIC_SITE_URL) errors.push('网站 URL 是必需的');
		} else if (currentStep === 1) {
			// 数据库配置验证
			if (!config.PUBLIC_SUPABASE_URL) errors.push('Supabase URL 是必需的');
			if (!config.PUBLIC_SUPABASE_ANON_KEY) errors.push('Supabase 匿名密钥是必需的');
			if (!config.SUPABASE_SERVICE_ROLE_KEY) errors.push('Supabase 服务密钥是必需的');
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	// 步骤导航
	async function nextStep() {
		// 验证当前步骤
		const validation = validateCurrentStep();
		if (!validation.isValid) {
			saveStatus = 'error';
			message = '请完成以下必填项:\n' + validation.errors.join('\n');
			return;
		}

		// 保存当前步骤的配置
		await saveConfig();

		if (saveStatus !== 'error' && currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	async function skipStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	// 完成配置
	async function completeSetup() {
		await saveConfig();
		if (saveStatus !== 'error') {
			setTimeout(() => {
				goto('/vibbyai');
			}, 2000);
		}
	}

	onMount(() => {
		loadConfig();
	});
</script>

<svelte:head>
	<title>System Setup - Vibby AI</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-800">
	<div class="theme-bg-card dark:bg-gray-800 shadow">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">System Setup</h1>
					<p class="text-sm text-gray-500 dark:text-gray-400">Configure your Vibby AI installation</p>
				</div>
				<div class="text-sm text-gray-500 dark:text-gray-400">
					Step {currentStep + 1} of {steps.length}
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex">
		<div class="w-1/4 pr-8">
			<!-- Progress Bar -->
			<div class="mb-8">
				<div class="flex flex-col space-y-4">
					{#each steps as step, index}
						<div class="flex items-center">
							<div class="flex items-center justify-center w-10 h-10 rounded-full border-2
								{index <= currentStep
									? 'bg-blue-600 border-blue-600 theme-text-primary'
									: 'theme-bg-card dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
								}">
								{#if index < currentStep}
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								{:else}
									<span class="text-sm font-medium">{index + 1}</span>
								{/if}
							</div>
							<div class="ml-4 text-sm">
								<div class="font-medium text-gray-900 dark:theme-text-primary">{step.title}</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">{step.description}</div>
							</div>
						</div>
						{#if index < steps.length - 1}
							<div class="ml-5 w-px h-8
								{index < currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}">
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
		<div class="w-3/4">
			<!-- 配置文件状态 -->
			<div class="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-medium text-gray-900 dark:theme-text-primary">配置文件状态</h3>
						<p class="text-xs text-gray-500 dark:text-gray-400">当前配置将保存到 .env.development</p>
					</div>
					<div class="flex items-center space-x-2">
						{#if loading}
							<div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
							<span class="text-xs text-yellow-600 dark:text-yellow-400">加载中</span>
						{:else}
							<div class="w-2 h-2 bg-green-400 rounded-full"></div>
							<span class="text-xs text-green-600 dark:text-green-400">已连接</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="theme-bg-card dark:bg-gray-800 rounded-lg shadow-sm border theme-border dark:theme-border">
				<div class="p-6">
					<div class="text-center mb-6">
						<div class="inline-flex items-center gap-3">
							<span class="text-2xl">{steps[currentStep].icon}</span>
							<h2 class="text-xl font-semibold text-gray-900 dark:theme-text-primary">
								{steps[currentStep].title}
							</h2>
						</div>

						<!-- 保存状态指示器 -->
						{#if saveStatus}
							<div class="mt-4">
								{#if saveStatus === 'saving'}
									<div class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
										<svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										正在保存...
									</div>
								{:else if saveStatus === 'success'}
									<div class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
										<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
										</svg>
										保存成功
									</div>
								{:else if saveStatus === 'error'}
									<div class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
										<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
										</svg>
										保存失败
									</div>
								{/if}
							</div>
						{/if}

						<!-- 错误消息 -->
						{#if message}
							<div class="mt-4 p-3 rounded-md {saveStatus === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'}">
								{#if saveStatus === 'error' && message.includes('\n')}
									<!-- 显示多行错误消息 -->
									<div class="space-y-1">
										{#each message.split('\n') as line}
											<div>{line}</div>
										{/each}
									</div>
								{:else}
									{message}
								{/if}
							</div>
						{/if}
					</div>

					{#if currentStep === 0}
						<div class="space-y-6">
							<div class="bg-blue-50 dark:bg-blue-800/30 rounded-lg p-4">
								<h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">网站基本信息</h3>
								<p class="text-sm text-blue-800 dark:text-blue-200">
									配置您的网站基本信息，这些设置将保存到 .env.development 文件中。
								</p>
							</div>

							<div class="space-y-4">
								<div>
									<label for="site-url" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
										网站 URL
									</label>
									<input
										id="site-url"
										type="url"
										bind:value={config.PUBLIC_SITE_URL}
										placeholder="http://localhost:5174"
										class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
									/>
									<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
										您的网站访问地址，用于生成链接和回调
									</p>
								</div>
							</div>
						</div>

					{:else if currentStep === 1}
						<div class="space-y-6">
							<div class="bg-green-50 dark:bg-green-800/30 rounded-lg p-4">
								<h3 class="font-medium text-green-900 dark:text-green-100 mb-2">Supabase 数据库配置</h3>
								<p class="text-sm text-green-800 dark:text-green-200">
									配置 Supabase 数据库连接。请在 <a href="https://supabase.com" target="_blank" class="underline">Supabase</a> 创建项目并获取连接信息。
								</p>
							</div>

							<div class="space-y-4">
								<div>
									<label for="supabase-url" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
										Supabase URL
									</label>
									<input
										id="supabase-url"
										type="url"
										bind:value={config.PUBLIC_SUPABASE_URL}
										placeholder="https://your-project.supabase.co"
										class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
									/>
								</div>

								<div>
									<label for="supabase-anon" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
										Supabase Anon Key
									</label>
									<input
										id="supabase-anon"
										type="text"
										bind:value={config.PUBLIC_SUPABASE_ANON_KEY}
										placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
										class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
									/>
								</div>

								<div>
									<label for="supabase-service" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
										Supabase Service Role Key
									</label>
									<input
										id="supabase-service"
										type="password"
										bind:value={config.SUPABASE_SERVICE_ROLE_KEY}
										placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
										class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
									/>
									<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
										⚠️ 服务密钥具有管理员权限，请妥善保管
									</p>
								</div>
							</div>
						</div>

					{:else if currentStep === 2}
						<div class="space-y-6">
							<div class="bg-orange-50 dark:bg-orange-800/30 rounded-lg p-4">
								<h3 class="font-medium text-orange-900 dark:text-orange-100 mb-2">分析工具配置</h3>
								<p class="text-sm text-orange-800 dark:text-orange-200">
									配置网站分析工具，了解用户行为和网站性能。这些配置是可选的。
								</p>
							</div>

							<div class="space-y-4">
								<div>
									<label for="ga-id" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
										Google Analytics ID
									</label>
									<input
										id="ga-id"
										type="text"
										bind:value={config.GOOGLE_ANALYTICS_ID}
										placeholder="G-XXXXXXXXXX"
										class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
									/>
								</div>

								<div>
									<label for="clarity-id" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
										Microsoft Clarity ID
									</label>
									<input
										id="clarity-id"
										type="text"
										bind:value={config.MICROSOFT_CLARITY_ID}
										placeholder="xxxxxxxxxx"
										class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
									/>
								</div>
							</div>
						</div>

					{:else if currentStep === 3}
						<div class="space-y-6">
							<div class="bg-indigo-50 dark:bg-indigo-800/30 rounded-lg p-4">
								<h3 class="font-medium text-indigo-900 dark:text-indigo-100 mb-2">OAuth 第三方登录</h3>
								<p class="text-sm text-indigo-800 dark:text-indigo-200">
									配置第三方登录服务，让用户可以使用 GitHub、Google 等账号登录。
								</p>
							</div>

							<div class="space-y-6">
								<!-- GitHub OAuth -->
								<div class="border theme-border dark:border-gray-600 rounded-lg p-4">
									<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-3">GitHub OAuth</h4>
									<div class="space-y-3">
										<div>
											<label for="github-client-id" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
												Client ID
											</label>
											<input
												id="github-client-id"
												type="text"
												bind:value={config.GITHUB_CLIENT_ID}
												placeholder="Iv1.xxxxxxxxxxxxxxxx"
												class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
											/>
										</div>
										<div>
											<label for="github-client-secret" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
												Client Secret
											</label>
											<input
												id="github-client-secret"
												type="password"
												bind:value={config.GITHUB_CLIENT_SECRET}
												placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
												class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
											/>
										</div>
									</div>
								</div>

								<!-- Google OAuth -->
								<div class="border theme-border dark:border-gray-600 rounded-lg p-4">
									<h4 class="font-medium text-gray-900 dark:theme-text-primary mb-3">Google OAuth</h4>
									<div class="space-y-3">
										<div>
											<label for="google-client-id" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
												Client ID
											</label>
											<input
												id="google-client-id"
												type="text"
												bind:value={config.GOOGLE_CLIENT_ID}
												placeholder="xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
												class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
											/>
										</div>
										<div>
											<label for="google-client-secret" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-1">
												Client Secret
											</label>
											<input
												id="google-client-secret"
												type="password"
												bind:value={config.GOOGLE_CLIENT_SECRET}
												placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
												class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

					{:else if currentStep === 4}
						<div class="space-y-6">
							<div class="bg-green-50 dark:bg-green-800/30 rounded-lg p-4">
								<h3 class="font-medium text-green-900 dark:text-green-100 mb-2">配置完成</h3>
								<p class="text-sm text-green-800 dark:text-green-200">
									恭喜！您已完成系统初始化配置。所有设置已保存到 .env.development 文件中。
								</p>
							</div>
							<div class="text-center">
								<div class="text-6xl mb-4">🎉</div>
								<h3 class="text-xl font-bold text-gray-900 dark:theme-text-primary mb-2">配置完成！</h3>
								<p class="theme-text-muted dark:text-gray-400 mb-6">
									您的 Vibby AI 系统已准备就绪
								</p>
								<div class="flex justify-center space-x-4">
									<a href="/vibbyai" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm theme-text-primary bg-blue-600 hover:bg-blue-700">
										进入后台管理
									</a>
									<a href="/" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 dark:bg-gray-700 dark:theme-text-muted dark:border-gray-600 dark:hover:bg-gray-600">
										查看网站
									</a>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t theme-border dark:border-gray-600 rounded-b-lg">
					<div class="flex justify-between">
						<button
							on:click={prevStep}
							disabled={currentStep === 0 || loading}
							class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:theme-text-muted dark:border-gray-500 dark:hover:bg-gray-500"
						>
							上一步
						</button>

						<div class="flex space-x-3">
							{#if currentStep < steps.length - 1}
								<button
									on:click={skipStep}
									disabled={loading}
									class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:theme-text-muted dark:border-gray-500 dark:hover:bg-gray-500"
								>
									跳过
								</button>
								<button
									on:click={saveConfig}
									disabled={loading}
									class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:theme-text-muted dark:border-gray-500 dark:hover:bg-gray-500"
								>
									保存
								</button>
								<button
									on:click={nextStep}
									disabled={loading}
									class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm theme-text-primary bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{#if loading}
										<svg class="animate-spin -ml-1 mr-2 h-4 w-4 theme-text-primary" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									{/if}
									下一步
								</button>
							{:else}
								<button
									on:click={completeSetup}
									disabled={loading}
									class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm theme-text-primary bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{#if loading}
										<svg class="animate-spin -ml-1 mr-2 h-4 w-4 theme-text-primary" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									{/if}
									完成配置
								</button>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
