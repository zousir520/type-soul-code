<script lang="ts">
	import { onMount } from 'svelte';
	
	// Check if game plugin is active
	let gamePluginActive = $state(false);
	let games = $state([
		{
			id: 1,
			name: '2048',
			type: 'homegame',
			iframe_url: 'https://play2048.co/',
			iframe_width: '100%',
			iframe_height: '600px',
			is_active: true,
			display_order: 1,
			thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=2048+Game',
			description: 'Classic number merging puzzle game',
			category: 'puzzle',
			rating: 4.5,
			play_count: 1250,
			created_at: '2025-01-11'
		},
		{
			id: 2,
			name: 'Tetris',
			type: 'recommendgame',
			iframe_url: 'https://tetris.com/play-tetris',
			iframe_width: '100%',
			iframe_height: '400px',
			is_active: true,
			display_order: 2,
			thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Tetris+Game',
			description: 'Classic falling blocks puzzle game',
			category: 'puzzle',
			rating: 4.8,
			play_count: 2100,
			created_at: '2025-01-11'
		}
	]);
	
	onMount(() => {
		// Check if game plugin is active
		gamePluginActive = localStorage.getItem('vibby-game-plugin-active') === 'true';
	});
	
	function addNewGame() {
		// Simulate adding a new game
		const newGame = {
			id: games.length + 1,
			name: 'New Game',
			type: 'recommendgame',
			iframe_url: '',
			iframe_width: '100%',
			iframe_height: '400px',
			is_active: false,
			display_order: games.length + 1,
			thumbnail: '',
			description: '',
			category: '',
			rating: 0,
			play_count: 0,
			created_at: new Date().toISOString().split('T')[0]
		};
		games.push(newGame);
	}
	
	function deleteGame(gameId: number) {
		if (confirm('Are you sure you want to delete this game?')) {
			games = games.filter(g => g.id !== gameId);
		}
	}
	
	function toggleGameStatus(gameId: number) {
		const game = games.find(g => g.id === gameId);
		if (game) {
			game.is_active = !game.is_active;
		}
	}
</script>

<svelte:head>
	<title>Game Management - tenniszero.org CMS</title>
</svelte:head>

