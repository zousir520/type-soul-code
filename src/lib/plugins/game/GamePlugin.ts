import type { 
  Plugin, 
  PluginMetadata, 
  CMSCollection, 
  CMSPage, 
  PluginComponent, 
  PluginRoute,
  PluginSettings 
} from '../core/types.js';
import type { 
  GamePluginSettings, 
  GameConfig, 
  GameSecurityPolicy,
  GamePerformanceConfig 
} from './types.js';

/**
 * 游戏插件 - 支持在网站中嵌入和管理游戏
 */
export class GamePlugin implements Plugin {
  metadata: PluginMetadata = {
    id: 'vibby-game-plugin',
    name: 'Game Plugin',
    version: '1.0.0',
    description: '支持在网站中嵌入iframe游戏，包括首页Hero区域游戏和推荐游戏列表',
    author: 'tenniszero.org Team',
    homepage: 'https://tenniszero.org/plugins/game',
    repository: 'https://github.com/vibby-ai/game-plugin',
    license: 'MIT',
    keywords: ['game', 'iframe', 'entertainment', 'cms'],
    dependencies: {},
    peerDependencies: {
      'svelte': '^4.0.0 || ^5.0.0'
    }
  };

  private settings: GamePluginSettings = {
    // 功能开关
    enable_hero_game: true,
    enable_recommend_games: true,
    
    // 显示设置
    max_recommend_games: 6,
    show_game_thumbnails: true,
    show_game_ratings: true,
    show_play_counts: true,
    
    // 默认iframe设置
    default_iframe_width: '100%',
    default_iframe_height: '600px',
    default_iframe_sandbox: 'allow-scripts allow-same-origin allow-forms',
    
    // 安全设置
    allowed_domains: [],
    enable_csp: true,
    
    // 样式设置
    hero_game_container_class: 'hero-game-container',
    recommend_games_container_class: 'recommend-games-container',
    game_item_class: 'game-item',
    
    // 性能设置
    lazy_load_games: true,
    preload_hero_game: true,
    cache_duration: 300000 // 5分钟
  };

  // 生命周期钩子
  async onInstall(): Promise<void> {
    console.log('Installing Game Plugin...');
    
    // 创建必要的数据库表
    await this.createDatabaseTables();
    
    // 初始化默认游戏数据
    await this.initializeDefaultGames();
    
    console.log('Game Plugin installed successfully');
  }

  async onActivate(): Promise<void> {
    console.log('Activating Game Plugin...');
    
    // 注册事件监听器
    this.registerEventListeners();
    
    // 初始化游戏缓存
    await this.initializeCache();
    
    console.log('Game Plugin activated successfully');
  }

  async onDeactivate(): Promise<void> {
    console.log('Deactivating Game Plugin...');
    
    // 清理事件监听器
    this.unregisterEventListeners();
    
    // 清理缓存
    await this.clearCache();
    
    console.log('Game Plugin deactivated successfully');
  }

  async onUninstall(): Promise<void> {
    console.log('Uninstalling Game Plugin...');
    
    // 清理数据库表（可选，根据需求决定）
    // await this.dropDatabaseTables();
    
    console.log('Game Plugin uninstalled successfully');
  }

  async onUpdate(oldVersion: string, newVersion: string): Promise<void> {
    console.log(`Updating Game Plugin from ${oldVersion} to ${newVersion}...`);
    
    // 执行数据迁移
    await this.migrate(oldVersion, newVersion);
    
    console.log('Game Plugin updated successfully');
  }

