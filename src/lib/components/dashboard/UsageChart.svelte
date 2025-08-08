<script lang="ts">
	// Mock chart data - in a real app, this would come from an API
	const chartData = [
		{ day: 'Mon', calls: 120 },
		{ day: 'Tue', calls: 190 },
		{ day: 'Wed', calls: 300 },
		{ day: 'Thu', calls: 500 },
		{ day: 'Fri', calls: 200 },
		{ day: 'Sat', calls: 300 },
		{ day: 'Sun', calls: 450 }
	];
	
	const maxCalls = Math.max(...chartData.map(d => d.calls));
</script>

<div class="space-y-4">
	<!-- Chart -->
	<div class="flex items-end space-x-2 h-32">
		{#each chartData as data}
			<div class="flex flex-col items-center flex-1">
				<div 
					class="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
					style="height: {(data.calls / maxCalls) * 100}%"
					title="{data.calls} API calls"
				></div>
				<span class="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.day}</span>
			</div>
		{/each}
	</div>
	
	<!-- Legend -->
	<div class="flex items-center justify-between text-sm">
		<span class="text-gray-500 dark:text-gray-400">API Calls This Week</span>
		<span class="text-gray-900 dark:theme-text-primary font-medium">
			{chartData.reduce((sum, d) => sum + d.calls, 0)} total
		</span>
	</div>
</div>
