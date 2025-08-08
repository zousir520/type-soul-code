<script lang="ts">
	import { onMount } from 'svelte';

	let currentStep = 0;
	let loading = false;
	let message = '';

	const steps = [
		{
			id: 'basic',
			title: '基本信息',
			description: '配置网站基本信息',
			icon: '🏠'
		},
		{
			id: 'database',
			title: '数据库配置',
			description: '配置 Supabase 数据库连接',
			icon: '💾'
		},
		{
			id: 'security',
			title: '安全设置',
			description: '配置加密密钥和安全选项',
			icon: '🔒'
		},
		{
			id: 'email',
			title: '邮件服务',
			description: '配置邮件发送服务',
			icon: '📧'
		},
		{
			id: 'analytics',
			title: '分析工具',
			description: '配置网站分析和监控',
			icon: '📊'
		},
		{
			id: 'complete',
			title: '完成',
			description: '配置完成，开始使用',
			icon: '✅'
		}
	];

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	function skipStep() {
		nextStep();
	}

	onMount(() => {
		// 初始化
	});
</script>

<svelte:head>
	<title>System Setup - Vibby AI</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:theme-bg-muted">
	<!-- Header -->
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

	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Progress Bar -->
		<div class="mb-8">
			<div class="flex items-center justify-between mb-4">
				{#each steps as step, index}
					<div class="flex items-center {index < steps.length - 1 ? 'flex-1' : ''}">
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
						{#if index < steps.length - 1}
							<div class="flex-1 h-0.5 mx-4 
								{index < currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}">
							</div>
						{/if}
					</div>
				{/each}
			</div>
			
			<!-- Step Labels -->
			<div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
				{#each steps as step}
					<div class="text-center max-w-20">
						<div class="font-medium">{step.title}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Current Step Content -->
		<div class="theme-bg-card dark:bg-gray-800 rounded-lg shadow-sm border theme-border dark:theme-border">
			<div class="p-6">
				<div class="text-center mb-8">
					<div class="text-4xl mb-4">{steps[currentStep].icon}</div>
					<h2 class="text-2xl font-bold text-gray-900 dark:theme-text-primary mb-2">
						{steps[currentStep].title}
					</h2>
					<p class="theme-text-muted dark:text-gray-400">
						{steps[currentStep].description}
					</p>
				</div>

				<!-- Step Content -->
				{#if currentStep === 0}
					<!-- Basic Info Step -->
					<div class="space-y-6">
						<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4">
							<h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">网站基本信息</h3>
							<p class="text-sm text-blue-800 dark:text-blue-200">
								配置您的网站名称、描述和基本设置。这些信息将显示在网站的各个位置。
							</p>
						</div>
						<div class="text-center text-gray-500 dark:text-gray-400">
							<p>基本信息配置功能正在开发中...</p>
							<p class="text-sm mt-2">您可以跳过此步骤继续配置其他选项</p>
						</div>
					</div>

				{:else if currentStep === 1}
					<!-- Database Step -->
					<div class="space-y-6">
						<div class="bg-green-50 dark:bg-green-900/50 rounded-lg p-4">
							<h3 class="font-medium text-green-900 dark:text-green-100 mb-2">Supabase 数据库</h3>
							<p class="text-sm text-green-800 dark:text-green-200">
								配置 Supabase 数据库连接，用于存储用户数据和应用状态。
							</p>
						</div>
						<div class="text-center text-gray-500 dark:text-gray-400">
							<p>数据库配置功能正在开发中...</p>
							<p class="text-sm mt-2">请在 .env 文件中手动配置 Supabase 连接信息</p>
						</div>
					</div>

				{:else if currentStep === 2}
					<!-- Security Step -->
					<div class="space-y-6">
						<div class="bg-red-50 dark:bg-red-900/50 rounded-lg p-4">
							<h3 class="font-medium text-red-900 dark:text-red-100 mb-2">安全配置</h3>
							<p class="text-sm text-red-800 dark:text-red-200">
								配置加密密钥和安全选项，保护您的应用数据安全。
							</p>
						</div>
						<div class="text-center text-gray-500 dark:text-gray-400">
							<p>安全配置功能正在开发中...</p>
							<p class="text-sm mt-2">请在 .env 文件中配置 ENCRYPTION_SECRET</p>
						</div>
					</div>

				{:else if currentStep === 3}
					<!-- Email Step -->
					<div class="space-y-6">
						<div class="bg-purple-50 dark:bg-purple-900/50 rounded-lg p-4">
							<h3 class="font-medium text-purple-900 dark:text-purple-100 mb-2">邮件服务</h3>
							<p class="text-sm text-purple-800 dark:text-purple-200">
								配置邮件发送服务，用于用户注册、密码重置等功能。
							</p>
						</div>
						<div class="text-center text-gray-500 dark:text-gray-400">
							<p>邮件服务配置功能正在开发中...</p>
							<p class="text-sm mt-2">支持 SMTP、SendGrid、Mailgun 等服务</p>
						</div>
					</div>

				{:else if currentStep === 4}
					<!-- Analytics Step -->
					<div class="space-y-6">
						<div class="bg-orange-50 dark:bg-orange-900/50 rounded-lg p-4">
							<h3 class="font-medium text-orange-900 dark:text-orange-100 mb-2">分析工具</h3>
							<p class="text-sm text-orange-800 dark:text-orange-200">
								配置网站分析和监控工具，了解用户行为和网站性能。
							</p>
						</div>
						<div class="text-center text-gray-500 dark:text-gray-400">
							<p>分析工具配置功能正在开发中...</p>
							<p class="text-sm mt-2">支持 Google Analytics、Microsoft Clarity 等</p>
						</div>
					</div>

				{:else if currentStep === 5}
					<!-- Complete Step -->
					<div class="space-y-6">
						<div class="bg-green-50 dark:bg-green-900/50 rounded-lg p-4">
							<h3 class="font-medium text-green-900 dark:text-green-100 mb-2">配置完成</h3>
							<p class="text-sm text-green-800 dark:text-green-200">
								恭喜！您已完成系统初始化配置。现在可以开始使用 Vibby AI 了。
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

			<!-- Navigation -->
			<div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t theme-border dark:border-gray-600 rounded-b-lg">
				<div class="flex justify-between">
					<button
						onclick={prevStep}
						disabled={currentStep === 0}
						class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:theme-text-muted dark:border-gray-500 dark:hover:bg-gray-500"
					>
						上一步
					</button>

					<div class="flex space-x-3">
						{#if currentStep < steps.length - 1}
							<button
								onclick={skipStep}
								class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 dark:bg-gray-600 dark:theme-text-muted dark:border-gray-500 dark:hover:bg-gray-500"
							>
								跳过
							</button>
							<button
								onclick={nextStep}
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm theme-text-primary bg-blue-600 hover:bg-blue-700"
							>
								下一步
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
