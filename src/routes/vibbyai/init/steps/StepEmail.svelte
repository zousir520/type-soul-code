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
		SMTP_HOST: config.SMTP_HOST || '',
		SMTP_PORT: config.SMTP_PORT || '587',
		SMTP_USER: config.SMTP_USER || '',
		SMTP_PASS: config.SMTP_PASS || '',
		SMTP_FROM: config.SMTP_FROM || ''
	});

	let testingEmail = $state(false);
	let testResult = $state<{ success: boolean; message: string } | null>(null);

	function updateConfig() {
		dispatch('update', formData);
	}

	function handleInputChange(key: keyof typeof formData, value: string) {
		formData[key] = value;
		updateConfig();
		testResult = null;
	}

	async function testEmailConfig() {
		if (!formData.SMTP_HOST || !formData.SMTP_USER || !formData.SMTP_PASS) {
			testResult = {
				success: false,
				message: '请填写完整的 SMTP 配置信息'
			};
			return;
		}

		testingEmail = true;
		testResult = null;

		try {
			const response = await fetch('/api/test-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();
			testResult = result;
		} catch (error) {
			testResult = {
				success: false,
				message: '测试失败：' + (error instanceof Error ? error.message : '未知错误')
			};
		} finally {
			testingEmail = false;
		}
	}

	function fillGmailDefaults() {
		formData.SMTP_HOST = 'smtp.gmail.com';
		formData.SMTP_PORT = '587';
		updateConfig();
	}

	function fillOutlookDefaults() {
		formData.SMTP_HOST = 'smtp-mail.outlook.com';
		formData.SMTP_PORT = '587';
		updateConfig();
	}

	function isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
</script>

<div class="space-y-6">
	<!-- Introduction -->
	<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">邮件服务配置</h3>
				<p class="text-sm text-blue-700 dark:text-blue-300">
					配置 SMTP 邮件服务用于发送通知、密码重置和其他系统邮件。此步骤是可选的。
				</p>
			</div>
		</div>
	</div>

	<!-- Quick Setup Buttons -->
	<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
		<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary mb-3">快速配置</h4>
		<div class="flex flex-wrap gap-2">
			<button
				onclick={fillGmailDefaults}
				class="px-3 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 text-sm font-medium transition-colors"
			>
				Gmail 设置
			</button>
			<button
				onclick={fillOutlookDefaults}
				class="px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 text-sm font-medium transition-colors"
			>
				Outlook 设置
			</button>
		</div>
	</div>

	<!-- Form Fields -->
	<div class="space-y-4">
		{#each (step.fields || []) as field}
			<div>
				<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
					{(field as any).label}
					{#if (field as any).required}
						<span class="text-red-500">*</span>
					{/if}
				</label>

				<input
					type={(field as any).type}
					bind:value={formData[(field as any).key as keyof typeof formData]}
					oninput={(e) => handleInputChange((field as any).key as keyof typeof formData, (e.target as HTMLInputElement).value)}
					placeholder={(field as any).placeholder}
					class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary"
				/>

				{#if field.description}
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
				{/if}

				<!-- Validation Messages -->
				{#if (field as any).type === 'email' && formData[(field as any).key as keyof typeof formData] && !isValidEmail(formData[(field as any).key as keyof typeof formData])}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的邮箱地址</p>
				{:else if field.key === 'SMTP_PORT' && formData[field.key] && (isNaN(Number(formData[field.key])) || Number(formData[field.key]) < 1 || Number(formData[field.key]) > 65535)}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的端口号（1-65535）</p>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Test Email -->
	<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
		<div class="flex items-center justify-between mb-3">
			<h4 class="text-sm font-medium text-gray-900 dark:theme-text-primary">测试邮件配置</h4>
			<button
				onclick={testEmailConfig}
				disabled={testingEmail || !formData.SMTP_HOST || !formData.SMTP_USER || !formData.SMTP_PASS}
				class="px-4 py-2 bg-blue-600 theme-text-primary rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
			>
				{testingEmail ? '测试中...' : '发送测试邮件'}
			</button>
		</div>

		{#if testResult}
			<div class="p-3 rounded-lg {testResult.success ? 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800'}">
				<div class="flex items-start space-x-2">
					<div class="flex-shrink-0 mt-0.5">
						{#if testResult.success}
							<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						{:else}
							<svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
							</svg>
						{/if}
					</div>
					<p class="text-sm {testResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}">
						{testResult.message}
					</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Provider Guides -->
	<div class="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
		<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">常用邮件服务商配置</h4>
		
		<div class="space-y-4 text-sm text-yellow-700 dark:text-yellow-300">
			<!-- Gmail -->
			<div class="border-l-4 border-red-400 pl-3">
				<h5 class="font-medium mb-1">Gmail</h5>
				<ul class="space-y-1 text-xs">
					<li>• SMTP 服务器: smtp.gmail.com</li>
					<li>• 端口: 587 (TLS) 或 465 (SSL)</li>
					<li>• 需要启用"两步验证"并使用"应用专用密码"</li>
					<li>• 设置路径: Google 账户 → 安全性 → 应用专用密码</li>
				</ul>
			</div>

			<!-- Outlook -->
			<div class="border-l-4 border-blue-400 pl-3">
				<h5 class="font-medium mb-1">Outlook/Hotmail</h5>
				<ul class="space-y-1 text-xs">
					<li>• SMTP 服务器: smtp-mail.outlook.com</li>
					<li>• 端口: 587</li>
					<li>• 使用您的完整邮箱地址和密码</li>
				</ul>
			</div>

			<!-- 企业邮箱 -->
			<div class="border-l-4 border-green-400 pl-3">
				<h5 class="font-medium mb-1">企业邮箱</h5>
				<ul class="space-y-1 text-xs">
					<li>• 联系您的 IT 管理员获取 SMTP 设置</li>
					<li>• 通常格式: smtp.your-domain.com</li>
					<li>• 端口通常是 587 或 25</li>
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
					如果您暂时没有邮件服务，可以跳过此步骤。您可以在系统设置中随时配置邮件服务。
					没有邮件配置不会影响系统的核心功能。
				</p>
			</div>
		</div>
	</div>
</div>
