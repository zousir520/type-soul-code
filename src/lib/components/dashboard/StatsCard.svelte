<script lang="ts">
	let { stat } = $props();
	
	function getChangeColor(changeType: string) {
		return changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
	}
	

</script>

<div class="theme-bg-card dark:theme-bg-muted border theme-border dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
	<div class="p-6">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium theme-text-muted dark:text-gray-400 mb-1">
					{stat.name}
				</p>
				<div class="flex items-baseline space-x-2">
					<p class="text-2xl font-bold text-gray-900 dark:theme-text-primary">
						{stat.value}
					</p>
					<div class="flex items-center text-sm font-medium {getChangeColor(stat.changeType)}">
						<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if stat.changeType === 'positive'}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
							{:else}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10" />
							{/if}
						</svg>
						{stat.change}
					</div>
				</div>
			</div>
			<div class="flex-shrink-0">
				<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
					<svg class="w-6 h-6 theme-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</div>
			</div>
		</div>
	</div>
</div>
