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
		STRIPE_PUBLIC_KEY: config.STRIPE_PUBLIC_KEY || '',
		STRIPE_SECRET_KEY: config.STRIPE_SECRET_KEY || '',
		STRIPE_WEBHOOK_SECRET: config.STRIPE_WEBHOOK_SECRET || ''
	});

	function updateConfig() {
		dispatch('update', formData);
	}

	function handleInputChange(key: keyof typeof formData, value: string) {
		formData[key] = value;
		updateConfig();
	}

	function isValidStripeKey(key: string, type: 'public' | 'secret' | 'webhook'): boolean {
		switch (type) {
			case 'public':
				return /^pk_(test_|live_)[a-zA-Z0-9]{24,}$/.test(key);
			case 'secret':
				return /^sk_(test_|live_)[a-zA-Z0-9]{24,}$/.test(key);
			case 'webhook':
				return /^whsec_[a-zA-Z0-9]{32,}$/.test(key);
			default:
				return false;
		}
	}

	function getKeyEnvironment(key: string): 'test' | 'live' | 'unknown' {
		if (key.includes('_test_')) return 'test';
		if (key.includes('_live_')) return 'live';
		return 'unknown';
	}
</script>

<div class="space-y-6">
	<!-- Introduction -->
	<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">支付服务配置</h3>
				<p class="text-sm text-blue-700 dark:text-blue-300">
					配置 Stripe 支付服务来处理订阅、一次性付款和退款。此步骤是可选的。
				</p>
			</div>
		</div>
	</div>

	<!-- Stripe Configuration -->
	<div class="theme-bg-card dark:theme-bg-muted rounded-lg border theme-border dark:border-gray-800 p-6">
		<div class="flex items-start space-x-3 mb-6">
			<div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
				<svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
					<path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
				</svg>
			</div>
			<div>
				<h4 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Stripe 支付配置</h4>
				<p class="text-sm text-gray-500 dark:text-gray-400">全球领先的在线支付处理平台</p>
			</div>
		</div>

		<div class="space-y-6">
			{#each (step.fields || []) as field}
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						{(field as any).label}
						{#if (field as any).required}
							<span class="text-red-500">*</span>
						{/if}
					</label>

					<div class="relative">
						<input
							type={(field as any).type}
							bind:value={formData[(field as any).key as keyof typeof formData]}
							oninput={(e) => handleInputChange((field as any).key as keyof typeof formData, (e.target as HTMLInputElement).value)}
							placeholder={(field as any).placeholder}
							class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary pr-20"
						/>
						
						<!-- Validation and Environment Indicators -->
						{#if formData[(field as any).key as keyof typeof formData]}
							<div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
								<!-- Environment Badge -->
								{#if field.key === 'STRIPE_PUBLIC_KEY' || field.key === 'STRIPE_SECRET_KEY'}
									{@const env = getKeyEnvironment(formData[field.key])}
									{#if env !== 'unknown'}
										<span class="px-2 py-1 text-xs font-medium rounded-full {
											env === 'test' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
											'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
										}">
											{env === 'test' ? '测试' : '生产'}
										</span>
									{/if}
								{/if}

								<!-- Validation Icon -->
								{#if (field.key === 'STRIPE_PUBLIC_KEY' && isValidStripeKey(formData[field.key], 'public')) ||
									 (field.key === 'STRIPE_SECRET_KEY' && isValidStripeKey(formData[field.key], 'secret')) ||
									 (field.key === 'STRIPE_WEBHOOK_SECRET' && isValidStripeKey(formData[field.key], 'webhook'))}
									<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								{:else if formData[(field as any).key as keyof typeof formData].length > 10}
									<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
									</svg>
								{/if}
							</div>
						{/if}
					</div>

					{#if field.description}
						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
					{/if}

					<!-- Validation Messages -->
					{#if field.key === 'STRIPE_PUBLIC_KEY' && formData[field.key] && !isValidStripeKey(formData[field.key], 'public')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Stripe 公开密钥（格式：pk_test_... 或 pk_live_...）</p>
					{:else if field.key === 'STRIPE_SECRET_KEY' && formData[field.key] && !isValidStripeKey(formData[field.key], 'secret')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Stripe 私密密钥（格式：sk_test_... 或 sk_live_...）</p>
					{:else if field.key === 'STRIPE_WEBHOOK_SECRET' && formData[field.key] && !isValidStripeKey(formData[field.key], 'webhook')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">请输入有效的 Stripe Webhook 密钥（格式：whsec_...）</p>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Environment Warning -->
		{#if formData.STRIPE_PUBLIC_KEY && formData.STRIPE_SECRET_KEY}
			{@const pubEnv = getKeyEnvironment(formData.STRIPE_PUBLIC_KEY)}
			{@const secEnv = getKeyEnvironment(formData.STRIPE_SECRET_KEY)}
			{#if pubEnv !== secEnv && pubEnv !== 'unknown' && secEnv !== 'unknown'}
				<div class="mt-4 p-3 bg-red-50 dark:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-800">
					<div class="flex items-start space-x-2">
						<svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
						<div>
							<h5 class="text-sm font-medium text-red-800 dark:text-red-200">环境不匹配</h5>
							<p class="text-sm text-red-700 dark:text-red-300">
								公开密钥和私密密钥来自不同环境（{pubEnv} vs {secEnv}）。请确保使用相同环境的密钥。
							</p>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Setup Guide -->
	<div class="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
		<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">如何获取 Stripe 配置？</h4>
		<ol class="text-sm text-yellow-700 dark:text-yellow-300 space-y-2 list-decimal list-inside">
			<li>访问 <a href="https://dashboard.stripe.com" target="_blank" class="underline hover:no-underline">Stripe Dashboard</a> 并创建账户</li>
			<li>在开发者 → API 密钥中找到：
				<ul class="ml-4 mt-1 space-y-1 list-disc list-inside">
					<li><strong>可发布密钥</strong>：用于客户端（以 pk_ 开头）</li>
					<li><strong>密钥</strong>：用于服务端（以 sk_ 开头）</li>
				</ul>
			</li>
			<li>在开发者 → Webhooks 中创建端点：
				<ul class="ml-4 mt-1 space-y-1 list-disc list-inside">
					<li>端点 URL: {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/stripe/webhook</li>
					<li>选择要监听的事件（如 payment_intent.succeeded）</li>
					<li>复制签名密钥（以 whsec_ 开头）</li>
				</ul>
			</li>
		</ol>
	</div>

	<!-- Features -->
	<div class="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
		<h4 class="text-sm font-medium text-green-800 dark:text-green-200 mb-3">Stripe 支付功能</h4>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
			<div>
				<h5 class="font-medium mb-2">支付方式</h5>
				<ul class="space-y-1 list-disc list-inside">
					<li>信用卡和借记卡</li>
					<li>数字钱包（Apple Pay、Google Pay）</li>
					<li>银行转账</li>
					<li>本地支付方式</li>
				</ul>
			</div>
			<div>
				<h5 class="font-medium mb-2">功能特性</h5>
				<ul class="space-y-1 list-disc list-inside">
					<li>订阅和定期付款</li>
					<li>一次性付款</li>
					<li>退款处理</li>
					<li>欺诈检测</li>
				</ul>
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
				<ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
					<li>• <strong>私密密钥</strong>：绝不要在客户端代码中使用</li>
					<li>• <strong>测试环境</strong>：开发时使用测试密钥，生产时使用实时密钥</li>
					<li>• <strong>Webhook 安全</strong>：验证 Webhook 签名以确保请求来自 Stripe</li>
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
					如果您暂时不需要支付功能，可以跳过此步骤。您可以在需要时随时配置 Stripe 支付服务。
				</p>
			</div>
		</div>
	</div>
</div>
