<script lang="ts">
	let { user, collapsed, toggleSidebar, toggleCollapse } = $props();

	let userMenuOpen = $state(false);

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	async function handleSignOut() {
		try {
			const response = await fetch('/vibbyai/api/logout', {
				method: 'POST',
			});

			if (response.ok) {
				// 重定向到登录页面
				window.location.href = '/vibbyai/login';
			} else {
				console.error('Logout failed');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function handleToggleCollapse() {
		console.log('Toggle collapse clicked, current state:', collapsed);
		if (toggleCollapse) {
			toggleCollapse();
		} else {
			console.error('toggleCollapse function not provided');
		}
	}
</script>

<div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b theme-border dark:border-gray-800 theme-bg-card/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:theme-bg-card/60 dark:supports-[backdrop-filter]:bg-gray-950/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
	<!-- Mobile menu button -->
	<button type="button" class="-m-2.5 p-2.5 text-gray-700 dark:theme-text-muted hover:text-gray-900 dark:hover:theme-text-primary hover:theme-bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden" onclick={toggleSidebar}>
		<span class="sr-only">Open sidebar</span>
		<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
		</svg>
	</button>

	<!-- Desktop collapse button -->
	<button
		type="button"
		class="hidden lg:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:theme-text-muted bg-gray-50 dark:bg-gray-800/50 hover:theme-bg-muted dark:hover:bg-gray-800 border theme-border dark:theme-border rounded-lg transition-all duration-200 shadow-sm hover:shadow"
		onclick={handleToggleCollapse}
	>
		{#if collapsed}
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
			</svg>
			<span>Expand</span>
		{:else}
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
			</svg>
			<span>Collapse</span>
		{/if}
	</button>

	<!-- Separator -->
	<div class="h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>

	<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
		<div class="relative flex flex-1">
			<!-- Search can be added here -->
		</div>
		<div class="flex items-center gap-x-4 lg:gap-x-6">
			<!-- Notifications button -->
			<button type="button" class="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:hover:theme-text-muted hover:theme-bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors">
				<span class="sr-only">View notifications</span>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
				</svg>
				<!-- Notification badge -->
				<span class="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
			</button>

			<!-- Separator -->
			<div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true"></div>

			<!-- Profile dropdown -->
			<div class="relative">
				<button type="button" class="-m-1.5 flex items-center p-1.5 hover:theme-bg-muted dark:hover:bg-gray-800 rounded-lg transition-colors" onclick={toggleUserMenu}>
					<span class="sr-only">Open user menu</span>
					<div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
						<span class="theme-text-primary font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
					</div>
					<span class="hidden lg:flex lg:items-center">
						<span class="ml-3 text-sm font-semibold leading-6 text-gray-900 dark:theme-text-primary">{user.name}</span>
						<svg class="ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 {userMenuOpen ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
						</svg>
					</span>
				</button>

				{#if userMenuOpen}
					<div class="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-lg theme-bg-card dark:theme-bg-muted py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 border theme-border dark:theme-border focus:outline-none">
						<div class="px-3 py-2 border-b theme-border dark:theme-border">
							<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">{user.name}</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
						</div>
						<a href="/vibbyai/settings" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:theme-text-muted hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Your profile
						</a>
						<a href="/vibbyai/auth-settings" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:theme-text-muted hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
							</svg>
							Auth Settings
						</a>
						<button onclick={handleSignOut} class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 dark:theme-text-muted hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
							</svg>
							Sign out
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
