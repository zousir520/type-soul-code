<script lang="ts">
	import Navbar from '$lib/components/blocks/Navbar.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="min-h-screen flex flex-col theme-bg-card dark:theme-bg-muted">
	<Navbar siteName={data.generalSettings?.title} navigationData={data.navigationData} currentLang={data.lang} />

	<main class="flex-1">
		{@render children()}
	</main>
</div>