  // CMS集成
  getCMSCollections(): CMSCollection[] {
    return [
      {
        name: 'games',
        label: '游戏管理',
        description: '管理网站中的游戏内容',
        fields: [
          {
            name: 'name',
            type: 'string',
            label: '游戏名称',
            required: true,
            validation: {
              min: 1,
              max: 100
            }
          },
          {
            name: 'type',
            type: 'select',
            label: '游戏类型',
            required: true,
            options: [
              { value: 'homegame', label: '首页Hero游戏' },
              { value: 'recommendgame', label: '推荐游戏' }
            ]
          },
          {
            name: 'iframe_url',
            type: 'url',
            label: 'iframe URL',
            description: '游戏的iframe嵌入地址',
            required: true,
            validation: {
              pattern: '^https?://.+'
            }
          },
          {
            name: 'iframe_width',
            type: 'string',
            label: '宽度',
            default: '100%',
            description: '游戏iframe的宽度（如：100%, 800px）'
          },
          {
            name: 'iframe_height',
            type: 'string',
            label: '高度',
            default: '600px',
            description: '游戏iframe的高度（如：600px, 50vh）'
          },
          {
            name: 'thumbnail',
            type: 'url',
            label: '缩略图',
            description: '游戏的预览图片URL'
          },
          {
            name: 'description',
            type: 'text',
            label: '游戏描述',
            validation: {
              max: 500
            }
          },
          {
            name: 'category',
            type: 'string',
            label: '游戏分类',
            description: '如：动作、益智、休闲等'
          },
          {
            name: 'tags',
            type: 'multiselect',
            label: '标签',
            options: [
              { value: 'action', label: '动作' },
              { value: 'puzzle', label: '益智' },
              { value: 'casual', label: '休闲' },
              { value: 'strategy', label: '策略' },
              { value: 'arcade', label: '街机' },
              { value: 'sports', label: '体育' }
            ]
          },
          {
            name: 'rating',
            type: 'number',
            label: '评分',
            description: '游戏评分（1-5分）',
            validation: {
              min: 1,
              max: 5
            }
          },
          {
            name: 'is_active',
            type: 'boolean',
            label: '启用状态',
            default: true
          },
          {
            name: 'display_order',
            type: 'number',
            label: '显示顺序',
            description: '数字越小越靠前',
            default: 0
          }
        ],
        permissions: {
          create: true,
          read: true,
          update: true,
          delete: true
        },
        hooks: {
          beforeCreate: async (data) => {
            // 验证游戏URL安全性
            await this.validateGameUrl(data.iframe_url);
            return data;
          },
          afterCreate: async (data) => {
            // 清理缓存
            await this.clearGameCache();
          },
          beforeUpdate: async (data) => {
            if (data.iframe_url) {
              await this.validateGameUrl(data.iframe_url);
            }
            return data;
          },
          afterUpdate: async (data) => {
            await this.clearGameCache();
          },
          afterDelete: async (id) => {
            await this.clearGameCache();
          }
        }
      },
      {
        name: 'game_categories',
        label: '游戏分类',
        description: '管理游戏分类',
        fields: [
          {
            name: 'name',
            type: 'string',
            label: '分类名称',
            required: true
          },
          {
            name: 'description',
            type: 'text',
            label: '分类描述'
          },
          {
            name: 'icon',
            type: 'string',
            label: '图标',
            description: '图标类名或URL'
          },
          {
            name: 'color',
            type: 'string',
            label: '颜色',
            description: '分类主题色（如：#FF5722）'
          },
          {
            name: 'is_active',
            type: 'boolean',
            label: '启用状态',
            default: true
          },
          {
            name: 'display_order',
            type: 'number',
            label: '显示顺序',
            default: 0
          }
        ]
      }
    ];
  }

  getCMSPages(): CMSPage[] {
    return [
      {
        name: 'game-settings',
        label: '游戏设置',
        description: '配置游戏插件的全局设置',
        component: 'GameSettingsPage',
        route: '/admin/plugins/game/settings',
        permissions: ['admin', 'plugin_manager']
      },
      {
        name: 'game-analytics',
        label: '游戏分析',
        description: '查看游戏使用统计和分析数据',
        component: 'GameAnalyticsPage',
        route: '/admin/plugins/game/analytics',
        permissions: ['admin', 'plugin_manager', 'analyst']
      }
    ];
  }

  // 前端组件
  getComponents(): PluginComponent[] {
    return [
      {
        name: 'HeroGame',
        component: () => import('./components/HeroGame.svelte'),
        slot: 'hero-content',
        priority: 10
      },
      {
        name: 'RecommendGames',
        component: () => import('./components/RecommendGames.svelte'),
        slot: 'sidebar',
        priority: 5
      },
      {
        name: 'GameWidget',
        component: () => import('./components/GameWidget.svelte'),
        slot: 'widget',
        priority: 1
      }
    ];
  }

