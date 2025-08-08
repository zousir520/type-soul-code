<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import type { GameConfig, GameDisplayOptions } from '../types.js';
  
  interface Props {
    gameConfig?: GameConfig | null;
    options?: GameDisplayOptions;
    className?: string;
    showControls?: boolean;
    showInfo?: boolean;
    autoLoad?: boolean;
  }

  let {
    gameConfig = null,
    options = {},
    className = '',
    showControls = true,
    showInfo = true,
    autoLoad = true
  }: Props = $props();

  // 响应式状态
  let isLoading = writable(true);
  let hasError = writable(false);
  let errorMessage = writable('');
  let isFullscreen = writable(false);
  let playCount = writable(0);
  
  // DOM引用
  let iframeContainer: HTMLDivElement;
  let iframe: HTMLIFrameElement;
  
  // 游戏状态
  let gameLoaded = false;
  let startTime: number;
  let sessionId: string;

  // 默认配置
  const defaultOptions: GameDisplayOptions = {
    width: '100%',
    height: '600px',
    autoplay: false,
    controls: true,
    loading: 'lazy',
    sandbox: 'allow-scripts allow-same-origin allow-forms',
    allow: 'fullscreen; gamepad; microphone; camera',
    ...options
  };

  onMount(() => {
    sessionId = generateSessionId();
    
    if (autoLoad && gameConfig) {
      loadGame();
    }
    
    // 监听全屏事件
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  });

  onDestroy(() => {
    // 清理事件监听器
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // 记录游戏会话结束
    if (gameLoaded && startTime) {
      recordGameEvent('game:exit', {
        duration: Date.now() - startTime
      });
    }
  });

  // 加载游戏
  async function loadGame() {
    if (!gameConfig) return;
    
    try {
      $isLoading = true;
      $hasError = false;
      
      // 验证游戏URL
      if (!isValidGameUrl(gameConfig.iframe_url)) {
        throw new Error('Invalid game URL');
      }
      
      // 记录游戏加载事件
      recordGameEvent('game:loading');
      
      startTime = Date.now();
      
      // 创建iframe
      createIframe();
      
    } catch (error) {
      handleError(error as Error);
    }
  }

  // 创建iframe
  function createIframe() {
    if (!gameConfig || !iframeContainer) return;
    
    // 清理现有iframe
    if (iframe) {
      iframe.remove();
    }
    
    // 创建新iframe
    iframe = document.createElement('iframe');
    iframe.src = gameConfig.iframe_url;
    iframe.width = defaultOptions.width || '100%';
    iframe.height = defaultOptions.height || '600px';
    iframe.loading = defaultOptions.loading || 'lazy';
    iframe.sandbox = defaultOptions.sandbox || '';
    iframe.allow = defaultOptions.allow || '';
    
    // 添加样式类
    iframe.className = `game-iframe ${gameConfig.type} ${className}`;
    
    // 设置iframe属性
    if (gameConfig.iframe_attributes) {
      Object.entries(gameConfig.iframe_attributes).forEach(([key, value]) => {
        iframe.setAttribute(key, value);
      });
    }
    
    // 监听iframe事件
    iframe.onload = handleIframeLoad;
    iframe.onerror = handleIframeError;
    
    // 添加到容器
    iframeContainer.appendChild(iframe);
  }

  // 处理iframe加载完成
  function handleIframeLoad() {
    $isLoading = false;
    gameLoaded = true;
    
    // 记录游戏加载成功事件
    recordGameEvent('game:loaded', {
      loadTime: Date.now() - startTime
    });
    
    // 更新播放次数
    $playCount = (gameConfig?.play_count || 0) + 1;
    updatePlayCount();
  }

  // 处理iframe加载错误
  function handleIframeError(event: string | Event) {
    handleError(new Error('Failed to load game'));
  }

  // 处理错误
  function handleError(error: Error) {
    $isLoading = false;
    $hasError = true;
    $errorMessage = error.message;
    
    console.error('Game loading error:', error);
    
    // 记录错误事件
    recordGameEvent('game:error', {
      error: error.message
    });
  }

  // 全屏切换
  async function toggleFullscreen() {
    if (!iframe) return;
    
    try {
      if (!$isFullscreen) {
        // 进入全屏
        if (iframe.requestFullscreen) {
          await iframe.requestFullscreen();
        } else if ((iframe as any).webkitRequestFullscreen) {
          await (iframe as any).webkitRequestFullscreen();
        } else if ((iframe as any).mozRequestFullScreen) {
          await (iframe as any).mozRequestFullScreen();
        } else if ((iframe as any).msRequestFullscreen) {
          await (iframe as any).msRequestFullscreen();
        }
        
        recordGameEvent('game:fullscreen');
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        
        recordGameEvent('game:exit_fullscreen');
      }
    } catch (error) {
      console.error('Fullscreen toggle error:', error);
    }
  }

  // 处理全屏状态变化
  function handleFullscreenChange() {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    
    $isFullscreen = isCurrentlyFullscreen;
  }

  // 重新加载游戏
  function reloadGame() {
    if (gameConfig) {
      recordGameEvent('game:reload');
      loadGame();
    }
  }

  // 验证游戏URL
  function isValidGameUrl(url: string): boolean {
    try {
      const gameUrl = new URL(url);
      return gameUrl.protocol === 'https:' || gameUrl.protocol === 'http:';
    } catch {
      return false;
    }
  }

  // 生成会话ID
  function generateSessionId(): string {
    return `game_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 记录游戏事件
  function recordGameEvent(eventType: string, data: any = {}) {
    if (!gameConfig) return;
    
    const eventData = {
      gameId: gameConfig.id,
      gameName: gameConfig.name,
      gameType: gameConfig.type,
      eventType,
      sessionId,
      timestamp: new Date(),
      ...data
    };
    
    // 发送到分析服务
    console.log('Game event:', eventData);
    
    // 这里可以集成实际的分析服务
    // analytics.track('game_event', eventData);
  }

  // 更新播放次数
  async function updatePlayCount() {
    if (!gameConfig) return;
    
    try {
      // 这里应该调用API更新数据库中的播放次数
      console.log(`Updating play count for game ${gameConfig.id}`);
    } catch (error) {
      console.error('Failed to update play count:', error);
    }
  }

  // 响应式更新游戏配置
  $effect(() => {
    if (gameConfig && autoLoad) {
      loadGame();
    }
  });
</script>

<div class="hero-game-container {className}" class:loading={$isLoading} class:error={$hasError}>
  {#if gameConfig}
    <!-- 游戏信息 -->
    {#if showInfo}
      <div class="game-info">
        <div class="game-header">
          <h2 class="game-title">{gameConfig.name}</h2>
          {#if gameConfig.rating}
            <div class="game-rating">
              <span class="rating-stars">
                {#each Array(5) as _, i}
                  <span class="star" class:filled={i < Math.floor(gameConfig.rating || 0)}>★</span>
                {/each}
              </span>
              <span class="rating-value">{gameConfig.rating}</span>
            </div>
          {/if}
        </div>
        
        {#if gameConfig.description}
          <p class="game-description">{gameConfig.description}</p>
        {/if}
        
        <div class="game-meta">
          {#if gameConfig.category}
            <span class="game-category">{gameConfig.category}</span>
          {/if}
          {#if $playCount > 0}
            <span class="play-count">已玩 {$playCount} 次</span>
          {/if}
        </div>
      </div>
    {/if}

    <!-- 游戏容器 -->
    <div class="game-wrapper">
      <!-- 控制按钮 -->
      {#if showControls}
        <div class="game-controls">
          <button 
            class="control-btn reload-btn" 
            onclick={reloadGame}
            disabled={$isLoading}
            title="重新加载游戏"
          >
            🔄
          </button>
          
          <button 
            class="control-btn fullscreen-btn" 
            onclick={toggleFullscreen}
            disabled={$isLoading || $hasError}
            title={$isFullscreen ? '退出全屏' : '全屏显示'}
          >
            {$isFullscreen ? '🗗' : '🗖'}
          </button>
        </div>
      {/if}

      <!-- iframe容器 -->
      <div 
        bind:this={iframeContainer}
        class="iframe-container"
        style="width: {defaultOptions.width}; height: {defaultOptions.height};"
      >
        <!-- 加载状态 -->
        {#if $isLoading}
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>正在加载游戏...</p>
          </div>
        {/if}

        <!-- 错误状态 -->
        {#if $hasError}
          <div class="error-overlay">
            <div class="error-icon">⚠️</div>
            <h3>游戏加载失败</h3>
            <p>{$errorMessage}</p>
            <button class="retry-btn" onclick={reloadGame}>重试</button>
          </div>
        {/if}
      </div>
    </div>

    <!-- 游戏标签 -->
    {#if gameConfig.tags && gameConfig.tags.length > 0}
      <div class="game-tags">
        {#each gameConfig.tags as tag}
          <span class="game-tag">{tag}</span>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="no-game">
      <p>暂无游戏配置</p>
    </div>
  {/if}
</div>

<style>
  .hero-game-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .game-info {
    margin-bottom: 1rem;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .game-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
    color: var(--text-primary, #333);
  }

  .game-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
  }

  .game-description {
    color: var(--text-secondary, #666);
    margin: 0.5rem 0;
    line-height: 1.5;
  }

  .game-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
  }

  .game-category {
    background: var(--bg-secondary, #f5f5f5);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .game-wrapper {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .game-controls {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.5rem;
    z-index: 10;
  }

  .control-btn {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .control-btn:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.9);
  }

  .control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .iframe-container {
    position: relative;
    background: var(--bg-secondary, #f5f5f5);
    min-height: 400px;
  }

  :global(.game-iframe) {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  .loading-overlay,
  .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--bg-primary, white);
    z-index: 5;
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

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .error-overlay h3 {
    margin: 0 0 0.5rem 0;
    color: var(--error-color, #dc3545);
  }

  .error-overlay p {
    margin: 0 0 1rem 0;
    color: var(--text-secondary, #666);
    text-align: center;
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

  .game-tags {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .game-tag {
    background: var(--tag-bg, #e9ecef);
    color: var(--tag-color, #495057);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
  }

  .no-game {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary, #666);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .hero-game-container {
      padding: 0.5rem;
    }

    .game-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .game-title {
      font-size: 1.25rem;
    }

    .game-controls {
      position: static;
      justify-content: center;
      margin-bottom: 0.5rem;
    }

    .iframe-container {
      min-height: 300px;
    }
  }
</style>
