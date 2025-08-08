<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	// Global app state
	let theme = $state('light');

	onMount(() => {
		// 初始化主题
		const savedTheme = localStorage.getItem('theme');
		theme = savedTheme || 'dark'; // 默认使用暗色主题

		// 应用主题到文档
		document.documentElement.classList.toggle('dark', theme === 'dark');

		// 标记应用已加载
		document.body.classList.add('app-loaded');
		document.body.classList.remove('app-loading');
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}
</script>

<svelte:head>
	<title>Type Soul Codes</title>
	<meta name="description" content="Type Soul Codes - Get the latest working codes for Type Soul game" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<main class="flex-grow">
		{@render children()}
	</main>
</div>
