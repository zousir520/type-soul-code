<script lang="ts">
	import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
	import RecentActivity from '$lib/components/dashboard/RecentActivity.svelte';
	import UsageChart from '$lib/components/dashboard/UsageChart.svelte';
	
	// Mock data - will be replaced with real API calls
	const stats = [
		{
			name: 'Total API Calls',
			value: '2,847',
			change: '+12%',
			changeType: 'positive' as const
		},
		{
			name: 'Active Users',
			value: '1,234',
			change: '+8%',
			changeType: 'positive' as const
		},
		{
			name: 'Revenue',
			value: '$12,847',
			change: '+23%',
			changeType: 'positive' as const
		},
		{
			name: 'Credits Used',
			value: '847',
			change: '-2%',
			changeType: 'negative' as const
		}
	];
	
	const recentActivities = [
		{
			id: 1,
			type: 'api_call',
			description: 'API call to /v1/generate',
			timestamp: '2 minutes ago',
			status: 'success'
		},
		{
			id: 2,
			type: 'payment',
			description: 'Payment received for Pro plan',
			timestamp: '1 hour ago',
			status: 'success'
		},
		{
			id: 3,
			type: 'user_signup',
			description: 'New user registered',
			timestamp: '3 hours ago',
			status: 'success'
		},
		{
			id: 4,
			type: 'api_call',
			description: 'API call failed - rate limit exceeded',
			timestamp: '5 hours ago',
			status: 'error'
		}
	];
</script>

<svelte:head>
	<title>Dashboard - SvelteKit Shipany</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900 dark:theme-text-primary">Dashboard</h1>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
			Welcome back! Here's what's happening with your application.
		</p>
	</div>
	
	<!-- Stats cards -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<StatsCard {stat} />
		{/each}
	</div>
	
	<!-- Charts and activity -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Usage chart -->
		<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
			<div class="p-6">
				<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">API Usage</h3>
				<div class="mt-4">
					<UsageChart />
				</div>
			</div>
		</div>
		
		<!-- Recent activity -->
		<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
			<div class="p-6">
				<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Recent Activity</h3>
				<div class="mt-4">
					<RecentActivity activities={recentActivities} />
				</div>
			</div>
		</div>
	</div>
	
	<!-- Quick actions -->
	<div class="theme-bg-card dark:bg-gray-800 overflow-hidden shadow rounded-lg">
		<div class="p-6">
			<h3 class="text-lg font-medium text-gray-900 dark:theme-text-primary">Quick Actions</h3>
			<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<a
					href="/dashboard/api-keys"
					class="relative rounded-lg border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors"
				>
					<div class="flex-shrink-0">
						<span class="text-2xl">🔑</span>
					</div>
					<div class="flex-1 min-w-0">
						<span class="absolute inset-0" aria-hidden="true"></span>
						<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">Manage API Keys</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">Create and manage your API keys</p>
					</div>
				</a>
				
				<a
					href="/dashboard/settings"
					class="relative rounded-lg border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors"
				>
					<div class="flex-shrink-0">
						<span class="text-2xl">⚙️</span>
					</div>
					<div class="flex-1 min-w-0">
						<span class="absolute inset-0" aria-hidden="true"></span>
						<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">Account Settings</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">Update your profile and preferences</p>
					</div>
				</a>
				
				<a
					href="/dashboard/billing"
					class="relative rounded-lg border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors"
				>
					<div class="flex-shrink-0">
						<span class="text-2xl">💳</span>
					</div>
					<div class="flex-1 min-w-0">
						<span class="absolute inset-0" aria-hidden="true"></span>
						<p class="text-sm font-medium text-gray-900 dark:theme-text-primary">Billing & Usage</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">View your subscription and usage</p>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>
