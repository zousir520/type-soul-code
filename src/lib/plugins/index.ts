// 插件系统入口文件

import { PluginManager } from './core/PluginManager.js';
import { GamePlugin } from './game/GamePlugin.js';
import type { PluginManagerConfig } from './core/types.js';

// 创建全局插件管理器实例
let pluginManagerInstance: PluginManager | null = null;

/**
 * 获取插件管理器实例（单例模式）
 */
export function getPluginManager(config?: Partial<PluginManagerConfig>): PluginManager {
  if (!pluginManagerInstance) {
    const defaultConfig: PluginManagerConfig = {
      pluginsDir: './plugins',
      autoLoad: true,
      enableHotReload: false,
      maxConcurrentLoads: 5,
      cacheEnabled: true,
      securityMode: 'moderate'
    };

    pluginManagerInstance = new PluginManager({
      ...defaultConfig,
      ...config
    });
  }

  return pluginManagerInstance;
}

/**
 * 初始化插件系统
 */
export async function initializePluginSystem(config?: Partial<PluginManagerConfig>): Promise<PluginManager> {
  const manager = getPluginManager(config);

  try {
    console.log('🔌 Initializing plugin system...');

    // 注册内置插件
    await registerBuiltinPlugins(manager);

    // 加载已安装的插件
    await loadInstalledPlugins(manager);

    console.log('✅ Plugin system initialized successfully');
    
    return manager;
  } catch (error) {
    console.error('❌ Failed to initialize plugin system:', error);
    throw error;
  }
}

/**
 * 注册内置插件
 */
async function registerBuiltinPlugins(manager: PluginManager): Promise<void> {
  const builtinPlugins = [
    new GamePlugin()
  ];

  for (const plugin of builtinPlugins) {
    try {
      await manager.install(plugin);
      console.log(`📦 Installed builtin plugin: ${plugin.metadata.name}`);
    } catch (error) {
      console.error(`❌ Failed to install builtin plugin ${plugin.metadata.name}:`, error);
    }
  }
}

/**
 * 加载已安装的插件
 */
