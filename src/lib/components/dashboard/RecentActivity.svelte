<script lang="ts">
	let { activities } = $props();
	
	function getActivityIcon(type: string) {
		switch (type) {
			case 'api_call':
				return '🔌';
			case 'payment':
				return '💳';
			case 'user_signup':
				return '👤';
			default:
				return '📝';
		}
	}
	
	function getStatusColor(status: string) {
		switch (status) {
			case 'success':
				return 'text-green-600 dark:text-green-400';
			case 'error':
				return 'text-red-600 dark:text-red-400';
			case 'warning':
				return 'text-yellow-600 dark:text-yellow-400';
			default:
				return 'theme-text-muted dark:text-gray-400';
		}
	}
</script>

<div class="flow-root">
	<ul role="list" class="-mb-8">
		{#each activities as activity, index}
			<li>
				<div class="relative pb-8">
					{#if index !== activities.length - 1}
						<span class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
					{/if}
					<div class="relative flex space-x-3">
						<div>
							<span class="h-8 w-8 rounded-full theme-bg-muted dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
								<span class="text-sm">{getActivityIcon(activity.type)}</span>
							</span>
						</div>
						<div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
							<div>
								<p class="text-sm text-gray-900 dark:theme-text-primary">
									{activity.description}
								</p>
							</div>
							<div class="whitespace-nowrap text-right text-sm {getStatusColor(activity.status)}">
								<time>{activity.timestamp}</time>
							</div>
						</div>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
