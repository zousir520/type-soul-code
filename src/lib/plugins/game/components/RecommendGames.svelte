<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import type { GameConfig, GameFilter, GameSort } from '../types.js';
  
  interface Props {
    maxGames?: number;
    showThumbnails?: boolean;
    showRatings?: boolean;
    showPlayCounts?: boolean;
    showCategories?: boolean;
    className?: string;
    itemClassName?: string;
    layout?: 'grid' | 'list' | 'carousel';
    autoRefresh?: boolean;
    refreshInterval?: number;
  }

  // 创建事件分发器
  const dispatch = createEventDispatcher<{
    gameSelected: GameConfig;
  }>();

  let {
    maxGames = 6,
    showThumbnails = true,
    showRatings = true,
    showPlayCounts = true,
    showCategories = true,
    className = '',
    itemClassName = '',
    layout = 'grid',
    autoRefresh = false,
    refreshInterval = 300000 // 5分钟
  }: Props = $props();

  // 响应式状态
  let games = writable<GameConfig[]>([]);
  let isLoading = writable(true);
  let hasError = writable(false);
  let errorMessage = writable('');
  let selectedCategory = writable<string>('all');
  let categories = writable<string[]>([]);

  // 过滤和排序
  let currentFilter: GameFilter = {
    type: 'recommendgame',
    is_active: true
  };
  
  let currentSort: GameSort = {
    field: 'display_order',
    direction: 'asc'
  };

  // 自动刷新定时器
  let refreshTimer: NodeJS.Timeout | null = null;

  onMount(() => {
    loadRecommendGames();
    
    if (autoRefresh) {
      startAutoRefresh();
    }
    
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  });

  // 加载推荐游戏
  async function loadRecommendGames() {
    try {
      $isLoading = true;
      $hasError = false;
      
      // 应用过滤条件
      const filter: GameFilter = {
        ...currentFilter,
        category: $selectedCategory === 'all' ? undefined : $selectedCategory
      };
      
      // 模拟API调用 - 实际应该调用游戏API
      const gameList = await fetchGames(filter, currentSort, maxGames);
      
      $games = gameList;
      
      // 提取分类
      const uniqueCategories = [...new Set(gameList.map(g => g.category).filter(Boolean))] as string[];
      $categories = ['all', ...uniqueCategories];
      
      $isLoading = false;
      
    } catch (error) {
      handleError(error as Error);
    }
  }

  // 模拟获取游戏数据
  async function fetchGames(filter: GameFilter, sort: GameSort, limit: number): Promise<GameConfig[]> {
    // 这里应该调用实际的API
    // 现在返回模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
    
    const mockGames: GameConfig[] = [
      {
        id: 'game_1',
        name: '2048',
        type: 'recommendgame',
        iframe_url: 'https://play2048.co/',
        iframe_width: '100%',
        iframe_height: '400px',
        is_active: true,
        display_order: 1,
        thumbnail: 'https://via.placeholder.com/300x200?text=2048',
        description: '经典的数字合并益智游戏',
        category: 'puzzle',
        tags: ['puzzle', 'casual'],
        rating: 4.5,
        play_count: 1250,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'game_2',
        name: 'Tetris',
        type: 'recommendgame',
        iframe_url: 'https://tetris.com/play-tetris',
        iframe_width: '100%',
        iframe_height: '400px',
        is_active: true,
        display_order: 2,
        thumbnail: 'https://via.placeholder.com/300x200?text=Tetris',
        description: '经典俄罗斯方块游戏',
        category: 'puzzle',
        tags: ['puzzle', 'classic'],
        rating: 4.8,
        play_count: 2100,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'game_3',
        name: 'Snake',
        type: 'recommendgame',
        iframe_url: 'https://playsnake.org/',
        iframe_width: '100%',
        iframe_height: '400px',
        is_active: true,
        display_order: 3,
        thumbnail: 'https://via.placeholder.com/300x200?text=Snake',
        description: '经典贪吃蛇游戏',
        category: 'arcade',
        tags: ['arcade', 'classic'],
        rating: 4.2,
        play_count: 890,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ];
    
    return mockGames.slice(0, limit);
  }

  // 处理错误
  function handleError(error: Error) {
    $isLoading = false;
    $hasError = true;
    $errorMessage = error.message;
    console.error('Failed to load recommend games:', error);
  }

  // 开始自动刷新
  function startAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    
    refreshTimer = setInterval(() => {
      loadRecommendGames();
    }, refreshInterval);
  }

  // 停止自动刷新
  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  // 选择游戏
  function selectGame(game: GameConfig) {
    // 记录游戏选择事件
    recordGameEvent('game:selected', {
      gameId: game.id,
      gameName: game.name,
      category: game.category
    });
    
    // 使用 Svelte 事件分发器
    dispatch('gameSelected', game);
    
    // 可以在这里实现游戏跳转逻辑
    console.log('Selected game:', game);
  }

  // 切换分类
  function selectCategory(category: string) {
    $selectedCategory = category;
    loadRecommendGames();
  }

  // 刷新游戏列表
  function refreshGames() {
    loadRecommendGames();
  }

  // 记录游戏事件
  function recordGameEvent(eventType: string, data: any = {}) {
    const eventData = {
      eventType,
      timestamp: new Date(),
      source: 'recommend_games',
      ...data
    };
    
    console.log('Game event:', eventData);
    // 这里可以集成实际的分析服务
  }

  // 格式化播放次数
  function formatPlayCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // 响应式更新
  $effect(() => {
    if ($selectedCategory) {
      // 分类变化时重新加载
    }
  });
