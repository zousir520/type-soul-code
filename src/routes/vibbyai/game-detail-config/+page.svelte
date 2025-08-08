<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { updateSiteConfig } from '$lib/stores/site-config';
	import type { GameConfig } from '$lib/types/game-config';
	import { defaultGameConfig } from '$lib/types/game-config';

	let gameConfig: GameConfig = $state({ ...defaultGameConfig });
	let loading = $state(false);
	let saving = $state(false);
	let message = $state('');

	// 加载游戏配置
	async function loadGameConfig() {
		loading = true;
		try {
			const response = await fetch('/api/game-config');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			gameConfig = { ...defaultGameConfig, ...data };
		} catch (error) {
			console.error('Error loading game config:', error);
			message = 'Failed to load game configuration';
		} finally {
			loading = false;
		}
	}

	// 保存游戏配置
	async function saveGameConfig() {
		saving = true;
		try {
			const response = await fetch('/api/game-config', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(gameConfig)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			
			// 自动切换到游戏模式
			console.log('Switching to game mode...');
			updateSiteConfig({ type: 'site-game' });
			console.log('Site config updated to game mode');
			
			message = result.message + ' Homepage switched to game mode!';
			setTimeout(() => message = '', 3000);
		} catch (error) {
			console.error('Error saving game config:', error);
			message = 'Failed to save game configuration';
		} finally {
			saving = false;
		}
	}

	// 添加推荐游戏
	function addRelatedGame() {
		gameConfig.relatedGames = [...gameConfig.relatedGames, {
			id: `game-${Date.now()}`,
			title: 'New Game',
			description: 'Game description',
			thumbnail: '',
			url: '',
			category: 'Action'
		}];
	}

	// 删除推荐游戏
	function removeRelatedGame(index: number) {
		gameConfig.relatedGames = gameConfig.relatedGames.filter((_, i) => i !== index);
	}

	// 添加功能特性
	function addFeature() {
		gameConfig.about.features = [...gameConfig.about.features, {
			title: 'New Feature',
			description: 'Feature description',
			icon: 'play'
		}];
	}

	// 删除功能特性
	function removeFeature(index: number) {
		gameConfig.about.features = gameConfig.about.features.filter((_, i) => i !== index);
	}

	onMount(() => {
		loadGameConfig();
	});
</script>

<svelte:head>
	<title>Game Detail Configuration - tenniszero.org Dashboard</title>
	<meta name="description" content="Configure your game homepage settings and content" />
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">Game Detail Configuration</h1>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Configure your game homepage settings and content.
			</p>
		</div>
		<div class="flex space-x-3">
			<Button variant="outline" onclick={() => window.location.href = '/vibbyai/sitemode'}>
				返回模式选择
			</Button>
			<Button onclick={saveGameConfig} disabled={saving}>
				{saving ? 'Saving...' : 'Save Configuration'}
			</Button>
		</div>
	</div>

	{#if message}
		<div class="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
			<p class="text-blue-800 dark:text-blue-200">{message}</p>
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p class="text-gray-500 dark:text-gray-400">Loading configuration...</p>
		</div>
	{:else}
		<!-- Basic Information -->
		<Card class="theme-bg-card dark:bg-gray-600 border theme-border dark:border-gray-500">
			<CardHeader>
				<CardTitle>Basic Information</CardTitle>
				<CardDescription>Configure basic game information</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div>
					<label for="game-title" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Game Title</label>
					<input
						id="game-title"
						type="text"
						bind:value={gameConfig.title}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
						placeholder="Enter game title"
					/>
				</div>
				<div>
					<label for="game-description" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Game Description</label>
					<textarea
						id="game-description"
						bind:value={gameConfig.description}
						rows="3"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
						placeholder="Enter game description"
					></textarea>
				</div>
				<div>
					<label for="game-keyword" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Main Keyword</label>
					<input
						id="game-keyword"
						type="text"
						bind:value={gameConfig.keyword}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
						placeholder="Enter main keyword for site optimization"
					/>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
						This keyword will be used for overall site optimization and branding.
					</p>
				</div>
			</CardContent>
		</Card>

		<!-- Hero Configuration -->
		<Card class="theme-bg-card dark:bg-gray-600 border theme-border dark:border-gray-500">
			<CardHeader>
				<CardTitle>Hero Section</CardTitle>
				<CardDescription>Configure the main game display area</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div>
					<label for="display-type" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Display Type</label>
					<select
						id="display-type"
						bind:value={gameConfig.hero.type}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
					>
						<option value="iframe">Iframe (Embedded Game)</option>
						<option value="download">Download Button</option>
						<option value="video">Video Preview</option>
					</select>
				</div>

				{#if gameConfig.hero.type === 'iframe'}
					<div>
						<label for="iframe-url" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Game Iframe URL</label>
						<input
							id="iframe-url"
							type="url"
							bind:value={gameConfig.hero.iframeUrl}
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
							placeholder="https://example.com/game"
						/>
					</div>
				{:else if gameConfig.hero.type === 'download'}
					<div>
						<label for="download-url" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Download URL</label>
						<input
							id="download-url"
							type="url"
							bind:value={gameConfig.hero.downloadUrl}
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
							placeholder="https://example.com/download"
						/>
					</div>
				{:else if gameConfig.hero.type === 'video'}
					<div>
						<label for="video-url" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Video URL</label>
						<input
							id="video-url"
							type="url"
							bind:value={gameConfig.hero.videoUrl}
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
							placeholder="https://example.com/video.mp4"
						/>
					</div>
				{/if}

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="hero-title" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Hero Title</label>
						<input
							id="hero-title"
							type="text"
							bind:value={gameConfig.hero.title}
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
							placeholder="Play Now"
						/>
					</div>
					<div>
						<label for="hero-subtitle" class="block text-sm font-medium text-gray-700 dark:theme-text-muted mb-2">Hero Subtitle</label>
						<input
							id="hero-subtitle"
							type="text"
							bind:value={gameConfig.hero.subtitle}
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
							placeholder="Experience the ultimate gaming adventure"
						/>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Game Stats -->
		<Card class="theme-bg-card dark:bg-gray-600 border theme-border dark:border-gray-500">
			<CardHeader>
				<CardTitle>Game Statistics</CardTitle>
				<CardDescription>Display impressive game statistics</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					{#each gameConfig.stats as stat, index}
						<div class="space-y-2">
							<input
								type="text"
								bind:value={stat.label}
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
								placeholder="Stat label"
							/>
							<input
								type="text"
								bind:value={stat.value}
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md theme-bg-card dark:bg-gray-700 text-gray-900 dark:theme-text-primary"
								placeholder="Stat value"
							/>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
