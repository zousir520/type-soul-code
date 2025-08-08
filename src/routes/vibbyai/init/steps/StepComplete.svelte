<script lang="ts">
	import { goto } from '$app/navigation';
	import type { EnvConfig } from '$lib/types/env-config';

	interface Props {
		config: EnvConfig;
		onrestart?: () => void;
	}

	let { config, onrestart }: Props = $props();

	function getConfiguredServices() {
		const services = [];
		
		// 基础服务
		if (config.PUBLIC_SUPABASE_URL && config.ENCRYPTION_SECRET) {
			services.push({ name: '数据库和安全', icon: '🔐', status: 'configured' });
		}
		
		// 邮件服务
		if (config.SMTP_HOST && config.SMTP_USER) {
			services.push({ name: '邮件服务', icon: '📧', status: 'configured' });
		}
		
		// 分析工具
		if (config.GOOGLE_ANALYTICS_ID || config.MICROSOFT_CLARITY_ID) {
			services.push({ name: '网站分析', icon: '📊', status: 'configured' });
		}
		
		// 社交登录
		if (config.GITHUB_CLIENT_ID || config.GOOGLE_CLIENT_ID) {
			services.push({ name: '社交登录', icon: '👤', status: 'configured' });
		}
		
		// 支付服务
		if (config.STRIPE_PUBLIC_KEY && config.STRIPE_SECRET_KEY) {
			services.push({ name: '支付服务', icon: '💳', status: 'configured' });
		}
		

		
		return services;
	}

	function getNextSteps() {
		const steps = [
			{
				title: '配置 API 密钥',
				description: '添加 OpenAI、Anthropic 等 AI 服务的 API 密钥',
				link: '/vibbyai/api-keys',
				icon: '🔑'
			},
			{
				title: '内容管理',
				description: '通过 CMS 管理网站内容和页面',
				link: '/vibbyai/cms',
				icon: '📝'
			},
			{
				title: '用户管理',
				description: '查看和管理注册用户',
				link: '/vibbyai/users',
				icon: '👥'
			},
			{
				title: '系统设置',
				description: '调整系统配置和偏好设置',
				link: '/vibbyai/settings',
				icon: '⚙️'
			}
		];
		
		return steps;
	}

	function goToDashboard() {
		goto('/vibbyai');
	}

	function restartSetup() {
		onrestart?.();
	}

	function downloadConfig() {
		const configText = Object.entries(config)
			.filter(([_, value]) => value)
			.map(([key, value]) => `${key}=${value}`)
			.join('\n');

		const blob = new Blob([configText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'vibbyai-config.env';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	let configuredServices = $derived(getConfiguredServices());
	let nextSteps = $derived(getNextSteps());
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
	<div class="container mx-auto px-4 py-8">
		<div class="max-w-4xl mx-auto">
			<!-- Success Header -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
					<svg class="w-12 h-12 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h1 class="text-4xl font-bold text-gray-900 dark:theme-text-primary mb-2">🎉 设置完成！</h1>
				<p class="text-xl theme-text-muted dark:text-gray-400">
					恭喜！您已成功配置 tenniszero.org 平台
				</p>
			</div>

			<!-- Configuration Summary -->
			<div class="theme-bg-card dark:theme-bg-muted rounded-xl shadow-lg border theme-border dark:border-gray-800 p-6 mb-8">
				<h2 class="text-2xl font-semibold text-gray-900 dark:theme-text-primary mb-4">配置摘要</h2>
				
				{#if configuredServices.length > 0}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						{#each configuredServices as service}
							<div class="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-800">
								<span class="text-2xl">{service.icon}</span>
								<div>
									<h3 class="font-medium text-green-800 dark:text-green-200">{service.name}</h3>
									<p class="text-sm text-green-600 dark:text-green-400">已配置</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8">
						<div class="text-6xl mb-4">🚀</div>
						<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary mb-2">基础配置完成</h3>
						<p class="theme-text-muted dark:text-gray-400">
							您已完成基础配置，可以开始使用 tenniszero.org 了！
						</p>
					</div>
				{/if}

				<!-- Environment Info -->
				<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
					<div class="flex items-start space-x-3">
						<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
							<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">环境信息</h4>
							<div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
								<p><strong>运行环境:</strong> {config.NODE_ENV || 'development'}</p>
								<p><strong>网站 URL:</strong> {config.PUBLIC_SITE_URL || '未设置'}</p>
								<p><strong>数据库:</strong> {config.PUBLIC_SUPABASE_URL ? 'Supabase 已连接' : '未配置'}</p>
								<p><strong>加密:</strong> {config.ENCRYPTION_SECRET ? '已启用' : '未配置'}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Next Steps -->
			<div class="theme-bg-card dark:theme-bg-muted rounded-xl shadow-lg border theme-border dark:border-gray-800 p-6 mb-8">
				<h2 class="text-2xl font-semibold text-gray-900 dark:theme-text-primary mb-4">下一步操作</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each nextSteps as step}
						<a
							href={step.link}
							class="block p-4 border theme-border dark:theme-border rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
						>
							<div class="flex items-start space-x-3">
								<span class="text-2xl group-hover:scale-110 transition-transform duration-200">{step.icon}</span>
								<div>
									<h3 class="font-medium text-gray-900 dark:theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
										{step.title}
									</h3>
									<p class="text-sm theme-text-muted dark:text-gray-400 mt-1">
										{step.description}
									</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
				<button
					onclick={goToDashboard}
					class="w-full sm:w-auto px-8 py-3 bg-blue-600 theme-text-primary rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg transition-colors"
				>
					进入管理后台
				</button>
				
				<button
					onclick={downloadConfig}
					class="w-full sm:w-auto px-6 py-3 bg-gray-600 theme-text-primary rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors"
				>
					下载配置文件
				</button>
				
				<button
					onclick={restartSetup}
					class="w-full sm:w-auto px-6 py-3 theme-text-muted dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
				>
					重新配置
				</button>
			</div>

			<!-- Important Notes -->
			<div class="mt-8 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
				<div class="flex items-start space-x-3">
					<div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
						<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
					</div>
					<div>
						<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">重要提醒</h4>
						<ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
							<li>• <strong>备份配置</strong>：建议下载并安全保存配置文件</li>
							<li>• <strong>环境变量</strong>：配置已保存到 .env 文件中</li>
							<li>• <strong>安全密钥</strong>：请妥善保管加密密钥，丢失将无法恢复数据</li>
							<li>• <strong>生产部署</strong>：部署到生产环境前请检查所有配置</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Support -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-500 dark:text-gray-400">
					需要帮助？查看 
					<a href="/docs" class="text-blue-600 dark:text-blue-400 hover:underline">文档</a> 
					或联系 
					<a href="mailto:support@tenniszero.org" class="text-blue-600 dark:text-blue-400 hover:underline">技术支持</a>
				</p>
			</div>
		</div>
	</div>
</div>