</script>

<div class="recommend-games-container {className}" class:loading={$isLoading}>
  <!-- 标题和控制 -->
  <div class="games-header">
    <h3 class="games-title">推荐游戏</h3>
    <div class="games-controls">
      <button 
        class="refresh-btn"
        onclick={refreshGames}
        disabled={$isLoading}
        title="刷新游戏列表"
      >
        🔄
      </button>
    </div>
  </div>

  <!-- 分类过滤 -->
  {#if showCategories && $categories.length > 1}
    <div class="category-filter">
      {#each $categories as category}
        <button
          class="category-btn"
          class:active={$selectedCategory === category}
          onclick={() => selectCategory(category)}
        >
          {category === 'all' ? '全部' : category}
        </button>
      {/each}
    </div>
  {/if}

  <!-- 游戏列表 -->
  <div class="games-content">
    {#if $isLoading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载游戏...</p>
      </div>
    {:else if $hasError}
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h4>加载失败</h4>
        <p>{$errorMessage}</p>
        <button class="retry-btn" onclick={refreshGames}>重试</button>
      </div>
    {:else if $games.length === 0}
      <div class="empty-state">
        <div class="empty-icon">🎮</div>
        <h4>暂无游戏</h4>
        <p>当前分类下没有可用的游戏</p>
      </div>
    {:else}
      <div class="games-list {layout}">
        {#each $games as game (game.id)}
          <div
            class="game-item {itemClassName}"
            onclick={() => selectGame(game)}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                selectGame(game);
              }
            }}
            role="button"
            tabindex="0"
          >
            <!-- 游戏缩略图 -->
            {#if showThumbnails && game.thumbnail}
              <div class="game-thumbnail">
                <img 
                  src={game.thumbnail} 
                  alt={game.name}
                  loading="lazy"
                />
                <div class="play-overlay">
                  <div class="play-icon">▶</div>
                </div>
              </div>
            {/if}

            <!-- 游戏信息 -->
            <div class="game-info">
              <h4 class="game-name">{game.name}</h4>
              
              {#if game.description}
                <p class="game-description">{game.description}</p>
              {/if}

              <div class="game-meta">
                <!-- 评分 -->
                {#if showRatings && game.rating}
                  <div class="game-rating">
                    <span class="rating-stars">
                      {#each Array(5) as _, i}
                        <span class="star" class:filled={i < Math.floor(game.rating || 0)}>★</span>
                      {/each}
                    </span>
                    <span class="rating-value">{game.rating}</span>
                  </div>
                {/if}

                <!-- 播放次数 -->
                {#if showPlayCounts && game.play_count}
                  <div class="play-count">
                    <span class="play-icon">🎮</span>
                    <span class="play-number">{formatPlayCount(game.play_count)}</span>
                  </div>
                {/if}

                <!-- 分类 -->
                {#if game.category}
                  <div class="game-category">
                    <span class="category-tag">{game.category}</span>
                  </div>
                {/if}
              </div>

              <!-- 标签 -->
              {#if game.tags && game.tags.length > 0}
                <div class="game-tags">
                  {#each game.tags.slice(0, 3) as tag}
                    <span class="game-tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- 查看更多 -->
  {#if $games.length >= maxGames}
    <div class="games-footer">
      <button class="view-more-btn">查看更多游戏</button>
    </div>
  {/if}
</div>

<style>
  .recommend-games-container {
    width: 100%;
    background: var(--bg-primary, white);
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .games-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .games-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0;
    color: var(--text-primary, #333);
  }

  .games-controls {
    display: flex;
    gap: 0.5rem;
  }

  .refresh-btn {
    background: var(--bg-secondary, #f5f5f5);
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .refresh-btn:hover:not(:disabled) {
    background: var(--bg-tertiary, #e0e0e0);
  }

  .refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .category-filter {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .category-btn {
    background: var(--bg-secondary, #f5f5f5);
    border: none;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
    text-transform: capitalize;
  }

  .category-btn:hover {
    background: var(--bg-tertiary, #e0e0e0);
  }

  .category-btn.active {
    background: var(--primary-color, #007bff);
    color: white;
  }

  .games-content {
    min-height: 200px;
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--border-color, #e0e0e0);
    border-top: 3px solid var(--primary-color, #007bff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-icon,
  .empty-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .error-state h4,
  .empty-state h4 {
    margin: 0.5rem 0;
    color: var(--text-primary, #333);
  }

  .error-state p,
  .empty-state p {
    margin: 0 0 1rem 0;
    color: var(--text-secondary, #666);
  }

  .retry-btn {
    background: var(--primary-color, #007bff);
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .retry-btn:hover {
    background: var(--primary-color-dark, #0056b3);
  }

  .games-list {
    display: grid;
    gap: 1rem;
  }

  .games-list.grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .games-list.list {
    grid-template-columns: 1fr;
  }

  .games-list.carousel {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }

  .game-item {
    background: var(--bg-secondary, #f9f9f9);
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid var(--border-color, #e0e0e0);
  }

  .game-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .game-thumbnail {
    position: relative;
    width: 100%;
    height: 150px;
    overflow: hidden;
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
    color: white;
    font-size: 2rem;
  }

  .game-info {
    padding: 1rem;
  }

  .game-name {
    font-size: 1rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary, #333);
  }

  .game-description {
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .game-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
  }

  .game-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .rating-stars {
    color: #ffd700;
  }

  .star {
    opacity: 0.3;
  }

  .star.filled {
    opacity: 1;
  }

  .rating-value {
    color: var(--text-secondary, #666);
  }

  .play-count {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-secondary, #666);
  }

  .category-tag {
    background: var(--tag-bg, #e9ecef);
    color: var(--tag-color, #495057);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    text-transform: capitalize;
  }

  .game-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .game-tag {
    background: var(--tag-bg-light, #f8f9fa);
    color: var(--tag-color-light, #6c757d);
    padding: 0.2rem 0.4rem;
    border-radius: 0.2rem;
    font-size: 0.7rem;
  }

  .games-footer {
    margin-top: 1rem;
    text-align: center;
  }

  .view-more-btn {
    background: var(--primary-color, #007bff);
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .view-more-btn:hover {
    background: var(--primary-color-dark, #0056b3);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .recommend-games-container {
      padding: 0.75rem;
    }

    .games-list.grid {
      grid-template-columns: 1fr;
    }

    .game-thumbnail {
      height: 120px;
    }

    .game-info {
      padding: 0.75rem;
    }

    .category-filter {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .category-filter::-webkit-scrollbar {
      display: none;
    }
  }
</style>
