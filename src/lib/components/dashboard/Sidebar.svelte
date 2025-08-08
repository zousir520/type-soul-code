<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let { open = $bindable(), collapsed = $bindable() } = $props();

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

		// Also listen for custom events from the store page
		const handlePluginChange = () => {
			gamePluginActive = localStorage.getItem('vibby-game-plugin-active') === 'true';
		};

		window.addEventListener('plugin-status-changed', handlePluginChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('plugin-status-changed', handlePluginChange);
		};
	});

	// Base navigation items
	const baseNavigation = [
		{
			name: 'Dashboard',
			href: '/vibbyai',
			icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9 6 9-6'
		},
		{
			name: 'System Setup',
			href: '/vibbyai/init',
			icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
			badge: 'NEW'
		},
		{
			name: 'Growth',
			href: '/vibbyai/growth',
			icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941',
			badge: 'NEW'
		}
	];



	// Additional navigation items
	const additionalNavigation = [
		{
			name: 'API Keys',
			href: '/vibbyai/api-keys',
			icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
		},
		{
			name: 'Site Mode',
			href: '/vibbyai/sitemode',
			icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z',
			badge: 'NEW'
		},
		{
			name: 'Themes',
			href: '/vibbyai/theme',
			icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
			badge: 'NEW'
		},
		{
			name: 'Plugins',
			href: '/vibbyai/plugin',
			icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
			badge: 'NEW'
		},
		{
			name: 'Auth Settings',
			href: '/vibbyai/auth-settings',
			icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
		}
	];

	// Combine all navigation items (without game menu)
	const navigation = $derived([...baseNavigation, ...additionalNavigation]);

	// Content Management section (includes game menu when plugin is active)
	const contentManagement = $derived([
		{
			name: 'Content CMS',
			href: '/vibbyai/cms',
			icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
		},
		// Add game management when plugin is active
		...(gamePluginActive ? [{
			name: 'Games',
			href: '/vibbyai/cms/games',
			icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
			badge: 'Plugin'
		}] : [])
	]);

	function isCurrentPage(href: string) {
		return $page.url.pathname === href;
	}

	function closeSidebar() {
		open = false;
	}
</script>

<!-- Mobile sidebar overlay -->
{#if open}
	<div class="relative z-50 lg:hidden">
		<div class="fixed inset-0 theme-bg-muted/80 backdrop-blur-sm" onclick={closeSidebar} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeSidebar(); } }} role="button" tabindex="0"></div>
		<div class="fixed inset-0 flex">
			<div class="relative mr-16 flex w-full max-w-xs flex-1">
				<div class="absolute left-full top-0 flex w-16 justify-center pt-5">
					<button type="button" class="-m-2.5 p-2.5 rounded-full hover:theme-bg-card/10 transition-colors" onclick={closeSidebar}>
						<span class="sr-only">Close sidebar</span>
						<svg class="h-6 w-6 theme-text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="flex grow flex-col gap-y-5 overflow-y-auto theme-bg-card border-r theme-border px-6 pb-2">
					<div class="flex h-16 shrink-0 items-center">
						<div class="flex items-center space-x-3">
							<div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<span class="theme-text-primary font-bold text-sm">V</span>
							</div>
							<span class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">tenniszero.org</span>
						</div>
					</div>
					<nav class="flex flex-1 flex-col">
						<ul role="list" class="flex flex-1 flex-col gap-y-6">
							<li>
								<div class="text-xs font-semibold leading-6 theme-text-muted uppercase tracking-wider mb-3">
									Platform
								</div>
								<ul role="list" class="space-y-1">
									{#each navigation as item}
										<li>
											<a
												href={item.href}
												class="group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 {isCurrentPage(item.href) ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400' : 'theme-text-primary hover:text-blue-600 dark:hover:text-blue-400 hover:theme-bg-muted'}"
											>
												<svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
												</svg>
												<span class="flex-1">{item.name}</span>
												{#if item.badge}
													<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700/40 dark:text-green-200">
														{item.badge}
													</span>
												{/if}
											</a>
										</li>
									{/each}
								</ul>
							</li>
							<li>
								<div class="text-xs font-semibold leading-6 theme-text-muted uppercase tracking-wider mb-3">
									Content Management
								</div>
								<ul role="list" class="space-y-1">
									{#each contentManagement as item}
										<li>
											<a
												href={item.href}
												class="group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 {isCurrentPage(item.href) ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400' : 'theme-text-primary hover:text-blue-600 dark:hover:text-blue-400 hover:theme-bg-muted'}"
											>
												<svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
												</svg>
												{item.name}
											</a>
										</li>
									{/each}
								</ul>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Static sidebar for desktop -->
<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex {collapsed ? 'lg:w-16' : 'lg:w-64'} lg:flex-col transition-all duration-300">
	<div class="flex grow flex-col gap-y-5 overflow-y-auto border-r theme-border theme-bg-card {collapsed ? 'px-2' : 'px-6'}">
		<div class="flex h-16 shrink-0 items-center {collapsed ? 'justify-center' : ''}">
			{#if collapsed}
				<div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
					<span class="theme-text-primary font-bold text-sm">V</span>
				</div>
			{:else}
				<div class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
						<span class="theme-text-primary font-bold text-sm">V</span>
					</div>
					<span class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">tenniszero.org</span>
				</div>
			{/if}
		</div>
		<nav class="flex flex-1 flex-col">
			<ul role="list" class="flex flex-1 flex-col gap-y-6">
				<li>
					{#if !collapsed}
						<div class="text-xs font-semibold leading-6 text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
							Platform
						</div>
					{/if}
					<ul role="list" class="space-y-1">
						{#each navigation as item}
							<li>
								<a
									href={item.href}
									class="group flex items-center {collapsed ? 'justify-center px-2 py-3' : 'gap-x-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 {isCurrentPage(item.href) ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-sm' : 'theme-text-primary hover:text-blue-600 dark:hover:text-blue-400 hover:theme-bg-muted'}"
									title={collapsed ? item.name : ''}
								>
									<div class="relative">
										<svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
										</svg>
										{#if item.badge && collapsed}
											<span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
										{/if}
									</div>
									{#if !collapsed}
										<span class="flex-1">{item.name}</span>
										{#if item.badge}
											<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700/40 dark:text-green-200">
												{item.badge}
											</span>
										{/if}
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</li>
				<li>
					{#if !collapsed}
						<div class="text-xs font-semibold leading-6 text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
							Content Management
						</div>
					{/if}
					<ul role="list" class="space-y-1">
						{#each contentManagement as item}
							<li>
								<a
									href={item.href}
									class="group flex items-center {collapsed ? 'justify-center px-2 py-3' : 'gap-x-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 {isCurrentPage(item.href) ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-sm' : 'theme-text-primary hover:text-blue-600 dark:hover:text-blue-400 hover:theme-bg-muted'}"
									title={collapsed ? item.name : ''}
								>
									<svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
									</svg>
									{#if !collapsed}
										{item.name}
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</li>
			</ul>
		</nav>

		<!-- Collapse button at bottom -->
		<div class="mt-auto pb-4">
			<button
				onclick={() => collapsed = !collapsed}
				class="w-full flex {collapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'} items-center text-sm font-medium theme-text-muted hover:theme-text-primary hover:theme-bg-muted rounded-lg transition-all duration-200 border theme-border"
				title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			>
				{#if !collapsed}
					<span class="text-xs uppercase tracking-wider">Collapse</span>
				{/if}
				<svg class="h-4 w-4 {collapsed ? '' : 'rotate-180'} transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>
		</div>
	</div>
</div>
