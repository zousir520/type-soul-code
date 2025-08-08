<script lang="ts">
	import { onMount } from 'svelte';
	import type { EnvConfig } from '$lib/types/env-config';

	let config: EnvConfig | null = null;
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/env-config');
			const result = await response.json();
			
			if (result.success) {
				config = result.data;
			} else {
				error = result.error;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Environment Configuration Test</h1>
	
	{#if loading}
		<div class="flex items-center justify-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<span class="ml-2">Loading configuration...</span>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4">
			<h2 class="text-red-800 font-medium">Error</h2>
			<p class="text-red-600">{error}</p>
		</div>
	{:else if config}
		<div class="theme-bg-card rounded-lg shadow border p-6">
			<h2 class="text-xl font-semibold mb-4">Current Configuration</h2>
			<div class="space-y-2">
				{#each Object.entries(config) as [key, value]}
					{#if value}
						<div class="flex items-center justify-between py-2 border-b border-gray-100">
							<span class="font-medium text-gray-700">{key}</span>
							<span class="theme-text-muted font-mono text-sm">
								{value === '***已设置***' ? '🔒 Set' : value}
							</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		
		<div class="mt-6">
			<a 
				href="/vibbyai/init" 
				class="inline-flex items-center px-4 py-2 bg-blue-600 theme-text-primary rounded-lg hover:bg-blue-700 transition-colors"
			>
				Go to Setup Wizard
			</a>
		</div>
	{/if}
</div>
