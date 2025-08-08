<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let searchQuery = $state('');
	let isSearching = $state(false);

	// Initialize search query from URL params
	$effect(() => {
		const urlSearchQuery = $page.url.searchParams.get('search') || '';
		searchQuery = urlSearchQuery;
	});

	function handleSearch() {
		if (isSearching) return;
		
		isSearching = true;
		const url = new URL($page.url);
		
		if (searchQuery.trim()) {
			url.searchParams.set('search', searchQuery.trim());
		} else {
			url.searchParams.delete('search');
		}
		
		// Reset to first page when searching
		url.searchParams.delete('page');
		
		goto(url.toString()).finally(() => {
			isSearching = false;
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	function clearSearch() {
		searchQuery = '';
		handleSearch();
	}
</script>

<div class="relative max-w-md mx-auto">
	<div class="relative">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
			</svg>
		</div>
		<input
			type="text"
			bind:value={searchQuery}
			onkeydown={handleKeydown}
			placeholder="Search articles..."
			class="block w-full rounded-md border border-gray-300 dark:border-gray-600 theme-bg-card dark:bg-gray-800 py-2 pl-10 pr-12 text-sm text-gray-900 dark:theme-text-primary placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
		/>
		{#if searchQuery}
			<div class="absolute inset-y-0 right-0 flex items-center">
				<button
					type="button"
					onclick={clearSearch}
					class="h-full px-3 text-gray-400 hover:theme-text-muted dark:hover:theme-text-muted focus:outline-none"
				>
					<span class="sr-only">Clear search</span>
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
					</svg>
				</button>
			</div>
		{/if}
	</div>
	
	{#if isSearching}
		<div class="absolute top-full left-0 right-0 mt-1 text-center">
			<span class="text-sm text-gray-500 dark:text-gray-400">Searching...</span>
		</div>
	{/if}
</div>
