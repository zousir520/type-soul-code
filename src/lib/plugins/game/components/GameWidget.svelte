<script lang="ts">
  import type { GameConfig } from '../types.js';
  
  // Props
  let { 
    games = [],
    title = '推荐游戏',
    maxGames = 3,
    showThumbnails = true,
    showRatings = true,
    layout = 'vertical'
  }: {
    games: GameConfig[];
    title?: string;
    maxGames?: number;
    showThumbnails?: boolean;
    showRatings?: boolean;
    layout?: 'vertical' | 'horizontal';
  } = $props();
  
  // 过滤和限制游戏数量
  const displayGames = $derived.by(() => {
    return games
      .filter(game => game.is_active)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .slice(0, maxGames);
  });
  
  // 处理游戏点击
  function handleGameClick(game: GameConfig) {
    // 可以添加统计逻辑
    window.open(`/games/${game.id}`, '_blank');
  }
</script>

<div class="game-widget {layout}">
  <div class="widget-header">
    <h3 class="widget-title">{title}</h3>
    {#if games.length > maxGames}
      <a href="/games" class="view-all">查看全部</a>
    {/if}
  </div>
  
  <div class="games-list">
    {#each displayGames as game (game.id)}
      <div 
        class="game-item"
        role="button"
        tabindex="0"
        onclick={() => handleGameClick(game)}
        onkeydown={(e) => e.key === 'Enter' && handleGameClick(game)}
      >
        {#if showThumbnails && game.thumbnail}
          <div class="game-thumbnail">
            <img src={game.thumbnail} alt={game.name} loading="lazy" />
            <div class="play-overlay">
              <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        {/if}
        
        <div class="game-info">
          <h4 class="game-name">{game.name}</h4>
          
          {#if game.description && layout === 'vertical'}
            <p class="game-description">{game.description.slice(0, 60)}...</p>
          {/if}
          
          <div class="game-meta">
            {#if game.category}
              <span class="category">{game.category}</span>
            {/if}
            
            {#if showRatings && game.rating}
              <div class="rating">
                <span class="stars">
                  {#each Array(5) as _, i}
                    <span class="star {i < (game.rating || 0) ? 'filled' : ''}">★</span>
                  {/each}
                </span>
                <span class="rating-value">{game.rating}</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  {#if displayGames.length === 0}
    <div class="no-games">
      <p>暂无可用游戏</p>
    </div>
  {/if}
</div>

<style>
  .game-widget {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .widget-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  .view-all {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .view-all:hover {
    text-decoration: underline;
  }
  
  .games-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .game-widget.horizontal .games-list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .game-widget.horizontal .game-item {
    flex: 0 0 200px;
  }
  
  .game-item {
    display: flex;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }
  
  .game-item:hover {
    background: #f9fafb;
    transform: translateY(-1px);
  }
  
  .game-item:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .game-widget.horizontal .game-item {
    flex-direction: column;
    text-align: center;
  }
  
  .game-thumbnail {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 0.5rem;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .game-widget.horizontal .game-thumbnail {
    width: 100%;
    height: 100px;
  }
  
  .game-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .game-item:hover .play-overlay {
    opacity: 1;
  }
  
  .play-icon {
    width: 24px;
    height: 24px;
    color: white;
  }
  
  .game-info {
    flex: 1;
    min-width: 0;
  }
  
  .game-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .game-description {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }
  
  .game-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .category {
    background: #f3f4f6;
    color: #374151;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.625rem;
    font-weight: 500;
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .stars {
    color: #fbbf24;
    font-size: 0.75rem;
  }
  
  .star.filled {
    color: #f59e0b;
  }
  
  .rating-value {
    font-size: 0.625rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .no-games {
    text-align: center;
    padding: 2rem 1rem;
    color: #9ca3af;
  }
  
  .no-games p {
    margin: 0;
    font-size: 0.875rem;
  }
  
  /* 深色模式支持 */
  @media (prefers-color-scheme: dark) {
    .game-widget {
      background: #1f2937;
    }
    
    .widget-title {
      color: #f9fafb;
    }
    
    .game-item:hover {
      background: #374151;
    }
    
    .game-name {
      color: #f9fafb;
    }
    
    .game-description {
      color: #9ca3af;
    }
    
    .category {
      background: #374151;
      color: #d1d5db;
    }
    
    .rating-value {
      color: #9ca3af;
    }
    
    .no-games {
      color: #6b7280;
    }
  }
  
  /* 响应式设计 */
  @media (max-width: 640px) {
    .game-widget {
      padding: 1rem;
    }
    
    .game-item {
      gap: 0.75rem;
    }
    
    .game-thumbnail {
      width: 50px;
      height: 50px;
    }
    
    .game-name {
      font-size: 0.8125rem;
    }
    
    .game-description {
      display: none;
    }
  }
</style>
