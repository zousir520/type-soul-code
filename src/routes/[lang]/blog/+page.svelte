<script lang="ts">
	import type { PageData } from './$types';
	import BlogListPage from '$lib/components/blog/BlogListPage.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const posts = $derived(data.posts || []);
	const pagination = $derived(data.pagination);
	const searchQuery = $derived(data.searchQuery || '');
</script>

<svelte:head>
	<title>Blog - tenniszero.org</title>
	<meta name="description" content="Read the latest articles about AI development, automation, and best practices." />
</svelte:head>

<BlogListPage {posts} {pagination} {searchQuery} lang="zh" />