  // 路由
  getRoutes(): PluginRoute[] {
    return [
      {
        path: '/games',
        component: () => import('./pages/GameListPage.svelte'),
        preload: async () => {
          // 预加载游戏数据
          return {
            games: await this.getGames()
          };
        }
      },
      {
        path: '/games/[id]',
        component: () => import('./pages/GameDetailPage.svelte'),
        preload: async ({ params }) => {
          return {
            game: await this.getGame(params.id)
          };
        }
      }
    ];
  }

  // 设置管理
  getDefaultSettings(): PluginSettings {
    return this.settings;
  }

  validateSettings(settings: PluginSettings): boolean | string {
    const gameSettings = settings as GamePluginSettings;
    
    if (gameSettings.max_recommend_games < 1 || gameSettings.max_recommend_games > 20) {
      return 'max_recommend_games must be between 1 and 20';
    }
    
    if (gameSettings.cache_duration < 0) {
      return 'cache_duration must be non-negative';
    }
    
    return true;
  }

  // 数据迁移
  async migrate(fromVersion: string, toVersion: string): Promise<void> {
    console.log(`Migrating Game Plugin from ${fromVersion} to ${toVersion}`);
    
    // 根据版本执行相应的迁移逻辑
    if (fromVersion === '1.0.0' && toVersion === '1.1.0') {
      // 添加新字段
      await this.addNewFields();
    }
  }

  // 私有方法
  private async createDatabaseTables(): Promise<void> {
    // 这里应该创建游戏相关的数据库表
    // 实际实现中会使用Supabase或其他数据库
    console.log('Creating game database tables...');
  }

  private async initializeDefaultGames(): Promise<void> {
    // 初始化一些默认游戏
    const defaultGames: Partial<GameConfig>[] = [
      {
        name: '2048',
        type: 'homegame',
        iframe_url: 'https://play2048.co/',
        description: '经典的数字合并益智游戏',
        category: 'puzzle',
        tags: ['puzzle', 'casual'],
        rating: 4.5,
        is_active: true,
        display_order: 1
      }
    ];

    // 保存默认游戏到数据库
    for (const game of defaultGames) {
      await this.createGame(game);
    }
  }

  private registerEventListeners(): void {
    // 注册游戏相关的事件监听器
    console.log('Registering game event listeners...');
  }

  private unregisterEventListeners(): void {
    // 注销事件监听器
    console.log('Unregistering game event listeners...');
  }

  private async initializeCache(): Promise<void> {
    // 初始化游戏缓存
    console.log('Initializing game cache...');
  }

  private async clearCache(): Promise<void> {
    // 清理缓存
    console.log('Clearing game cache...');
  }

  private async clearGameCache(): Promise<void> {
    // 清理游戏相关缓存
    console.log('Clearing game cache...');
  }

  private async validateGameUrl(url: string): Promise<void> {
    // 验证游戏URL的安全性
    if (!url.startsWith('https://')) {
      throw new Error('Game URL must use HTTPS');
    }
    
    // 检查域名白名单
    if (this.settings.allowed_domains.length > 0) {
      const domain = new URL(url).hostname;
      if (!this.settings.allowed_domains.includes(domain)) {
        throw new Error(`Domain ${domain} is not in the allowed list`);
      }
    }
  }

  private async addNewFields(): Promise<void> {
    // 添加新字段的迁移逻辑
    console.log('Adding new fields to game tables...');
  }

  // 游戏API方法
  private async getGames(): Promise<GameConfig[]> {
    // 从数据库获取游戏列表
    // 这里是示例实现
    return [];
  }

  private async getGame(id: string): Promise<GameConfig | null> {
    // 从数据库获取单个游戏
    return null;
  }

  private async createGame(game: Partial<GameConfig>): Promise<GameConfig> {
    // 创建新游戏
    const newGame: GameConfig = {
      id: `game_${Date.now()}`,
      name: game.name || '',
      type: game.type || 'recommendgame',
      iframe_url: game.iframe_url || '',
      iframe_width: game.iframe_width || this.settings.default_iframe_width,
      iframe_height: game.iframe_height || this.settings.default_iframe_height,
      is_active: game.is_active ?? true,
      display_order: game.display_order || 0,
      thumbnail: game.thumbnail || '',
      description: game.description || '',
      category: game.category || '',
      tags: game.tags || [],
      rating: game.rating || 0,
      play_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 保存到数据库
    console.log('Creating game:', newGame);
    
    return newGame;
  }
}
