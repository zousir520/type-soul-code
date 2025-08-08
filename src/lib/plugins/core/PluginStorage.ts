import type { PluginStorage as IPluginStorage, PluginState, PluginSettings } from './types.js';

/**
 * 插件存储系统 - 管理插件状态和配置的持久化
 */
export class PluginStorage implements IPluginStorage {
  private storageKey = 'vibby_plugins';
  private settingsKey = 'vibby_plugin_settings';
  
  // 内存缓存
  private stateCache: Map<string, PluginState> = new Map();
  private settingsCache: Map<string, PluginSettings> = new Map();
  private cacheLoaded = false;

  constructor() {
    this.loadCache();
  }

  /**
   * 获取插件状态
   */
  async getPluginState(pluginId: string): Promise<PluginState | null> {
    await this.ensureCacheLoaded();
    return this.stateCache.get(pluginId) || null;
  }

  /**
   * 设置插件状态
   */
  async setPluginState(pluginId: string, state: PluginState): Promise<void> {
    await this.ensureCacheLoaded();
    
    this.stateCache.set(pluginId, { ...state });
    await this.persistStates();
  }

  /**
   * 删除插件状态
   */
  async deletePluginState(pluginId: string): Promise<void> {
    await this.ensureCacheLoaded();
    
    this.stateCache.delete(pluginId);
    await this.persistStates();
  }

  /**
   * 获取所有插件状态
   */
  async getAllPluginStates(): Promise<PluginState[]> {
    await this.ensureCacheLoaded();
    return Array.from(this.stateCache.values());
  }

  /**
   * 获取插件设置
   */
  async getPluginSettings(pluginId: string): Promise<PluginSettings> {
    await this.ensureCacheLoaded();
    return this.settingsCache.get(pluginId) || {};
  }

  /**
   * 设置插件设置
   */
  async setPluginSettings(pluginId: string, settings: PluginSettings): Promise<void> {
    await this.ensureCacheLoaded();
    
    this.settingsCache.set(pluginId, { ...settings });
    await this.persistSettings();
  }

  /**
   * 删除插件设置
   */
  async deletePluginSettings(pluginId: string): Promise<void> {
    await this.ensureCacheLoaded();
    
    this.settingsCache.delete(pluginId);
    await this.persistSettings();
  }

  /**
   * 批量更新插件状态
   */
  async batchUpdateStates(updates: Array<{ pluginId: string; state: PluginState }>): Promise<void> {
    await this.ensureCacheLoaded();
    
    for (const { pluginId, state } of updates) {
      this.stateCache.set(pluginId, { ...state });
    }
    
    await this.persistStates();
  }

  /**
   * 批量更新插件设置
   */
  async batchUpdateSettings(updates: Array<{ pluginId: string; settings: PluginSettings }>): Promise<void> {
    await this.ensureCacheLoaded();
    
    for (const { pluginId, settings } of updates) {
      this.settingsCache.set(pluginId, { ...settings });
    }
    
    await this.persistSettings();
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    this.stateCache.clear();
    this.settingsCache.clear();
    
    await Promise.all([
      this.persistStates(),
      this.persistSettings()
    ]);
  }

