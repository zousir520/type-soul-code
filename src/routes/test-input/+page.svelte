<script>
	let testValue = 'Test input text';
</script>

<svelte:head>
	<title>Input Style Test</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:theme-bg-muted p-8">
	<div class="max-w-2xl mx-auto space-y-8">
		<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">输入框样式测试</h1>
		
		<!-- 新样式输入框 -->
		<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-6 border theme-border dark:theme-border">
			<h2 class="text-lg font-medium text-gray-900 dark:theme-text-primary mb-4">新样式（修复后）</h2>
			<div class="space-y-4">
				<div>
					<label for="test-input" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						测试输入框
					</label>
					<input
						id="test-input"
						type="text"
						bind:value={testValue}
						placeholder="请输入测试文字"
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
						当前值: {testValue}
					</p>
				</div>
				
				<div>
					<label for="password-input" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						密码输入框
					</label>
					<input
						id="password-input"
						type="password"
						placeholder="请输入密码"
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
					/>
				</div>
				
				<div>
					<label for="email-input" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						邮箱输入框
					</label>
					<input
						id="email-input"
						type="email"
						placeholder="example@domain.com"
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 theme-bg-card text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:theme-text-primary dark:placeholder-gray-400"
					/>
				</div>
			</div>
		</div>
		
		<!-- 旧样式对比 -->
		<div class="theme-bg-card dark:bg-gray-800 rounded-lg p-6 border theme-border dark:theme-border">
			<h2 class="text-lg font-medium text-gray-900 dark:theme-text-primary mb-4">旧样式（对比）</h2>
			<div class="space-y-4">
				<div>
					<label for="old-style-input" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">
						旧样式输入框
					</label>
					<input
						id="old-style-input"
						type="text"
						placeholder="旧样式可能看不清"
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:theme-text-primary"
					/>
				</div>
			</div>
		</div>
		
		<!-- 主题切换提示 -->
		<div class="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4">
			<h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">测试说明</h3>
			<div class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
				<p>• 新样式在亮色和暗色模式下都有良好的对比度</p>
				<p>• 输入文字应该清晰可见，不会出现白色文字看不清的问题</p>
				<p>• 占位符文字也有适当的对比度</p>
				<p>• 请在不同主题下测试输入框的可见性</p>
			</div>
		</div>
		
		<div class="flex space-x-4">
			<a href="/vibbyai/init" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm theme-text-primary bg-blue-600 hover:bg-blue-700">
				返回配置页面
			</a>
			<a href="/vibbyai" class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 theme-bg-card hover:bg-gray-50 dark:bg-gray-700 dark:theme-text-muted dark:border-gray-600 dark:hover:bg-gray-600">
				后台管理
			</a>
		</div>
	</div>
</div>
