<script lang="ts">
	import { onMount } from 'svelte';

	let gamePluginActive = $state(false);

	const collections = [
		{
			name: 'Pages',
			description: 'Manage website pages and content',
			href: '/admin',
			icon: '📄',
			color: 'blue',
			badge: undefined
		},
		{
			name: 'Posts',
			description: 'Manage blog posts and articles',
			href: '/admin',
			icon: '📝',
			color: 'green',
			badge: undefined
		},
		{
			name: 'Media',
			description: 'Manage images and media files',
			href: '/admin',
			icon: '🖼️',
			color: 'purple',
			badge: undefined
		}
	];

	// Dynamic collections based on active plugins
	const dynamicCollections = $derived(gamePluginActive ? [
		{
			name: 'Games',
			description: 'Manage games and iframe content',
			href: '/vibbyai/cms/games',
			icon: '🎮',
			color: 'red',
			badge: 'Plugin'
		}
	] : []);

	const allCollections = $derived([...collections, ...dynamicCollections]);

	onMount(() => {
		// Check if game plugin is active
		gamePluginActive = localStorage.getItem('vibby-game-plugin-active') === 'true';
	});
</script>

<svelte:head>
	<title>Content Management System - tenniszero.org</title>
</svelte:head>

<div class="cms-page">
	<div class="page-header">
		<h1>📝 Content Management System</h1>
		<p>Manage your website content and collections</p>
	</div>

	<div class="collections-grid">
		{#each allCollections as collection (collection.name)}
			<a href={collection.href} class="collection-card {collection.color}">
				<div class="collection-icon">{collection.icon}</div>
				<div class="collection-info">
					<h3>{collection.name}</h3>
					<p>{collection.description}</p>
				</div>
				{#if collection.badge}
					<div class="collection-badge">{collection.badge}</div>
				{/if}
			</a>
		{/each}
	</div>

	{#if !gamePluginActive}
		<div class="plugin-notice">
			<div class="notice-content">
				<div class="notice-icon">🔌</div>
				<h3>Extend with Plugins</h3>
				<p>Install plugins from the Plugin Store to add more content collections and features.</p>
				<a href="/vibbyai/plugin" class="store-link">Visit Plugin Store</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.cms-page {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: var(--text-primary, #374151);
	}

	.page-header p {
		font-size: 1.1rem;
		color: var(--text-secondary, #6b7280);
	}

	.collections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.collection-card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		padding: 2rem;
		text-decoration: none;
		transition: all 0.2s;
		position: relative;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.collection-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.collection-card.blue:hover {
		border-color: #3b82f6;
		box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
	}

	.collection-card.green:hover {
		border-color: #10b981;
		box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
	}

	.collection-card.purple:hover {
		border-color: #8b5cf6;
		box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
	}

	.collection-card.red:hover {
		border-color: #ef4444;
		box-shadow: 0 8px 25px rgba(239, 68, 68, 0.15);
	}

	.collection-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.collection-info h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--text-primary, #374151);
	}

	.collection-info p {
		color: var(--text-secondary, #6b7280);
		line-height: 1.6;
	}

	.collection-badge {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: #ef4444;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.plugin-notice {
		background: #f0f9ff;
		border: 1px solid #0ea5e9;
		border-radius: 1rem;
		padding: 2rem;
		text-align: center;
	}

	.notice-content {
		max-width: 400px;
		margin: 0 auto;
	}

	.notice-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.notice-content h3 {
		color: #0c4a6e;
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.notice-content p {
		color: #0369a1;
		margin-bottom: 1.5rem;
	}

	.store-link {
		background: #0ea5e9;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.store-link:hover {
		background: #0284c7;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.cms-page {
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.collections-grid {
			grid-template-columns: 1fr;
		}

		.collection-card {
			padding: 1.5rem;
		}

		.plugin-notice {
			padding: 1.5rem;
		}
	}
</style>
