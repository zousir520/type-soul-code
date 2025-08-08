<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { siteConfig, updateSiteConfig, type SiteType } from '$lib/stores/site-config';

	let currentConfig = $state({ type: 'site-tool', title: '', description: '' });
	let localStorageData = $state('');
	let mounted = $state(false);

	function switchToGame() {
		updateSiteConfig({ type: 'site-game' });
	}

	function switchToTool() {
		updateSiteConfig({ type: 'site-tool' });
	}

	function switchToBlog() {
		updateSiteConfig({ type: 'site-blog' });
	}

	onMount(() => {
		mounted = true;
		
		// 读取 localStorage
		if (browser) {
			localStorageData = localStorage.getItem('vibby-site-config') || 'null';
		}

		// 订阅配置变化
		const unsubscribe = siteConfig.subscribe(config => {
			currentConfig = config;
			if (browser) {
				localStorageData = localStorage.getItem('vibby-site-config') || 'null';
			}
		});

		return unsubscribe;
	});
</script>

<svelte:head>
	<title>Config Test</title>
</svelte:head>

<div class="p-8 max-w-4xl mx-auto">
	<h1 class="text-3xl font-bold mb-6">Site Configuration Test</h1>
	
	{#if mounted}
		<div class="space-y-6">
			<!-- Current Configuration -->
			<div class="theme-bg-muted p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Current Configuration</h2>
				<p><strong>Type:</strong> {currentConfig.type}</p>
				<p><strong>Title:</strong> {currentConfig.title}</p>
				<p><strong>Description:</strong> {currentConfig.description}</p>
			</div>

			<!-- LocalStorage Data -->
			<div class="bg-blue-100 p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">LocalStorage Data</h2>
				<pre class="text-sm theme-bg-card p-2 rounded">{localStorageData}</pre>
			</div>

			<!-- Controls -->
			<div class="bg-green-100 p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">Switch Site Type</h2>
				<div class="space-x-4">
					<button 
						onclick={switchToTool}
						class="px-4 py-2 bg-blue-600 theme-text-primary rounded hover:bg-blue-700"
					>
						Switch to Tool
					</button>
					<button 
						onclick={switchToGame}
						class="px-4 py-2 bg-green-600 theme-text-primary rounded hover:bg-green-700"
					>
						Switch to Game
					</button>
					<button 
						onclick={switchToBlog}
						class="px-4 py-2 bg-purple-600 theme-text-primary rounded hover:bg-purple-700"
					>
						Switch to Blog
					</button>
				</div>
			</div>

			<!-- Test Links -->
			<div class="bg-yellow-100 p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">Test Links</h2>
				<div class="space-x-4">
					<a href="/" class="text-blue-600 hover:underline">Go to Homepage</a>
					<a href="/vibbyai/sitemode" class="text-blue-600 hover:underline">Site Mode</a>
				</div>
			</div>
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
