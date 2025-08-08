<script lang="ts">
	import type { EnvConfig, ConfigStep } from '$lib/types/env-config';

	interface Props {
		config: EnvConfig;
		step: ConfigStep;
		onUpdate?: (data: Partial<EnvConfig>) => void;
	}

	let { config, onUpdate }: Props = $props();

	let formData = $state({
		ENCRYPTION_SECRET: config.ENCRYPTION_SECRET || ''
	});

	let showSecret = $state(false);
	let generating = $state(false);

	function updateConfig() {
		onUpdate?.(formData);
	}

	// 客户端版本的加密密钥生成函数
	function generateEncryptionSecret(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
		let result = '';

		for (let i = 0; i < 48; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return result;
	}

	function handleInputChange(key: keyof typeof formData, value: string) {
		formData[key] = value;
		updateConfig();
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target) {
			handleInputChange('ENCRYPTION_SECRET', target.value);
		}
	}

	async function generateSecret() {
		generating = true;
		try {
			// 模拟生成过程
			await new Promise(resolve => setTimeout(resolve, 500));
			const secret = generateEncryptionSecret();
			formData.ENCRYPTION_SECRET = secret;
			updateConfig();
		} finally {
			generating = false;
		}
	}

	function copyToClipboard() {
		if (formData.ENCRYPTION_SECRET) {
			navigator.clipboard.writeText(formData.ENCRYPTION_SECRET);
		}
	}

	function getSecurityLevel(): { level: string; color: string; description: string } {
		const length = formData.ENCRYPTION_SECRET.length;
		
		if (length === 0) {
			return { level: '未设置', color: 'red', description: '需要设置加密密钥' };
		} else if (length < 32) {
			return { level: '弱', color: 'red', description: '密钥长度不足，建议至少 32 字符' };
		} else if (length < 48) {
			return { level: '中等', color: 'yellow', description: '密钥强度中等，建议使用更长的密钥' };
		} else {
			return { level: '强', color: 'green', description: '密钥强度很好' };
		}
	}

	function validateSecret(secret: string): { isValid: boolean; errors: string[]; warnings: string[] } {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (!secret) {
			errors.push('加密密钥是必需的');
		} else {
			if (secret.length < 32) {
				errors.push('密钥长度至少需要 32 字符');
			}
			// 将字符类型检查改为警告而非错误
			if (!/[A-Z]/.test(secret)) {
				warnings.push('建议包含大写字母');
			}
			if (!/[a-z]/.test(secret)) {
				warnings.push('建议包含小写字母');
			}
			if (!/[0-9]/.test(secret)) {
				warnings.push('建议包含数字');
			}
			if (!/[^A-Za-z0-9]/.test(secret)) {
				warnings.push('建议包含特殊字符');
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings
		};
	}

	const securityLevel = $derived(getSecurityLevel());
	const validation = $derived(validateSecret(formData.ENCRYPTION_SECRET));
</script>

<div class="space-y-6">
	<!-- Introduction -->
	<div class="bg-red-50 dark:bg-red-900/50 rounded-lg p-4 border border-red-200 dark:border-red-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622C21 7.51 20.403 5.85 19.402 4.5A11.959 11.959 0 0112 2.25z" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-1">安全配置</h3>
				<p class="text-sm text-red-700 dark:text-red-300">
					加密密钥用于保护您的 API 密钥和敏感数据。这是系统安全的核心，请妥善保管。
				</p>
			</div>
		</div>
	</div>

	<!-- Encryption Secret Field -->
	<div>
		<label class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
			加密密钥 (ENCRYPTION_SECRET)
			<span class="text-red-500">*</span>
		</label>

		<div class="space-y-3">
			<!-- Input with Generate Button -->
			<div class="flex space-x-2">
				<div class="flex-1 relative">
					<input
						type={showSecret ? 'text' : 'password'}
						bind:value={formData.ENCRYPTION_SECRET}
						oninput={handleInput}
						placeholder="点击生成按钮创建安全密钥"
						class="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:theme-text-primary pr-20"
					/>
					
					<!-- Show/Hide Button -->
					<button
						type="button"
						onclick={() => showSecret = !showSecret}
						class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:theme-text-muted dark:hover:theme-text-muted"
					>
						{#if showSecret}
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
							</svg>
						{:else}
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						{/if}
					</button>
				</div>

				<!-- Generate Button -->
				<button
					type="button"
					onclick={generateSecret}
					disabled={generating}
					class="px-4 py-2 bg-green-600 theme-text-primary rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
				>
					{generating ? '生成中...' : '生成密钥'}
				</button>

				<!-- Copy Button -->
				{#if formData.ENCRYPTION_SECRET}
					<button
						type="button"
						onclick={copyToClipboard}
						class="px-3 py-2 bg-gray-600 theme-text-primary rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
						title="复制到剪贴板"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
						</svg>
					</button>
				{/if}
			</div>

			<!-- Security Level Indicator -->
			{#if formData.ENCRYPTION_SECRET}
				<div class="flex items-center space-x-3">
					<div class="flex items-center space-x-2">
						<span class="text-sm theme-text-muted dark:text-gray-400">安全级别:</span>
						<span class="px-2 py-1 text-xs font-medium rounded-full {
							securityLevel.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
							securityLevel.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
							'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
						}">
							{securityLevel.level}
						</span>
					</div>
					<span class="text-sm text-gray-500 dark:text-gray-400">{securityLevel.description}</span>
				</div>
			{/if}

			<!-- Validation Messages -->
			{#if !validation.isValid}
				<div class="space-y-1">
					{#each validation.errors as error}
						<p class="text-sm text-red-600 dark:text-red-400">• {error}</p>
					{/each}
				</div>
			{/if}

			<!-- Warning Messages -->
			{#if validation.warnings && validation.warnings.length > 0}
				<div class="space-y-1">
					{#each validation.warnings as warning}
						<p class="text-sm text-yellow-600 dark:text-yellow-400">• {warning}</p>
					{/each}
				</div>
			{/if}
		</div>

		<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
			用于加密 API 密钥的主密钥（至少 32 字符）。建议使用生成按钮创建强密钥。
		</p>
	</div>

	<!-- Security Information -->
	<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
		<h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">加密技术说明</h4>
		<div class="space-y-2 text-sm text-blue-700 dark:text-blue-300">
			<div class="flex items-start space-x-2">
				<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
				<div>
					<strong>算法:</strong> AES-256-GCM（军用级加密标准）
				</div>
			</div>
			<div class="flex items-start space-x-2">
				<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
				<div>
					<strong>密钥派生:</strong> PBKDF2 with 100,000 iterations
				</div>
			</div>
			<div class="flex items-start space-x-2">
				<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
				<div>
					<strong>完整性验证:</strong> 每个加密数据都有认证标签
				</div>
			</div>
			<div class="flex items-start space-x-2">
				<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
				<div>
					<strong>用户隔离:</strong> 每个用户使用独立的派生密钥
				</div>
			</div>
		</div>
	</div>

	<!-- Security Best Practices -->
	<div class="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">安全最佳实践</h4>
				<ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
					<li>• <strong>使用生成的密钥</strong>：点击"生成密钥"按钮创建强随机密钥</li>
					<li>• <strong>妥善保管</strong>：将密钥保存在安全的密码管理器中</li>
					<li>• <strong>不要共享</strong>：永远不要在代码、邮件或聊天中分享此密钥</li>
					<li>• <strong>定期轮换</strong>：建议每 6-12 个月更换一次密钥</li>
					<li>• <strong>备份重要</strong>：丢失此密钥将无法解密现有数据</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Warning -->
	<div class="bg-red-50 dark:bg-red-900/50 rounded-lg p-4 border border-red-200 dark:border-red-800">
		<div class="flex items-start space-x-3">
			<div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
				<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-1">重要警告</h4>
				<p class="text-sm text-red-700 dark:text-red-300">
					<strong>一旦设置并开始使用，更改此密钥将导致所有现有的加密数据无法解密！</strong>
					请确保在生产环境中妥善备份此密钥。
				</p>
			</div>
		</div>
	</div>
</div>
