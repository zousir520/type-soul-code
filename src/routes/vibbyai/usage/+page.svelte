<script lang="ts">
	import { onMount } from 'svelte';

	interface UsageStat {
		name: string;
		value: string;
		change: string;
		changeType: 'positive' | 'negative';
	}

	interface UsageEndpoint {
		name: string;
		path: string;
		description: string;
		calls: number;
		percentage: number;
	}

	interface UsageLimit {
		name: string;
		used: number;
		total: number;
		percentage: number;
		unit?: string;
	}

	interface UsageData {
		stats: UsageStat[];
		endpoints: UsageEndpoint[];
		limits: UsageLimit[];
	}

	let usageData = $state<UsageData | null>(null);
	let loading = $state(true);
	let error = $state('');

	onMount(() => {
		loadUsageData();
	});

	async function loadUsageData() {
		try {
			loading = true;
			const response = await fetch('/api/mock/usage');
			const result = await response.json();

			if (result.code === 0) {
				usageData = result.data;
			} else {
				error = result.message || 'Failed to load usage data';
			}
		} catch (e) {
			error = 'Failed to load usage data';
			console.error(e);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Usage - tenniszero.org Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">Usage Analytics</h1>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
			Monitor your API usage, credits consumption, and performance metrics.
		</p>
	</div>

	{#if loading}
		<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
			<div class="p-6 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
				<p class="text-sm text-gray-500 dark:text-gray-400">Loading usage data...</p>
			</div>
		</div>
	{:else if error}
		<div class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-6">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
					<button onclick={loadUsageData} class="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300">
						Try again
					</button>
				</div>
			</div>
		</div>
	{:else if usageData}
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each usageData.stats as stat}
				<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="text-2xl">📊</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
										{stat.name}
									</dt>
									<dd class="flex items-baseline">
										<div class="text-2xl font-semibold text-gray-900 dark:theme-text-primary">
											{stat.value}
										</div>
										<div class="ml-2 flex items-baseline text-sm font-semibold {stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
											{stat.change}
										</div>
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
			<div class="p-6">
				<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Usage Trends</h3>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
					Your API usage and credit consumption over the last 7 days.
				</p>
				<div class="mt-6">
					<div class="text-center py-8 text-gray-500 dark:text-gray-400">
						<div class="text-4xl mb-2">📈</div>
						<p>Usage chart will be implemented here</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
				<div class="p-6">
					<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Top API Endpoints</h3>
					<div class="mt-4 space-y-4">
						{#each usageData.endpoints as endpoint}
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">{endpoint.path}</p>
									<p class="text-sm text-gray-500 dark:text-gray-400">{endpoint.description}</p>
								</div>
								<div class="text-right">
									<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">{endpoint.calls.toLocaleString()} calls</p>
									<p class="text-sm text-gray-500 dark:text-gray-400">{endpoint.percentage}%</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
				<div class="p-6">
					<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Usage Limits</h3>
					<div class="mt-4 space-y-4">
						{#each usageData.limits as limit}
							<div>
								<div class="flex items-center justify-between">
									<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">{limit.name}</p>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										{limit.used.toLocaleString()}{limit.unit || ''} / {limit.total.toLocaleString()}{limit.unit || ''}
									</p>
								</div>
								<div class="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
									<div class="bg-blue-600 h-2 rounded-full" style="width: {limit.percentage}%"></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
