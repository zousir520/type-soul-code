<script lang="ts">
	import DashboardSidebar from '$lib/components/dashboard/Sidebar.svelte';
	import Header from '$lib/components/dashboard/Header.svelte';
	
	let { children } = $props();
	
	// Mock user data - will be replaced with real auth
	const user = {
		name: 'John Doe',
		email: 'john@example.com',
		avatar: '/avatar-placeholder.png'
	};
	
	let sidebarOpen = $state(false);
	
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<div class="min-h-screen bg-gray-50 dark:theme-bg-muted">
	<!-- Sidebar -->
	<DashboardSidebar bind:open={sidebarOpen} />
	
	<!-- Main content -->
	<div class="lg:pl-64">
		<!-- Header -->
		<Header {user} collapsed={false} toggleSidebar={toggleSidebar} toggleCollapse={() => {}} />
		
		<!-- Page content -->
		<main class="py-6">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{@render children()}
			</div>
		</main>
	</div>
</div>
