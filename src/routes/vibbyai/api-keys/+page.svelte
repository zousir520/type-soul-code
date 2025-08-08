<script lang="ts">
	import { onMount } from 'svelte';
	import { API_PROVIDERS, API_CATEGORIES } from '$lib/config/api-providers';
	import type { ApiKeyConfig } from '$lib/types/api-keys';

	// State
	let apiKeys: ApiKeyConfig[] = $state([]);
	let loading = $state(true);
	let message = $state('');
	let selectedCategory = $state('all');
	let expandedCategories = $state<Record<string, boolean>>({});

	// Form state
	let selectedProviderId = $state('');
	let keyName = $state('');
	let keyDescription = $state('');
	let keyFields: Record<string, string> = $state({});

	// Computed values
	let categories = $derived(Object.keys(API_CATEGORIES));

	// 初始化展开状态
	onMount(() => {
		// 默认展开所有类别
		Object.keys(API_CATEGORIES).forEach(categoryId => {
			expandedCategories[categoryId] = true;
		});
		loadApiKeys();
	});

	function toggleCategory(categoryId: string) {
		expandedCategories[categoryId] = !expandedCategories[categoryId];
	}


	async function loadApiKeys() {
		try {
			loading = true;
			const response = await fetch('/api/api-keys');
			const result = await response.json();

			if (result.success) {
				apiKeys = result.data;
			} else {
				message = result.error || 'Failed to load API keys';
			}
		} catch (error) {
			console.error('Error loading API keys:', error);
			message = 'Failed to load API keys';
		} finally {
			loading = false;
		}
	}


	function onProviderChange() {
		const provider = API_PROVIDERS.find(p => p.id === selectedProviderId);
		if (provider) {
			keyFields = {};
			provider.fields.forEach(field => {
				keyFields[field.key] = '';
			});
		}
	}

	async function saveApiKey() {
		try {
			const response = await fetch('/api/api-keys', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					providerId: selectedProviderId,
					name: keyName,
					description: keyDescription,
					fields: keyFields
				})
			});

			const result = await response.json();

			if (result.success) {
				message = 'API key created successfully!';
				// Reset form
				selectedProviderId = '';
				keyName = '';
				keyDescription = '';
				keyFields = {};
				loadApiKeys();
			} else {
				message = result.error || 'Failed to save API key';
			}
		} catch (error) {
			console.error('Error saving API key:', error);
			message = 'Failed to save API key';
		}
	}

	async function deleteApiKey(keyId: string) {
		if (!confirm('确定要删除这个API密钥吗？')) {
			return;
		}

		try {
			const response = await fetch(`/api/api-keys/${keyId}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			if (result.success) {
				message = 'API密钥删除成功！';
				loadApiKeys();
			} else {
				message = result.error || '删除API密钥失败';
			}
		} catch (error) {
			console.error('Error deleting API key:', error);
			message = '删除API密钥失败';
		}
	}

	async function testApiKey(keyId: string) {
		try {
			const response = await fetch(`/api/api-keys/${keyId}/test`, {
				method: 'POST'
			});

			const result = await response.json();

			if (result.success) {
				message = 'API密钥测试成功！';
			} else {
				message = result.error || 'API密钥测试失败';
			}
		} catch (error) {
			console.error('Error testing API key:', error);
			message = 'API密钥测试失败';
		}
	}

	function getProviderInfo(providerId: string) {
		return API_PROVIDERS.find(p => p.id === providerId);
	}

	function getColorClasses(color: string) {
		const colors = {
			blue: 'bg-blue-100 dark:bg-blue-700/40 text-blue-600 dark:text-blue-300',
			green: 'bg-green-100 dark:bg-green-700/40 text-green-600 dark:text-green-300',
			purple: 'bg-purple-100 dark:bg-purple-700/40 text-purple-600 dark:text-purple-300',
			orange: 'bg-orange-100 dark:bg-orange-700/40 text-orange-600 dark:text-orange-300',
			red: 'bg-red-100 dark:bg-red-700/40 text-red-600 dark:text-red-300',
			indigo: 'bg-indigo-100 dark:bg-indigo-700/40 text-indigo-600 dark:text-indigo-300',
			cyan: 'bg-cyan-100 dark:bg-cyan-700/40 text-cyan-600 dark:text-cyan-300',
			gray: 'theme-bg-muted dark:bg-gray-600/40 theme-text-muted dark:theme-text-muted',
			teal: 'bg-teal-100 dark:bg-teal-700/40 text-teal-600 dark:text-teal-300'
		};
		return colors[color as keyof typeof colors] || colors.blue;
	}

	function getCategoryIcon(category: string) {
		const icons = {
			llm: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.091zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
			search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z'
		};
		return icons[category as keyof typeof icons] || icons.llm;
	}

	function getCategoryName(category: string) {
		return API_CATEGORIES[category as keyof typeof API_CATEGORIES]?.name || category;
	}

	function getCategoryDescription(category: string) {
		return API_CATEGORIES[category as keyof typeof API_CATEGORIES]?.description || '';
	}

	function getKeysForCategory(category: string) {
		return apiKeys.filter(key => {
			const provider = API_PROVIDERS.find(p => p.id === key.providerId);
			return provider?.category === category;
		});
	}

	function getProvidersForCategory(category: string) {
		return API_PROVIDERS.filter(p => p.category === category);
	}

	function maskApiKey(value: string): string {
		if (value.length <= 8) {
			return '*'.repeat(value.length);
		}
		return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
	}
</script>

<svelte:head>
	<title>API Keys - tenniszero.org Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">API 密钥管理</h1>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				管理您的外部API密钥和配置，支持多种AI模型和搜索增强服务。
			</p>
		</div>
		<p class="text-gray-500 dark:text-gray-400">
			在下方选择要配置的API服务提供商
		</p>
	</div>

	<!-- Category Filter -->
	<div class="flex flex-wrap gap-2">
		<button
			onclick={() => selectedCategory = 'all'}
			class="px-3 py-1 text-sm rounded-full transition-colors {selectedCategory === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'theme-bg-muted theme-text-muted dark:bg-gray-700 dark:theme-text-muted hover:bg-gray-200 dark:hover:bg-gray-600'}"
		>
			全部
		</button>
		{#each Object.keys(API_CATEGORIES) as categoryId}
			<button
				onclick={() => selectedCategory = categoryId}
				class="px-3 py-1 text-sm rounded-full transition-colors flex items-center gap-1 {selectedCategory === categoryId ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'theme-bg-muted theme-text-muted dark:bg-gray-700 dark:theme-text-muted hover:bg-gray-200 dark:hover:bg-gray-600'}"
			>
				<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d={getCategoryIcon(categoryId)} />
				</svg>
				{getCategoryName(categoryId)}
			</button>
		{/each}
	</div>

	<!-- Message -->
	{#if message}
		<div class="rounded-md bg-green-50 dark:bg-green-900 p-4">
			<p class="text-sm text-green-800 dark:text-green-200">{message}</p>
		</div>
	{/if}

	<!-- API Keys by Category -->
	{#if loading}
		<div class="theme-bg-card dark:bg-gray-600 rounded-xl border theme-border dark:border-gray-500 p-6">
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
				<p class="text-sm text-gray-500 dark:theme-text-muted">加载API密钥中...</p>
			</div>
		</div>
	{:else if apiKeys.length === 0}
		<div class="theme-bg-card dark:bg-gray-600 rounded-xl border theme-border dark:border-gray-500 p-12 text-center">
			<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
			</svg>
			<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary mb-2">暂无API密钥配置</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-4">开始添加您的第一个API密钥。</p>
			<div class="text-sm text-gray-500 dark:text-gray-400">
				在下方选择要配置的API服务提供商
			</div>
		</div>
		<div class="space-y-6">
			{#each Object.keys(API_CATEGORIES) as categoryId}
				{@const categoryKeys = getKeysForCategory(categoryId)}
				{@const categoryProviders = getProvidersForCategory(categoryId)}
				{#if selectedCategory === 'all' || selectedCategory === categoryId}
					<div class="theme-bg-card dark:bg-gray-600 rounded-xl border theme-border dark:border-gray-500 overflow-hidden">
						<!-- Category Header -->
						<button
							onclick={() => toggleCategory(categoryId)}
							class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						>
							<div class="flex items-center gap-3">
								<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
									<svg class="w-4 h-4 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d={getCategoryIcon(categoryId)} />
									</svg>
								</div>
								<div class="text-left">
									<h2 class="text-lg font-semibold text-gray-900 dark:theme-text-primary">{getCategoryName(categoryId)}</h2>
									<p class="text-sm text-gray-500 dark:text-gray-400">{getCategoryDescription(categoryId)}</p>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-sm text-gray-500 dark:text-gray-400">
									{categoryKeys.length} / {categoryProviders.length} 已配置
								</span>
								<svg
									class="w-5 h-5 text-gray-400 transition-transform duration-200 {expandedCategories[categoryId] ? 'rotate-180' : ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
								</svg>
							</div>
						</button>

						<!-- Providers Grid -->
						{#if expandedCategories[categoryId]}
							<div class="px-6 pb-6">
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{#each categoryProviders as provider}
										{@const existingKey = categoryKeys.find(k => k.providerId === provider.id)}
										<div class="bg-gray-50 dark:bg-gray-700 rounded-lg border theme-border dark:border-gray-600 p-4 hover:shadow-md transition-shadow">
											<div class="flex items-start justify-between mb-3">
												<div class="flex items-center gap-3">
													<div class="w-10 h-10 {getColorClasses(provider.color)} rounded-lg flex items-center justify-center">
														<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
															<path stroke-linecap="round" stroke-linejoin="round" d={provider.icon} />
														</svg>
													</div>
													<div>
														<h3 class="font-medium text-gray-900 dark:theme-text-primary">{provider.name}</h3>
														<p class="text-xs text-gray-500 dark:text-gray-400">{provider.description}</p>
													</div>
												</div>
												{#if existingKey}
													<span class="px-2 py-1 text-xs font-medium rounded-full {existingKey.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'theme-bg-muted text-gray-800 dark:bg-gray-800 dark:text-gray-200'}">
														{existingKey.isActive ? '已激活' : '未激活'}
													</span>
												{:else}
													<span class="px-2 py-1 text-xs font-medium rounded-full theme-bg-muted theme-text-muted dark:bg-gray-700 dark:text-gray-400">
														未配置
													</span>
												{/if}
											</div>

											{#if existingKey}
												<!-- Existing Key Info -->
												<div class="space-y-2 mb-3">
													<div class="text-sm">
														<span class="font-medium text-gray-700 dark:theme-text-muted">名称:</span>
														<span class="theme-text-muted dark:text-gray-400">{existingKey.name}</span>
													</div>
													{#if existingKey.description}
														<div class="text-sm">
															<span class="font-medium text-gray-700 dark:theme-text-muted">描述:</span>
															<span class="theme-text-muted dark:text-gray-400">{existingKey.description}</span>
														</div>
													{/if}
													<div class="space-y-1">
														{#each Object.entries(existingKey.fields) as [fieldKey, fieldValue]}
															{@const field = provider.fields.find(f => f.key === fieldKey)}
															{#if field}
																<div class="text-xs text-gray-500 dark:text-gray-400">
																	<span class="font-medium">{field.label}:</span>
																	{field.type === 'password' ? maskApiKey(fieldValue) : fieldValue}
																</div>
															{/if}
														{/each}
													</div>
													<div class="text-xs text-gray-400">
														创建时间: {new Date(existingKey.createdAt).toLocaleDateString()}
														{#if existingKey.lastUsed}
															• 最后使用: {new Date(existingKey.lastUsed).toLocaleDateString()}
														{/if}
														{#if existingKey.usageCount}
															• 使用次数: {existingKey.usageCount}
														{/if}
													</div>
												</div>

												<!-- Action Buttons -->
												<div class="flex gap-2">
													<button
														onclick={() => testApiKey(existingKey.id)}
														class="flex-1 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors"
													>
														测试
													</button>
													<button
														onclick={() => deleteApiKey(existingKey.id)}
														class="flex-1 px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 transition-colors"
													>
														删除
													</button>
												</div>
											{:else}
												<!-- Inline Add Key Form -->
												{#if selectedProviderId === provider.id}
													<div class="space-y-3 border-t theme-border dark:border-gray-600 pt-3">
														<!-- Name -->
														<div>
															<label for="key-name-{provider.id}" class="block text-xs font-medium text-gray-700 dark:theme-text-muted mb-1">名称</label>
															<input
																id="key-name-{provider.id}"
																type="text"
																bind:value={keyName}
																placeholder="例如: {provider.name} 生产环境"
																class="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:theme-text-primary"
															/>
														</div>

														<!-- Description -->
														<div>
															<label for="key-description-{provider.id}" class="block text-xs font-medium text-gray-700 dark:theme-text-muted mb-1">描述 (可选)</label>
															<input
																id="key-description-{provider.id}"
																type="text"
																bind:value={keyDescription}
																placeholder="简要描述"
																class="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:theme-text-primary"
															/>
														</div>

														<!-- Dynamic Fields -->
														{#each provider.fields as field, index}
															<div>
																<label for="field-{provider.id}-{field.key}" class="block text-xs font-medium text-gray-700 dark:theme-text-muted mb-1">
																	{field.label}
																	{#if field.required}<span class="text-red-500">*</span>{/if}
																</label>
																<input
																	id="field-{provider.id}-{field.key}"
																	type={field.type}
																	bind:value={keyFields[field.key]}
																	placeholder={field.placeholder}
																	class="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:theme-text-primary"
																/>
																{#if field.description}
																	<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{field.description}</p>
																{/if}
															</div>
														{/each}

														<!-- Action Buttons -->
														<div class="flex gap-2 pt-2">
															<button
																onclick={() => {
																	selectedProviderId = '';
																	keyName = '';
																	keyDescription = '';
																	keyFields = {};
																}}
																class="flex-1 px-3 py-1 text-xs theme-text-muted dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
															>
																取消
															</button>
															<button
																onclick={saveApiKey}
																disabled={!keyName}
																class="flex-1 px-3 py-1 text-xs bg-blue-600 theme-text-primary rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
															>
																保存
															</button>
														</div>
													</div>
												{:else}
													<!-- Add Key Button -->
													<button
														onclick={() => {
															selectedProviderId = provider.id;
															onProviderChange();
														}}
														class="w-full px-3 py-2 text-sm theme-bg-muted theme-text-muted rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:theme-text-muted dark:hover:bg-gray-500 transition-colors border-2 border-dashed border-gray-300 dark:border-gray-500"
													>
														+ 添加密钥
													</button>
												{/if}
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