  /**
   * 导出所有数据
   */
  async exportData(): Promise<{
    states: Record<string, PluginState>;
    settings: Record<string, PluginSettings>;
    exportedAt: string;
  }> {
    await this.ensureCacheLoaded();
    
    const states: Record<string, PluginState> = {};
    const settings: Record<string, PluginSettings> = {};
    
    for (const [pluginId, state] of this.stateCache.entries()) {
      states[pluginId] = { ...state };
    }
    
    for (const [pluginId, pluginSettings] of this.settingsCache.entries()) {
      settings[pluginId] = { ...pluginSettings };
    }
    
    return {
      states,
      settings,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * 导入数据
   */
  async importData(data: {
    states?: Record<string, PluginState>;
    settings?: Record<string, PluginSettings>;
  }): Promise<void> {
    await this.ensureCacheLoaded();
    
    if (data.states) {
      for (const [pluginId, state] of Object.entries(data.states)) {
        this.stateCache.set(pluginId, { ...state });
      }
    }
    
    if (data.settings) {
      for (const [pluginId, settings] of Object.entries(data.settings)) {
        this.settingsCache.set(pluginId, { ...settings });
      }
    }
    
    await Promise.all([
      this.persistStates(),
      this.persistSettings()
    ]);
  }

  /**
   * 获取存储统计信息
   */
  async getStorageStats(): Promise<{
    totalPlugins: number;
    activePlugins: number;
    installedPlugins: number;
    totalSettings: number;
    storageSize: number;
  }> {
    await this.ensureCacheLoaded();
    
    const states = Array.from(this.stateCache.values());
    const totalPlugins = states.length;
    const activePlugins = states.filter(s => s.isActive).length;
    const installedPlugins = states.filter(s => s.isInstalled).length;
    const totalSettings = this.settingsCache.size;
    
    // 估算存储大小
    const statesData = JSON.stringify(Object.fromEntries(this.stateCache));
    const settingsData = JSON.stringify(Object.fromEntries(this.settingsCache));
    const storageSize = new Blob([statesData + settingsData]).size;
    
    return {
      totalPlugins,
      activePlugins,
      installedPlugins,
      totalSettings,
      storageSize
    };
  }

  /**
   * 清理过期数据
   */
  async cleanup(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<number> {
    await this.ensureCacheLoaded();
    
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [pluginId, state] of this.stateCache.entries()) {
      // 清理未安装且过期的插件状态
      if (!state.isInstalled && state.installedAt) {
        const age = now.getTime() - new Date(state.installedAt).getTime();
        if (age > maxAge) {
          this.stateCache.delete(pluginId);
          this.settingsCache.delete(pluginId);
          cleanedCount++;
        }
      }
    }
    
    if (cleanedCount > 0) {
      await Promise.all([
        this.persistStates(),
        this.persistSettings()
      ]);
    }
    
    return cleanedCount;
  }

  /**
   * 备份数据
   */
  async backup(): Promise<string> {
    const data = await this.exportData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * 从备份恢复数据
   */
  async restore(backupData: string): Promise<void> {
    try {
      const data = JSON.parse(backupData);
      await this.importData(data);
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error}`);
    }
  }

  // 私有方法

  /**
   * 确保缓存已加载
   */
  private async ensureCacheLoaded(): Promise<void> {
    if (!this.cacheLoaded) {
      await this.loadCache();
    }
  }

  /**
   * 加载缓存
   */
  private async loadCache(): Promise<void> {
    try {
      // 在浏览器环境中使用localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        await this.loadFromLocalStorage();
      } 
      // 在服务器环境中使用文件系统或数据库
      else {
        await this.loadFromDatabase();
      }
      
      this.cacheLoaded = true;
    } catch (error) {
      console.error('Failed to load plugin storage cache:', error);
      this.cacheLoaded = true; // 即使失败也标记为已加载，避免重复尝试
    }
  }

  /**
   * 从localStorage加载
   */
  private async loadFromLocalStorage(): Promise<void> {
    try {
      const statesData = localStorage.getItem(this.storageKey);
      if (statesData) {
        const states = JSON.parse(statesData);
        for (const [pluginId, state] of Object.entries(states)) {
          this.stateCache.set(pluginId, state as PluginState);
        }
      }

      const settingsData = localStorage.getItem(this.settingsKey);
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        for (const [pluginId, pluginSettings] of Object.entries(settings)) {
          this.settingsCache.set(pluginId, pluginSettings as PluginSettings);
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }

  /**
   * 从数据库加载
   */
  private async loadFromDatabase(): Promise<void> {
    // TODO: 实现数据库加载逻辑
    // 这里可以集成Supabase或其他数据库
    console.log('Database loading not implemented yet');
  }

  /**
   * 持久化状态
   */
  private async persistStates(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = Object.fromEntries(this.stateCache);
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } else {
        await this.persistToDatabase('states');
      }
    } catch (error) {
      console.error('Failed to persist plugin states:', error);
    }
  }

  /**
   * 持久化设置
   */
  private async persistSettings(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = Object.fromEntries(this.settingsCache);
        localStorage.setItem(this.settingsKey, JSON.stringify(data));
      } else {
        await this.persistToDatabase('settings');
      }
    } catch (error) {
      console.error('Failed to persist plugin settings:', error);
    }
  }

  /**
   * 持久化到数据库
   */
  private async persistToDatabase(type: 'states' | 'settings'): Promise<void> {
    // TODO: 实现数据库持久化逻辑
    console.log(`Database persistence for ${type} not implemented yet`);
  }
}
