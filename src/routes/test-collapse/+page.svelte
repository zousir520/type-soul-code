<script lang="ts">
	let collapsed = $state(false);
	
	function toggleCollapse() {
		collapsed = !collapsed;
	}
</script>

<div class="p-8">
	<h1 class="text-2xl font-bold mb-4">Collapse Test</h1>
	
	<div class="flex gap-4 items-center mb-8">
		<button 
			onclick={toggleCollapse}
			class="px-4 py-2 bg-blue-600 theme-text-primary rounded-md hover:bg-blue-700"
		>
			{collapsed ? 'Expand' : 'Collapse'}
		</button>
		<span class="text-sm theme-text-muted">
			Current state: {collapsed ? 'Collapsed' : 'Expanded'}
		</span>
	</div>
	
	<div class="flex">
		<!-- Sidebar simulation -->
		<div class="{collapsed ? 'w-16' : 'w-64'} theme-bg-muted h-96 transition-all duration-300 flex flex-col">
			<div class="p-4 border-b">
				{#if collapsed}
					<div class="text-center">🎯</div>
				{:else}
					<div class="font-bold">🎯 tenniszero.org</div>
				{/if}
			</div>
			
			<div class="flex-1 p-2">
				{#if collapsed}
					<div class="space-y-2">
						<div class="text-center p-2">📊</div>
						<div class="text-center p-2">🔑</div>
						<div class="text-center p-2">📈</div>
					</div>
				{:else}
					<div class="space-y-2">
						<div class="p-2 theme-bg-card rounded">📊 Dashboard</div>
						<div class="p-2 theme-bg-card rounded">🔑 API Keys</div>
						<div class="p-2 theme-bg-card rounded">📈 Usage</div>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Content area -->
		<div class="flex-1 theme-bg-card p-8 border">
			<h2 class="text-xl font-semibold mb-4">Main Content Area</h2>
			<p class="theme-text-muted">
				This area should expand when the sidebar is collapsed.
				Current sidebar width: {collapsed ? '64px' : '256px'}
			</p>
		</div>
	</div>
</div>