<div class="games-management">
	<div class="page-header">
		<h1>🎮 Game Management</h1>
		<p>Manage your website games and iframe content</p>
	</div>

	{#if !gamePluginActive}
		<div class="plugin-inactive-notice">
			<div class="notice-content">
				<div class="notice-icon">🔌</div>
				<h2>Game Plugin Not Active</h2>
				<p>The Game Plugin is not currently active. Please activate it in the Plugin Store to manage games.</p>
				<a href="/vibbyai/plugin" class="activate-link">Go to Plugin Store</a>
			</div>
		</div>
	{:else}
		<div class="games-content">
			<div class="content-header">
				<h2>Games Collection</h2>
				<button class="add-btn" onclick={addNewGame}>
					+ Add New Game
				</button>
			</div>

			<div class="games-grid">
				{#each games as game (game.id)}
					<div class="game-card">
						<div class="game-thumbnail">
							{#if game.thumbnail}
								<img src={game.thumbnail} alt={game.name} />
							{:else}
								<div class="placeholder-thumbnail">🎮</div>
							{/if}
							<div class="game-type-badge" class:homegame={game.type === 'homegame'} class:recommendgame={game.type === 'recommendgame'}>
								{game.type === 'homegame' ? 'Hero Game' : 'Recommended'}
							</div>
						</div>

						<div class="game-info">
							<h3>{game.name}</h3>
							<p class="game-description">{game.description || 'No description'}</p>
							
							<div class="game-meta">
								<span class="meta-item">
									<span class="meta-icon">📊</span>
									{game.rating}/5.0
								</span>
								<span class="meta-item">
									<span class="meta-icon">🎯</span>
									{game.play_count} plays
								</span>
								<span class="meta-item">
									<span class="meta-icon">📅</span>
									{game.created_at}
								</span>
							</div>

							<div class="game-url">
								<strong>URL:</strong> 
								<span class="url-text">{game.iframe_url || 'Not set'}</span>
							</div>
						</div>

						<div class="game-actions">
							<button 
								class="action-btn status-btn"
								class:active={game.is_active}
								onclick={() => toggleGameStatus(game.id)}
							>
								{game.is_active ? 'Active' : 'Inactive'}
							</button>
							<button class="action-btn edit-btn">
								Edit
							</button>
							<button class="action-btn delete-btn" onclick={() => deleteGame(game.id)}>
								Delete
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="collection-info">
				<h3>Collection Information</h3>
				<div class="info-grid">
					<div class="info-item">
						<span class="info-label">Total Games:</span>
						<span class="info-value">{games.length}</span>
					</div>
					<div class="info-item">
						<span class="info-label">Active Games:</span>
						<span class="info-value">{games.filter(g => g.is_active).length}</span>
					</div>
					<div class="info-item">
						<span class="info-label">Hero Games:</span>
						<span class="info-value">{games.filter(g => g.type === 'homegame').length}</span>
					</div>
					<div class="info-item">
						<span class="info-label">Recommended Games:</span>
						<span class="info-value">{games.filter(g => g.type === 'recommendgame').length}</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.games-management {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--text-primary, #374151);
	}

	.page-header p {
		color: var(--text-secondary, #6b7280);
		font-size: 1.1rem;
	}

	.plugin-inactive-notice {
		background: #fef3c7;
		border: 1px solid #f59e0b;
		border-radius: 1rem;
		padding: 3rem;
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

	.notice-content h2 {
		color: #92400e;
		margin-bottom: 1rem;
	}

	.notice-content p {
		color: #a16207;
		margin-bottom: 2rem;
	}

	.activate-link {
		background: #f59e0b;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.activate-link:hover {
		background: #d97706;
	}

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.content-header h2 {
		color: var(--text-primary, #374151);
		font-size: 1.5rem;
	}

	.add-btn {
		background: var(--primary-color, #3b82f6);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.add-btn:hover {
		background: var(--primary-color-dark, #2563eb);
	}

	.games-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.game-card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		overflow: hidden;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.game-card:hover {
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.game-thumbnail {
		position: relative;
		height: 150px;
		background: #f3f4f6;
	}

	.game-thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-thumbnail {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 3rem;
		color: #9ca3af;
	}

	.game-type-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
	}

	.game-type-badge.homegame {
		background: #ef4444;
	}

	.game-type-badge.recommendgame {
		background: #10b981;
	}

	.game-info {
		padding: 1.5rem;
	}

	.game-info h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: var(--text-primary, #374151);
	}

	.game-description {
		color: var(--text-secondary, #6b7280);
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.game-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--text-secondary, #6b7280);
	}

	.meta-icon {
		font-size: 1rem;
	}

	.game-url {
		font-size: 0.9rem;
		color: var(--text-secondary, #6b7280);
		margin-bottom: 1rem;
	}

	.url-text {
		word-break: break-all;
		font-family: monospace;
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.game-actions {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		background: #f9fafb;
		border-top: 1px solid #e5e7eb;
	}

	.action-btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		flex: 1;
	}

	.status-btn {
		background: #6b7280;
		color: white;
	}

	.status-btn.active {
		background: #10b981;
	}

	.status-btn:hover {
		opacity: 0.9;
	}

	.edit-btn {
		background: #3b82f6;
		color: white;
	}

	.edit-btn:hover {
		background: #2563eb;
	}

	.delete-btn {
		background: #ef4444;
		color: white;
	}

	.delete-btn:hover {
		background: #dc2626;
	}

	.collection-info {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		padding: 2rem;
	}

	.collection-info h3 {
		color: var(--text-primary, #374151);
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
	}

	.info-label {
		color: var(--text-secondary, #6b7280);
		font-weight: 500;
	}

	.info-value {
		color: var(--text-primary, #374151);
		font-weight: 600;
		font-size: 1.1rem;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.games-management {
			padding: 1rem;
		}

		.content-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.games-grid {
			grid-template-columns: 1fr;
		}

		.game-meta {
			flex-direction: column;
			gap: 0.5rem;
		}

		.game-actions {
			flex-direction: column;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