async function loadInstalledPlugins(manager: PluginManager): Promise<void> {
  try {
    const installedPlugins = manager.getInstalledPlugins();
    
    for (const plugin of installedPlugins) {
      try {
        if (!manager.isActive(plugin.metadata.id)) {
          // 这里可以根据配置决定是否自动激活
          // await manager.activate(plugin.metadata.id);
          console.log(`📋 Plugin available: ${plugin.metadata.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to activate plugin ${plugin.metadata.name}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Failed to load installed plugins:', error);
  }
}

/**
 * 获取活跃的插件列表
 */
export function getActivePlugins(): any[] {
  const manager = getPluginManager();
  return manager.getActivePlugins();
}

/**
 * 检查插件是否激活
 */
export function isPluginActive(pluginId: string): boolean {
  const manager = getPluginManager();
  return manager.isActive(pluginId);
}

/**
 * 激活插件
 */
export async function activatePlugin(pluginId: string): Promise<void> {
  const manager = getPluginManager();
  await manager.activate(pluginId);
}

/**
 * 停用插件
 */
export async function deactivatePlugin(pluginId: string): Promise<void> {
  const manager = getPluginManager();
  await manager.deactivate(pluginId);
}

/**
 * 获取插件的CMS集合
 */
export function getPluginCMSCollections(): any[] {
  const manager = getPluginManager();
  return manager.getCMSCollections();
}

/**
 * 获取插件的CMS页面
 */
export function getPluginCMSPages(): any[] {
  const manager = getPluginManager();
  return manager.getCMSPages();
}

/**
 * 运行插件钩子
 */
export async function runPluginHook(hookName: string, ...args: any[]): Promise<any[]> {
  const manager = getPluginManager();
  return await manager.runHook(hookName, ...args);
}

/**
 * 应用插件过滤器
 */
export function applyPluginFilter(filterName: string, value: any, ...args: any[]): any {
  const manager = getPluginManager();
  return manager.applyFilter(filterName, value, ...args);
}

/**
 * 获取插件设置
 */
export async function getPluginSettings(pluginId: string): Promise<any> {
  const manager = getPluginManager();
  return await manager.getPluginSettings(pluginId);
}

/**
 * 更新插件设置
 */
export async function updatePluginSettings(pluginId: string, settings: any): Promise<void> {
  const manager = getPluginManager();
  await manager.updatePluginSettings(pluginId, settings);
}

/**
 * 游戏插件相关的便捷函数
 */
export const GamePluginAPI = {
  /**
   * 检查游戏插件是否激活
   */
  isActive(): boolean {
    return isPluginActive('vibby-game-plugin');
  },

  /**
   * 激活游戏插件
   */
  async activate(): Promise<void> {
    await activatePlugin('vibby-game-plugin');
  },

  /**
   * 停用游戏插件
   */
  async deactivate(): Promise<void> {
    await deactivatePlugin('vibby-game-plugin');
  },

  /**
   * 获取游戏插件设置
   */
  async getSettings(): Promise<any> {
    return await getPluginSettings('vibby-game-plugin');
  },

  /**
   * 更新游戏插件设置
   */
  async updateSettings(settings: any): Promise<void> {
    await updatePluginSettings('vibby-game-plugin', settings);
  },

  /**
   * 获取Hero游戏配置
   */
  async getHeroGame(): Promise<any> {
    // 这里应该调用实际的API获取Hero游戏
    const settings = await this.getSettings();
    if (!settings.enable_hero_game) {
      return null;
    }
    
    // 模拟返回Hero游戏配置
    return {
      id: 'hero_game_1',
      name: '2048',
      type: 'homegame',
      iframe_url: 'https://play2048.co/',
      iframe_width: '100%',
      iframe_height: '600px',
      is_active: true,
      description: '经典的数字合并益智游戏',
      category: 'puzzle',
      tags: ['puzzle', 'casual'],
      rating: 4.5
    };
  },

  /**
   * 获取推荐游戏列表
   */
  async getRecommendGames(limit: number = 6): Promise<any[]> {
    const settings = await this.getSettings();
    if (!settings.enable_recommend_games) {
      return [];
    }
    
    // 这里应该调用实际的API获取推荐游戏
    // 模拟返回推荐游戏列表
    return [
      {
        id: 'game_1',
        name: '2048',
        type: 'recommendgame',
        iframe_url: 'https://play2048.co/',
        thumbnail: 'https://via.placeholder.com/300x200?text=2048',
        description: '经典的数字合并益智游戏',
        category: 'puzzle',
        rating: 4.5,
        play_count: 1250
      },
      {
        id: 'game_2',
        name: 'Tetris',
        type: 'recommendgame',
        iframe_url: 'https://tetris.com/play-tetris',
        thumbnail: 'https://via.placeholder.com/300x200?text=Tetris',
        description: '经典俄罗斯方块游戏',
        category: 'puzzle',
        rating: 4.8,
        play_count: 2100
      }
    ].slice(0, limit);
  }
};

// 导出类型
export type { 
  Plugin, 
  PluginManager as IPluginManager, 
  PluginManagerConfig,
  CMSCollection,
  CMSPage,
  PluginComponent,
  PluginRoute
} from './core/types.js';

export type {
  GameConfig,
  GamePluginSettings,
  GameDisplayOptions
} from './game/types.js';

// 导出核心类
export { PluginManager } from './core/PluginManager.js';
export { PluginRegistry } from './core/PluginRegistry.js';
export { PluginStorage } from './core/PluginStorage.js';
export { PluginLoader } from './core/PluginLoader.js';

// 导出游戏插件
export { GamePlugin } from './game/GamePlugin.js';

// 默认导出插件管理器获取函数
export default getPluginManager;
