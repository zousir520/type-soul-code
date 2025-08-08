<script lang="ts">
  import type { GameConfig } from '../types.js';
  
  // Props
  let { game }: { game: GameConfig | null } = $props();
  
  // State
  let loading = $state(false);
  let error = $state<string | null>(null);
  
  // 如果没有游戏数据，显示错误
  if (!game) {
    error = '游戏不存在';
  }
</script>

<svelte:head>
  {#if game}
    <title>{game.name} - 游戏详情</title>
    <meta name="description" content={game.description || `玩 ${game.name} 游戏`} />
  {/if}
</svelte:head>

<div class="game-detail-page">
  {#if error}
    <div class="error-container">
      <h1>错误</h1>
      <p>{error}</p>
      <a href="/games" class="back-link">返回游戏列表</a>
    </div>
  {:else if game}
    <div class="game-header">
      <h1>{game.name}</h1>
      {#if game.description}
        <p class="game-description">{game.description}</p>
      {/if}
      
      <div class="game-meta">
        {#if game.category}
          <span class="category">分类: {game.category}</span>
        {/if}
        {#if game.rating}
          <span class="rating">评分: {game.rating}/5</span>
        {/if}
      </div>
    </div>
    
    <div class="game-container">
      {#if loading}
        <div class="loading">加载中...</div>
      {/if}
      
      <iframe
        src={game.iframe_url}
        width={game.iframe_width || '100%'}
        height={game.iframe_height || '600px'}
        frameborder="0"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-forms"
        title={game.name}
        onload={() => loading = false}
        onerror={() => {
          loading = false;
          error = '游戏加载失败';
        }}
      ></iframe>
    </div>
    
    {#if game.tags && game.tags.length > 0}
      <div class="game-tags">
        <h3>标签</h3>
        <div class="tags">
          {#each game.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .game-detail-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .error-container {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .error-container h1 {
    color: #ef4444;
    margin-bottom: 1rem;
  }
  
  .back-link {
    color: #3b82f6;
    text-decoration: none;
    margin-top: 1rem;
    display: inline-block;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  .game-header {
    margin-bottom: 2rem;
  }
  
  .game-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  .game-description {
    font-size: 1.125rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
  
  .game-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .category, .rating {
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #374151;
  }
  
  .game-container {
    position: relative;
    margin-bottom: 2rem;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 1rem 2rem;
    border-radius: 0.375rem;
    z-index: 10;
  }
  
  iframe {
    width: 100%;
    min-height: 600px;
    border: none;
  }
  
  .game-tags {
    margin-top: 2rem;
  }
  
  .game-tags h3 {
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .tag {
    background: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
  }
  
  /* 深色模式支持 */
  @media (prefers-color-scheme: dark) {
    .game-header h1 {
      color: #f9fafb;
    }
    
    .game-description {
      color: #9ca3af;
    }
    
    .category, .rating {
      background: #374151;
      color: #d1d5db;
    }
    
    .game-tags h3 {
      color: #f9fafb;
    }
    
    .tag {
      background: #1e3a8a;
      color: #bfdbfe;
    }
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .game-detail-page {
      padding: 1rem;
    }
    
    .game-header h1 {
      font-size: 2rem;
    }
    
    iframe {
      min-height: 400px;
    }
  }
</style>
