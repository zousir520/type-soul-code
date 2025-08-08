<script lang="ts">
	import DashboardSidebar from '$lib/components/dashboard/Sidebar.svelte';
	import DashboardHeader from '$lib/components/dashboard/Header.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// User data from auth
	const user = {
		name: 'Admin',
		email: 'admin@tenniszero.org',
		avatar: '/avatar-placeholder.png'
	};

	let sidebarOpen = $state(false);
	let sidebarCollapsed = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleCollapse() {
		sidebarCollapsed = !sidebarCollapsed;
	}

	// Check if current page is CMS (needs full height)
	const isCMSPage = $derived($page.route.id?.includes('/cms') ?? false);

	// Check if current page is login (should not show sidebar/header)
	const isLoginPage = $derived($page.url.pathname === '/vibbyai/login');
</script>

{#if isLoginPage}
	<!-- 登录页面：简单布局，无侧边栏和头部 -->
	<div class="min-h-screen theme-bg-muted">
		{@render children()}
	</div>
{:else}
	<!-- 管理员页面：完整布局 -->
	<div class="h-screen theme-bg-card flex flex-col">
		<!-- Sidebar -->
		<DashboardSidebar bind:open={sidebarOpen} bind:collapsed={sidebarCollapsed} />

		<!-- Main content -->
		<div class="{sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'} flex flex-col flex-1 transition-all duration-300">
			<!-- Header -->
			<DashboardHeader {user} collapsed={sidebarCollapsed} {toggleSidebar} {toggleCollapse} />

			<!-- Page content -->
			{#if isCMSPage}
				<!-- Full height for CMS iframe -->
				<main class="flex-1 overflow-hidden">
					{@render children()}
				</main>
			{:else}
				<!-- Normal padding for other pages -->
				<main class="flex-1">
					<div class="px-2">
						{@render children()}
					</div>
				</main>
			{/if}
		</div>
	</div>
{/if}
