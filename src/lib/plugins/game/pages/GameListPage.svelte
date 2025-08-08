<script lang="ts">
  import type { GameConfig } from '../types.js';
  
  // Props
  let { games = [] }: { games: GameConfig[] } = $props();
  
  // State
  let searchTerm = $state('');
  let selectedCategory = $state('all');
  let sortBy = $state('name');
  
  // 获取所有分类
  const categories = $derived.by(() => {
    const cats = new Set(games.map(game => game.category).filter(Boolean));
    return Array.from(cats);
  });
  
  // 过滤和排序游戏
  const filteredGames = $derived.by(() => {
    let filtered = games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      return matchesSearch && matchesCategory && game.is_active;
    });
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return (a.display_order || 0) - (b.display_order || 0);
      }
    });
    
    return filtered;
  });
</script>

<svelte:head>
  <title>游戏列表 - tenniszero.org</title>
  <meta name="description" content="浏览所有可用的游戏，包括益智、动作、休闲等各种类型" />
</svelte:head>

<div class="game-list-page">
  <div class="page-header">
    <h1>游戏中心</h1>
    <p>发现和体验各种有趣的游戏</p>
  </div>
  
  <!-- 搜索和过滤 -->
  <div class="filters">
    <div class="search-box">
      <input
        type="text"
        placeholder="搜索游戏..."
        bind:value={searchTerm}
        class="search-input"
      />
    </div>
    
    <div class="filter-controls">
      <select bind:value={selectedCategory} class="category-select">
        <option value="all">所有分类</option>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
      
      <select bind:value={sortBy} class="sort-select">
        <option value="order">默认排序</option>
        <option value="name">按名称</option>
        <option value="rating">按评分</option>
        <option value="newest">最新添加</option>
      </select>
    </div>
  </div>
  
  <!-- 游戏网格 -->
  <div class="games-grid">
    {#each filteredGames as game (game.id)}
      <div class="game-card">
        {#if game.thumbnail}
          <div class="game-thumbnail">
            <img src={game.thumbnail} alt={game.name} loading="lazy" />
          </div>
        {/if}
        
        <div class="game-info">
          <h3 class="game-title">{game.name}</h3>
          
          {#if game.description}
            <p class="game-description">{game.description}</p>
          {/if}
          
          <div class="game-meta">
            {#if game.category}
              <span class="category-badge">{game.category}</span>
            {/if}
            
            {#if game.rating}
              <div class="rating">
                <span class="stars">
                  {#each Array(5) as _, i}
                    <span class="star {i < (game.rating || 0) ? 'filled' : ''}">★</span>
                  {/each}
                </span>
                <span class="rating-text">{game.rating}</span>
              </div>
            {/if}
          </div>
          
          {#if game.tags && game.tags.length > 0}
            <div class="game-tags">
              {#each game.tags.slice(0, 3) as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          {/if}
          
          <div class="game-actions">
            <a href="/games/{game.id}" class="play-button">
              立即游玩
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  {#if filteredGames.length === 0}
    <div class="no-games">
      <h3>没有找到游戏</h3>
      <p>尝试调整搜索条件或选择不同的分类</p>
    </div>
  {/if}
</div>

<style>
  .game-list-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .page-header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  .page-header p {
    font-size: 1.125rem;
    color: #6b7280;
  }
  
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .search-box {
    flex: 1;
    min-width: 300px;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .filter-controls {
    display: flex;
    gap: 1rem;
  }
  
  .category-select, .sort-select {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
    font-size: 0.875rem;
  }
  
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .game-card {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .game-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
  
  .game-thumbnail {
    aspect-ratio: 16/9;
    overflow: hidden;
  }
  
  .game-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .game-info {
    padding: 1.5rem;
  }
  
  .game-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }
  
  .game-description {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .game-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .category-badge {
    background: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .stars {
    color: #fbbf24;
  }
  
  .star {
    font-size: 0.875rem;
  }
  
  .star.filled {
    color: #f59e0b;
  }
  
  .rating-text {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .game-tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .tag {
    background: #dbeafe;
    color: #1e40af;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
  
  .game-actions {
    text-align: center;
  }
  
  .play-button {
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .play-button:hover {
    background: #2563eb;
  }
  
  .no-games {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }
  
  /* 深色模式支持 */
  @media (prefers-color-scheme: dark) {
    .page-header h1 {
      color: #f9fafb;
    }
    
    .page-header p {
      color: #9ca3af;
    }
    
    .search-input, .category-select, .sort-select {
      background: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .game-card {
      background: #1f2937;
    }
    
    .game-title {
      color: #f9fafb;
    }
    
    .game-description {
      color: #9ca3af;
    }
    
    .category-badge {
      background: #374151;
      color: #d1d5db;
    }
    
    .tag {
      background: #1e3a8a;
      color: #bfdbfe;
    }
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .game-list-page {
      padding: 1rem;
    }
    
    .page-header h1 {
      font-size: 2rem;
    }
    
    .filters {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-box {
      min-width: auto;
    }
    
    .filter-controls {
      justify-content: space-between;
    }
    
    .games-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
