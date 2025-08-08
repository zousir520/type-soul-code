<script lang="ts">
	import { onMount } from 'svelte';

	// Game plugin state
	let gamePluginActive = $state(false);

	// Check plugin status on mount and when localStorage changes
	onMount(() => {
		gamePluginActive = localStorage.getItem('vibby-game-plugin-active') === 'true';

		// Listen for storage changes
		const handleStorageChange = () => {
			gamePluginActive = localStorage.getItem('vibby-game-plugin-active') === 'true';
		};

		window.addEventListener('storage', handleStorageChange);
		window.addEventListener('plugin-status-changed', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('plugin-status-changed', handleStorageChange);
		};
	});

	// Base admin links
	const baseAdminLinks = [
		{
			name: 'API Keys',
			description: 'Manage external API keys',
			href: '/vibbyai/api-keys',
			icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z',
			color: 'blue',
			external: false
		},
		{
			name: 'Content CMS',
			description: 'Manage website content',
			href: '/admin',
			icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
			color: 'green',
			external: false
		}
	];



	// Additional admin links
	const additionalAdminLinks = [
		{
			name: 'Themes',
			description: 'Beautiful theme templates',
			href: '/vibbyai/theme',
			icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
			color: 'purple',
			external: false
		},
		{
			name: 'Plugins',
			description: 'Extend website functionality',
			href: '/vibbyai/plugin',
			icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
			color: 'blue',
			external: false
		},
		{
			name: 'SEO Tools',
			description: 'Search engine optimization tools',
			href: '/vibbyai/seo',
			icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z',
			color: 'purple',
			external: false
		},
		{
			name: 'Website',
			description: 'View live website',
			href: '/',
			icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
			color: 'indigo',
			external: false
		},
		{
			name: 'GitHub Repository',
			description: 'Source code repository',
			href: 'https://github.com/gstarwd/tenniszero.org',
			icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
			color: 'gray',
			external: true
		},
		{
			name: 'Documentation',
			description: 'Project documentation',
			href: '/docs',
			icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125.504-1.125 1.125V11.25a9 9 0 00-9-9z',
			color: 'orange',
			external: false
		}
	];

	// Content Management links (includes game menu when plugin is active)
	const contentManagementLinks = $derived([
		...baseAdminLinks,
		// Add game management when plugin is active
		...(gamePluginActive ? [{
			name: 'Games',
			description: 'Manage games and iframe content',
			href: '/vibbyai/cms/games',
			icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
			color: 'red',
			badge: 'Plugin',
			external: false
		}] : [])
	]);

	// Combine all admin links
	const adminLinks = $derived([...contentManagementLinks, ...additionalAdminLinks]);

	function getColorClasses(color: string) {
		const colors = {
			blue: 'bg-blue-100 dark:bg-blue-700/40 text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-600/50',
			green: 'bg-green-100 dark:bg-green-700/40 text-green-600 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-600/50',
			red: 'bg-red-100 dark:bg-red-700/40 text-red-600 dark:text-red-300 group-hover:bg-red-200 dark:group-hover:bg-red-600/50',
			purple: 'bg-purple-100 dark:bg-purple-700/40 text-purple-600 dark:text-purple-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-600/50',
			indigo: 'bg-indigo-100 dark:bg-indigo-700/40 text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-600/50',
			gray: 'theme-bg-muted dark:bg-gray-600/40 theme-text-muted dark:theme-text-muted group-hover:bg-gray-200 dark:group-hover:bg-gray-500/50',
			orange: 'bg-orange-100 dark:bg-orange-700/40 text-orange-600 dark:text-orange-300 group-hover:bg-orange-200 dark:group-hover:bg-orange-600/50'
		};
		return colors[color as keyof typeof colors] || colors.blue;
	}
</script>

<svelte:head>
	<title>Dashboard - tenniszero.org</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div>
		<h1 class="text-2xl font-bold theme-text-primary">Dashboard</h1>
		<p class="mt-1 text-sm theme-text-muted">
			Quick access to commonly used admin tools and links.
		</p>
	</div>

	<!-- Content Management Section -->
	<div>
		<h2 class="text-lg font-semibold theme-text-primary mb-4">Content Management</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each contentManagementLinks as link}
				<a
					href={link.href}
					class="group relative rounded-xl border theme-border theme-bg-card p-6 hover:theme-bg-muted hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg"
					target={link.external ? '_blank' : '_self'}
					rel={link.external ? 'noopener noreferrer' : ''}
				>
					<div class="flex items-start space-x-4">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 {getColorClasses(link.color)} rounded-lg flex items-center justify-center transition-colors">
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d={link.icon} />
								</svg>
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-semibold theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{link.name}
								</h3>
								{#if 'badge' in link && link.badge}
									<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
										{link.badge}
									</span>
								{/if}
								{#if link.external}
									<svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
									</svg>
								{/if}
							</div>
							<p class="mt-2 text-sm theme-text-muted">
								{link.description}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- Other Admin Tools -->
	<div>
		<h2 class="text-lg font-semibold theme-text-primary mb-4">Admin Tools</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each additionalAdminLinks as link}
				<a
					href={link.href}
					class="group relative rounded-xl border theme-border theme-bg-card p-6 hover:theme-bg-muted hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg"
					target={link.external ? '_blank' : '_self'}
					rel={link.external ? 'noopener noreferrer' : ''}
				>
					<div class="flex items-start space-x-4">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 {getColorClasses(link.color)} rounded-lg flex items-center justify-center transition-colors">
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d={link.icon} />
								</svg>
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-semibold theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{link.name}
								</h3>
								{#if link.external}
									<svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
									</svg>
								{/if}
							</div>
							<p class="mt-2 text-sm theme-text-muted">
								{link.description}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- Quick Stats -->
	<div class="theme-bg-card border theme-border rounded-xl shadow-sm">
		<div class="p-6">
			<h3 class="text-lg font-semibold theme-text-primary mb-4">Quick Stats</h3>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
				<div class="text-center p-4 theme-bg-muted rounded-lg">
					<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">7</div>
					<div class="text-sm theme-text-muted">Admin Tools</div>
				</div>
				<div class="text-center p-4 theme-bg-muted rounded-lg">
					<div class="text-2xl font-bold text-green-600 dark:text-green-400">7</div>
					<div class="text-sm theme-text-muted">API Providers</div>
				</div>
				<div class="text-center p-4 theme-bg-muted rounded-lg">
					<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">8</div>
					<div class="text-sm theme-text-muted">SEO Tools</div>
				</div>
				<div class="text-center p-4 theme-bg-muted rounded-lg">
					<div class="text-2xl font-bold text-orange-600 dark:text-orange-400">4</div>
					<div class="text-sm theme-text-muted">Categories</div>
				</div>
			</div>
		</div>
	</div>
</div>
