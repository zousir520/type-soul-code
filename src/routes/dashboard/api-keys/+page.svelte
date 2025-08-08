<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface ApiKey {
		api_key: string;
		title: string;
		status: string;
		created_at: string;
		last_used: string | null;
	}

	// API keys data
	let apiKeys = $state<ApiKey[]>([]);
	let loading = $state(false);
	let error = $state('');

	let showCreateModal = $state(false);
	let newKeyTitle = $state('');
	let showKey = $state('');

	onMount(() => {
		loadApiKeys();
	});

	async function loadApiKeys() {
		try {
			loading = true;
			const response = await fetch('/api/apikeys');
			const result = await response.json();

			if (result.code === 0) {
				apiKeys = result.data || [];
			} else {
				error = result.message;
			}
		} catch (e) {
			error = 'Failed to load API keys';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	async function handleCreateKey() {
		if (!newKeyTitle.trim()) return;

		try {
			loading = true;
			const response = await fetch('/api/apikeys', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: newKeyTitle }),
			});

			const result = await response.json();

			if (result.code === 0) {
				showKey = result.data.api_key;
				newKeyTitle = '';
				showCreateModal = false;
				await loadApiKeys(); // Reload the list
			} else {
				error = result.message;
			}
		} catch (e) {
			error = 'Failed to create API key';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	async function handleDeleteKey(apiKey: string) {
		if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
			try {
				loading = true;
				const response = await fetch('/api/apikeys', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ api_key: apiKey }),
				});

				const result = await response.json();

				if (result.code === 0) {
					await loadApiKeys(); // Reload the list
				} else {
					error = result.message;
				}
			} catch (e) {
				error = 'Failed to delete API key';
				console.error(e);
			} finally {
				loading = false;
			}
		}
	}
	
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		// You could add a toast notification here
	}
	
	function maskKey(key: string) {
		return key.substring(0, 7) + '...' + key.substring(key.length - 4);
	}
</script>

<svelte:head>
	<title>API Keys - SvelteKit Shipany</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div class="md:flex md:items-center md:justify-between">
		<div class="min-w-0 flex-1">
			<h1 class="text-2xl font-bold leading-7 text-gray-900 dark:theme-text-primary sm:truncate sm:text-3xl sm:tracking-tight">
				API Keys
			</h1>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Manage your API keys for accessing the SvelteKit Shipany API.
			</p>
		</div>
		<div class="mt-4 flex md:ml-4 md:mt-0">
			<button
				type="button"
				onclick={() => showCreateModal = true}
				class="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				Create API Key
			</button>
		</div>
	</div>

	<!-- Error message -->
	{#if error}
		<div class="rounded-md bg-red-50 dark:bg-red-900 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-red-800 dark:text-red-200">
						{error}
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>

	<!-- Loading state -->
	{#if loading}
		<div class="theme-bg-card dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
			<div class="px-4 py-8 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
			</div>
		</div>
	{:else}
		<!-- API Keys list -->
		<div class="theme-bg-card dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
			{#if apiKeys.length === 0}
				<div class="px-4 py-8 text-center">
					<p class="text-sm text-gray-500 dark:text-gray-400">No API keys found. Create your first API key to get started.</p>
				</div>
			{:else}
				<ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each apiKeys as apiKey}
						<li>
					<div class="px-4 py-4 sm:px-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<span class="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
										{apiKey.status}
									</span>
								</div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900 dark:theme-text-primary">
										{apiKey.title}
									</div>
									<div class="text-sm text-gray-500 dark:text-gray-400">
										{maskKey(apiKey.api_key)}
									</div>
								</div>
							</div>
							<div class="flex items-center space-x-2">
								<button
									onclick={() => copyToClipboard(apiKey.api_key)}
									class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
								>
									Copy
								</button>
								<button
									onclick={() => handleDeleteKey(apiKey.api_key)}
									class="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm font-medium"
								>
									Delete
								</button>
							</div>
						</div>
						<div class="mt-2 sm:flex sm:justify-between">
							<div class="sm:flex">
								<div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
									Created: {new Date(apiKey.created_at).toLocaleDateString()}
								</div>
							</div>
							<div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
								Last used: {apiKey.last_used ? new Date(apiKey.last_used).toLocaleDateString() : 'Never'}
							</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>
		{/if}
	</div>
{/if}

<!-- Create API Key Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onclick={() => showCreateModal = false} onkeydown={(e) => e.key === 'Enter' && (showCreateModal = false)} role="button" tabindex="0"></div>
			<div class="relative transform overflow-hidden rounded-lg theme-bg-card dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
				<div>
					<h3 class="text-base font-semibold leading-6 text-gray-900 dark:theme-text-primary">Create API Key</h3>
					<div class="mt-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Give your API key a descriptive name to help you identify it later.
						</p>
					</div>
					<div class="mt-4">
						<label for="key-title" class="block text-sm font-medium leading-6 text-gray-900 dark:theme-text-primary">
							API Key Name
						</label>
						<div class="mt-2">
							<input
								type="text"
								id="key-title"
								bind:value={newKeyTitle}
								class="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:theme-text-primary dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
								placeholder="e.g., Production API Key"
							/>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={handleCreateKey}
						class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
					>
						Create
					</button>
					<button
						type="button"
						onclick={() => showCreateModal = false}
						class="mt-3 inline-flex w-full justify-center rounded-md theme-bg-card dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:theme-text-primary shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Show new key modal -->
{#if showKey}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onclick={() => showKey = ''} onkeydown={(e) => e.key === 'Enter' && (showKey = '')} role="button" tabindex="0"></div>
			<div class="relative transform overflow-hidden rounded-lg theme-bg-card dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
				<div>
					<h3 class="text-base font-semibold leading-6 text-gray-900 dark:theme-text-primary">API Key Created</h3>
					<div class="mt-2">
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Your API key has been created. Make sure to copy it now as you won't be able to see it again.
						</p>
					</div>
					<div class="mt-4">
						<div class="rounded-md bg-gray-50 dark:bg-gray-700 px-3 py-2">
							<code class="text-sm text-gray-900 dark:theme-text-primary break-all">{showKey}</code>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={() => copyToClipboard(showKey)}
						class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold theme-text-primary shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
					>
						Copy Key
					</button>
					<button
						type="button"
						onclick={() => showKey = ''}
						class="mt-3 inline-flex w-full justify-center rounded-md theme-bg-card dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:theme-text-primary shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
