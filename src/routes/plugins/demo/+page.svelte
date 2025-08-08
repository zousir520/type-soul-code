<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    initializePluginSystem,
    getActivePlugins,
    isPluginActive,
    activatePlugin,
    deactivatePlugin,
    GamePluginAPI
  } from '$lib/plugins/index.js';
  import HeroGame from '$lib/plugins/game/components/HeroGame.svelte';
  import RecommendGames from '$lib/plugins/game/components/RecommendGames.svelte';
  import type { GameConfig } from '$lib/plugins/game/types.js';
  import type { Plugin, PluginManager } from '$lib/plugins/core/types.js';

  // 响应式状态
  let pluginManager = writable<PluginManager | null>(null);
  let activePlugins = writable<Plugin[]>([]);
  let isLoading = writable(true);
  let gamePluginActive = writable(false);
  let heroGame = writable<GameConfig | null>(null);
  let pluginSettings = writable<Record<string, any>>({});

  onMount(async () => {
    try {
      // 初始化插件系统
      const manager = await initializePluginSystem({
        autoLoad: true,
        enableHotReload: true
      });
      
      $pluginManager = manager;
      
      // 获取活跃插件
      $activePlugins = getActivePlugins();
      
      // 检查游戏插件状态
      $gamePluginActive = GamePluginAPI.isActive();
      
      if ($gamePluginActive) {
        // 加载游戏数据
        await loadGameData();
      }
      
      $isLoading = false;
      
    } catch (error) {
      console.error('Failed to initialize plugin system:', error);
      $isLoading = false;
    }
  });

  async function loadGameData() {
    try {
      // 获取Hero游戏
      const heroGameData = await GamePluginAPI.getHeroGame();
      $heroGame = heroGameData;
      
      // 获取插件设置
      const settings = await GamePluginAPI.getSettings();
      $pluginSettings = settings;
      
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  }

  async function toggleGamePlugin() {
    try {
      if ($gamePluginActive) {
        await GamePluginAPI.deactivate();
        $gamePluginActive = false;
        $heroGame = null;
      } else {
        await GamePluginAPI.activate();
        $gamePluginActive = true;
        await loadGameData();
      }
      
      // 更新活跃插件列表
      $activePlugins = getActivePlugins();
      
    } catch (error) {
      console.error('Failed to toggle game plugin:', error);
    }
  }

  async function updateGameSettings() {
    try {
      const newSettings = {
        ...$pluginSettings,
        enable_hero_game: true,
        enable_recommend_games: true,
        max_recommend_games: 6
      };
      
      await GamePluginAPI.updateSettings(newSettings);
      $pluginSettings = newSettings;
      
      // 重新加载游戏数据
      await loadGameData();
      
    } catch (error) {
      console.error('Failed to update game settings:', error);
    }
  }

  function handleGameSelected(event: CustomEvent<GameConfig>) {
    const game = event.detail;
    console.log('Game selected:', game);
    // 这里可以实现游戏跳转逻辑
  }
</script>

<svelte:head>
  <title>插件系统演示 - tenniszero.org</title>
  <meta name="description" content="tenniszero.org插件系统演示页面，展示游戏插件功能" />
</svelte:head>

<div class="plugin-demo-page">
  <div class="container">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1>🔌 插件系统演示</h1>
      <p>展示tenniszero.org的模块化插件系统，支持动态加载和管理各种功能插件</p>
    </header>

    {#if $isLoading}
      <div class="loading-section">
        <div class="loading-spinner"></div>
        <p>正在初始化插件系统...</p>
      </div>
    {:else}
      <!-- 插件管理面板 -->
      <section class="plugin-management">
        <h2>📦 插件管理</h2>
        
        <div class="plugin-stats">
          <div class="stat-item">
            <span class="stat-label">活跃插件</span>
            <span class="stat-value">{$activePlugins.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">游戏插件</span>
            <span class="stat-value" class:active={$gamePluginActive}>
              {$gamePluginActive ? '已激活' : '未激活'}
            </span>
          </div>
        </div>

        <div class="plugin-controls">
          <button 
            class="plugin-btn"
            class:active={$gamePluginActive}
            onclick={toggleGamePlugin}
          >
            {$gamePluginActive ? '停用游戏插件' : '激活游戏插件'}
          </button>
          
          {#if $gamePluginActive}
            <button class="plugin-btn secondary" onclick={updateGameSettings}>
              更新设置
            </button>
          {/if}
        </div>

        <!-- 活跃插件列表 -->
        {#if $activePlugins.length > 0}
          <div class="active-plugins">
            <h3>活跃插件列表</h3>
            <div class="plugin-list">
              {#each $activePlugins as plugin}
                <div class="plugin-item">
                  <div class="plugin-info">
                    <h4>{plugin.metadata.name}</h4>
                    <p>{plugin.metadata.description}</p>
                    <div class="plugin-meta">
                      <span class="version">v{plugin.metadata.version}</span>
                      <span class="author">by {plugin.metadata.author}</span>
                    </div>
                  </div>
                  <div class="plugin-status">
                    <span class="status-badge active">活跃</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </section>

      <!-- 游戏插件演示 -->
      {#if $gamePluginActive}
        <section class="game-plugin-demo">
          <h2>🎮 游戏插件演示</h2>
          
          <!-- Hero游戏区域 -->
          {#if $heroGame}
            <div class="hero-game-section">
              <h3>Hero区域游戏</h3>
              <div class="hero-game-wrapper">
                <HeroGame 
                  gameConfig={$heroGame}
                  showControls={true}
                  showInfo={true}
                  autoLoad={true}
                />
              </div>
            </div>
          {/if}

          <!-- 推荐游戏区域 -->
          <div class="recommend-games-section">
            <h3>推荐游戏</h3>
            <div class="recommend-games-wrapper">
              <RecommendGames 
                maxGames={6}
                showThumbnails={true}
                showRatings={true}
                showPlayCounts={true}
                layout="grid"
                on:gameSelected={handleGameSelected}
              />
            </div>
          </div>
        </section>
      {:else}
        <section class="plugin-inactive">
          <div class="inactive-message">
            <h2>🎮 游戏插件未激活</h2>
            <p>激活游戏插件以查看Hero游戏和推荐游戏功能</p>
            <button class="activate-btn" onclick={toggleGamePlugin}>
              激活游戏插件
            </button>
          </div>
        </section>
      {/if}

      <!-- 插件设置 -->
      {#if $gamePluginActive && $pluginSettings}
        <section class="plugin-settings">
          <h2>⚙️ 插件设置</h2>
          <div class="settings-grid">
            <div class="setting-item">
              <label id="hero-game-label">启用Hero游戏</label>
              <span class="setting-value" aria-labelledby="hero-game-label">
                {$pluginSettings.enable_hero_game ? '是' : '否'}
              </span>
            </div>
            <div class="setting-item">
              <label id="recommend-games-label">启用推荐游戏</label>
              <span class="setting-value" aria-labelledby="recommend-games-label">
                {$pluginSettings.enable_recommend_games ? '是' : '否'}
              </span>
            </div>
            <div class="setting-item">
              <label id="max-recommend-games-label">最大推荐游戏数</label>
              <span class="setting-value" aria-labelledby="max-recommend-games-label">{$pluginSettings.max_recommend_games}</span>
            </div>
            <div class="setting-item">
              <label id="default-iframe-width-label">默认iframe宽度</label>
              <span class="setting-value" aria-labelledby="default-iframe-width-label">{$pluginSettings.default_iframe_width}</span>
            </div>
            <div class="setting-item">
              <label id="default-iframe-height-label">默认iframe高度</label>
              <span class="setting-value" aria-labelledby="default-iframe-height-label">{$pluginSettings.default_iframe_height}</span>
            </div>
            <div class="setting-item">
              <label id="lazy-load-games-label">懒加载游戏</label>
              <span class="setting-value" aria-labelledby="lazy-load-games-label">
                {$pluginSettings.lazy_load_games ? '是' : '否'}
              </span>
            </div>
          </div>
        </section>
      {/if}

      <!-- 技术说明 -->
      <section class="tech-info">
        <h2>🔧 技术说明</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <h3>插件架构</h3>
            <ul>
              <li>模块化设计，支持动态加载</li>
              <li>生命周期管理（安装、激活、停用、卸载）</li>
              <li>依赖管理和版本控制</li>
              <li>钩子和过滤器系统</li>
            </ul>
          </div>
          <div class="tech-item">
            <h3>游戏插件特性</h3>
            <ul>
              <li>Hero区域iframe游戏嵌入</li>
              <li>推荐游戏列表展示</li>
              <li>CMS后台管理集成</li>
              <li>游戏分析和统计</li>
            </ul>
          </div>
          <div class="tech-item">
            <h3>安全特性</h3>
            <ul>
              <li>iframe沙箱隔离</li>
              <li>域名白名单验证</li>
              <li>CSP内容安全策略</li>
              <li>插件权限控制</li>
            </ul>
          </div>
          <div class="tech-item">
            <h3>性能优化</h3>
            <ul>
              <li>按需加载插件代码</li>
              <li>游戏内容懒加载</li>
              <li>缓存策略优化</li>
              <li>错误处理和恢复</li>
            </ul>
          </div>
        </div>
      </section>
    {/if}
  </div>
</div>

<style>
  .plugin-demo-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
  }

  .page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .page-header p {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }

  .loading-section {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 0.5rem;
  }

  .plugin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-item {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  .stat-value.active {
    color: #28a745;
  }

  .plugin-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .plugin-btn {
    background: #667eea;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .plugin-btn:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }

  .plugin-btn.active {
    background: #28a745;
  }

  .plugin-btn.secondary {
    background: #6c757d;
  }

  .plugin-btn.secondary:hover {
    background: #5a6268;
  }

  .plugin-list {
    display: grid;
    gap: 1rem;
  }

  .plugin-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid #667eea;
  }

  .plugin-info h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .plugin-info p {
    margin: 0 0 0.5rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  .plugin-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #999;
  }

  .status-badge {
    background: #28a745;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .hero-game-wrapper,
  .recommend-games-wrapper {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .inactive-message {
    text-align: center;
    padding: 3rem;
  }

  .inactive-message h2 {
    color: #666;
    margin-bottom: 1rem;
  }

  .inactive-message p {
    color: #999;
    margin-bottom: 2rem;
  }

  .activate-btn {
    background: #28a745;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s;
  }

  .activate-btn:hover {
    background: #218838;
    transform: translateY(-1px);
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .setting-item label {
    font-weight: 500;
    color: #333;
  }

  .setting-value {
    color: #667eea;
    font-weight: bold;
  }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .tech-item {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }

  .tech-item h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .tech-item ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tech-item li {
    padding: 0.5rem 0;
    color: #666;
    border-bottom: 1px solid #e9ecef;
    position: relative;
    padding-left: 1.5rem;
  }

  .tech-item li:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #28a745;
    font-weight: bold;
  }

  .tech-item li:last-child {
    border-bottom: none;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .plugin-demo-page {
      padding: 1rem 0;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    section {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .plugin-controls {
      flex-direction: column;
    }

    .plugin-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .settings-grid,
    .tech-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
