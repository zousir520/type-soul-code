<script lang="ts">
	let password = '';
	let hashedPassword = '';
	let jwtSecret = '';
	let loading = false;
	let error = '';
	let copied = false;

	async function generateHash() {
		if (!password) {
			error = '请输入密码';
			return;
		}

		if (password.length < 8) {
			error = '密码至少需要8个字符';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/vibbyai/api/generate-hash', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
			});

			const result = await response.json();

			if (result.success) {
				hashedPassword = result.hash;
			} else {
				error = result.error || '生成失败';
			}
		} catch (err) {
			error = '网络错误，请重试';
		} finally {
			loading = false;
		}
	}

	function generateJWTSecret() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
		let result = '';
		for (let i = 0; i < 64; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		jwtSecret = result;
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<svelte:head>
	<title>密码工具 - tenniszero.org</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">密码工具</h1>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
			生成安全的密码哈希和 JWT 密钥
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Password Hash Generator -->
		<div class="theme-bg-card dark:bg-gray-800 border theme-border dark:theme-border rounded-xl shadow-sm p-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:theme-text-primary mb-4">密码哈希生成器</h3>
			
			<div class="space-y-4">
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						输入密码
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="请输入至少8位密码"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:theme-text-primary"
					/>
				</div>

				<button
					on:click={generateHash}
					disabled={loading}
					class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 theme-text-primary font-medium py-2 px-4 rounded-lg transition-colors"
				>
					{loading ? '生成中...' : '生成哈希'}
				</button>

				{#if error}
					<div class="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
						<p class="text-sm text-red-600 dark:text-red-400">{error}</p>
					</div>
				{/if}

				{#if hashedPassword}
					<div class="space-y-2">
							<label for="hashed-password" class="block text-sm font-medium text-gray-700 dark:theme-text-muted">
								生成的哈希密码
							</label>
							<div class="relative">
								<textarea
									id="hashed-password"
									readonly
									value={hashedPassword}
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:theme-text-primary text-sm font-mono resize-none"
									rows="3"
								></textarea>
								<button
									type="button"
									on:click={() => copyToClipboard(hashedPassword)}
									class="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
									aria-label="复制哈希密码"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
									</svg>
								</button>
							</div>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							将此哈希值设置为 ADMIN_PASSWORD 环境变量
						</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- JWT Secret Generator -->
		<div class="theme-bg-card dark:bg-gray-800 border theme-border dark:theme-border rounded-xl shadow-sm p-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:theme-text-primary mb-4">JWT 密钥生成器</h3>
			
			<div class="space-y-4">
				<p class="text-sm theme-text-muted dark:text-gray-400">
					生成一个安全的 JWT 签名密钥
				</p>

				<button
					on:click={generateJWTSecret}
					class="w-full bg-green-600 hover:bg-green-700 theme-text-primary font-medium py-2 px-4 rounded-lg transition-colors"
				>
					生成 JWT 密钥
				</button>

				{#if jwtSecret}
					<div class="space-y-2">
						<label for="jwt-secret" class="block text-sm font-medium text-gray-700 dark:theme-text-muted">
							生成的 JWT 密钥
						</label>
						<div class="relative">
							<textarea
								id="jwt-secret"
								readonly
								value={jwtSecret}
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:theme-text-primary text-sm font-mono resize-none"
								rows="3"
							></textarea>
							<button
								type="button"
								on:click={() => copyToClipboard(jwtSecret)}
								class="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								aria-label="复制JWT密钥"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
								</svg>
							</button>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							将此密钥设置为 JWT_SECRET 环境变量
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Environment Variables Guide -->
	<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
		<h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">环境变量配置指南</h3>
		
		<div class="space-y-4 text-sm">
			<div>
				<h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">必需的环境变量：</h4>
				<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-4 font-mono text-xs space-y-1">
					<div><span class="text-blue-600 dark:text-blue-400">ADMIN_PASSWORD</span>=生成的哈希密码</div>
					<div><span class="text-blue-600 dark:text-blue-400">JWT_SECRET</span>=生成的JWT密钥</div>
				</div>
			</div>

			<div>
				<h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">可选的环境变量：</h4>
				<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-4 font-mono text-xs space-y-1">
					<div><span class="text-green-600 dark:text-green-400">ADMIN_USERNAME</span>=admin (默认)</div>
					<div><span class="text-green-600 dark:text-green-400">SESSION_DURATION</span>=24h (默认)</div>
				</div>
			</div>

			<div class="text-blue-700 dark:text-blue-300">
				<p><strong>注意：</strong> 设置环境变量后需要重启应用程序才能生效。</p>
			</div>
		</div>
	</div>

	{#if copied}
		<div class="fixed bottom-4 right-4 bg-green-600 theme-text-primary px-4 py-2 rounded-lg shadow-lg">
			已复制到剪贴板！
		</div>
	{/if}
</div>
